require('app-module-path/register');
require('dotenv-extended').load();
require('./db');

exports.up = (next) => {
  next();
};

exports.down = (next) => {
  next();
};
