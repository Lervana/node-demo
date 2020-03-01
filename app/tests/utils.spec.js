import 'colors';

import fs from 'fs';
import chai from 'chai';
import sinon from 'sinon';
import { saveResult } from '../src/utils';
import { log } from '../src/logger';

const expect = chai.expect;

describe('Utils', () => {
  it('Should save result in expected path', () => {
    const fakeFS = { ...fs };
    const fakeWriteFileSync = sinon.fake.returns(true);
    sinon.replace(fakeFS, 'writeFileSync', fakeWriteFileSync);
    saveResult([{ a: 1 }], fakeFS);

    const lastLog = log.getSilentLogsSync(true);
    expect(lastLog).to.not.equal(null);
    expect(lastLog.level).to.equal('info');
    expect(lastLog.msg.indexOf('/node-demo/result.json')).to.not.equal(-1);
  });

  it('Should log error when cannot save result', () => {
    const fakeFS = { ...fs };
    const fakeWriteFileSync = sinon.fake.throws(new Error('test error'));
    sinon.replace(fakeFS, 'writeFileSync', fakeWriteFileSync);
    saveResult([{ a: 1 }], fakeFS);

    const lastLog = log.getSilentLogsSync(true);
    expect(lastLog).to.not.equal(null);
    expect(lastLog.level).to.equal('error');
    expect(lastLog.msg.indexOf('Cannot save result! Error: test error')).to.not.equal(-1);
  });
});
