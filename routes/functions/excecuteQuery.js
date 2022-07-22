var con = require("../../database/db");
module.exports = (exe_query) => {
  return new Promise((resolve, reject) => {
    con.query(exe_query, (err, res) => {
      if (err) {
        reject(err);
      } else {
        resolve(res);
      }
    });
  });
};
