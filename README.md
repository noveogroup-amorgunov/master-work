# Sci-permute project

<p align="left">
   <a href="https://github.com/airbnb/javascript">
    <img src="https://camo.githubusercontent.com/1c5c800fbdabc79cfaca8c90dd47022a5b5c7486/68747470733a2f2f696d672e736869656c64732e696f2f62616467652f636f64652532307374796c652d616972626e622d627269676874677265656e2e7376673f7374796c653d666c61742d737175617265"
         alt="Standart" />
  </a> 
</p>

## Install

```shell
$ npm install
$ npm install nodemon webpack -g
```

Change `.env` config file (`PROXY` - address of server which I used as `ngrok`).


```shell
$ npm run build # build client-side bundle
$ npm start # run server from nodemon
```

```shell
$ ngrok http 4017 # ngrok.exe http 4017
```

```javascript
const brain = require('brain');
const Models = require('../models');

const net = new brain.NeuralNetwork();

const config = {
  ticks: 21600, // 6 * 60 * 60 = 6 hours
  a: 4.1, // acceleration factor
  maxExecuteTime: 12000, // 20 * 60 = 200 minutes
};


/**
 * Return normalize value from 0 to 1
 */
const normalize = (current, max) => {
  return current / max;
}

/**
 * Returns a random integer between min (inclusive) and max (inclusive)
 * Using Math.round() will give you a non-uniform distribution!
 */
function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

/**
 * Generate params for new task
 */
const generateTask = () => {
  return {
    genes: getRandomInt(1, 4) * 2256,
    iterations: getRandomInt(5, 10) * 1000,
    permutations: getRandomInt(2, 40) * 100,
    time: null,
    ticksToEnd: null,
    getTime() {
      if (!this.time) {
        const { genes, iterations, permutations } = this;

        const normalizedData = {
          genes: normalize(genes, Math.max(genes, doc.options.genes)),
          iterations: normalize(iterations, Math.max(iterations, doc.options.iterations)),
          permutations: normalize(permutations, Math.max(permutations, doc.options.permutations)),
        };

        // get time from network
        this.time = net.run(normalizedData)[0] * config.maxExecuteTime;
      }
      return this.time
    }
  };
};

const getStackTime = (queque) => {
  return queque.reduce((time, task) => time + task.getTime(), 0);
};

const hardDay = () => getRandomInt(0, 200) % 200 === 0;
const emptyDay = () => getRandomInt(0, 700) % 700 === 0;

/**
 * Modeling main function
 */
async function simulation(generateTasksFunction) {
  let queque = [];
  let quequeServer = [];

  let taskToServer = 0;
  let taskToCluster = 0;
  let maxQuequeClusterLength = 0;
  let maxQuequeServerLength = 0;

  const stats = [];
  const stats2 = [];

  const networkData = await Models.Network.findOne({});
  net.fromJSON(networkData.model);

  for(let tick = 0; tick < config.ticks; tick++) {
    if (tick % 1000 === 0) {
      stats.push(taskToCluster);
      stats2.push(taskToServer);
    }

    const quequelength = queque.length;
    queque = queque.filter(task => task.ticksToEnd > tick);
    if (queque.length != quequelength) {}

    quequeServer = quequeServer.filter(task => task.ticksToEnd > tick);

    if (generateTasksFunction()) {
      const task = generateTask();
      task.ticksToEnd = tick + task.getTime();
      const serverTime = task.getTime() * config.a;
      const clusterTime = task.getTime() + getStackTime(queque);

      const P = Math.round(serverTime/(clusterTime + serverTime));

      if (!!P) {
        queque.push(task);
        maxQuequeClusterLength = Math.max(maxQuequeClusterLength, queque.length);
        taskToCluster++;
      } else {
        taskToServer++;
        quequeServer.push(task);
        maxQuequeServerLength = Math.max(maxQuequeServerLength, quequeServer.length);

      }
    }
  }

  console.log(stats.join(','));
  console.log(stats2.join(','));

  console.log('end simulation');
  console.log('task count: ' + (taskToServer + taskToCluster));
  console.log('taskToServer: ' + taskToServer);
  console.log('taskToCluster: ' + taskToCluster);
  console.log('maxQuequeClusterLength: ' + maxQuequeClusterLength);
  console.log('maxQuequeServerLength: ' + maxQuequeServerLength);
}

simulation(emptyDay);
// simulation(hardDay);
```
