import { Component } from '@angular/core';

import { DialogRef, ModalComponent, CloseGuard } from 'angular2-modal';
import { BSModalContext } from 'angular2-modal/plugins/bootstrap';


import { LoginService } from '../../providers/login.service';


//import { CookieService } from '../../providers/cookie.service';
import { WriterService } from '../../providers/writer.service';
const $ = require('../../../assets/jquery/dist/jquery.min.js');
//import * as $ from '../../../assets/jquery/dist/jquery.min.js';
import { ModalDirective } from 'ngx-bootstrap';
import { RouterModule, Router } from '@angular/router';
import { Tokken } from '../../models/tokken';
import { SqliteDB } from '../../providers/sqliteDB';
const path = require('path');
import { LoginModel } from '../../models/Login.model';
import { SettingService } from '../../providers/setting.service';
export class CustomModalContext2 extends BSModalContext {
  public num1: number;
  public num2: number;
}

/**
 * A Sample of how simple it is to create a new window, with its own injects.
 */
@Component({
  selector: 'modal-content',
  styles: [`
        .custom-modal-container {
            padding: 15px;
        }
      
        .custom-modal-header {
            background-color: #3c8dbc;
            color: #fff;
            -webkit-box-shadow: 0px 3px 5px 0px rgba(0,0,0,0.75);
            -moz-box-shadow: 0px 3px 5px 0px rgba(0,0,0,0.75);
            box-shadow: 0px 3px 5px 0px rgba(0,0,0,0.75);
            margin-top: -15px;
            margin-bottom: 40px;
        }
    `],
  //TODO: [ngClass] here on purpose, no real use, just to show how to workaround ng2 issue #4330.
  // Remove when solved.
  templateUrl: './custom-modal.html',
  providers: [LoginService, WriterService, SqliteDB, SettingService]

})
export class CustomModal2 implements CloseGuard, ModalComponent<CustomModalContext2> {
  context: CustomModalContext2;

  public wrongAnswer: boolean;
  private login = [];
  public title = "Thai Care Cloud";
  private TB_BUFFE_CONFIG = "CREATE TABLE IF NOT EXISTS buffe_config (`name` TEXT PRIMARY KEY , `value` TEXT)";
  private TB_BuFFE_CONSTANTS = "CREATE TABLE IF NOT EXISTS buffe_constants (`name` TEXT PRIMARY KEY , `value` TEXT)";
  private TB_BUFFE_COMMAND = "CREATE TABLE IF NOT EXISTS buffe_command (`name` TEXT PRIMARY KEY , `value` TEXT)";
  private TB_SETTING_LOGIN = "CREATE TABLE IF NOT EXISTS setting_login(`id` TEXT PRIMARY KEY, `username` TEXT, `access_token` TEXT , `sitecode` TEXT)";
  private TB_BUFFE_TEMPLATE = ` 
    CREATE TABLE \`buffe_template\` (
      \`id\` INTEGER ,
      \`priority\` INTEGER ,
      \`ctype\` TEXT ,
      \`client_type\` TEXT ,
      \`version_only\` TEXT ,
      \`version_exclude\` TEXT ,
      \`cname\` TEXT ,
      \`presql\` TEXT ,
      \`sql\` TEXT ,
      \`controller\` TEXT ,
      \`table\` TEXT ,
      \`status\` INTEGER  )
  `;
  private TB_LOGIN = `CREATE TABLE if not exists logins(
              id INTEGER PRIMARY KEY,
              username TEXT,
              access_token TEXT,
              name TEXT,
              sitecode TEXT,
              service_url TEXT,
              hospital TEXT)`;


  constructor(private settingService: SettingService, public sqlitedb: SqliteDB, public dialog: DialogRef<CustomModalContext2>, private router: Router, private loginService: LoginService, private writerJson: WriterService) {
    this.context = dialog.context;
    // this.wrongAnswer = true;
    
    
    dialog.setCloseGuard(this);
  }

  onKeyUp(value) {
    //  this.wrongAnswer = value != 5;
    // this.dialog.close();
  }
  CloseDianlg() {
    this.dialog.close();
  }

  beforeDismiss(): boolean {
    return true;
  }

