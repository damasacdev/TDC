const mysql = require('mysql');
import { Database } from '../models/Database';
import {Observable, Subject, ReplaySubject } from 'rxjs/Rx';
export class MysqlService{
    /*********************** ตัวแปรสำหรับเก็บค่า Config Database *******************************/
    private host:string;
    private user:string;
    private pass:string;
    private port:string;
    private dbname:string;
    public connectionString:any;
    public encode:any;

    /*********************** Set data connect database รับค่า parameter *******************************/
    setEncode(encode){this.encode = encode;}
    setHost(host){this.host = host;}
    setUser(user){this.user=user;}
    setPass(pass){this.pass=pass;}
    setPort(port){this.port=port;}
    setDbname(dbname){this.dbname=dbname; this.getConnectDb();}
    setConnectDb(data){//data={Host:'',Username:'',Password:''}
        this.host = data.Host;
        this.user = data.Username;
        this.pass = data.Password;
        this.port = data.Port;
        
    }

    /*********************** Get data connect database *******************************/ 
    getEncode(){return this.encode; }
    getHost(){return this.host;}
    getUser(){return this.user;}
    getPass(){return this.pass;}
    getDbname(){return this.dbname;} 
    getPort(){return this.port;};
    
    getConnectDb(){
      let db = Database.prototype;
      return this.connectionString = mysql.createConnection({
            host:db.host,
            port:db.port,
            user:db.username,
            password:db.password,
            database:''//db.dbname
        });    
    }//

    /*********************** Show of Select database. *******************************/ 
    showDatabase(){
        let sql="SHOW DATABASES;";
        return new Promise((resolve,reject)=>{
            this.connectionString.query(sql,(err,rows)=>{
                if(err){reject(err);}
                if(rows){resolve(rows);}
            });           
            this.Closes();
        }); 
    }//showDatabase
    
   Closes(){
       this.connectionString.end();
   }
/*********************** Run Query sql. *******************************/ 
    runQuery(sql:any){
        return new Promise((resolve, reject)=>{
            this.connectionString.query(sql,(err,data)=>{
               if(err){reject(err);}
               if(data){resolve(data);} 
            });
            this.connectionString.end();
        });
    }
    


    /*********************** Test connection database *******************************/
    public TestConnection(){
        this.connectionString.query('show databases;',(err,success)=>{
           if(success){alert("Success");}
           if(err){alert("Error "+err); }    
        });
    }



}