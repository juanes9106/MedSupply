const { app, BrowserWindow, ipcMain } = require('electron');
const { authenticateUser } = require('./database');

let mainWindow;

function createWindow() {
    mainWindow = new BrowserWindow({
        width: 800,
        height: 600,
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: false,
        },
    });

    mainWindow.loadFile('login.html');
}

app.whenReady().then(createWindow);

ipcMain.on('login', (event, { username, password }) => {
    authenticateUser(username, password, (err, isAuthenticated) => {
        if (err) {
            event.reply('login-reply', { success: false, message: 'Query failed' });
        } else if (isAuthenticated) {
            event.reply('login-reply', { success: true });
            mainWindow.loadFile('index.html');
        } else {
            event.reply('login-reply', { success: false, message: 'Invalid credentials' });
        }
    });
});
