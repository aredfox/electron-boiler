/* ******************************************************************** */
/* MODULE IMPORTS */
import electron, { app, BrowserWindow } from 'electron';
/* FILE IMPORTS */
import packagejson from './package.json';
/*/********************************************************************///

/* ******************************************************************** */
/* ELECTRON APP EVENTS */
let mainWindow;
app.on('ready', () => {
    mainWindow = new BrowserWindow({
        width: 500, height: 450
    });

    mainWindow.loadURL(`file://${__dirname}/views/app.html`);    
});
app.on('window-all-closed', () => {  
    app.quit();
});
/*/********************************************************************///

/* ******************************************************************** */
/* METHODS */
function quit() {
    if(app && app !== undefined) {
        console.log('Quitting...');
        app.quit();
    }
}
/*/********************************************************************///