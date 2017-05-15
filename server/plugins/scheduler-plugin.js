const schedule = require('node-schedule');
const Models = require('../models');
const exec = require('./exec-task');
const mail = require('../helpers/email.js');

// 0,30 * * * *   =>   every 30 minutes
// 0 * * * *   =>   every hour
// 0 */2 * * *   =>   every 2 hours

exports.register = (server, options, next) => {
  schedule.scheduleJob('* * * * *', () => {
    Models.Task
      .find({ status: 'new' })
      .populate('server')
      .populate('program')
      .populate('user')
      .then((tasks) => {
        if (!tasks.length) {
          console.log('not new tasks');
          return;
        }
        tasks.forEach((task) => {
          // console.log(task);
          console.log(`Execute new task ${task.name} (${task.id})`);
          let path = '';
          const username = `${task.user.firstname} ${task.user.secondname}`;

          if (task.server.isAvailable && task.program.isActive) {
            const startTime = Date.now();
            return exec(task)
              .then((fileName) => {
                path = fileName;
                task.status = 'done';
                task.outputFile = fileName;
                task.exucatedTime = Date.now() - startTime;
                return task.save();
              })
              .then(() => {
                const subject = `Успешное выполнение задачи ${task.name}`;
                const mailbody = `
                  <p>
                    Добрый день, ${username},<br>
                    Ваша задача "${task.name}" была выполнена.
                  </p>
                  <p>
                    Перейти в личный кабинет: ${process.env.PROXY}/dashboard<br>
                    Выгрузить результаты: ${process.env.PROXY}/uploads/${path}
                  </p>
                `;

                return mail({ mailbody, subject, to: task.user.email });
              })
              .catch(console.error);
          }

          task.status = 'error';
          task.error = 'Server is unavailable';

          const sendErrorMail = () => {
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

          return Promise.all([task.save(), sendErrorMail()]);
        });
      });
  });

  next();
};

exports.register.attributes = {
  name: 'schedule-plugin'
};
