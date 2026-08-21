import { guardarSesion, leerSesion } from './sesion.js'
import { autenticar } from './api.js'
import { validarCorreoValor, validarCampoObligatorioValor } from './validaciones.js'

const MAX_INTENTOS = 5
const BLOQUEO_SEGUNDOS = 30
const ROLES_PERMITIDOS = ['Administrador']
const INTENTOS_KEY = 'login-intentos-fallidos'
const BLOQUEO_KEY = 'login-bloqueo-hasta'

const form = document.getElementById('login-form')
const errorDiv = document.getElementById('login-error')
const btnLogin = document.getElementById('btn-login')
const btnText = btnLogin.querySelector('.btn-text')
const togglePassword = document.querySelector('.toggle-password')
const recordarme = document.getElementById('recordarme')
const capsAviso = document.getElementById('caps-aviso')

const campos = {
  correo: {
    input: document.getElementById('correo'),
    error: document.getElementById('error-correo'),
    validar() {
      return validarCorreoValor(this.input.value)
    },
  },
  contrasena: {
    input: document.getElementById('contrasena'),
    error: document.getElementById('error-contrasena'),
    validar() {
      return validarCampoObligatorioValor(this.input.value, 'tu contraseña')
    },
  },
}

let intentosFallidos = Number(sessionStorage.getItem(INTENTOS_KEY)) || 0
let bloqueoHasta = Number(sessionStorage.getItem(BLOQUEO_KEY)) || 0
let cuentaRegresiva = null

if (leerSesion()) {
  window.location.replace('index.html')
}

function guardarEstadoBloqueo() {
  sessionStorage.setItem(INTENTOS_KEY, String(intentosFallidos))
  sessionStorage.setItem(BLOQUEO_KEY, String(bloqueoHasta))
}

function setBotonCargando(boton, cargando) {
  boton.disabled = cargando
  const texto = boton.querySelector('.btn-text')
  const spinner = boton.querySelector('.btn-spinner')
  if (texto) texto.hidden = cargando
  if (spinner) spinner.hidden = !cargando
}

function setLoading(loading) {
  setBotonCargando(btnLogin, loading || estaBloqueado())
}

function setErrorGeneral(mensaje) {
  errorDiv.textContent = mensaje
  errorDiv.hidden = false
}

function mostrarErrorGeneral(mensaje) {
  setErrorGeneral(mensaje)
  errorDiv.focus()
}

function ocultarErrorGeneral() {
  errorDiv.hidden = true
  errorDiv.textContent = ''
}

function marcarErrorCampo(input, small, mensaje) {
  small.textContent = mensaje
  small.hidden = false
  input.setAttribute('aria-invalid', 'true')
}

function limpiarMarcaCampo(input, small) {
  small.textContent = ''
  small.hidden = true
  input.removeAttribute('aria-invalid')
}

function mostrarErrorCampo(nombre, mensaje) {
  const campo = campos[nombre]
  marcarErrorCampo(campo.input, campo.error, mensaje)
}

function limpiarErrorCampo(nombre) {
  const campo = campos[nombre]
  limpiarMarcaCampo(campo.input, campo.error)
}

function validarFormulario() {
  let primerInvalido = null

  for (const nombre of Object.keys(campos)) {
    const mensaje = campos[nombre].validar()
    if (mensaje) {
      mostrarErrorCampo(nombre, mensaje)
      primerInvalido ??= campos[nombre].input
    } else {
      limpiarErrorCampo(nombre)
    }
  }

  primerInvalido?.focus()
  return !primerInvalido
}

function estaBloqueado() {
  return Date.now() < bloqueoHasta
}

function iniciarBloqueo() {
  intentosFallidos = 0
  bloqueoHasta = Date.now() + BLOQUEO_SEGUNDOS * 1000
  guardarEstadoBloqueo()
  setLoading(false)

  cuentaRegresiva = setInterval(actualizarCuentaRegresiva, 1000)
  actualizarCuentaRegresiva()
}

function actualizarCuentaRegresiva() {
  const restante = Math.ceil((bloqueoHasta - Date.now()) / 1000)

  if (restante <= 0) {
    clearInterval(cuentaRegresiva)
    guardarEstadoBloqueo()
    btnLogin.disabled = false
    btnText.textContent = 'Iniciar sesión'
    ocultarErrorGeneral()
    return
  }

  btnText.textContent = `Bloqueado (${restante}s)`
  setErrorGeneral(`Demasiados intentos fallidos. Espera ${restante} segundos para volver a intentar.`)
}

form.addEventListener('submit', async (e) => {
  e.preventDefault()

  if (estaBloqueado()) return
  ocultarErrorGeneral()

  if (!validarFormulario()) return

  const correo = campos.correo.input.value.trim()
  const contrasena = campos.contrasena.input.value

  setLoading(true)

  try {
    const usuario = await autenticar(correo, contrasena)

    if (!usuario) {
      intentosFallidos += 1
      guardarEstadoBloqueo()
      if (intentosFallidos >= MAX_INTENTOS) {
        iniciarBloqueo()
        return
      }
      const restantes = MAX_INTENTOS - intentosFallidos
      mostrarErrorGeneral(`Correo o contraseña incorrectos. Te quedan ${restantes} intento(s).`)
      return
    }

    if (!ROLES_PERMITIDOS.includes(usuario.rol)) {
      mostrarErrorGeneral('No tiene permisos para acceder. Solo administradores.')
      return
    }

    sessionStorage.removeItem(INTENTOS_KEY)
    sessionStorage.removeItem(BLOQUEO_KEY)
    guardarSesion(
      { id: usuario.id, nombre: usuario.nombre, correo: usuario.correo, rol: usuario.rol },
      recordarme.checked,
    )
    window.location.href = 'index.html'
  } catch (error) {
    mostrarErrorGeneral(error.message || 'Error inesperado. Intenta de nuevo.')
  } finally {
    if (!estaBloqueado()) setLoading(false)
  }
})

Object.entries(campos).forEach(([nombre, campo]) => {
  campo.input.addEventListener('blur', () => {
    if (campo.input.value) {
      const mensaje = campo.validar()
      if (mensaje) {
        mostrarErrorCampo(nombre, mensaje)
      } else {
        limpiarErrorCampo(nombre)
      }
    }
  })

  campo.input.addEventListener('input', () => limpiarErrorCampo(nombre))
})

togglePassword.addEventListener('click', () => {
  const input = campos.contrasena.input
  const esPassword = input.type === 'password'

  input.type = esPassword ? 'text' : 'password'
  togglePassword.classList.toggle('visible', esPassword)
  togglePassword.setAttribute('aria-label', esPassword ? 'Ocultar contraseña' : 'Mostrar contraseña')
  togglePassword.setAttribute('aria-pressed', String(esPassword))
  input.focus()
})

campos.contrasena.input.addEventListener('keyup', (e) => {
  capsAviso.hidden = !e.getModifierState('CapsLock')
})

campos.contrasena.input.addEventListener('blur', () => {
  capsAviso.hidden = true
})
