const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
  startSeleniumTest: () => ipcRenderer.send('start-selenium-test')
});