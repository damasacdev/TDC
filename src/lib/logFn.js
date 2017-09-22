const fs = require('fs');
const path = require('path');
var logFn = {};
var dir = require('os').homedir() + "/tdc/";

function setPath(filename) { //ตั้งค่า path ของ json

    if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir);
    }
    let paths = path.resolve(dir + filename);
    return new Promise((resolve, reject) => {
        fs.readFile(paths, function(err, data) {
            if (err) {
                if (!fs.existsSync(dir)) {
                    fs.mkdirSync(dir);
                }
                reject("err");
            }
            if (data) { resolve("success"); }
        });
    });
}

logFn.writerLog = function writerLog(filename, data) { //ตั้งค่า path ของ sqlite
        try {

            setPath(filename).then(res => {
                fs.appendFile(dir + filename, data, (err, res) => {
                    if (err) { console.log('error'); }
                    if (res) { console.log("success"); }
                });
            }).catch(err => {
                fs.appendFile(dir + filename, data, (err, res) => {
                    if (err) { console.log('error'); }
                    if (res) { console.log("success"); }
                });
            });
        } catch (err) {
            console.log(err);
        }

    } //setPath

logFn.deleteLog = function deleteLog(filename) { //ตั้งค่า path ของ sqlite
        try {

            setPath(filename).then(res => {
                fs.unlink(dir + filename, (err, res) => {
                    if (err) { console.log('error'); }
                    if (res) { console.log("success"); }
                });
            }).catch(err => {
                fs.unlink(dir + filename, (err, res) => {
                    if (err) { console.log('error'); }
                    if (res) { console.log("success"); }
                });
            });
        } catch (err) {
            console.log(err);
        }

    } //setPath

logFn.writerData = function writerData(filename, data) { //ตั้งค่า path ของ sqlite
        try {

            setPath(filename).then(res => {
                fs.writeFile(dir + filename, data, (err, res) => {
                    if (err) { console.log('error'); }
                    if (res) { console.log("success"); }
                });
            }).catch(err => {
                fs.writeFile(dir + filename, data, (err, res) => {
                    if (err) { console.log('error'); }
                    if (res) { console.log("success"); }
                });
            });
        } catch (err) {
            console.log(err);
        }

    } //setPath

logFn.readFile = function readFile(filename) { //ตั้งค่า path ของ sqlite
        try {
            return new Promise((resolve, reject) => {
                setPath(filename).then(res => {

                    fs.readFile(dir + filename, 'utf8', (err, res) => {
                        if (err) { reject(err) }
                        if (res) { resolve(res); }
                    });
                }).catch(err => {

                    fs.readFile(dir + filename, 'utf8', (err, res) => {
                        if (err) { reject(err) }
                        if (res) { resolve(res); }
                    });
                });
            });
        } catch (err) {
            console.log(err);
        }

    } //setPath

module.exports = logFn;