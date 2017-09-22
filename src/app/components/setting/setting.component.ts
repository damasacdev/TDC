import { AppComponent } from './../../app.component';
import { Component, OnInit } from '@angular/core';
const $ = require('../../../assets/jquery/dist/jquery.min.js');
import { WebserviceService } from '../../providers/webservice.service';
import { SqliteDB } from '../../providers/sqliteDB';
import { SettingModel } from './setting.model';
//setting-form.ts
import { SettingForm } from './setting-form'; //form
import { SettingDatabase } from './setting-database'; //database
import { SettingWebService } from './setting-webservice'; //webservice
import { MysqlService } from '../../providers/mysql.service';
import { MssqlService } from '../../providers/mssql.service';
import { Database } from '../../models/Database';
import { Tokken } from '../../models/tokken'; 
// import { OracleService } from '../../providers/oracle.service';
import { Postgress } from '../../providers/postgress.service';
import { LoginModel } from '../../models/Login.model';
//router
import { RouterModule, Router } from '@angular/router';
import { DialogService } from '../../providers/dialog.service';
import { CheckLogin } from '../../providers/checklogin';
import { SettingService } from '../../providers/setting.service';
import { EncriptService } from "../../providers/encript.service";
const sha = require('sha.js');
const {ipcRenderer} = require('electron');
@Component({
  selector: 'app-setting',
  templateUrl: './setting.component.html',
  styleUrls: ['./setting.component.scss'],
  providers: [SettingService,EncriptService,SettingForm, SettingDatabase, SettingWebService, Postgress, DialogService,CheckLogin]
})
export class SettingComponent implements OnInit {

  //Config Sql
  private TB_CONFIG_SQL = "CREATE TABLE IF NOT EXISTS config_sql (id INTEGER PRIMARY KEY,access_token TEXT,sitecode TEXT,dbtypes TEXt,hosts TEXt,users TEXt,passs TEXT,ports TEXT,dbnames TEXT,chars TEXT,histypes Text,schemas Text, tdc_db text, even_delay text)";
  private TB_HIST = "CREATE TABLE IF NOT EXISTS hists(id INTEGER PRIMARY KEY, names TEXT)"; //tb hist
  private TB_VERSION = "CREATE TABLE IF NOT EXISTS versions(id INTEGER PRIMARY KEY, names TEXT)";
  
