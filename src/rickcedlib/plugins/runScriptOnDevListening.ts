// runScriptOnDevBuild.ts
import { exec } from 'child_process';
import { ViteDevServer, PluginOption } from 'vite';

export const runScriptOnDevListening = (scriptName: string): PluginOption => {
    console.log('runScriptOnDevBuild');
    return {
        name: 'run-script-on-dev-build',
        apply: 'serve', // Only apply in development mode
        configureServer(server: ViteDevServer) {
            server.httpServer?.once('listening', () => {
                console.log('Vite server started, running script...');
                exec(`npm run ${scriptName}`, (error) => {
                    if (error) {
                        console.error(`Error running ${scriptName}:`, error);
                    } else {
                        console.log(`${scriptName} finished.`);
                    }
                });
            });
        },
    };
};
