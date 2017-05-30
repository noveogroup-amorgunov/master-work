// const sys = require('sys')
const exec = require('child_process').exec;
const fs = require('fs');
const path = require('path');
const shortid = require('shortid');
const ncp = require('ncp').ncp;
const moment = require('moment');
const mkdirp = require('mkdirp');

const copy = require('../helpers/copy');
const { makeName, makeFolderName, makeUrl, uploadFile } = require('../helpers/upload');

ncp.limit = 16;

// prepare (copy input file and config file to new temp directory to send to ssh)
module.exports = function execTask(task) {
  return new Promise((resolve, reject) => {

    const source = path.join(__dirname, '../programs/permutation-test');
    const folderName = shortid.generate();
    const destination = path.join(__dirname, '../../temp/', folderName);
    // console.log(destination);

    // 1. create folder in temp directory
    return mkdirp(destination, (err) => {
      if (err) {
        return reject(err);
      }

      // 2. copy to this folder files from template (program) hardcode permutation test
      return ncp(source, destination, (err) => {
        if (err) {
          return reject(err);
        }
        // console.log('done!');

        // 3-4. copy config and input with rename file
        return copy(path.join(__dirname, '../../uploads/', task.config.path), `${destination}/config.txt`, (err) => {
          if (err) {
            return reject(err);
          }
          return copy(path.join(__dirname, '../../uploads/', task.inputFile.path), `${destination}/input.txt`, (err) => {
            if (err) {
              return reject(err);
            }

            // + 6. copy this folder by ssh to server (IT'S MOST IMPORTANT POINT)
            // + 6.1 - create bash script for this work
            // + 7. run bash script into ssh for run permutation test
            // 8. send to THIS server file with results
            // 9. save this file in uploads
            // 10. delete temp folder ? (75%)

            logger.push(`[${task.id}] Files was prepared before ${task.sendToCluster ? 'send to cluster' : 'exucate in server'}`);
            
            const scriptName = task.sendToCluster ? 'run.sh' : 'run-local.sh';

            exec(`${destination}/${scriptName} ${folderName}`, (err, stdout, stderr) => {
              if (err) {
                reject(err);
              }
              console.log(stdout);
              const lines = stdout.split(/\r?\n/);
              if (lines[lines.length - 1] === 'success' || lines[lines.length - 2] === 'success') {
                // copy output file to uploads
                const output = makeName('output2.txt', task.user.id);
                const target = path.join(__dirname, '../../uploads/', output);
                // console.log(output, target);
                copy(`${destination}/output2.txt`, target, (err) => {
                  if (err) {
                    return reject(err);
                  }
                  resolve(output);
                });
              } else {
                console.error('ERROR!!!');
                reject(stdout);
              }
            });
          });
        });
      });
    });

  // console.log('The file was saved!');
  // fs.writeFile(path.join(__dirname, '../programs/permutation-test/config.txt'), task.config || '', (err) => {
  //     if (err) {
  //       return reject(err);
  //     }
  //   });

  // function puts(error, stdout, stderr) {
  //   sys.puts(stdout);
  // }
  });
};
