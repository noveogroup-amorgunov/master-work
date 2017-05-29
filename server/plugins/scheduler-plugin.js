const schedule = require('node-schedule');
const Models = require('../models');
const exec = require('./exec-task');
const { sendMailTaskSuccessExucate, sendMailTaskErrorExucate } = require('../templates');


const retrainNetwork = () => {
  return Promise.resolve();
};

const loadInputsParams = () => {
  return Promise.resolve();
};

const getExucatedTime = () => {
  return Promise.resolve();
};

const getExucatedClusterTime = () => {
  return Promise.resolve();
};

const selectServer = () => {
  return Promise.resolve();
};

const getTask = () => {
  return Models.Task
    .find({ status: 'new' })
    .populate('server')
    .populate('program')
    .populate('inputFile')
    .populate('config')
    .populate('user');
};

// 0,30 * * * *   =>   every 30 minutes
// 0 * * * *   =>   every hour
// 0 */2 * * *   =>   every 2 hours

const handleError = (task, err) => {
  logger.pushError(`Error while task (${task.id}) was exucated: ${err.message}`);
  task.status = 'error';
  task.error = 'Server is unavailable';
  return Promise.all([task.save(), sendMailTaskErrorExucate(task)]);
};

exports.register = (server, options, next) => {
  schedule.scheduleJob('* * * * *', () => {
    getTask()
      .then((tasks) => {
        if (!tasks.length) {
          // console.log('not new tasks');
          return;
        }

        // return;
        tasks.forEach((task) => {
          const username = `${task.user.firstname} ${task.user.secondname}`;
          logger.push(`[${task.id}] Start exucate task "${task.name}" by ${username}`);


          logger.push(`[${task.id}] Task will be send to server (automatically)..`);
          logger.push(`[${task.id}] Estimated run time: (time)`);

          let selectedServer = task.server;
          let promise = () => Promise.resolve();

          // select server
          if (!selectedServer || task.selectBestServer) {
            // 1. get inputs params // const inputs = {};
            // 2. get time from network const time = network.run;
            // 3. compare cluster and server times
            // 4. choose right server
            // 5. IN EXEC run nessasary bash script.
            // 6. retrain network

            let time = null;
            let clusterTime = null;

            promise = () => {
              return loadInputsParams(task)
                .then(inputs => getExucatedTime(inputs, task))
                .then((_time) => { time = _time; return getExucatedClusterTime(time, task); })
                .then((_clusterTime) => { clusterTime = _clusterTime; return selectServer(clusterTime, time, task); });
            };
          }

          // todo is server == -1. don't used it
          // if (/* task.server.isAvailable && */ task.program.isActive) {
          // }
          // return handleError(task);

          const startTime = Date.now();
          task.status = 'working';
          return promise()
            .then(() => task.save())
            .then(() => {
              return exec(task)
                .then((outputFile, time) => {
                  task.status = 'done';
                  task.outputFile = outputFile;
                  task.exucatedTime = Date.now() - startTime;

                  logger.push(`[${task.id}] Task was exucated. Exucated time: ${task.exucatedTime}ms`);
                  return task.save();
                })
                .then(sendMailTaskSuccessExucate.bind(null, task))
                .then(retrainNetwork(null, task))
                .catch(err => handleError(task, err instanceof Error ? err : new Error(err)));
            });
        });
      })
      .catch(console.err);
  });

  next();
};

exports.register.attributes = {
  name: 'schedule-plugin'
};
