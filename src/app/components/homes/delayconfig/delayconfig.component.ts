import { AppComponent } from './../../../app.component';
import { Component, OnInit } from '@angular/core';
import { MdSliderModule, MdSlider, MdInputContainer, MaterialModule } from '@angular/material';
import { BrowserAnimationsModule, NoopAnimationsModule } from '@angular/platform-browser/animations';
import { GaugeModule } from 'angular-gauge';
import { MysqlService } from '../../../providers/mysql.service';
import { MssqlService } from '../../../providers/mssql.service';
import { SqliteDB } from '../../../providers/sqliteDB';
import { Database } from '../../../models/Database';
import { Tokken } from '../../../models/tokken';
const {ipcRenderer} = require('electron');
const $ = require('./../../../../assets/jquery/dist/jquery.min.js');
import 'hammerjs';
@Component({
  selector: 'app-delayconfig',
  templateUrl: './delayconfig.component.html',
  styleUrls: ['./delayconfig.component.scss'],
  providers: [MysqlService, SqliteDB]
})
export class DelayconfigComponent implements OnInit {
  private minValue: any;
  private maxValue: any;

  private valueCF: any;

  private valueCM: any;

  private valueCT: any;

  private valueTP: any;

  private valueSD: any;

  private valueNR: any;

  private valueEV: any;

  private config ;

  private checkDisabled = false;

  private preLoading: boolean = false;

  constructor(private mysService: MysqlService, private mySqlite: SqliteDB,private App:AppComponent) {
    this.minValue = 1;
    this.maxValue = 120;
    this.valueCF = this.minValue;

    this.valueCM = this.minValue;

    this.valueCT = this.minValue;

    this.valueTP = this.minValue;

    this.valueSD = this.minValue;

    this.valueNR = this.minValue;

     this.valueEV = this.minValue;

    this.onQueryDelay();

    ipcRenderer.on('sendStatus', (event, data)=>{
        try{
          this.checkDisabled = data;
          
          if(this.App.statusJob == 'Started'){
                $("#groupBtn").hide();
            }else{
                $("#groupBtn").show();
            }
        }catch(ex){
          console.log(ex);
        }
    });

  }

  onQueryDelay() {
    if(this.checkDisabled != true){
        this.preLoading = false;
        setTimeout(() => {
          this.mySqlite.ConnectDb();
          let sitecode = this.mySqlite.getFindAll('logins')[0].sitecode;
          // query from sqlite
          this.config = this.mySqlite.getFindAll('buffe_config');
          this.config.forEach(el => {
            if(el.name == ('config_delay')){
              this.valueCF = el.value;
            }else if(el.name == ('command_delay')){
              this.valueCM = el.value;
            }else if(el.name == ('constants_delay')){
              this.valueCT = el.value;
            }else if(el.name == ('template_delay')){
              this.valueTP = el.value;
            }else if(el.name == ('sync_delay')){
              this.valueSD = el.value;
            }else if(el.name == ('sync_nrec')){
              this.valueNR = el.value;
            }
          });
          this.valueEV = 1;
          this.preLoading = true;

          /*
          let sqlQuery = " SELECT id, buffe_version, config_delay, command_delay, constants_delay, template_delay, sync_delay, sync_nrec ";
          sqlQuery += " FROM  buffe_config ";
          sqlQuery += " WHERE id=" + sitecode;
          
          this.mysService.setConnectDb({
            Host: Database.prototype.host,
            Username: Database.prototype.username,
            Password: Database.prototype.password,
            Port: Database.prototype.port,
            DB: Database.prototype.dbname
          });

          this.mysService.setDbname(Database.prototype.dbname);
          this.mysService.runQuery(sqlQuery).then(data => {
            this.preLoading = true;
            this.valueCF = data[0]['config_delay'];
            this.valueCM = data[0]['command_delay'];
            this.valueCT = data[0]['constants_delay'];
            this.valueTP = data[0]['template_delay']
            this.valueSD = data[0]['sync_delay'];
            this.valueNR = data[0]['sync_nrec'];

          }).catch(error => {
            console.log("Query data fail!");
          });
          */
        }, 1000);
    }

  }
  ngOnInit() {
    
  }

  onValueChangeCF(event) {
    this.valueCF = event.value;
  }

  onValueChangeCM(event) {
    this.valueCM = event.value;
  }

  onValueChangeCT(event) {
    this.valueCT = event.value;
  }

  onValueChangeTP(event) {
    this.valueTP = event.value;
  }

  onValueChangeSD(event) {
    this.valueSD = event.value;
  }

  onValueChangeNR(event) {
    this.valueNR = event.value;
  }

  onValueChangeEV(event) {
    this.valueEV = event.value;
  }

  onSaveDelay() {
    if(this.checkDisabled != true){
        this.preLoading = false;
      setTimeout(() => {
          this.mySqlite.ConnectDb();
          let sitecode = this.mySqlite.getFindAll('logins')[0].sitecode;
          let data='';
          this.config.forEach(el => {
            console.log(el);
            if(el.name == ('config_delay')){
              data += "('config_delay','" + this.valueCF + "'),";
            }else if(el.name == ('command_delay')){
              data += "('command_delay','" + this.valueCM + "'),";
            }else if(el.name == ('contans_delay')){
              data += "('contans_delay','" + this.valueCT + "'),";
            }else if(el.name == ('template_delay')){
              data += "('template_delay', '" + this.valueTP + "'),";
            }else if(el.name == ('sync_delay')){
              data += "('sync_delay', '" + this.valueSD + "'),";
            }else if(el.name == ('sync_nrec')){
              data += "('sync_nrec','" + this.valueNR + "'),";
            }else{
              data += "('"+ el.name +"','" + el.value + "'),";
            }
          });
          data += "('even_delay','" + this.valueEV + "'),";
          data = data.substr(0,data.length-1);
          // data = " ('config_delay','" + this.valueCF + "'),('command_delay','" + this.valueCM + "'),('constants_delay','" + this.valueCT + "'),('template_delay', '" + this.valueTP + "'),('sync_delay', '" + this.valueSD + "'),('sync_nrec','" + this.valueNR + "')";

          this.mySqlite.replaceRecords(data, 'buffe_config').then(res => {
            alert('Save data config success.');
            this.preLoading = true;
          }).catch(error => {
            alert('Save data config fail.');
            console.log(error);
            this.preLoading = true;
          });
        }, 1000);
    }
  }

  getElement(data) {
    if (typeof (data) == 'string') {
      return document.getElementById(data);
    }
    if (typeof (data) == 'object' && data instanceof Element) {
      return data;
    }
    return null;
  }
}
