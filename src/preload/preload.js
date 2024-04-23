const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
    toggleTheme: () => ipcRenderer.send('toggle-theme'),
    fetchData: () => ipcRenderer.send('fetch-data'),
    insertData: (tableName, data) => ipcRenderer.send('insert-data', { tableName, data }),
    onDataFetched: (callback) => ipcRenderer.on('data-fetched', (event, ...args) => callback(...args))
});