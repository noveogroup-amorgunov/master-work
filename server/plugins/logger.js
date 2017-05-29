const fs = require('fs');
const Models = require('../models');

const logger = {};

logger.ERROR = 'error';
logger.LOG = 'log';

logger.push = (message, level = logger.LOG) => {
  const time = new Date();

  console[level](`[${time}] ${message}`);

  const log = new Models.Log({ time, level, message });
  return log.save();
};

logger.pushError = (message) => {
  return logger.push(message, logger.ERROR);
};

global.logger = logger;
module.exports = logger;
