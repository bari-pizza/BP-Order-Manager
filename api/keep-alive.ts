export const config = { runtime: 'edge' };

/**
 * Cheap DB touch so free-tier Supabase stays unpaused.
 * Uses each Vercel env's own VITE_SUPABASE_* — no GitHub secrets.
 */
export default async function handler(): Promise<Response> {
    const supabaseUrl = process.env.VITE_SUPABASE_URL;
    const anonKey = process.env.VITE_SUPABASE_ANON_KEY;

    if (!supabaseUrl || !anonKey) {
        return Response.json({ ok: false, error: 'missing_supabase_env' }, { status: 500 });
    }

    const response = await fetch(`${supabaseUrl}/rest/v1/OrderOrigin?select=origin_id&limit=1`, {
        headers: {
            apikey: anonKey,
            Authorization: `Bearer ${anonKey}`,
        },
    });

    if (!response.ok) {
        return Response.json({ ok: false, status: response.status }, { status: 502 });
    }

    return Response.json({ ok: true });
}
