const { ipcMain } = require('electron');
const { performTask } = require('./selenium');

// Define IPC handlers
ipcMain.on('send-connection-request', async (event) => {
    console.log('IPC message received: send-connection-request');
    try {
        await performTask("connect");
        performTask("followUp");
        performTask("catchUp");
        event.reply('send-connection-request-success', 'Task completed successfully.');
    } catch (error) {
        console.error('Selenium failed:', error);
        event.reply('send-connection-request-failure', error.message);
    }
});

ipcMain.on('follow-up-new-connection', async (event) => {
    console.log('IPC message received: send-connection-request');
    try {
        performTask("followUp");
        event.reply('follow-up-new-connection-request-success', 'Task completed successfully.');
    } catch (error) {
        console.error('Selenium failed:', error);
        event.reply('follow-up-new-connection-request-failure', error.message);
    }
});

ipcMain.on('catch-up-connections', async (event) => {
    console.log('IPC message received: catch-up-connections');
    try {
        performTask("catchUp");
        event.reply('catch-up-connections-request-success', 'Task completed successfully.');
    } catch (error) {
        console.error('Selenium failed:', error);
        event.reply('catch-up-connections-request-failure', error.message);
    }
});

ipcMain.on('withdraw-connections', async (event) => {
    console.log('IPC message received: withdraw-connections');
    try {
        performTask("withdraw");
        event.reply('catch-up-connections-request-success', 'Task completed successfully.');
    } catch (error) {
        console.error('Selenium failed:', error);
        event.reply('catch-up-connections-request-failure', error.message);
    }
});

ipcMain.on('fetch-posts', async (event) => {
    console.log('IPC message received: withdraw-connections');
    try {
        performTask("fetchPosts");
        event.reply('catch-up-connections-request-success', 'Task completed successfully.');
    } catch (error) {
        console.error('Selenium failed:', error);
        event.reply('catch-up-connections-request-failure', error.message);
    }
})
module.exports = {}; 
