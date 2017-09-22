import { WriterService } from './../../../providers/writer.service';
import { SqliteDB } from './../../../providers/sqliteDB';
import { AppComponent } from './../../../app.component';
import { Component, OnInit } from '@angular/core';
const $ = require('./../../../../assets/jquery/dist/jquery.min.js');
const os = require('os');
const osUtils = require('os-utils');
import { Observable } from 'rxjs/Rx';
import { GaugeModule } from 'angular-gauge';
const fs = require('fs');
const path = require('path');


// const getProcessFn = require('../../../../backgroundtask/getProcess.js');

import { OsService } from '../../../providers/os.service';
//import { ElectronService } from 'ngx-electron';  private _electronService: ElectronService

const electron = require('electron');
const ipcMain = electron.ipcMain;
const ipcRenderer = electron.ipcRenderer;
@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
  providers:[OsService,SqliteDB,WriterService],
})
export class DashboardComponent implements OnInit {


private ramApp;
private cpuApp;
private ramTotal;
private cpuTotal;
private valueRamTotal;
// private processData;
private logTxt:string = '';

  constructor(private osService:OsService,private app: AppComponent,private SqliteFn:SqliteDB,private fileFn:WriterService) {


   }



  ngOnInit() {
      try{


      // ipcRenderer.on('background-send-job', (event, data)=>{
      //    if(data != ''){
      //       this.logTxt = this.logTxt+data+" \r\n";
      //     }
      // });
      
       ipcRenderer.on('getProcess', (event, data)=>{
              this.cpuApp = data['cpuApp']['percentCPUUsage'];
              this.ramApp = data['ramApp'];
              this.cpuTotal = data['cpuTotal'];
              this.ramTotal = data['ramTotal'];
              if(this.cpuApp <= 60){
                $('#cpuApp').removeClass('progress-bar-warning');
                $('#cpuApp').removeClass('progress-bar-danger');
                $('#cpuApp').addClass('progress-bar-success');
              }else if(this.cpuApp > 60 && this.cpuApp <= 80){
                $('#cpuApp').removeClass('progress-bar-success');
                $('#cpuApp').removeClass('progress-bar-danger');
                $('#cpuApp').addClass('progress-bar-warning');
              }else if(this.cpuApp > 80){
                $('#cpuApp').removeClass('progress-bar-success');
                $('#cpuApp').removeClass('progress-bar-warning');
                $('#cpuApp').addClass('progress-bar-danger');
              }

              if(this.ramApp <= 60){
                $('#ramApp').removeClass('progress-bar-warning');
                $('#ramApp').removeClass('progress-bar-danger');
                $('#ramApp').addClass('progress-bar-success');
              }else if(this.ramApp > 60 && this.ramApp <= 80){
                $('#ramApp').removeClass('progress-bar-success');
                $('#ramApp').removeClass('progress-bar-danger');
                $('#ramApp').addClass('progress-bar-warning');
              }else if( this.ramApp > 80){
                $('#ramApp').removeClass('progress-bar-success');
                $('#ramApp').removeClass('progress-bar-warning');
                $('#ramApp').addClass('progress-bar-danger');
              }

              if(this.cpuTotal <= 60){
                $('#cpuTotal').removeClass('progress-bar-warning');
                $('#cpuTotal').removeClass('progress-bar-danger');
                $('#cpuTotal').addClass('progress-bar-success');
              }else if(this.cpuTotal > 60 && this.cpuTotal <= 80){
                $('#cpuTotal').removeClass('progress-bar-success');
                $('#cpuTotal').removeClass('progress-bar-danger');
                $('#cpuTotal').addClass('progress-bar-warning');
              }else if(this.cpuTotal > 80){
                $('#cpuTotal').removeClass('progress-bar-success');
                $('#cpuTotal').removeClass('progress-bar-warning');
                $('#cpuTotal').addClass('progress-bar-danger');
              }

              if(this.ramTotal <=60){
                $('#ramTotal').removeClass('progress-bar-warning');
                $('#ramTotal').removeClass('progress-bar-danger');
                $('#ramTotal').addClass('progress-bar-success');
              }else if(this.ramTotal > 60 && this.ramTotal <= 80){
                $('#ramTotal').removeClass('progress-bar-success');
                $('#ramTotal').removeClass('progress-bar-danger');
                $('#ramTotal').addClass('progress-bar-warning');
              }else if(this.ramTotal > 80){
                $('#ramTotal').removeClass('progress-bar-success');
                $('#ramTotal').removeClass('progress-bar-warning');
                $('#ramTotal').addClass('progress-bar-danger');
              }
              $('#cpuApp').css('width',this.cpuApp+"%");
              $('#cpuAppTxt').html(this.cpuApp.toFixed(1)+" %");
              $('#ramApp').css('width',this.ramApp+"%");
              $('#ramAppTxt').html(this.ramApp.toFixed(1)+" %");
              $('#cpuTotal').css('width',this.cpuTotal+"%");
              $('#cpuTotalTxt').html(this.cpuTotal.toFixed(1)+" %");
              $('#ramTotal').css('width',this.ramTotal+"%");
              $('#ramTotalTxt').html(this.ramTotal.toFixed(1)+" %");

              // this.valueRamTotal = data['valueRamTotal'];
        });
      
        

        // ipcRenderer.on('getProcessData', (event, data)=>{
        //   console.log("getProcessData");
        //       console.log(data);
        //       this.processData = data;
        // });
    }catch(ex){
      console.log(ex);
    }
  }

  percentagValue(value){
      return value.toFixed(1)+"%";
  }

 
}
