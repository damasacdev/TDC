import { Component, OnInit } from '@angular/core';
import { AppComponent } from '../../app.component';
//import { ElectronService } from 'ngx-electron'; , private _electronService: ElectronService
import { SqliteDB } from '../../providers/sqliteDB';
import { RouterModule, Router } from '@angular/router';

const electron = require('electron');
const ipcMain = electron.ipcMain;
const ipcRenderer = electron.ipcRenderer;

import { LoginModel } from '../../models/Login.model';
import { Database } from '../../models/Database';
import { MysqlService } from '../../providers/mysql.service';
import { WebserviceService } from '../../providers/webservice.service';
import { ConnectdbService } from '../../providers/connectdb.service';

@Component({
  selector: 'app-tools',
  templateUrl: './tools.component.html',
  styleUrls: ['./tools.component.scss']
})
export class ToolsComponent implements OnInit {

  constructor(private router: Router,private webservice:WebserviceService , private conn:ConnectdbService, private mysqlService:MysqlService, private sqliteService: SqliteDB, private app: AppComponent) {
	 
	}

  ngOnInit() {
    setTimeout(()=>{
		  this.checkSetting();
	  },100);
  }

  checkSetting(){
		 try{
			//alert(LoginModel.prototype.access_token);
			if(this.sqliteService.ConnectDb()){
				let sql="SELECT * FROM config_sql WHERE access_token ='"+LoginModel.prototype.access_token+"' ";
				let check_config = this.sqliteService.Querysql(sql);
				console.log(check_config);
				if(check_config[0].hosts == '' && check_config[0].users == "" && check_config[0].passs==""){
					this.router.navigate(['/setting']);
				}
			}
		 }catch(err){
			 console.log(err);
		 }
	}

}
