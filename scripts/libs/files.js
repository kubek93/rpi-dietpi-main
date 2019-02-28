//
// Source: https://stackoverflow.com/questions/40593875/using-filesystem-in-node-js-with-async-await
//

const fs = require("fs");

const readFile = (path, opts = "utf8") =>
  new Promise((resolve, reject) => {
    fs.readFile(path, opts, (err, data) => {
      if (err) reject(err);
      else resolve(JSON.parse(data));
    });
  });

const writeFile = (path, data, opts = "utf8") =>
  new Promise((resolve, reject) => {
    fs.writeFile(path, data, opts, err => {
      if (err) reject(err);
      else resolve();
    });
  });

module.exports = {
  readFile,
  writeFile
};
