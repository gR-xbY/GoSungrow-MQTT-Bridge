import { exec } from 'child_process';

class CommandExecutor {
  constructor(logger) {
    this.logger = logger;
  }

  execute(command) {
    return new Promise((resolve, reject) => {
      this.logger.log('INFO', `Executing command: ${command}`);
      exec(command, (error, stdout, stderr) => {
        if (error) {
          this.logger.log('ERROR', `Error executing command: ${error.message}`);
          reject(error);
          return;
        }
        if (stderr) {
          this.logger.log('ERROR', `Command error: ${stderr}`);
          reject(new Error(stderr));
          return;
        }
        resolve(stdout.trim());
      });
    });
  }
}

export default CommandExecutor;
