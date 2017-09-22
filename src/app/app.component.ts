import { WriterService } from './providers/writer.service';
import { Component, OnInit } from '@angular/core';
import { ElectronService } from './providers/electron.service';
//import { CookieService } from './providers/cookie.service';
const $ = require('../assets/jquery/dist/jquery.min.js');

import { Http, Headers } from '@angular/http';

import { Tokken } from './models/tokken';
import { Observable } from 'rxjs/Rx';
import { SqliteDB } from './providers/sqliteDB';
import { RouterModule, Router } from '@angular/router';
import { CustomModal2 } from './components/modal/custom-modal';
import { SettingComponent } from './components/setting/setting.component';
const electron = require('electron');
const ipcMain = electron.ipcMain;
const ipcRenderer = electron.ipcRenderer;
const isOnline = require('is-online');
const mysql = require('mysql');
const logFn = require('../lib/logFn.js');

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  providers: [SqliteDB,WriterService]
})
export class AppComponent implements OnInit{
  private user = [];
  public statusJob: string = "Stopped";
  public qJob: string = "";
  private statusPing = "Checking...";

  public disConfigDelay = '!isValid';

  private dataConfigSql;
  private dataLogin;
  private dataConfig;
  private dataConstant;

  private timerStatus;
  private controlStatus;

  private timerConstant;
  private controlTimerConstant;

  private timerCommand;
  private controlTimerCommand;

  private timerConfig;
  private controlTimerConfig;

  private timerSync;
  private controlTimerSync;

  private timerPing;
  private controlTimerPing;

  private con = '';
  private updateTxt;

private version;
public dataQ;
public dataTransfer;
public autoStart;




  constructor(
    private sqlite: SqliteDB, 
    private router: Router, 
    public electronService: ElectronService, 
    private http: Http ,
    private fileFn:WriterService
    
    ) {
    this.loadDataLogin();
}//constructor

loadDataLogin(){
  setTimeout(() => {
      try{
      this.dataLogin = this.sqlite.getFindAll("logins");
      this.dataConfig = this.sqlite.getFindAll("buffe_config");
      this.dataConstant = this.sqlite.getFindAll("buffe_constants");
      if(this.dataLogin.length > 0){
        this.dataConfigSql = this.sqlite.Querysql("SELECT * FROM config_sql WHERE access_token = '"+this.dataLogin[0].access_token+"' AND sitecode='"+this.dataLogin[0].sitecode+"' ");
        $('#name').html(this.dataLogin[0].name);
        $('#sitecode').html("<i class='fa fa-building'></i> " + this.dataLogin[0].sitecode + " : " + this.dataLogin[0].hospital);
        
      }
      this.loadCookie();
      }catch(ex){
        console.log(ex);
      }
      

    }, 1000);
}

  

  loadCookie() {
    setTimeout(() => {
        try{
          if(this.dataLogin.length > 0){
          this.dataLogin = this.sqlite.Querysql("SELECT * FROM config_sql WHERE access_token = '"+this.dataLogin[0].access_token+"' AND sitecode='"+this.dataLogin[0].sitecode+"' ");
          }//$('#name').html(this.dataLogin[0].name);
         // $('#sitecode').html("<i class='fa fa-building'></i> " + this.dataLogin[0].sitecode + " : " + this.dataLogin[0].hospital);
        }catch(e){
           console.log(e);
        }
      
    }, 500);

  }//loadCookie
  

