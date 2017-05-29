module.exports = {
  payload: {
    output: 'stream',
    parse: true,
    maxBytes: process.env.MAX_UPDOAD_BYTES || 10000000,
    allow: 'multipart/form-data'
  }
};
