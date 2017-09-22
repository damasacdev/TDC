 try {
     const electron = require('electron');
     const ipcMain = electron.ipcMain;
     const ipcRenderer = electron.ipcRenderer;

     const { app, Menu, Tray } = electron;

     const { BrowserWindow } = electron;
     let bgWins = [];
     let win, serve, newWin;
     const args = process.argv.slice(1);
     serve = args.some(val => val === "--serve");


     // const nodetifier = require('node-notifier');
     const path = require('path');
 
     let appIcon = null;
     let min = '0';

     if (serve) {
         require('electron-reload')(__dirname + '/dist');
     }

     //auto 
    const {app, Menu, protocol} = require('electron');
    const autoUpdater = require("electron-updater").autoUpdater;
    const log = require('electron-log');

    autoUpdater.logger = log;
    autoUpdater.logger.transports.file.level = 'info';
    log.info('App starting...');
    function sendStatusToWindow(text) {
      log.info(text);
      app_1.webContents.send('message', text);
    }

autoUpdater.on('checking-for-update', () => {
        console.log("check2");
         sendStatusToWindow('Checking for update...');
    });
        autoUpdater.on('update-available', (info) => {
        console.log("check3");

    sendStatusToWindow('Update available.');
    })
    autoUpdater.on('update-not-available', (info) => {
        console.log("check4");

    sendStatusToWindow('Update not available.');
    })
    autoUpdater.on('error', (err) => {
        console.log("check5");

    sendStatusToWindow('Error in auto-updater.');
    })
    autoUpdater.on('download-progress', (progressObj) => {
    let log_message = "Download speed: " + progressObj.bytesPerSecond;
    log_message = log_message + ' - Downloaded ' + progressObj.percent + '%';
    log_message = log_message + ' (' + progressObj.transferred + "/" + progressObj.total + ')';
        console.log("check 6 " +progressObj.percent);

    sendStatusToWindow(log_message);
    })
    autoUpdater.on('update-downloaded', (info) => {
    console.log("check 7 " );
    sendStatusToWindow('Update downloaded; will install in 5 seconds');
    });

     function createWindow() {
         autoUpdater.checkForUpdates(); //check update   
         let electronScreen = electron.screen;
         let size = electronScreen.getPrimaryDisplay().workAreaSize;
         // Create the browser window.
         win = new BrowserWindow({
             x: 0,
             y: 0,
             show: true,
             transparent: true,
             title: "TDC",
             icon: './favicon.png',
             width: size.width,
             height: size.height
         });


         let url = serve ?
             'file://' + __dirname + '/dist/index.html' :
             'file://' + __dirname + '/index.html';

         // and load the index.html of the app.
         win.loadURL(url);
         //win.webContents.openDevTools();
         // Open the DevTools.
         if (serve) {
             win.webContents.openDevTools();
         }
         win.on('closed', () => {
             win = null;
             app.quit();
         });

         // alertNotify();
         createWin();

         win.on('minimize', function(event) {
             iconApp();
             event.preventDefault();
             win.hide();
             min = 1;
             if (appIcon.isDestroyed() == false) {
                 appIcon.on('click', () => {
                     win.isVisible() ? win.hide() : win.show();
                     appIcon.destroy();
                     min = 0;
                 });

             }
         });

         // console.log(process.cpuUsage());

     }
     //  createWin();
     // createWin();
     app.on('ready', createWindow);

     app.on('window-all-closed', () => {
         if (process.platform !== 'darwin') {
             app.quit();
         }
     });

     app.on('activate', () => {

         if (win === null) {
             createWindow();
         }
     });

     app.setUserTasks([{
         title: 'Hello world',
         description: 'This is shown in a tooltip',
         arguments: '--hello-world --another',
         program: process.execPath,
         iconPath: process.execPath,
         iconIndex: 0
     }]);

     function createWin() {
         newWin = new BrowserWindow({
             icon: './favicon.ico',
             title: "TDC"
                 // show: false
         });

         let url = serve ?

             'file://' + __dirname + '/dist/backgroundtask/background-process.html' :
             'file://' + __dirname + '/backgroundtask/background-process.html';


         // and load the index.html of the app.
         newWin.loadURL(url);
         newWin.webContents.openDevTools();
         // Open the DevTools.
         if (serve) {
             newWin.webContents.openDevTools();
         }
         newWin.on('closed', () => {
             newWin = null;
         });
         bgWins.push(newWin);


     }

     function iconApp() {
         appIcon = new Tray('./favicon.ico');
         appIcon.setToolTip('TDC App');
         appIcon.displayBalloon({
             icon: '',
             title: 'This is TDC',
             content: ' '
         });
         const contextMenu = Menu.buildFromTemplate([
             { label: 'quit', role: 'quit' }
         ]);
         appIcon.setContextMenu(contextMenu);
     }

     // function alertNotify(txt) {
     //     if (win.isMinimized()) {

     //         nodetifier.notify({
     //             title: 'TDC BOT',
     //             message: txt,
     //             icon: path.join(__dirname, 'logo-angular.jpg'), // Absolute path (doesn't work on balloons)
     //             sound: true, // Only Notification Center or Windows Toasters
     //             wait: true, // Wait with callback, until user action is taken against notification
     //             contentImage: void 0, // Absolute Path to Attached Image (Content Image) 
     //             open: void 0,
     //         }, function(err, response) {
     //             // Response is response from notification
     //         });

     //         nodetifier.on('click', function(notifierObject, options) {
     //             win.show();
     //         });

     //     }
     // }




     //รับค่าจาก view แล้วส่งไปยัง backgroudprocess
     ipcMain.on('call-backgroud-process', (event, payload) => newWin.webContents.send('call-backgroud-process', payload));

     //รับค่าจาก backgroudprocess แล้วส่งไปหน้า view

     ipcMain.on('background-send-constant', (event, payload) => win.webContents.send('background-send-constant', payload));
     ipcMain.on('background-send-job', function(event, payload) {
         // alertNotify(payload);
         if (min == '1') {
             appIcon.displayBalloon({
                 icon: '',
                 title: 'Working',
                 content: payload
             });
         };
         win.webContents.send('background-send-job', payload);
     });
     ipcMain.on('background-send-config', (event, payload) => win.webContents.send('background-send-config', payload));
     ipcMain.on('background-send-sync', (event, payload) => win.webContents.send('background-send-sync', payload));
     ipcMain.on('background-send-ping', (event, payload) => win.webContents.send('background-send-ping', payload));

     ipcMain.on('test', (data) => {

         console.log(process.getCPUUsage());
     });

 } catch (e) {
     // Catch Error
 }