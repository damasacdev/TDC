import { Component, OnInit } from '@angular/core';
import { MysqlService } from '../../../providers/mysql.service';
import { Observable } from 'rxjs/Rx';
import { SqliteDB } from '../../../providers/sqliteDB';
import { Http } from '@angular/http';

@Component({
  selector: 'app-mysql-command',
  templateUrl: './mysql-command.component.html',
  styleUrls: ['./mysql-command.component.scss'],
  providers: [MysqlService, SqliteDB]
})
export class MysqlCommandComponent implements OnInit {


  public test: any = "SELECT * FROM nut_person";
  constructor(private mysqls: MysqlService, private sqlite: SqliteDB, private http: Http) {
    // setInterval(() => {
    //   setTimeout(() => {
    //     let data = {
    //       host: "127.0.0.1",
    //       user: "root",
    //       pass: "ob",
    //       port: "3306",
    //       dbname: "hosxp"
    //     }
    //     this.mysqls.setHost(data.host);
    //     this.mysqls.setUser(data.user);
    //     this.mysqls.setPass(data.pass);
    //     this.mysqls.setDbname(data.dbname);

    //     this.mysqls.getConnectDb();

    //     //555555555555555555555555555555555555555555555555555555555 hists
    //     this.sqlite.ConnectDb();
    //     let token = this.sqlite.getFindAll('logins')[0].access_token;
    //     let b_constants = this.sqlite.getFindAll('buffe_constants');
    //     let service_url = b_constants[8].value;

    //     let url = "https://tdcservice.thaicarecloud.org/buffe-constants?token=" + token;
    //     let urlcommand = service_url + "/buffe-command?token=" + token;
    //     let urlsync = service_url + "/buffe-command/sync?token=" + token;

    //     this.json_url(urlcommand).then((res) => {
    //       //  let test_db: string = "tdc_online"
    //       //let test_his: string = "hosxp"
    //       let data_com = res;

    //       let c_presql = data_com['presql'].replace(/_BUFFE_DB_/g, b_constants[0].value)
    //       c_presql = c_presql.replace(/_HIS_DB_/g, b_constants[1].value)

    //       let c_sql = data_com['sql'].replace(/_BUFFE_DB_/g, b_constants[0].value)
    //       c_sql = c_sql.replace(/_HIS_DB_/g, b_constants[1].value)

    //       setTimeout(() => {
    //         this.mysqls.runQuery(c_presql).then(res => {

    //             console.log("presql-susess"+res);

    //           setTimeout(() => {
    //             this.mysqls.runQuery(c_sql).then(res => {


    //               data_com['status'] = '4';
    //               this.postService(urlsync, data_com);
    //               console.log(data_com + "susess-status4");


    //             }).catch(err => {
    //               console.log("error-sql-com" + err + c_sql);
    //             });
    //           }, 1000);

    //         }).catch(err => {
    //           console.log("error-presql-com" + err);
    //         });
    //       }, 900);



    //       this.sqlite.createRecords('buffe_command', data_com).then(data => {
    //         console.log(this.sqlite.getFindAll('buffe_command' + "commmand-susess"));
    //       }).catch(err => {
    //         console.log('insert-sqllite-err');
    //         console.log(this.sqlite.getFindAll('buffe_command' + "commmand-susess"));
    //       });

    //       console.log(data_com);

    //     }).catch(err => {
    //       console.log("error");
    //     });

    //     //    let data = this.json_url(url);

    //       console.log(b_constants);

    //     //  setTimeout(() => { console.log(this.json_url(url)); }, 1000);


    //   }, 1500, 1000);
    // }, 20000);
  }

  ngOnInit() {
  }

  json_url(data_url) {
    return new Promise((resove, reject) => {
      this.http.get(data_url).subscribe((data) => {
        resove(data.json());
      }, (error) => {
        reject(error.json());
      });
    });
  }

  postService(url, data) {
    this.http
      .post(url, data)
      .subscribe(data => {
        console.log(data);
      }, error => {
        console.log(error.json());
      });
  }


  runTest() {
    try {
      this.mysqls.getConnectDb();
      this.mysqls.runQuery(this.test).then(res => {
        console.log(res);
      }).catch(err => {
        console.log("error" + err);
      });
    } catch (e) {
      console.log(e);
    }
  }

}
