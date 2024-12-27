const { contextBridge, ipcRenderer } = require('electron');

console.log('Preload script loaded successfully!');

contextBridge.exposeInMainWorld('electronAPI', {
    getDataFromDB: (tableName, columns, condition) => ipcRenderer.send('get-data-from-db', { tableName, columns, condition }),
    onDataRetrievedFromDB: (callback) => ipcRenderer.on('data-retrieved-from-db', (event, ...args) => callback(...args)),
    offDataRetrievedFromDB: (callback) => ipcRenderer.removeListener('data-retrieved-from-db', callback),
    // Podaci o artiklima
    fetchData: (tableName, columns, condition) => ipcRenderer.send('fetch-data', { tableName, columns, condition }),
    onDataFetched: (callback) => ipcRenderer.on('data-fetched', (event, ...args) => callback(...args)),
    insertData: (tableName, data) => ipcRenderer.send('insert-data', { tableName, data }),
    updateData: (updateProduct) => ipcRenderer.send('update-data', updateProduct),
    onDataUpdated: (callback) => ipcRenderer.on('data-updated', (event, ...args) => callback(...args)),
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
    // Brisanje podataka
    deleteData: (tableName, conditionString, conditionValues) => ipcRenderer.send('delete-data', { tableName, conditionString, conditionValues }),
    onDataDeleted: (callback) => ipcRenderer.on('data-deleted', (event, result) => callback(result)),
    // Ostalo
    saveImage: (filePath, buffer) => ipcRenderer.invoke('save-image', filePath, buffer),
    closeWindow: () => ipcRenderer.send('close-window'),
    minimizeWindow: () => ipcRenderer.send('minimize-window'),
    maximizeWindow: () => ipcRenderer.send('maximize-window'),
    unmaximizeWindow: () => ipcRenderer.send('unmaximize-window'),
    createPdf: (htmlContent) => ipcRenderer.send('create-pdf', htmlContent),
    onPdfCreated: (callback) => ipcRenderer.on('pdf-created', (event, response) => callback(event, response)),
    // getNextOfferNumber: () => ipcRenderer.invoke('get-next-offer-number'),
    getPotentialOfferNumber: () => ipcRenderer.invoke('get-potential-offer-number'),
    reserveOfferNumber: (expectedNumber) => ipcRenderer.invoke('reserve-offer-number', expectedNumber),
    saveOffer: (offerData) => ipcRenderer.invoke('save-offer', offerData),
    // Provera duplikata
    checkForDuplicateProduct: (code, model) => ipcRenderer.send('checkForDuplicateProduct', code, model),
    onDuplicateCheckResult: (callback) => ipcRenderer.once('duplicateCheckResult', (event, result) => callback(result)),
    updateStatus: (updateStatus) => ipcRenderer.send('update-status', updateStatus),
    onStatusUpdated: (callback) => ipcRenderer.on('status-updated', (event, ...args) => callback(...args)),

});
