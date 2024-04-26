const { app, BrowserWindow, ipcMain } = require('electron');
const { join } = require('path');
const { fetchData, insertData } = require('./db/database.js');
// const { toggleTheme } = require('./dom/dom.js');

function createWindow() {
    const mainWindow = new BrowserWindow({
        minWidth: 1024,
        width: 1024,
        minHeight: 768,
        height: 768,
        frame: false,
        transparent: false,
        icon: join(__dirname, '../renderer/img/serbia.png'),
        webPreferences: {
            preload: join(__dirname, '../preload/preload.js'),
            contextIsolation: true,
            nodeIntegration: false
        }
    });
    mainWindow.loadFile('./src/renderer/index.html');
    mainWindow.setMenu(null);

    ipcMain.on('close-window', () => {
        mainWindow.close();
    });
    ipcMain.on('minimize-window', () => {
        mainWindow.minimize();
    });
    ipcMain.on('maximize-window', () => {
        mainWindow.maximize();
    });
    ipcMain.on('unmaximize-window', () => {
        mainWindow.unmaximize();
    });

}

app.whenReady().then(createWindow);

ipcMain.on('fetch-data', async (event, { tableName, columns, condition }) => {
    try {
        const data = await fetchData(tableName, columns, condition);
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
