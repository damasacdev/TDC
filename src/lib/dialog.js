const ipc = require('electron').ipcMain
const dialog = require('electron').dialog
module.exports = {
    showMessageBox:()=>{
        ipc.on('open-information-dialog', function (event) {
            const options = {
                type: 'info',
                title: "Installers",
                message: "คุณต้องการติดตั้ง TDC หรือไม่",
                buttons: ['Yes', 'No']
            }
            dialog.showMessageBox(options, function (index) {
                event.sender.send('information-dialog-selection', index)
            })
        });
        ipc.on('open-confirm-dialog', function (event) {
            const options = {
                type: 'info',
                title: "Update TDC",
                message: "มี TDC Version ใหม่ คุณต้องการที่จะ Update ตอนนี้ใช่หรือไม่",
                buttons: ['Yes', 'No']
            }
            dialog.showMessageBox(options, function (index) {
                event.sender.send('information-dialog-selection', index)
            })
        });
    }
}