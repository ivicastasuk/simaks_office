const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
    fetchData: (tableName, columns, condition) => ipcRenderer.send('fetch-data', { tableName, columns, condition }),
    insertData: (tableName, data) => ipcRenderer.send('insert-data', { tableName, data }),
    onDataFetched: (callback) => ipcRenderer.on('data-fetched', (event, ...args) => callback(...args)),
    closeWindow: () => ipcRenderer.send('close-window'),
    minimizeWindow: () => ipcRenderer.send('minimize-window'),
    maximizeWindow: () => ipcRenderer.send('maximize-window'),
    unmaximizeWindow: () => ipcRenderer.send('unmaximize-window')
});