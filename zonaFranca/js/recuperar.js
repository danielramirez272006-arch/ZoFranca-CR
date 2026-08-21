import { buscarPorCorreo, guardarNuevaContrasena } from './api.js'
import { validarCorreoValor, validarContrasenaValor } from './validaciones.js'

const RETORNO_LOGIN_MS = 2600

const formVerificarCorreo = document.getElementById('form-verificar-correo')
const formRestablecer = document.getElementById('form-restablecer')
const btnVerificar = document.getElementById('btn-verificar')
const btnRestablecer = document.getElementById('btn-restablecer')

const correoRecuperacion = document.getElementById('correo-recuperacion')
const errorCorreoRecuperacion = document.getElementById('error-correo-recuperacion')
const nuevaContrasena = document.getElementById('nueva-contrasena')
const errorNuevaContrasena = document.getElementById('error-nueva-contrasena')
const confirmarContrasena = document.getElementById('confirmar-contrasena')
const errorConfirmarContrasena = document.getElementById('error-confirmar-contrasena')

const recuperacionAviso = document.getElementById('recuperacion-aviso')
const recuperacionExito = document.getElementById('recuperacion-exito')
const recuperacionError = document.getElementById('recuperacion-error')

let usuarioRecuperado = null
let retornoPendiente = null

const camposRecuperacion = [
  { input: correoRecuperacion, small: errorCorreoRecuperacion },
  { input: nuevaContrasena, small: errorNuevaContrasena },
  { input: confirmarContrasena, small: errorConfirmarContrasena },
]

function cancelarRetornoAutomatico() {
  clearTimeout(retornoPendiente)
  retornoPendiente = null
}

function setBotonCargando(boton, cargando) {
  boton.disabled = cargando
  const texto = boton.querySelector('.btn-text')
  const spinner = boton.querySelector('.btn-spinner')
  if (texto) texto.hidden = cargando
  if (spinner) spinner.hidden = !cargando
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

function mostrarMensaje(elemento, mensaje) {
  ocultarMensajesRecuperacion()
  elemento.textContent = mensaje
  elemento.hidden = false

  if (elemento === recuperacionError) recuperacionError.focus()
}

function ocultarMensajesRecuperacion() {
  ;[recuperacionAviso, recuperacionExito, recuperacionError].forEach(el => {
    el.hidden = true
    el.textContent = ''
  })
}

function reiniciarRecuperacion() {
  cancelarRetornoAutomatico()
  usuarioRecuperado = null
  formVerificarCorreo.reset()
  formRestablecer.reset()
  formVerificarCorreo.hidden = false
  formRestablecer.hidden = true
  camposRecuperacion.forEach(({ input, small }) => limpiarMarcaCampo(input, small))
  ocultarMensajesRecuperacion()
}

camposRecuperacion.forEach(({ input, small }) => {
  input.addEventListener('input', () => limpiarMarcaCampo(input, small))
})

formVerificarCorreo.addEventListener('submit', async (e) => {
  e.preventDefault()
  ocultarMensajesRecuperacion()

  const mensajeValidacion = validarCorreoValor(correoRecuperacion.value)
  if (mensajeValidacion) {
    marcarErrorCampo(correoRecuperacion, errorCorreoRecuperacion, mensajeValidacion)
    correoRecuperacion.focus()
    return
  }

  setBotonCargando(btnVerificar, true)

  try {
    const encontrado = await buscarPorCorreo(correoRecuperacion.value.trim())

    if (!encontrado) {
      mostrarMensaje(recuperacionError, 'Este correo no está registrado.')
      return
    }

    usuarioRecuperado = encontrado
    formVerificarCorreo.hidden = true
    formRestablecer.hidden = false
    mostrarMensaje(recuperacionAviso, 'Correo verificado. Define tu nueva contraseña para continuar.')
    nuevaContrasena.focus()
  } catch (error) {
    mostrarMensaje(recuperacionError, error.message || 'Error inesperado. Intenta de nuevo.')
  } finally {
    setBotonCargando(btnVerificar, false)
  }
})

formRestablecer.addEventListener('submit', async (e) => {
  e.preventDefault()
  ocultarMensajesRecuperacion()

  const mensajeClave = validarContrasenaValor(nuevaContrasena.value)
  if (mensajeClave) {
    marcarErrorCampo(nuevaContrasena, errorNuevaContrasena, mensajeClave)
    nuevaContrasena.focus()
    return
  }

  if (confirmarContrasena.value !== nuevaContrasena.value) {
    marcarErrorCampo(confirmarContrasena, errorConfirmarContrasena, 'Las contraseñas no coinciden')
    confirmarContrasena.focus()
    return
  }

  setBotonCargando(btnRestablecer, true)

  try {
    await guardarNuevaContrasena(usuarioRecuperado.id, nuevaContrasena.value)

    formRestablecer.reset()
    mostrarMensaje(recuperacionExito, 'Contraseña actualizada correctamente. Redirigiendo al inicio de sesión...')

    retornoPendiente = setTimeout(() => {
      window.location.href = 'login.html'
    }, RETORNO_LOGIN_MS)
  } catch (error) {
    mostrarMensaje(recuperacionError, error.message || 'No se pudo actualizar la contraseña.')
  } finally {
    setBotonCargando(btnRestablecer, false)
  }
})

correoRecuperacion.focus()
