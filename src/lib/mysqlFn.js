const mysql = require('mysql');

var con;
var config = {};
var MysqlConnection = {};

MysqlConnection.Config = function Config(hots, user, pass, db, port) {
    config = {
        host: hots,
        user: user,
        password: pass,
        database: db,
        port: port,
    };
    // return config;

}

MysqlConnection.Connection = function Connection() {
    con = mysql.createConnection(config);
    con.connect();
    console.log(con);
    con.end();
}

MysqlConnection.getConfig = function getConfig() {
    console.log(config);
}



MysqlConnection.querySql = function(sql) {

    return new Promise((resolve, reject) => {
        setTimeout(() => {
            //(SELECT * FROM user)
            con = mysql.createConnection(config);
            con.connect();
            con.query(sql, (err, rows) => {
                if (err) {
                    reject(err);
                }
                if (rows) {
                    resolve(rows);

                }
            });
            con.end();
        }, 100);
    });
}

MysqlConnection.queryBindParam = function(sql, param) {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            con = mysql.createConnection(config);
            con.connect();

            //('SELECT * FROM user WHERE  id = ? limt ?',[1,10])
            con.query(sql, param, (err, rows) => {
                if (err) { reject(err); }
                if (rows) {
                    resolve(rows);
                    // con.end();
                }
            });

            con.end();

        }, 1000);
    });
}

MysqlConnection.showDatabase = function showDatabase() {
        let sql = "SHOW DATABASES;";
        return new Promise((resolve, reject) => {
            con = mysql.createConnection(config);
            con.connect();
            con.query(sql, (err, rows) => {
                if (err) { reject(err); }
                if (rows) { resolve(rows); }
            });
            con.end();
        });
    } //showDatabase

module.exports = MysqlConnection;