const { app, BrowserWindow, ipcMain, Notification } = require('electron');
const path = require('path');
let db = require('./database');

let win; // La ventana principal
let winlogin; // La ventana de inicio de sesión

function createWindow() {
  win = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
    }
  });

  win.loadFile('index.html');
}

function createLoginWindow() {
  winlogin = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
    }
  });

  winlogin.loadFile('login.html');
}

app.whenReady().then(createLoginWindow);

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

function validatelogin(obj) {
  return new Promise((resolve, reject) => {
    const { email, password } = obj;
    const sql = "SELECT * FROM user WHERE email=? AND password=?";
    db.query(sql, [email, password], (error, results, fields) => {
      if (error) {
        console.error(error);
        reject('Error en la consulta de la base de datos');
        return;
      }

      if (results.length > 0) {
        createWindow();
        if (winlogin) {
          winlogin.close();
        }
        resolve('Login exitoso');
      } else {
        new Notification({
          title: "Login",
          body: 'Email o password equivocado'
        }).show();
        resolve('Login fallido');
      }
    });
  });
}

// Maneja el evento IPC 'login'
ipcMain.handle('login', async (event, obj) => {
  try {
    const result = await validatelogin(obj);
    return result;
  } catch (error) {
    console.error('Error en el proceso de login:', error);
    return 'Error en el proceso de login';
  }
});
// Maneja el evento IPC 'close-session'
ipcMain.on('close-session', (event) => {
  console.log('Cierre de sesión');
  // Cierra la ventana principal si está abierta
  if (win) {
    win.close();
    win = null; // Asegúrate de que la referencia sea nula
  }

  // Abre la ventana de inicio de sesión nuevamente
  createLoginWindow();
});