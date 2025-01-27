const { ipcMain } = require('electron');
const { performTask } = require('./selenium');
const { performLeetcodeTask } = require('./selenium/leetcode');

// Define IPC handlers
ipcMain.on('send-connection-request', async (event) => {
    console.log('IPC message received: send-connection-request');
    try {
        await performTask("connect");
        await performTask("followUp");
        await performTask("catchUp");
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
ipcMain.on('notification', async (event) => {
    console.log('IPC message received: withdraw-connections');
    try {
        performTask("notification");
        event.reply('catch-up-connections-request-success', 'Task completed successfully.');
    } catch (error) {
        console.error('Selenium failed:', error);
        event.reply('catch-up-connections-request-failure', error.message);
    }
})
ipcMain.on('leetcode', async (event) => {
    console.log('IPC message received: withdraw-connections');
    try {
        performLeetcodeTask("notification");
        event.reply('catch-up-connections-request-success', 'Task completed successfully.');
    } catch (error) {
        console.error('Selenium failed:', error);
        event.reply('catch-up-connections-request-failure', error.message);
    }
})

ipcMain.on('messaging', async (event) => {
    console.log('IPC message received: withdraw-connections');
    try {
        performTask('messaging');
        event.reply('catch-up-connections-request-success', 'Task completed successfully.');
    } catch (error) {
        console.error('Selenium failed:', error);
        event.reply('catch-up-connections-request-failure', error.message);
    }
})

/**
 * Generic handler for IPC events.
 * @param {string} channel - The IPC channel to listen for.
 * @param {Function} task - The task function to execute when the event is received.
 */
function handleIpcEvent(channel, task) {
    ipcMain.on(channel, async (event, ...args) => {
        console.log(`IPC message received: ${channel}`);
        try {
            // Execute the provided task function
            performTask(task);
            // Send success reply to the renderer process
            event.reply(`${channel}-success`, result || 'Task completed successfully.');
        } catch (error) {
            console.error(`Error in channel ${channel}:`, error);
            // Send failure reply to the renderer process
            event.reply(`${channel}-failure`, error.message || 'An error occurred.');
        }
    });
}
module.exports = {handleIpcEvent}; 
