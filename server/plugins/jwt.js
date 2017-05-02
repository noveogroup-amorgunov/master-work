const jwt = require('hapi-auth-jwt2');
const { User } = require('../models');

exports.register = (server, options, next) => {
  function validate(decoded, request, cb) {
    // console.log('Validate invoked');
    // console.log(decoded);
    // console.log(request);
    return new Promise(() => {
      User.findOne({ _id: decoded.id })
      .then((user) => {
        if (!user) {
          return cb(null, false);
        }
        // console.log(user);
        // TODO: if user unactive - redirect to verify email page
        const { _id, email } = user;
        return cb(null, true, { scope: 'admin', id: _id, email });
      });
    });
  }

  server.register(jwt, (err) => {
    if (err) { return next(err); }

    server.auth.strategy('jwt', 'jwt', {
      key: process.env.KEY || 'stubJWT',
      validateFunc: validate,
      verifyOptions: { algorithms: ['HS256'] }
    });

    server.auth.default('jwt');
    return next();
  });
};

exports.register.attributes = {
  name: 'auth-jwt',
  version: '1.0.0'
};
