const Models = require('../models');

module.exports = {
  validate: (request, reply) => {
    const msg = request.payload.data;

    // todo
    if (msg.length === 5) {
      reply({ result: true });
    } else {
      reply({ result: false });
    }
  },
};
