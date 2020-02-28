const TABLE_NAME = 'LinkedProfiles';

export default {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable(TABLE_NAME, {
      id: {
        primaryKey: true,
        allowNull: false,
        type: Sequelize.UUID,
      },
      profileAId: {
        type: Sequelize.UUID,
        references: {
          model: 'Profiles',
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      },
      profileBId: {
        type: Sequelize.UUID,
        references: {
          model: 'Profiles',
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
