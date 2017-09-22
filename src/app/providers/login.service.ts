import { Injectable } from '@angular/core';
import { Http,Headers } from '@angular/http';
 
@Injectable()
export class LoginService {
  private url = "https://tdcservice.thaicarecloud.org/user";
  constructor(private http:Http ) { } 
  
  createAuthorizationHeader(headers: Headers , username,password) {
    try{
      headers.append('Authorization', 'Basic ' +
      btoa(username+":"+password)); //base64
    }catch(ex){
      headers.append('Authorization', 'Basic ' +
      btoa(encodeURIComponent( username+":"+password ))); //base64
    }
  }//createAuthorizationHeader

  getLogin(username, password){
    let headers = new Headers();
    this.createAuthorizationHeader(headers, username, password);

    return new Promise((resolve,reject)=>{
      this.http.get(this.url,{headers:headers}).subscribe((data)=>{
         resolve(data.json());
       },(error)=>{
         reject(error.json());
      });
    });   
  }//getLogin 

}
