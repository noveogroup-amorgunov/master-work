const Models = require('../models');
const getRouter = require('../helpers/get-router');
const filePayloadConfig = require('../helpers/file-payload-config');

const {
  reviewController,
  taskController,
  userController,
  serverController,
  authController,
  programController,
  logController,
} = require('../controllers/index');

exports.register = (server, options, next) => {
  const routes = [];
  const router = getRouter(routes);

  router.post('/login', authController.login, { auth: false });
  router.post('/signup', authController.signup, { auth: false });

  router('/servers', serverController.get);
  router.post('/servers/{id}/on', serverController.on);
  router.post('/servers/{id}/off', serverController.off);

  router('/users', userController.get);
  router('/me', userController.me);
  router.post('/change-password', userController.changePassword);
  router.post('/users/{id}/{action}', userController.changeStatus);
  router('DELETE /users/{id}', userController.delete);

  router('/tasks', taskController.get);
  router('/tasks/by-user', taskController.getByUser);
  router('/tasks/{id}', taskController.getById);
  router.post('/tasks', taskController.add);
  router.delete('/tasks/{id}', taskController.delete);
  router.post('/tasks/upload-input', taskController.uploadInput, filePayloadConfig);

  router('/reviews', reviewController.get, { auth: false });
  router.post('/reviews/{id}/add-answer', reviewController.addAnswer);
  router.post('/reviews', reviewController.add, { auth: false });
  router.put('/reviews/{id}', reviewController.update);

  router.post('/programs/permutation-test/validate', programController.validate, { auth: false });


  router('/logs', logController.get);

  router('* /{p*}', (request, reply) => {
    reply.notFound(404);
  });


  router('/test', (request, reply) => {
/*    Promise.all([
      Models.Program.create({ name: 'Перестановочный тест', isActive: true }),
      Models.Server.create({ name: 'Тестовый сервер', isAvailable: true }),
      Models.Server.create({ name: 'Кластер суперкомпьютера', isAvailable: false }),
    ]).then(() => reply({}));*/
  }, { auth: false });


  server.route(routes);
  next();
};

exports.routes = { prefix: '/api' };
exports.register.attributes = {
  name: 'api-routes',
  version: '2.1.0'
};
