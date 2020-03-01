import chai from 'chai';
import sinon from 'sinon';
import { ProfileModel } from '../src/models';
import { EntitiesServiceClass } from '../src/services';
import { exampleStoreDataInput } from './utils/test-data';

const expect = chai.expect;

let entitiesService;
let sequelize;
let model;
let profilesService;
let transactionCommited;

describe('BaseService', () => {
  before(() => {
    const item = {
      toJSON: () => ({ profiles: [{ linksTo: 'a;b' }] }),
    };

    transactionCommited = false;

    entitiesService = new EntitiesServiceClass();
    sequelize = { transaction: () => ({ rollback: () => {}, commit: () => (transactionCommited = true) }) };
    model = { create: () => item, findOrCreate: () => [item], findAll: () => [item, item] };
    profilesService = { findOrCreate: () => {} };
  });

  it('Should use custom options when created', () => {
    const entitiesService = new EntitiesServiceClass();
    const expected = {
      attributes: { exclude: ['createdAt', 'updatedAt'] },
      include: [
        {
          model: ProfileModel,
          as: 'profiles',
          attributes: ['id', 'url', 'entityType', 'linksTo'],
        },
      ],
    };
    expect(entitiesService.options).to.deep.equal(expected);
  });

  it('Should return false when checkEntitiesIds is called and existingProfiles length is 0', () => {
    const result = entitiesService.checkEntitiesIds([]);
    expect(result).to.false;
  });

  it('Should return false when checkEntitiesIds is called and profiles have diferent entityId', () => {
    const result = entitiesService.checkEntitiesIds([{ entityId: 1 }, { entityId: 1 }, { entityId: 2 }]);
    expect(result).to.false;
  });

  it('Should return true when checkEntitiesIds is called and profiles have the same entityId', () => {
    const result = entitiesService.checkEntitiesIds([{ entityId: 1 }, { entityId: 1 }, { entityId: 1 }]);
    expect(result).to.true;
  });

  it('Should add item to existing profiles if profile found', async () => {
    const item = { a: 1 };
    const service = { ...profilesService, readByUrl: () => item };
    const entitiesService = new EntitiesServiceClass(sequelize, model, service);
    const spy = sinon.spy(entitiesService, 'checkEntitiesIds');
    await entitiesService.storeData(exampleStoreDataInput);

    expect(spy.withArgs([item, item]).calledOnce).to.true;
    expect(spy.withArgs([item]).calledTwice).to.true;
  });

  it('Should not add item to existing profiles if profile not found', async () => {
    const service = { ...profilesService, readByUrl: () => null };
    const entitiesService = new EntitiesServiceClass(sequelize, model, service);
    const spy = sinon.spy(entitiesService, 'checkEntitiesIds');
    await entitiesService.storeData(exampleStoreDataInput);

    expect(spy.withArgs([]).calledThrice).to.true;
  });

  it('Should create entity if no profiles found', async () => {
    const service = { ...profilesService, readByUrl: () => null };
    const entitiesService = new EntitiesServiceClass(sequelize, model, service);
    const spy = sinon.spy(entitiesService, 'create');
    await entitiesService.storeData(exampleStoreDataInput);

    expect(spy.called).to.true;
  });

  it('Should not create entity if profiles found', async () => {
    const item = { a: 1 };
    const service = { ...profilesService, readByUrl: () => item };
    const entitiesService = new EntitiesServiceClass(sequelize, model, service);
    const spy = sinon.spy(entitiesService, 'create');
    await entitiesService.storeData(exampleStoreDataInput);

    expect(spy.called).to.false;
  });

  it('Should commit transaction if all is ok', async () => {
    const service = { ...profilesService, readByUrl: () => {} };
    const entitiesService = new EntitiesServiceClass(sequelize, model, service);
    await entitiesService.storeData(exampleStoreDataInput);

    expect(transactionCommited).to.true;
  });

  it('Should call findAll on model when readAll is called', async () => {
    const item = { a: 1 };
    const service = { ...profilesService, readByUrl: () => item };
    const entitiesService = new EntitiesServiceClass(sequelize, model, service);
    const spy = sinon.spy(model, 'findAll');
    await entitiesService.readAll();

    expect(spy.called).to.true;
  });
});
