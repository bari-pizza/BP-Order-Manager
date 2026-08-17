import { existsSync, readFileSync } from 'fs';
import path from 'path';

const fromShell = new Set(Object.keys(process.env));

const loadEnvFile = (fileName: string, overrideEnvFile = false) => {
    const filePath = path.resolve(process.cwd(), fileName);
    if (!existsSync(filePath)) {
        return;
    }

    for (const rawLine of readFileSync(filePath, 'utf8').split('\n')) {
        const line = rawLine.trim();
        if (!line || line.startsWith('#')) {
            continue;
        }

        const withoutExport = line.startsWith('export ') ? line.slice(7) : line;
        const eq = withoutExport.indexOf('=');
        if (eq <= 0) {
            continue;
        }

        const key = withoutExport.slice(0, eq).trim();
        let value = withoutExport.slice(eq + 1).trim();
        if (
            (value.startsWith('"') && value.endsWith('"')) ||
            (value.startsWith("'") && value.endsWith("'"))
        ) {
            value = value.slice(1, -1);
        }

        if (fromShell.has(key)) {
            continue;
        }
        if (!overrideEnvFile && process.env[key] !== undefined) {
            continue;
        }

        process.env[key] = value;
    }
};

/** Load `.env` then `.env.local`. Does not override variables already set in the shell. */
export const loadTestEnv = () => {
    loadEnvFile('.env');
    loadEnvFile('.env.local', true);
};
