const { contextBridge, ipcRenderer } = require('electron');

console.log('Preload script loaded successfully!');

contextBridge.exposeInMainWorld('electronAPI', {
    // Podaci o artiklima
    fetchData: (tableName, columns, condition) => ipcRenderer.send('fetch-data', { tableName, columns, condition }),
    onDataFetched: (callback) => ipcRenderer.on('data-fetched', (event, ...args) => callback(...args)),
    insertData: (tableName, data) => ipcRenderer.send('insert-data', { tableName, data }),
    // Podaci o klijentima
    fetchClients: (tableName, columns, condition) => ipcRenderer.send('fetch-clients', { tableName, columns, condition }),
    onClientsFetched: (callback) => ipcRenderer.on('clients-fetched', (event, ...args) => callback(...args)),
    insertClient: (tableName, data) => ipcRenderer.send('insert-client', { tableName, data }),
    // Podaci o korisnicima
    fetchUser: (tableName, columns, condition) => ipcRenderer.send('fetch-user', { tableName, columns, condition }),
    onUserFetched: (callback) => ipcRenderer.on('user-fetched', (event, ...args) => callback(...args)),
    updateUser: (updateInfo) => ipcRenderer.send('update-user', updateInfo),
    onUserUpdated: (callback) => ipcRenderer.on('user-updated', (event, result) => callback(result)),
    // Podesavanja
    fetchSettings: (companyId) => ipcRenderer.send('fetch-settings', companyId),
    onSettingsFetched: (callback) => ipcRenderer.on('settings-fetched', (event, data) => callback(data)),
    updateCompany: (updateDetails) => ipcRenderer.send('update-company', updateDetails),
    onCompanyUpdated: (callback) => ipcRenderer.on('company-updated', (event, result) => callback(result)),
    // Ostalo
    saveImage: (filePath, buffer) => ipcRenderer.invoke('save-image', filePath, buffer),
    closeWindow: () => ipcRenderer.send('close-window'),
    minimizeWindow: () => ipcRenderer.send('minimize-window'),
    maximizeWindow: () => ipcRenderer.send('maximize-window'),
    unmaximizeWindow: () => ipcRenderer.send('unmaximize-window'),
});
