import { createClient } from 'jsr:@supabase/supabase-js@2';

const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

type CreateUserBody = {
    email?: string;
    first_name?: string;
    last_name?: string;
    phone?: string;
};

const jsonResponse = (body: Record<string, unknown>, status: number) =>
    new Response(JSON.stringify(body), {
        status,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

Deno.serve(async (req) => {
    if (req.method === 'OPTIONS') {
        return new Response('ok', { headers: corsHeaders });
    }

    if (req.method !== 'POST') {
        return jsonResponse({ error: 'Method not allowed' }, 405);
    }

    try {
        const supabaseUrl = Deno.env.get('SUPABASE_URL') ?? '';
        const serviceRoleKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '';
        const anonKey = Deno.env.get('SUPABASE_ANON_KEY') ?? '';

        if (!supabaseUrl || !serviceRoleKey || !anonKey) {
            return jsonResponse({ error: 'Server configuration error' }, 500);
        }

        const authHeader = req.headers.get('Authorization');
        if (!authHeader) {
            return jsonResponse({ error: 'Missing authorization' }, 401);
        }

        const supabaseUser = createClient(supabaseUrl, anonKey, {
            global: { headers: { Authorization: authHeader } },
        });
        const supabaseAdmin = createClient(supabaseUrl, serviceRoleKey);

        const {
            data: { user },
            error: userError,
        } = await supabaseUser.auth.getUser();

        if (userError || !user) {
            return jsonResponse({ error: 'Unauthorized' }, 401);
        }

        const { data: callerProfile, error: callerError } = await supabaseAdmin
            .from('Profile')
            .select('is_admin')
            .eq('id', user.id)
            .maybeSingle();

        if (callerError || !callerProfile?.is_admin) {
            return jsonResponse({ error: 'Admin access required' }, 403);
        }

        const body = (await req.json()) as CreateUserBody;
        const email = body.email?.trim().toLowerCase();
        const first_name = body.first_name?.trim();
        const last_name = body.last_name?.trim();
        const phone = body.phone?.trim();

        if (!email || !first_name || !last_name || !phone) {
            return jsonResponse({ error: 'email, first_name, last_name, and phone are required' }, 400);
        }

        const { data: existingProfile } = await supabaseAdmin
            .from('Profile')
            .select('id')
            .eq('email', email)
            .maybeSingle();

        if (existingProfile) {
            return jsonResponse({ error: 'An employee with this email already exists' }, 409);
        }

        const tempPassword = crypto.randomUUID() + crypto.randomUUID();

        const { data: createdUser, error: createError } = await supabaseAdmin.auth.admin.createUser({
            email,
            password: tempPassword,
            email_confirm: true,
            user_metadata: { created_by: user.id },
        });

        if (createError || !createdUser.user) {
            return jsonResponse({ error: createError?.message ?? 'Failed to create auth user' }, 400);
        }

        const { error: profileError } = await supabaseAdmin.from('Profile').insert({
            id: createdUser.user.id,
            email,
            first_name,
            last_name,
            phone,
            is_admin: false,
            is_manager: false,
            is_cashier: false,
            is_deleted: false,
            locale: 'en',
        });

        if (profileError) {
            await supabaseAdmin.auth.admin.deleteUser(createdUser.user.id);
            return jsonResponse({ error: profileError.message }, 400);
        }

        const { error: resetError } = await supabaseAdmin.auth.resetPasswordForEmail(email);
        if (resetError) {
            console.warn('create-user: password reset email failed', resetError.message);
        }

        return jsonResponse(
            {
                id: createdUser.user.id,
                email,
                password_reset_sent: !resetError,
            },
            200,
        );
    } catch (error) {
        const message = error instanceof Error ? error.message : 'Unexpected error';
        return jsonResponse({ error: message }, 500);
    }
});
