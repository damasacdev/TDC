import { WriterService } from './../../../providers/writer.service';
import { SqliteDB } from './../../../providers/sqliteDB';
import { AppComponent } from './../../../app.component';
import { Component, OnInit } from '@angular/core';
import{ MdSliderModule,MdSlider,MdInputContainer, MaterialModule,MdProgressBarModule } from '@angular/material';
import { BrowserAnimationsModule, NoopAnimationsModule } from '@angular/platform-browser/animations';
const {ipcRenderer} = require('electron');
import { Observable } from 'rxjs/Rx';
const $ = require('./../../../../assets/jquery/dist/jquery.min.js');

@Component({
  selector: 'app-transferdata',
  templateUrl: './transferdata.component.html',
  styleUrls: ['./transferdata.component.scss'],
  providers:[SqliteDB,WriterService]
})
export class TransferdataComponent implements OnInit {
  
  color = 'primary';
  mode = 'determinate';
  private transferBar = 0;
  private countData = 0;
  private sendData = 0;
  private countAll = 0;
  private sendSuccess = 0;
  
  constructor(private sqlite:SqliteDB ,private app:AppComponent,private fileFn:WriterService) {
   

   

  }

  ngOnInit() {

     ipcRenderer.on('background-send-countData', (event, data)=>{
      try{
        this.countAll = data['countAll'];
        $('#nSendData').html(data['countAll'].toLocaleString());
        // this.countData = data['countAll'].toLocaleString();
        this.transferBar = (this.sendSuccess / (this.sendSuccess + this.countAll)) * 100;
        $('#progress-transfer').css('width',this.transferBar+"%");
        $('#transferBar').html(this.transferBar.toFixed(1));
      }catch(ex){
        console.log(ex);
      }
    });
    ipcRenderer.on('background-send-sendData', (event, data)=>{
      try{
        this.sendSuccess = data;
        $('#sendData').html(data.toLocaleString());
        // this.sendData = data.toLocaleString();
        this.transferBar = (data / (data + this.countAll)) * 100;
        $('#progress-transfer').css('width',this.transferBar+"%");
        $('#transferBar').html(this.transferBar.toFixed(1));
      }catch(ex){
        console.log(ex);
      }
    });
    
  }

}