  private login: any;
  status:number = 0; 
  private dataLogin;
  private dataConfig;
  private dataConstant;
  private dataConfigSql;
  //Val 
  public hist: Array<{ id: number, name: string }> = [];
  public dbtype: Array<{ id: number, name: string }> = [];
  public dbname: Array<{ id: string, name: string }> = [];
  public schema: Array<{ id: string, name: string }> = [];
  private encodes: string = "555";
  private his_id:string;
  constructor(
    private app: AppComponent,
    private settingForm: SettingForm,
    private settingDatabase: SettingDatabase,
    private settingWebservice: SettingWebService,
    private mysql: MysqlService,
    private mssql: MssqlService,
    private postgressService: Postgress,
    private router: Router,
    private dialog: DialogService,
    private checklogin:CheckLogin,
    private crypto:EncriptService,
    private settingService: SettingService,
  ) {
    
   }
  ngOnInit() {
    try {
      this.app.hideGroupBtnApp();
      if(this.app.statusJob == 'Started'){
          $("#divStart").hide();
          $("#divStop").show();
          $('#divReset').hide();
          this.DisableForm();
      }else{
          $("#divStart").show();
          $("#divStop").hide();
          $('#divReset').show();
          this.EnableForm();
      }
      setTimeout(() => {
        
         
          setTimeout(()=>{
            let checklogin = this.settingDatabase.getfindAll("logins");
            if (checklogin.length != 0) {
              console.log('CheckLogin');
              console.log(checklogin);
              /*************************************** get ข้อมูล Login ********************************************/
              LoginModel.prototype.id = checklogin[0].id;
              LoginModel.prototype.username = checklogin[0].username;
              LoginModel.prototype.name = checklogin[0].name;
              LoginModel.prototype.sitecode = checklogin[0].sitecode;
              LoginModel.prototype.hospital = checklogin[0].hospital;
              LoginModel.prototype.service_url = checklogin[0].service_url;
              LoginModel.prototype.access_token = checklogin[0].access_token; 
              this.app.loadDataLogin();
               
            }
          },500);
        //console.log(this.settingDatabase.getfindAll("buffe_constants"));   
 
        $("#loading").hide();
        $("#Settings").show();
        this.settingDatabase.getQuery(this.TB_VERSION);
        this.login = this.settingDatabase.getfindAll('logins');

        if (this.settingDatabase.getQuery(this.TB_CONFIG_SQL)) {
          let date = new Date();
          let id = date.getTime();
          let data_config_sql = {
            id: id,
            access_token: this.login[0].access_token,
            sitecode: this.login[0].sitecode,
            dbtypes: '',
            hosts: '',
            users: '',
            passs: '',
            ports: '3306',
            dbnames: '',
            chars: '',
            histypes: '',
            even_delay:'1' 
            
          };
          // console.log(this.settingDatabase.getQuery("SELECT * FROM config_sql WHERE access_token = '"+this.login[0].access_token+"' AND sitecode='"+this.login[0].sitecode+"' "));
          let checklogin = this.settingDatabase.getQuery("SELECT * FROM config_sql WHERE access_token = '"+this.login[0].access_token+"' AND sitecode='"+this.login[0].sitecode+"' ");
          if(checklogin.length == 0 || !checklogin){
               this.settingDatabase.getCreateeRecord("config_sql", data_config_sql).then(() => {
              // console.log(this.settingDatabase.getfindAll("config_sql"));
                console.log("Create table config_sql");
              });
          }else{
 
              //this.getConfigConstants();
          }
          //this.settingDatabase.getQuery("INSERT INTO config_sql(id,dbtypes,users,passs,hosts,ports,dbtypes,chars,dbnames) VALUES('1','0','','','','3306','','','')");
          let data = this.settingDatabase.getQuery("SELECT * FROM config_sql WHERE access_token = '"+this.login[0].access_token+"' AND sitecode='"+this.login[0].sitecode+"' ");
          this.encodes = data[0].chars;

          if (data[0].hosts != "") {
            // console.log("HOSTS=>"+data[0].hosts);
            this.getDatabaseNameInit();
            $("#divDisConnect").show();
          }
        }
        this.settingDatabase.getQuery(this.TB_HIST);

        this.getHisType();
        $('#loading').show();
        $('#Settings').hide();

      }, 500);

    } catch (e) {
      console.log(e);
    }

    setTimeout(()=>{
      //alert("OK");
      
      $('#dbtype, #dbname, #schema ,#encodes').attr("disabled", true); //dropdownlist
      $("#Host, #Username, #Password ,#Port").prop("readonly", true);
     // DisableForm()
      $('#btnConnect').attr("disabled", true); //dropdownlist
      
      $('#loading').hide();
      $('#Settings').show();
    },1500);      
    
    setTimeout(()=>{
      this.checkSetting();
    },2000);
  }//ngOnInit ทำงานหลังจาก constructor ทำงานเสร็จ 


  checkSetting(){ 
		 try{
			//alert(LoginModel.prototype.access_token);
			if(this.settingDatabase.getConnect()){
				let sql="SELECT * FROM config_sql WHERE access_token ='"+LoginModel.prototype.access_token+"' ";
				let check_config = this.settingDatabase.getQuery(sql);// sqliteService.Querysql(sql);
				console.log(check_config);
				if(check_config[0].hosts == '' && check_config[0].users == "" && check_config[0].passs==""){
					$("#divStart").show();
          $("#divStop").hide();
				}
			}
		 }catch(err){
			 console.log(err);
		 }
	}

