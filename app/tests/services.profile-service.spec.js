import chai from 'chai';
import sinon from 'sinon';

import { ProfilesServiceClass } from '../src/services';

const expect = chai.expect;

describe('BaseService', () => {
  it('Should call findAll on model when readAll is called', async () => {
    const sequelize = { transaction: () => ({ rollback: () => {}, commit: () => {} }) };
    const model = { findOne: sinon.spy() };
    const profileService = new ProfilesServiceClass(sequelize, model);
    await profileService.readByUrl();
    expect(model.findOne.called).to.true;
  });
});
