import { Injectable } from '@angular/core';
import { SqliteDB } from '../../providers/sqliteDB';
@Injectable()
export class SettingDatabase {

    constructor(
        private sqlite: SqliteDB
    ) { }

    public getfindAll(table) {
        return this.sqlite.getFindAll(table);
    }//getfindAll ทำหน้าที่ select ข้อมูลจาก sqlite

    public getQuery(sql) {
        return this.sqlite.Querysql(sql);
    }//getCreateTableSqlite ทำหน้าที่สร้าง Query sqlite ต่างๆ
    public getConnect() {
        return this.sqlite.ConnectDb();
    }
    public getClose() {
        return this.sqlite.Closes();
    }//getClose ทำหน้าที่ปิด sqlite เมื่อทกงานเสร็จ
    public getService_url() {
        let query = this.getQuery("SELECT * FROM buffe_config WHERE name = 'service_url' LIMIT 1");
        return query[0].value;
    }
    public getCreateeRecord(table,data){
        return this.sqlite.Create(table,data).then(res=>{
             console.log("Success");
        }).catch(err=>{
            console.log(err); 
        });
    }//เพิ่มข้อมูล
    public getUpdateRecord(table,data1,data_where){
        return this.sqlite.Update(table,data1,data_where).then(res=>{
            //console.log("Success");
        }).catch(err=>{
            console.log(err); 
        });
    }//แก้ไขข้อมูล
    
    public getTokenLogin() {
       return this.getfindAll("logins")[0].access_token;
    }//token login

}