import { Component, OnInit } from '@angular/core';
import { AppComponent } from '../../app.component';
//import { ElectronService } from 'ngx-electron'; , private _electronService: ElectronService
import { SqliteDB } from '../../providers/sqliteDB';
import { RouterModule, Router } from '@angular/router';
import { Observable } from 'rxjs/Rx';
const electron = require('electron');
const ipcMain = electron.ipcMain;
const ipcRenderer = electron.ipcRenderer;

import { LoginModel } from '../../models/Login.model';
import { Database } from '../../models/Database';
import { MysqlService } from '../../providers/mysql.service';
import { WebserviceService } from '../../providers/webservice.service';
import { ConnectdbService } from '../../providers/connectdb.service';
@Component({
	selector: 'app-homes',
	templateUrl: './homes.component.html',
	styleUrls: ['./homes.component.scss'],
	providers:[MysqlService,SqliteDB]
})
export class HomesComponent implements OnInit {
	statusText: string;

	constructor(private router: Router,private webservice:WebserviceService , private conn:ConnectdbService, private mysqlService:MysqlService, private sqliteService: SqliteDB, private app: AppComponent) {
		this.statusText = "wait..."
		this.app.loadCookie();
		this.app.checkQ();
		this.app.showGroupBtnApp();
	}
 
	ngOnInit() {
	   setTimeout(()=>{
		 this.checkSetting();
	   },500);	
	   setTimeout(()=>{
		let checklogin = this.sqliteService.getFindAll("logins");

			if (checklogin.length != 0) {
				/*************************************** get ข้อมูล Login ********************************************/
				LoginModel.prototype.id = checklogin[0].id;
				LoginModel.prototype.username = checklogin[0].username;
				LoginModel.prototype.name = checklogin[0].name;
				LoginModel.prototype.sitecode = checklogin[0].sitecode;
				LoginModel.prototype.hospital = checklogin[0].hospital;
				LoginModel.prototype.service_url = checklogin[0].service_url;
				LoginModel.prototype.access_token = checklogin[0].access_token;

				this.conn.Connections();

				this.app.autoStartFn();
				ipcRenderer.send('app-open',checklogin[0].access_token);
			}
			
		},500);

		

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

	callLongTime() {

		let result = 0;

		for (let i = 0; i < 10000000000; i++) {
			result += i;
		}

		return result;


	}

	





}
