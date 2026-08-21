import './formularios.css'
import { evaluarSolicitud, auditarReporteCumplimiento } from './ia.js'

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

const guardarEvaluacionIA = async evaluacion => {
  try {
    await zfRequestJson(`${ZF_API}/evaluacionesIA`, { method: 'POST', body: JSON.stringify(evaluacion) })
  } catch (error) {
    console.warn('[zf-formularios] Evaluación de IA no persistida:', error)
  }
}

const obtenerCompromisos = async empresa => {
  try {
    const lista = await zfRequestJson(`${ZF_API}/solicitudes?empresa=${encodeURIComponent(empresa)}`)
    const registros = Array.isArray(lista) ? lista : []
    return (
      registros
        .filter(item => Number(item.empleosProyectados) > 0 || Number(item.inversionProyectada) > 0)
        .at(-1) ?? null
    )
  } catch {
    return null
  }
}

const registrarAlertasIncumplimiento = alertas =>
  Promise.allSettled(
    alertas.map(alerta =>
      zfRequestJson(`${ZF_API}/incumplimientos`, {
        method: 'POST',
        body: JSON.stringify({
          empresa: alerta.empresa,
          tipo: alerta.tipo,
          detalle: alerta.detalle,
          valor: alerta.valor,
          nivel: alerta.nivel,
        }),
      }),
    ),
  )

const claseDeBadge = clasificacion =>
  clasificacion === 'Recomendada' ? 'is-green' : clasificacion === 'Revisar' ? 'is-amber' : 'is-coral'

const limpiarPanelResultado = contenedor => {
  if (!contenedor) return
  contenedor.hidden = true
  contenedor.replaceChildren()
}

const pintarEncabezadoResultado = (contenedor, etiqueta, detalleEtiqueta, clase) => {
  const encabezado = document.createElement('div')
  encabezado.className = 'zf-ia-head'

  const badge = document.createElement('span')
  badge.className = `zf-ia-badge ${clase}`
  badge.textContent = etiqueta
  encabezado.appendChild(badge)

  const fuente = document.createElement('small')
  fuente.textContent = detalleEtiqueta
  encabezado.appendChild(fuente)

  contenedor.appendChild(encabezado)
}

const pintarLista = (contenedor, items, formatoItem) => {
  if (!items.length) return
  const lista = document.createElement('ul')
  lista.className = 'zf-ia-lista'
  for (const item of items) {
    const linea = document.createElement('li')
    formatoItem(linea, item)
    lista.appendChild(linea)
  }
  contenedor.appendChild(lista)
}

const pintarVeredictoIA = (contenedor, veredicto) => {
  if (!contenedor) return
  contenedor.hidden = false
  contenedor.replaceChildren()

  pintarEncabezadoResultado(
    contenedor,
    `Pre-clasificación IA: ${veredicto.clasificacion} · ${veredicto.puntajeAfinidad}/100`,
    `Motor ${veredicto.motor}`,
    claseDeBadge(veredicto.clasificacion),
  )

  const parrafo = document.createElement('p')
  parrafo.className = 'zf-ia-justificacion'
  parrafo.textContent = veredicto.justificacion
  contenedor.appendChild(parrafo)

  pintarLista(contenedor, veredicto.criterios, (linea, criterio) => {
    const titulo = document.createElement('strong')
    titulo.textContent = `${criterio.criterio}: `
    linea.appendChild(titulo)
    linea.appendChild(document.createTextNode(`${criterio.detalle} `))
    const puntos = document.createElement('em')
    puntos.textContent = `${criterio.puntos}/${criterio.maximo} pts`
    linea.appendChild(puntos)
  })
}

