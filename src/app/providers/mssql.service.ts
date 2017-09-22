import { Injectable } from '@angular/core';
const mssql = require('mssql');
import { Database } from '../models/Database';
@Injectable()
export class MssqlService {
   /*********************** ตัวแปรสำหรับเก็บค่า Config Database *******************************/
    private host:string;
    private user:string;
    private pass:string;
    private port:string;
    private dbname:string;
    private config:any;

    public connectionString:any;
    public encode:any;

    /*********************** Set data connect database รับค่า parameter *******************************/
    setEncode(encode){this.encode = encode;}
    setHost(host){this.host = host;}
    setUser(user){this.user=user;}
    setPass(pass){this.pass=pass;}
    setPort(port){this.port=port;}
    setDbname(dbname){this.dbname=dbname.dbname; this.getConnectDb();}

    setConnectDb(data){
        this.host = data.Host;
        this.user = data.Username;
        this.pass = data.Password;
        this.port = data.Port;  
        //this.dbname = data.Dbname; 
    }

  /*********************** Get data connect database *******************************/
    getEncode(){return this.encode; }
    getHost(){return this.host;}
    getUser(){return this.user;}
    getPass(){return this.pass;}
    getDbname(){return this.dbname;} 
    getPort(){return this.port;}

    getConnectDb(){
      let db = Database.prototype;
      return this.config = {
            user: db.username,
            password:db.password,
            server:db.host,  
            database:db.dbname,
            options: {
                encrypt: true  
            }
        };    
    }

    /*********************** Show or Select database *******************************/
    showDatabase(){ 
        let sql="EXEC sp_databases;";
        //mssql.close();
        return new Promise((resolve,reject)=>{
            mssql.connect(this.config,(err)=>{
               let request = new mssql.Request();
                   request.query(sql,(err,rows)=>{
                       if(err){reject(err);}
                       if(rows){resolve(rows.recordset);}
                   });
                  // mssql.close();
            });
        });
        
    }//showDatabase
    showSchema(){
       
        let sql="SELECT * FROM INFORMATION_SCHEMA.SCHEMATA";
        //mssql.close();
         return new Promise((resolve,reject)=>{
            mssql.connect(this.config,(err)=>{
               let request = new mssql.Request();
                   request.query(sql,(err,rows)=>{
                       if(err){reject(err);}
                       if(rows){resolve(rows.recordset);}
                   });
                  // mssql.close();
            });
        });
    }//showDatabase

    runQuery(sql:any){
         mssql.close();
        return new Promise((resolve,reject)=>{
            mssql.connect(this.config,(err)=>{
               let request = new mssql.Request();
                   request.query(sql,(err,rows)=>{
                       if(err){reject(err);}
                       if(rows){resolve(rows.recordset);}
                   });
            });
        });
    }
    
    /*********************** Test connection database *******************************/
    public TestConnection(){
            this.connectionString = mssql.connect(this.config,(err)=>{
                if(err){alert("err "+err);}{
                   alert('success');
                }
            });
    }
}
