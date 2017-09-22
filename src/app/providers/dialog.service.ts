import { Injectable } from '@angular/core';
const {dialog} = require('electron').remote;
@Injectable()
export class DialogService {
    Success(title,msg){
         dialog.showMessageBox({title:title,message: msg,buttons: ["OK"] });
    }
    Error(title,msg){
        dialog.showErrorBox(title, msg);
    }
}