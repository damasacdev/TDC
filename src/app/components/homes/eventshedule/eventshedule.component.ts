import { WriterService } from './../../../providers/writer.service';
import { AppComponent } from './../../../app.component';
import { Component, OnInit } from '@angular/core';
const {ipcRenderer} = require('electron');
import { Database } from '../../../models/Database';
import { SqliteDB } from '../../../providers/sqliteDB';
const $ = require('./../../../../assets/jquery/dist/jquery.min.js');
import { Tokken } from '../../../models/tokken';
import { MysqlService } from '../../../providers/mysql.service';
import { MssqlService } from '../../../providers/mssql.service';
import { Observable } from 'rxjs/Rx';

@Component({
  selector: 'app-eventshedule',
  templateUrl: './eventshedule.component.html',
  styleUrls: ['./eventshedule.component.scss'],
  providers: [MysqlService,WriterService]
})
export class EventsheduleComponent implements OnInit {

  private Eventdata: any;
  private tokken: any = new Tokken();
  private presql:any;

 private f_person= 0;
//  private f_person_tmp= 0;
 private f_address = 0;
 private f_death= 0;
 private diagnosis_opd= 0;
 private diagnosis_ipd= 0;
 private labfu= 0;
 private drug_opd= 0;
 private drug_ipd= 0;
 private f_chronic= 0;
 private f_service= 0;
 private countAll = 0;
private updateTime = ''

  constructor(private sqliteService: SqliteDB, private mysService: MysqlService,private app:AppComponent,private fileFn:WriterService) {
    

  }

  ngOnInit() {
    this.onEvent();
    ipcRenderer.on('background-send-countQueue', (event, data)=>{
       try{
         console.log(data);
         var html = '';
         var i = 0;
         $.each(data['dataQ'],(k,v)=>{
           var tbName = v.table;
           var qleft = v.qleft;
           if(tbName == 'error'){
              $('#dataQ').html("Count data error");
                  // this.updateTime = data['dateTime'];
              $('#updateTime').html(this.getDateTime());
              $('#btnRefreshQ').show();
           }else{
              if(qleft <= 0)qleft=0;
              if(tbName == '')tbName='ไม่มีข้อมูล';
              html += "<div class='col-sm-6'><dt>"+tbName.toLocaleString()+" : </dt> <dd><code>" +qleft.toLocaleString()+" </code> คิว</dd></div>";
              i++;
              if(i == data['dataQ'].length){
                $('#dataQ').removeClass('text-center');
                  $('#dataQ').html(html);
                  // this.updateTime = data['dateTime'];
                  $('#updateTime').html(this.getDateTime());
                  $('#btnRefreshQ').show();
              }
           }
         });
        
          // this.countAll = data;//['countAll'].toLocaleString();
          // this.f_person = data['f_person'].toLocaleString();
          // // this.f_person_tmp = data['f_person_tmp'].toLocaleString();
          // this.f_address = data['f_address'].toLocaleString();
          // this.f_death = data['f_death'].toLocaleString();
          // this.diagnosis_opd = data['diagnosis_opd'].toLocaleString();
          // this.diagnosis_ipd = data['diagnosis_ipd'].toLocaleString();
          // this.labfu = data['labfu'].toLocaleString();
          // this.drug_opd = data['drug_opd'].toLocaleString();
          // this.drug_ipd = data['drug_ipd'].toLocaleString();
          // this.f_chronic = data['f_chronic'].toLocaleString();
          // this.f_service = data['f_service'].toLocaleString();
     
          
       }catch(ex){
        console.log(ex);
      }
    });
  }

  onEvent() {

    setTimeout(() => {
      this.sqliteService.ConnectDb();
      let sitecode = this.sqliteService.getFindAll("logins")[0].sitecode;

      let sql = "SELECT * FROM buffe_transfer  LIMIT 10";
      this.mysService.setConnectDb({
        Host: Database.prototype.host,
        Username: Database.prototype.username,
        Password: Database.prototype.password,
        Port: Database.prototype.port,
        DB: Database.prototype.dbname
      });
      this.mysService.setDbname(Database.prototype.dbname);
      this.mysService.runQuery(sql).then(data => {
        this.Eventdata = data;
        
        this.presql = data[0]['presql'];
        
        console.log(this.presql);
      }).catch(err => {
        console.log("Error event");
      });


      // console.log(this.sqliteService.getFindAll("logins")[0].access_token);
    }, 500);//ตรวจสอบ login
  }

  getDateTime(){
        let dateTimes = new Date();
        let dd = dateTimes.getDate();
        var mm = dateTimes.getMonth();
        let yy = dateTimes.getFullYear() + 543;
        let hh = dateTimes.getHours();
        let mu = dateTimes.getMinutes();
        let ss = dateTimes.getSeconds();
        let m_names = new Array("ม.ค.", "ก.พ.", "มี.ค.",
            "เม.ย.", "พ.ค.", "มิ.ย.", "ก.ค.", "ส.ค.", "ก.ย.",
            "ต.ค.", "พ.ย.", "ธ.ค.");
        for (let j = 0; j < m_names.length; j++) {
            if (j == mm) {
               var mmm = m_names[j];
            }
        }
        return dd + "" +  mmm + "" + yy + " " +
            (hh < 10 ? '0' : '') + hh + ":" + (mu < 10 ? '0' : '') + mu + ":" + (ss < 10 ? '0' : '') + ss + " ";
    
  }

  refreshQ(){
    $('#dataQ').addClass('text-center');
    $('#dataQ').html('<i class="fa fa-spinner fa-spin" style="font-size:25px"></i> <br>กำลังเตรียมข้อมูล...');
    this.app.checkQ();
  }
  

}
