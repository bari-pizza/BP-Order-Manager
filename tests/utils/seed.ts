import { createClient, type SupabaseClient } from '@supabase/supabase-js';
import dayjs from 'dayjs';
import { orderOriginsWithTypes } from './data';
import { getDriverEmails, getTestPassword, TEST_ACCOUNTS, type TestAccount } from './testAccounts';

const REQUIRED_RESOURCE_TITLES = [
    'Bari Pizza',
    'Register',
    'Third Party Pickup',
    'Unassigned Drawer',
    'Missing Avatar',
    'Add Driver',
] as const;

type SeedClient = SupabaseClient;

let seededDriverNames: string[] = [];

export const getSeededDriverNames = () => {
    if (seededDriverNames.length === 0) {
        throw new Error('seedBusinessDate() must run before reading driver names');
    }
    return [...seededDriverNames];
};

const throwIfError = (action: string, error: { message: string } | null) => {
    if (error) {
        throw new Error(`${action}: ${error.message}`);
    }
};

export const todayBusinessDate = () => dayjs().format('YYYY-MM-DD');

const createSeedClient = async (): Promise<SeedClient> => {
    const url = process.env.VITE_SUPABASE_URL;
    const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

    if (!url || !serviceKey) {
        throw new Error(
            'Set VITE_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY in .env. Seed needs the service role to create test users and wipe today\'s orders.',
        );
    }

    return createClient(url, serviceKey, {
        auth: { persistSession: false, autoRefreshToken: false },
    });
};

const displayName = (firstName: string | null, lastName: string | null) =>
    `${firstName ?? ''} ${lastName ?? ''}`.replace(/\s+/g, ' ').trim();

export const wipeBusinessDate = async (businessDate = todayBusinessDate(), client?: SeedClient) => {
    const db = client ?? (await createSeedClient());

    const { data: orders, error: ordersError } = await db
        .from('Order')
        .select('order_id')
        .eq('business_date', businessDate);
    throwIfError(`List orders for ${businessDate}`, ordersError);

    const orderIds = (orders ?? []).map((order) => order.order_id);
    if (orderIds.length > 0) {
        const { error } = await db.from('Payment').delete().in('order_id', orderIds);
        throwIfError(`Wipe Payment for ${businessDate}`, error);
    }

    const tables = ['Order', 'CashTransfer', 'BusinessDayDrawer', 'BusinessDayDriver', 'BusinessDaySummary'] as const;
    for (const table of tables) {
        const { error } = await db.from(table).delete().eq('business_date', businessDate);
        throwIfError(`Wipe ${table} for ${businessDate}`, error);
    }
};

const ensureOrigins = async (client: SeedClient) => {
    const { data: existing, error } = await client.from('OrderOrigin').select('name');
    throwIfError('List order origins', error);

    const names = new Set((existing ?? []).map((origin) => origin.name));
    for (const { origin } of Object.values(orderOriginsWithTypes)) {
        if (names.has(origin.name)) {
            const { error: updateError } = await client
                .from('OrderOrigin')
                .update({
                    can_tip: origin.can_tip,
                    can_deliver: origin.can_deliver,
                    is_third_party: origin.is_third_party,
                    default_is_prepaid: origin.default_is_prepaid,
                    is_prepaid_toggleable: origin.is_prepaid_toggleable,
                    has_order_number: origin.has_order_number,
                })
                .eq('name', origin.name);
            throwIfError(`Update origin flags ${origin.name}`, updateError);
            continue;
        }
        const { error: insertError } = await client.from('OrderOrigin').insert({
            name: origin.name,
            can_tip: origin.can_tip,
            can_deliver: origin.can_deliver,
            icon: origin.icon,
            is_third_party: origin.is_third_party,
            default_is_prepaid: origin.default_is_prepaid,
            is_prepaid_toggleable: origin.is_prepaid_toggleable,
            has_order_number: origin.has_order_number,
            is_deleted: false,
        });
        throwIfError(`Insert origin ${origin.name}`, insertError);
    }

    const { error: othersError } = await client
        .from('OrderOrigin')
        .update({ is_third_party: true })
        .neq('name', 'Bari Pizza');
    throwIfError('Mark non-Bari origins as third party', othersError);
};

const ensureResources = async (client: SeedClient) => {
    const { data: existing, error } = await client.from('Resource').select('title');
    throwIfError('List resources', error);

    const titles = new Set((existing ?? []).map((resource) => resource.title));
    const missing = REQUIRED_RESOURCE_TITLES.filter((title) => !titles.has(title)).map((title) => ({
        title,
        src: '',
        bucket_name: 'resources',
    }));
    if (missing.length === 0) {
        return;
    }

    const { error: insertError } = await client.from('Resource').insert(missing);
    throwIfError('Insert missing resources', insertError);
};

const ensureBaseDrawers = async (client: SeedClient) => {
    const { data: existing, error } = await client.from('Drawer').select('drawer_type');
    throwIfError('List drawers', error);
    const types = new Set((existing ?? []).map((drawer) => drawer.drawer_type));
    const needed = [
        { name: 'Register', drawer_type: 'register' as const },
        { name: 'Third Party', drawer_type: 'third_party' as const },
    ].filter((drawer) => !types.has(drawer.drawer_type));
    if (needed.length === 0) {
        return;
    }
    const { error: insertError } = await client.from('Drawer').insert(needed);
    throwIfError('Insert base drawers', insertError);
};

const listAuthUsers = async (client: SeedClient) => {
    const users: { id: string; email?: string }[] = [];
    for (let page = 1; page <= 20; page += 1) {
        const { data, error } = await client.auth.admin.listUsers({ page, perPage: 200 });
        throwIfError('List auth users', error);
        const batch = data?.users ?? [];
        users.push(...batch);
        if (batch.length < 200) {
            break;
        }
    }
    return users;
};

