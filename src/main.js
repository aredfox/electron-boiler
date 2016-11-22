/* ******************************************************************** */
/* MODULE IMPORTS */
import electron, { app, BrowserWindow } from 'electron';
import url from 'url';
import path from 'path';
/* LIB IMPORTS */
import Config from './lib/config/config';
/*/********************************************************************///

/* ******************************************************************** */
/* BOOT */
init();
/*/********************************************************************///

/* ******************************************************************** */
/* ELECTRON APP EVENTS */
let mainWindow;
app.on('ready', () => {
    mainWindow = new BrowserWindow({
        width: 500, height: 450
    });

    mainWindow.loadURL(
        url.format({
            pathname: path.join(__dirname, 'views', 'app.html'),
            protocol: 'file:',
            slashes: true
        })
    );

    mainWindow.openDevTools();        
});
app.on('window-all-closed', () => {  
    app.quit();
});
/*/********************************************************************///

/* ******************************************************************** */
/* INIT METHODS */
function init() {
    initConfig();
}
function initConfig() {
    console.log(path.resolve('./lib/config/config'));
    const config = new Config();
    global.config = config;
    console.log(global.config.environmentName);
}
/*/********************************************************************///

/* ******************************************************************** */
/* HELPER METHODS */
function quit() {
    if(app && app !== undefined) {
        console.log('Quitting...');
        app.quit();
    }
}
/*/********************************************************************///