const sqlite = require('sqlite-cipher');
const path = require('path');
const fs = require('fs');
var dir = require('os').homedir() + "/tdc";
 

export class SqliteDB {

    private conndb: any; 
    public paths: any;
 
    constructor() {
        this.ConnectDb();
    }
    setPath() {//ตั้งค่า path ของ sqlite
        if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir);
        }
        let paths = path.resolve(dir+'/setting.enc');
        return new Promise((resolve, reject) => {
            fs.readFile(paths, function (err, data) {
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
    ConnectDb() {//เชื่อมต่อ sqlite
        try {//ZGFtYXNhYzEyMzQ1
            this.setPath().then(data => {
                this.conndb = sqlite.connect(dir+'/setting.enc', 'Q2hhbnBhbjA3', 'aes-256-ctr');
            }).catch(err => {
                this.conndb = sqlite.connect(dir+'/setting.enc', 'Q2hhbnBhbjA3', 'aes-256-ctr');
            });

        } catch (err) {
            console.log(err);
        }
        return this.conndb;
    }
    /*** ****************************** จัดการข้อมูลการ login ของ user ******************************/
    CreateTable(sql) {//สร้างตาราง 
        if (this.conndb) {
            return this.conndb.run(sql, (res) => {
                if (res.error) { alert("ERROR " + res.error); }
            });
            
        }
        
    }//Create Table
    Querysql(sql) {//สร้างตาราง 
        if (this.conndb) {
            return this.conndb.run(sql);
        }
     
    }//Create Table

    Query(sql) {//query 
        if (this.conndb) {
            return new Promise((resolve, reject) => {
                this.conndb.run(sql, (err, res) => {
                    if (err) { reject(err); }
                    if (res) { resolve(res); }
                });
            });
        }
        
    }//Create Table
    createRecords(table, data) {//บันทึกข้อมูลการ login 
        try {
            return new Promise((resolve, reject) => {
                this.conndb.insert(table, data, (res) => {
                    if (res.error) { reject(res.error); }
                    resolve(res);
                });
            });
        } catch (e) {
            console.log(e);
        }
        
    }//create
    updateRecords(table, data1, id) {
        try {
            //var rows_modified = sqlite.update("COMPANYS",{NAME:"TESTING UPDATE"},{ID:1});
            return new Promise((resolve, reject) => {
                this.conndb.update(table, data1, { id: id }, (res) => {
                    if (res.error) { reject(res.error); }
                    resolve(res);
                });
            });
        } catch (e) {
            console.log(e);
        }
       
    }
    replaceRecords(data, table) {
        console.log(data);
        let sql = "INSERT OR REPLACE INTO " + table + "('name', 'value') VALUES " + data;
        return new Promise((resolve, reject) => {
            this.conndb.run(sql, (res,err) => {
                if (err) { reject(err); }
                if (res) { resolve(res); }
            });
        })

    }

    getFindAll(tables) {//ดึงข้อมูล user ที่่ login มาแสดง
        if (this.conndb) {
            let sql = "SELECT * FROM " + tables;
            return this.conndb.run(sql);
        }
        
    }

    getDropTable(table) {//ลบข้อมูลการ  login
        if (this.conndb) {
            let sql = "DROP TABLE " + table;
            if (this.conndb.run(sql)) {
                console.log('success');
            } else {
                console.log('error');
            }
        }
        
    }
    getRemoveTable(table, data) {
        if (this.conndb) {
            let sql = "DELETE FROM " + table + " WHERE id = ?";
            if (this.conndb.run(sql, [data.id])) {
                console.log('success');
            } else {
                console.log('error');
            }
        }
       
    }
    Create(table, data) {//บันทึกข้อมูลการ login 
        try {
            return new Promise((resolve, reject) => {
                this.conndb.insert(table, data, (res) => {
                    if (res.error) { reject(res.error); }
                    resolve(res);
                });
            });
        } catch (e) {
            console.log(e);
        }
    }//create
    Update(table,data1,data_where){
        try{
            //var rows_modified = sqlite.update("COMPANYS",{NAME:"TESTING UPDATE"},{ID:1});
            return new Promise((resolve, reject) => {
                this.conndb.update(table, data1,data_where, (res) => {
                    if (res.error) { reject(res.error); }
                     resolve(res); 
                });
            });
        }catch(e){
            console.log(e);
        } 
    }
    Closes(){
        this.conndb.close();
    }
    

}//main class