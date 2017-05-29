const shortid = require('shortid');
const path = require('path');
const moment = require('moment');
const fs = require('fs');
const mkdirp = require('mkdirp');

module.exports.makeName = function makeName(originalName, userId) {
  // const originalName = !~original.indexOf('?') ? original :
  // original.substr(0, original.indexOf('?'));
  // const ext = path.extname(originalName);
  const extMatch = originalName.match(/[^/]+(txt).*/) || [''];
  const ext = extMatch.pop() || 'txt';
  const name = shortid.generate() + (ext ? `.${ext}` : '');
  const date = moment().format('YYYY-MM-DD');
  return `${userId}/${date}/${name}`;
};

// module.exports.makeFolderName = function makeFolderName() {
//   const name = shortid.generate();
//   const date = moment().format('YYYY-MM-DD');
//   return `${userId}/${date}/${name}`;
// };


module.exports.makeUrl = function makeUrl(name) {
  return `${process.env.PROXY}/uploads/${name}`;
};

module.exports.uploadFile = function uploadFile(data, name) {
  return new Promise((resolve, reject) => {
    const filePath = `uploads/${name}`;
    const dir = filePath.split('/').slice(0, -1).join('/');

    mkdirp(dir, (err) => {
      if (err) {
        console.log('error first');
        reject(err);
        return;
      }
      const file = fs.createWriteStream(filePath);

      file.on('error', reject);
      data.file.pipe(file);
      data.file.on('end', resolve);
    });
  });
};
