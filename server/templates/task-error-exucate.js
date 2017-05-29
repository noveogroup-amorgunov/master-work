const mail = require('../helpers/email.js');

const sendMailTaskErrorExucate = (task) => {
  const username = `${task.user.firstname} ${task.user.secondname}`;
  const subject = `Неуспешное выволнение задачи ${task.name}`;
  const mailbody = `
    <p>
      Добрый день, ${username},<br>
      Ваша задача "${task.name}"" не была выполнена (сообщение ошибки: ${task.error})
    </p>
    <p>
      Перейти в личный кабинет: <a href="${process.env.PROXY}/dashboard">${process.env.PROXY}/dashboard</a><br>
    </p>
  `;

  return mail({ mailbody, subject, to: task.user.email });
};

module.exports = sendMailTaskErrorExucate;