  private getLogins(){
    return this.settingDatabase.getfindAll("logins");
  }
  private getManualConfigSql(){
    return this.settingDatabase.getQuery("SELECT * FROM config_sql WHERE access_token = '"+this.login[0].access_token+"' AND sitecode='"+this.login[0].sitecode+"' ");
  }
  private getCreate(table:any, data:any){
    return this.settingDatabase.getCreateeRecord(table,data).then(() => {
        console.log("Create table config_sql");
      });
  }
  private getInfoLogin(checklogin){//เพิ่มข้อมูล login
    this.login = this.getLogins();
    LoginModel.prototype.id = checklogin[0].id;
    LoginModel.prototype.username = checklogin[0].username;
    LoginModel.prototype.name = checklogin[0].name;
    LoginModel.prototype.sitecode = checklogin[0].sitecode;
    LoginModel.prototype.hospital = checklogin[0].hospital;
    LoginModel.prototype.service_url = checklogin[0].service_url;
    LoginModel.prototype.access_token = checklogin[0].access_token;
    this.app.loadDataLogin();
  }
  private getCreateTableConfigSql() {
    if (this.settingDatabase.getQuery(this.TB_CONFIG_SQL)) {
      let date = new Date();
      let id = date.getTime();
      let data_config_sql = {
        id: id,
        access_token: this.login[0].access_token,
        sitecode: this.login[0].sitecode,
        dbtypes: '',
        hosts: '',
        users: '',
        passs: '',
        ports: '3306',
        dbnames: '',
        chars: '',
        histypes: ''
      };
      let checklogin = this.getManualConfigSql();
      if (checklogin.length == 0 || !checklogin) {
        this.getCreate("config_sql", data_config_sql);
      } else {
        //this.getConfigConstants();
      }
    }
    
  }
  /********************************* ทำหน้าที่เรียกใช้จาก function ด้านบน ***************************************/
  private getDatabaseNameInit() {
    try {
      this.setModelConnectionDatabase();
      let db_con = this.settingDatabase.getQuery("SELECT * FROM config_sql WHERE access_token = '"+this.login[0].access_token+"' AND sitecode='"+this.login[0].sitecode+"' ");
      
      let dbtype = $("#dbtype").val();
      if (dbtype == 0) {//mysql
        if (this.mysql.getConnectDb()) {
          this.dbname = [];
          console.log("Connection Mysql Database");
          this.mysql.showDatabase().then(data => {
            $.each(data, (k, v) => { //ลูปแบบ Ajax สำหรับเก็บค่าที่ได้จาก mysqlService 
              this.dbname.push({ id: v.Database, name: v.Database }); //ให้ตัวแปร dbname ที่อยู่ด้านบน public dbname:Array<{id:string, name:string}>=[] เก็บค่า database
            });
          }).catch(err => {
            console.log(err);
          });
        }
      } else if (dbtype == 1) {//microsofe sqlserver
        if (this.mssql.getConnectDb()) {
          console.log("Connection Mssql Database");
        }
      } else if (dbtype == 2) {//Oracle
        console.log("Connection Oracle Database");
      } else if (dbtype == 3) {//Posstgress

        console.log("Connection Posstgress Database");
        this.postgressService.showDatabase().then(data => {
          console.log(data);
        }).catch(error => {
          console.log(error);
        });

      }
      setTimeout(() => {
        let dbnames = this.settingDatabase.getQuery("SELECT * FROM config_sql WHERE access_token = '"+this.login[0].access_token+"' AND sitecode='"+this.login[0].sitecode+"' ");
        console.log("DB-NAME"+dbnames[0].dbnames);
        $('#dbname option').removeAttr('selected').filter('[value="' + dbnames[0].dbnames + '"]').attr('selected', true);

        if (this.settingDatabase.getfindAll("versions").length == 0) {
          this.settingDatabase.getQuery("INSERT INTO versions(id,names) VALUES('1','1.0.0')");
        }
      }, 500);
    } catch (ex) {
      console.log(ex);
    }
  }
  private getHisType() {
    this.settingWebservice.getWebservice(this.settingDatabase.getService_url() + "/buffe-constants/new-his-type?token=" + this.settingDatabase.getTokenLogin()).then(data => {
       //https://tdcservice.thaicarecloud.org/buffe-constants/new-his-type
        
        this.hist = [];
        $.each(data, (k, v) => {
          this.hist.push({ id: v.id, name: v.his_name });
          console.log(this.hist);
          this.settingDatabase.getQuery("insert into hists values('" + v.id + "', '" + v.his_name + "')");
        });

      });

    this.getDatabaseName();
    let histype = this.settingDatabase.getfindAll('hists');//โหลดข้อมูล histype จาก sqlite
    // console.log(this.settingDatabase.getService_url() + "/buffe-constants/his-type?token=" + this.settingDatabase.getTokenLogin());
    let status = 0;
    if (histype.length != 0) {
      status = 1;
    }

    if (status == 1) {
      for (let i = 0; i < histype.length; i++) {
        this.hist.push({ id: histype[i].id, name: histype[i].names });
      }
    } else {
      this.settingWebservice.getWebservice(this.settingDatabase.getService_url() + "/buffe-constants/new-his-type?token=" + this.settingDatabase.getTokenLogin()).then(data => {
       //https://tdcservice.thaicarecloud.org/buffe-constants/new-his-type
        this.hist=[];
        $.each(data, (k, v) => {
          
          this.hist.push({ id: v.id, name: v.his_name });
          this.settingDatabase.getQuery("insert into hists values('" + v.id + "', '" + v.his_name + "')");
        });
      });
    }
  }//getHisType ทำหน้าที่ โหลด histype
  private getSaveHisType(his_id) {
    this.his_id = his_id;
    let data = {
      histypes: his_id
    };
    let data_where = {
      access_token: this.login[0].access_token,
      sitecode: this.login[0].sitecode
    };
    this.settingDatabase.getUpdateRecord("config_sql", data, data_where).then(() => {
      console.log("Save histype");
    });
    if(his_id == ""){
          $('#dbtype').attr("disabled", true); //dropdownlist
    }else{
      $('#dbtype').attr("disabled", false);
    }
    this.settingDatabase.getConnect();
  }
  private getDatabaseName() {
    let db = new SettingModel();
    for (let i = 0; i < db.dbtype.length; i++) {
      this.dbtype.push({ id: i, name: db.dbtype[i] });
    }
    setTimeout(() => {
      try{
          let checkdb = this.settingDatabase.getQuery("SELECT * FROM config_sql WHERE access_token = '"+this.login[0].access_token+"' AND sitecode='"+this.login[0].sitecode+"' ");//this.settingDatabase.getfindAll('config_sql');
          if(checkdb){
             $('#dbtype option').removeAttr('selected').filter('[value=' + checkdb[0].dbtypes + ']').attr('selected', true);
          }
         
          //histypes
          if (checkdb[0].histypes != "") {
            $('#histype option').removeAttr('selected').filter('[value=' + checkdb[0].histypes + ']').attr('selected', true);
          }

          this.getConnectDataBaseForm(checkdb[0].dbtypes);
      }catch(err){
         console.log(err);
      }
    }, 500);

  }//getDatabaseName ทำหน้าที่เลือก Database

