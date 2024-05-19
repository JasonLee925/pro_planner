const mysql = require("mysql2");

const connection = mysql
  .createConnection({
    host: "localhost",
    user: "root",
    password: "8429",
    database: "IFN554Hoteldb",
    port: 3316
  })
  .promise();

module.exports = connection;