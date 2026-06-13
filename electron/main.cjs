// electron/main.cjs (dùng cho development)
const { app, BrowserWindow } = require('electron');

let mainWindow;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1400,
    height: 900,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
    },
  });

  // Tải từ React dev server
  mainWindow.loadURL('http://localhost:5173');

  mainWindow.webContents.openDevTools();
}

app.whenReady().then(createWindow);