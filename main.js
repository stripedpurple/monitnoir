// Modules to control application life and create native browser window
const {electron, app, BrowserWindow, globalShortcut} = require('electron')
const brightness = require('brightness')

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let mainWindow
// let screen
let brightnessLevel = brightness.get();

function createWindow(opts) {

    opts.webPreferences = {
        nodeIntegration: true
    }
    opts.frame = false
    opts.alwayOnTop = true
    opts.title = 'MonitNoir'

    // Create the browser window.
    mainWindow = new BrowserWindow(opts)

    // and load the index.html of the app.
    mainWindow.loadFile('index.html')

    // Open the DevTools.
    // mainWindow.webContents.openDevTools()

    // Emitted when the window is closed.
    mainWindow.on('closed', function () {
        // Dereference the window object, usually you would store windows
        // in an array if your app supports multi windows, this is the time
        // when you should delete the corresponding element.
        mainWindow = null
    })

    mainWindow.on('leave-full-screen', () => {
        mainWindow.hide()
    })

    mainWindow.hide()
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', () => {
    const electron = require('electron')

    var electronScreen = electron.screen;
    var displays = electronScreen.getAllDisplays();
    // Register a global shortcut listener.
    const ret = globalShortcut.register('Command+Control+esc', () => {
        // console.log(`visible:\t${mainWindow.isFullScreen()}`)
        brightness.get().then(level => {
            if (level !== 0 || !brightnessLevel) {
                brightnessLevel = level
                brightness.set(0).then(() => {
                    mainWindow.setFullScreen(!mainWindow.isFullScreen())
                })
                return
            }
            brightness.set(brightnessLevel).then(() => {
                mainWindow.setFullScreen(!mainWindow.isFullScreen())
            })
        })

    })

    if (!ret) {

        console.log('registration failed')
    }
    // Check whether a shortcut is registered.
    console.log('isRegistered', globalShortcut.isRegistered('Command+Control+esc'))

    for (var i in displays) {
        if (displays[i].bounds.x != 0 || displays[i].bounds.y != 0) {
            createWindow({
                x: displays[i].bounds.x,
                y: displays[i].bounds.y,
                width: 100,
                height: 100
            });
            break;
        }
    }
})

// Quit when all windows are closed.
app.on('window-all-closed', function () {
    // On macOS it is common for applications and their menu bar
    // to stay active until the user quits explicitly with Cmd + Q
    if (process.platform !== 'darwin') app.quit()
})

app.on('activate', function () {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (mainWindow === null) createWindow()
})

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.


// const electron = require('electron');
// const app = electron.app;
// const BrowserWindow = electron.BrowserWindow;
//
// var mainWindow;
//
// app.on('ready', function() {
//     var electronScreen = electron.screen;
//     var displays = electronScreen.getAllDisplays();
//     var externalDisplay = null;
//     for (var i in displays) {
//         if (displays[i].bounds.x != 0 || displays[i].bounds.y != 0) {
//             externalDisplay = displays[i];
//             break;
//         }
//     }
//
//     if (externalDisplay) {
//         mainWindow = new BrowserWindow({
//             x: externalDisplay.bounds.x + 50,
//             y: externalDisplay.bounds.y + 50
//         });
//     }
// });
