import 'colors';

import bunyan from 'bunyan';
import chai from 'chai';
import Logger from '../src/logger';

const expect = chai.expect;

let logger;

describe('Logger', () => {
  before(() => {
    logger = new Logger();
  });

  beforeEach(() => {
    logger.clearSilentLogsSync();
  });

  it('Should use bunyan logger when no custom logger is specified', () => {
    const defaultLogger = new Logger();
    expect(defaultLogger.client instanceof bunyan);
  });

  it('Should store logs in silent logs when env is test', () => {
    logger.log('info', 'test');
    const expected = [{ level: 'info', msg: 'test' }];
    const result = logger.getSilentLogsSync();
    expect(result).to.deep.equal(expected);
  });

  it('Should return last log when getSilentLogsSync is called with true', () => {
    logger.log('info', 'test1');
    logger.log('info', 'test2');
    logger.log('info', 'tes53');
    logger.log('info', 'test4');
    logger.log('info', 'test5');
    const expected = { level: 'info', msg: 'test5' };
    const result = logger.getSilentLogsSync(true);
    expect(result).to.deep.equal(expected);
  });

  it('Should return empty array if there are no stored logs', () => {
    const result = logger.getSilentLogsSync();
    expect(result.toString()).to.equal([].toString());
  });

  it('Should return null if there are no stored logs and getSilentLogsSync is called with true', () => {
    const result = logger.getSilentLogsSync(true);
    expect(result).to.equal(null);
  });

  it('Should clear logs on clearSilentLogsSync', () => {
    logger.log('info', 'test1');
    logger.log('info', 'test2');
    logger.log('info', 'test3');
    logger.clearSilentLogsSync();
    expect(logger.silentLogs).to.deep.equal([]);
  });

  const logTests = (level, color) => {
    it(`Should store ${level} log when trace is called`, () => {
      logger[level]('test');
      const lastLog = logger.getSilentLogsSync(true);
      expect(lastLog).to.deep.equal({ level, msg: color ? 'test'[color] : 'test' });
    });
  };

  logTests('trace');
  logTests('debug');
  logTests('info');
  logTests('warn', 'yellow');
  logTests('error', 'red');
  logTests('fatal', 'red');
});
