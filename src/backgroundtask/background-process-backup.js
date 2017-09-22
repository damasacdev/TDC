// 'use strict';
const { ipcRenderer } = require('electron');
const app = require('electron').remote.app;
const { Observable } = require('rxjs/Rx');
const { Http } = require('@angular/http');
const isOnline = require('is-online');
const $ = require('../assets/jquery/dist/jquery.min.js');
const sqliteFn = require('../lib/sqliteFn.js');
const pg = require('../lib/pgFn.js');
const notifyFn = require('../lib/notifyFn.js');
const logFn = require('../lib/logFn.js');
const sqlite = require('sqlite-cipher');
const path = require('path');
const fs = require('fs');
const osUtils = require('os-utils');
const os = require('os');

var dataConfigSql;
var dataLogin;
var dataConfig;
var dataConstant;
var connection;
var status;
var isOnlineCheck;

var timerQuery;
var controlTimerQuery;

var timerConstant;
var controlTimerConstant;

var timerCommand;
var controlTimerCommand;

var timerConfig;
var controlTimerConfig;

var timerSync;
var controlTimerSync;
var sendData = 0;
var dataSync = 0;
var checkTransfer = false;

var timerPing;
var controlTimerPing;

var timerEvent;
var controlTimerEvent;

var timeEventQ;
var controlTimerEventQ;

let con = '';
let conSqlite;
let db;
var dbConfig = '';
let dbTransfer;
let dbEvent;
var host;
var i = 0;
var command_delay;
var constant_delay;
var config_delay;
var sync_delay;
var ping_delay;
var even_delay;
var commandQuery = 1;
var loopCommandQuery3 = 0;

var syncQuery = 0;

var checkJob = { command: 0, consatane: 0, ping: 0, sync: 0, even: 0 }

var cpuApp = '';
var ramApp = '';
var cpuTotal = '';
var ramTotal = '';

var ramUsege = '';
var ramTotalMb = '';
var ramFree = '';

var filename = "tdc-log.txt";

var cursor_i;
var sql_call;
var sql_del;
var eventQuery = 0;
var checkQ = false;
var checkSyncQ = false;
var el = '';

const saveLog = true;
const showConsole = false;
const showConsoleErr = false;
const ipcRendererCheck = true;
const saveJson = true;
var showNotify = false;

