import { Injectable } from '@angular/core';
const pg = require('pg');
import { Database } from '../models/Database';
@Injectable()
export class Postgress {
    private user: string;
    private password: string;
    private host: string;
    private externalAuth: false;
    private config: any;
    private ports: any;


    getConnectDb() {
        let db = Database.prototype;
        this.config = {
            user: db.username,
            database:db.dbname,
            password: db.password,
            host: db.host,
            port: db.port,
            externalAuth: this.externalAuth
        };
        return new pg.Pool(this.config);
    }//connection database 
    showDatabase() {
        let sql = "SELECT datname FROM pg_database";
        return new Promise((resolve, reject) => {
            this.getConnectDb().query(sql, (err, data) => {
                if (err) { reject(err); }
                if (data) { resolve(data.rows); }
            });
        });
    }
    runQuery(sql){
        return new Promise((resolve, reject) => {
            this.getConnectDb().query(sql, (err, data) => {
                if (err) { reject(err); }
                if (data) { resolve(data.rows); }
            });
        });
    }


}

