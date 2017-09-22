import { Injectable } from '@angular/core';
import { SqliteDB } from './sqliteDB';
 
@Injectable()
export class CheckLogin {
    constructor(
        private sqlite:SqliteDB
    ){

    }

    Test(){
        return this.sqlite.getFindAll('logins');
    }
}