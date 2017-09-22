// import { Injectable } from '@angular/core';
// const session = require('electron').remote.session;
// const ses = session.fromPartition('persist:name');
// import {Observable, Subject, ReplaySubject } from 'rxjs/Rx';

// @Injectable()
// export class CookieService { 
//   constructor() {}


//  getCookie(cName){
 
//   return new Promise((resolve,reject)=>{
//      ses.cookies.get({name:cName},(err,res)=>{
//          if(err)reject(err);
//          if(res)resolve(res);
//      });
//   });
//  }//getCookie 
//  setCookie(cUrl:string, cName:string, cValue:string){
//    let expiration = new Date();
//    let hour = expiration.getHours();
//         hour = hour + 666666;
//         expiration.setHours(hour);
//     return new Promise((resolve,reject)=>{
//        ses.cookies.set({
//            url:cUrl, 
//            name:cName, 
//            value:cValue,
//            expirationDate:expiration.getTime()
//           },(res)=>{
//               resolve(res);
//          }),(err)=>{
//              reject(err);
//          };
//     });     
       

//  }//setCookie
   

// }
