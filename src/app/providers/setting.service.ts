import { Injectable } from '@angular/core';
//const session = require('electron').remote.session;
//const ses = session.fromPartition('persist:name');
import {Observable, Subject, ReplaySubject } from 'rxjs/Rx'; 
import { Http,Headers,Response} from '@angular/http';
@Injectable()
export class SettingService { 
  constructor(private http:Http ) { }
  private url = "https://tdcservice.thaicarecloud.org";
 
 getSetting(dataurl,token,histypes=''){  
   return new Promise((resove,reject)=>{
      this.http.get(this.url+"/"+dataurl+"?token="+token+"&his_type="+histypes)  
      .subscribe(data=>{
         resove(data.json());
       },error=>{
         reject(error);
      });
    });   
 }//getSetting

 getServiceApi(url){  
   return new Promise((resove,reject)=>{
      this.http.get(url)
      .subscribe(data=>{
         resove(data.json());
       },error=>{
         reject(error);
      });
    });   
 }//getSetting


}
