import { describe, expect, it } from 'vitest';
import { formatAppShellLabel, isInstalledShell, type AppShell } from '../../src/utils/appShell';

describe('appShell labels', () => {
    it.each([
        ['ios', 'Running as iOS app', true],
        ['android', 'Running as Android app', true],
        ['pwa', 'Running in PWA mode', true],
        ['browser', 'Running in browser (not installed)', false],
    ] as const satisfies ReadonlyArray<readonly [AppShell, string, boolean]>)(
        '%s → %s (installed=%s)',
        (shell, label, installed) => {
            expect(formatAppShellLabel(shell)).toBe(label);
            expect(isInstalledShell(shell)).toBe(installed);
        },
    );
});
