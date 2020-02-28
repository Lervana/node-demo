/* eslint-disable no-process-env */
import { nodeEnv } from './utils';

const databaseConfig = {
  env: nodeEnv,
  username: process.env.DATABASE_USER,
  password: process.env.DATABASE_PASSWORD,
  host: process.env.DATABASE_HOST,
  port: process.env.DATABASE_PORT,
  database: process.env.DATABASE_NAME,
  dialect: 'postgres',
  native: true,
};

module.exports = {
  development: {
    ...databaseConfig,
  },
  test: {
    ...databaseConfig,
  },
  production: {
    ...databaseConfig,
  },
};
