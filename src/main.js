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
  const path = require('path')
  win.loadFile(path.join(__dirname, 'app/index.html'))
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

const { autoUpdater } = require("electron-updater");

//currently in development
autoUpdater.channel = 'alpha';

//send any info on updates to main window 
function sendUpdateStatusToWindow(text) {
    win.webContents.send('update-info', text);
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
    sendUpdateStatusToWindow('checking for update...');
});

autoUpdater.on('update-available', (info) => {
    sendUpdateStatusToWindow('update available.');
});

autoUpdater.on('update-not-available', (info) => {
    //if theres no update then we're on the latest version
    //temporary way to send latest version. Might want more stable way in future
    sendUpdateStatusToWindow(`${app.getVersion()}`);
});

autoUpdater.on('error', (err) => {
    sendUpdateStatusToWindow('error in auto-updater. ');
    console.log(err);
});

autoUpdater.on('download-progress', (progressObj) => {
    sendUpdateStatusToWindow('downloading new update...');
})

autoUpdater.on('update-downloaded', (info) => {
  autoUpdater.quitAndInstall();  
})