/**
 * Capa de datos del sitio corporativo.
 * Sigue el patrón existente del proyecto (json-server en :3000 con
 * fallback local) para consultas y candidaturas. El CV no se sube a un
 * servidor: solo se registran metadatos y la interfaz lo comunica con
 * honestidad ("entorno de demostración").
 */

const API = 'http://localhost:3000'
const LOCAL_PREFIX = 'medtech-demo-'

const requestJson = async (url, options = {}) => {
  const response = await fetch(url, {
    headers: { 'Content-Type': 'application/json' },
    ...options,
  })
  if (!response.ok) throw new Error(`Request failed: ${response.status}`)
  if (response.status === 204) return null
  return response.json()
}

/**
 * Intenta guardar un registro vía API; si no está disponible lo conserva
 * en localStorage. Devuelve { remote } para que la UI informe el destino real.
 */
export const saveSubmission = async (collection, payload) => {
  const body = JSON.stringify({ ...payload, fecha: new Date().toISOString() })
  try {
    await requestJson(`${API}/${collection}`, { method: 'POST', body })
    return { remote: true }
  } catch {
    const key = `${LOCAL_PREFIX}${collection}`
    const stored = JSON.parse(localStorage.getItem(key) ?? '[]')
    stored.push({ id: Date.now(), ...JSON.parse(body) })
    localStorage.setItem(key, JSON.stringify(stored))
    return { remote: false }
  }
}
