import { AppComponent } from './../../app.component';
import { Component, OnInit, ViewChild } from '@angular/core';
//import { CookieService } from '../../providers/cookie.service';
import { WriterService } from '../../providers/writer.service';
const $ = require('../../../assets/jquery/dist/jquery.min.js');
import { RouterModule, Router } from '@angular/router';

import { SettingService } from '../../providers/setting.service';
import { Tokken } from '../../models/tokken';
import { Database } from '../../models/Database';

import { MysqlService } from '../../providers/mysql.service';
import { MssqlService } from '../../providers/mssql.service';
import { SqliteDB } from '../../providers/sqliteDB';
import { WebserviceService } from '../../providers/webservice.service';
@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss'],
  providers: [ WriterService, SettingService, MysqlService, MssqlService, SqliteDB],
})
export class SettingsComponent implements OnInit {

  public title = "Setting";
  public head = "Health Information System";
  public dbtype = [];
  public hist: Array<{ id: number, name: string }> = [];
  public dbname: Array<{ id: string, name: string }> = [];

  private dbType: string = "0";//set dbType
  private dataBase: any = [];
  private data_id: any;
  private histype_id: any;
  private TB_CONFIG_SQL = "CREATE TABLE IF NOT EXISTS config_sql (id INTEGER PRIMARY KEY,dbtypes TEXt,hosts TEXt,users TEXt,passs TEXT,ports TEXT,dbnames TEXT,chars TEXT,histypes)";
  private TB_HIST = "CREATE TABLE IF NOT EXISTS hists(id INTEGER PRIMARY KEY, names TEXT)";

  constructor(private app:AppComponent,private webservice:WebserviceService,private sqliteService: SqliteDB, private mssql: MssqlService, private mysql: MysqlService, private router: Router , private setting: SettingService) {

    this.loadHisConfig();
    //create table config_sql
    this.Dbtype();
    // let data = {
    //   Username: "sa",
    //   Password: "sa",
    //   Host: "192.168.1.95"

    // };
    setTimeout(() => {
         $("#loading").hide();
         $("#Settings").show();
      /*********************** Test Connection Mssql. *******************************/
      // this.mssql.setConnectDb(data);
      // console.log(this.mssql.getConnectDb());
      // this.mssql.setDbname('persons');
      // this.mssql.showDatabase().then(rows => {
      //   console.log(rows);
      // }).catch(err => {
      //   console.log(err);
      // });
      // $('#dbname , #encodes').prop('readonly', true);
      //
    }, 3000);
  }
  loadHisConfig() {
    /****************** Set His ที่เลือก ******************/
    let tokken = Tokken.prototype.access_token;

    setTimeout(() => {
      this.sqliteService.Querysql(this.TB_HIST);//create tables hists
      let check = this.sqliteService.getFindAll("hists").length;

      if (check == 0) {
        this.setting.getSetting('buffe-constants/his-type', tokken).then(res => {
          $.each(res, (k, v) => {
            this.hist.push({ id: v.id, name: v.his_name });
            this.sqliteService.Querysql("insert into hists values('" + v.id + "', '" + v.his_name + "')");
          });

        });
      } else {
        let hist = this.sqliteService.getFindAll("hists");
        for (let i = 0; i < hist.length; i++) {
          //console.log(hist[i].names);
          this.hist.push({ id: hist[i].id, name: hist[i].names });
        }

      }

    }, 500);
    //console.log(this.hist);
  }//loadHisConfig

