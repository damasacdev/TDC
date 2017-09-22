const app = require('electron').remote.app;
const updater = require('electron').remote.require('electron-auto-updater');

console.log("current version: " + app.getVersion());

updater.autoUpdater.checkForUpdates();
updater.autoUpdater.addListener("update-available", function (event) {
    console.log("A new update is available");
});

updater.autoUpdater.addListener("update-not-available", function () {
    console.log("update-not-available");
});

updater.autoUpdater.addListener("update-downloaded", (event, releaseNotes, releaseName, releaseDate, updateURL) => {
    console.log("A new update is ready to install", `Version ${releaseName} is downloaded and will be automatically installed on Quit`);
    console.log("quitAndInstall");
    updater.autoUpdater.quitAndInstall();
    return true;
})
updater.autoUpdater.addListener("error", (error) => {
    console.log(error);
});
updater.autoUpdater.addListener("checking-for-update", (event) => {
    console.log("checking-for-update");
});