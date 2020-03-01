import _ from 'lodash';

const noEnvFile = process.env.NO_ENVFILE;
const nodeEnv = process.env.NODE_ENV;

if (_.isNil(noEnvFile)) {
  require('dotenv').config();
}

module.exports = {
  nodeEnv,
};
