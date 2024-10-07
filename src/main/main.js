const { app, BrowserWindow, ipcMain } = require('electron');
const { join } = require('path');
const { fetchData, insertData, updateData } = require('./db/database.js');
const fs = require('fs');

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit();
    }
});

function createWindow() {
    console.log("Creating window...");

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
            nodeIntegration: false,
            webSecurity: true
        }
    });

    mainWindow.loadFile('./src/renderer/index.html');
    mainWindow.setMenu(null);
    mainWindow.webContents.openDevTools();
    mainWindow.maximize();

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

ipcMain.on('fetch-clients', async (event, { tableName, columns, condition }) => {
    try {
        const data = await fetchData(tableName, columns, condition);
        event.reply('clients-fetched', data);
    } catch (error) {
        console.error('Error fetching data:', error);
    }
});

ipcMain.on('fetch-user', async (event, { tableName, columns, condition }) => {
    try {
        const data = await fetchData(tableName, columns, condition);
        event.reply('user-fetched', data);
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

ipcMain.on('insert-client', async (event, { tableName, data }) => {
    try {
        const result = await insertData(tableName, data);
        event.reply('client-inserted', result);
    } catch (error) {
        console.error('Error inserting data:', error);
        event.reply('insert-error', error.message);
    }
});

ipcMain.on('update-user', async (event, { tableName, data, conditionString, conditionValues }) => {
    try {
        const result = await updateData(tableName, data, conditionString, conditionValues);
        event.reply('user-updated', result);
    } catch (error) {
        console.error('Error updating user:', error);
    }
});

ipcMain.on('update-company', async (event, { tableName, data, conditionString, conditionValues }) => {
    try {
        const result = await updateData(tableName, data, conditionString, conditionValues);
        event.reply('company-updated', result);
    } catch (error) {
        console.error('Error updating company data:', error);
    }
});

ipcMain.on('fetch-settings', async (event, companyId) => {
    try {
        // Korišćenje fetchData funkcije za dohvaćanje podataka iz tabele settings gde je company_id odgovarajući
        const condition = `WHERE id = ${companyId}`;
        const data = await fetchData('settings', '*', condition);
        event.reply('settings-fetched', data);
    } catch (error) {
        console.error('Error fetching settings:', error);
    }
});

ipcMain.handle('save-image', async (event, fileName, buffer) => {
    const savePath = join(__dirname, '../renderer/img/products', fileName);
    console.log(savePath);
    try {
        fs.writeFileSync(savePath, Buffer.from(buffer));
        return { success: true, path: savePath };
    } catch (err) {
        console.error('Error saving image:', err);
        return { success: false, message: 'Failed to save image', error: err };
    }
});
