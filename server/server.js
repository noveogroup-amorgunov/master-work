// static dist -p 8081 --spa

require('app-module-path/register');
// loads the environment variables from the .env file
require('dotenv-extended').load();
const Hapi = require('hapi');
const inert = require('inert');
const mongoose = require('mongoose');
const hapiBoomDecorators = require('hapi-boom-decorators');
// const routes = require('./routes');

const routes = require('./routes/routes');
const apiroutes = require('./routes/api');

const jwt = require('./plugins/jwt');
const scheduler = require('./plugins/scheduler-plugin');


mongoose.Promise = Promise;
mongoose.connect(process.env.DB_CONNECT);

const server = new Hapi.Server();
server.connection({
  host: process.env.HOST,
  port: process.env.PORT,
  routes: { cors: true }
});

const plugins = [inert, hapiBoomDecorators, jwt, scheduler]
  .concat(routes)
  .concat(apiroutes);

server.register(plugins, (err) => {
  if (err) {
    console.error('Failed to load a plugin:', err);
  }
});

server.start(() => {
  console.log(`server running at: ${server.info.uri}`);
});
