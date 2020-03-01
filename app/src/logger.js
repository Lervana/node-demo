import 'colors';

import config from 'config';
import bunyan from 'bunyan';
import PrettyStream from 'bunyan-prettystream';

const prettyStdOut = new PrettyStream();
prettyStdOut.pipe(process.stdout);

const { name, log_level, is_test } = config;

class Logger {
  silentLogs = [];

  constructor(createLogger = bunyan.createLogger) {
    this.client = createLogger({
      name: name,
      streams: [
        {
          level: log_level,
          type: 'raw',
          stream: prettyStdOut,
        },
      ],
    });
  }

  log = (level, message) => {
    if (is_test) this.silentLogs.push({ level, msg: message });
    else this.client[level](message);
  };

  trace = msg => this.log('trace', msg);
  debug = msg => this.log('debug', msg);
  info = msg => this.log('info', msg);
  warn = msg => this.log('warn', msg.yellow);
  error = msg => this.log('error', msg.red);
  fatal = msg => this.log('fatal', msg.red);

  clearSilentLogsSync() {
    this.silentLogs = [];
  }

  getSilentLogsSync(getLastOnly = false) {
    if (!getLastOnly) return this.silentLogs;
    if (this.silentLogs.length > 0) return this.silentLogs[this.silentLogs.length - 1];
    return null;
  }
}

export const log = new Logger();
export default Logger;
