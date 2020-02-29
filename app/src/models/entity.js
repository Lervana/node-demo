import { Model, DataTypes } from 'sequelize';

export default class Entity extends Model {
  static init(sequelize) {
    return super.init(
      {
        id: {
          type: DataTypes.UUID,
          defaultValue: DataTypes.UUIDV4,
          primaryKey: true,
        },
        entityType: {
          type: DataTypes.STRING,
          allowNull: false,
        },
      },
      { sequelize },
    );
  }
}
