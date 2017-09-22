const app = require('electron').remote.app;
const updater = require('electron').remote.require('electron-auto-updater');
const { dialog, BrowserWindow } = require('electron').remote;
const path = require('path');
const ipc = require('electron').ipcRenderer;
const ipcMain = require('electron').remote.ipcMain;
var check = 1;
let win, serve;
const args = process.argv.slice(1);
serve = args.some(val => val === "--serve");




function createWinUpdate() {
    win = new BrowserWindow({
        // x: 0,
        // y: 0,
        show: true,
        // transparent: true,
        title: "TDC",
        icon: path.join(__dirname, '../assets/favicon.png'),
        width: 450,
        height: 180,
        minWidth: 450,
        minHeight: 180,
        resizable: false,
        // frame: false,
    });
    let url = serve ?
        'file://' + __dirname + './../dist/update/update.html' :
        'file://' + __dirname + './../update/update.html';

    // and load the index.html of the app.
    win.loadURL(url);
    // win.webContents.openDevTools();
    // // Open the DevTools.
    // if (serve) {
    //     win.webContents.openDevTools();
    // }
    win.on('closed', () => {
        win = null;
        app.quit();
    });
    // "nsis": {
    //     "oneClick": false,
    //     "allowToChangeInstallationDirectory": true,
    //     "menuCategory": true,
    //     "runAfterFinish": true
    // }
}
// createWinUpdate();
var a = module.exports = {
    Dialog: () => {
        ipc.send('open-confirm-dialog');
        ipc.on('information-dialog-selection', function(event, index) {
            let message = 'You selected '
            if (index === 0) {
                message += 'yes.';
                createWinUpdate();
                a.DownloadandInstallNewVersion();
                ipc.send('updateWinShow');
            } else {
                message += 'no.';
                console.log(message);
            }

        })
    },
    CheckVersion: () => {
        updater.autoUpdater.checkForUpdates();
        updater.autoUpdater.addListener("update-available", function(event) {
            //พบเวอร์ชั่นใหม่
            //dialog
            check += 1;
            if (check == 2) {
                a.Dialog();
            }

        });

        updater.autoUpdater.addListener("update-not-available", function() {
            console.log("ไม่พบ Version ใหม่กว่า");
            return 0;
        });
        updater.autoUpdater.addListener("error", (error) => {
            console.log(error);
        });
        updater.autoUpdater.addListener("checking-for-update", (event) => {
            console.log("checking-for-update");
        });

    },
    DownloadandInstallNewVersion: () => {
        updater.autoUpdater.checkForUpdates();
        updater.autoUpdater.addListener('download-progress', (progressObj) => {
            let log_message = "Download speed: " + progressObj.bytesPerSecond;
            log_message = log_message + ' - Downloaded ' + progressObj.percent + '%';
            log_message = log_message + ' (' + progressObj.transferred + "/" + progressObj.total + ')';
            console.log("check 6 " + progressObj.percent);
            console.log(log_message);
            win.webContents.send('download', progressObj);
        });
        updater.autoUpdater.addListener("update-downloaded", (event, releaseNotes, releaseName, releaseDate, updateURL) => {
            console.log("A new update is ready to install", `Version ${releaseName} is downloaded and will be automatically installed on Quit`);
            console.log("quitAndInstall");
            setTimeout(() => updater.autoUpdater.quitAndInstall(), 3000);
            // //dialog
            // ipc.send('open-information-dialog');
            // ipc.on('information-dialog-selection', function (event, index) {
            //     let message = 'You selected '
            //     if (index === 0) {
            //         message += 'yes.'
            //         setTimeout(() => updater.autoUpdater.quitAndInstall(), 1);
            //     }
            //     else {
            //         message += 'no.'
            //     }
            //     console.log(message);
            // })


            //updater.autoUpdater.quitAndInstall();
            return true;
        })
        updater.autoUpdater.addListener("error", (error) => {
            console.log(error);
        });
        updater.autoUpdater.addListener("checking-for-update", (event) => {
            console.log("checking-for-update");
        });
    },

}