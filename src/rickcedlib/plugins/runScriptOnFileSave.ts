import path from 'path';
import { Plugin } from 'vite';
import { exec } from 'child_process';

export function runScriptOnFileSave(filePath: string, script: string): Plugin {
    return {
        name: 'run-script-on-file-save',
        apply: 'serve', // Only apply in development mode
        configureServer(server) {
            server.watcher.add(filePath); // Watch the specified file

            server.watcher.on('change', async (file) => {
                if (path.resolve(file) === path.resolve(filePath)) {
                    console.log(`File ${filePath} changed, running script: ${script}`);
                    try {
                        await new Promise<void>((resolve, reject) => {
                            exec(script, (error, stdout, stderr) => {
                                if (error) {
                                    console.error(`Script execution error: ${error}`);
                                    console.error(stderr);
                                    reject(error);
                                } else {
                                    console.log(stdout);
                                    resolve();
                                }
                            });
                        });
                        console.log(`Script ${script} finished.`);
                    } catch (error) {
                        console.error(`Script execution failed: ${error}`);
                    }
                }
            });
        },
    };
}
