const TABLE_NAME = 'Profiles';

export default {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable(TABLE_NAME, {
      id: {
        primaryKey: true,
        allowNull: false,
        type: Sequelize.UUID,
      },
      url: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      entityType: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      linksTo: {
        type: Sequelize.STRING,
      },
      entityId: {
        type: Sequelize.UUID,
        references: {
          model: 'Entities',
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.fn('NOW'),
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.fn('NOW'),
      },
    });
  },
  down: queryInterface => {
    return queryInterface.dropTable(TABLE_NAME);
  },
};
