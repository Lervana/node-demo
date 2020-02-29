const TABLE_NAME = 'Entities';

export default {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable(TABLE_NAME, {
      id: {
        primaryKey: true,
        allowNull: false,
        type: Sequelize.UUID,
      },
      entityType: {
        type: Sequelize.STRING,
        allowNull: false,
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
