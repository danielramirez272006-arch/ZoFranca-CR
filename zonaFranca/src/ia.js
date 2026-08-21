export const UMBRALES_IA = {
  inversionPlena: 2000000,
  inversionMinima: 500000,
  empleosPlenos: 100,
  empleosMinimos: 25,
  toleranciaCumplimiento: 0.9,
  umbralCritico: 0.7,
  pesosSector: { manufactura: 20, tecnologia: 19, bpo: 17 },
  bonificacionDocumentos: 10,
  latenciaMinMs: 600,
  latenciaMaxMs: 1200,
}

const CLASIFICACIONES = [
  { minimo: 75, etiqueta: 'Recomendada' },
  { minimo: 50, etiqueta: 'Revisar' },
  { minimo: 0, etiqueta: 'Rechazada' },
]

export const clasificarPuntaje = puntaje =>
  (CLASIFICACIONES.find(regla => puntaje >= regla.minimo) ?? CLASIFICACIONES.at(-1)).etiqueta

const esperar = ms => new Promise(resolucion => setTimeout(resolucion, ms))

const puntajeEscalado = (valor, minimo, pleno, maximo) => {
  const numero = Number(valor) || 0
  if (numero >= pleno) return maximo
  if (numero <= 0) return 0
  if (numero <= minimo) return Math.round((numero / minimo) * (maximo * 0.45))
  const tramoAlto = 0.45 + ((numero - minimo) / (pleno - minimo)) * 0.55
  return Math.round(tramoAlto * maximo)
}

const formatearUSD = valor =>
  new Intl.NumberFormat('es-CR', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(Number(valor) || 0)

const evaluarInversion = inversion => {
  const puntos = puntajeEscalado(inversion, UMBRALES_IA.inversionMinima, UMBRALES_IA.inversionPlena, 35)
  return {
    criterio: 'Inversión proyectada',
    detalle: `${formatearUSD(inversion)} frente a un rango de referencia de ${formatearUSD(UMBRALES_IA.inversionMinima)} a ${formatearUSD(UMBRALES_IA.inversionPlena)}.`,
    puntos,
    maximo: 35,
  }
}

const evaluarEmpleos = empleos => {
  const puntos = puntajeEscalado(empleos, UMBRALES_IA.empleosMinimos, UMBRALES_IA.empleosPlenos, 35)
  return {
    criterio: 'Empleos proyectados',
    detalle: `${Number(empleos) || 0} puestos proyectados frente a un rango de referencia de ${UMBRALES_IA.empleosMinimos} a ${UMBRALES_IA.empleosPlenos}.`,
    puntos,
    maximo: 35,
  }
}

const evaluarSector = sector => {
  const peso = UMBRALES_IA.pesosSector[sector] ?? Math.round((UMBRALES_IA.pesosSector.manufactura + UMBRALES_IA.pesosSector.bpo) / 2)
  return {
    criterio: 'Afinidad del sector',
    detalle: `El sector "${sector || 'no indicado'}" tiene afinidad ${peso >= 20 ? 'alta' : peso >= 19 ? 'media-alta' : 'media'} con el régimen de zonas francas.`,
    puntos: peso,
    maximo: 20,
  }
}

const evaluarDocumentos = cantidadDocumentos => ({
  criterio: 'Respaldo documental',
  detalle: cantidadDocumentos > 0
    ? `${cantidadDocumentos} documento(s) de respaldo adjunto(s) a la solicitud.`
    : 'La solicitud no incluye documentos de respaldo.',
  puntos: cantidadDocumentos > 0 ? UMBRALES_IA.bonificacionDocumentos : 0,
  maximo: UMBRALES_IA.bonificacionDocumentos,
})

const construirJustificacion = (veredicto, criterios) => {
  const fuertes = criterios.filter(criterio => criterio.puntos >= criterio.maximo * 0.7)
  const debiles = criterios.filter(criterio => criterio.puntos < criterio.maximo * 0.5)
  const partes = []
  partes.push(`El motor de IA pre-clasificó la solicitud como "${veredicto}" con ${veredicto === 'Recomendada' ? 'afinidad alta' : veredicto === 'Revisar' ? 'afinidad intermedia' : 'afinidad baja'} con el régimen.`)
  if (fuertes.length) partes.push(`Fortalezas: ${fuertes.map(criterio => criterio.criterio.toLowerCase()).join(', ')}.`)
  if (debiles.length) partes.push(`Atención: ${debiles.map(criterio => criterio.criterio.toLowerCase()).join(', ')} por debajo del umbral esperado.`)
  partes.push('La decisión final queda en manos del analista humano.')
  return partes.join(' ')
}

export const evaluarSolicitud = async solicitud => {
  await esperar(UMBRALES_IA.latenciaMinMs + Math.random() * (UMBRALES_IA.latenciaMaxMs - UMBRALES_IA.latenciaMinMs))

  const criterios = [
    evaluarInversion(solicitud.inversionProyectada),
    evaluarEmpleos(solicitud.empleosProyectados),
    evaluarSector(solicitud.sector),
    evaluarDocumentos(Array.isArray(solicitud.documentos) ? solicitud.documentos.length : 0),
  ]

  const puntaje = criterios.reduce((total, criterio) => total + criterio.puntos, 0)
  const veredicto = clasificarPuntaje(puntaje)

  return {
    empresa: solicitud.empresa,
    sector: solicitud.sector,
    puntajeAfinidad: puntaje,
    clasificacion: veredicto,
    criterios,
    justificacion: construirJustificacion(veredicto, criterios),
    motor: 'heuristica-local-v1',
    fechaEvaluacion: new Date().toISOString(),
  }
}

const auditarMetrica = (nombre, tipo, real, comprometido, unidad) => {
  if (!comprometido || comprometido <= 0) return null
  const razon = (Number(real) || 0) / comprometido
  if (razon >= UMBRALES_IA.toleranciaCumplimiento) return null
  const porcentaje = Math.round(razon * 100)
  return {
    tipo,
    detalle: `${nombre}: ${new Intl.NumberFormat('es-CR').format(Number(real) || 0)} de ${new Intl.NumberFormat('es-CR').format(comprometido)} comprometidos (${porcentaje}%).`,
    valor: 'Hoy',
    nivel: razon < UMBRALES_IA.umbralCritico ? 'Alto' : 'Medio',
    unidad,
  }
}

export const auditarReporteCumplimiento = (reporte, compromiso) => {
  if (!compromiso) {
    return {
      auditado: false,
      motivo: 'No se encontró una solicitud de instalación previa con compromisos registrados para esta empresa.',
      alertas: [],
    }
  }

  const alertas = [
    auditarMetrica('Empleos', 'Empleo', reporte.empleosReales, compromiso.empleosProyectados, 'puestos'),
    auditarMetrica('Inversión ejecutada', 'Inversión', reporte.inversionEjecutada, compromiso.inversionProyectada, 'USD'),
  ].filter(Boolean)

  return {
    auditado: true,
    motivo: alertas.length
      ? `Se detectaron ${alertas.length} desviación(es) bajo la tolerancia del ${UMBRALES_IA.toleranciaCumplimiento * 100}%.`
      : `Los indicadores reportados cumplen los compromisos (tolerancia ${UMBRALES_IA.toleranciaCumplimiento * 100}%).`,
    alertas,
  }
}
