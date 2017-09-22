import { Injectable } from '@angular/core';
import { SettingModel } from './setting.model';//model
const $ = require('../../../assets/jquery/dist/jquery.min.js');
@Injectable()
export class SettingForm {
    public getCreateFormConnectDatabase(id,data) { //params คือ id ที่ถูกส่งมาจาก การเลือก Database
        
        let db = new SettingModel();
        let dbname = db.dbconnect[id].length - 1;
        $("#dbName").html(db.dbtype[id]);
    let html = "";
        html += "<form id='frmConnectDb'>";
        //เป็นตัวบอกว่าเป็น database ชนิดอะไร 1=mysql , 2=sql server , 3=oracle
        html += "<input type='hidden' name='_id' id='_id' value='" + db.dbconnect[id][dbname - 1] + "'>";
        for (let i = 0; i < db.dbconnect[id].length - 3; i++) {
            html += "<div>";
            html += "<label>" + db.dbconnect[id][i] + "</label>";
            if (db.dbconnect[id][i] === "Password") {
                html += `<input type='password' value='${data[0].passs}' class='form-control' name='${db.dbconnect[id][i]}' id='${db.dbconnect[id][i]}'>`;
            } else if (db.dbconnect[id][i] === "Port") {
                html += `<input type='text' class='form-control' value='${data[0].ports}' name='${db.dbconnect[id][i]}' id='${db.dbconnect[id][i]}'>`;
            } else if (db.dbconnect[id][i] === "Host") {
                html += `<input type='text' class='form-control' value='${data[0].hosts}'  name='${db.dbconnect[id][i]}' id='${db.dbconnect[id][i]}'>`;
            }else if (db.dbconnect[id][i] === "Username") {
                html += `<input type='text' class='form-control' value='${data[0].users}'  name='${db.dbconnect[id][i]}' id='${db.dbconnect[id][i]}'>`;
            }
            html += "</div>";
        }
        html += "</form>";
        return html;
    }//getCreateFormConnectDatabase ทำหน้าที่ สร้าง Form Connection Database
    public getKeyValueForm(frm) {
        let data = {};
        $.each(frm, function (k, v) {
          data[v.name] = v.value;
        });
        return data;
      }//getKeyValueForm ทำหน้าที่ เก็บค่าจาก Form key value 

   public getModal(){
       
   }   
    
}