import fs from 'fs';
import chai from 'chai';
import sinon from 'sinon';

import SourceParser from '../src/parsers/source-parser';

const expect = chai.expect;

describe('SourceParser', () => {
  it('Should have default fs set if there is no param set', () => {
    const sourceParser = new SourceParser();
    expect(sourceParser.fs).to.not.equal(null);
    expect(sourceParser.fs).to.equal(fs);
  });

  it('Should throw error when file path is not set in args', () => {
    const sourceParser = new SourceParser();
    const test = () => sourceParser.parseSync(null);
    expect(test).to.throw('You need to specify path for source file');
  });

  it("Should throw error when file doesn't exist", () => {
    const fakeFS = { ...fs };
    const fakeAccessSync = sinon.fake.throws(new Error());
    sinon.replace(fakeFS, 'accessSync', fakeAccessSync);
    const sourceParser = new SourceParser(fakeFS);
    const test = () => sourceParser.parseSync(['', '', 'test.json']);
    expect(test).to.throw('Source file not found');
  });

  it('Should throw error when file cannot be loaded', () => {
    const fakeFS = { ...fs };
    const fakeAccessSync = sinon.fake.returns(true);
    const fakeReadFileSync = sinon.fake.throws(new Error());
    sinon.replace(fakeFS, 'accessSync', fakeAccessSync);
    sinon.replace(fakeFS, 'readFileSync', fakeReadFileSync);
    const sourceParser = new SourceParser(fakeFS);
    const test = () => sourceParser.parseSync();
    expect(test).to.throw('Cannot read source file');
  });

  it('Should throw error when file contains invalid data', () => {
    const fakeFS = { ...fs };
    const fakeAccessSync = sinon.fake.returns(true);
    const fakereadFileSync = sinon.fake.returns('<123>');
    sinon.replace(fakeFS, 'accessSync', fakeAccessSync);
    sinon.replace(fakeFS, 'readFileSync', fakereadFileSync);
    const sourceParser = new SourceParser(fakeFS);
    const test = () => sourceParser.parseSync();
    expect(test).to.throw('Cannot parse sourcefile');
  });

  it('Should return expected data when file is valid', () => {
    const sourceData = [
      {
        url: 'https://twitter.com/aaa',
        entityType: 'person',
        linksTo: ['https://twitter.com/bbb', 'https://linkedin.com/aaa'],
      },
      {
        url: 'https://www.example2.com',
        entityType: 'person',
        linksTo: ['https://twitter.com/ccc'],
      },
    ];
    const fakeFS = { ...fs };
    const fakeAccessSync = sinon.fake.returns(true);
    const fakereadFileSync = sinon.fake.returns(JSON.stringify(sourceData));
    sinon.replace(fakeFS, 'accessSync', fakeAccessSync);
    sinon.replace(fakeFS, 'readFileSync', fakereadFileSync);
    const sourceParser = new SourceParser(fakeFS);
    const data = sourceParser.parseSync();
    expect(JSON.stringify(data)).to.equal(
      JSON.stringify([
        {
          url: 'http://twitter.com/aaa',
          entityType: 'person',
          linksTo: ['http://twitter.com/bbb', 'http://linkedin.com/aaa'],
        },
        {
          url: 'http://example2.com',
          entityType: 'person',
          linksTo: ['http://twitter.com/ccc'],
        },
      ]),
    );
  });

  it('Should simplify data to expected result if there are no url and linksTo fields', () => {
    const sourceData = [{ entityType: 'person' }, { entityType: 'person' }];
    const fakeFS = { ...fs };
    const fakeAccessSync = sinon.fake.returns(true);
    const fakereadFileSync = sinon.fake.returns(JSON.stringify(sourceData));
    sinon.replace(fakeFS, 'accessSync', fakeAccessSync);
    sinon.replace(fakeFS, 'readFileSync', fakereadFileSync);
    const sourceParser = new SourceParser(fakeFS);
    const result = sourceParser.simplifyData(sourceData);
    expect(JSON.stringify(result)).to.equal(JSON.stringify(sourceData));
  });
});
