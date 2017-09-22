import { Injectable } from '@angular/core';
const fs = require('fs');
const path = require('path');
 

@Injectable()
export class WriterService {

  constructor() { }
  WriterJson(file_name:string, data:any){

    return new Promise( (resolve,reject) =>{
      fs.writeFile('./src/assets/json/'+file_name+".json", data, (err,res)=>{
           if(err){reject(err);}
           if(res){resolve(res);}
      });
    });

  };//เขียน file json

  /*********************************** เขียไฟล์ json ********************************** */

  setPath(filename) {//ตั้งค่า path ของ json
        let paths = path.resolve('./src/'+filename);
        return new Promise((resolve, reject) => {
            fs.readFile(paths, function (err, data) {
                if (err) { reject("err"); }
                if (data) { resolve("success"); }
            });
        });
    }
  writerJsonConfig(filename, data) {//ตั้งค่า path ของ sqlite
        try {
            this.setPath(filename).then(res => {
 
                fs.writeFile("./src/"+filename, data, (err,res)=>{
                     if(err){console.log('error');}
                     if(res){ console.log("success");}
                });
            }).catch(err => {
                
                 fs.writeFile("./"+filename, data, (err,res)=>{
                     if(err){console.log('error');}
                     if(res){ console.log("success");}
                });
            });
        } catch (err) {
            console.log(err);
        }
 
 }//setPath
/*********************************** อ่านไฟล์ json ********************************** */
readJsonConfig(filename, data) {//ตั้งค่า path ของ sqlite
        try {
            this.setPath(filename).then(res => {
 
                fs.writeFile("./src/"+filename, data, (err,res)=>{
                     if(err){console.log('error');}
                     if(res){ console.log("success");}
                });
            }).catch(err => {
                
                 fs.writeFile("./"+filename, data, (err,res)=>{
                     if(err){console.log('error');}
                     if(res){ console.log("success");}
                });
            });
        } catch (err) {
            console.log(err);
        }
 
 }//setPath

 readFileFn(filename) { //ตั้งค่า path ของ sqlite
        try {
            return new Promise((resolve, reject) => {
                this.setPath(filename).then(res => {

                    fs.readFile("./src/" + filename, 'utf8', (err, res) => {
                        if (err) { reject(err) }
                        if (res) { resolve(JSON.parse(res)); }
                    });
                }).catch(err => {

                    fs.readFile("./" + filename, 'utf8', (err, res) => {
                        if (err) { reject(err) }
                        if (res) { resolve(JSON.parse(res)); }
                    });
                });
            });
        } catch (err) {
            console.log(err);
        }
 }


}