  private getConnectDataBaseForm(db) {
    try {
     if(db==1){
       $("#data-schema").show();
     }else{
       $("#data-schema").hide();
     }
     if($("#dbtype").val() == ""){
         $('#frmConnectDb input').prop('readonly', true);//input
     }
      $('#btnConnect').attr("disabled", false); //dropdownlist
      if (db == "") {
        //alert("กรุณาเลือก Database");
      } else {
        let dbtype = { dbtypes: db };
        let data_where = {
          access_token: this.login[0].access_token,
          sitecode: this.login[0].sitecode
        };
        this.settingDatabase.getUpdateRecord("config_sql", dbtype, data_where).then(() => {
          console.log("Save database name");
        });

        let data = this.settingDatabase.getQuery("SELECT * FROM config_sql WHERE access_token = '"+this.login[0].access_token+"' AND sitecode='"+this.login[0].sitecode+"' ");//this.settingDatabase.getfindAll("config_sql");
        $("#showConnectDb").html(this.settingForm.getCreateFormConnectDatabase(db, data));

      }
    } catch (e) {
      console.log(e);
    }

  }//getConnectDataBaseForm ทำหน้าที่ แสดง form Connection Database

  private ConnectDatabase() {
    $("#icon-loading").addClass("fa fa-circle-o-notch fa-spin fa-fw");
    
    let frm = $('#frmConnectDb').serializeArray();
    let form = this.settingForm.getKeyValueForm(frm);
    //dbtype
    if($("#dbtype").val()==""){
      if($('#dbtype').attr("disabled", false)){
        //this.dialog.Error("","กรุณาเลือก Dbtype");
      }
      
      $("#icon-loading").removeClass("fa fa-circle-o-notch fa-spin fa-fw");
      return false;
    }
    if($("#Host").val()==""){
      this.dialog.Error("","กรุณากรอก Host");
      $("#icon-loading").removeClass("fa fa-circle-o-notch fa-spin fa-fw");
      return false;
    }
    if($("#Username").val()==""){
      this.dialog.Error("","กรุณากรอก Username");
      $("#icon-loading").removeClass("fa fa-circle-o-notch fa-spin fa-fw");
      return false;
    }
   
    if($("#Port").val()==""){
      this.dialog.Error("","กรุณากรอก Port");
      $("#icon-loading").removeClass("fa fa-circle-o-notch fa-spin fa-fw");
      return false;
    }
 
   

    //$('#btnConnect').attr("disabled", true); //dropdownlist
 
    let data = { hosts: form["Host"], users: form["Username"], passs: form["Password"], ports: form["Port"] };
    let data_where = {
      access_token: this.login[0].access_token,
      sitecode: this.login[0].sitecode
    };

    this.settingDatabase.getUpdateRecord("config_sql", data, data_where);
    //console.log(this.settingDatabase.getfindAll("config_sql"));

    this.setModelConnectionDatabase();
    let dbtype = $("#dbtype").val();

    if (dbtype == 0) {//mysql
      if (this.mysql.getConnectDb()) {
        this.dbname = [];
        console.log("Connection Mysql Database");
        
        this.mysql.showDatabase().then(data => {
          this.dbname=[];
          //var tdc:any = "";
          $.each(data, (k, v) => { //ลูปแบบ Ajax สำหรับเก็บค่าที่ได้จาก mysqlService 
            this.dbname.push({ id: v.Database, name: v.Database }); //ให้ตัวแปร dbname ที่อยู่ด้านบน public dbname:Array<{id:string, name:string}>=[] เก็บค่า database
          });
          $("#icon-loading").removeClass("fa fa-circle-o-notch fa-spin fa-fw");
          setTimeout(() => {
           
            if(this.app.statusJob != "Started"){
              this.dialog.Success("Success", "Connection database success.");
           }  
             
            $('#dbname, #schema, #dbtype').attr("disabled", false); //dropdownlist
            $('#encodes').prop('disabled', false);
            let db = this.getManualConfigSql();
            $('#dbname option').removeAttr('selected').filter('[value="' + db[0].dbnames + '"]').attr('selected', true);
              setTimeout(()=>{
                 $('#frmConnectDb input').prop('readonly', true);//input
                 $('#histype,#dbtype').attr("disabled", true); //dropdownlist
              }, 800);
            //alert(db[0].dbnames);
          }, 500);
        }).catch(err => {
          $("#icon-loading").removeClass("fa fa-circle-o-notch fa-spin fa-fw");
          setTimeout(() => {
            this.dialog.Error("", err.toString());
            $("#frmConnectDb input").prop("readonly", false);
            $('#btnConnect').attr("disabled", false); //dropdownlist
          }, 100);
        });

      }
    } else if (dbtype == 1) {//microsofe sqlserver
      if (this.mssql.getConnectDb()) {
        //alert("OK");
        this.EnableForm();
        console.log("Connection Mssql Database");
         this.mssql.showDatabase().then(data => {
          this.dbname=[];
          $.each(data, (k, v) => { //ลูปแบบ Ajax สำหรับเก็บค่าที่ได้จาก mysqlService              
            this.dbname.push({ id: v.DATABASE_NAME, name: v.DATABASE_NAME }); //ให้ตัวแปร dbname ที่อยู่ด้านบน public dbname:Array<{id:string, name:string}>=[] เก็บค่า database
          });
          $("#icon-loading").removeClass("fa fa-circle-o-notch fa-spin fa-fw");
          // setTimeout(()=>{
          //     this.dialog.Success("Success","Connection database success.");
          //     $('#dbname, #schema, #dbtype').attr("disabled", false); //dropdownlist
          //     $('#encodes').prop('disabled', false);
          //     $('#frmConnectDb input').prop('readonly', true);//input
          //     //$("#divConnect").hide(); 
          //  },100);
          setTimeout(() => {
           
            if(this.app.statusJob != "Started"){
               this.dialog.Success("Success", "Connection database success.");
            }             
            $('#dbname, #schema, #dbtype').attr("disabled", false); //dropdownlist
            $('#encodes').prop('disabled', false);
            let db = this.getManualConfigSql();
            $('#dbname option').removeAttr('selected').filter('[value="' + db[0].dbnames + '"]').attr('selected', true);
              setTimeout(()=>{
                 $('#frmConnectDb input').prop('readonly', true);//input
                 $('#histype,#dbtype').attr("disabled", true); //dropdownlist
              }, 800);
            //alert(db[0].dbnames);
          }, 500);
        }).catch(err => {
           $("#icon-loading").removeClass("fa fa-circle-o-notch fa-spin fa-fw");
           setTimeout(()=>{
              this.dialog.Error("",err.toString());
              $("#frmConnectDb input").prop("readonly", false);
              $('#btnConnect').attr("disabled", false); //dropdownlist
           },100);
        });
        
      }
    } else if (dbtype == 2) {//Oracle
      console.log("Connection Oracle Database");
    } else if (dbtype == 3) {//Posstgress

      console.log("Connection Posstgress Database");
      this.postgressService.showDatabase().then(data => {
        console.log(data);
      }).catch(error => {
        console.log(error);
      });
    }

    
 

  }//ConnectDatabase ทำหน้าที่เชื่อมต่อ Database และ Save ่ข้อมูลลงใน Sqlite
  public setModelConnectionDatabase() {
    let db = Database.prototype;
    let config_ = this.settingDatabase.getQuery("SELECT * FROM config_sql WHERE access_token = '"+this.login[0].access_token+"' AND sitecode='"+this.login[0].sitecode+"' ");//this.settingDatabase.getfindAll("config_sql");
    //console.log(config_)
    db.host = config_[0].hosts;
    db.username = config_[0].users;
    db.password = config_[0].passs;
    db.port = config_[0].ports;
    db.charset = config_[0].chars;
    db.dbtype = config_[0].dbtypes;
    db.dbname = config_[0].dbnames;
    db.charset = config_[0].chars;
  }//setModelConnectionDatabase ทำหน้าที่ตั้งค่าการเชื่อมต่อ Database ผ่าน model Database
  getStart() {
     $('#divReset').hide();
    if($('#dbname').val() == ""){
       alert("กรุณาตั้งค่าฐานข้อมูล");
       this.getStop();
       return false;  
     }
     if($('#encodes').val().length < 6){
       alert("รหัสต้องมี 6 ตัวขึ้นไป");
       return false;  
     }
      
       
      this.getBuffeConfig(this.login[0].access_token, this.his_id);
    //this.setModelConnectionDatabase();
    // this.ConnectDatabase();
     this.ReadOnly();
    this.getConfigConstants();
     setTimeout(()=>{
       
      console.log(this.dbname);
      for(let i=0; i<this.dbname.length; i++){
         if(this.dbname[i].name == "tdc_online"){
           let data = { tdc_db: "tdc_online" };
           let data_where = {
             access_token: this.login[0].access_token,
             sitecode: this.login[0].sitecode
           };
           this.settingDatabase.getUpdateRecord("config_sql", data, data_where);
           break;
         }else{
           let data = { tdc_db: "" };
           let data_where = {
             access_token: this.login[0].access_token,
             sitecode: this.login[0].sitecode
           };
           this.settingDatabase.getUpdateRecord("config_sql", data, data_where);
         }
         
      }
        
       
      this.router.navigate(['/home']);
     },200);

  }//getStart ทำหน้าที่เริ่มทำงานทั้งหมด 
  getStop(){
      this.app.stopJob();
      // $('#histype').attr("disabled", true); //dropdownlist
      $('#divReset').show();
       this.EnableForm();

  }
  getConfigConstants() {
    let dbname = $("#dbname").val();
    let encode = $("#encodes").val();
    let data = { dbnames: dbname, chars: encode };
    let data_where = {
      access_token: this.login[0].access_token,
      sitecode: this.login[0].sitecode
    };
    this.settingDatabase.getUpdateRecord("config_sql", data, data_where).then(() => {
      //console.log(this.settingDatabase.getfindAll("config_sql"));
    });

    let url = "https://tdcservice.thaicarecloud.org/buffe-constants/secretkey/?key=" + encode;
    this.settingWebservice.getWebservice(url).then((result) => {
      //console.log(result[0].secretkey);
      //console.log(sha('sha256').update('42').digest('hex'));
      let data = { value: result[0].secretkey };
      let data_where = { name: "_SECRETKEY_" };
      if (this.settingDatabase.getUpdateRecord("buffe_constants", data, data_where)) {
        console.log(this.settingDatabase.getfindAll('buffe_constants'));
      }
      this.app.startJob();
      
      //_SECRETKEY_
    }).catch(error => {

    });
  }
  SaveSchema(v){
    try{
        let data1 = { schemas: v };
        let data_where1 = {
          access_token: this.login[0].access_token,
          sitecode: this.login[0].sitecode
        };
        this.settingDatabase.getUpdateRecord("config_sql", data1, data_where1).then(() => {
          console.log(this.settingDatabase.getQuery("SELECT * FROM config_sql WHERE access_token = '"+this.login[0].access_token+"' AND sitecode='"+this.login[0].sitecode+"' "));
        }).catch(err=>{
          console.log(err);
        });
    }catch(ex){
      console.log(ex);
    }
  }
  Savedb(v) {

    //alert(v); //Savedb
    let data = { value: v };
    let data_where = { name: "_HIS_DB_" };
    this.settingDatabase.getUpdateRecord("buffe_constants", data, data_where);

    
    let data1 = { dbnames: v };
    let data_where1 = {
      access_token: this.login[0].access_token,
      sitecode: this.login[0].sitecode
    };
    this.settingDatabase.getUpdateRecord("config_sql", data1, data_where1).then(() => {
       console.log(this.settingDatabase.getQuery("SELECT * FROM config_sql WHERE access_token = '"+this.login[0].access_token+"' AND sitecode='"+this.login[0].sitecode+"' "));
       this.getDatabaseNameInit();
       
       try {
         this.setModelConnectionDatabase();
         let dbtype = $("#dbtype").val();
         if (dbtype == 0) {//mysql
           if (this.mysql.getConnectDb()) {
             this.dbname = [];
             console.log("Connection Mysql Database");
             this.mysql.showDatabase().then(data => {
               $.each(data, (k, v) => { //ลูปแบบ Ajax สำหรับเก็บค่าที่ได้จาก mysqlService 
                 this.dbname.push({ id: v.Database, name: v.Database }); //ให้ตัวแปร dbname ที่อยู่ด้านบน public dbname:Array<{id:string, name:string}>=[] เก็บค่า database
               });
             }).catch(err => {
               console.log(err);
             });
           }
         } else if (dbtype == 1) {//microsofe sqlserver
           if (this.mssql.getConnectDb()) {

             console.log("Connection Mssql Database");
              this.mssql.showSchema().then(data=>{
                $.each(data, (k, v) => { //ลูปแบบ Ajax สำหรับเก็บค่าที่ได้จาก mysqlService 
                 this.schema.push({ id: v.SCHEMA_NAME, name: v.SCHEMA_NAME }); //ให้ตัวแปร dbname ที่อยู่ด้านบน public dbname:Array<{id:string, name:string}>=[] เก็บค่า database
               });
              }).catch(err => {
               console.log(err);
             });
           }
         } else if (dbtype == 2) {//Oracle
           console.log("Connection Oracle Database");
         } else if (dbtype == 3) {//Posstgress

           console.log("Connection Posstgress Database");
           this.postgressService.showDatabase().then(data => {
             console.log(data);
           }).catch(error => {
             console.log(error);
           });

         }
         setTimeout(() => {
           let dbnames = this.settingDatabase.getQuery("SELECT * FROM config_sql WHERE access_token = '" + this.login[0].access_token + "' AND sitecode='" + this.login[0].sitecode + "' ");
           console.log(dbnames);
           $('#dbname option').removeAttr('selected').filter('[value="' + dbnames[0].dbnames + '"]').attr('selected', true);

           if (this.settingDatabase.getfindAll("versions").length == 0) {
             this.settingDatabase.getQuery("INSERT INTO versions(id,names) VALUES('1','1.0.0')");
           }
         }, 500);
       } catch (ex) {
         console.log(ex);
       }

    });
  }//บันทึกชื่อฐานข้อมูล

