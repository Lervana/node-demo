import { development } from './database';

module.exports = {
  is_dev: true,
  database: development,
  log_level: 'TRACE',
};
