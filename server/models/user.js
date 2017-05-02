const mongoose = require('mongoose');

mongoose.Promise = global.Promise;
const Schema = mongoose.Schema;

const userSchema = new Schema({
  email: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true
  },
  firstname: String,
  secondname: String,
  job: String,

  roles: {
    type: String,
    enum: ['admin', 'user'],
    default: 'admin'
  },
}, {
  timestamps: {
    createdAt: 'created_at',
    updatedAt: 'updated_at',
  }
});

const User = mongoose.model('User', userSchema);
module.exports = User;
