const { ipcRenderer } = require('electron');

document.getElementById('loginForm').addEventListener('submit', (event) => {
    event.preventDefault();
    const username = document.getElementById('username').value;
    const password = document.getElementById('pass').value;

    ipcRenderer.send('login', { username, password });

    ipcRenderer.on('login-reply', (event, result) => {
        if (result.success) {
            alert('Login successful!');
            // Redirigir a la página principal o realizar otra acción
            mainWindow.loadFile('index.html');  
        } else {
            alert('Login failed: ' + result.message);
        }
    });
});
