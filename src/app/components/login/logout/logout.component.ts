import { Component, OnInit } from '@angular/core';
import { SqliteDB } from '../../../providers/sqliteDB';
import { RouterModule, Router } from '@angular/router';
@Component({
  selector: 'app-logout',
  templateUrl: './logout.component.html',
  styleUrls: ['./logout.component.scss'],
  providers:[SqliteDB]
})
export class LogoutComponent {

  constructor(public sqlite:SqliteDB, public route:Router) {
     this.sqlite.ConnectDb();
     this.Logout();
     
  }
  Logout(){
      let data=['logins','buffe_config','buffe_constants','buffe_command'];
      
      setTimeout(()=>{
       for(let i=0; i<data.length; i++){
           this.sqlite.getDropTable(data[i]);
       }
        
      },500);
      this.route.navigate(['/login']);
      //this.route.navigate(['/login']);
  }
  

}
