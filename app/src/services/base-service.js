export const DEFAULT_EXCLUDED_FIELDS = ['createdAt', 'updatedAt'];
export const DEFAULT_OPTIONS = { attributes: { exclude: DEFAULT_EXCLUDED_FIELDS } };

export default class BaseService {
  sequelize;
  model;
  options;

  constructor(sequelize, model) {
    this.sequelize = sequelize;
    this.model = model;
    this.options = DEFAULT_OPTIONS;
  }

  async create(transaction, params, excludedFields = DEFAULT_EXCLUDED_FIELDS) {
    if (!transaction) throw new Error('Transaction is required!');

    try {
      const item = await this.model.create(params, { transaction });
      const parsedItem = item.toJSON();
      excludedFields.forEach(field => delete parsedItem[field]);
      return parsedItem;
    } catch (error) {
      transaction.rollback();
      throw error;
    }
  }

  async findOrCreate(transaction, params, where, excludedFields = DEFAULT_EXCLUDED_FIELDS) {
    if (!transaction) throw new Error('Transaction is required!');

    try {
      const defaults = { ...params };
      const item = await this.model.findOrCreate({ where, defaults, transaction });
      const parsedItem = item[0].toJSON();
      excludedFields.forEach(field => delete parsedItem[field]);
      return parsedItem;
    } catch (error) {
      transaction.rollback();
      throw error;
    }
  }

  async readAll(options = this.options) {
    const result = await this.model.findAll(options);
    return result && result.map(item => item.toJSON());
  }
}
