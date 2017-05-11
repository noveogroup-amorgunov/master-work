const Models = require('../models');
const mail = require('../helpers/email');
const getToken = require('../helpers/generate-token');

module.exports = {
  login: (request, reply) => {
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
  },

  signup: (request, reply) => {
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

          /* const subject = 'Спасибо за регистрацию';
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
          }); */
        });
      })
      .catch(console.error);
  }
};
