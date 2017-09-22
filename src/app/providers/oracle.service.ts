import { Injectable } from '@angular/core';
const oracledb = require('oracledb');
import { Database } from '../models/Database';
@Injectable()
export class OracleService {

    getConnectDb() {
        var config = {
            user: "system",
            password: "oracle",
            connectString: "192.168.99.100:49161",
            externalAuth: false
        };

        let sql = "SELECT * FROM persons";

        oracledb.getConnection(config, function (err, res) {
            res.execute(sql, function (e, r) {
                console.log(r.rows);
            });
        });

    }//connection database 


}


