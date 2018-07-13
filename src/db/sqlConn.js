let mysql = require('mysql');
const cfg = require ('../../config/app.js');

let conn = mysql.createConnection(
    cfg.mysql
);

conn.connect(function (err) {
    if(err) {
        console.log('mysql connect failed! : err'+err);
    }
    console.log('mysql connect success!');
});

module.exports = conn;

function handleError (err) {
    if(err) {
        if(err.code === 'PROTOCOL_CONNECTION_LOST') {
            connect();
        }else{
            console.error(err.stack || err);
        }
    }
}

function connect () {
    db = mysql.createConnection(cfg.mysql);
    db.connect(handleError);
    db.on('error',handleError);
}

let db;
connect();