  Dbtype() {
    /****************** Set Database Type ที่เลือก ******************/
    let db = new Tokken();
    for (let i = 0; i < db.dbtype.length; i++) {
      this.dbtype.push(db.dbtype[i]);
    }
    // console.log(this.dbtype);
  }//Dbtype
  dbConnectConfig(id) { //สำหรับสร้าง ฟอร์ม เชื่อมต่อดาต้า base รับค่า id จาก dbtype
    /****************** โหลดข้อมูล Form ตาม Database Type ที่เลือก Database Type จะเปลี่ยน  ******************/


    this.dbType = id;
    let db = new Tokken(); // เรียกใช้งาน Token ที่เก็บการ config
    let dbname = db.dbconnect[id].length - 1; //หาค่าชื่อของ database ผ่านจำนวนทั้งหมด -1 
    let html = ""; //สำหรับเก็บค่าฟอร์มที่จะสร้าง
    html += "<form id='frmConnectDb'>";//สร้างฟอร์ม id=frmConnectDb

    //เป็นตัวบอกว่าเป็น database ชนิดอะไร 1=mysql , 2=sql server , 3=oracle
    html += "<input type='hidden' name='_id' id='_id' value='" + db.dbconnect[id][dbname - 1] + "'>";
    for (let i = 0; i < db.dbconnect[id].length - 3; i++) {//ลูปเพื่อเอาค่าที่ได้ Tokken  จะมีตัวแปร ชื่อ dbconnect เป็น array

      html += "<div>";//สร้าง dev
      html += "<label>" + db.dbconnect[id][i] + "</label>";//แสดง label ของ host, user, pass
      if (db.dbconnect[id][i] === "Password") {//ถ้าเป็นประเภท password จะสร้าง input password
        html += `<input type='password' class='form-control' name='${db.dbconnect[id][i]}' id='${db.dbconnect[id][i]}'>`;
      } else if (db.dbconnect[id][i] === "Port") {//ถ้าเป็น port จะเซ็ตค่า เริ่มต้นให้ฟอร์ต ของแต่ละ database
        html += `<input type='text' class='form-control' value='${db.dbconnect[id][i + 1]}' name='${db.dbconnect[id][i]}' id='${db.dbconnect[id][i]}'>`;
      } else {//สร้าง input ธรรมดา
        html += `<input type='text' class='form-control' name='${db.dbconnect[id][i]}' id='${db.dbconnect[id][i]}'>`;
      }
      //ปิด html   
      html += "</div>";
    }
    //ปิด form
    html += "</form>";
    //console.log(db.dbconnect[id][dbname]);
    $('#dbName').html(db.dbconnect[id][dbname]);
    $('#showConnectDb').html(html);


  }//DbConnect

  dbConnection() {//เมื่อกดปุ่ม  Connection 
    //this.dbConnection();
    $("#icon-loading").html('<i class="fa fa-refresh fa-spin fa-fw"></i>');
    setTimeout(() => {
      console.log("Connect.");
      let check_db_type = $('#dbtype').val();
      //console.log($('#dbtype').val()); 
       this.dbname = [];
      /****************** รับค่าจาก Form และ ตรวจสอบ ******************/
      let frm = $('#frmConnectDb').serializeArray();
      
      let data = {}; //data สำหรับเก็บ Key , value ที่ได้จากการ form
      $.each(frm, function (k, v) {  //loop เพื่อเก็บ name กับ value ของ form 
        data[v.name] = v.value;	//เก็บ value กับ name ใส่ data		[{ fname:'sdfs' , lname:'sdf'}]
      });
       
      this.SettingDatabase(data);
      //console.log(check_db_type); 
      /****************** Connect Database และแสดงสถานะการเชื่อมต่อ ******************/
      
      if(check_db_type == 0){
        setTimeout(()=>{
          if(this.mysql.getConnectDb()){
           // console.log(this.sqliteService.getFindAll("config_sql"));
           // console.log(Database.prototype.host);
            this.mysql.showDatabase().then(res => { //เรียกใช้ mysqlService แสดงชื่อ database
              $.each(res, (k, v) => { //ลูปแบบ Ajax สำหรับเก็บค่าที่ได้จาก mysqlService 
                this.dbname.push({ id: v.Database, name: v.Database }); //ให้ตัวแปร dbname ที่อยู่ด้านบน public dbname:Array<{id:string, name:string}>=[] เก็บค่า database
                $('#dbname , #encodes').prop('readonly', false); //เปิด form Configuration  ให้เลือกฐานข้อมูลได้
              });
              //console.log(res);
              $("#icon-loading").html('');
            }).catch(error => {
               console.log(error);
            });
          }
        },1000);
      }else if(check_db_type == 1){
         console.log("Sql server");
         setTimeout(()=>{
          if(this.mssql.getConnectDb()){
           // console.log(this.sqliteService.getFindAll("config_sql"));
            //console.log(Database.prototype.host);
            this.mssql.showDatabase().then(res => { //เรียกใช้ mysqlService แสดงชื่อ database
              $.each(res, (k, v) => { //ลูปแบบ Ajax สำหรับเก็บค่าที่ได้จาก mysqlService 
                this.dbname.push({ id: v.DATABASE_NAME, name: v.DATABASE_NAME }); //ให้ตัวแปร dbname ที่อยู่ด้านบน public dbname:Array<{id:string, name:string}>=[] เก็บค่า database
                $('#dbname , #encodes').prop('readonly', false); //เปิด form Configuration  ให้เลือกฐานข้อมูลได้
              });
              //console.log(res);
              $("#icon-loading").html('');
            }).catch(error => {
               console.log(error);
            });
          }
        },1000);
      
      }
     

    }, 500);



  }//dbConnection

