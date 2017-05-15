const Models = require('../models');
const addRoute = require('../helpers/add-route');

const {
  reviewController,
  taskController,
  userController,
  serverController,
  authController,
  programController,
} = require('../controllers/index');

exports.register = (server, options, next) => {
  const routes = [];
  const route = addRoute.bind(null, routes);

  route('POST /login', authController.login, true);
  route('POST /signup', authController.signup, true);

  route('/servers', serverController.get);
  route('POST /servers/{id}/on', serverController.on);
  route('POST /servers/{id}/off', serverController.off);

  route('/users', userController.get);
  route('/me', userController.me);
  route('POST /change-password', userController.changePassword);
  route('POST /users/{id}/{action}', userController.changeStatus);
  route('DELETE /users/{id}', userController.delete);

  route('/tasks', taskController.get);
  route('/tasks/{id}', taskController.getById);
  route('POST /tasks', taskController.add);
  route('DELETE /tasks/{id}', taskController.delete);

  route('/reviews', reviewController.get, true);
  route('POST /reviews/{id}/add-answer', reviewController.addAnswer);
  route('POST /reviews', reviewController.add, true);
  route('PUT /reviews/{id}', reviewController.update);

  route('POST /programs/permutation-test/validate', programController.validate, true);

  route('* /{p*}', (request, reply) => {
    reply.notFound(404);
  });


  route('/test', (request, reply) => {
/*    Promise.all([
      Models.Program.create({ name: 'Перестановочный тест', isActive: true }),
      Models.Server.create({ name: 'Тестовый сервер', isAvailable: true }),
      Models.Server.create({ name: 'Кластер суперкомпьютера', isAvailable: false }),
    ]).then(() => reply({}));*/
  }, true);


  server.route(routes);
  next();
};

exports.routes = { prefix: '/api' };
exports.register.attributes = {
  name: 'api-routes',
  version: '2.0.0'
};
