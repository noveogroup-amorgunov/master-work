// const sys = require('sys')
const exec = require('child_process').exec;
const fs = require('fs');
const path = require('path');
const shortid = require('shortid');
const copy = require('../helpers/copy');



// function puts(error, stdout, stderr) {
//   sys.puts(stdout);
// }

module.exports = function execTask(task) {
  return new Promise((resolve, reject) => {
    // const stream = fs.createWriteStream('my_file.txt');
    // stream.once('open', (fd) => {
    //   stream.write(task.config || '');
    //   stream.end();
    // });

    fs.writeFile(path.join(__dirname, '../programs/permutation-test/config.txt'), task.config || '', (err) => {
      if (err) {
        return reject(err);
      }

      console.log('The file was saved!');
      exec(path.join(__dirname, '../programs/permutation-test/run.sh'), (err, stdout, stderr) => {
        if (err) {
          reject(err);
        }
        // console.log(typeof stdout);
        if (stdout.split(/\r?\n/).pop() === 'success') {
          // copy output file to uploads
          const source = path.join(__dirname, '../programs/permutation-test/output.txt');
          const fileName = shortid.generate();
          const target = path.join(__dirname, `../uploads/${fileName}`);
          copy(source, target, (err) => {
            if (err) {
              return reject(err);
            }
            resolve(fileName);
          });
        } else {
          reject(stdout);
        }
      });
    });
  });
};