  Start() {
    setTimeout(()=>{
        let id = this.sqliteService.getFindAll("buffe_constants");
        let config_sql = this.sqliteService.getFindAll("config_sql");
        let sql="UPDATE buffe_constants SET `value`='"+config_sql[0].dbnames+"' WHERE `name` = '_HIS_DB_'";
        this.sqliteService.Querysql(sql); 
       
        
        
        let url = "https://tdcservice.thaicarecloud.org/buffe-constants/secretkey/?key="+config_sql[0].chars;
        this.webservice.getService(url).then((data)=>{
            setTimeout(()=>{
               // console.log(data[0].secretkey);
                let sql="UPDATE buffe_constants SET `value`='"+data[0].secretkey+"' WHERE `name` = '_SECRETKEY_'";
                this.sqliteService.Querysql(sql);
            },100); 
        }).catch(err=>{
            console.log("error "+err);
        });
        
         //setTimeout(()=>{console.log(this.sqliteService.getFindAll("buffe_constants"));},5000);
    },100);
    if($("#dbname").val() == "" || $("#dbname").val() == null){
       alert("กรุณาเลือก ฐานข้อมูล.");
       return false;
    }
    if($('#encodes').val() == "" || $("#encodes").val() == null){
       alert("กรุณากรอกข้อมูลการเข้ารหัส");
       return false; 
    }
    if($('#encodes').val().length < 6){
       alert("รหัสต้องมี 6 หลักขึ้นไป");
       return false;
    }
    /******************รับค่า form  ตรวจสอบค่า config database******************/
    let encodes = $('#encodes').val();
    this.mysql.setEncode(encodes);
    let frm = $('#DatabaseName').serializeArray();
    let data = {}; //data สำหรับเก็บ Key , value ที่ได้จากการ form
    $.each(frm, function (k, v) {  //loop เพื่อเก็บ name กับ value ของ form 
      data[v.name] = v.value;	//เก็บ value กับ name ใส่ data		[{ fname:'sdfs' , lname:'sdf'}]
    });
     



    //บันทึก dbname และ charset ลงใน database
    let data1 = { dbnames: data["dbname"], chars: data["encodes"] };
    let id = this.sqliteService.getFindAll("config_sql")[0].id;
    this.sqliteService.updateRecords('config_sql', data1, id).then(() => {
      //console.log("Update");
    }).catch(err => {
      console.log("error " + err);
    });

    // console.log(this.sqliteService.getFindAll("config_sql"));


    /******************Save config database cookie******************/
    this.mysql.setDbname(data);
    this.setCookieConfig();

    /******************Disable form config******************/
    $('#frmConnectDb input').prop('readonly', true);//input
    $('#dbname , #encodes').prop('readonly', true);
    $('#dbname, #dbtype, #dbtype').attr("disabled", true); //dropdownlist
    this.app.startJob();

    /******************Test connect database******************/
    // this.mysql.getUserAll().then(rows=>{ //แสดงผล Test
    //   console.log(rows);
    // }).catch(error=>{
    //    console.log(error);
    // });

    /******************Redirect to home******************/
     this.router.navigate(['/home']);

  }//end start
  setCookieConfig() {
    /******************Set Cookie Config******************/
    let data = {
      host: this.mysql.getHost(),
      user: this.mysql.getUser(),
      pass: this.mysql.getPass(),
      dbname: this.mysql.getDbname(),
      encode: this.mysql.getEncode()
    }
   // this.cookie.setCookie('thaicarecloud.org', 'set-cookie', JSON.stringify(data));
  }//setCookieConfig
  Stop() {

    console.log("Stop");
    $('#frmConnectDb input').prop('readonly', false);//input
    $('#dbname , #encodes').prop('readonly', false);
    $('#dbname, #dbtype, #dbtype, #histype,#btnConnect').attr("disabled", false); //dropdownlist
    $('#divStart').show();
    $('#divStop').hide();
    this.app.stopJob();

  }//Stop
  /***************************************** บันทึก การตั้งค่า database ใน sqlite *******************************************/
  SettingDatabase(data) {
    try {
      this.sqliteService.Querysql(this.TB_CONFIG_SQL);//create table config_sql 
      this.sqliteService.ConnectDb();//connect sqlite  
      this.histype_id = $("#histype").val();


      if (this.sqliteService.getFindAll("config_sql").length == 0) {//insert
        let dates = new Date();
        this.data_id = dates.getTime();


        let datas = { id: this.data_id, dbtypes: this.dbType, hosts: data.Host, users: data.Username, passs: data.Password, ports: data.Port, histypes: this.histype_id };
        this.sqliteService.createRecords("config_sql", datas).then(res => {
          console.log('Create new records config_sql success.');
          //alert('Success');
        }).catch(err => {
          console.log("error = " + err);
        });
      } else {//update
        try {
          setTimeout(() => {
            this.histype_id = $('#histype').val();
            let dbtypes = $('#dbtype').val();
            let data1 = { dbtypes:dbtypes, hosts: data.Host, users: data.Username, passs: data.Password, ports: data.Port, histypes: this.histype_id };
            let data2 = { 'id': this.data_id };
            let id = this.sqliteService.getFindAll("config_sql")[0].id;
            this.sqliteService.updateRecords('config_sql', data1, id).then(() => {
              //console.log("Update");
            }).catch(err => {
              console.log("error " + err);
            });
            let db = Database.prototype;
            let config_ = this.sqliteService.getFindAll("config_sql");

            db.host = config_[0].hosts;
            db.username = config_[0].users;
            db.password = config_[0].passs;
            db.port = config_[0].ports;
            db.charset = config_[0].chars;
            db.dbtype = config_[0].dbtypes;
            db.dbname = "";
            
          }, 500);

        } catch (e) {
          console.log("Error " + e);
        }

      }
      // console.log(this.sqliteService.getFindAll("config_sql"));
      //console.log(this.histype_id);
    } catch (e) {
      //console.log("Create table Error "+e)
    }

  }
  ngOnInit() {

    this.dbConnectConfig(0);

    setTimeout(() => {
      let check = this.sqliteService.getFindAll("config_sql").length;
      if (check > 0) {
        let config = this.sqliteService.getFindAll('config_sql');

        // console.log(config);
        let htype = config[0].histypes;

        setTimeout(() => {
          this.dbConnection();
          $('#histype option').removeAttr('selected').filter('[value=' + htype + ']').attr('selected', true);
        }, 200);
        setTimeout(() => {
          //console.log(config[0].dbnames);
          $('#dbname option').removeAttr('selected').filter('[value=' + config[0].dbnames + ']').attr('selected', true);
          $('#encodes').prop('readonly', true);
      }, 2000);
        $('#dbtype option').removeAttr('selected').filter('[value=' + config[0].dbtypes + ']').attr('selected', true);
        $('#Host').val(config[0].hosts);
        $('#Username').val(config[0].users);
        $('#Password').val(config[0].passs);
        $('#Port').val(config[0].ports);
        $('#encodes').val(config[0].chars);

        Database.prototype.id = config[0].id;
        Database.prototype.username = config[0].users;
        Database.prototype.password = config[0].passs;
        Database.prototype.host = config[0].hosts;
        Database.prototype.dbname = config[0].dbnames;
        Database.prototype.port = config[0].ports;
        Database.prototype.histype = config[0].histypes;
        Database.prototype.charset = config[0].chars;
        Database.prototype.dbtype = config[0].dbtypes;

        Database.prototype.tokken = this.sqliteService.getFindAll('logins')[0].access_token;
        //dbname
        //this.dbConnection();

        console.log("TODO: Disable ทุกอย่าง");

        //input ธรรมดา disable
        $('#frmConnectDb input').prop('readonly', true);//input
        $('#dbname').prop('readonly', true);
        setTimeout(() => {
          $('#encodes').prop('readonly', true);
        }, 500);
        //select option and button disable
        $('#dbname, #dbtype, #dbtype,#histype, #btnConnect').attr("disabled", true); //dropdownlist

        $("#divStop").show();

        // this.app.startJob();

      } else {
        $("#divStart").show();
      }
    }, 400);




  }



}