const ensureAuthUser = async (
    client: SeedClient,
    email: string,
    password: string,
    usersByEmail: Map<string, string>,
) => {
    const existingId = usersByEmail.get(email.toLowerCase());
    if (existingId) {
        const { error } = await client.auth.admin.updateUserById(existingId, {
            password,
            email_confirm: true,
        });
        throwIfError(`Reset password for ${email}`, error);
        return existingId;
    }

    const { data, error } = await client.auth.admin.createUser({
        email,
        password,
        email_confirm: true,
        user_metadata: { seeded_by: 'playwright' },
    });
    throwIfError(`Create auth user ${email}`, error);
    if (!data.user) {
        throw new Error(`Create auth user ${email} returned no user`);
    }
    usersByEmail.set(email.toLowerCase(), data.user.id);
    return data.user.id;
};

const ensureProfile = async (client: SeedClient, userId: string, account: TestAccount) => {
    const fields = {
        email: account.email,
        first_name: account.first_name,
        last_name: account.last_name,
        is_admin: account.is_admin,
        is_manager: account.is_manager,
        is_cashier: false,
        is_deleted: false,
        locale: 'en',
    };

    const { data: existing, error: selectError } = await client.from('Profile').select('*').eq('id', userId).maybeSingle();
    throwIfError(`Load profile ${account.email}`, selectError);

    if (!existing) {
        const { error } = await client.from('Profile').insert({ id: userId, ...fields });
        if (error) {
            const { error: updateError } = await client.from('Profile').update(fields).eq('id', userId);
            throwIfError(`Insert/update profile ${account.email}`, updateError ?? error);
        }
    } else {
        const { error } = await client.from('Profile').update(fields).eq('id', userId);
        throwIfError(`Update profile ${account.email}`, error);
    }

    const { data: profile, error } = await client.from('Profile').select('*').eq('id', userId).single();
    throwIfError(`Reload profile ${account.email}`, error);
    return profile;
};

const ensureDriverFlag = async (
    client: SeedClient,
    profile: { id: string; first_name: string | null; last_name: string | null },
    isDriver: boolean,
) => {
    const { data: existing, error: driverError } = await client
        .from('Driver')
        .select('drawer_id, driver_id, is_deleted')
        .eq('driver_id', profile.id)
        .maybeSingle();
    throwIfError(`Load driver ${profile.id}`, driverError);

    if (!isDriver) {
        if (existing && !existing.is_deleted) {
            const { error } = await client.from('Driver').update({ is_deleted: true }).eq('driver_id', profile.id);
            throwIfError(`Unmark driver ${profile.id}`, error);
        }
        return;
    }

    const name = displayName(profile.first_name, profile.last_name);
    if (existing) {
        const { error } = await client.from('Driver').update({ is_deleted: false }).eq('driver_id', profile.id);
        throwIfError(`Restore driver ${profile.id}`, error);
        const { error: drawerError } = await client.from('Drawer').update({ name }).eq('drawer_id', existing.drawer_id);
        throwIfError(`Restore driver drawer ${profile.id}`, drawerError);
        return;
    }

    const { data: drawer, error: insertDrawerError } = await client
        .from('Drawer')
        .insert({ name, drawer_type: 'driver' })
        .select('drawer_id')
        .single();
    throwIfError(`Create driver drawer for ${name}`, insertDrawerError);

    const { error: insertDriverError } = await client.from('Driver').insert({
        drawer_id: drawer.drawer_id,
        driver_id: profile.id,
        is_deleted: false,
    });
    throwIfError(`Create driver row for ${name}`, insertDriverError);
};

const ensureTestUsers = async (client: SeedClient) => {
    const password = getTestPassword();
    const usersByEmail = new Map(
        (await listAuthUsers(client))
            .filter((user) => user.email)
            .map((user) => [user.email!.toLowerCase(), user.id] as const),
    );
    for (const account of TEST_ACCOUNTS) {
        const userId = await ensureAuthUser(client, account.email, password, usersByEmail);
        const profile = await ensureProfile(client, userId, account);
        const { error: rpcError } = await client.rpc('handle_employee_update', {
            p_is_driver: account.is_driver,
            p_profile: profile,
        });
        if (rpcError) {
            console.warn(`handle_employee_update failed for ${account.email}: ${rpcError.message}`);
            await ensureDriverFlag(client, profile, account.is_driver);
        }
    }

    const { data: profiles, error: profileError } = await client
        .from('Profile')
        .select('id, first_name, last_name, email, is_deleted');
    throwIfError('List employees after seed', profileError);

    const { data: drivers, error: driverError } = await client
        .from('Driver')
        .select('driver_id, is_deleted')
        .eq('is_deleted', false);
    throwIfError('List drivers after seed', driverError);

    const driverIds = new Set((drivers ?? []).map((driver) => driver.driver_id).filter(Boolean));
    const names: string[] = [];
    for (const email of getDriverEmails()) {
        const profile = (profiles ?? []).find(
            (row) => !row.is_deleted && row.email.toLowerCase() === email.toLowerCase(),
        );
        if (!profile || !driverIds.has(profile.id)) {
            throw new Error(`Seeded driver ${email} is missing a Profile/Driver row`);
        }
        names.push(displayName(profile.first_name, profile.last_name));
    }
    seededDriverNames = names;
};

/** Wipe today's transactional rows, then ensure origins, resources, and test users. Does not delete real employees. */
export const seedBusinessDate = async (businessDate = todayBusinessDate()) => {
    const client = await createSeedClient();
    await wipeBusinessDate(businessDate, client);
    await ensureOrigins(client);
    await ensureResources(client);
    await ensureBaseDrawers(client);
    await ensureTestUsers(client);
};
