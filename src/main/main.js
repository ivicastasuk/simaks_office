const { app, BrowserWindow, Menu } = require('electron')

let win; // Premesti `win` da bude dostupna globalno

function createWindow () {
  // Kreiraj prozor browsera.
  win = new BrowserWindow({
    title: 'Simaks Office',
    minWidth: 800,
    minHeight: 600,
    frame: true,
    webPreferences: {
      nodeIntegration: true
    }
  })

  // i učitaj index.html fajl u aplikaciji.
  win.loadFile('./src/renderer/index.html')

  // Postavljanje kontekstnog menija unutar događaja ready-to-show
  win.on('ready-to-show', () => {
    const contextMenu = Menu.buildFromTemplate([
      { label: 'Undo', role: 'undo' },
      { label: 'Redo', role: 'redo' },
      { type: 'separator' },
      { label: 'Cut', role: 'cut' },
      { label: 'Copy', role: 'copy' },
      { label: 'Paste', role: 'paste' }
    ]);

    win.webContents.on('context-menu', (e, params) => {
      contextMenu.popup(win, params.x, params.y);
    });
  });
}

app.on('ready', createWindow);

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit();
    }
});

app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
        createWindow();
    }
});

const template = [
    {
        label: 'Datoteka',
        submenu: [
            { label: 'Novo', click() { console.log('Novo kliknuto'); } },
            { label: 'Otvori', click() { console.log('Otvori kliknuto'); } },
            { type: 'separator' },
            { label: 'Izađi', role: 'quit' }
        ]
    },
    {
        label: 'Uredi',
        submenu: [
            { label: 'Izreži', role: 'cut' },
            { label: 'Kopiraj', role: 'copy' },
            { label: 'Zalepi', role: 'paste' }
        ]
    },
    {
        label: 'Pomoć',
        submenu: [
            { label: 'O aplikaciji', click() { /* prikaži informacije o aplikaciji */ } }
        ]
    }
];

const menu = Menu.buildFromTemplate(template);
Menu.setApplicationMenu(menu);
