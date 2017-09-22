import { Injectable } from '@angular/core';
const osUtils = require('os-utils');
import { Observable } from 'rxjs/Rx';
@Injectable()
export class OsService {

private ram;
public cpu;

  constructor() { 

  }

  getCpu(){

  	 return new Promise((resolve,reject)=>{
        osUtils.cpuUsage((v)=>{
             resolve(v*100);
          });
     });        
  }//getCpu

}
