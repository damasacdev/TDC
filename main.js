'use strict';

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
    var min = 0;

    if (serve) {
        require('electron-reload')(__dirname + '/dist');
    }

    function createWindow() {

        let electronScreen = electron.screen;
        let size = electronScreen.getPrimaryDisplay().workAreaSize;
        // Create the browser window.
        win = new BrowserWindow({
            x: 0,
            y: 0,
            show: true,
            transparent: true,
            title: "TDC BOT",
            icon: './favicon.png',
            width: size.width,
            height: size.height,
            icon: path.join(__dirname, './assets/icons/favicon.ico')
        });

        let url = serve ?
            'file://' + __dirname + '/dist/index.html' :
            'file://' + __dirname + '/index.html';

        // and load the index.html of the app.
        win.loadURL(url);
        win.webContents.openDevTools();
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


    function createWin() {
        newWin = new BrowserWindow({
            icon: './favicon.ico',
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
            content: '.'
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
    ipcMain.on('background-send-command', function(event, payload) {
        // alertNotify(payload);
        if (min == '1') {
            appIcon.displayBalloon({
                icon: '',
                title: 'Working',
                content: payload
            });
        };
        // win.webContents.send('background-send-command', payload);
    });
    ipcMain.on('background-send-config', (event, payload) => win.webContents.send('background-send-config', payload));
    ipcMain.on('background-send-sync', (event, payload) => win.webContents.send('background-send-sync', payload));
    ipcMain.on('background-send-ping', (event, payload) => win.webContents.send('background-send-ping', payload));


} catch (e) {
    // Catch Error
}