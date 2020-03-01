import chai from 'chai';
import sinon from 'sinon';

import BaseService from '../src/services/base-service';

const expect = chai.expect;

let baseService;
let fakeModel;
let fakeModelCreateSpy;
let fakeModelFindOrCreateSpy;
let fakeModelFindAllSpy;

describe('BaseService', () => {
  before(() => {
    const item = {
      toJSON: () => ({}),
    };

    fakeModel = {
      create: () => item,
      findOrCreate: () => [item],
      findAll: () => [item, item],
    };
    baseService = new BaseService(null, fakeModel);
    fakeModelCreateSpy = sinon.spy(fakeModel, 'create');
    fakeModelFindOrCreateSpy = sinon.spy(fakeModel, 'findOrCreate');
    fakeModelFindAllSpy = sinon.spy(fakeModel, 'findAll');
  });

  it('Should save default options on creations', () => {
    const baseService = new BaseService();
    const expected = { attributes: { exclude: ['createdAt', 'updatedAt'] } };
    expect(baseService.options).to.deep.equal(expected);
  });

  it('Should throw error when create is called without transaction', async () => {
    try {
      await baseService.create();
      expect.fail();
    } catch (e) {
      expect(true).to.be.true;
    }
  });

  it('Should call model create when creating new item', async () => {
    await baseService.create({});
    expect(fakeModelCreateSpy.calledOnce).to.be.true;
  });

  it('Should throw error when cannot create new item', async () => {
    const fakeModel = { create: sinon.fake.throws(new Error('test error')) };
    const baseService = new BaseService({}, fakeModel);
    const transaction = { rollback: () => {} };
    const transactionSpy = sinon.spy(transaction, 'rollback');

    try {
      await baseService.create(transaction, {});
      expect.fail();
    } catch (e) {
      expect(true).to.be.true;
    }

    expect(transactionSpy.calledOnce).to.be.true;
  });

  it('Should throw error when findOrCreate is called without transaction', async () => {
    try {
      await baseService.findOrCreate();
      expect.fail();
    } catch (e) {
      expect(true).to.be.true;
    }
  });

  it('Should call findOrCreate on model when findOrCreate is called on service', async () => {
    await baseService.findOrCreate({});
    expect(fakeModelFindOrCreateSpy.calledOnce).to.be.true;
  });

  it('Should throw error when cannot findOrCreate new item', async () => {
    const fakeModel = { findOrCreate: sinon.fake.throws(new Error('test error')) };
    const baseService = new BaseService({}, fakeModel);
    const transaction = { rollback: () => {} };
    const transactionSpy = sinon.spy(transaction, 'rollback');

    try {
      await baseService.findOrCreate(transaction, {});
      expect.fail();
    } catch (e) {
      expect(true).to.be.true;
    }

    expect(transactionSpy.calledOnce).to.be.true;
  });

  it('Should call findAll on model when readAll is called', async () => {
    await baseService.readAll();
    expect(fakeModelFindAllSpy.calledOnce).to.be.true;
  });
});
