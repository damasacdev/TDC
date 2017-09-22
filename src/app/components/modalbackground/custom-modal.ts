import { Component } from '@angular/core';

import { DialogRef, ModalComponent, CloseGuard } from 'angular2-modal';
import { BSModalContext } from 'angular2-modal/plugins/bootstrap';

import { LoginService } from '../../providers/login.service';
//import { CookieService } from '../../providers/cookie.service';
import { WriterService } from '../../providers/writer.service'; 
const $ = require('../../../assets/jquery/dist/jquery.min.js');
//import * as $ from '../../../assets/jquery/dist/jquery.min.js';
import { ModalDirective } from 'ngx-bootstrap';
import { RouterModule, Router }  from '@angular/router';
import { Tokken } from '../../models/tokken';

export class CustomModalContext extends BSModalContext {
  public num1: number;
  public num2: number;
}

/**
 * A Sample of how simple it is to create a new window, with its own injects.
 */
@Component({
  selector: 'modal-content',
  styles: [`
        .custom-modal-container {
            padding: 15px;
        }

        .custom-modal-header {
            background-color: #3c8dbc;
            color: #fff;
            -webkit-box-shadow: 0px 3px 5px 0px rgba(0,0,0,0.75);
            -moz-box-shadow: 0px 3px 5px 0px rgba(0,0,0,0.75);
            box-shadow: 0px 3px 5px 0px rgba(0,0,0,0.75);
            margin-top: -15px;
            margin-bottom: 40px;
        }
    `],
  //TODO: [ngClass] here on purpose, no real use, just to show how to workaround ng2 issue #4330.
  // Remove when solved.
   templateUrl: './custom-modal.html',
   providers:[LoginService,WriterService]
  
})
export class CustomModal implements CloseGuard, ModalComponent<CustomModalContext> {
  context: CustomModalContext;
   
  public wrongAnswer: boolean;
  private login=[];
  public title = "Thai Care Cloud";
  
  constructor(public dialog: DialogRef<CustomModalContext>, private router:Router, private loginService:LoginService, private writerJson:WriterService) {
    this.context = dialog.context;
   // this.wrongAnswer = true;
    dialog.setCloseGuard(this);
  }

  onKeyUp(value) {
  //  this.wrongAnswer = value != 5;
   // this.dialog.close();
  }


  beforeDismiss(): boolean {
    return true;
  }

  beforeClose(): boolean {
    return this.wrongAnswer;
  } 

  Login(){
  this.dialog.close();
this.goHome();  
  }
   goHome(){
    this.router.navigate(['/home']); 
  }
  getSetting(){
    this.router.navigate(['/setting']); 
  }

//   Login(){
//  //   this.wrongAnswer =false;
//      this.dialog.close();
//    console.log("tesstssss");
//   }
}
