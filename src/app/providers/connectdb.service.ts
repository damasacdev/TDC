import { Injectable } from '@angular/core';
import { SqliteDB } from './sqliteDB';
import { Database } from '../models/Database';
import { MysqlService } from './mysql.service';
@Injectable()
export class ConnectdbService {

  constructor(private sqlite:SqliteDB, private mysqlService:MysqlService) { }
  Connections(){
    let config = this.sqlite.getFindAll('config_sql');
    
			/*************************************** get ข้อมูล config database ********************************************/
  	  if(config.length != 0){
        	Database.prototype.id = config[0].id;
    			Database.prototype.username = config[0].users;
    			Database.prototype.password = config[0].passs;
    			Database.prototype.host = config[0].hosts;
    			Database.prototype.dbname = config[0].dbnames;
    			Database.prototype.port = config[0].ports;
    			Database.prototype.histype = config[0].histypes;
    			Database.prototype.charset = config[0].chars;
    			Database.prototype.dbtype = config[0].dbtypes;
    
          this.mysqlService.setHost(Database.prototype.host);
    			this.mysqlService.setUser(Database.prototype.username);
    			this.mysqlService.setPass(Database.prototype.password);
    			this.mysqlService.setPort(Database.prototype.port);
    			this.mysqlService.setDbname(Database.prototype.dbname);

    			if(Database.prototype.host != "" && this.mysqlService.getConnectDb()){
             console.log("Connection database success Server = "+Database.prototype.host+" Database Name: "+Database.prototype.dbname);
          }
         
      }
     
  }//connection database mysql , sqlserver, oracle
}
