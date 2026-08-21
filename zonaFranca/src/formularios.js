import './formularios.css'

const ZF_API = 'http://localhost:3000'
const ZF_TIMEOUT_MS = 10000
const ZF_MAX_ARCHIVO_KB = 5120
const ZF_ESTADO_VISIBLE_MS = 6000

const formulariosEnVuelo = new WeakSet()
const temporalesDeEstado = new WeakMap()

const zfRequestJson = async (url, options = {}) => {
  const response = await fetch(url, {
    headers: { 'Content-Type': 'application/json' },
    signal: AbortSignal.timeout(ZF_TIMEOUT_MS),
    ...options,
  })
  if (!response.ok) {
    const error = new Error(`Request failed: ${response.status}`)
    error.status = response.status
    throw error
  }
  if (response.status === 204) return null
  return response.json()
}

const guardarSolicitud = async solicitud =>
  zfRequestJson(`${ZF_API}/solicitudes`, {
    method: 'POST',
    body: JSON.stringify(solicitud),
  })

const guardarReporteCumplimiento = async reporte =>
  zfRequestJson(`${ZF_API}/reportesCumplimiento`, {
    method: 'POST',
    body: JSON.stringify(reporte),
  })

const derivarIniciales = empresa =>
  String(empresa)
    .trim()
    .split(/\s+/)
    .map(palabra => palabra[0])
    .join('')
    .slice(0, 2)
    .toUpperCase() || 'SO'

const aNumeroSeguro = valor => {
  const numero = Number(valor)
  return Number.isFinite(numero) && numero >= 0 ? numero : 0
}

const extraerMetadatosDocumento = input => {
  const archivos = Array.from(input?.files ?? [])
  const aceptados = archivos.filter(archivo => archivo.size / 1024 <= ZF_MAX_ARCHIVO_KB)
  return {
    documentos: aceptados.map(archivo => ({
      nombre: archivo.name,
      tamanoKB: Math.round(archivo.size / 1024),
      tipo: archivo.type || 'desconocido',
    })),
    rechazados: archivos.length - aceptados.length,
  }
}

const mensajeDeError = error => {
  if (error instanceof TypeError) {
    return 'Sin conexión con el backend. Verifique que json-server esté activo (npm run api).'
  }
  if (error.message === 'timeout') {
    return `El servidor no respondió en ${ZF_TIMEOUT_MS / 1000} segundos. Intente nuevamente.`
  }
  if (error.status >= 400 && error.status < 500) {
    return `El servidor rechazó la operación (código ${error.status}). Revise los datos enviados.`
  }
  return 'Ocurrió un error inesperado en el servidor. Intente nuevamente.'
}

const mostrarEstado = (statusEl, mensaje, esError = false) => {
  if (!statusEl) return
  const temporal = temporalesDeEstado.get(statusEl)
  if (temporal) clearTimeout(temporal)
  statusEl.textContent = mensaje
  statusEl.classList.toggle('is-error', esError && Boolean(mensaje))
  statusEl.classList.toggle('is-success', !esError && Boolean(mensaje))
}

const mostrarEstadoTemporal = (statusEl, mensaje, esError = false) => {
  mostrarEstado(statusEl, mensaje, esError)
  if (!esError && mensaje) {
    temporalesDeEstado.set(statusEl, setTimeout(() => mostrarEstado(statusEl, ''), ZF_ESTADO_VISIBLE_MS))
  }
}

const setFormLoading = (form, cargando) => {
  const boton = form.querySelector('button[type="submit"]')
  if (!boton) return
  if (cargando) {
    boton.dataset.originalText ??= boton.textContent
    boton.textContent = boton.dataset.loadingText || 'Cargando...'
    boton.disabled = true
    form.setAttribute('aria-busy', 'true')
  } else {
    boton.textContent = boton.dataset.originalText || 'Enviar'
    boton.disabled = false
    form.removeAttribute('aria-busy')
  }
}

const registrarFormulario = ({ selectorForm, selectorStatus, enviar, construirEnvio }) => {
  const form = document.querySelector(selectorForm)
  if (!form || form.dataset.zfBound === 'true') return

  form.addEventListener('submit', async event => {
    event.preventDefault()
    if (formulariosEnVuelo.has(form)) return
    if (!form.reportValidity()) return

    const statusEl = document.querySelector(selectorStatus)
    const envio = construirEnvio(form)

    formulariosEnVuelo.add(form)
    setFormLoading(form, true)
    mostrarEstado(statusEl, '')

    try {
      await enviar(envio.cuerpo)
      form.reset()
      mostrarEstadoTemporal(statusEl, envio.mensajeExito)
    } catch (error) {
      console.error(`[zf-formularios] Fallo al enviar ${selectorForm}:`, error)
      mostrarEstado(statusEl, mensajeDeError(error), true)
    } finally {
      formulariosEnVuelo.delete(form)
      setFormLoading(form, false)
    }
  })

  form.dataset.zfBound = 'true'
}

registrarFormulario({
  selectorForm: '#zf-installation-request-form',
  selectorStatus: '#zf-inst-status',
  enviar: guardarSolicitud,
  construirEnvio: form => {
    const datos = new FormData(form)
    const empresa = String(datos.get('empresa') || '').trim().replace(/\s+/g, ' ')
    const { documentos, rechazados } = extraerMetadatosDocumento(form.elements.documento)
    const avisoRechazados = rechazados
      ? ` Se omitieron ${rechazados} archivo(s) que superan ${ZF_MAX_ARCHIVO_KB / 1024} MB.`
      : ''
    return {
      cuerpo: {
        empresa,
        sector: String(datos.get('sector') || ''),
        inversionProyectada: aNumeroSeguro(datos.get('inversionProyectada')),
        empleosProyectados: aNumeroSeguro(datos.get('empleosProyectados')),
        documentos,
        fecha: new Date().toISOString(),
        estado: 'Nueva',
        iniciales: derivarIniciales(empresa),
        color: 'coral',
      },
      mensajeExito: `Solicitud de instalación registrada para ${empresa}.${avisoRechazados}`,
    }
  },
})

registrarFormulario({
  selectorForm: '#zf-compliance-report-form',
  selectorStatus: '#zf-rep-status',
  enviar: guardarReporteCumplimiento,
  construirEnvio: form => {
    const datos = new FormData(form)
    const empresa = String(datos.get('empresa') || '').trim().replace(/\s+/g, ' ')
    return {
      cuerpo: {
        empresa,
        empleosReales: aNumeroSeguro(datos.get('empleosReales')),
        inversionEjecutada: aNumeroSeguro(datos.get('inversionEjecutada')),
        exportaciones: aNumeroSeguro(datos.get('exportaciones')),
        fechaReporte: new Date().toISOString(),
        estado: 'Recibido',
      },
      mensajeExito: `Reporte de cumplimiento recibido para ${empresa}.`,
    }
  },
})
