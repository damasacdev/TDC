const sqlite = require('sqlite-cipher');
const path = require('path');
const fs = require('fs');
var os = require('os');
var conndb;
var SqliteConnection = {};
var dir = os.homedir() + "/tdc";

function setPath() { //ตั้งค่า path ของ sqlite

    if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir);
    }
    let paths = path.resolve(dir + '/setting.enc');
    return new Promise((resolve, reject) => {
        fs.readFile(paths, function(err, data) {
            if (err) {
                if (!fs.existsSync(dir)) {
                    fs.mkdirSync(dir);
                }
                reject("err");
            }
            if (data) { resolve("success"); }
        });
    });
}

SqliteConnection.ConnectDb = function ConnectDb() { //เชื่อมต่อ sqlite
        try { //ZGFtYXNhYzEyMzQ1
            setPath().then(data => {
                conndb = sqlite.connect(dir + '/setting.enc', 'Q2hhbnBhbjA3', 'aes-256-ctr');

            }).catch(err => {
                conndb = sqlite.connect(dir + '/setting.enc', 'Q2hhbnBhbjA3', 'aes-256-ctr');

            });

        } catch (err) {
            console.log(err);
        }

    }
    /*** ****************************** จัดการข้อมูลการ login ของ user ******************************/
SqliteConnection.CreateTable = function CreateTable(sql) { //สร้างตาราง 
        if (conndb) {
            return conndb.run(sql, (res) => {
                if (res.error) { alert("ERROR " + res.error); }

            });
        }
    } //Create Table
SqliteConnection.Querysql = function Querysql(sql) { //สร้างตาราง 
        if (conndb) {
            try {
                return conndb.run(sql);
            } catch (ex) {
                return ex;
            }
        }
    } //Create Table

SqliteConnection.Query = function Query(sql) { //query 
        if (conndb) {
            return new Promise((resolve, reject) => {
                conndb.run(sql, (err, res) => {
                    if (err) { reject(err); }
                    if (res) { resolve(res); }
                });
            });
        }
    } //Create Table
SqliteConnection.createRecords = function createRecords(table, data) { //บันทึกข้อมูลการ login 
        try {
            return new Promise((resolve, reject) => {
                conndb.insert(table, data, (res) => {
                    if (res.error) { reject(res.error); }
                    resolve(res);
                });
            });
        } catch (e) {
            console.log(e);
        }
    } //create
SqliteConnection.updateRecords = function updateRecords(table = '', data1 = {}, id = {}) {

    // conndb = ConnectDb();
    //var rows_modified = sqlite.update("COMPANYS",{NAME:"TESTING UPDATE"},{ID:1});
    return new Promise((resolve, reject) => {
        try {
            conndb.update(table, data1, id, (res) => {
                if (res.error) { reject(res.error); }
                resolve(res);
            });
        } catch (e) {
            console.log(e);
        }
    });

}

SqliteConnection.replaceRecords = function replaceRecords(data, table) {
    let sql = "INSERT OR REPLACE INTO " + table + "('name', 'value') VALUES " + data;
    return new Promise((resolve, reject) => {
        conndb.run(sql, (err, res) => {
            if (err) { reject(err); }
            if (res) { resolve(res); }
        });
    })

}

SqliteConnection.getFindAll = function getFindAll(tables) { //ดึงข้อมูล user ที่่ login มาแสดง
    if (conndb) {
        let sql = "SELECT * FROM " + tables;
        return conndb.run(sql);
    }
}

SqliteConnection.getDropTable = function getDropTable(table) { //ลบข้อมูลการ  login
    if (conndb) {
        let sql = "DROP TABLE " + table;
        if (conndb.run(sql)) {
            console.log('success');
        } else {
            console.log('error');
        }
    }
}

SqliteConnection.getRemoveTable = function getRemoveTable(table, data) {
    if (conndb) {
        let sql = "DELETE FROM " + table + " WHERE id = ?";
        if (conndb.run(sql, [data.id])) {
            console.log('success');
        } else {
            console.log('error');
        }
    }
}

SqliteConnection.Update = function Update(table, data1, data_where) {
    try {
        //var rows_modified = sqlite.update("COMPANYS",{NAME:"TESTING UPDATE"},{ID:1});
        return new Promise((resolve, reject) => {
            conndb.update(table, data1, data_where, (res) => {
                if (res.error) { reject(res.error); }
                resolve(res);
            });
        });
    } catch (e) {
        console.log(e);
    }
}

module.exports = SqliteConnection;