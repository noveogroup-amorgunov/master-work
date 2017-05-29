const mail = require('../helpers/email.js');

const sendMailTaskSuccessExucate = (task, path) => {
  const username = `${task.user.firstname} ${task.user.secondname}`;
  const subject = `Успешное выполнение задачи ${task.name}`;
  const mailbody = `
    <p>
      Добрый день, ${username},<br>
      Ваша задача "${task.name}" была выполнена.
    </p>
    <p>
      Перейти в личный кабинет: ${process.env.PROXY}/dashboard<br>
      Выгрузить результаты: ${process.env.PROXY}/uploads/${task.outputFile}
    </p>
  `;

  return mail({ mailbody, subject, to: task.user.email });
};

module.exports = sendMailTaskSuccessExucate;
