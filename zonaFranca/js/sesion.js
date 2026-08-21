const SESION_KEY = 'usuario'

export function guardarSesion(usuario, persistente = false) {
  const storage = persistente ? localStorage : sessionStorage
  storage.setItem(SESION_KEY, JSON.stringify(usuario))
}

export function leerSesion() {
  const datos = sessionStorage.getItem(SESION_KEY) ?? localStorage.getItem(SESION_KEY)
  try {
    return datos ? JSON.parse(datos) : null
  } catch {
    cerrarSesion()
    return null
  }
}

export function cerrarSesion() {
  sessionStorage.removeItem(SESION_KEY)
  localStorage.removeItem(SESION_KEY)
}

export function iniciarControlInactividad(tiempoLimiteMs = 30 * 60 * 1000) {
  let temporizador = null

  const reiniciar = () => {
    clearTimeout(temporizador)
    temporizador = setTimeout(() => {
      cerrarSesion()
      window.location.href = 'login.html'
    }, tiempoLimiteMs)
  }

  const eventos = ['click', 'keydown', 'mousemove', 'scroll', 'touchstart']
  eventos.forEach(evento => document.addEventListener(evento, reiniciar, { passive: true }))

  reiniciar()
}
