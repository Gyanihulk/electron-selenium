require('dotenv').config();
const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('node:path');
const { performTask } = require('./selenium');

const startSeleniumTest = () => {
  window.electron.ipcRenderer.send('start-selenium-test');
};

const createWindow = () => {
  const mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
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

  mainWindow.webContents.openDevTools();
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


ipcMain.on('start-selenium-test', async (event) => {
  console.log('IPC message received: Starting Selenium test...');
  try {
    await performTask();
    console.log('Selenium test completed.');
  } catch (error) {
    console.error('Selenium test failed:', error);
  }
});