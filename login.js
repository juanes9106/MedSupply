const { ipcRenderer } = require('electron');

document.getElementById('loginForm').addEventListener('submit', (event) => {
    event.preventDefault();
    const username = document.getElementById('username').value;
    const password = document.getElementById('pass').value;

    ipcRenderer.send('login', { username, password });

    ipcRenderer.once('login-reply', (event, result) => {
        if (result.success) {
            mainWindow.loadFile('index.html');  
        } else {
            alert('Login failed: ' + result.message);
        }
    });
});
