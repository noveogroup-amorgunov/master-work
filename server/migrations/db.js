const mongoose = require('mongoose');

mongoose.set('debug', false);
mongoose.Promise = global.Promise;

if (mongoose.connection.readyState === 0) {
  mongoose.connect(process.env.DB_CONNECT || 'mongodb://root:root@ds039135.mlab.com:39135/sci-permute');
}

module.exports = mongoose;