  ReadOnly(){
    this.DisableForm();
  }
  DisableForm() {
    if(this.ConnectDatabase()){
     let dbnames = this.settingDatabase.getQuery("SELECT * FROM config_sql WHERE access_token = '" + this.login[0].access_token + "' AND sitecode='" + this.login[0].sitecode + "' ");
     console.log(dbnames);
     $('#dbname option').removeAttr('selected').filter('[value="' + dbnames[0].dbnames + '"]').attr('selected', true);

    }
  
    $('#frmConnectDb input').prop('readonly', true);//input
    $('#dbname , #encodes').prop('readonly', true);
    $('#dbname, #dbtype, #dbtype, #histype,#btnConnect #btnStarts').attr("disabled", true); //dropdownlist
    $('#divStart').hide();
    $('#divStop').show();
 
   //this.app.stopJob();
  }//Stop
  EnableForm(){
    console.log("EnableForm");
   
    $('#frmConnectDb input').prop('readonly', false);//input
    $('#dbname , #encodes').prop('readonly', false);
    $("#encodes").prop('disabled', false);
    $('#dbname, #dbtype, #dbtype, #histype,#btnConnect').attr("disabled", false); //dropdownlist
    $('#divStart').show();
    $('#divStop').hide();
  }

  disConnect(){
    this.EnableForm();
    
  }

  getReset(){
    this.EnableForm();
  }

  //get buffe_config
  getBuffeConfig(token,histypes) {
     //alert(histypes);
    this.settingService.getSetting("buffe-config", token,histypes).then(res => {//ยิง api ได้ res  

      let sql = "CREATE TABLE IF NOT EXISTS buffe_config (`name` TEXT PRIMARY KEY , `value` TEXT)";//setting_config

      this.settingDatabase.getQuery(sql);
      

      //บันทึกกร setting_config
      if (this.settingDatabase.getfindAll("buffe_config").length == 0) {//ตรวจสอบ ใน sqlite
        $.each(res, (k, v) => {//บันทึก res ลงใน sqlite
          this.settingDatabase.getQuery("INSERT INTO buffe_config (`name`,`value`) VALUES('" + k + "','" + v + "')");
        });
        this.settingDatabase.getQuery("INSERT INTO buffe_config (`name`,`value`) VALUES('even_delay','1')");
        console.log("Save buffe_config success.");
      }
    }).catch(err => {
      console.log('Erorr' + err);
    });
  }//getBuffeConfig 

}//mainClass
