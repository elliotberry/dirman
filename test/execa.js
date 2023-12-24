import { exec } from 'child_process';

export let execa = (command) => {
    return new Promise((resolve, reject) => {
        exec(command, (error, stdout, stderr) => {
            if (error) {
                console.error(`exec error: ${error}`);
                return;
            }
            resolve(stdout);
        });
    });
};
