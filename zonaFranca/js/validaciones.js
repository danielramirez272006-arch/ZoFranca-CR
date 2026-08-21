export const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
export const CONTRASENA_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/

export function validarCorreoValor(valor) {
  const limpio = valor.trim()
  if (!limpio) return 'Ingresa tu correo electrónico'
  if (!EMAIL_REGEX.test(limpio)) return 'El formato del correo no es válido'
  return ''
}

export function validarContrasenaValor(valor) {
  if (!valor) return 'Ingresa una nueva contraseña'
  if (!CONTRASENA_REGEX.test(valor)) return 'Mínimo 8 caracteres, con mayúscula, minúscula y número'
  return ''
}

export function validarCampoObligatorioValor(valor, nombreCampo) {
  return valor ? '' : `Ingresa ${nombreCampo}`
}
