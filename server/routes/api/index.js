const jwt = require('jsonwebtoken');
const Models = require('../../models');
const mail = require('../../helpers/email');

const addRoute = (routes, route) => {
  routes.push(route);
};

const getToken = (id, key) => {
  const secretKey = key || process.env.KEY || 'stubJWT';
  return jwt.sign({ id }, secretKey, { expiresIn: '99 days' });
};


exports.register = (server, options, next) => {
  const routes = [];
  const route = addRoute.bind(null, routes);

  route({
    method: 'POST',
    path: '/login',
    config: { auth: false },
    handler(request, reply) {
      const { email, password } = request.payload;
      return Models.User.findOne({ email })
        .then((user) => {
          if (!user) {
            return reply({ message: 'User not found' });
          }
          if (!user.isActive) {
            return reply({ message: 'User not active' });
          }
          if (password !== user.password) {
            return reply({ message: 'Password is wrong' });
          }
          const data = user.toObject();
          data.isAdmin = data.roles === 'admin';
          return reply({ token: getToken(user.id), user: data });
        })
        .catch(console.error);
    }
  });

  route({
    method: 'POST',
    path: '/signup',
    config: { auth: false },
    handler(request, reply) {
      const { email } = request.payload;
      return Models.User.findOne({ email })
        .then((foundedUser) => {
          if (foundedUser) {
            return reply({ message: 'This user has already existed' });
          }
          request.payload.isActive = false;
          request.payload.roles = 'user';

          Models.User.create(request.payload).then((user) => {
            return reply({ token: getToken(user.id), user });

            const subject = 'Спасибо за регистрацию';
            const mailbody = `
              <p>
                Добрый день, ${user.firstname},<br>
                Вы успешно зарегистрировались в Scu-Permutate платформе для выполнения задач на суперкомпьютере.
              </p>
              <p>
                Рекомендуем прочитать: <b><a href="${process.env.PROXY}/help">Как пользоваться системой</a></b> перед началом работы.<br/>
                Перед началом работы ваш аккаунт должен подтвердить администратор.
              </p>
              <p>
                Перейти в личный кабинет: ${process.env.PROXY}/dashboard<br>
                Добавить новую задачу: ${process.env.PROXY}/add<br>
              </p>
            `;

            return mail({ mailbody, subject, to: user.email }).then(() => {
              reply({ token: getToken(user.id), user });
            });
          });
        })
        .catch(console.error);
    }
  });

  routes.push({
    method: 'GET',
    path: '/me',
    handler(request, reply) {
      const { email } = request.auth.credentials;
      return Models.User.findOne({ email })
        .then(user => reply(user))
        .catch(console.error);
    }
  });

  routes.push({
    method: 'POST',
    path: '/change-password',
    handler(request, reply) {
      const { email } = request.auth.credentials;
      return Models.User.findOne({ email })
        .then((user) => {
          if (user.password !== request.payload.old_password) {
            return reply({ code: '404', message: 'Old password is wrong' });
          }
          user.password = request.payload.password;
          user.save().then(() => {
            reply({});
          });
        });
    }
  });


  routes.push({
    method: 'GET',
    path: '/servers',
    handler(request, reply) {
      return reply({ hello: "world" });
    }
  });


  routes.push({
    method: 'POST',
    path: '/tasks',
    handler(request, reply) {
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
  });

  // routes.push({
  //   method: 'GET',
  //   path: '/test',
  //   config: { auth: false },
  //   handler(request, reply) {
  //     Promise.all([
  //       Models.Program.create({ name: 'Перестановочный тест', isActive: true }),
  //       Models.Server.create({ name: 'Тестовый сервер', isAvailable: true }),
  //       Models.Server.create({ name: 'Кластер суперкомпьютера', isAvailable: false }),
  //     ]).then(() => reply({}));
  //   }
  // });


  routes.push({
    method: 'GET',
    path: '/users',
    handler(request, reply) {
      const user = request.auth.credentials;
      if (user.scope === 'admin') {
        return Models.User
          .find()
          .sort({ created_at: -1 })
          .then(users => reply(users));
      }
      return reply.forbidden();
    }
  });

  routes.push({
    method: 'DELETE',
    path: '/users/{id}',
    handler(request, reply) {
      const id = request.params.id;

      const user = request.auth.credentials;
      if (user.scope === 'admin') {
        return Models.User
          .remove({ _id: id })
          .then(() => {
            reply({ result: 'success', code: '204' });
          });
      }
      return reply.forbidden();
    }
  });

  routes.push({
    method: 'POST',
    path: '/users/{id}/{action}',
    handler(request, reply) {
      const id = request.params.id;
      const active = request.params.action === 'active';

      if (request.auth.credentials.scope === 'admin') {
        return Models.User
          .findOneAndUpdate({ _id: id }, { $set: { isActive: active } }, { new: true })
          .then((user) => {
            let subject;
            let mailbody;

            if (user.isActive) {
              subject = 'Активация аккаунта';
              mailbody = `
                <p>
                  Добрый день, ${user.firstname},<br>
                  Ваш аккаунт успешно подвержден в <i>Scu-Permutate</i> платформе для выполнения задач на суперкомпьютере.
                </p>
                <p>
                  Рекомендуем прочитать: <b><a href="${process.env.PROXY}/help">Как пользоваться системой</a></b> перед началом работы.<br/>
                </p>
                <p>
                  Перейти в личный кабинет: ${process.env.PROXY}/dashboard<br>
                  Добавить новую задачу: ${process.env.PROXY}/add<br>
                </p>
              `;
            } else {
              subject = 'Ваш аккаунт был заблокирован';
              mailbody = `
                <p>
                  Добрый день, ${user.firstname},<br>
                  Ваш аккаунт был заблокирован администратором системы.
                </p>
              `;
            }

            return mail({ mailbody, subject, to: user.email }).then(() => {
              reply(user);
            });
          });
      }
      return reply.forbidden();
    }
  });


  routes.push({
    method: 'GET',
    path: '/tasks',
    handler(request, reply) {
      const user = request.auth.credentials;
      Models.Task
        .find({ user: user.id })
        .sort({ created_at: -1 })
        .then((tasks) => {
          return reply(tasks);
        });
    }
  });


  routes.push({
    method: 'GET',
    path: '/tasks/{id}',
    handler(request, reply) {
      const id = request.params.id;
      Models.Task
        .findOne({ _id: id })
        .populate('server')
        .populate('program')
        .then((task) => {
          return reply(task);
        });
    }
  });

  server.route(routes);
  next();
};

exports.routes = { prefix: '/api' };
exports.register.attributes = {
  name: 'api-routes',
  version: '1.0.1'
};