const pintarAuditoriaCumplimiento = (contenedor, empresa, resultadoAuditoria) => {
  if (!contenedor) return
  contenedor.hidden = false
  contenedor.replaceChildren()

  const conAlertas = resultadoAuditoria.auditado && resultadoAuditoria.alertas.length > 0
  pintarEncabezadoResultado(
    contenedor,
    conAlertas
      ? `Auditoría automática: ${resultadoAuditoria.alertas.length} alerta(s)`
      : resultadoAuditoria.auditado
        ? 'Auditoría automática: sin desviaciones'
        : 'Auditoría automática no aplicable',
    `Empresa: ${empresa}`,
    conAlertas ? 'is-coral' : resultadoAuditoria.auditado ? 'is-green' : 'is-amber',
  )

  const parrafo = document.createElement('p')
  parrafo.className = 'zf-ia-justificacion'
  parrafo.textContent = resultadoAuditoria.motivo
  contenedor.appendChild(parrafo)

  pintarLista(contenedor, resultadoAuditoria.alertas, (linea, alerta) => {
    const nivel = document.createElement('span')
    nivel.className = `zf-nivel-alerta ${alerta.nivel === 'Alto' ? 'is-alto' : 'is-medio'}`
    nivel.textContent = alerta.nivel
    linea.appendChild(nivel)
    const titulo = document.createElement('strong')
    titulo.textContent = `${alerta.tipo}. `
    linea.appendChild(titulo)
    linea.appendChild(document.createTextNode(alerta.detalle))
  })
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

const registrarFormulario = ({ selectorForm, selectorStatus, selectorResultado, enviar, construirEnvio, procesarDespues }) => {
  const form = document.querySelector(selectorForm)
  if (!form || form.dataset.zfBound === 'true') return

  form.addEventListener('submit', async event => {
    event.preventDefault()
    if (formulariosEnVuelo.has(form)) return
    if (!form.reportValidity()) return

    const statusEl = document.querySelector(selectorStatus)
    const panelResultado = document.querySelector(selectorResultado)
    limpiarPanelResultado(panelResultado)
    const envio = construirEnvio(form)

    formulariosEnVuelo.add(form)
    setFormLoading(form, true)
    mostrarEstado(statusEl, '')

    try {
      await enviar(envio.cuerpo)
      let mensaje = envio.mensajeExito
      if (typeof procesarDespues === 'function') {
        mostrarEstado(statusEl, `${mensaje} Procesando con IA...`)
        try {
          const extra = await procesarDespues(form, envio.cuerpo)
          if (extra) mensaje = `${mensaje} ${extra}`
        } catch (error) {
          console.warn('[zf-formularios] Post-proceso IA falló:', error)
          mensaje = `${mensaje} (El análisis automático no pudo completarse.)`
        }
      }
      form.reset()
      mostrarEstadoTemporal(statusEl, mensaje)
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
  selectorResultado: '#zf-inst-ia',
  enviar: guardarSolicitud,
  procesarDespues: async (form, cuerpo) => {
    const veredicto = await evaluarSolicitud(cuerpo)
    pintarVeredictoIA(document.querySelector('#zf-inst-ia'), veredicto)
    await guardarEvaluacionIA(veredicto)
    return `Clasificación preliminar: ${veredicto.clasificacion} (${veredicto.puntajeAfinidad}/100).`
  },
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
  selectorResultado: '#zf-rep-auditoria',
  enviar: guardarReporteCumplimiento,
  procesarDespues: async (form, cuerpo) => {
    const compromiso = await obtenerCompromisos(cuerpo.empresa)
    const auditoria = auditarReporteCumplimiento(cuerpo, compromiso)
    pintarAuditoriaCumplimiento(document.querySelector('#zf-rep-auditoria'), cuerpo.empresa, auditoria)
    if (auditoria.alertas.length) await registrarAlertasIncumplimiento(auditoria.alertas.map(alerta => ({ ...alerta, empresa: cuerpo.empresa })))
    return auditoria.motivo
  },
  construirEnvio: form => {
    const datos = new FormData(form)
    const empresa = String(datos.get('empresa') || '').trim().replace(/\s+/g, ' ')
    return {
      cuerpo: {
        empresa,
        periodoReportado: String(datos.get('periodoReportado') || ''),
        empleosReales: aNumeroSeguro(datos.get('empleosReales')),
        inversionEjecutada: aNumeroSeguro(datos.get('inversionEjecutada')),
        exportaciones: aNumeroSeguro(datos.get('exportaciones')),
        fechaReporte: new Date().toISOString(),
        estado: 'Recibido',
      },
      mensajeExito: `Reporte de cumplimiento recibido para ${empresa} (${datos.get('periodoReportado') || 'período no indicado'}).`,
    }
  },
})
