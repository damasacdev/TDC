import { Injectable } from '@angular/core';
import { SqliteDB } from '../../providers/sqliteDB';
import { WebserviceService } from '../../providers/webservice.service';
@Injectable()
export class SettingWebService {
    constructor(
        private sqlite: SqliteDB,
        private webservice: WebserviceService
    ) { }

    public getWebservice(url) {
        return this.webservice.getService(url);
    }//getWebservice   ทำหน้าที่ ติดต่อกับ webservice
}