  beforeClose(): boolean {
    return this.wrongAnswer;
  }

  Login() {
    let frm = $('#frmLogin').serializeArray(); //รับค่าทั้งหมดจาก form login  
    $('#iconLogin').addClass('fa fa-spinner fa-spin fa-fw');
    let data = {}; //data สำหรับเก็บ Key , value ที่ได้จากการ form
    $.each(frm, function (k, v) {  //loop เพื่อเก็บ name กับ value ของ form 
      data[v.name] = v.value;	//เก็บ value กับ name ใส่ data		[{ fname:'sdfs' , lname:'sdf'}]
    });
 
    //ส่งข้อมูล data ไปให้ login service login
    this.loginService.getLogin(data['username'], data['password']).then((res) => {
      $('#iconLogin').removeClass('fa fa-spinner fa-spin fa-fw');
      this.login = [].concat(res); //ให้ตัวแปร login มาเก็บค่าทีี่ได้จากการ login
      
      //JSON.stringify(this.login[0]);

      this.saveLogin();//บันทึกข้อมูล user ไว้ใน sqlite
      //this.cookie.setCookie(this.login[0].service_url, "user_login", JSON.stringify(this.login[0])); //เก็บ cookie
      let model = new Tokken();
 
      model.username = this.login[0].username;
      LoginModel.prototype.id = this.login[0].id;
      LoginModel.prototype.username = this.login[0].username;
      LoginModel.prototype.name = this.login[0].name;
      LoginModel.prototype.sitecode = this.login[0].sitecode;
      LoginModel.prototype.hospital = this.login[0].hospital;
      LoginModel.prototype.service_url = this.login[0].service_url;
      LoginModel.prototype.access_token = this.login[0].access_token;
 
      this.getBuffeConfig(this.login[0].access_token); //get buffe_config
      this.getBuffeConstants(this.login[0].access_token); //getBuffeConstants  
      this.getBuffeCommand();
      this.TestLogin();
      //console.log(Tokken.prototype.access_token);
      //alert('สวัสดีคุณ '+this.login[0].name);//alert 
      this.dialog.close();
      this.getSetting();
      // this.goHome();
    }).catch(err => { //เมื่อ login ไม่ผ่าน
      $('#iconLogin').removeClass('fa fa-spinner fa-spin fa-fw');
      alert("Status " + err.status + "\nกรุณาตรวจสอบ Username หรือ Password")
    });
  }//Login
  TestLogin() {

    //console.log(this.sqlitedb.getFindAll('logins')); 
  }
  goHome() {
    this.router.navigate(['/home']);
  }
  getSetting() {
    this.router.navigate(['/setting']);
  }

