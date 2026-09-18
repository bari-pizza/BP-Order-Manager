#!/usr/bin/env node
/**
 * Apply a .sql file to Supabase Postgres (dev or prod) using DATABASE_URL_* from .env.
 *
 * Usage:
 *   node scripts/db-apply.mjs --env=dev --file=supabase-functions/update-employee.sql
 *   node scripts/db-apply.mjs --env=prod --file=supabase-functions/update-employee.sql --i-know-this-is-prod
 *   node scripts/db-apply.mjs --env=dev --ping
 *   node scripts/db-apply.mjs --env=dev --file=… --no-transaction   # rare DDL that cannot run in a txn
 *
 * Prefer Session pooler URIs (IPv4). Never commit real DATABASE_URL_* values.
 */
import fs from 'node:fs';
import path from 'node:path';
import process from 'node:process';
import { fileURLToPath } from 'node:url';
import pg from 'pg';

const { Client } = pg;
const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');

function loadEnv(filePath) {
    if (!fs.existsSync(filePath)) return {};
    const out = {};
    for (const line of fs.readFileSync(filePath, 'utf8').split(/\n/)) {
        const t = line.trim();
        if (!t || t.startsWith('#')) continue;
        const i = t.indexOf('=');
        if (i < 0) continue;
        out[t.slice(0, i)] = t.slice(i + 1);
    }
    return out;
}

function parseArgs(argv) {
    const args = { env: null, file: null, ping: false, confirmProd: false, noTransaction: false };
    for (let i = 0; i < argv.length; i++) {
        const raw = argv[i];
        if (raw === '--ping') args.ping = true;
        else if (raw === '--i-know-this-is-prod') args.confirmProd = true;
        else if (raw === '--no-transaction') args.noTransaction = true;
        else if (raw.startsWith('--env=')) args.env = raw.slice('--env='.length);
        else if (raw.startsWith('--file=')) args.file = raw.slice('--file='.length);
        else if (raw === '--file') args.file = argv[++i] ?? null;
        else if (raw === '--env') args.env = argv[++i] ?? null;
        else if (!raw.startsWith('-') && !args.file) args.file = raw;
    }
    return args;
}

function redactHost(connectionString) {
    try {
        const u = new URL(connectionString.replace(/^postgresql:/i, 'http:'));
        return `${u.hostname}:${u.port || '5432'}`;
    } catch {
        return '(unparseable-url)';
    }
}

function usage(exitCode = 1) {
    console.error(`Apply SQL to Supabase Postgres via DATABASE_URL_DEV / DATABASE_URL_PROD.

  npm run db:ping:dev
  npm run db:ping:prod
  npm run db:apply:dev -- supabase-functions/<file>.sql
  npm run db:apply:prod -- supabase-functions/<file>.sql --i-know-this-is-prod

Prod apply requires you to pass --i-know-this-is-prod after -- (not baked into the npm script).
SQL runs in a transaction by default; pass --no-transaction only for DDL Postgres cannot wrap.
Always apply and verify on dev before prod.`);
    process.exit(exitCode);
}

async function withClient(connectionString, fn) {
    // Session pooler presents a cert chain Node rejects as SELF_SIGNED_CERT_IN_CHAIN when
    // rejectUnauthorized is true (verified against aws-0-…pooler.supabase.com). Keep TLS on,
    // but skip CA verification so apply scripts work; prefer private networks / VPN for ops.
    const client = new Client({
        connectionString,
        ssl: { rejectUnauthorized: false },
        connectionTimeoutMillis: 20_000,
    });
    await client.connect();
    try {
        return await fn(client);
    } finally {
        await client.end().catch(() => undefined);
    }
}

async function applySql(client, sql, { noTransaction }) {
    if (noTransaction) {
        await client.query(sql);
        return;
    }
    await client.query('BEGIN');
    try {
        await client.query(sql);
        await client.query('COMMIT');
    } catch (error) {
        await client.query('ROLLBACK').catch(() => undefined);
        throw error;
    }
}

async function main() {
    const args = parseArgs(process.argv.slice(2));
    if (!args.env || !['dev', 'prod'].includes(args.env)) usage();
    if (!args.ping && !args.file) usage();
    if (args.env === 'prod' && !args.ping && !args.confirmProd) {
        console.error('Refusing to apply to prod without --i-know-this-is-prod');
        process.exit(1);
    }

    const env = loadEnv(path.join(root, '.env'));
    const key = args.env === 'prod' ? 'DATABASE_URL_PROD' : 'DATABASE_URL_DEV';
    const connectionString = env[key];
    if (!connectionString) {
        console.error(`Missing ${key} in .env (Session pooler URI). See .env.example.`);
        process.exit(1);
    }

    const host = redactHost(connectionString);
    console.log(`${args.env.toUpperCase()} → ${host}`);

    if (args.ping) {
        await withClient(connectionString, async (client) => {
            const { rows } = await client.query(
                'select current_database() as db, current_user as role',
            );
            console.log(`OK  db=${rows[0].db}  role=${rows[0].role}`);
        });
        return;
    }

    const filePath = path.isAbsolute(args.file) ? args.file : path.join(root, args.file);
    if (!fs.existsSync(filePath)) {
        console.error(`File not found: ${filePath}`);
        process.exit(1);
    }
    if (!filePath.endsWith('.sql')) {
        console.error('Refusing to apply a non-.sql file');
        process.exit(1);
    }

    const sql = fs.readFileSync(filePath, 'utf8');
    if (!sql.trim()) {
        console.error('SQL file is empty');
        process.exit(1);
    }

    console.log(
        `Applying ${path.relative(root, filePath)}${args.noTransaction ? ' (no transaction)' : ' (transaction)'} …`,
    );
    await withClient(connectionString, (client) =>
        applySql(client, sql, { noTransaction: args.noTransaction }),
    );
    console.log('Done.');
}

main().catch((err) => {
    console.error(`FAILED: ${err.code || ''} ${err.message.split('\n')[0]}`);
    process.exit(1);
});
