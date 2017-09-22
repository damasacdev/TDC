import { Component, OnInit } from '@angular/core';
import { ModalModule } from 'ngx-bootstrap';
import {SqliteDB} from '../../../providers/sqliteDB';
import {MysqlService} from '../../../providers/mysql.service';
import { Database } from '../../../models/Database';
import { Tokken } from '../../../models/tokken';

@Component({
  selector: 'app-newcommand',
  templateUrl: './newcommand.component.html',
  styleUrls: ['./newcommand.component.scss'],
  providers:[SqliteDB,MysqlService]
})
export class NewcommandComponent implements OnInit {

private commandList : any;
  constructor(public sqlite:SqliteDB, public mysqlservice:MysqlService) { 
    setTimeout(()=>{
      this.onQueryCommandMySQL();
    },1000);
  }

  ngOnInit() {
  }

// === Query Command for mysql ===
  onQueryCommandMySQL(){
    this.sqlite.ConnectDb();
    let sitecode = this.sqlite.getFindAll('logins')[0].sitecode;  
    let sqlQuery = "SELECT `presql`, `sql`, status FROM buffe_command WHERE sitecode="+sitecode+" limit 20 ";
    this.mysqlservice.setConnectDb({
        Host: Database.prototype.host,
        Username: Database.prototype.username,
        Password: Database.prototype.password,
        Port: Database.prototype.port,
        DB: Database.prototype.dbname
      });
    this.mysqlservice.setDbname('tdc_webservice');

    this.mysqlservice.runQuery(sqlQuery).then(data=>{
      this.commandList = data;
    }).catch(error=>{
      console.log('command query fail!');
    });
  }

  onExecuteCommandMySQL(){

  }
  //========== mysql ===============

  // === Query Command for mssql ===
  onQueryCommandMSSQL(){

  }

  onExecuteCommandMSSQL(){

  }
  //========== mssql ===============

    // === Query Command for oracle ===
  onQueryCommandOracle(){

  }

  onExecuteCommandOracle(){

  }
  //========== oracle ===============

}