  /************************************** บันทึกข้อมูลการ Login ของ  user ลง sqlite *************************************/
  saveLogin() {
    try{
         
          if(this.sqlitedb.CreateTable(this.TB_LOGIN)){
            this.sqlitedb.createRecords("logins", this.login[0]).then(res => {
              this.CheckSettingLogin();
            }).catch(err => {
                console.log(err);
            });
          }
          
    }catch(e){
       console.log(e);
    }
  }//saveLogin
  CheckSettingLogin(){
     
     let data = this.sqlitedb.getFindAll("setting_login");
     let login = this.sqlitedb.getFindAll('logins');
    
     if(data.length){
        if((this.login[0].username===data[0].username) && (this.login[0].access_token===data[0].access_token) && (this.login[0].sitecode===data[0].sitecode)){
            //console.log("Userคนเดิมที่ Login");
        }else{
          //console.log("User ใหม่");
          let data1= {
             username:login[0].username,
             access_token:login[0].access_token,
             sitecode:login[0].sitecode
            };
          let data1_where = {id:data[0].id};
          this.sqlitedb.Update("setting_login",data1,data1_where).then(()=>{
              let datas = {hosts:"",users:"",passs:"", dbnames: "", histypes:"", dbtypes:"0"};
              this.sqlitedb.Update("config_sql",datas,{id:"1"}).then(()=>{
                console.log(this.sqlitedb.getFindAll("config_sql"));
              });

               console.log(this.sqlitedb.getFindAll("setting_login"));
          });  
           
          // //config_sql , hists
          //  this.sqlitedb.ConnectDb();
          //  let data = {username:this.login[0].username, access_token:this.login[0].access_token, sitecode:this.login[0].sitecode};
          //  let data_where ={id:1}
          //  this.sqlitedb.updateRecords("setting_login",data,data_where).then(()=>{
          //     let data = {hosts:"",users:"",passs:"", dbnames: "", chars: "" };
          //     let data_where = { id: "1" };
          //     this.sqlitedb.updateRecords("config_sql", data, data_where).then(()=>{
          //         //console.log(this.sqlitedb.getFindAll("config_sql"));
          //     }).catch(err=>{
          //         console.log(err);
          //     });
          //  }).catch();
           
        }
     }else{
        console.log("User ยังไม่เคย Login");
        this.SaveSettingLogin();
     }
  }
  SaveSettingLogin(){
     
    if(this.sqlitedb.CreateTable(this.TB_SETTING_LOGIN)){
      let data = {id:1,username:this.login[0].username, access_token:this.login[0].access_token, sitecode:this.login[0].sitecode};
      this.sqlitedb.createRecords("setting_login",data).then(()=>{
         console.log("Save Login.");
      }).catch(err=>{
        console.log(err);
      });
    }
  }
  /***************************** บันทึก buffe config ลง file.json *************************************/
  getBuffeConfig(token) {
    console.log(token);
    this.settingService.getSetting("buffe-config", token).then(res => {//ยิง api ได้ res  

      let sql = this.TB_BUFFE_CONFIG;//setting_config
      this.sqlitedb.Querysql(sql);//สร้าง table buffe_config  

      //บันทึกกร setting_config
      if (this.sqlitedb.getFindAll("buffe_config").length == 0) {//ตรวจสอบ ใน sqlite
        $.each(res, (k, v) => {//บันทึก res ลงใน sqlite
          this.sqlitedb.Querysql("INSERT INTO buffe_config (`name`,`value`) VALUES('" + k + "','" + v + "')");
        });
        this.sqlitedb.Querysql("INSERT INTO buffe_config (`name`,`value`) VALUES('even_delay','1')");
        console.log("Save buffe_config success.");
      }
    }).catch(err => {
      console.log('Erorr' + err);
    });
  }//getBuffeConfig 
  getBuffeConstants(token) {

    this.settingService.getSetting("buffe-constants", token).then(data => {//ยิง api
      //บันทึกกร setting_config
      let sql = this.TB_BuFFE_CONSTANTS;//setting_config
      this.sqlitedb.Querysql(sql);// create table buffe_constants

      if (this.sqlitedb.getFindAll("buffe_constants").length == 0) {
        $.each(data, (k, v) => {

          this.sqlitedb.Querysql("INSERT INTO buffe_constants (`name`,`value`) VALUES('" + v.id + "','" + v.value + "')");
        });
        //console.log(this.sqlitedb.getFindAll("SELECT * FROM logins"));

        console.log("Save buffe_constants success.");
      }

    }).catch(err => {
      // console.log('Erorr'+err);
    });
    //console.log(btoa('{"id":"10980","buffe_version":"TDC App -","his_type":"10","his_version":null,"config_delay":60,"command_delay":2,"constants_delay":60,"template_delay":10,"sync_delay":1,"sync_nrec":"1500","his_user":null,"his_password":null,"his_ip":null,"his_port":null,"his_db":null,"service_url":"https://webservice09.thaicarecloud.org","dadd":null,"dupdate":null,"last_ping":"2017-05-26 16:49:10","del_log":0,"cpu":"20.9606987","ram":"25.1282928","ram_usage":"2049.81640","cpu_serv":"10.24958","ram_serv":"66.7892607","ram_serv_usage":"5448"}'));
  }//getBuffeConstants

  getBuffeCommand() {
    setTimeout(() => {
      let sql = this.TB_BuFFE_CONSTANTS;//setting_config
      this.sqlitedb.Querysql(sql);// create table buffe_constants
      console.log(this.sqlitedb.getFindAll('buffe_command')+"aasdsad");
    }, 500);
  }
}
