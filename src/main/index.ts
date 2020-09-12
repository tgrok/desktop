import { app, BrowserWindow } from "electron";
import * as path from "path";
import Bridge from './bridge'
import tgrok from "./tgrok";
import {event as tgrokEvent} from "tgrok";

const isDevelopment = process.env.NODE_ENV !== 'production'

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let win: any

function createWindow() {
  if (win) {
    return;
  }
  // Create the browser window.
  win = new BrowserWindow({
    width: 1024,
    height: 768,
    minWidth: 375,
    minHeight: 667,
    webPreferences: {
      // Use pluginOptions.nodeIntegration, leave this alone
      // See nklayman.github.io/vue-cli-plugin-electron-builder/guide/security.html#node-integration for more info
      // nodeIntegration: true,
      preload: path.join(__dirname, "./preload.js"),
    }
  });

  (new Bridge()).install()

  // and load the index.html of the app.
  win.loadFile(path.join(__dirname, "www/index.html"))

  // uncomment this if you need to debug tgrok-gui
  // win.loadURL("http://localhost:8080/")

  // Open the DevTools.
  if (isDevelopment) {
    win.webContents.openDevTools()
  }

  win.on('closed', () => {
    win = null
  })
}

tgrokEvent.on("info", (evt: any) => {
  if (!win) {
    return;
  }
  win.webContents.send("tgrok", evt)
})

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});

app.on('activate', () => {
  // On macOS it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (win === null) {
    createWindow()
  }
})

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', async () => {
  tgrok.debug = true;
  tgrok.start([])
  createWindow()
})

// Exit cleanly on request from parent process in development mode.
if (isDevelopment) {
  if (process.platform === 'win32') {
    process.on('message', (data) => {
      if (data === 'graceful-exit') {
        app.quit()
      }
    })
  } else {
    process.on('SIGTERM', () => {
      app.quit()
    })
  }
}