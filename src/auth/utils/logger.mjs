// eslint-disable-next-line import/no-unresolved
import chalk from 'chalk';

class Logger {
  constructor() {
    this.logs = [];
  }

  info(message, data) {
    this.logs.push({ level: 0, message, data });
  }

  warn(message, data) {
    this.logs.push({ level: 1, message, data });
  }

  critical(message, data) {
    this.logs.push({ level: 2, message, data });
  }

  display() {
    this.logs.forEach((log) => {
      switch (log.level) {
        case 0:
          console.log(`${chalk.green('[INFO]')} ${log.message} ${JSON.stringify(log.data, null, 2)}`);
          break;
        case 1:
          console.log(`${chalk.yellow('[WARN]')} ${log.message} ${JSON.stringify(log.data, null, 2)}`);
          break;
        case 2:
          console.log(`${chalk.red('[CRITICAL]')} ${log.message} ${JSON.stringify(log.data, null, 2)}`);
          break;
        default:
          console.log(`${chalk.white('[UNKNOWN]')} ${log.message} ${JSON.stringify(log.data, null, 2)}`);
          break;
      }
    });
  }
}

export default Logger;
