const mssql = require('mssql');

var con;
var config = {};
var MssqlConnection = {};

MssqlConnection.Config = function Config(host, user, pass, db, port) {
    config = {
        user: user,
        password: pass,
        server: host,
        database: db,
        // port: port,
        options: {
            encrypt: true
        }
    };

    // return config;

}

/*********************** Show or Select database *******************************/
MssqlConnection.showDatabase = function showDatabase() {

        return new Promise((resolve, reject) => {
            mssql.connect(config, (err) => {

                let sql = "EXEC sp_databases;";

                let request = new mssql.Request();
                request.query(sql, (err, rows) => {
                    if (err) {
                        // mssql.close();
                        reject(err);
                    }
                    if (rows) {
                        // mssql.close();
                        resolve(rows.recordset);
                    }
                });
            });
            mssql.close();
        });
    } //showDatabase

MssqlConnection.querySql = function querySql(sql, con) {
    return new Promise((resolve, reject) => {
        mssql.connect(config, (err) => {
            let request = new mssql.Request();
            request.query(sql, (err, rows) => {
                if (err) {
                    // mssql.close();
                    reject(err);
                }
                if (rows) {
                    // mssql.close();
                    resolve(rows.recordset);
                }
            });
        });
        mssql.close();
    });
}

/*********************** Test connection database *******************************/
MssqlConnection.TestConnection = function TestConnection() {
    connectionString = mssql.connect(config, (err) => {
        if (err) {
            alert("err " + err);
        } else {
            alert('success');
        }
    });
    mssql.close();
}

module.exports = MssqlConnection;