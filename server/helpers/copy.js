const fs = require('fs');

module.exports = function copyFile(source, target, cb) {
  let cbCalled = false;

  function done(err) {
    if (!cbCalled) {
      cb(err);
      cbCalled = true;
    }
  }

  const rd = fs.createReadStream(source);

  rd.on('error', (err) => {
    done(err);
  });

  const wr = fs.createWriteStream(target);

  wr.on('error', (err) => {
    done(err);
  });

  wr.on('close', () => {
    done();
  });

  rd.pipe(wr);
};