  startJob() {
    // if(this.dataConfigSql[0] != null && this.dataLogin[0] != null && this.dataConfig != null && this.dataConstant != null){
       setTimeout(() => {
          try{
              this.dataLogin = this.sqlite.getFindAll("logins");
              this.dataConfig = this.sqlite.getFindAll("buffe_config");
              this.dataConstant = this.sqlite.getFindAll("buffe_constants");
              this.dataConfigSql = this.sqlite.Querysql("SELECT * FROM config_sql WHERE access_token = '"+this.dataLogin[0].access_token+"' AND sitecode='"+this.dataLogin[0].sitecode+"' ");

              if(this.dataConfigSql[0]['dbnames'] != ''){
                $('#btnStopJob').attr('disabled', false);
                $('#btnPauseJob').attr('disabled', false);
                $('#btnStartJob').attr('disabled', true).text(' Resume');
                this.statusJob = "Started";
                var params = {
                  dataConfigSql: this.dataConfigSql[0],
                  dataLogin: this.dataLogin[0],
                  dataConfig: this.dataConfig,
                  dataConstant: this.dataConstant,
                  status: '1',
                  connection: '0'

                };
                console.log(params);
                $('#view-log').hide();
                logFn.writerData('autoStart.json', '{ "status": "1" }');
                ipcRenderer.send('call-backgroud-process', params);
                ipcRenderer.send('sendStatus', true);
                this.router.navigate(['/home']);
              }else{
                alert('กรุณาตั้งค่าฐานข้อมูล');
              }
          }catch(ex){
            console.log(ex);
          }

         }, 500);

    // }else{

    //   setTimeout(() => {

    //     this.dataLogin = this.sqlite.getFindAll("logins");
    //     this.dataConfig = this.sqlite.getFindAll("buffe_config");
    //     this.dataConstant = this.sqlite.getFindAll("buffe_constants");
    //     this.dataConfigSql = this.sqlite.getFindAll("config_sql");
        

    //   }, 1000);
    // }

  }
  pauseJob() {
    $('#btnStopJob').attr('disabled', false);
    $('#btnPauseJob').attr('disabled', true);
    $('#btnStartJob').attr('disabled', false).text(' Resume');
    this.statusJob = "Paused";

    var params = {
      dataConfigSql: this.dataConfigSql[0],
      dataLogin: this.dataLogin[0],
      dataConfig: this.dataConfig,
      dataConstant: this.dataConstant,
      status: '0',
      connection: '0'
    };
    logFn.writerData('autoStart.json', '{ "status": "0" }');
    ipcRenderer.send('sendStatus', false);
    ipcRenderer.send('call-backgroud-process', params);
    // this.qJob = "";
     $('#process-queue').html('');
     $('#view-log').show();
    // this.fileFn.writerJsonConfig('job.json','{"job":""}');
    // this.controlStatus.unsubscribe();

  }

  stopJob() {
    $('#btnStopJob').attr('disabled', true);
    $('#btnPauseJob').attr('disabled', true);
    $('#btnStartJob').attr('disabled', false).text(' Start');
    this.statusJob = "Stopped";

    var params = {
      dataConfigSql: this.dataConfigSql[0],
      dataLogin: this.dataLogin[0],
      dataConfig: this.dataConfig,
      dataConstant: this.dataConstant,
      status: '0',
      connection: '0'
    };
    logFn.writerData('autoStart.json', '{ "status": "0" }');
    ipcRenderer.send('sendStatus', false);
    ipcRenderer.send('call-backgroud-process', params);
    // thi
    $('#process-queue').html('');
    $('#view-log').show();
    // this.fileFn.writerJsonConfig('job.json','{"job":""}');
    // this.controlStatus.unsubscribe();
  }

   checkQ() {
      setTimeout(() => {
          try{
                var params = {
                  dataConfigSql: this.dataConfigSql[0],
                  dataLogin: this.dataLogin[0],
                  dataConfig: this.dataConfig,
                  dataConstant: this.dataConstant,
                  status: '2',
                  connection: '0'

                };
                ipcRenderer.send('call-backgroud-process', params);
              
          }catch(ex){
            console.log(ex);
          }

      },500);

  }

ngOnInit(){
      ipcRenderer.on('checkOnline', (event, data)=>{
      isOnline().then(internetConnect => {
                if (internetConnect == true) {
                   $('#statusColor').css({ 'color': '#36FF0E' });
                    this.statusPing = 'Online'
                } else {
                     $('#statusColor').css({ 'color': '#FF0E12' });
                      this.statusPing = "Offline";
                }
            });
         
      });

      ipcRenderer.on('background-send-job', (event, data)=>{
          // if(data != "200 SyntaxError: Unexpected end of JSON input"){
          // this.qJob = data;
          // console.log(data);
          // }
          if(this.statusJob == "Started"){
             $('#process-queue').html(data);
          }
      });
}

autoStartFn(){
      logFn.readFile('autoStart.json').then(res => {
          let autoStartData = JSON.parse(res);
          if(autoStartData['status'] == '1'){
              this.startJob();
          }
      }).catch(err => {
          console.log(err);
      });
}

hideGroupBtnApp(){
  $('#groupBtnApp').hide();
}
showGroupBtnApp(){
  $('#groupBtnApp').show();
}



}//mainClass
