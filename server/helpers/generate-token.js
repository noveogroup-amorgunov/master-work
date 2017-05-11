const jwt = require('jsonwebtoken');

const getToken = (id, key) => {
  const secretKey = key || process.env.KEY || 'stubJWT';
  return jwt.sign({ id }, secretKey, { expiresIn: '99 days' });
};

module.exports = getToken;
