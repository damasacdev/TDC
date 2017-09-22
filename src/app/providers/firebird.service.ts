var firebird = require('node-firebird-dev');
import { Database } from '../models/Database';
import { Observable, Subject, ReplaySubject } from 'rxjs/Rx';
/*********************** ตัวแปรสำหรับเก็บค่า Config Database *******************************/
var options = {
    host: '127.0.0.1',
    port: 3050,
    database: 'E:\\FB\\CLOUD.FDB',
    user: 'SYSDBA',
    password: '12345',
    role: null,            // default
    pageSize: 4096,        // default when creating database
    timeout: 3000  
};

export class FirebirdService {
    /*********************** Set data connect database รับค่า parameter *******************************/
    //setEncode(encode){this.encode = encode;}
    //setHost(host) { options.host = host; }
    setUser(user) { options.user = user; }
    setPass(pass) { options.password = pass; }
    //setPort(port) { options.port = port; }
    setDbname(dbname) { options.database = dbname }
    setConnectDb(data) {//data={Host:'',Username:'',Password:''}
       // options.host = data.Host;
        options.user = data.Username;
        options.password = data.Password;
        //options.port = data.Port;
        options.database = data.databas;
    }

    /*********************** Get data connect database *******************************/
    //getEncode(){return options.encode; }
    //getHost() { return options.host; }
    getUser() { return options.user; }
    getPass() { return options.password; }
    getDbname() { return options.database; }
    //getPort() { return options.port; };

    getConnectDb() {
        let db = Database.prototype;
    }//

    /*********************** Show of Select database. *******************************/
    showDatabase() {
        let sql = "SHOW DATABASES;";
        return new Promise((resolve, reject) => {

        });

    }//showDatabase
    Closes() {

    }
    /*********************** Run Query sql. *******************************/
    runQuery(sql: any) {
        return new Promise((reject, resolve) => {
            firebird.attach(options, function (err, db) {
                if (err)
                    throw err;

                db.query(sql, function (err, result) {
                    if (err) { reject(err); }
                    if (result) { resolve(result); }
                    db.detach();
                });
            });
        });
    }

    runQueryPool(sql, number) {
        return new Promise((reject, resolve) => {
            var pool = firebird.pool(number, options);
            pool.get(function (err, db) {
                if (err)
                    throw err;
                // db = DATABASE 
                db.query(sql, function (err, result) {
                    if (err) { reject(err); }
                    if (result) { resolve(result); }
                    db.detach();
                });
            });
        });
    }

    /*********************** Test connection database *******************************/
    public TestConnection() {
            console.log(options.database);
             firebird.attach(options, function (err, db) {
            if (err)
                throw err;
            
            db.query('select name from users;', function (err, result) {
                if (result) { alert("Success"); }
                if (err) { alert("Error " + err); }
                db.detach();
            });
        });
       
    }
}