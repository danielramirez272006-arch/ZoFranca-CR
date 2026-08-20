const API_URL = 'http://localhost:3000/usuarios';

const form = document.getElementById('login-form');
const errorDiv = document.getElementById('login-error');
const btnLogin = document.getElementById('btn-login');
const btnText = btnLogin.querySelector('.btn-text');
const btnSpinner = btnLogin.querySelector('.btn-spinner');
const togglePassword = document.querySelector('.toggle-password');
const credButtons = document.querySelectorAll('.cred-btn');

const ROLES_PERMITIDOS = ['Administrador'];

function setLoading(loading) {
  btnLogin.disabled = loading;
  btnText.hidden = loading;
  btnSpinner.hidden = !loading;
}

function showError(message) {
  errorDiv.textContent = message;
  errorDiv.hidden = false;
}

function hideError() {
  errorDiv.hidden = true;
  errorDiv.textContent = '';
}

async function autenticar(correo, contrasena) {
  const response = await fetch(`${API_URL}?correo=${encodeURIComponent(correo)}`);

  if (!response.ok) {
    throw new Error(`Error de red: ${response.status}`);
  }

  const usuarios = await response.json();
  const usuario = usuarios.find(u => u.contrasena === contrasena);

  if (!usuario) {
    throw new Error('Correo o contraseña incorrectos');
  }

  return usuario;
}

function guardarSesion(usuario) {
  sessionStorage.setItem('usuario', JSON.stringify({
    id: usuario.id,
    nombre: usuario.nombre,
    correo: usuario.correo,
    rol: usuario.rol
  }));
}

form.addEventListener('submit', async (e) => {
  e.preventDefault();
  hideError();

  const correo = document.getElementById('correo').value.trim();
  const contrasena = document.getElementById('contrasena').value;

  if (!correo || !contrasena) {
    showError('Complete todos los campos');
    return;
  }

  setLoading(true);

  try {
    const usuario = await autenticar(correo, contrasena);

    if (!ROLES_PERMITIDOS.includes(usuario.rol)) {
      showError('No tiene permisos para acceder. Solo administradores.');
      return;
    }

    guardarSesion(usuario);
    window.location.href = 'index.html';
  } catch (error) {
    showError(error.message || 'Error al conectar con el servidor');
  } finally {
    setLoading(false);
  }
});

togglePassword.addEventListener('click', () => {
  const input = document.getElementById(togglePassword.dataset.target);
  const isPassword = input.type === 'password';

  input.type = isPassword ? 'text' : 'password';
  togglePassword.querySelector('.eye-open').hidden = isPassword;
  togglePassword.querySelector('.eye-closed').hidden = !isPassword;
  togglePassword.setAttribute('aria-label', isPassword ? 'Ocultar contraseña' : 'Mostrar contraseña');
});

credButtons.forEach(btn => {
  btn.addEventListener('click', () => {
    document.getElementById('correo').value = btn.dataset.email;
    document.getElementById('contrasena').value = btn.dataset.pass;
    hideError();
  });
});
