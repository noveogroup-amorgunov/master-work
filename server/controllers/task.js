const Models = require('../models');

module.exports = {
  get: (request, reply) => {
    const user = request.auth.credentials;
    Models.Task
      .find({ user: user.id })
      .sort({ created_at: -1 })
      .then((tasks) => {
        return reply(tasks);
      });
  },

  getById: (request, reply) => {
    const id = request.params.id;
    Models.Task
      .findOne({ _id: id })
      .populate('server')
      .populate('program')
      .then((task) => {
        return reply(task);
      });
  },

  delete: (request, reply) => {
    const id = request.params.id;

    Models.Task.remove({ _id: id })
    .then(() => reply({ message: 'Success deleting task' }));
  },

  add: (request, reply) => {
    const user = request.auth.credentials;
    const payload = request.payload;
    payload.user = user.id;
    // console.log(payload, user);
    // reply({});

    Models.Task.create(payload)
    .then((task) => {
      return reply({ message: 'Success adding task', task });
    });
  }
};
