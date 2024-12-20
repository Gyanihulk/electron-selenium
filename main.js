const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('node:path');
const { runSeleniumTest, performTask } = require('./selenium-test');

const createWindow = () => {
  const mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true, // Ensures context isolation
      enableRemoteModule: false
    }
  });

  mainWindow.loadFile('index.html');
  mainWindow.webContents.openDevTools();
};

app.whenReady().then(() => {
  createWindow();
  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
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

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});