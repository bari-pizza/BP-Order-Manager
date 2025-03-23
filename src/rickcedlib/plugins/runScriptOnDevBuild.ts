// runScriptOnDevBuild.js
import { execSync } from 'child_process';

export const runScriptOnDevBuild = (scriptName: string) => {
    console.log('runScriptOnDevBuild');
    return {
        name: 'run-script-on-dev-build',
        build: {
            rollupOptions: {
                external: ['child_process'],
            },
        },
        buildEnd: async () => {
            console.log('build end');
            try {
                execSync(`npm run ${scriptName}`, { stdio: 'inherit' });
            } catch (error) {
                console.error(`Error running ${scriptName}:`, error);
            }
        },
    };
};
