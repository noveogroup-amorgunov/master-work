const schedule = require('node-schedule');
const fs = require('fs');
const path = require('path');
const brain = require('brain');

const Models = require('../models');
const exec = require('./exec-task');
const { sendMailTaskSuccessExucate, sendMailTaskErrorExucate } = require('../templates');


const config = {
  a: 2.7
};

const retrainNetwork = () => {
  return Promise.resolve();
};

const loadInputsParams = (task) => {
  // detect count of fa and genes
  return new Promise((resolve, reject) => {
    fs.readFile(path.join(__dirname, '../../uploads/', task.inputFile.path), (err, contents) => {
      if (err) {
        return reject(err);
      }
      try {
        const lines = contents.toString().split('\n');
        const genes = lines.length - 1;
        const fa = lines.slice(1, -1).reduce((acc, line) => {
          const items = line.split('	').slice(1, -1).pop().split('; ');
          // console.log(items);
          return acc.concat(items);
        }, []).filter((v, i, a) => a.indexOf(v) === i);

        return resolve({
          genes,
          fa: fa.length,
        });
      } catch (error) {
        reject(error);
      }
    });
  });
};

const loadConfigParams = (task) => {
  return new Promise((resolve, reject) => {
    fs.readFile(path.join(__dirname, '../../uploads/', task.config.path), (err, contents) => {
      if (err) {
        return reject(err);
      }
      try {
        const lines = contents.toString().split('\n');
        return resolve({
          iterations: lines[2],
          permutations: lines[3],
        });
      } catch (error) {
        reject(error);
      }
    });
  });
};

const normalize = (current, max) => current / max;

const getExucatedTime = (task) => {
  const { genes, fa, iterations, permutations } = task.options;

  return Models.Network.findOne({})
    .then((doc) => {
      try {
        const maxTime = doc.options.output;
        const net = new brain.NeuralNetwork();
        net.fromJSON(doc.model);

        const testing = {
          genes: normalize(genes, Math.max(genes, doc.options.genes)),
          iterations: normalize(iterations, Math.max(iterations, doc.options.iterations)),
          permutations: normalize(permutations, Math.max(permutations, doc.options.permutations)),
        };

        const result = net.run(testing);
        task.expectedTime = result.time * maxTime;
        task.expectedTimeServer = task.expectedTime * config.a;
        return Promise.resolve();
      } catch (err) {
        console.error(err);
      }
    });
};

const getExucatedClusterTime = (task) => {
  return Models.Task.find({ status: 'working' }).then((tasks) => {
    task.expectedTimeCluster = task.expectedTime + tasks.reduce((acc, item) => acc + item.expectedTime, 0) + 5;
    return Promise.resolve();
  });
};

const selectServer = (task) => {
  let { expectedTimeServer, expectedTimeCluster } = task.toObject();
  expectedTimeServer = Math.round(expectedTimeServer * 1000) / 1000;
  expectedTimeCluster = Math.round(expectedTimeCluster * 1000) / 1000;

  const P = Math.round(expectedTimeServer / (expectedTimeCluster + expectedTimeServer));

  logger.push(`[${task.id}] Estimated run time on server: ${expectedTimeServer}s`);
  logger.push(`[${task.id}] Estimated run time on cluster: ${expectedTimeCluster}s`);

  const isCluster = !!P && (expectedTimeServer / 1000) > 30;
  logger.push(`[${task.id}] Task will be send to ${isCluster ? 'cluster' : 'server'} (automatically)..`);

  // @todo - don't hardcode it
  task.sendToCluster = isCluster;
  task.server = isCluster ? '5908119b654e3f0e2e6de416' : '5908119b654e3f0e2e6de415';
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
  console.error(err.message);
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

          let selectedServer = task.server;
          let nextPromise = () => Promise.resolve();

          console.log(selectedServer);

          // todo delete this hardcode
          task.sendToCluster = selectedServer && selectedServer.id.toString() === '5908119b654e3f0e2e6de416';

          // select server
          if (!selectedServer || task.selectBestServer) {
            // 1. get inputs params // const inputs = {};
            // 2. get time from network const time = network.run;
            // 3. compare cluster and server times
            // 4. choose right server
            // 5. IN EXEC run nessasary bash script.
            // 6. retrain network


          }

          nextPromise = () => {
            return Promise.all([loadConfigParams(task), loadInputsParams(task)])
              .then(([configInputs, inputs]) => {
                task.options = {
                  genes: inputs.genes,
                  fa: inputs.fa,
                  iterations: configInputs.iterations,
                  permutations: configInputs.permutations,
                };
                console.log(task.options);
                return getExucatedTime(task);
              })
              .then(() => { return getExucatedClusterTime(task); })
              .then(() => { return (!selectedServer || task.selectBestServer) ? selectServer(task) : Promise.resolve(); });
          };

          // todo is server == -1. don't used it
          // if (/* task.server.isAvailable && */ task.program.isActive) {
          // }
          // return handleError(task);

          const startTime = Date.now();
          task.status = 'working';
          return nextPromise()
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
