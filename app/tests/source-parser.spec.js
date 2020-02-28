import fs from 'fs';
import chai from 'chai';
import sinon from 'sinon';

import SourceParser from '../src/source-parser';

const expect = chai.expect;

describe('SourceParser', () => {
  it('Should have default fs set if there is no param set', () => {
    const sourceParser = new SourceParser();
    expect(sourceParser.fs).to.not.equal(null);
    expect(sourceParser.fs).to.equal(fs);
  });

  it('Should throw error when file path is not set in args', () => {
    const sourceParser = new SourceParser();
    const test = () => sourceParser.parse(null);
    expect(test).to.throw('You need to specify path for source file');
  });

  it("Should throw error when file doesn't exist", () => {
    const fakeFS = { ...fs };
    const fakeAccessSync = sinon.fake.throws(new Error());
    sinon.replace(fakeFS, 'accessSync', fakeAccessSync);
    const sourceParser = new SourceParser(fakeFS);
    const test = () => sourceParser.parse(['', '', 'test.json']);
    expect(test).to.throw('Source file not found');
  });

  it('Should throw error when file cannot be loaded', () => {
    const fakeFS = { ...fs };
    const fakeAccessSync = sinon.fake.returns(true);
    const fakereadFileSync = sinon.fake.throws(new Error());
    sinon.replace(fakeFS, 'accessSync', fakeAccessSync);
    sinon.replace(fakeFS, 'readFileSync', fakereadFileSync);
    const sourceParser = new SourceParser(fakeFS);
    const test = () => sourceParser.parse();
    expect(test).to.throw('Cannot read source file');
  });

  it('Should throw error when file contains invalid data', () => {
    const fakeFS = { ...fs };
    const fakeAccessSync = sinon.fake.returns(true);
    const fakereadFileSync = sinon.fake.returns('<123>');
    sinon.replace(fakeFS, 'accessSync', fakeAccessSync);
    sinon.replace(fakeFS, 'readFileSync', fakereadFileSync);
    const sourceParser = new SourceParser(fakeFS);
    const test = () => sourceParser.parse();
    expect(test).to.throw('Cannot parse sourcefile');
  });

  it('Should return expected data when file is valid', () => {
    const expectedData = [{ a: 1 }, { b: [123] }];
    const fakeFS = { ...fs };
    const fakeAccessSync = sinon.fake.returns(true);
    const fakereadFileSync = sinon.fake.returns(JSON.stringify(expectedData));
    sinon.replace(fakeFS, 'accessSync', fakeAccessSync);
    sinon.replace(fakeFS, 'readFileSync', fakereadFileSync);
    const sourceParser = new SourceParser(fakeFS);
    const data = sourceParser.parse();
    expect(JSON.stringify(data)).to.equal(JSON.stringify(expectedData));
  });
});
