const Models = require('../models');

module.exports = {
  get: (request, reply) => {
    Models.Review
      .find({})
      .sort({ created_at: -1 })
      .populate('user')
      .then(reply);
  },

  add: (request, reply) => {
    const user = request.auth.credentials;
    const payload = request.payload;
    if (user) {
      payload.user = user.id;
    }

    Models.Review
      .create(payload)
      .then(review => reply({ message: 'Success adding review', review }));
  },

  update: (request, reply) => {
    const id = request.params.id;
    const payload = request.payload;

    Models.Review
      .findOneAndUpdate({ _id: id }, payload, { new: true })
      .then(review => reply({ message: 'Success updating review', review }));
  }

};
