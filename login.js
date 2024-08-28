console.log('login');
const { ipcRenderer } = require('electron');

window.onload = function() {
  const email = document.getElementById("email");
  const password = document.getElementById("password");
  const btnlogin = document.getElementById("login");
  const btnCloseSesion = document.getElementById('btnCloseSesion'); // Botón de cerrar sesión

  // Manejo del clic en el botón de inicio de sesión
  btnlogin.onclick = function() {
    console.log('Login button clicked');
    const obj = { email: email.value, password: password.value };
    ipcRenderer.invoke('login', obj)
      .then(result => {
        console.log('Login result:', result);
        if (result === 'Login exitoso') {
          console.log('Login exitoso');
        } else {
          console.log('Login fallido');
        }
      })
      .catch(error => {
        console.error('Login error:', error);
      });
  };

  // Manejo del clic en el botón de cerrar sesión
  if (btnCloseSesion) {
    btnCloseSesion.onclick = function() {
      console.log('Cerrar sesión button clicked');
      ipcRenderer.send('close-session');
    };
  }
};
