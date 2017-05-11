const Models = require('../models');
const mail = require('../helpers/email');

module.exports = {
  delete: (request, reply) => {
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
  },

  get: (request, reply) => {
    const user = request.auth.credentials;
    if (user.scope === 'admin') {
      return Models.User
        .find()
        .sort({ created_at: -1 })
        .then(users => reply(users));
    }
    return reply.forbidden();
  },

  me: (request, reply) => {
    const { email } = request.auth.credentials;
    return Models.User
      .findOne({ email })
      .then(user => reply(user))
      .catch(console.error);
  },

  changePassword: (request, reply) => {
    const { email } = request.auth.credentials;
    return Models.User
      .findOne({ email })
      .then((user) => {
        if (user.password !== request.payload.old_password) {
          return reply({ code: '404', message: 'Old password is wrong' });
        }
        user.password = request.payload.password;
        user.save().then(() => {
          reply({});
        });
      });
  },

  changeStatus: (request, reply) => {
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
};
