import config from 'config';
import { Sequelize } from 'sequelize';

import { log } from '../logger';
import models from './index';

const {
  is_dev,
  database: { database, username, password, host, dialect, port },
} = config;

class DatabaseProvider {
  sequelize;

  constructor() {
    this.sequelize = this.createSequelizeConnectionSync();
    models.forEach(model => model.init(this.sequelize));
    models.forEach(model => model.associate && model.associate());
  }

  createSequelizeConnectionSync = () => {
    log.info(`Database connection: ${database}, ${host}:${port}`.yellow);

    return new Sequelize(database, username, password, {
      host,
      dialect,
      port,
      pool: { max: 5, min: 0, acquire: 30000, idle: 10000 },
      define: { freezeTableName: false, timestamps: true },
      logging: message => log.info(message.grey, 'DB'),
    });
  };

  testConnection = async () => {
    log.info('Testing database connection'.yellow);

    try {
      await this.sequelize.authenticate();
      log.info('Database connected'.yellow);
      return true;
    } catch (error) {
      log.error(`Cannot connect to database: ${error}`);
      return false;
    }
  };

  draw = async () => {
    if (is_dev) {
      const sequelizeErd = require('sequelize-erd');
      const { writeFileSync } = require('fs');

      try {
        const svg = await sequelizeErd({
          source: this.sequelize,
          engine: 'circo',
        });

        writeFileSync('./database-map.svg', svg);
      } catch (error) {
        log.error(error);
      }
    }
  };
}

const databaseProvider = new DatabaseProvider();
export const testDatabaseConnection = databaseProvider.testConnection;
export const sequelize = databaseProvider.sequelize;

databaseProvider.draw();
