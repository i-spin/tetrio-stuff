// eslint-disable-next-line import/no-unresolved
import chalk from 'chalk';

class Logger {
  constructor() {
    this.logs = [];
  }

  display(latest) {
    // eslint-disable-next-line no-param-reassign
    if (!latest) latest = this.logs[this.logs.length - 1];
    switch (latest.level) {
      case 0:
        console.log(`(${latest.time}) ${chalk.green('[INFO]')} ${latest.message} ${JSON.stringify(latest.data, null, 2)}`);
        break;
      case 1:
        console.log(`(${latest.time}) ${chalk.yellow('[WARN]')} ${latest.message} ${JSON.stringify(latest.data, null, 2)}`);
        break;
      case 2:
        console.log(`(${latest.time}) ${chalk.red('[CRITICAL]')} ${latest.message} ${JSON.stringify(latest.data, null, 2)}`);
        break;
      default:
        console.log(`(${latest.time}) ${chalk.white('[UNKNOWN]')} ${latest.message} ${JSON.stringify(latest.data, null, 2)}`);
        break;
    }
  }

  displayAll() {
    this.logs.forEach((log) => {
      this.display(log);
    });
  }

  info(message, data) {
    this.logs.push({
      time: new Date().toISOString(), level: 0, message, data,
    });
    this.display();
  }

  warn(message, data) {
    this.logs.push({
      time: new Date().toISOString(), level: 1, message, data,
    });
    this.display();
  }

  critical(message, data) {
    this.logs.push({
      time: new Date().toISOString(), level: 2, message, data,
    });
    this.display();
  }
}

export default Logger;
