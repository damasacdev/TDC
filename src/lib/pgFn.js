const pg = require('pg');

var con;
var config = {};
var PgConnection = {};

PgConnection.Config = function Config(host, user, pass, db, port) {
    config = {
        user: user,
        password: pass,
        server: host,
        database: db,
        port: port,
        externalAuth: this.externalAuth
    };

    // return config;
}

PgConnection.showDatabase = function showDatabase() {
    let sql = "SELECT datname FROM pg_database";

    return new Promise((resolve, reject) => {
        con = new pg.Pool(config);
        // con.connect();
        con.query(sql, (err, data) => {
            if (err) {
                // con.end();
                reject(err);
            }
            if (data) {
                // con.end();
                resolve(data.rows);
            }
        });

        con.end();
    });
}
PgConnection.querySql = function querySql(sql) {

    return new Promise((resolve, reject) => {

        con = new pg.Pool(config);
        // con.connect();
        con.query(sql, (err, data) => {
            if (err) {
                // con.end();
                reject(err);
            }
            if (data) {
                // con.end();
                resolve(data.rows);
            }
        });
        con.end();
    });
}

module.exports = PgConnection;