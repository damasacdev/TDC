import { Injectable } from '@angular/core';
import { Http,Headers } from '@angular/http';
@Injectable()
export class WebserviceService {
  // private url = "https://tdcservice.thaicarecloud.org/user";
  // https://tdcservice.thaicarecloud.org/buffe-constants/secretkey/?key=

  constructor(private http:Http) { }
  getService(url){
      return new Promise((resolve,reject)=>{
      this.http.get(url).subscribe((data)=>{
         resolve(data.json());
       },(error)=>{
         reject(error.json());
      });
    });   
  }

  getPing(url){
    //let url ="https://tdcservice.thaicarecloud.org/buffe-config/ping";
     return new Promise((resolve,reject)=>{
        this.http.get(url).subscribe((data)=>{
           resolve(data.json());
         },(error)=>{
           reject(error.json());
        });
      });
  }
}
  