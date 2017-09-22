try {
    const electron = require('electron');
    const ipcMain = electron.ipcMain;
    const ipcRenderer = electron.ipcRenderer;

    const { app, Menu, Tray, protocol } = electron;

    const { BrowserWindow } = electron;
    let bgWins = [];
    let win, serve, newWin,winUpdate;
    const args = process.argv.slice(1);
    serve = args.some(val => val === "--serve");

    // const nodetifier = require('node-notifier');
    const path = require('path');

    let appIcon = null;
    let min = 0;
    let countShow = false;

    if (serve) {
        require('electron-reload')(__dirname + '/dist');
    }

    

    function createWindow() {

        var t = require('./lib/dialog.js');
        t.showMessageBox();
          
        let electronScreen = electron.screen;
        let size = electronScreen.getPrimaryDisplay().workAreaSize;
        // Create the browser window.
        win = new BrowserWindow({
            // x: 0,
            // y: 0,
            show: true,
            // transparent: true,
            title: "TDC",
            icon: path.join(__dirname, 'assets/favicon.png'),
            width: 900,
            height: 700,
            minWidth: 900,
            minHeight: 700,
            resizable: false,
            // fullscreen: false,
        });

        // win.setFullScreen(false);


        let url = serve ?
            'file://' + __dirname + '/dist/index.html' :
            'file://' + __dirname + '/index.html';

        // and load the index.html of the app.
        win.loadURL(url);
        // win.webContents.openDevTools();
        // // // // Open the DevTools.
        // if (serve) {
        //     win.webContents.openDevTools();
        // }
        win.on('close', (e) => {
            e.preventDefault();
            win.hide();
            min = 1;
            appIcon.displayBalloon({
                icon: path.join(__dirname, 'assets/favicon.png'),
                title: 'TDC App',
                content: 'Thai care cloud'
            });
            try {   newWin.webContents.send('notify-check',true) }  catch (ex) { app.exit();}
            // app.quit();
            // try {   newWin.webContents.send('app-close',null) }  catch (ex) { }
        });
        // win.on('closed', () => {
        //     win = null;
        //     try {   newWin.webContents.send('app-close',null) }  catch (ex) { }
        // });

       
        win.on('minimize', function (event) {
            event.preventDefault();
            win.hide();
            min = 1;
            appIcon.displayBalloon({
                icon: path.join(__dirname, 'assets/favicon.png'),
                title: 'TDC App',
                content: 'Thai care cloud'
            });
            try {   newWin.webContents.send('notify-check',true) }  catch (ex) { app.exit();}
        });
    }
    //  createWin();
    // createWin();
    app.on('ready', ()=>{
        createWindow();
        createWin();
    });
   

    app.on('window-all-closed', () => {
        if (process.platform !== 'darwin') {
            app.quit();
            // try { newWin.webContents.send('app-close',null) }  catch (ex) { }
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
            icon: path.join(__dirname, 'assets/favicon.png'),
            title: "TDC",
            show: false
        });

        let url = serve ?

            'file://' + __dirname + '/dist/backgroundtask/background-process.html' :
            'file://' + __dirname + '/backgroundtask/background-process.html';


        // and load the index.html of the app.
        newWin.loadURL(url);
        // newWin.webContents.openDevTools();
        // // // Open the DevTools.
        // if (serve) {
        // newWin.webContents.openDevTools();
        // }
        // newWin.on('closed', () => {
        //     newWin = null;
        // });
        bgWins.push(newWin);
        iconApp();
        appIcon.on('click', () => {
            if(win != null){
                win.show();
                // appIcon.destroy();
                try {   newWin.webContents.send('notify-check',false) }  catch (ex) { app.exit();}
                 min = 0;
                countShow = true;
            }else{
                app.exit();
            }
        });
    }


    function iconApp() {
        appIcon = new Tray(path.join(__dirname, 'assets/favicon.ico'));
        appIcon.setToolTip('TDC');
        // appIcon.setImage(path.join(__dirname, 'assets/favicon.ico'));
        const contextMenu = Menu.buildFromTemplate([
            { 
                label: 'quit', 
                click: function(){
                    try {   newWin.webContents.send('app-close',null) }  catch (ex) { app.exit();}
                } 
            }
        ]);
        appIcon.setContextMenu(contextMenu);
    }


    //รับค่าจาก view แล้วส่งไปยัง backgroudprocess
    ipcMain.on('call-backgroud-process', function (event, payload) {
        try { 
            newWin.webContents.send('call-backgroud-process', payload);
            newWin.webContents.send('countShow');
         } catch (ex) { }
    });
    ipcMain.on('updateWinShow', function (event, payload) {
        win.hide();
    });
    // ipcMain.on('setProcess', (event, payload) => newWin.webContents.send('setProcess', payload));

    // รับค่าจาก backgroudprocess แล้วส่งไปหน้า view

    ipcMain.on('sendStatus', function (event, payload) { try { win.webContents.send('sendStatus', payload) } catch (ex) { } });
    ipcMain.on('background-send-constant', function (event, payload) { try { if (min == 0) { win.webContents.send('background-send-constant', payload) } } catch (ex) { } });
    ipcMain.on('background-send-job', function (event, payload) {
       
        try {
            if (min == 0) { 
                win.webContents.send('background-send-job', payload); 
            }
        } catch (ex) { }
    });
    ipcMain.on('background-send-config', function (event, payload) { try { if (min == 0) { win.webContents.send('background-send-config', payload) } } catch (ex) { } });
    ipcMain.on('background-send-sync', function (event, payload) { try { if (min == 0) { win.webContents.send('background-send-sync', payload) } } catch (ex) { } });
    ipcMain.on('background-send-ping', function (event, payload) { try { if (min == 0) { win.webContents.send('background-send-ping', payload) } } catch (ex) { } });
    ipcMain.on('background-send-countData', function (event, payload) { try { if (min == 0) { win.webContents.send('background-send-countData', payload) } } catch (ex) { } });
    ipcMain.on('background-send-sendData', function (event, payload) { try { if (min == 0) { win.webContents.send('background-send-sendData', payload) } } catch (ex) { } });
    ipcMain.on('background-send-countQueue', function (event, payload) { try { if (min == 0) { win.webContents.send('background-send-countQueue', payload) } } catch (ex) { } });
    ipcMain.on('getProcess', function (event, payload) {
        try {
            if (min == 0) {
                win.webContents.send('getProcess', payload);
                win.webContents.send('checkOnline', payload);
                if (countShow == true) {
                    countShow = false;
                    newWin.webContents.send('countShow');
                }
            }
        } catch (ex) { }
    });
    ipcMain.on('app-open', function (event, payload) { try { if (min == 0) { newWin.webContents.send('app-open', payload) } } catch (ex) { } });
    // ipcMain.on('isOnline', function(event, payload){try{ if(min == '0'){win.webContents.send('isOnline', payload)}}catch(ex){}});
    // ipcMain.on('getProcessData', (event, payload) => win.webContents.send('getProcessData', payload));





} catch (e) {
    // Catch Error
}