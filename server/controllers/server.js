const Models = require('../models');

module.exports = {
  get: (request, reply) => {
    Models.Server
      .find({})
      .sort({ created_at: -1 })
      .then(reply);
  },

  on: (request, reply) => {
    const id = request.params.id;

    console.log('turn on');
    console.log(id);

    Models.Server
      .findOneAndUpdate({ _id: id }, { isAvailable: true }, { new: true })
      .then(server => reply({ message: 'Success turn on server', server }));
  },

  off: (request, reply) => {
    const id = request.params.id;

    Models.Server
      .findOneAndUpdate({ _id: id }, { isAvailable: false }, { new: true })
      .then(server => reply({ message: 'Success turn off server', server }));
  }
};
