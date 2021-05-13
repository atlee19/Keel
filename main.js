/**
 * Keel 2021 
 * 
 * Author:    Graham Atlee
 * Created:   05.11.2021
 * 
 * GNU Affero General Public License v3.0
 * 
 * This class specifies the entry point of the Electron application
 **/
const { app, BrowserWindow } = require('electron')
const { autoUpdater } = require("electron-updater");
const path = require('path')

var win; //global window object

//-------------------------------------------------------------------
// Code related to main window creation and closing 
//-------------------------------------------------------------------

function createWindow () {
  win = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
        nodeIntegration : true,
        contextIsolation : false
    }
  })
  win.webContents.openDevTools();
  win.loadFile(path.join(__dirname, 'src/app/index.html'))
}

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})


//-------------------------------------------------------------------
// Auto updates 
//
// This will immediately download an update, then quit and install
//-------------------------------------------------------------------

//send any info on updates to main window 
function sendStatusToWindow(text) {
    win.webContents.send('message', text);
}

//create the main window and check for any updates
app.on('ready', function()  {
    createWindow();

    //if for some reason window didn't launch
    app.on('activate', () => {
        if (BrowserWindow.getAllWindows().length === 0) {
        createWindow();
        }
    })
    autoUpdater.checkForUpdates();
});

autoUpdater.on('checking-for-update', () => {
    sendStatusToWindow('Checking for update...');
});

autoUpdater.on('update-available', (info) => {
    sendStatusToWindow('Update available.');
});

autoUpdater.on('update-not-available', (info) => {
    sendStatusToWindow('Update not available.');
});

autoUpdater.on('error', (err) => {
    // sendStatusToWindow('Error in auto-updater. ' + err);
});

autoUpdater.on('download-progress', (progressObj) => {
    sendStatusToWindow('Downloading new update...');
})

autoUpdater.on('update-downloaded', (info) => {
  autoUpdater.quitAndInstall();  
})