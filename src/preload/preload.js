const { contextBridge, ipcRenderer } = require('electron');
const Swal = require('sweetalert2');

contextBridge.exposeInMainWorld('electronAPI', {
    fetchData: (tableName, columns, condition) => ipcRenderer.send('fetch-data', { tableName, columns, condition }),
    insertData: (tableName, data) => ipcRenderer.send('insert-data', { tableName, data }),
    onDataFetched: (callback) => ipcRenderer.on('data-fetched', (event, ...args) => callback(...args)),
    closeWindow: () => ipcRenderer.send('close-window'),
    minimizeWindow: () => ipcRenderer.send('minimize-window'),
    maximizeWindow: () => ipcRenderer.send('maximize-window'),
    unmaximizeWindow: () => ipcRenderer.send('unmaximize-window'),
    saveImage: (filePath, buffer) => ipcRenderer.invoke('save-image', filePath, buffer)
});

// contextBridge.exposeInMainWorld('sweetAlert', {
//     fire: (options) => Swal.fire(options),
//     toast: (options) => {
//         const Toast = Swal.mixin({
//             toast: true,
//             position: 'top-end',
//             showConfirmButton: false,
//             timer: 3000,
//             timerProgressBar: true,
//             didOpen: (toast) => {
//             toast.addEventListener('mouseenter', Swal.stopTimer)
//             toast.addEventListener('mouseleave', Swal.resumeTimer)
//             }
//         });
//         return Toast.fire(options);
//     }
// });