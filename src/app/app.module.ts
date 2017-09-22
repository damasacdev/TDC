import 'zone.js';
import 'reflect-metadata';
 
 
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';

import { AppComponent } from './app.component';


import { AppRoutingModule } from './app-routing.module';

import { ElectronService } from './providers/electron.service';

import { TabsModule  } from 'ngx-bootstrap';

import { AlertModule,  } from 'ngx-bootstrap';
import { ProgressbarModule } from 'ngx-bootstrap';

import { HomesComponent } from './components/homes/homes.component';
//import { LoginsComponent } from './components/logins/logins.component';
import { SettingsComponent } from './components/settings/settings.component';
import { CustomModalContext2, CustomModal2 } from './components/modal/custom-modal';
import { CustomModalContext, CustomModal } from './components/modalbackground/custom-modal';
import{MdSliderModule,MdSlider,MdInputContainer, MaterialModule,MdProgressBarModule} from '@angular/material';
import{BrowserAnimationsModule,NoopAnimationsModule} from '@angular/platform-browser/animations';
import { GaugeModule } from 'angular-gauge';
import {GaugeDefaults} from 'angular-gauge/gauge-defaults.service';
import 'hammerjs';

import { ModalModule } from 'angular2-modal';
import { BootstrapModalModule } from 'angular2-modal/plugins/bootstrap';
import { LoginComponent } from './components/login/login.component';
import { ToolsComponent } from './components/tools/tools.component';
import { BackgroundComponent } from "./components/background/background.component";
import { DashboardComponent } from './components/homes/dashboard/dashboard.component';
import { DelayconfigComponent } from './components/homes/delayconfig/delayconfig.component';
import { ConstantComponent } from './components/homes/constant/constant.component';
import { NewcommandComponent } from './components/homes/newcommand/newcommand.component';
import { TransferdataComponent } from './components/homes/transferdata/transferdata.component';
import { EventsheduleComponent } from './components/homes/eventshedule/eventshedule.component';
import { DatabaseComponent } from './components/settings/database/database.component';
import { LogoutComponent } from './components/login/logout/logout.component';
import { MysqlCommandComponent } from './components/background/mysql-command/mysql-command.component';

import { ConnectdbService } from './providers/connectdb.service';
import { SqliteDB } from './providers/sqliteDB';
import { MysqlService } from './providers/mysql.service';
import { WebserviceService } from './providers/webservice.service';
import { MssqlService } from './providers/mssql.service';
import { SettingComponent } from './components/setting/setting.component';

@NgModule({
  declarations: [
    AppComponent,
    HomesComponent,
   // LoginsComponent,
    SettingsComponent,
    CustomModal,
     CustomModal2,
     LoginComponent,
     ToolsComponent,
     BackgroundComponent,
     DashboardComponent,
     DelayconfigComponent,
     ConstantComponent,
     NewcommandComponent,
     TransferdataComponent,
     EventsheduleComponent,
     DatabaseComponent,
     LogoutComponent,
     SettingComponent,
     MysqlCommandComponent,
  ],
  imports: [
 
    BrowserModule,
    FormsModule,
    HttpModule,
    AppRoutingModule,
    GaugeModule,
    MdSliderModule,
    MaterialModule,
    BrowserAnimationsModule,
    AlertModule.forRoot(),
    ModalModule.forRoot(),
    ProgressbarModule.forRoot(),
    TabsModule.forRoot(),

    BootstrapModalModule

  ],
  providers: [ElectronService,GaugeDefaults,ConnectdbService,SqliteDB,MysqlService,MssqlService,WebserviceService],
  bootstrap: [AppComponent],
    entryComponents: [CustomModal2,CustomModal]

})
export class AppModule { }
