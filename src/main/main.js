require('dotenv').config();
const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('node:path');
const { performTask } = require('./selenium');
require('./ipcHandlers');


const createWindow = () => {
  const mainWindow = new BrowserWindow({
    width: 245,
    height: 245,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true,
    },
  });

  // Load the React app served by the React dev server during development
  if (process.env.NODE_ENV === 'development') {
    console.log("development mode")
    mainWindow.loadURL('http://localhost:3000');
  } else {
    // Load the built React app for production
    mainWindow.loadFile(path.join(__dirname, '../../public/index.html'));
  }

  // mainWindow.webContents.openDevTools();
};

app.whenReady().then(() => {
  createWindow();
  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});



app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});




// ipcMain.on('send-connection-request', async (event) => {
//   console.log('IPC message received: send-connection-request');
//   try {
//     performTask("connect");

//   } catch (error) {
//     console.error('Seleniumfailed:', error);
//   }
// });