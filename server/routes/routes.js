const path = require('path');

exports.register = (server, options, next) => {
  const routes = [];

  routes.push({
    method: 'GET',
    path: '/uploads/{param*}',
    config: { auth: false },
    handler: {
      file: request => path.join(__dirname, `../uploads/${request.params.param}`)
    }
  });

  routes.push({
    method: 'GET',
    path: '/resources/{param*}',
    config: { auth: false },
    handler: {
      file: request => path.join(__dirname, `../../dist/${request.params.param}`)
    }
  });

  routes.push({
    method: 'GET',
    path: '/{param*}',
    config: { auth: false },
    handler: {
      file: request => path.join(__dirname, '../../dist/index.html')
    }
  });

  server.route(routes);
  next();
};

exports.register.attributes = {
  name: 'routes',
  version: '1.0.0'
};
