import { Model, DataTypes } from 'sequelize';
import Entity from './entity';

export default class Profile extends Model {
  static init(sequelize) {
    return super.init(
      {
        id: {
          type: DataTypes.UUID,
          defaultValue: DataTypes.UUIDV4,
          primaryKey: true,
        },
        url: {
          type: DataTypes.STRING,
          allowNull: false,
        },
        entityType: {
          type: DataTypes.STRING,
          allowNull: false,
        },
        linksTo: {
          type: DataTypes.STRING,
        },
      },
      { sequelize },
    );
  }

  static associate() {
    this.belongsTo(Entity, { foreignKey: 'entityId' });
  }
}
