const { contextBridge, ipcRenderer } = require('electron');

console.log('Preload script loaded successfully!');

contextBridge.exposeInMainWorld('electronAPI', {
    fetchData: (tableName, columns, condition) => ipcRenderer.send('fetch-data', { tableName, columns, condition }),
    fetchClients: (tableName, columns, condition) => ipcRenderer.send('fetch-clients', { tableName, columns, condition }),
    insertData: (tableName, data) => ipcRenderer.send('insert-data', { tableName, data }),
    insertClient: (tableName, data) => ipcRenderer.send('insert-client', { tableName, data }),
    fetchUser: (tableName, columns, condition) => ipcRenderer.send('fetch-user', { tableName, columns, condition }),
    updateUser: (tableName, data) => ipcRenderer.send('update-user', { tableName, data }),
    onDataFetched: (callback) => ipcRenderer.on('data-fetched', (event, ...args) => callback(...args)),
    onClientsFetched: (callback) => ipcRenderer.on('clients-fetched', (event, ...args) => callback(...args)),
    onUserFetched: (callback) => ipcRenderer.on('user-fetched', (event, ...args) => callback(...args)),
    closeWindow: () => ipcRenderer.send('close-window'),
    minimizeWindow: () => ipcRenderer.send('minimize-window'),
    maximizeWindow: () => ipcRenderer.send('maximize-window'),
    unmaximizeWindow: () => ipcRenderer.send('unmaximize-window'),
    saveImage: (filePath, buffer) => ipcRenderer.invoke('save-image', filePath, buffer),
});
