require('app-module-path/register');
require('dotenv-extended').load();
require('./db');

const brain = require('brain');
const Models = require('../models');


/**
 * Returns a random integer between min (inclusive) and max (inclusive)
 * Using Math.round() will give you a non-uniform distribution!
 */
function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

const normalize = (current, max) => current / max;

exports.up = (next) => {
  const net = new brain.NeuralNetwork();

  const trainData = [
    { input: { genes: 2257, iterations: 1e3, permutations: 492 }, output: { time: 5 } },
    { input: { genes: 2257, iterations: 4e3, permutations: 1476 }, output: { time: 18 } },
    { input: { genes: 4514, iterations: 7e3, permutations: 2460 }, output: { time: 36 } },
    { input: { genes: 4514, iterations: 5e3, permutations: 2460 }, output: { time: 29 } },
    { input: { genes: 6771, iterations: 10e3, permutations: 3444 }, output: { time: 60 } },
    { input: { genes: 9028, iterations: 5e3, permutations: 3936 }, output: { time: 55 } },
    { input: { genes: 9028, iterations: 5e3, permutations: 4920 }, output: { time: 75 } },
  ];

  const maxTime = Math.max(...trainData.map(i => i.output.time));
  trainData.forEach(i => i.output.time = normalize(i.output.time, maxTime));
  trainData.forEach(i => i.input.genes = normalize(i.input.genes, 2257 * 4));
  trainData.forEach(i => i.input.iterations = normalize(i.input.iterations, 10e3));
  trainData.forEach(i => i.input.permutations = normalize(i.input.permutations, 4920));
  net.train(trainData);

  Models.Network.findOne({})
    .then((doc) => {
      if (!doc) {
        doc = new Models.Network();
      }
      doc.data = trainData;
      doc.options = {
        genes: 9028,
        iterations: 10000,
        permutations: 4920,
        output: 75
      };

      const testing = {
        genes: normalize(getRandomInt(1, 4), 4),
        iterations: normalize(getRandomInt(1, 10), 10),
        permutations: normalize(getRandomInt(1, 10), 10),
      };
      const result = net.run(testing);

      doc.model = net.toJSON();
      return doc.save();
    })
    .then(() => next());
};

exports.down = (next) => {
  next();
};
