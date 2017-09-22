import { LoginComponent } from './components/login/login.component';
import { LogoutComponent } from './components/login/logout/logout.component';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HomesComponent } from './components/homes/homes.component';
import { SettingsComponent } from './components/settings/settings.component';
import { ToolsComponent } from './components/tools/tools.component';

import { SettingComponent } from './components/setting/setting.component';
const routes: Routes = [
    {
        path: '',
        component: LoginComponent
    },{
        path: 'home',
        component: HomesComponent
    },{
        path: 'logout',
        component: LogoutComponent
    },{
        path: 'settings',
        component: SettingsComponent
    },{
        path: 'tools',
        component: ToolsComponent
    },{
        path: 'login',
        component: LoginComponent
    },{
        path: 'setting',
        component: SettingComponent
    },

];

@NgModule({
    imports: [RouterModule.forRoot(routes, {useHash: true})],
    exports: [RouterModule]
})
export class AppRoutingModule { }
