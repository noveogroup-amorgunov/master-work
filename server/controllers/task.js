const Models = require('../models');
const { makeName, makeUrl, uploadFile } = require('../helpers/upload');

module.exports = {
  getByUser: (request, reply) => {
    const user = request.auth.credentials;
    Models.Task
      .find({ user: user.id })
      .sort({ created_at: -1 })
      .then((tasks) => {
        return reply(tasks);
      });
  },

  get: (request, reply) => {
    Models.Task
      .find({})
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

    if (+payload.server === -1) {
      payload.selectBestServer = true;
      delete payload.server;
    }

    Models.Task.create(payload)
    .then((task) => {
      return reply({ message: 'Success adding task', task });
    });
  },

  uploadInput: (request, reply) => {
    const user = request.auth.credentials;
    const payload = request.payload;

    const isConfig = request.query && request.query.config === '1';
    let isValidConfig = true;

    if (!payload.file) {
      reply.badRequest('File is required');
      return;
    }

    if (isConfig) {
      const config = payload.file._data.toString('utf8');
      const parsed = config.split('\n');
      if (!parsed || parsed.length !== 4) {
        isValidConfig = false;
      }
    }

    const originalName = payload.file.hapi.filename;
    const name = makeName(originalName, user.id);

    uploadFile(payload, name)
      .then(() => {
        const file = new Models.File({
          originalName,
          path: name,
          contentUrl: makeUrl(name),
          contentType: payload.file.hapi.headers['content-type'],
        });

        return file.save();
      })
      .then((entity) => {
        reply({ data: entity, isValidConfig }).code(201);
      })
      .catch((err) => {
        console.log(err);
        console.log(`Uploading file error ${err.message}`);
      });
  },
};
