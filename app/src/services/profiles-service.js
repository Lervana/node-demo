import BaseService from './base-service';

export default class ProfilesService extends BaseService {
  constructor(sequelize, model) {
    super(sequelize, model);
  }

  readByUrl = async (url, options = this.options) => {
    const result = await this.model.findOne({ ...options, where: { url } });
    return result && result.toJSON();
  };
}
