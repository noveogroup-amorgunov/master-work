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
  comment: String,
  phone: String,
  isActive: {
    type: Boolean,
    default: false
  },
  roles: {
    type: String,
    enum: ['admin', 'user'],
    default: 'user'
  },
}, {
  timestamps: {
    createdAt: 'created_at',
    updatedAt: 'updated_at',
  }
});

const User = mongoose.model('User', userSchema);
module.exports = User;