window.onload = function() {
    try {
        if (saveJson == true) {
            logFn.readFile('sendData.json').then(res => {
                let jsonData = JSON.parse(res);
                if (parseInt(jsonData['sendData']) > 0) {
                    sendData = parseInt(jsonData['sendData']);
                }
            }).catch(err => {
                if (showConsoleErr == true) {
                    console.log(err);
                }
            });
        }
        if (saveLog == true) {
            logFn.deleteLog(filename);
        }

        let timer = Observable.timer(0, 800);
        timer.subscribe(() => {
            ramTotalMb = os.totalmem() / 1024 / 1024;
            ramFree = os.freemem() / 1024 / 1024;
            ramUsege = ramTotalMb - ramFree;
            ramTotal = (ramUsege * 100 / ramTotalMb);
            cpuApp = process.getCPUUsage();
            ramApp = ((process.getProcessMemoryInfo().workingSetSize / 1024) * 100) / ramTotalMb;
            getCpu().then(res => {
                cpuTotal = res;
            }).catch(err => {
                if (showConsoleErr == true) {
                    console.log("Error " + err);
                }
            });
            if (ipcRendererCheck == true) {
                ipcRenderer.send('getProcess', { cpuApp: cpuApp, ramApp: ramApp, ramTotal: ramTotal, cpuTotal: cpuTotal, valueRamTotal: ramTotalMb });
                // ipcRenderer.send('isOnline');
            }
        });
        ipcRenderer.on('countShow', (event, arg) => {
            getCountTranfer();
            syncQ();
            ipcRenderer.send('background-send-sendData', sendData);
        });
        ipcRenderer.on('app-close', (event, arg) => {
            logApp(arg);
        });
        ipcRenderer.on('notify-check', (event, arg) => {
            showNotify = arg;
        });
        ipcRenderer.on('app-open', (event, arg) => {
            logApp(arg);
        });
        ipcRenderer.on('call-backgroud-process', (event, arg) => {
            try {
                dataConfigSql = arg['dataConfigSql'];
                dataLogin = arg['dataLogin'];
                dataConfig = arg['dataConfig'];
                dataConstant = arg['dataConstant'];
                status = arg['status'];
                connection = arg['connection'];
                if (con == '' || host != dataConfigSql['hosts']) {
                    host = dataConfigSql['hosts'];
                    if (dataConfigSql['dbtypes'] == '0') { //mysql

                        db = require('../lib/mysqlFn.js');

                    } else if (dataConfigSql['dbtypes'] == '1') { //mssql

                        db = require('../lib/mssqlFn.js');

                    } else if (dataConfigSql['dbtypes'] == '2') { //

                    } else if (dataConfigSql['dbtypes'] == '3') {

                        db = require('../lib/pgFn.js');

                    } else if (dataConfigSql['dbtypes'] == '4') {

                    }
                }

                if (connection == '0' && dbConfig == '') {

                    db.Config(dataConfigSql['hosts'], dataConfigSql['users'], dataConfigSql['passs'], '', dataConfigSql['ports']);

                    db.querySql("SET @@global.sql_mode= 'NO_AUTO_CREATE_USER,NO_ENGINE_SUBSTITUTION';").then(setMode1 => {}).catch(err => {
                        if (showConsole == true) {
                            console.log(err);
                        }
                    });
                    db.querySql("set GLOBAL sql_mode= 'NO_AUTO_CREATE_USER,NO_ENGINE_SUBSTITUTION';").then(setMode2 => {}).catch(err => {
                        if (showConsole == true) {
                            console.log(err);
                        }
                    });
                    db.querySql("set sql_mode= 'NO_AUTO_CREATE_USER,NO_ENGINE_SUBSTITUTION';").then(setMode3 => {}).catch(err => {
                        if (showConsole == true) {
                            console.log(err);
                        }
                    });
                    db.querySql("SET GLOBAL wait_timeout=30000").then(setMode1 => {}).catch(err => {
                        if (showConsole == true) {
                            console.log(err);
                        }
                    });
                    db.querySql("SET GLOBAL connect_timeout=30000").then(setMode2 => {}).catch(err => {
                        if (showConsole == true) {
                            console.log(err);
                        }
                    });
                    db.querySql("SET GLOBAL interactive_timeout=30000").then(setMode3 => {}).catch(err => {
                        if (showConsole == true) {
                            console.log(err);
                        }
                    });
                    db.querySql("set global max_connections = 5000;").then(setMode1 => {}).catch(err => {
                        if (showConsole == true) {
                            console.log(err);
                        }
                    });
                }

                command_delay = dataConfig[5].value;
                constant_delay = dataConfig[6].value;
                config_delay = dataConfig[4].value;
                sync_delay = dataConfig[8].value;
                ping_delay = dataConfig[7].value;
                even_delay = dataConfig[26].value;

            } catch (ex) {
                if (showConsoleErr == true) {
                    console.log(ex);
                }
            }

            if (status == '1') {
                // timerConstant = Observable.timer(1000, constant_delay * 1000);
                // controlTimerConstant = timerConstant.subscribe(() => {

                //     if (checkJob['consatane'] == 0) {

                //         var ulrConstansService = dataConstant[8].value + "/buffe-constants";

                //         service(ulrConstansService, { token: dataLogin['access_token'] }).then(constantService => {
                //             // $.each(constantService, (key, value) => {
                //             //     if (value["id"] == "_SECRETKEY_") {
                //             //         Properties.Settings.Default.valConst[num]["value"] = sha256_hash(txtsecretKey.Text);
                //             //     } else if (value["id"] == "_BUFFE_DB_") {
                //             //         Properties.Settings.Default.contDB = val["value"].ToString();
                //             //     } else if (value["id"] == "_HIS_DB_") {
                //             //         Properties.Settings.Default.valConst[num]["value"] = Properties.Settings.Default.hisDBname;
                //             //     }
                //             // });
                //         }).catch(err => {
                //             if (showConsoleErr == true) {
                //                 console.log(err);
                //             }
                //         });

                //     } else if (checkJob['consatane'] == 1) {
                //         checkJob['consatane'] == 2;
                //     }

                // });
                var queryCheck = true;
                timerQuery = Observable.timer(1000, 5000);
                controlTimerQuery = timerQuery.subscribe(async() => {
                    try {
                        if (queryCheck == true) {
                            queryCheck = false;
                            let urlQuery = dataConstant[8].value + "/buffe-command/get-query";
                            service(urlQuery, { token: dataLogin['access_token'] }, 'GET').then(async(dataQueryService) => {
                                if (dataQueryService != false) {
                                    let sqlQuery = dataQueryService['sql'];
                                    let id = dataQueryService['id'];
                                    $.each(dataConstant, (k, v) => {
                                        if (v.name != "_HIS_DB_") {
                                            sqlQuery = sqlQuery.replace(new RegExp(v.name, 'g'), v.value);
                                        }
                                    });
                                    sqlQuery = sqlQuery.replace(/_HIS_DB_/g, dataConfigSql['dbnames']);
                                    let dataQuery = await db.querySql(sqlQuery);
                                    dataQuery = JSON.stringify(dataQuery, null, "\t");
                                    let urlQuery = dataConstant[8].value + "/buffe-command/enable-query?token=" + dataLogin['access_token'];
                                    let statusQuery = await service(urlQuery, { id: id, result: dataQuery, }, 'POST');
                                    if (statusQuery == 'OK') {
                                        if (showConsole == true) { console.log('Enable query success'); }
                                        queryCheck = true;
                                    } else {
                                        if (showConsoleErr == true) { console.log('Server error : Enable query error'); }
                                        queryCheck = true;
                                    }
                                } else { queryCheck = true; }
                            }).catch(err => {
                                if (showConsoleErr == true) { console.log(err); }
                                let urlQuery = dataConstant[8].value + "/buffe-command/get-query";
                                service(urlQuery, { token: dataLogin['access_token'] }, 'GET').then(async(dataQueryService) => {
                                    if (dataQueryService != false) {
                                        let id = dataQueryService['id'];
                                        err = JSON.stringify(err, null, "\t");
                                        let urlQuery = dataConstant[8].value + "/buffe-command/enable-query?token=" + dataLogin['access_token'];
                                        let statusQuery = await service(urlQuery, { id: id, result: err, }, 'POST');
                                        if (statusQuery == 'OK') {
                                            if (showConsole == true) {
                                                console.log('Enable query success');
                                            }
                                            queryCheck = true;
                                        } else {
                                            if (showConsoleErr == true) {
                                                console.log('Server error : Enable query error');
                                            }
                                            queryCheck = true;
                                        }
                                    } else { queryCheck = true; }
                                }).catch(err => {
                                    if (showConsoleErr == true) { console.log(err); }
                                    queryCheck = true;
                                });
                            });
                        }
                    } catch (err) {
                        if (showConsoleErr == true) { console.log(err); }
                    }
                });

                timeEventQ = Observable.timer((60 * 60) * 1000, (60 * 60) * 1000);
                controlTimerEventQ = timeEventQ.subscribe(() => {
                    syncQ();
                });
                timerCommand = Observable.timer(1000, command_delay * 1000);
                controlTimerCommand = timerCommand.subscribe(() => {
                    commandFn();
                });
                timerConfig = Observable.timer(1000, config_delay * 1000);
                controlTimerConfig = timerConfig.subscribe(() => {
                    try {
                        if (connection == '1') {
                            var urlConfig = dataConstant[8].value + "/buffe-config";
                            service(urlConfig, { token: dataLogin['access_token'] }, 'GET').then(configDataServe => {
                                if (configDataServe['template_delay'] > ping_delay || configDataServe['command_delay'] > command_delay ||
                                    configDataServe['constants_delay'] > constant_delay || configDataServe['sync_delay'] > sync_delay) {
                                    setTimeout(() => {
                                        let data = '';
                                        configDataServe.forEach(el => {
                                            data += "('" + el.name + "','" + el.value + "'),";
                                        });
                                        data += "('even_delay','" + even_delay + "'),";
                                        data = data.substr(0, data.length - 1);
                                        sqliteFn.replaceRecords(data, 'buffe_config').then(res => {
                                            if (showConsole == true) {
                                                console.log('Save data config success.');
                                            }
                                        }).catch(error => {
                                            if (showConsoleErr == true) {
                                                console.log(error);
                                            }
                                        });
                                        dataLogin = sqliteFn.getFindAll("SELECT * FROM config_sql WHERE access_token = '" + dataLogin['access_token'] + "' AND sitecode='" + dataLogin['sitecode'] + "' ");

                                    }, 1000);
                                    setTimeout(() => {
                                        if (checkJob['command'] == 2 && checkJob['constant'] == 2 && checkJob['ping'] == 2 &&
                                            checkJob['sync'] == 2) {
                                            var params = {
                                                dataConfigSql: dataConfigSql,
                                                dataLogin: dataLogin,
                                                dataConfig: dataConfig,
                                                dataConstant: dataConstant,
                                                status: '1',
                                                connection: connection
                                            };
                                            controlTimerConstant.unsubscribe();
                                            controlTimerCommand.unsubscribe();
                                            controlTimerConfig.unsubscribe();
                                            controlTimerSync.unsubscribe();
                                            controlTimerPing.unsubscribe();
                                            checkJob['command'] = 0;
                                            checkJob['constant'] = 0;
                                            checkJob['sync'] = 0;
                                            checkJob['ping'] = 0;
                                            checkJob['even'] = 0;
                                            ipcRenderer.send('call-backgroud-process', params);
                                        }

                                    }, 1500);
                                    if (checkJob['command'] == 0) { checkJob['command'] = 1; }
                                    if (checkJob['constant'] == 0) { checkJob['constant'] = 1; }
                                    if (checkJob['sync'] == 0) { checkJob['sync'] = 1; }
                                    if (checkJob['ping'] == 0) { checkJob['ping'] = 1; }
                                    if (checkJob['even'] == 0) { checkJob['even'] = 1; }
                                }
                            }).catch(err => {
                                if (showConsoleErr == true) {
                                    console.log(err);
                                }
                            });

                        }
                    } catch (err) {
                        if (showConsoleErr == true) {
                            console.log(err);
                        }
                    }
                });
                timerSync = Observable.timer(1000, sync_delay * 1000);
                controlTimerSync = timerSync.subscribe(() => {
                    syncFn();
                }); //End Sync Timer
                // //Start Ping Timer
                timerPing = Observable.timer(1000, ping_delay * 1000);
                controlTimerPing = timerPing.subscribe(() => {
                    if (checkJob['ping'] == 0) {
                        try {
                            var urlPing = dataConstant[8].value + "/buffe-config/ping";
                            service(urlPing, { token: dataLogin['access_token'], cpu: cpuApp.percentCPUUsage, ram: ramApp, ram_usage: (ramApp / 100) * ramTotalMb, cpu_serv: cpuTotal, ram_serv: ramTotal, ram_serv_usage: ramFree.toFixed(0) }, 'GET').then(data => {
                                // console.log(data);
                            }).catch(err => {
                                if (showConsoleErr == true) {
                                    console.log("Timer5 no response " + err);
                                }
                                if (saveLog == true) {
                                    logFn.writerLog(filename, getDateTime() + "Timer5 no response " + err + ' \r\n');
                                }
                            });
                        } catch (ex) {
                            if (showConsole == true) {
                                console.log(ex);
                            }
                        }

                    } else if (checkJob['ping'] == 1) {
                        checkJob['ping'] == 2;
                    }
                    // ipcRenderer.send('background-send-command', ' data');

                }); //End Ping Timer
                // // EVENT
                timerEvent = Observable.timer(1000, even_delay * 1000);
                controlTimerEvent = timerEvent.subscribe(() => {
                    if (checkJob['even'] == 0) {
                        if (eventQuery == 0) {
                            eventQuery = 1;
                            if (dataConfigSql['dbtypes'] == '0') { //mysql

                                var sqlQ = "CALL event_fetch(" + parseInt(dataConfig[9].value) + ")";

                            } else if (dataConfigSql['dbtypes'] == '1') { //mssql

                                var sqlQ = "{CALL event_fetch(" + parseInt(dataConfig[9].value) + ")}";

                            } else if (dataConfigSql['dbtypes'] == '2') { //

                            } else if (dataConfigSql['dbtypes'] == '3') {


                            } else if (dataConfigSql['dbtypes'] == '4') {

                            }
                            db.querySql(sqlQ).then(datQ => {
                                eventQuery = 0;
                                let countSql;
                                if (dataConfigSql['dbtypes'] == '0') { //mysql

                                    countSql = "SELECT * FROM `" + dataConstant[0].value + "`.`buffe_transfer` LIMIT 1";

                                } else if (dataConfigSql['dbtypes'] == '1') { //mssql

                                    countSql = "SELECT TOP 1 * FROM [" + dataConfigSql['schemas'] + "].[buffe_transfer]  ";

                                } else if (dataConfigSql['dbtypes'] == '2') { //

                                } else if (dataConfigSql['dbtypes'] == '3') {

                                    countSql = "SELECT * FROM " + dataConfigSql['schemas'] + ".\"buffe_transfer\" LIMIT 1 ";

                                } else if (dataConfigSql['dbtypes'] == '4') {

                                }
                                db.querySql(countSql).then(countTransfer => {
                                    if (countTransfer.length > 0) {
                                        getCountTranfer();
                                        if (syncQuery == 0 && checkTransfer == false) {
                                            checkTransfer = true;
                                        }
                                    }
                                }).catch(err => {
                                    if (showConsoleErr == true) console.log(err);
                                });
                            }).catch(err => {
                                eventQuery = 0;
                                if (showConsoleErr == true) {
                                    console.log(err);
                                }
                                let countSql;
                                if (dataConfigSql['dbtypes'] == '0') { //mysql

                                    countSql = "SELECT * FROM `" + dataConstant[0].value + "`.`buffe_transfer` LIMIT 1";

                                } else if (dataConfigSql['dbtypes'] == '1') { //mssql

                                    countSql = "SELECT TOP 1 * FROM [" + dataConfigSql['schemas'] + "].[buffe_transfer]  ";

                                } else if (dataConfigSql['dbtypes'] == '2') { //

                                } else if (dataConfigSql['dbtypes'] == '3') {

                                    countSql = "SELECT * FROM " + dataConfigSql['schemas'] + ".\"buffe_transfer\" LIMIT 1 ";

                                } else if (dataConfigSql['dbtypes'] == '4') {

                                }
                                db.querySql(countSql).then(countTransfer => {
                                    if (countTransfer.length > 0) {
                                        getCountTranfer();
                                        if (syncQuery == 0 && checkTransfer == false) {
                                            checkTransfer = true;
                                        }
                                    }
                                }).catch(err => {
                                    if (showConsoleErr == true) console.log(err);
                                });

                                // if (ipcRendererCheck == true) {
                                //     ipcRenderer.send('background-send-job', "CALL event_fetch error" + err);
                                // }
                                if (saveLog == true) {
                                    logFn.writerLog(filename, getDateTime() + "CALL event_fetch error " + err + " \r\n");
                                }
                            });
                        } // IF eventQuery
                    } else if (checkJob['even'] == 1) {
                        checkJob['even'] = 2;
                        eventQuery = 0;
                    }
                }); // ปิด timerEvent
            } else if (status == '0') {
                // controlTimerConstant.unsubscribe();
                try {
                    controlTimerCommand.unsubscribe();
                    controlTimerConfig.unsubscribe();
                    controlTimerSync.unsubscribe();
                    controlTimerPing.unsubscribe();
                    controlTimerEvent.unsubscribe();
                    controlTimerEventQ.unsubscribe();
                    // logApp(0,1);
                } catch (ex) {
                    if (showConsoleErr == true) {
                        console.log(ex);
                    }
                }
            }
            // syncOneRecords();
        });

    } catch (ex) {
        if (showConsoleErr == true) { console.log(ex); }
    }

};
async function commandFn() {
    if (checkJob['command'] == 0) {
        // db.getConfig();
        try {
            if (showConsole == true) {
                console.log(commandQuery + " " + loopCommandQuery3);
            }
            // if (dataConfigSql['dbtypes'] != '2') { //mysql
            //     var sqlUseDB = "USE " + dataConfigSql['tdc_db'];
            // } else {
            //     var sqlUseDB = "ALTER SESSION SET CURRENT_SCHEMA = " + dataConfigSql['tdc_db'];
            // }
            // db.querySql(sqlUseDB).then(dataUseDB => {
            //     if (showConsole == true) {
            //         console.log(dataUseDB);
            //     }
            // }).catch(err => {
            //     // if (showConsoleErr == true) {
            //     console.log(err);
            //     // }
            //     dbConfig = '';
            //     db.Config(dataConfigSql['hosts'], dataConfigSql['users'], dataConfigSql['passs'], '', dataConfigSql['ports']);
            // });
            if (commandQuery == 1) {
                if (showConsole == true) {
                    console.log('command1');
                }
                commandQuery = 1.5;
                //step 1 check status is null (do enable)
                try {
                    if (dataConfigSql['dbtypes'] == '0') { //mysql
                        var sqlStep1 = "SELECT `id` FROM `" + dataConstant[0].value + "`.`buffe_command` WHERE status is null ORDER BY `priority`,`id` ASC";
                    } else if (dataConfigSql['dbtypes'] == '1') { //mssql
                        var sqlStep1 = "SELECT [id] FROM [" + dataConfigSql['schemas'] + "].[buffe_command] WHERE [status] is null ORDER BY [priority],[id] ASC";
                    } else if (dataConfigSql['dbtypes'] == '2') { //

                    } else if (dataConfigSql['dbtypes'] == '3') {
                        var sqlStep1 = "SELECT \"id\" FROM " + dataConfigSql['schemas'] + ".\"buffe_command\" WHERE \"status\" is null ORDER BY \"priority\",\"id\" ASC";
                    } else if (dataConfigSql['dbtypes'] == '4') {

                    }
                    var dataStep1 = await db.querySql(sqlStep1);
                    if (dataStep1 != '') {
                        $.each(dataStep1, async(keyStep1, valueStep1) => {
                            var urlGetCommand = dataConstant[8].value + "/buffe-command/enable";
                            let dataService = await service(urlGetCommand, { token: dataLogin['access_token'], id: valueStep1['id'] }, 'GET');
                            if (showConsole == true) { console.log("Command : step 1 check status is null (do enable)"); }
                            if (ipcRendererCheck == true) { ipcRenderer.send('background-send-job', 'Command : step 1 check status is null (do enable)'); }
                            if (showNotify == true) { notifyFn.alertNotify('Command : step 1 check status is null (do enable)'); }
                            if (saveLog == true) { logFn.writerLog(filename, getDateTime() + 'Command : step 1 check status is null (do enable) \r\n'); }

                            if (dataConfigSql['dbtypes'] == '0') { //mysql

                                var sqlUpdateCommand = "UPDATE `" + dataConstant[0].value + "`.`buffe_command` SET `status`='0', `dupdate`=NOW() WHERE id = " + valueStep1['id'];

                            } else if (dataConfigSql['dbtypes'] == '1') { //mssql

                                var sqlUpdateCommand = "UPDATE [" + dataConfigSql['schemas'] + "].[buffe_command] SET [status]='0', [dupdate]=NOW() WHERE [id] = " + valueStep1['id'];

                            } else if (dataConfigSql['dbtypes'] == '2') { //

                            } else if (dataConfigSql['dbtypes'] == '3') {

                                var sqlUpdateCommand = "UPDATE " + dataConfigSql['schemas'] + ".\"buffe_command\" SET \"status\" ='0', \"dupdate\" =NOW() WHERE \"id\" = " + valueStep1['id'];

                            } else if (dataConfigSql['dbtypes'] == '4') {

                            }
                            await db.querySql(sqlUpdateCommand);
                            commandQuery = 2;
                        });
                    } else {
                        commandQuery = 2;
                    }
                } catch (err) {
                    if (showConsoleErr == true) {
                        console.log("Conect DB Error = " + err);
                    }
                    if (ipcRendererCheck == true) {
                        ipcRenderer.send('background-send-job', "Conect DB Error = " + err);
                    }
                    if (saveLog == true) {
                        logFn.writerLog(filename, getDateTime() + "Conect DB Error = " + err + '\r\n');
                    }
                    commandQuery = 2;
                }
            }
            if (commandQuery == 2) {
                if (showConsole == true) {
                    console.log('command2');
                }
                commandQuery = 2.5;
                //step 2 check status = 0 (do execute)
                try {
                    var iderr = 0;
                    if (dataConfigSql['dbtypes'] == '0') { //mysql
                        var sqlStep2 = "SELECT `id`,`cname`, `presql`, `sql`, `status` FROM `" + dataConstant[0].value + "`.`buffe_command` WHERE status ='0' ORDER BY `priority`,`id` ASC";
                    } else if (dataConfigSql['dbtypes'] == '1') { //mssql
                        var sqlStep2 = "SELECT [id],[cname], [presql], [sql], [status] FROM [" + dataConfigSql['schemas'] + "].[buffe_command] WHERE [status] ='0' ORDER BY [priority],[id] ASC";
                    } else if (dataConfigSql['dbtypes'] == '2') { //

                    } else if (dataConfigSql['dbtypes'] == '3') {
                        var sqlStep2 = "SELECT \"id\",\"cname\", \"presql\", \"sql\", \"status\" FROM " + dataConfigSql['schemas'] + ".\"buffe_command\" WHERE \"status\" ='0' ORDER BY \"priority\",\"id\" ASC";
                    } else if (dataConfigSql['dbtypes'] == '4') {

                    }
                    var dataStep2 = await db.querySql(sqlStep2);
                    if (dataStep2 != '') {
                        $.each(dataStep2, async(keyStep2, valueStep2) => {
                            iderr = parseInt(valueStep2["id"]);
                            //replace constant
                            var c_presql = valueStep2["presql"];
                            var c_sql = valueStep2['sql'];
                            $.each(dataConstant, async(k, v) => {
                                if (v.name != "_HIS_DB_") {
                                    c_presql = c_presql.replace(new RegExp(v.name, 'g'), v.value);
                                    c_sql = c_sql.replace(new RegExp(v.name, 'g'), v.value);
                                }
                            });
                            c_presql = c_presql.replace(/_HIS_DB_/g, dataConfigSql['dbnames']);
                            c_sql = c_sql.replace(/_HIS_DB_/g, dataConfigSql['dbnames']);
                            if (c_presql != '') {
                                try {
                                    await db.querySql(c_presql);
                                } catch (err) {
                                    if (showConsoleErr == true) {
                                        console.log("Execute Presql error " + err);
                                    }
                                    if (ipcRendererCheck == true) {
                                        ipcRenderer.send('background-send-job', 'Execute Presql error ' + err);
                                    }
                                    if (showNotify == true) {
                                        notifyFn.alertNotify('Execute Presql error' + err);
                                    }
                                    if (saveLog == true) {
                                        logFn.writerLog(filename, getDateTime() + 'Execute Presql error' + err + ' \r\n');
                                    }
                                    commandQuery = 3;
                                }
                            }
                            if (c_sql != '') {
                                try {
                                    var dataCsql = await db.querySql(c_sql);
                                    if (showConsole == true) {
                                        console.log("Command : step 2 check status = 0 (do execute)");
                                        console.log("Command (Execute)");
                                    }
                                    if (ipcRendererCheck == true) {
                                        ipcRenderer.send('background-send-job', 'Command : step 2 check status = 0 (do execute)');
                                        ipcRenderer.send('background-send-job', 'Command (Execute) ' + valueStep2['cname']);
                                    }
                                    if (showNotify == true) {
                                        notifyFn.alertNotify('Command (Execute) ' + valueStep2['cname']);
                                    }
                                    if (saveLog == true) {
                                        logFn.writerLog(filename, getDateTime() + 'Command : step 2 check status = 0 (do execute) \r\n');
                                        logFn.writerLog(filename, getDateTime() + 'Command (Execute) ' + valueStep2['cname'] + ' \r\n');
                                    }
                                    // try {
                                    //     var jsonQuery = JSON.stringify(dataCsql[0],null,"\t");
                                    // } catch (ex) {
                                    var jsonQuery = JSON.stringify(dataCsql, null, "\t");
                                    // }
                                    if (jsonQuery != null) {
                                        jsonQuery = jsonQuery.replace(/'/g, "\\\'");
                                    }
                                    if (dataConfigSql['dbtypes'] == '0') { //mysql
                                        var sqlUpdate = "UPDATE `" + dataConstant[0].value + "`.`buffe_command` SET `result`='" + jsonQuery + "', status='1', `dupdate`=NOW() WHERE id = " + valueStep2['id'];
                                    } else if (dataConfigSql['dbtypes'] == '1') { //mssql
                                        var sqlUpdate = "UPDATE [" + dataConfigSql['schemas'] + "].[buffe_command] SET [result] ='" + jsonQuery + "', [status]='1', [dupdate]=NOW() WHERE [id] = " + valueStep2['id'];
                                    } else if (dataConfigSql['dbtypes'] == '2') { //

                                    } else if (dataConfigSql['dbtypes'] == '3') {
                                        var sqlUpdate = "UPDATE " + dataConfigSql['schemas'] + ".\"buffe_command\" SET \"result\"='" + jsonQuery + "', \"status\"='1', \"dupdate\"=NOW() WHERE \"id\" = " + valueStep2['id'];
                                    } else if (dataConfigSql['dbtypes'] == '4') {

                                    }
                                    //put json result to localhost
                                    try {
                                        await db.querySql(sqlUpdate);
                                        if (showConsole == true) {
                                            console.log("Command (put json result to localhost)");
                                        }
                                        if (ipcRendererCheck == true) {
                                            ipcRenderer.send('background-send-job', 'Command (put json result to localhost)');
                                        }
                                        if (showNotify == true) {
                                            notifyFn.alertNotify('Command (put json result to localhost)');
                                        }
                                        if (saveLog == true) {
                                            logFn.writerLog(filename, dateTime(new Date()) + 'Command (put json result to localhost) \r\n');
                                        }
                                        commandQuery = 3;
                                    } catch (err) {
                                        err = JSON.stringify(err, null, "\t");
                                        err = err.replace(/'/g, "\\\'");
                                        if (showConsole == true) {
                                            console.log("Command Execute error (put json result to localhost) " + err);
                                        }
                                        if (ipcRendererCheck == true) {
                                            ipcRenderer.send('background-send-job', 'Command Execute error (put json result to localhost) ' + err);
                                        }
                                        if (showNotify == true) {
                                            notifyFn.alertNotify('Command Execute error (put json result to localhost) ' + err);
                                        }
                                        if (saveLog == true) {
                                            logFn.writerLog(filename, getDateTime() + 'Command Execute error (put json result to localhost) ' + err + ' \r\n');
                                        }
                                        if (dataConfigSql['dbtypes'] == '0') { //mysql

                                            var sqlUpdateErr = "UPDATE `" + dataConstant[0].value + "`.`buffe_command` SET `clienterr`='" + err + "', status='1', `dupdate`=NOW() WHERE id = " + valueStep2['id'];

                                        } else if (dataConfigSql['dbtypes'] == '1') { //mssql

                                            var sqlUpdateErr = "UPDATE [" + dataConfigSql['schemas'] + "].[buffe_command] SET [clienterr] ='" + err + "', [status]='1', [dupdate]=NOW() WHERE [id] = " + valueStep2['id'];

                                        } else if (dataConfigSql['dbtypes'] == '2') { //

                                        } else if (dataConfigSql['dbtypes'] == '3') {

                                            var sqlUpdateErr = "UPDATE " + dataConfigSql['schemas'] + ".\"buffe_command\" SET \"clienterr\"='" + err + "', \"status\"='1', \"dupdate\"=NOW() WHERE \"id\" = " + valueStep2['id'];

                                        } else if (dataConfigSql['dbtypes'] == '4') {

                                        }

                                        try {
                                            await db.querySql(sqlUpdate);
                                            commandQuery = 3;
                                        } catch (err) {
                                            err = JSON.stringify(err);
                                            if (showConsoleErr == true) {
                                                console.log("(Error) UPDATE `buffe_command` SET `clienterr` : " + err);
                                            }
                                            if (ipcRendererCheck == true) {
                                                ipcRenderer.send('background-send-job', '(Error) UPDATE `buffe_command` SET `clienterr` :  ' + err);
                                            }
                                            if (showNotify == true) {
                                                notifyFn.alertNotify('(Error) UPDATE `buffe_command` SET `clienterr` :  ' + err);
                                            }
                                            if (saveLog == true) {
                                                logFn.writerLog(filename, getDateTime() + '(Error) UPDATE `buffe_command` SET `clienterr` :  ' + err + ' \r\n');
                                            }

                                            commandQuery = 3;
                                        }
                                    }
                                } catch (err) {
                                    if (showConsoleErr == true) {
                                        console.log("Execute Error = " + err);
                                    }
                                    commandQuery = 3;
                                }
                            }
                        });
                    } else {
                        commandQuery = 3;
                    }

                } catch (err) {
                    if (showConsoleErr == true) {
                        console.log(err);
                    }
                    err = JSON.stringify(err, null, "\t");
                    err = err.replace(/'/g, "\\\'");
                    if (dataConfigSql['dbtypes'] == '0') { //mysql

                        var sqlUpdateErr = "UPDATE `" + dataConstant[0].value + "`.`buffe_command` SET `clienterr`='" + err + "', `status`='1', `dupdate`=NOW() WHERE `id` = " + iderr;

                    } else if (dataConfigSql['dbtypes'] == '1') { //mssql

                        var sqlUpdateErr = "UPDATE [" + dataConfigSql['schemas'] + "].[buffe_command] SET [clienterr] ='" + err + "', [status]='1', [dupdate]=NOW() WHERE [id] = " + iderr;

                    } else if (dataConfigSql['dbtypes'] == '2') { //

                    } else if (dataConfigSql['dbtypes'] == '3') {

                        var sqlUpdateErr = "UPDATE " + dataConfigSql['schemas'] + ".\"buffe_command\" SET \"clienterr\"='" + err + "', \"status\"='1', \"dupdate\"=NOW() WHERE \"id\" = " + iderr;

                    } else if (dataConfigSql['dbtypes'] == '4') {

                    }
                    try {
                        await db.querySql(sqlUpdateErr);
                        if (showConsole == true) {
                            console.log('Command (put json result to localhost)');
                        }
                        if (ipcRendererCheck == true) {
                            ipcRenderer.send('background-send-job', 'Command (put json result to localhost) ' + err);
                        }
                        if (showNotify == true) {
                            notifyFn.alertNotify('Command (put json result to localhost) ' + err);
                        }
                        if (saveLog == true) {
                            logFn.writerLog(filename, getDateTime() + 'Command (put json result to localhost)' + err + ' \r\n');
                        }
                        commandQuery = 3;
                    } catch (ex) {
                        if (showConsoleErr == true) {
                            console.log(ex);
                        }
                        commandQuery = 3;
                    }
                }
            }

            if (commandQuery == 3 && loopCommandQuery3 == 0) {

                if (showConsole == true) {
                    console.log('command3');
                }
                commandQuery = 3.5;
                //step 3 check status = 1 (do sync)
                if (loopCommandQuery3 == 0) {
                    try {
                        if (dataConfigSql['dbtypes'] == '0') { //mysql

                            var sqlStep3 = "SELECT `id` FROM `" + dataConstant[0].value + "`.`buffe_command` WHERE `status` ='1' ORDER BY `priority`,`id` ASC"

                        } else if (dataConfigSql['dbtypes'] == '1') { //mssql

                            var sqlStep3 = "SELECT [id] FROM [" + dataConfigSql['schemas'] + "].[buffe_command] WHERE [status] ='1' ORDER BY [priority],[id] ASC"

                        } else if (dataConfigSql['dbtypes'] == '2') { //

                        } else if (dataConfigSql['dbtypes'] == '3') {

                            var sqlStep3 = "SELECT \"id\" FROM " + dataConfigSql['schemas'] + ".\"buffe_command\" WHERE \"status\" ='1' ORDER BY \"priority\",\"id\" ASC"

                        } else if (dataConfigSql['dbtypes'] == '4') {

                        }
                        var dataStep3 = await db.querySql(sqlStep3);
                        if (dataStep3 != '') {
                            $.each(dataStep3, async(keyStep3, valueStep3) => {
                                //send json result to server
                                loopCommandQuery3++;
                                if (dataConfigSql['dbtypes'] == '0') { //mysql

                                    var sqlSend = "SELECT * FROM `" + dataConstant[0].value + "`.`buffe_command` WHERE `id`=" + valueStep3['id'];

                                } else if (dataConfigSql['dbtypes'] == '1') { //mssql

                                    var sqlSend = "SELECT * FROM [" + dataConfigSql['schemas'] + "].[buffe_command] WHERE [id]=" + valueStep3['id'];

                                } else if (dataConfigSql['dbtypes'] == '2') { //

                                } else if (dataConfigSql['dbtypes'] == '3') {

                                    var sqlSend = "SELECT * FROM " + dataConfigSql['schemas'] + ".\"buffe_command\" WHERE \"id\" = " + valueStep3['id'];

                                } else if (dataConfigSql['dbtypes'] == '4') {

                                }
                                try {

                                    var dataSend = await db.querySql(sqlSend);

                                    var paramSync = {};

                                    $.each(dataSend, (keyField, valueField) => {
                                        paramSync[keyField] = valueField == '' ? '' : valueField;
                                        // paramSync[keyField] = valueField == '' ? '' : valueField;
                                    });

                                    if (paramSync[0]) {
                                        paramSync = paramSync[0]
                                    } else {
                                        paramSync = paramSync
                                    }
                                    setTimeout(async() => {
                                        try {
                                            var urlSyncCommand = dataConstant[8].value + "/buffe-command/sync?token='" + dataLogin['access_token'] + "'&id='" + valueStep3['id'] + "'";
                                            paramSync['id'] = valueStep3['id'];
                                            console.log(paramSync);
                                            var dataCommandService = await service(urlSyncCommand, paramSync, 'POST');
                                            // console.log(dataCommandService); 
                                            if (dataCommandService['result'] == 'OK') {
                                                if (showConsole == true) {
                                                    console.log("Command : step 3 check status = 1 (do sync)");
                                                    console.log("Command : (send json result to server)");
                                                }
                                                if (ipcRendererCheck == true) {
                                                    ipcRenderer.send('background-send-job', 'Command : step 3 check status = 1 (do sync)');
                                                    ipcRenderer.send('background-send-job', 'Command : (send json result to server)');
                                                }
                                                if (showNotify == true) {
                                                    notifyFn.alertNotify('Command : (send json result to server)');
                                                }
                                                if (saveLog == true) {
                                                    logFn.writerLog(filename, getDateTime() + 'Command : step 3 check status = 1 (do sync) \r\n');
                                                    logFn.writerLog(filename, getDateTime() + 'Command : (send json result to server) \r\n');
                                                }
                                                console.log(dataConfig[19].value);
                                                if (dataConfig[19].value == '1') {
                                                    console.log('DELETE');
                                                    if (dataConfigSql['dbtypes'] == '0') { //mysql

                                                        var sqlDel = "DELETE FROM `" + dataConstant[0].value + "`.`buffe_command` WHERE `id` = " + valueStep3['id'];

                                                    } else if (dataConfigSql['dbtypes'] == '1') { //mssql

                                                        var sqlDel = "DELETE FROM [" + dataConfigSql['schemas'] + "].[buffe_command] WHERE [id] = " + valueStep3['id'];

                                                    } else if (dataConfigSql['dbtypes'] == '2') { //

                                                    } else if (dataConfigSql['dbtypes'] == '3') {

                                                        var sqlDel = "DELETE FROM " + dataConfigSql['schemas'] + ".\"buffe_command\" WHERE \"id\" = " + valueStep3['id'];

                                                    } else if (dataConfigSql['dbtypes'] == '4') {

                                                    }
                                                    try {
                                                        await db.querySql(sqlDel);
                                                        if (loopCommandQuery3 == dataStep3.length) {
                                                            commandQuery = 4;
                                                            loopCommandQuery3 = 0;
                                                        }

                                                    } catch (err) {
                                                        if (showConsoleErr == true) {
                                                            console.log(err);
                                                        }
                                                        if (loopCommandQuery3 == dataStep3.length) {
                                                            commandQuery = 4;
                                                            loopCommandQuery3 = 0;
                                                        }
                                                    }

                                                } else {

                                                    if (dataConfigSql['dbtypes'] == '0') { //mysql

                                                        var sqlUpdate = "UPDATE `" + dataConstant[0].value + "`.`buffe_command` SET `status`='2', `dupdate`=NOW() WHERE `id` = " + valueStep3['id'];

                                                    } else if (dataConfigSql['dbtypes'] == '1') { //mssql

                                                        var sqlUpdate = "UPDATE [" + dataConfigSql['schemas'] + "].[buffe_command] SET [status] ='2', [dupdate] =NOW() WHERE [id] =" + valueStep3['id'];

                                                    } else if (dataConfigSql['dbtypes'] == '2') { //

                                                    } else if (dataConfigSql['dbtypes'] == '3') {

                                                        var sqlUpdate = "UPDATE " + dataConfigSql['schemas'] + ".\"buffe_command\" SET \"status\" ='2', \"dupdate\" =NOW() WHERE \"id\" = " + valueStep3['id'];

                                                    } else if (dataConfigSql['dbtypes'] == '4') {

                                                    }

                                                    db.querySql(sqlUpdatTransfer).then(dataUpdate => {
                                                        if (loopCommandQuery3 == dataStep3.length) {
                                                            commandQuery = 4;
                                                            loopCommandQuery3 = 0;
                                                        }
                                                    }).catch(err => {
                                                        if (showConsoleErr == true) {
                                                            console.log(err);
                                                        }
                                                        if (loopCommandQuery3 == dataStep3.length) {
                                                            commandQuery = 4;
                                                            loopCommandQuery3 = 0;
                                                        }
                                                    });
                                                }

                                            } else {
                                                dataCommandService = JSON.stringify(dataCommandService, null, "\t");
                                                dataCommandService = dataCommandService.replace(/'/g, "\\\'");

                                                if (dataConfigSql['dbtypes'] == '0') { //mysql

                                                    var sqlErr = "UPDATE `" + dataConstant[0].value + "`.`buffe_command` SET `serverr`= '" + dataCommandService + "', `status`='2', `dupdate`=NOW() WHERE `id`=" + valueStep3['id'];

                                                } else if (dataConfigSql['dbtypes'] == '1') { //mssql

                                                    var sqlErr = "UPDATE [" + dataConfigSql['schemas'] + "].[buffe_command] SET [serverr]= '" + dataCommandService + "', [status]='2', [dupdate]=NOW() WHERE [id] =" + valueStep3['id'];

                                                } else if (dataConfigSql['dbtypes'] == '2') { //

                                                } else if (dataConfigSql['dbtypes'] == '3') {

                                                    var sqlErr = "UPDATE " + dataConfigSql['schemas'] + ".\"buffe_command\" SET \"serverr\" = '" + dataCommandService + "', \"status\"='2', \"dupdate\" =NOW() WHERE \"id\" =" + valueStep3['id'];

                                                } else if (dataConfigSql['dbtypes'] == '4') {

                                                }
                                                db.querySql(sqlErr).then(dataErr => {
                                                    if (loopCommandQuery3 == dataStep3.length) {
                                                        commandQuery = 4;
                                                        loopCommandQuery3 = 0;
                                                    }
                                                }).catch(err => {
                                                    if (showConsoleErr == true) {
                                                        console.log(err);
                                                    }
                                                    if (loopCommandQuery3 == dataStep3.length) {
                                                        commandQuery = 4;
                                                        loopCommandQuery3 = 0;
                                                    }
                                                });
                                            }
                                        } catch (err) {
                                            if (showConsoleErr == true) {
                                                console.log(err);
                                            }
                                            err = JSON.stringify(err, null, "\t");
                                            err = err.replace(/'/g, "\\\'");

                                            if (dataConfigSql['dbtypes'] == '0') { //mysql

                                                var sqlErr = "UPDATE `" + dataConstant[0].value + "`.`buffe_command` SET `serverr`= '" + err + "',  `dupdate`=NOW() WHERE `id`= " + valueStep3['id'];

                                            } else if (dataConfigSql['dbtypes'] == '1') { //mssql

                                                var sqlErr = "UPDATE [" + dataConfigSql['schemas'] + "].[buffe_command] SET [serverr]= '" + err + "',  [dupdate]=NOW() WHERE [id] = " + valueStep3['id'];

                                            } else if (dataConfigSql['dbtypes'] == '2') { //

                                            } else if (dataConfigSql['dbtypes'] == '3') {

                                                var sqlErr = "UPDATE " + dataConfigSql['schemas'] + ".\"buffe_command\" SET \"serverr\" = '" + err + "',  \"dupdate\" =NOW() WHERE \"id\" = " + valueStep3['id'];

                                            } else if (dataConfigSql['dbtypes'] == '4') {

                                            }
                                            try {

                                                await db.querySql(sqlErr);
                                                // console.log(dataErr);
                                                if (loopCommandQuery3 == dataStep3.length) {
                                                    commandQuery = 4;
                                                    loopCommandQuery3 = 0;
                                                }

                                            } catch (err) {
                                                if (showConsoleErr == true) {
                                                    console.log("(Error) UPDATE `buffe_command` SET `serverr` : " + err);
                                                }
                                                if (ipcRendererCheck == true) {
                                                    ipcRenderer.send('background-send-job', '(Error) UPDATE `buffe_command` SET `serverr` : ' + err);
                                                }
                                                if (showNotify == true) {
                                                    notifyFn.alertNotify('(Error) UPDATE `buffe_command` SET `serverr` : ' + err);
                                                }
                                                if (saveLog == true) {
                                                    logFn.writerLog(filename, getDateTime() + '(Error) UPDATE `buffe_command` SET `serverr` : ' + err + ' \r\n');
                                                }
                                                if (loopCommandQuery3 == dataStep3.length) {
                                                    commandQuery = 4;
                                                    loopCommandQuery3 = 0;
                                                }
                                            }
                                        }

                                    }, 1000);
                                } catch (err) {
                                    if (showConsoleErr == true) {
                                        console.log("Execute error (send json result to server) " + err);
                                    }
                                    if (ipcRendererCheck == true) {
                                        ipcRenderer.send('background-send-job', 'Execute error (send json result to server) ' + err);
                                    }
                                    if (showNotify == true) {
                                        notifyFn.alertNotify('Execute error (send json result to server) ' + err);
                                    }
                                    if (saveLog == true) {
                                        logFn.writerLog(filename, getDateTime() + 'Execute error (send json result to server)' + err + ' \r\n');
                                    }
                                    if (loopCommandQuery3 == dataStep3.length) {
                                        commandQuery = 4;
                                        loopCommandQuery3 = 0;
                                    }
                                }
                            }); //end foreach

                        } else {
                            commandQuery = 4;
                            loopCommandQuery3 = 0;
                        }
                    } catch (err) {
                        if (showConsoleErr == true) {
                            console.log("Conect DB Error = " + err);
                        }
                        if (ipcRendererCheck == true) {
                            ipcRenderer.send('background-send-job', 'Conect DB Error = ' + err);
                        }
                        if (showNotify == true) {
                            notifyFn.alertNotify('Conect DB Error = ' + err);
                        }
                        if (saveLog == true) {
                            logFn.writerLog(filename, getDateTime() + 'Conect DB Error = ' + err + ' \r\n');
                        }
                        loopCommandQuery3 = 0;
                        commandQuery = 4;
                    }

                } //end if loop

            }
            if (commandQuery == 4) {
                if (showConsole == true) {
                    console.log('command4');
                }
                commandQuery = 4.5;

                // if (dataConfigSql['dbtypes'] != '2') { //mysql
                //     var sqlUseDB = "USE " + dataConfigSql['tdc_db'];
                // } else {
                //     var sqlUseDB = "ALTER SESSION SET CURRENT_SCHEMA = " + dataConfigSql['tdc_db'];
                // }

                // db.querySql(sqlUseDB).then(dataUseDB => {
                //     if (showConsole == true) {
                //         console.log(dataUseDB);
                //     }
                // }).catch(err => {
                //     if (showConsoleErr == true) {
                //         console.log(err + "err");
                //     }
                //     dbConfig = '';
                //     db.Config(dataConfigSql['hosts'], dataConfigSql['users'], dataConfigSql['passs'], '', dataConfigSql['ports']);
                // });
                // step 4 check status < 2 or status is null
                // if record = 0(do get new command and ctype = SQL)
                try {

                    if (dataConfigSql['dbtypes'] == '0') { //mysql

                        var sqlStep4 = "SELECT count(*) as `total` FROM `" + dataConstant[0].value + "`.`buffe_command` WHERE `status` < 2 or `status` is null";

                    } else if (dataConfigSql['dbtypes'] == '1') { //mssql

                        var sqlStep4 = "SELECT count(*) as [total] FROM [" + dataConfigSql['schemas'] + "].[buffe_command] WHERE [status] < 2 or [status] is null";

                    } else if (dataConfigSql['dbtypes'] == '2') { //

                    } else if (dataConfigSql['dbtypes'] == '3') {

                        var sqlStep4 = "SELECT count(*) as \"total\" FROM " + dataConfigSql['schemas'] + ".\"buffe_command\" WHERE \"status\" < 2 or \"status\" is null";

                    } else if (dataConfigSql['dbtypes'] == '4') {

                    }
                    var dataStep4 = await db.querySql(sqlStep4);
                    // console.log(dataStep4[0]['total']);
                    if (dataStep4[0]['total'] == 0) {
                        try {
                            var urlcommand = dataConstant[8].value + "/buffe-command";
                            var commandDataServe = await service(urlcommand, { token: dataLogin['access_token'] }, 'GET');
                            //console.log(commandDataServe);
                            // if (commandDataServe['id']) {
                            var query = '';
                            if (commandDataServe['status'] == null) {
                                if (showConsole == true) {
                                    console.log("Command : step 4 check status < 2 or status is null if record = 0 (do get new command and ctype = SQL)");
                                    console.log("Command : (GET) " + commandDataServe['cname']);
                                }
                                if (saveLog == true) {
                                    logFn.writerLog(filename, getDateTime() + "Command : step 4 check status < 2 or status is null if record = 0 (do get new command and ctype = SQL)");
                                    logFn.writerLog(filename, getDateTime() + 'Command : (GET) ' + commandDataServe['cname'] + ' \r\n');
                                }
                                if (showNotify == true) {
                                    notifyFn.alertNotify('Command : (GET) ' + commandDataServe['cname']);
                                }
                                if (ipcRendererCheck == true) {
                                    ipcRenderer.send('background-send-job', "Command : step 4 check status < 2 or status is null if record = 0 (do get new command and ctype = SQL)");
                                    ipcRenderer.send('background-send-job', 'Command : (GET) ' + commandDataServe['cname']);
                                }
                                var fields = '';
                                var values = '';
                                //store command
                                await $.each(commandDataServe, (key, value) => {

                                    if (dataConfigSql['dbtypes'] == '0') { //mysql

                                        fields += "`" + key + "`, ";
                                    } else if (dataConfigSql['dbtypes'] == '1') { //mssql

                                        fields += "[" + key + "], ";

                                    } else if (dataConfigSql['dbtypes'] == '2') { //

                                    } else if (dataConfigSql['dbtypes'] == '3') {

                                        fields += "\"" + key + "\", ";

                                    } else if (dataConfigSql['dbtypes'] == '4') {

                                    }
                                    if (key == "dupdate" && key == "dadd") {
                                        values += "NOW(), ";
                                    } else if (key == "status") {
                                        values += "\"0\", ";
                                    } else {
                                        values += "\"" + value + "\", ";
                                    }
                                });
                                setTimeout(async() => {
                                    fields = fields.substr(0, fields.length - 2);
                                    values = values.substr(0, values.length - 2);
                                    if (commandDataServe['ctype'] != 'SQL') {

                                        // if (dataConfigSql['dbtypes'] != '2') { //mysql
                                        //     var sqlUseDB = "USE " + dataConfigSql['tdc_db'];
                                        // } else {
                                        //     var sqlUseDB = "ALTER SESSION SET CURRENT_SCHEMA = " + dataConfigSql['tdc_db'];
                                        // }
                                        // await db.querySql(sqlUseDB).then(dataUseDB => {
                                        //     if (showConsole == true) {
                                        //         console.log(dataUseDB);
                                        //     }
                                        // }).catch(err => {
                                        //     if (showConsoleErr == true) {
                                        //         console.log(err + "err");
                                        //     }
                                        //     dbConfig = '';
                                        //     db.Config(dataConfigSql['hosts'], dataConfigSql['users'], dataConfigSql['passs'], '', dataConfigSql['ports']);
                                        // });
                                        if (dataConfigSql['dbtypes'] == '0') { //mysql

                                            query = "REPLACE INTO `" + dataConstant[0].value + "`.`buffe_command` (" + fields + ") VALUES(" + values + ")";
                                        } else if (dataConfigSql['dbtypes'] == '1') { //mssql

                                            query = "REPLACE INTO [" + dataConfigSql['schemas'] + "].[buffe_command] (" + fields + ") VALUES(" + values + ")";

                                        } else if (dataConfigSql['dbtypes'] == '2') { //

                                        } else if (dataConfigSql['dbtypes'] == '3') {

                                            query = "REPLACE INTO " + dataConfigSql['schemas'] + ".\"buffe_command\" (" + fields + ") VALUES(" + values + ")";

                                        } else if (dataConfigSql['dbtypes'] == '4') {

                                        }
                                        await db.querySql(query).then(dataReplace => {
                                            if (showConsole == true) {
                                                console.log("Command : (Store)");
                                            }
                                            if (ipcRendererCheck == true) {
                                                ipcRenderer.send('background-send-job', 'Command : (Store)');
                                            }
                                            if (showNotify == true) {
                                                notifyFn.alertNotify('Command : (Store)');
                                            }
                                            if (saveLog == true) {
                                                logFn.writerLog(filename, getDateTime() + 'Command : (Store) \r\n');
                                            }
                                            commandQuery = 5;
                                        }).catch(err => {
                                            if (showConsoleErr == true) {
                                                console.log("Execute error (store command) " + err);
                                            }
                                            if (ipcRendererCheck == true) {
                                                ipcRenderer.send('background-send-job', 'Execute error (store command) ' + err);
                                            }
                                            if (showNotify == true) {
                                                notifyFn.alertNotify('Execute error (store command) ' + err);
                                            }
                                            if (saveLog == true) {
                                                logFn.writerLog(filename, getDateTime() + 'Execute error (store command) ' + err + ' \r\n');
                                            }
                                            commandQuery = 5;
                                        });
                                    } else {
                                        //run pre SQL
                                        var c_presql = commandDataServe['presql'];
                                        var c_sql = commandDataServe['sql'];


                                        $.each(dataConstant, (k, v) => {
                                            if (v.name != "_HIS_DB_") {
                                                c_presql = c_presql.replace(new RegExp(v.name, 'g'), v.value);
                                                c_sql = c_sql.replace(new RegExp(v.name, 'g'), v.value);
                                            }
                                        });
                                        c_presql = c_presql.replace(/_HIS_DB_/g, dataConfigSql['dbnames']);
                                        c_sql = c_sql.replace(/_HIS_DB_/g, dataConfigSql['dbnames']);
                                        if (showConsole == true) {
                                            console.log(c_presql + " " + c_sql);
                                        }
                                        // if (dataConfigSql['dbtypes'] != '2') { //mysql
                                        //     var sqlUseDB = "USE " + dataConfigSql['tdc_db'];
                                        // } else {
                                        //     var sqlUseDB = "ALTER SESSION SET CURRENT_SCHEMA = " + dataConfigSql['tdc_db'];
                                        // }
                                        // await db.querySql(sqlUseDB).then(dataUseDB => {
                                        //     if (showConsole == true) {
                                        //         console.log(dataUseDB);
                                        //     }
                                        // }).catch(err => {
                                        //     if (showConsoleErr == true) {
                                        //         console.log(err + "err");
                                        //     }
                                        //     dbConfig = '';
                                        //     db.Config(dataConfigSql['hosts'], dataConfigSql['users'], dataConfigSql['passs'], '', dataConfigSql['ports']);
                                        // });
                                        if (c_presql != '') {
                                            try {
                                                await db.querySql(c_presql);
                                            } catch (err) {
                                                if (showConsoleErr == true) {
                                                    console.log("Execute Presql error " + err);
                                                }
                                                if (ipcRendererCheck == true) {
                                                    ipcRenderer.send('background-send-job', 'Execute Presql error ' + err);
                                                }
                                                if (showNotify == true) {
                                                    notifyFn.alertNotify('Execute Presql error' + err);
                                                }
                                                if (saveLog == true) {
                                                    logFn.writerLog(filename, getDateTime() + 'Execute Presql error' + err + ' \r\n');
                                                }
                                                commandQuery = 5;
                                            }
                                        }
                                        // console.log(dataPsql);
                                        if (c_sql != '') {
                                            db.querySql(c_sql).then(async(dataSql) => {
                                                var urlEnable = dataConstant[8].value + "/buffe-command/enable";
                                                await service(urlEnable, { token: dataLogin['access_token'], id: commandDataServe['id'] }, 'GET').then(updateDataServe => {

                                                    if (showConsole == true) {
                                                        console.log("Command (Type SQL) : (Enable)");
                                                    }
                                                    if (ipcRendererCheck == true) {
                                                        ipcRenderer.send('background-send-job', 'Command (Type SQL) : (Enable)');
                                                    }
                                                    if (showNotify == true) {
                                                        notifyFn.alertNotify('Command (Type SQL) : (Enable)');
                                                    }
                                                    if (saveLog == true) {
                                                        logFn.writerLog(filename, getDateTime() + 'Command (Type SQL) : (Enable) \r\n');
                                                    }
                                                    commandQuery = 5;
                                                }).catch(err => {
                                                    if (showConsoleErr == true) {
                                                        console.log(err);
                                                    }
                                                    commandQuery = 5;
                                                });
                                            }).catch(async(err) => {
                                                if (showConsole == true) {
                                                    console.log("Execute sql error (ctype == \"SQL\" no store command) " + err);
                                                    console.log("Execute sync result " + err);
                                                }
                                                if (ipcRendererCheck == true) {
                                                    ipcRenderer.send('background-send-job', 'Execute sql error (ctype == \"SQL\" no store command) ' + err);
                                                    ipcRenderer.send('background-send-job', 'Execute sync result ' + err);
                                                }
                                                if (showNotify == true) {
                                                    notifyFn.alertNotify("Execute sync result " + err);
                                                }
                                                if (saveLog == true) {
                                                    logFn.writerLog(filename, getDateTime() + 'Execute sync result ' + err + ' \r\n');
                                                    logFn.writerLog(filename, getDateTime() + 'Execute sql error (ctype == \"SQL\" no store command) ' + err + ' \r\n');
                                                }
                                                if (dataConfigSql['dbtypes'] == '0') { //mysql

                                                    query = "REPLACE INTO `" + dataConstant[0].value + "`.`buffe_command` (" + fields + ") VALUES(" + values + ")";
                                                } else if (dataConfigSql['dbtypes'] == '1') { //mssql

                                                    query = "REPLACE INTO [" + dataConfigSql['schemas'] + "].[buffe_command] (" + fields + ") VALUES(" + values + ")";

                                                } else if (dataConfigSql['dbtypes'] == '2') { //

                                                } else if (dataConfigSql['dbtypes'] == '3') {

                                                    query = "REPLACE INTO " + dataConfigSql['schemas'] + ".\"buffe_command\" (" + fields + ") VALUES(" + values + ")";

                                                } else if (dataConfigSql['dbtypes'] == '4') {

                                                }
                                                await db.querySql(query).then(dataReplace => {
                                                    // console.log(dataReplace);
                                                }).catch(err => {
                                                    if (showConsoleErr == true) {
                                                        console.log(err);
                                                    }
                                                    if (ipcRendererCheck == true) {
                                                        ipcRenderer.send('background-send-job', err);
                                                    }
                                                    if (showNotify == true) {
                                                        notifyFn.alertNotify(err);
                                                    }
                                                    commandQuery = 5;
                                                });
                                                err = JSON.stringify(err, null, "\t");
                                                err = err.replace(/'/g, "\\\'");
                                                if (dataConfigSql['dbtypes'] == '0') { //mysql

                                                    query = "UPDATE `" + dataConstant[0].value + "`.`buffe_command` SET `clienterr`='" + err + "', `status`='1', `dupdate`=NOW() WHERE `id` = " + commandDataServe['id'];
                                                } else if (dataConfigSql['dbtypes'] == '1') { //mssql

                                                    query = "UPDATE [" + dataConfigSql['schemas'] + "].[buffe_command] SET [clienterr]='" + err + "', [status]='1', [dupdate]=NOW() WHERE [id] = " + commandDataServe['id'];

                                                } else if (dataConfigSql['dbtypes'] == '2') {

                                                } else if (dataConfigSql['dbtypes'] == '3') {

                                                    query = "UPDATE " + dataConfigSql['schemas'] + ".\"buffe_command\" SET \"clienterr\" ='" + err + "', \"status\" ='1', \"dupdate\"=NOW() WHERE \"id\" = " + commandDataServe['id'];

                                                } else if (dataConfigSql['dbtypes'] == '4') {}
                                                await db.querySql(query).then(dataReplace => {
                                                    if (showConsole == true) {
                                                        console.log("Command (put json result to localhost)");
                                                    }

                                                    if (ipcRendererCheck == true) {
                                                        ipcRenderer.send('background-send-job', 'Command (put json result to localhost)');
                                                    }
                                                    if (showNotify == true) {
                                                        notifyFn.alertNotify('Command (put json result to localhost)');
                                                    }
                                                    if (saveLog == true) {
                                                        logFn.writerLog(filename, getDateTime() + 'Command (put json result to localhost) \r\n');
                                                    }
                                                    commandQuery = 5;
                                                }).catch(err => {
                                                    if (showConsoleErr == true) {
                                                        console.log("Execute sql error (ctype == \"SQL\" no store command) " + err);
                                                        console.log("Execute REPLACE or UPDATE clienterr command result (error) = " + err);
                                                    }
                                                    if (ipcRendererCheck == true) {
                                                        ipcRenderer.send('background-send-job', 'Execute sql error (ctype == \"SQL\" no store command) ' + err);
                                                        ipcRenderer.send('background-send-job', 'Execute REPLACE or UPDATE clienterr command result (error) = ' + err);
                                                    }
                                                    if (showNotify == true) {
                                                        notifyFn.alertNotify('Execute REPLACE or UPDATE clienterr command result (error) = ' + err);
                                                    }
                                                    if (saveLog == true) {
                                                        logFn.writerLog(filename, getDateTime() + 'Execute REPLACE or UPDATE clienterr command result (error) = ' + err + ' \r\n');
                                                        logFn.writerLog(filename, getDateTime() + 'Execute sql error (ctype == \"SQL\" no store command) ' + err + ' \r\n');
                                                    }
                                                    commandQuery = 5;
                                                });
                                            });
                                        }
                                    }

                                }, 1000);
                            }
                            // }
                        } catch (err) {
                            if (showConsoleErr == true) {
                                console.log(err);
                            }
                            if (ipcRendererCheck == true) {
                                if (err != "200 SyntaxError: Unexpected end of JSON input") {
                                    ipcRenderer.send('background-send-job', err);
                                }
                            }
                            if (showNotify == true) {
                                if (err != "200 SyntaxError: Unexpected end of JSON input") {
                                    notifyFn.alertNotify(err);
                                }
                            }
                            commandQuery = 5;
                        }
                    } else {
                        commandQuery = 5;
                    }
                } catch (err) {
                    try {
                        // err = JSON.stringify(err);
                        if (showConsoleErr == true) {
                            console.log("Conect DB Error = " + err);
                            console.log("Command : step 4 check status < 2 or status is null if record = 0 (do get new command and ctype = SQL)");
                        }
                        if (showNotify == true) {
                            notifyFn.alertNotify("Conect DB Error = " + err);
                        }
                        //กรณีที่ Exception เพราะไม่มี table ให้เรียก command ใหม่เพื่อ excute
                        if (ipcRendererCheck == true) {
                            ipcRenderer.send('background-send-job', 'Conect DB Error = ' + err);
                            ipcRenderer.send('background-send-job', 'Command : step 4 check status < 2 or status is null if record = 0 (do get new command and ctype = SQL)');
                        }
                        if (saveLog == true) {
                            logFn.writerLog(filename, getDateTime() + 'Conect DB Error = ' + err + ' \r\n');
                            logFn.writerLog(filename, getDateTime() + 'Command : step 4 check status < 2 or status is null if record = 0 (do get new command and ctype = SQL) \r\n');
                        }
                        var urlcommand = dataConstant[8].value + "/buffe-command";
                        var commandDataServe = await service(urlcommand, { token: dataLogin['access_token'] }, 'GET');
                        var query = '';
                        if (commandDataServe['id']) {
                            if (commandDataServe['status'] == null) {
                                if (showConsole == true) {
                                    console.log("Command : (GET)");
                                }
                                if (ipcRendererCheck == true) {
                                    ipcRenderer.send('background-send-job', 'Command : (GET)' + commandDataServe['cname']);
                                }
                                if (showNotify == true) {
                                    notifyFn.alertNotify('Command : (GET)' + commandDataServe['cname']);
                                }
                                if (saveLog == true) {
                                    logFn.writerLog(filename, getDateTime() + 'Command : (GET)' + commandDataServe['cname'] + ' \r\n');
                                }
                                var fields = '';
                                var values = '';
                                //store command
                                $.each(commandDataServe, (key, value) => {

                                    if (dataConfigSql['dbtypes'] == '0') { //mysql

                                        fields += "`" + key + "`, ";
                                    } else if (dataConfigSql['dbtypes'] == '1') { //mssql

                                        fields += "[" + key + "], ";

                                    } else if (dataConfigSql['dbtypes'] == '2') { //

                                    } else if (dataConfigSql['dbtypes'] == '3') {

                                        fields += "\"" + key + "\", ";

                                    } else if (dataConfigSql['dbtypes'] == '4') {}
                                    if (key == "dupdate" && key == "dadd") {
                                        values += "NOW(), ";
                                    } else if (key == "status") {
                                        values += "\"0\", ";
                                    } else {
                                        values += "\"" + value + "\", ";
                                    }
                                });
                                setTimeout(async() => {
                                    fields = fields.substr(0, fields.length - 2);
                                    values = values.substr(0, values.length - 2);
                                    if (commandDataServe['ctype'] != 'SQL') {

                                        if (dataConfigSql['dbtypes'] == '0') { //mysql

                                            query = "REPLACE INTO `" + dataConstant[0].value + "`.`buffe_command` (" + fields + ") VALUES(" + values + ")";
                                        } else if (dataConfigSql['dbtypes'] == '1') { //mssql

                                            query = "REPLACE INTO [" + dataConfigSql['schemas'] + "].[buffe_command] (" + fields + ") VALUES(" + values + ")";

                                        } else if (dataConfigSql['dbtypes'] == '2') { //

                                        } else if (dataConfigSql['dbtypes'] == '3') {

                                            query = "REPLACE INTO " + dataConfigSql['schemas'] + ".\"buffe_command\" (" + fields + ") VALUES(" + values + ")";

                                        } else if (dataConfigSql['dbtypes'] == '4') {


                                        }
                                        db.querySql(query).then(dataReplace => {
                                            if (showConsole == true) {
                                                console.log("Command : (Store)");
                                            }
                                            if (ipcRendererCheck == true) {
                                                ipcRenderer.send('background-send-job', 'Command : (Store)');
                                            }
                                            if (showNotify == true) {
                                                notifyFn.alertNotify('Command : (Store)');
                                            }
                                            if (saveLog == true) {
                                                logFn.writerLog(filename, getDateTime() + 'Command : (Store) \r\n');
                                            }
                                            commandQuery = 5;
                                            // db.Config();
                                        }).catch(err => {
                                            if (showConsoleErr == true) {
                                                console.log("Execute error (store command) " + err);
                                            }
                                            if (ipcRendererCheck == true) {
                                                ipcRenderer.send('background-send-job', 'Execute error (store command) ' + err);
                                            }
                                            if (showNotify == true) {
                                                notifyFn.alertNotify('Execute error (store command) ' + err);
                                            }
                                            if (saveLog == true) {
                                                logFn.writerLog(filename, getDateTime() + 'Execute error (store command) ' + err + ' \r\n');
                                            }
                                            commandQuery = 5;
                                        });
                                    } else {
                                        //run pre SQL
                                        var c_presql = commandDataServe['presql'];
                                        var c_sql = commandDataServe['sql'];
                                        $.each(dataConstant, (k, v) => {
                                            if (v.name != "_HIS_DB_") {
                                                c_presql = c_presql.replace(new RegExp(v.name, 'g'), v.value);
                                                c_sql = c_sql.replace(new RegExp(v.name, 'g'), v.value);
                                            }
                                        });
                                        c_presql = c_presql.replace(/_HIS_DB_/g, dataConfigSql['dbnames']);
                                        c_sql = c_sql.replace(/_HIS_DB_/g, dataConfigSql['dbnames']);
                                        if (c_presql != '') {
                                            try {
                                                await db.querySql(c_presql);
                                            } catch (err) {
                                                if (showConsoleErr == true) {
                                                    console.log("Execute Presql error " + err);
                                                }
                                                if (ipcRendererCheck == true) {
                                                    ipcRenderer.send('background-send-job', 'Execute Presql error ' + err);
                                                }
                                                if (showNotify == true) {
                                                    notifyFn.alertNotify('Execute Presql error' + err);
                                                }
                                                if (saveLog == true) {
                                                    logFn.writerLog(filename, getDateTime() + 'Execute Presql error' + err + ' \r\n');
                                                }
                                                commandQuery = 5;
                                            }
                                        }
                                        // console.log(dataPsql);
                                        if (c_sql != '') {
                                            try {
                                                var dataSql = await db.querySql(c_sql);
                                                var urlEnable = dataConstant[8].value + "/buffe-command/enable";
                                                // console.log(c_sql);
                                                await service(urlEnable, { token: dataLogin['access_token'], id: commandDataServe['id'] }, 'GET');
                                                if (showNotify == true) {
                                                    notifyFn.alertNotify('Command : (Enable)');
                                                }
                                                if (ipcRendererCheck == true) {
                                                    ipcRenderer.send('background-send-job', 'Command : (Enable)');
                                                }
                                                if (saveLog == true) {
                                                    logFn.writerLog(filename, getDateTime() + 'Command : (Enable) \r\n');
                                                }
                                                commandQuery = 5;
                                            } catch (err) {
                                                if (showConsoleErr == true) {
                                                    console.log("Execute sql error (ctype == \"SQL\" no store command) " + err);
                                                    console.log("Execute sync result " + err);
                                                }
                                                if (ipcRendererCheck == true) {
                                                    ipcRenderer.send('background-send-job', 'Execute sync result ' + err);
                                                }
                                                if (showNotify == true) {
                                                    notifyFn.alertNotify('Execute sql error (ctype == \"SQL\" no store command) ' + err);
                                                    notifyFn.alertNotify('Execute sync result ' + err);
                                                }
                                                if (saveLog == true) {
                                                    logFn.writerLog(filename, getDateTime() + 'Execute sync result ' + err + ' \r\n');
                                                    logFn.writerLog(filename, getDateTime() + 'Execute sql error (ctype == \"SQL\" no store command) ' + err + ' \r\n');
                                                }
                                                err = JSON.stringify(err, null, "\t");
                                                err = err.replace(/'/g, "\\\'");
                                                if (dataConfigSql['dbtypes'] == '0') { //mysql

                                                    query = "REPLACE INTO `" + dataConstant[0].value + "`.`buffe_command` (" + fields + ") VALUES(" + values + ")";
                                                } else if (dataConfigSql['dbtypes'] == '1') { //mssql

                                                    query = "REPLACE INTO [" + dataConfigSql['schemas'] + "].[buffe_command] (" + fields + ") VALUES(" + values + ")";

                                                } else if (dataConfigSql['dbtypes'] == '2') { //

                                                } else if (dataConfigSql['dbtypes'] == '3') {

                                                    query = "REPLACE INTO " + dataConfigSql['schemas'] + ".\"buffe_command\" (" + fields + ") VALUES(" + values + ")";

                                                } else if (dataConfigSql['dbtypes'] == '4') {}
                                                await db.querySql(query);
                                                if (dataConfigSql['dbtypes'] == '0') { //mysql

                                                    query = "UPDATE `" + dataConstant[0].value + "`.`buffe_command` SET `clienterr`='" + err + "', `status`='1', `dupdate`=NOW() WHERE `id` = " + commandDataServe['id'];
                                                } else if (dataConfigSql['dbtypes'] == '1') { //mssql

                                                    query = "UPDATE [" + dataConfigSql['schemas'] + "].[buffe_command] SET [clienterr]='" + err + "', [status]='1', [dupdate]=NOW() WHERE [id] = " + commandDataServe['id'];

                                                } else if (dataConfigSql['dbtypes'] == '2') { //

                                                } else if (dataConfigSql['dbtypes'] == '3') {

                                                    query = "UPDATE " + dataConfigSql['schemas'] + ".\"buffe_command\" SET \"clienterr\" ='" + err + "', \"status\" ='1', \"dupdate\"=NOW() WHERE \"id\" = " + commandDataServe['id'];

                                                } else if (dataConfigSql['dbtypes'] == '4') {}
                                                db.querySql(query).then(dataReplace => {
                                                    if (showConsole == true) {
                                                        console.log("Command (put json result to localhost)");
                                                    }
                                                    if (ipcRendererCheck == true) {
                                                        ipcRenderer.send('background-send-job', 'Command (put json result to localhost)');
                                                    }
                                                    if (showNotify == true) {
                                                        notifyFn.alertNotify('Command (put json result to localhost)');
                                                    }
                                                    if (saveLog == true) {
                                                        logFn.writerLog(filename, getDateTime() + 'Command (put json result to localhost) \r\n');
                                                    }
                                                    commandQuery = 5;
                                                }).catch(err => {
                                                    if (showConsole == true) {
                                                        console.log("Execute sql error (ctype == \"SQL\" no store command) " + err);
                                                        console.log("Execute REPLACE or UPDATE clienterr command result (error) = " + err);
                                                    }
                                                    if (ipcRendererCheck == true) {
                                                        ipcRenderer.send('background-send-job', 'Execute sql error (ctype == \"SQL\" no store command) ' + err);
                                                        ipcRenderer.send('background-send-job', 'Execute REPLACE or UPDATE clienterr command result (error) = ' + err);
                                                    }
                                                    if (showNotify == true) {
                                                        notifyFn.alertNotify("Execute sql error (ctype == \"SQL\" no store command) " + err);
                                                        notifyFn.alertNotify("Execute REPLACE or UPDATE clienterr command result (error) = " + err);
                                                    }
                                                    if (saveLog == true) {
                                                        logFn.writerLog(filename, getDateTime() + 'Execute sql error (ctype == \"SQL\" no store command) ' + err + ' \r\n');
                                                        logFn.writerLog(filename, getDateTime() + 'Execute REPLACE or UPDATE clienterr command result (error) = ' + err + ' \r\n');
                                                    }
                                                    commandQuery = 5;
                                                });
                                            }
                                        }
                                    }
                                }, 1000);
                            }
                        } else {
                            commandQuery = 5;
                        }
                    } catch (err) {
                        if (showConsoleErr == true) {
                            console.log(err);
                        }
                        commandQuery = 5;
                    }
                }
            }
            if (commandQuery == 5) {
                if (showConsole == true) {
                    console.log('command4');
                }
                // if (dbConfig == '') {
                //     db.Config(dataConfigSql['hosts'], dataConfigSql['users'], dataConfigSql['passs'], dataConstant[0].value, dataConfigSql['ports']);
                //     dbConfig = 'database';
                //     connection = 1;
                // }
                if (dataConfigSql['dbtypes'] != '2') { //mysql
                    var sqlUseDB = "USE " + dataConfigSql['tdc_db'];
                } else {
                    var sqlUseDB = "ALTER SESSION SET CURRENT_SCHEMA = " + dataConfigSql['tdc_db'];
                }
                db.querySql(sqlUseDB).then(dataUseDB => {
                    if (showConsole == true) {
                        console.log(dataUseDB);
                    }
                }).catch(err => {
                    // if (showConsoleErr == true) {
                    console.log(err);
                    // }
                    dbConfig = '';
                    db.Config(dataConfigSql['hosts'], dataConfigSql['users'], dataConfigSql['passs'], '', dataConfigSql['ports']);
                });
                commandQuery = 1;
                // ipcRenderer.send('background-send-job', '');
            }
        } catch (ex) {
            if (showConsole == true) {
                console.log(ex);
            }
        }

    } else if (checkJob['command'] == 1) {
        checkJob['command'] == 2;
    }
}

async function syncFn() {
    //If checkJob['sync']
    if (checkJob['sync'] == 0) {
        try {
            if (checkTransfer == true) {
                if (syncQuery == 0) {
                    syncQuery = 1;
                    //step 1 check status = 0 (do execute)

                    // con = db.Connection(arg['dataConfigSql']['hosts'], arg['dataConfigSql']['users'], arg['dataConfigSql']['passs'], arg['dataConstant'][0].value);

                    // if (dataConfigSql['dbtypes'] != '2') { //mysql
                    //     var sqlUseDB = "USE " + dataConfigSql['tdc_db'];
                    // } else {
                    //     var sqlUseDB = "ALTER SESSION SET CURRENT_SCHEMA = " + dataConfigSql['tdc_db'];
                    // }

                    // db.querySql(sqlUseDB).then(dataUseDB => {
                    //     if (showConsole == true) {
                    //         console.log(dataUseDB);
                    //     }
                    // }).catch(err => {
                    //     if (showConsoleErr == true) {
                    //         console.log(err + "err");
                    //     }
                    //     dbConfig = '';
                    //     db.Config(dataConfigSql['hosts'], dataConfigSql['users'], dataConfigSql['passs'], '', dataConfigSql['ports']);
                    // });

                    if (dataConfigSql['dbtypes'] == '0') { //mysql

                        var sql = "SELECT `id`, `presql`, `sql`, `status`, `table` FROM `" + dataConstant[0].value + "`.`buffe_transfer` WHERE `status` ='0' or `status` ='9' or `status` is null ORDER BY `id` ASC LIMIT 0," + dataConfig[9].value;

                    } else if (dataConfigSql['dbtypes'] == '1') { //mssql

                        var sql = "SELECT TOP " + parseInt(dataConfig[9].value) + " [id], [presql], [sql], [status], [table] FROM [" + dataConfigSql['schemas'] + "].[buffe_transfer] WHERE [status] ='0' or [status] ='9' or [status] is null ORDER BY [id] ASC ";

                    } else if (dataConfigSql['dbtypes'] == '2') { //

                    } else if (dataConfigSql['dbtypes'] == '3') {

                        var sql = "SELECT \"id\", \"presql\", \"sql\", \"status\", \"table\" FROM " + dataConfigSql['schemas'] + ".\"buffe_transfer\" WHERE \"status\" = '0' or \"status\" = '9' or \"status\" is null ORDER BY \"id\" ASC LIMIT 0," + dataConfig[9].value;

                    } else if (dataConfigSql['dbtypes'] == '4') {

                    }
                    db.querySql(sql).then(async(dataTransfer) => {
                        if (ipcRendererCheck == true) {
                            ipcRenderer.send('background-send-job', getDateTime() + " Transfer Data [" + dataTransfer[0]['table'] + "] " + dataTransfer.length + " records");
                        }
                        if (saveLog == true) {
                            logFn.writerLog(filename, getDateTime() + " Transfer Data [" + dataTransfer[0]['table'] + "] " + dataTransfer.length + " records \r\n");
                        }
                        if (showNotify == true) {
                            notifyFn.alertNotify(getDateTime() + " Transfer Data [" + dataTransfer[0]['table'] + "] " + dataTransfer.length + " records");
                        }
                        if (showConsole == true) {
                            console.log(dataTransfer);
                        }
                        if (dataTransfer.length > 0) {
                            // var countDataTransfer = 0;
                            // $.each(dataTransfer, async(kTransfer, vTransfer) => {
                            // countDataTransfer++;
                            for (var vTransfer of dataTransfer) {
                                var t_presql = vTransfer['presql']; //.replace(/_BUFFE_DB_/g, arg['dataConstant'][0].value);
                                var t_sql = vTransfer['sql'];

                                $.each(dataConstant, (k, v) => {
                                    if (v.name != "_HIS_DB_") {
                                        t_presql = t_presql.replace(new RegExp(v.name, 'g'), v.value);
                                        t_sql = t_sql.replace(new RegExp(v.name, 'g'), v.value);
                                    }
                                });

                                t_presql = t_presql.replace(/_HIS_DB_/g, dataConfigSql['dbnames']);
                                t_sql = t_sql.replace(/_HIS_DB_/g, dataConfigSql['dbnames']);
                                if (t_presql != '') {
                                    try {
                                        await db.querySql(t_presql);
                                        if (showConsole == true) {
                                            console.log(dataPsql);
                                        }
                                    } catch (err) {
                                        if (showConsoleErr == true) {
                                            console.log(err);
                                        }
                                        if (saveLog == true) {
                                            logFn.writerLog(filename, getDateTime() + " " + err + " \r\n");
                                        }
                                        // if (showNotify == true) {
                                        //     notifyFn.alertNotify(err);
                                        // }
                                        if (ipcRendererCheck == true) {

                                            ipcRenderer.send('background-send-job', err);
                                        }
                                    }
                                }
                                if (t_sql != '') {
                                    // db.querySql(t_sql).then(dataSql => {
                                    try {
                                        var dataSql = await db.querySql(t_sql);
                                        if (dataSql.length > 0) {
                                            var query = JSON.stringify(dataSql, null, "\t");
                                            query = query.replace(/'/g, "\\\'");

                                            if (dataConfigSql['dbtypes'] == '0') { //mysql

                                                var sql = "UPDATE `" + dataConstant[0].value + "`.`buffe_transfer` SET `result` = '" + query + "', `status`='1', `dupdate` = NOW(),`qleft` = " + 0 + " WHERE `id` = " + vTransfer['id'];

                                            } else if (dataConfigSql['dbtypes'] == '1') { //mssql

                                                var sql = "UPDATE [" + dataConfigSql['schemas'] + "].[buffe_transfer] SET [result] = '" + query + "', [status] ='1', [dupdate] = NOW(),[qleft] = " + 0 + " WHERE [id] = " + vTransfer['id'];

                                            } else if (dataConfigSql['dbtypes'] == '2') { //

                                            } else if (dataConfigSql['dbtypes'] == '3') {

                                                var sql = "UPDATE " + dataConfigSql['schemas'] + ".\"buffe_transfer\" SET \"result\" = '" + query + "', \"status\" ='1', \"dupdate\" = NOW(),\"qleft\" = " + 0 + " WHERE \"id\" = " + vTransfer['id'];

                                            } else if (dataConfigSql['dbtypes'] == '4') {

                                            }
                                            db.querySql(sql).then(updateSql => {
                                                querySyncCheck = true;
                                                // if (countDataTransfer == dataTransfer.length) {
                                                //     syncQuery = 2;
                                                //     countDataTransfer = 0;
                                                // }
                                            }).catch(err => {
                                                if (showConsoleErr == true) {
                                                    console.log(err);
                                                }
                                                querySyncCheck = true;
                                                if (ipcRendererCheck == true) {
                                                    ipcRenderer.send('background-send-job', "Transfer Execute error (put json result to localhost) " + err);
                                                }
                                                // if (showNotify == true) {
                                                //     notifyFn.alertNotify("Transfer Execute error (put json result to localhost) " + err);
                                                // }
                                                if (saveLog == true) {
                                                    logFn.writerLog(filename, getDateTime() + "Transfer Execute error (put json result to localhost) " + err + ' \r\n');
                                                }
                                                // if (countDataTransfer == dataTransfer.length) {
                                                //     syncQuery = 2;
                                                //     countDataTransfer = 0;
                                                // }
                                            });
                                        }
                                        // }).catch(err => {
                                    } catch (err) {
                                        err = JSON.stringify(err, null, "\t");
                                        err = err.replace(/'/g, "\\\'");

                                        if (dataConfigSql['dbtypes'] == '0') { //mysql

                                            var sql = "UPDATE `" + dataConstant[0].value + "`.`buffe_transfer` SET `clienterr` = '" + err + "', `status`='9', `dupdate` = NOW() WHERE `id` = " + vTransfer['id'];

                                        } else if (dataConfigSql['dbtypes'] == '1') { //mssql

                                            var sql = "UPDATE [" + dataConfigSql['schemas'] + "].[buffe_transfer] SET [clienterr] = '" + err + "', [status] ='9', [dupdate] = NOW() WHERE [id] = " + vTransfer['id'];

                                        } else if (dataConfigSql['dbtypes'] == '2') { //

                                        } else if (dataConfigSql['dbtypes'] == '3') {

                                            var sql = "UPDATE " + dataConfigSql['schemas'] + ".\"buffe_transfer\" SET \"clienterr\" = '" + err + "', \"status\" ='9', \"dupdate\" = NOW() WHERE \"id\" = " + vTransfer['id'];

                                        } else if (dataConfigSql['dbtypes'] == '4') {

                                        }
                                        db.querySql(sql).then(updateSqlErr => {
                                            querySyncCheck = true;
                                            // if (countDataTransfer == dataTransfer.length) {
                                            //     syncQuery = 2;
                                            //     countDataTransfer = 0;
                                            // }
                                        }).catch(err => {
                                            if (showConsoleErr == true) {
                                                console.log(err);
                                            }
                                            querySyncCheck = true;
                                            if (countDataTransfer == dataTransfer.length) {
                                                syncQuery = 2;
                                                // countDataTransfer = 0;
                                            }
                                            if (ipcRendererCheck == true) {
                                                ipcRenderer.send('background-send-job', "(Error) UPDATE buffe_transfer` SET `clienterr` : " + err);
                                            }
                                            if (showNotify == true) {
                                                notifyFn.alertNotify("(Error) UPDATE buffe_transfer` SET `clienterr` : " + err);
                                            }
                                            if (saveLog == true) {
                                                logFn.writerLog(filename, getDateTime() + "(Error) UPDATE buffe_transfer` SET `clienterr` : " + err + ' \r\n');
                                            }
                                        });
                                        // });
                                    }
                                }
                                // });
                            }
                            querySyncCheck = true;
                            // if (countDataTransfer == dataTransfer.length - 1) {
                            syncQuery = 2;
                            //     countDataTransfer = 0;
                            // }

                        } else {
                            syncQuery = 2;
                            querySyncCheck = true;
                        }

                    }).catch(err => {
                        if (showConsoleErr == true) {
                            console.log("Error = " + err);
                        }
                        syncQuery = 2;
                        querySyncCheck = true;
                        if (ipcRendererCheck == true) {
                            ipcRenderer.send('background-send-job', err);
                        }
                        if (showNotify == true) {
                            notifyFn.alertNotify(err);
                        }
                        if (saveLog == true) {
                            logFn.writerLog(filename, getDateTime() + err + ' \r\n');
                        }
                    });
                }

                if (syncQuery == 2) {
                    syncQuery = 2.5;
                    // step 2 check status = 1(do sync)
                    // if (dataConfigSql['dbtypes'] != '2') { //mysql
                    //     var sqlUseDB = "USE " + dataConfigSql['tdc_db'];
                    // } else {
                    //     var sqlUseDB = "ALTER SESSION SET CURRENT_SCHEMA = " + dataConfigSql['tdc_db'];
                    // }

                    // db.querySql(sqlUseDB).then(dataUseDB => {
                    //     if (showConsole == true) {
                    //         console.log(dataUseDB);
                    //     }
                    // }).catch(err => {
                    //     if (showConsoleErr == true) {
                    //         console.log(err + "err");
                    //     }
                    //     dbConfig = '';
                    //     db.Config(dataConfigSql['hosts'], dataConfigSql['users'], dataConfigSql['passs'], '', dataConfigSql['ports']);
                    // });

                    if (dataConfigSql['dbtypes'] == '0') { //mysql

                        var sql = "SELECT * FROM `" + dataConstant[0].value + "`.`buffe_transfer` WHERE `status` = '1' ORDER BY `status`,`id` ASC LIMIT 0," + parseInt(dataConfig[9].value);

                    } else if (dataConfigSql['dbtypes'] == '1') { //mssql

                        var sql = "SELECT TOP " + parseInt(dataConfig[9].value) + " * FROM [" + dataConfigSql['schemas'] + "].[buffe_transfer] WHERE [status] = '1' ORDER BY [status],[id] ASC ";

                    } else if (dataConfigSql['dbtypes'] == '2') { //

                    } else if (dataConfigSql['dbtypes'] == '3') {

                        var sql = "SELECT * FROM " + dataConfigSql['schemas'] + ".\"buffe_transfer\" WHERE \"status\" = '1'  ORDER BY \"status\",\"id\" ASC LIMIT 0," + parseInt(dataConfig[9].value);

                    } else if (dataConfigSql['dbtypes'] == '4') {

                    }
                    db.querySql(sql).then(async(dataBuffeTransfer) => {
                        if (showConsole == true) {
                            console.log(dataBuffeTransfer);
                        }
                        if (dataBuffeTransfer.length > 0) {

                            var idTransfer = "";
                            var readData = "";

                            // forEach(dataBuffeTransfer, (kDataTransfer, vDataTransfer) => {
                            for (var j = 0; j < dataBuffeTransfer.length; j++) {
                                // console.log(vDataTransfer);
                                if (idTransfer == '') {
                                    idTransfer = dataBuffeTransfer[j]['id'];
                                } else {
                                    idTransfer += "," + dataBuffeTransfer[j]['id'];
                                }
                            }
                            // });

                            var json = JSON.stringify(dataBuffeTransfer, null, "\t");

                            var urlTransferService = dataConstant[8].value + "/buffe-transfer/nsync?token=" + dataLogin['access_token'] + "&cpu=" + cpuApp.percentCPUUsage + "&ram=" + ramApp + "&ram_usage=" + (ramApp / 100) * ramTotalMb + "&cpu_serv=" + cpuTotal + "&ram_serv=" + ramTotal + "&ram_serv_usage=" + ramFree.toFixed(0);
                            service(urlTransferService, { jsondata: json }, 'POST').then(dataTransferService => {

                                dataTransferService = JSON.parse(dataTransferService);
                                if (dataTransferService['result'] == 'OK') {
                                    console.log(dataConfig[19].value);
                                    if (dataConfig[19].value == '1') {
                                        console.log('DELETE');
                                        var sqlUpdatTransfer = "DELETE FROM " + dataConstant[0].value + ".buffe_transfer WHERE id IN (" + idTransfer + ")";
                                        db.querySql(sqlUpdatTransfer).then(dataUpdate => {
                                            if (showConsole == true) {
                                                console.log("Transfer data : " + dataBuffeTransfer.length + " records success!");
                                            }
                                            if (ipcRendererCheck == true) {
                                                ipcRenderer.send('background-send-job', getDateTime() + " Transfer data [" + dataBuffeTransfer[0]['table'] + "] " + dataBuffeTransfer.length + " records success!");
                                                // ipcRenderer.send('background-send-sendData', sendData);
                                            }
                                            if (showNotify == true) {
                                                notifyFn.alertNotify(getDateTime() + " Transfer data [" + dataBuffeTransfer[0]['table'] + "] " + dataBuffeTransfer.length + " records success!");
                                            }
                                            if (saveLog == true) {
                                                logFn.writerLog(filename, getDateTime() + " Transfer data [" + dataBuffeTransfer[0]['table'] + "] " + dataBuffeTransfer.length + ' records success! \r\n');
                                            }

                                            sendData += dataBuffeTransfer.length;
                                            syncQuery = 0;
                                            checkTransfer = false;
                                            getCountTranfer();
                                            // if (ipcRendererCheck == true) {
                                            //     ipcRenderer.send('background-send-sendData', sendData);
                                            // }
                                            if (saveJson == true) {
                                                let dataJson = '{ "sendData": ' + sendData + '}';
                                                logFn.writerData('sendData.json', dataJson);
                                            }

                                        }).catch(err => {
                                            if (showConsoleErr == true) {
                                                console.log(err);
                                            }
                                            syncQuery = 0;
                                            checkTransfer = false;
                                            if (ipcRendererCheck == true) {
                                                ipcRenderer.send('background-send-job', err);
                                            }
                                            if (showNotify == true) {
                                                notifyFn.alertNotify(err);
                                            }
                                            if (saveLog == true) {
                                                logFn.writerLog(filename, getDateTime() + err + ' \r\n');
                                            }
                                        });
                                    } else {
                                        // console.log(idTransfer);

                                        if (dataConfigSql['dbtypes'] == '0') { //mysql

                                            var sqlUpdatTransfer = "UPDATE `" + dataConstant[0].value + "`.`buffe_transfer` SET `status` ='2', `dupdate` =NOW() WHERE `id` IN (" + idTransfer + ")";

                                        } else if (dataConfigSql['dbtypes'] == '1') { //mssql

                                            var sqlUpdatTransfer = "UPDATE [" + dataConfigSql['schemas'] + "].[buffe_transfer] SET [status] ='2', [dupdate] =NOW() WHERE [id] IN (" + idTransfer + ")";

                                        } else if (dataConfigSql['dbtypes'] == '2') { //

                                        } else if (dataConfigSql['dbtypes'] == '3') {

                                            var sqlUpdatTransfer = "UPDATE " + dataConfigSql['schemas'] + ".\"buffe_transfer\" SET \"status\" ='2', \"dupdate\" =NOW() WHERE \"id\" IN (" + idTransfer + ")";

                                        } else if (dataConfigSql['dbtypes'] == '4') {

                                        }

                                        db.querySql(sqlUpdatTransfer).then(dataUpdate => {
                                            if (showConsole == true) {
                                                console.log("Transfer data : " + dataBuffeTransfer.length + " records success!");
                                            }
                                            if (ipcRendererCheck == true) {
                                                ipcRenderer.send('background-send-job', getDateTime() + " Transfer data [" + dataBuffeTransfer[0]['table'] + "] " + dataBuffeTransfer.length + " records success!");
                                                // ipcRenderer.send('background-send-sendData', sendData);
                                            }
                                            if (showNotify == true) {
                                                notifyFn.alertNotify(getDateTime() + " Transfer data [" + dataBuffeTransfer[0]['table'] + "] " + dataBuffeTransfer.length + " records success!");
                                            }
                                            if (saveLog == true) {
                                                logFn.writerLog(filename, getDateTime() + " Transfer data [" + dataBuffeTransfer[0]['table'] + "] " + dataBuffeTransfer.length + ' records success! \r\n');
                                            }
                                            sendData += dataBuffeTransfer.length;
                                            syncQuery = 0;
                                            checkTransfer = false;
                                            getCountTranfer();
                                            // if (ipcRendererCheck == true) {
                                            //     ipcRenderer.send('background-send-sendData', sendData);
                                            // }
                                            if (saveJson == true) {
                                                let dataJson = '{ "sendData": ' + sendData + '}';
                                                logFn.writerData('sendData.json', dataJson);
                                            }

                                        }).catch(err => {
                                            if (showConsoleErr == true) {
                                                console.log(err);
                                            }
                                            syncQuery = 0;
                                            checkTransfer = false;
                                            if (ipcRendererCheck == true) {
                                                ipcRenderer.send('background-send-job', err);
                                            }
                                            if (showNotify == true) {
                                                notifyFn.alertNotify(err);
                                            }
                                            if (saveLog == true) {
                                                logFn.writerLog(filename, getDateTime() + err + ' \r\n');
                                            }
                                        });
                                    }

                                } else {
                                    dataTransferService = JSON.stringify(dataTransferService, null, "\t");
                                    dataTransferService = dataTransferService.replace(/'/g, "\\\'");
                                    if (dataConfigSql['dbtypes'] == '0') { //mysql

                                        var sqlErr = "UPDATE `" + dataConstant[0].value + "`.`buffe_transfer` SET `serverr`= '" + dataTransferService + "', `status`='9', `dupdate`=NOW() WHERE `id` IN (" + idTransfer + ")";

                                    } else if (dataConfigSql['dbtypes'] == '1') { //mssql

                                        var sqlErr = "UPDATE [" + dataConfigSql['schemas'] + "].[buffe_transfer] SET [serverr]= '" + dataTransferService + "', [status]='9', [dupdate]=NOW() WHERE [id] IN (" + idTransfer + ")";

                                    } else if (dataConfigSql['dbtypes'] == '2') { //

                                    } else if (dataConfigSql['dbtypes'] == '3') {

                                        var sqlErr = "UPDATE " + dataConfigSql['schemas'] + ".\"buffe_transfer\" SET \"serverr\" = '" + dataTransferService + "', \"status\"='9', \"dupdate\" =NOW() WHERE \"id\" IN (" + idTransfer + ")";

                                    } else if (dataConfigSql['dbtypes'] == '4') {

                                    }

                                    db.querySql(sqlErr).then(dataErr => {
                                        if (showConsole == true) {
                                            console.log(dataErr);
                                        }
                                        syncQuery = 0;
                                        checkTransfer = false;
                                    }).catch(err => {
                                        syncQuery = 0;
                                        checkTransfer = false;
                                        if (showConsoleErr == true) {
                                            console.log(err);
                                        }
                                        if (ipcRendererCheck == true) {
                                            ipcRenderer.send('background-send-job', err);
                                        }
                                        if (showNotify == true) {
                                            notifyFn.alertNotify(err);
                                        }
                                        if (saveLog == true) {
                                            logFn.writerLog(filename, getDateTime() + err + ' \r\n');
                                        }
                                    });

                                    syncOneRecords();

                                }

                            }).catch(err => {
                                err = JSON.stringify(err, null, "\t");
                                err = err.replace(/'/g, "\\\'");
                                if (dataConfigSql['dbtypes'] == '0') { //mysql

                                    var sqlErr = "UPDATE `" + dataConstant[0].value + "`.`buffe_transfer` SET `serverr`= " + err + ", `status`='9', `dupdate`=NOW() WHERE `id` IN (" + idTransfer + ")";

                                } else if (dataConfigSql['dbtypes'] == '1') { //mssql

                                    var sqlErr = "UPDATE [" + dataConfigSql['schemas'] + "].[buffe_transfer] SET [serverr]= " + err + ", [status]='9', [dupdate]=NOW() WHERE [id] IN (" + idTransfer + ")";

                                } else if (dataConfigSql['dbtypes'] == '2') { //

                                } else if (dataConfigSql['dbtypes'] == '3') {

                                    var sqlErr = "UPDATE " + dataConfigSql['schemas'] + ".\"buffe_transfer\" SET \"serverr\" = " + err + ", \"status\"='9', \"dupdate\" =NOW() WHERE \"id\" IN (" + idTransfer + ")";

                                } else if (dataConfigSql['dbtypes'] == '4') {

                                }
                                if (showConsole == true) {
                                    console.log("Transfer nsync : Error sync result " + err);
                                }
                                if (saveLog == true) {
                                    logFn.writerLog(filename, getDateTime() + "Transfer nsync : Error sync result " + err + ' \r\n');
                                }
                                if (showNotify == true) {
                                    notifyFn.alertNotify("Transfer nsync : Error sync result " + err);
                                }

                                db.querySql(sqlErr).then(dataErr => {
                                    // console.log(dataErr);
                                    syncQuery = 0;
                                    checkTransfer = false;
                                }).catch(err => {
                                    if (showConsoleErr == true) {
                                        console.log("(Error) UPDATE `buffe_transfer` SET `serverr` : " + err);
                                    }
                                    if (showNotify == true) {
                                        notifyFn.alertNotify("(Error) UPDATE `buffe_transfer` SET `serverr` : " + err);
                                    }
                                    if (ipcRendererCheck == true) {
                                        ipcRenderer.send('background-send-job', "(Error) UPDATE `buffe_transfer` SET `serverr` : " + err);
                                    }
                                    if (saveLog == true) {
                                        logFn.writerLog(filename, getDateTime() + "(Error) UPDATE `buffe_transfer` SET `serverr` : " + err + ' \r\n');
                                    }
                                    syncQuery = 0;
                                    checkTransfer = false;
                                });

                                syncOneRecords();


                            });

                        } else {
                            syncQuery = 0;
                            checkTransfer = false;
                        }
                    }).catch(err => {
                        if (showConsoleErr == true) {
                            console.log(err);
                        }
                        if (ipcRendererCheck == true) {
                            ipcRenderer.send('background-send-job', err);
                        }
                        if (showNotify == true) {
                            notifyFn.alertNotify(err);
                        }
                        if (saveLog == true) {
                            logFn.writerLog(filename, getDateTime() + " " + err + " \r\n");
                        }
                        syncQuery = 0;
                        checkTransfer = false;
                    });

                    // ipcRenderer.send('background-send-job', '');
                }
            } else {
                checkTransfer = false;
            }
        } catch (ex) {
            checkTransfer = false;
            if (showConsole == true) {
                console.log(ex);
            }
            if (saveLog == true) {
                logFn.writerLog(filename, getDateTime() + " " + err + " \r\n");
            }
            if (ipcRendererCheck == true) {
                ipcRenderer.send('background-send-job', err);
            }
            if (showNotify == true) {
                notifyFn.alertNotify(err);
            }
        }

    } else if (checkJob['sync'] == 1) {
        checkJob['sync'] == 2;
    } //Else If checkJob['sync']
}

function syncOneRecords() {
    // var dateTime = new Date();
    try {
        if (dataConfigSql['dbtypes'] == '0') { //mysql

            var sql = "SELECT `id`, `table` FROM `" + dataConstant[0].value + "`.`buffe_transfer` WHERE `status` = 1 ORDER BY `status`,`id` ASC LIMIT 0," + parseInt(dataConfig[9].value);

        } else if (dataConfigSql['dbtypes'] == '1') { //mssql

            var sql = "SELECT TOP " + parseInt(dataConfig[9].value) + " [id], [table] FROM [" + dataConfigSql['schemas'] + "].[buffe_transfer] WHERE [status] = 1 ORDER BY [status],[id] ASC";

        } else if (dataConfigSql['dbtypes'] == '2') { //

        } else if (dataConfigSql['dbtypes'] == '3') {

            var sql = "SELECT \"id\", \"table\" FROM " + dataConfigSql['schemas'] + ".\"buffe_transfer\" WHERE \"status\" = 1  ORDER BY \"status\",\"id\" ASC LIMIT 0," + parseInt(dataConfig[9].value);

        } else if (dataConfigSql['dbtypes'] == '4') {

        }

        db.querySql(sql).then(dataQuery => {

            $.each(dataQuery, (key, value) => {

                if (dataConfigSql['dbtypes'] == '0') { //mysql

                    var sql = "SELECT * FROM `" + dataConstant[0].value + "`.`buffe_transfer` WHERE `id` ='" + value['id'] + "'";

                } else if (dataConfigSql['dbtypes'] == '1') { //mssql

                    var sql = "SELECT * FROM [" + dataConfigSql['schemas'] + "].[buffe_transfer] WHERE [id] ='" + value['id'] + "'";

                } else if (dataConfigSql['dbtypes'] == '2') { //

                } else if (dataConfigSql['dbtypes'] == '3') {

                    var sql = "SELECT * FROM " + dataConfigSql['schemas'] + ".\"buffe_transfer\" WHERE \"id\" ='" + value['id'] + "'";

                } else if (dataConfigSql['dbtypes'] == '4') {

                }



                db.querySql(sql).then(dataQueryTransfer => {

                    $.each(dataQueryTransfer, (keyData, valueData) => {

                        var paramSync = {};

                        $.each(valueData, (keyField, valueField) => {
                            if (keyField != 'dadd') {

                                paramSync[keyField] = valueField == null ? '' : valueField;

                            }
                        });

                        if (paramSync[0]) {
                            paramSync = paramSync[0]
                        }
                        // console.log(paramSync);

                        var urlTransferService = dataConstant[8].value + "/buffe-transfer/sync?token=" + dataLogin['access_token'] + "&cpu=" + cpuApp.percentCPUUsage + "&ram=" + ramApp + "&ram_usage=" + (ramApp / 100) * ramTotalMb + "&cpu_serv=" + cpuTotal + "&ram_serv=" + ramTotal + "&ram_serv_usage=" + ramFree.toFixed(0);
                        service(urlTransferService, paramSync, 'POST').then(dataTransferService => {
                            // console.log(dataTransferService);
                            dataTransferService = JSON.parse(dataTransferService);
                            if (dataTransferService['result'] == 'OK') {

                                if (dataConfig[19].value == '1') {

                                    if (dataConfigSql['dbtypes'] == '0') { //mysql

                                        var sqlUpdatTransfer = "DELETE FROM `" + dataConstant[0].value + "`.`buffe_transfer` WHERE `id` = " + value['id'];

                                    } else if (dataConfigSql['dbtypes'] == '1') { //mssql

                                        var sqlUpdatTransfer = "DELETE FROM [" + dataConfigSql['schemas'] + "].[buffe_transfer] WHERE [id] = " + value['id'];

                                    } else if (dataConfigSql['dbtypes'] == '2') { //

                                    } else if (dataConfigSql['dbtypes'] == '3') {

                                        var sqlUpdatTransfer = "DELETE FROM " + dataConfigSql['schemas'] + ".\"buffe_transfer\" WHERE \"id\" = " + value['id'];

                                    } else if (dataConfigSql['dbtypes'] == '4') {

                                    }


                                    db.querySql(sqlUpdatTransfer).then(dataUpdate => {
                                        if (showConsole == true) {
                                            console.log(dataUpdate);

                                        }
                                        getCountTranfer();
                                        sendData += dataQueryTransfer.length;
                                        // if (ipcRendererCheck == true) {
                                        //     ipcRenderer.send('background-send-sendData', sendData);
                                        // }

                                    }).catch(err => {
                                        if (showConsoleErr == true) {
                                            console.log(err);
                                        }
                                    });
                                } else {

                                    if (dataConfigSql['dbtypes'] == '0') { //mysql

                                        var sqlUpdatTransfer = "UPDATE `" + dataConstant[0].value + "`.`buffe_transfer` SET `status` ='2', `dupdate` =NOW() WHERE `id` = " + value['id'];

                                    } else if (dataConfigSql['dbtypes'] == '1') { //mssql

                                        var sqlUpdatTransfer = "UPDATE [" + dataConfigSql['schemas'] + "].[buffe_transfer] SET [status] ='2', [dupdate] =NOW() WHERE [id] =" + value['id'];

                                    } else if (dataConfigSql['dbtypes'] == '2') { //

                                    } else if (dataConfigSql['dbtypes'] == '3') {

                                        var sqlUpdatTransfer = "UPDATE " + dataConfigSql['schemas'] + ".\"buffe_transfer\" SET \"status\" ='2', \"dupdate\" =NOW() WHERE \"id\" = " + value['id'];

                                    } else if (dataConfigSql['dbtypes'] == '4') {

                                    }

                                    db.querySql(sqlUpdatTransfer).then(dataUpdate => {
                                        if (showConsole == true) {
                                            console.log(dataUpdate);
                                        }
                                        getCountTranfer();
                                        sendData += dataQueryTransfer.length;
                                        // if (ipcRendererCheck == true) {
                                        //     ipcRenderer.send('background-send-sendData', sendData);
                                        // }

                                    }).catch(err => {
                                        if (showConsoleErr == true) {
                                            console.log(err);
                                        }
                                    });
                                }

                            } else {
                                dataTransferService = JSON.stringify(dataTransferService, null, "\t");
                                dataTransferService = dataTransferService.replace(/'/g, "\\\'");
                                if (dataConfigSql['dbtypes'] == '0') { //mysql

                                    var sqlErr = "UPDATE `" + dataConstant[0].value + "`.`buffe_transfer` SET `serverr`= '" + dataTransferService + "', `status`='9', `dupdate`=NOW() WHERE `id`=" + value['id'];

                                } else if (dataConfigSql['dbtypes'] == '1') { //mssql

                                    var sqlErr = "UPDATE [" + dataConfigSql['schemas'] + "].[buffe_transfer] SET [serverr]= '" + dataTransferService + "', [status]='9', [dupdate]=NOW() WHERE [id] =" + value['id'];

                                } else if (dataConfigSql['dbtypes'] == '2') { //

                                } else if (dataConfigSql['dbtypes'] == '3') {

                                    var sqlErr = "UPDATE " + dataConfigSql['schemas'] + ".\"buffe_transfer\" SET \"serverr\" = '" + dataTransferService + "', \"status\"='9', \"dupdate\" =NOW() WHERE \"id\" =" + value['id'];

                                } else if (dataConfigSql['dbtypes'] == '4') {

                                }

                                db.querySql(sqlErr).then(dataErr => {
                                    if (showConsole == true) { console.log(dataErr); }
                                }).catch(err => {
                                    if (showConsoleErr == true) { console.log(err); }
                                });


                            }

                        }).catch(err => {
                            err = JSON.stringify(err, null, "\t");
                            err = err.replace(/'/g, "\\\'");
                            if (dataConfigSql['dbtypes'] == '0') { //mysql

                                var sqlErr = "UPDATE `" + dataConstant[0].value + "`.`buffe_transfer` SET `serverr`= '" + err + "', `status`='9', `dupdate`=NOW() WHERE `id`= " + valueData['id'];

                            } else if (dataConfigSql['dbtypes'] == '1') { //mssql

                                var sqlErr = "UPDATE [" + dataConfigSql['schemas'] + "].[buffe_transfer] SET [serverr]= '" + err + "', [status]='9', [dupdate]=NOW() WHERE [id] = " + valueData['id'];

                            } else if (dataConfigSql['dbtypes'] == '2') { //

                            } else if (dataConfigSql['dbtypes'] == '3') {

                                var sqlErr = "UPDATE " + dataConfigSql['schemas'] + ".\"buffe_transfer\" SET \"serverr\" = '" + err + "', \"status\"='9', \"dupdate\" =NOW() WHERE \"id\" = " + valueData['id'];

                            } else if (dataConfigSql['dbtypes'] == '4') {

                            }
                            db.querySql(sqlErr).then(dataErr => {
                                if (showConsoleErr == true) { console.log(dataErr); }
                            }).catch(err => {
                                if (showConsoleErr == true) { console.log("(Error) UPDATE `buffe_transfer` SET `serverr` : " + err); }
                                if (saveLog == true) {
                                    logFn.writerLog(filename, getDateTime() + "(Error) UPDATE `buffe_transfer` SET `serverr` : " + err + ' \r\n');
                                }
                                if (showNotify == true) {
                                    notifyFn.alertNotify("(Error) UPDATE `buffe_transfer` SET `serverr` : " + err);
                                }
                            });

                        });

                    });
                }).catch(err => {
                    if (showConsoleErr == true) { console.log("Transfer Execute error (status = 1 OR status = 9) " + err); }
                    if (saveLog == true) {
                        logFn.writerLog(filename, getDateTime() + "Transfer Execute error (status = 1 OR status = 9) " + err + ' \r\n');
                    }
                    if (showNotify == true) {
                        notifyFn.alertNotify("Transfer Execute error (status = 1 OR status = 9) " + err);
                    }
                });


            });

        }).catch(err => {
            if (showConsoleErr == true) { console.log('Query Err : ' + err); }
            if (saveLog == true) {
                logFn.writerLog(filename, getDateTime() + 'Query Err : ' + err + ' \r\n');
            }
            if (showNotify == true) { notifyFn.alertNotify('Query Err : ' + err); }
        });
    } catch (ex) {
        if (showConsoleErr == true) { console.log(ex); }
        if (ipcRendererCheck == true) {
            ipcRenderer.send('background-send-job', err);
        }
        if (showNotify == true) { notifyFn.alertNotify(err); }
        if (saveLog == true) {
            logFn.writerLog(filename, getDateTime() + err + ' \r\n');
        }
    }
}

async function syncQ() {
    try {
        if (checkSyncQ == false) {
            checkSyncQ = true;
            if (showConsole == true) {
                console.log("syncQ");
            }
            let urlTransferService = dataConstant[8].value + "/buffe-transfer/get43-file";
            var data43File = await service(urlTransferService, { token: dataLogin['access_token'] }, 'GET');
            data43File = await JSON.parse(data43File);
            var dataQ = [];
            var dataTransferAll = 0;
            var dataQAll = 0;
            for (var j = 0; j < data43File.length; j++) {
                let countSqlQ = '';
                let countSqlT = '';
                if (dataConfigSql['dbtypes'] == '0') { //mysql
                    countSqlQ = "SELECT  COUNT(*) AS dataQ FROM `" + dataConstant[0].value + "`.`buffe_fetch_queue` WHERE SUBSTRING_INDEX(f_tname,'f_',-1) = SUBSTRING_INDEX('" + data43File[j]['f43'] + "','f_',-1)";
                    countSqlT = "SELECT  COUNT(*) AS dataT FROM `" + dataConstant[0].value + "`.`buffe_transfer` WHERE SUBSTRING_INDEX(`table`,'f_',-1) = SUBSTRING_INDEX('" + data43File[j]['f43'] + "','f_',-1) AND (`status` ='0' or `status` ='9' or `status` is null)";
                } else if (dataConfigSql['dbtypes'] == '1') { //mssql
                    countSqlQ = "SELECT  COUNT(*) AS dataQ FROM [" + dataConfigSql['schemas'] + "].[buffe_fetch_queue]   WHERE f_tname = '" + data43File[j]['f43'] + "'";
                    countSqlT = "SELECT  COUNT(*) AS dataT FROM [" + dataConfigSql['schemas'] + "].[buffe_transfer]   WHERE [table] = '" + data43File[j]['f43'] + "' AND ([status] ='0' or [status] ='9' or [status] is null)";
                } else if (dataConfigSql['dbtypes'] == '2') { //

                } else if (dataConfigSql['dbtypes'] == '3') {
                    countSqlQ = "SELECT COUNT(*) AS dataQ FROM " + dataConfigSql['schemas'] + ".\"buffe_fetch_queue\"  WHERE f_tname = '" + data43File[j]['f43'] + "'";
                    countSqlT = "SELECT COUNT(*) AS dataT FROM " + dataConfigSql['schemas'] + ".\"buffe_transfer\"  WHERE \"table\" = '" + data43File[j]['f43'] + "'  AND (\"status\" ='0' or \"status\" ='9' or \"status\" is null)";
                } else if (dataConfigSql['dbtypes'] == '4') {

                }
                let countAllData = 0;
                try {
                    let countQ = await db.querySql(countSqlQ);
                    let countT = await db.querySql(countSqlT);
                    if (countT.length > 0 || countQ.length > 0) {
                        dataTransferAll += parseInt(countT[0]['dataT']);
                        countAllData = parseInt(countQ[0]['dataQ']) + parseInt(countT[0]['dataT']);
                        dataQAll += countAllData;
                    }
                    dataQ.push({ sitecode: dataConfig[0]['value'], table: data43File[j]['f43'], his_record: 0, record: 0, qleft: countAllData, process: 0 });

                } catch (err) {
                    dataQ.push({ sitecode: dataConfig[0]['value'], table: data43File[j]['f43'], his_record: 0, record: 0, qleft: countAllData, process: 0 });
                    if (showConsoleErr == true) {
                        console.log(err);
                    }
                }


            }

            let jsonData = JSON.stringify(dataQ);
            urlTransferService = dataConstant[8].value + "/buffe-transfer/sync-q?token=" + dataLogin['access_token'];
            let serviceQ = await service(urlTransferService, { jsondata: jsonData }, 'POST');

            dataQ.push({ sitecode: dataConfig[0]['value'], table: 'All', his_record: 0, record: 0, qleft: dataQAll, process: 1 });
            if (showConsole == true) {
                console.log(dataQ);
            }
            if (ipcRendererCheck == true) {
                ipcRenderer.send('background-send-countQueue', { dataQ: dataQ });
                ipcRenderer.send('background-send-countData', { countAll: dataTransferAll });
            }
            checkSyncQ = false;
        }

    } catch (err) {
        err = JSON.stringify(err);
        // if (showConsoleErr == true) {
        console.log(err);
        // }
        if (saveLog == true) {
            logFn.writerLog(filename, getDateTime() + 'Count data error: ' + err + ' \r\n');
        }
        dataQ.push({ sitecode: dataConfig[0]['value'], table: 'error', his_record: 0, record: 0, qleft: dataQAll, process: 1 });

        if (ipcRendererCheck == true) {
            ipcRenderer.send('background-send-countQueue', { dataQ: dataQ });
            ipcRenderer.send('background-send-countData', { countAll: 0 });
        }
        checkSyncQ = false;
    }
}

function service(url = '', data, type = '') {
    //let url ="https://tdcservice.thaicarecloud.org/buffe-config/ping";
    // console.log(data);
    return new Promise((resolve, reject) => {

        var settings = {
            "async": true,
            "crossDomain": true,
            "url": url,
            "data": data,
            "method": type,
            "contentType": 'application/x-www-form-urlencoded; charset=UTF-8',
        }
        $.ajax(settings).done(response => {
            resolve(response);
        }).fail((xhr, status, error) => {
            reject(xhr.status + " " + error);
        });
    });

}

function getCpu() {

    return new Promise((resolve, reject) => {
        osUtils.cpuUsage((v) => {
            resolve(v * 100);

        });


    });
} //getCpu

function getDateTime() {
    try {
        let dateTimes = new Date();
        let dd = dateTimes.getDate();
        let mm = dateTimes.getMonth() + 1;
        let yy = dateTimes.getFullYear();
        let hh = dateTimes.getHours();
        let mu = dateTimes.getMinutes();
        let ss = dateTimes.getSeconds();
        return yy + "-" + (mm < 10 ? '0' : '') + mm + "-" + (dd < 10 ? '0' : '') + dd + " " +
            (hh < 10 ? '0' : '') + hh + ":" + (mu < 10 ? '0' : '') + mu + ":" + (ss < 10 ? '0' : '') + ss + " ";

    } catch (err) {
        if (showConsoleErr == true) { console.log(err); }
    }

}

function getCountTranfer() {
    let countSql = '';
    if (dataConfigSql['dbtypes'] == '0') { //mysql

        countSql = "SELECT  COUNT(*) AS countAll FROM `" + dataConstant[0].value + "`.`buffe_transfer` WHERE WHERE `status` ='0' or `status` ='9' or `status` is null ";

    } else if (dataConfigSql['dbtypes'] == '1') { //mssql

        countSql = "SELECT  COUNT(*) AS countAll FROM [" + dataConfigSql['schemas'] + "].[buffe_transfer]  WHERE [status] ='0' or [status] ='9' or [status] is null ";

    } else if (dataConfigSql['dbtypes'] == '2') { //

    } else if (dataConfigSql['dbtypes'] == '3') {

        countSql = "SELECT COUNT(*) AS countAll FROM " + dataConfigSql['schemas'] + ".\"buffe_transfer\" WHERE \"status\" ='0' or \"status\" ='9' or \"status\" is null ";

    } else if (dataConfigSql['dbtypes'] == '4') {

    }

    db.querySql(countSql).then(dataCount => {
        // alert(dataCount[0]['countAll']);
        if (ipcRendererCheck == true) {
            ipcRenderer.send('background-send-countData', dataCount[0]);
            ipcRenderer.send('background-send-sendData', sendData);
        }

    }).catch(err => {
        if (showConsoleErr == true) {
            console.log(err);
        }
    });
}

async function logApp(tk = null) {
    try {

        if (tk != null) {
            let paramLog = { token: tk, action: 'insert', start_tdc: getDateTime() };
            service('https://tdcservice.thaicarecloud.org/buffe-config/log-connection', paramLog, 'GET').then(res => {
                let logServer = JSON.parse(res);
                if (logServer['result'] == 'OK') {
                    if (saveLog == true) {
                        if (showConsoleErr == true) console.log("Save log to server success");
                        logFn.writerLog(filename, getDateTime() + "Save log to server success \r\n");
                    }
                } else {
                    if (saveLog == true) {
                        if (showConsoleErr == true) console.log(err);
                        logFn.writerLog(filename, getDateTime() + "Save log to server err " + err + ' \r\n');
                    }
                }
            }).catch(err => {
                if (saveLog == true) {
                    if (showConsoleErr == true) console.log(err);
                    logFn.writerLog(filename, getDateTime() + "Save log to server err " + err + ' \r\n');
                }
            });
        } else {
            let paramLog = { token: dataLogin['access_token'], action: 'update', stop_tdc: getDateTime() };
            service('https://tdcservice.thaicarecloud.org/buffe-config/log-connection', paramLog, 'GET').then(res => {
                let logServer = JSON.parse(res);
                if (logServer['result'] == 'OK') {
                    if (showConsoleErr == true) console.log("Save log to server success");
                    if (saveLog == true) {
                        logFn.writerLog(filename, getDateTime() + "Save log to server success \r\n");
                    }
                    app.exit(0);
                } else {
                    if (showConsoleErr == true) console.log(err);
                    if (saveLog == true) {
                        logFn.writerLog(filename, getDateTime() + "Save log to server err " + err + ' \r\n');
                    }
                    app.exit(0);
                }

            }).catch(err => {
                if (showConsoleErr == true) console.log(err);
                if (saveLog == true) {
                    logFn.writerLog(filename, getDateTime() + "Save log to server err " + err + ' \r\n');
                }
                app.exit(0);
            });

        }

    } catch (ex) {
        if (showConsoleErr == true) {
            console.log(ex);
        }
        app.exit(0);
    }
}