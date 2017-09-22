import { Component, OnInit, ViewContainerRef, ViewEncapsulation } from '@angular/core';
import { Overlay, overlayConfigFactory } from 'angular2-modal';
import { Modal, BSModalContext } from 'angular2-modal/plugins/bootstrap';
import { CustomModalContext2, CustomModal2 } from '../modal/custom-modal';
import { CustomModalContext, CustomModal } from '../modalbackground/custom-modal';
import { SqliteDB } from '../../providers/sqliteDB';
import { RouterModule, Router } from '@angular/router';
@Component({
  selector: 'app-temp',
  templateUrl: './login.component.html',
  providers: [Modal, Overlay]
})
export class LoginComponent implements OnInit {
  public title = "Login TDC";
  
  private login=[];

  constructor(public route:Router, public modal: Modal, public sqlitedb:SqliteDB) {
    //this.modal.open(CustomModal2,  overlayConfigFactory({ num1: 2, num2: 3 }, BSModalContext));
   
  }

  ngOnInit() {
    try{
      
      setTimeout(() => {
          this.sqlitedb.ConnectDb();
          try{
            if(this.sqlitedb.getFindAll('logins').length > 0){
                this.route.navigate(['/home']);
            }else{
                this.openCustom();
            }
          }catch(ex){console.log(ex)};
        }, 2500);//ตรวจสอบ login
    }catch(e){
       console.log(e);
    }
    
  }

  openCustom() {
    return this.modal.open(CustomModal2, overlayConfigFactory({ num1: 2, num2: 3 }, BSModalContext));
  }

 openCustom0() {
    return this.modal.open(CustomModal, overlayConfigFactory({ num1: 2, num2: 3 }, BSModalContext));
  }


} 
