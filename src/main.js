/* ******************************************************************** */
/* MODULE IMPORTS */
import electron, { app, BrowserWindow } from 'electron';
import url from 'url';
import path from 'path';
/* LIB IMPORTS */
import Config from './lib/config/config';
/* VARIABLES */
let config;
let mainWindow;
/*/********************************************************************///

/* ******************************************************************** */
/* BOOT */
init();
/*/********************************************************************///

/* ******************************************************************** */
/* ELECTRON APP EVENTS */
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

    // Open a-links in new external (native) browser window.
    mainWindow.webContents.on('will-navigate', (e, url) => {
        if(url !== mainWindow.webContents.getURL()) { 
            // if the url isn't the page we are on, we'll open it in the native browser
            e.preventDefault();
            electron.shell.openExternal(url);
        }
    });

    if(config.get('debug.canShowDevTools') && config.get('debug.showDevToolsOnStartup')) {
        mainWindow.openDevTools();        
    }
});
app.on('window-all-closed', () => {  
    app.quit();
});
/*/********************************************************************///

/* ******************************************************************** */
/* INIT METHODS */
function init() {    
    initConfig();
    if(global.config.isDev()) {        
        console.log(`~~ APP: Development mode, switching on electron-reload with dir '${__dirname}'.`);
        require('electron-reload')(__dirname);
    }
}
function initConfig() {    
    config = new Config();
    global.config = config;
}
/*/********************************************************************///

/* ******************************************************************** */
/* HELPER METHODS */
function quit() {
    if(app && app !== undefined) {
        console.log('~~ APP: Quitting.');
        app.quit();
    }
}
/*/********************************************************************///