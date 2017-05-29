const Models = require('../models');

module.exports = {
  get: (request, reply) => {
    Models.Log
      .find({})
      .sort({ created_at: -1 })
      .limit(5)
      .then(reply);
  },

  loadToFile: (request, reply) => {
    reply({});
  },

  clear: (request, reply) => {
    reply({});
  },
};
