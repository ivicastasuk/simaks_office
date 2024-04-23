const { app, BrowserWindow, ipcMain } = require('electron');
const { join } = require('path');
const { fetchData, insertData } = require('./db/database.js');
const { toggleTheme } = require('./dom/dom.js');

function createWindow() {
    const win = new BrowserWindow({
        width: 800,
        height: 600,
        webPreferences: {
            preload: join(__dirname, '../preload/preload.js'),
            contextIsolation: true,
            nodeIntegration: false
        }
    });
    win.loadFile('./src/renderer/index.html');
}

app.whenReady().then(createWindow);

ipcMain.on('toggle-theme', (event) => {
    event.reply('theme-toggled');
});

ipcMain.on('fetch-data', async (event) => {
    try {
        const data = await fetchData();
        event.reply('data-fetched', data);
    } catch (error) {
        console.error('Error fetching data:', error);
    }
});

ipcMain.on('insert-data', async (event, { tableName, data }) => {
    try {
        const result = await insertData(tableName, data);
        event.reply('data-inserted', result);
    } catch (error) {
        console.error('Error inserting data:', error);
        event.reply('insert-error', error.message);
    }
});
