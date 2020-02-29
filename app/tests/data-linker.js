import fs from 'fs';
import chai from 'chai';
import sinon from 'sinon';

import DataLinker from '../src/parsers/data-linker';
import SourceParser from '../src/parsers/source-parser';
import { exampleInput, exampleOutput } from './test-data';

const expect = chai.expect;

let dataLinker;

describe('DataLinker', () => {
  before(() => {
    dataLinker = new DataLinker();
  });

  it('Should return true when link is to main web', () => {
    const result = dataLinker.isWeb({ url: 'http://example.com' });
    expect(result).to.equal(true);
  });

  it('Should return false when link is to profile', () => {
    const result = dataLinker.isWeb({ url: 'http://example.com/aaa' });
    expect(result).to.equal(false);
  });

  it('Should return true when item A links to item B', () => {
    const itemA = { url: 'https://example.com/aaa', entityType: 'person', linksTo: ['https://example.com/bbb'] };
    const itemB = { url: 'https://example.com/bbb', entityType: 'person', linksTo: ['https://example.com/ccc'] };
    const result = dataLinker.hasElement(itemA, itemB);
    expect(result).to.equal(true);
  });

  it("Should return false when item A don't link to item B", () => {
    const itemA = { url: 'https://example.com/aaa', entityType: 'person', linksTo: ['https://example.com/ccc'] };
    const itemB = { url: 'https://example.com/bbb', entityType: 'person', linksTo: ['https://example.com/ccc'] };
    const result = dataLinker.hasElement(itemA, itemB);
    expect(result).to.equal(false);
  });

  it('Should return false on match when items have diferent types', () => {
    const itemA = { url: 'https://example.com/aaa', entityType: 'person', linksTo: ['https://example.com/bbb'] };
    const itemB = { url: 'https://example.com/bbb', entityType: 'organization', linksTo: ['https://example.com/ccc'] };
    const result = dataLinker.match(itemA, itemB);
    expect(result).to.equal(false);
  });

  it('Should return true on match when first item is web and both links to themselves', () => {
    const itemA = { url: 'https://example.com', entityType: 'person', linksTo: ['https://example.com/bbb'] };
    const itemB = { url: 'https://example.com/bbb', entityType: 'person', linksTo: ['https://example.com'] };
    const result = dataLinker.match(itemA, itemB);
    expect(result).to.equal(true);
  });

  it('Should return true on match when second item is web and both links to themselves', () => {
    const itemA = { url: 'https://example.com/aaa', entityType: 'person', linksTo: ['https://example.com'] };
    const itemB = { url: 'https://example.com', entityType: 'person', linksTo: ['https://example.com/aaa'] };
    const result = dataLinker.match(itemA, itemB);
    expect(result).to.equal(true);
  });

  it("Should return false on match when first item is web but both don't links to themselves", () => {
    const itemA = { url: 'https://example.com', entityType: 'person', linksTo: ['https://example.com/bbb'] };
    const itemB = { url: 'https://example.com/bbb', entityType: 'person', linksTo: ['https://example.com/ccc'] };
    const result = dataLinker.match(itemA, itemB);
    expect(result).to.equal(false);
  });

  it("Should return false on match when second item is web but both don't links to themselves", () => {
    const itemA = { url: 'https://example.com/aaa', entityType: 'person', linksTo: ['https://example.com/bbb'] };
    const itemB = { url: 'https://example.com', entityType: 'person', linksTo: ['https://example.com/ccc'] };
    const result = dataLinker.match(itemA, itemB);
    expect(result).to.equal(false);
  });

  it("Should return true on match when items aren't webs and first links to second", () => {
    const itemA = { url: 'https://example.com/aaa', entityType: 'person', linksTo: ['https://example.com/bbb'] };
    const itemB = { url: 'https://example.com/bbb', entityType: 'person', linksTo: ['https://example.com/ccc'] };
    const result = dataLinker.match(itemA, itemB);
    expect(result).to.equal(true);
  });

  it("Should return true on match when items aren't webs and second links to first", () => {
    const itemA = { url: 'https://example.com/aaa', entityType: 'person', linksTo: ['https://example.com/ccc'] };
    const itemB = { url: 'https://example.com/bbb', entityType: 'person', linksTo: ['https://example.com/aaa'] };
    const result = dataLinker.match(itemA, itemB);
    expect(result).to.equal(true);
  });

  it("Should return false on match when items aren't webs and they are not linked", () => {
    const itemA = { url: 'https://example.com/aaa', entityType: 'person', linksTo: ['https://example.com/ccc'] };
    const itemB = { url: 'https://example.com/bbb', entityType: 'person', linksTo: ['https://example.com/ddd'] };
    const result = dataLinker.match(itemA, itemB);
    expect(result).to.equal(false);
  });

  it('Should parse data with expected result', () => {
    const sourceParser = new SourceParser();
    const data = sourceParser.simplifyData(exampleInput);
    const result = dataLinker.parseSync(data);
    expect(JSON.stringify(result)).to.equal(JSON.stringify(exampleOutput));
  });
});
