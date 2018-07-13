let Mysql = require('node-mysql-promise');
const cfg = require ('../../config/app.js');
let mysql = Mysql.createConnection(
    cfg.mysql
);

module.exports = mysql;