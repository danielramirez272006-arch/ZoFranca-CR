const API_URL = 'http://localhost:3000/usuarios'
const TIMEOUT_MS = 8000

async function consultarAPI(query) {
  const controller = new AbortController()
  const timeout = setTimeout(() => controller.abort(), TIMEOUT_MS)

  try {
    const response = await fetch(`${API_URL}?${query}`, { signal: controller.signal })

    if (!response.ok) {
      throw new Error(`El servidor respondió con el estado ${response.status}`)
    }

    return await response.json()
  } catch (error) {
    if (error.name === 'AbortError') {
      throw new Error('El servidor tardó demasiado en responder. Intenta de nuevo.')
    }
    if (error instanceof TypeError) {
      throw new Error('No se pudo conectar con el servidor. Verifica que esté activo.')
    }
    throw error
  } finally {
    clearTimeout(timeout)
  }
}

export async function hashContrasena(contrasena) {
  const datos = new TextEncoder().encode(contrasena)
  const digest = await crypto.subtle.digest('SHA-256', datos)
  return Array.from(new Uint8Array(digest))
    .map(byte => byte.toString(16).padStart(2, '0'))
    .join('')
}

export async function autenticar(correo, contrasena) {
  const params = new URLSearchParams({ correo, contrasena: await hashContrasena(contrasena) })
  const usuarios = await consultarAPI(params)
  return usuarios[0] ?? null
}

export async function buscarPorCorreo(correo) {
  const params = new URLSearchParams({ correo })
  const usuarios = await consultarAPI(params)
  return usuarios[0] ?? null
}

export async function guardarNuevaContrasena(id, contrasena) {
  const response = await fetch(`${API_URL}/${id}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ contrasena: await hashContrasena(contrasena) }),
  })

  if (!response.ok) {
    throw new Error(`El servidor respondió con el estado ${response.status}`)
  }
}
