import './style.css'
import './polish.css'
import Chart from 'chart.js/auto'
import { leerSesion, cerrarSesion, iniciarControlInactividad } from '../js/sesion.js'

const usuario = leerSesion()
if (!usuario) { window.location.href = 'login.html'; throw new Error('No autenticado') }

iniciarControlInactividad()

const API = 'http://localhost:3000'
const fallbackDb = {
  solicitudes: [
    { id: 1, empresa: 'Nexa Components', sector: 'Manufactura avanzada', fecha: 'Hoy, 09:42', prioridad: 'Alta', estado: 'Nueva', iniciales: 'NC', color: 'coral' },
    { id: 2, empresa: 'Pacific Data Lab', sector: 'Servicios / BPO', fecha: 'Hoy, 08:15', prioridad: 'Media', estado: 'En revisión', iniciales: 'PD', color: 'blue' },
    { id: 3, empresa: 'VerdeLogix', sector: 'Tecnología limpia', fecha: 'Ayer, 16:30', prioridad: 'Baja', estado: 'Nueva', iniciales: 'VL', color: 'green' },
    { id: 4, empresa: 'Altura Robotics', sector: 'Manufactura inteligente', fecha: 'Ayer, 13:20', prioridad: 'Alta', estado: 'Nueva', iniciales: 'AR', color: 'purple' },
    { id: 5, empresa: 'Pura Vida Analytics', sector: 'Tecnología / Datos', fecha: 'Ayer, 11:05', prioridad: 'Media', estado: 'En revisión', iniciales: 'PA', color: 'orange' },
    { id: 6, empresa: 'Central BioLabs', sector: 'Ciencias de la vida', fecha: '20 ago, 15:48', prioridad: 'Baja', estado: 'Nueva', iniciales: 'CB', color: 'blue' },
    { id: 7, empresa: 'Quetzal Devices', sector: 'Dispositivos médicos', fecha: '20 ago, 09:12', prioridad: 'Alta', estado: 'En revisión', iniciales: 'QD', color: 'coral' },
    { id: 8, empresa: 'Río Frío Foods', sector: 'Agroindustria', fecha: '19 ago, 14:37', prioridad: 'Media', estado: 'Aprobada', iniciales: 'RF', color: 'green' },
    { id: 9, empresa: 'Solaris Energy CR', sector: 'Energías renovables', fecha: '19 ago, 08:50', prioridad: 'Alta', estado: 'Nueva', iniciales: 'SE', color: 'orange' },
    { id: 10, empresa: 'Mangrove Textiles', sector: 'Textil y confección', fecha: '18 ago, 17:05', prioridad: 'Baja', estado: 'Rechazada', iniciales: 'MT', color: 'purple' },
    { id: 11, empresa: 'Coral Pharma', sector: 'Farmacéutica', fecha: '18 ago, 10:22', prioridad: 'Alta', estado: 'En revisión', iniciales: 'CP', color: 'blue' },
    { id: 12, empresa: 'Bambú Design', sector: 'Diseño sostenible', fecha: '17 ago, 12:40', prioridad: 'Baja', estado: 'Aprobada', iniciales: 'BD', color: 'green' }
  ],
  solicitudesSalida: [
    { id: 1, empresa: 'Innova Medical', tipo: 'Respuesta de instalación', fecha: 'Hoy, 10:20', estado: 'Lista para enviar', prioridad: 'Alta', iniciales: 'IM', color: 'purple' },
    { id: 2, empresa: 'Caribe Logistics', tipo: 'Entrega de documentación', fecha: 'Ayer, 14:05', estado: 'En preparación', prioridad: 'Media', iniciales: 'CL', color: 'orange' },
    { id: 3, empresa: 'Bosque Digital', tipo: 'Respuesta de cumplimiento', fecha: 'Ayer, 12:40', estado: 'Lista para enviar', prioridad: 'Alta', iniciales: 'BD', color: 'green' },
    { id: 4, empresa: 'Norte Textiles', tipo: 'Entrega de resolución', fecha: '20 ago, 16:15', estado: 'En preparación', prioridad: 'Baja', iniciales: 'NT', color: 'blue' },
    { id: 5, empresa: 'Alimentos del Valle', tipo: 'Respuesta de inspección', fecha: '20 ago, 13:30', estado: 'Lista para enviar', prioridad: 'Media', iniciales: 'AV', color: 'coral' },
    { id: 6, empresa: 'Sierra Cloud', tipo: 'Entrega de aprobación', fecha: '19 ago, 09:10', estado: 'En preparación', prioridad: 'Alta', iniciales: 'SC', color: 'purple' },
    { id: 7, empresa: 'Mar Azul Services', tipo: 'Respuesta de seguimiento', fecha: '18 ago, 16:45', estado: 'Enviada', prioridad: 'Baja', iniciales: 'MA', color: 'orange' },
    { id: 8, empresa: 'Volcán Energy', tipo: 'Entrega de resolución', fecha: '18 ago, 11:25', estado: 'Enviada', prioridad: 'Media', iniciales: 'VE', color: 'green' },
    { id: 9, empresa: 'Quetzal Devices', tipo: 'Respuesta de instalación', fecha: '17 ago, 15:30', estado: 'Enviada', prioridad: 'Alta', iniciales: 'QD', color: 'coral' },
    { id: 10, empresa: 'Río Frío Foods', tipo: 'Entrega de permisos', fecha: '16 ago, 10:05', estado: 'Enviada', prioridad: 'Media', iniciales: 'RF', color: 'green' }
  ],
  solicitudesEnviadas: [
    { id: 1, empresa: 'GreenPack Industries', sector: 'Manufactura sostenible', descripcion: 'Solicita revisión de requisitos para instalar una nueva línea de producción.', fecha: 'Hoy, 08:35', prioridad: 'Alta', estado: 'Enviada', iniciales: 'GI', color: 'green' },
    { id: 2, empresa: 'DataBridge CR', sector: 'Servicios tecnológicos', descripcion: 'Solicita orientación para completar la documentación de instalación.', fecha: 'Ayer, 15:20', prioridad: 'Media', estado: 'Enviada', iniciales: 'DB', color: 'blue' },
    { id: 3, empresa: 'Pacific Assembly', sector: 'Manufactura avanzada', descripcion: 'Solicita validación del proyecto de inversión y empleos proyectados.', fecha: '20 ago, 10:45', prioridad: 'Baja', estado: 'Enviada', iniciales: 'PA', color: 'coral' },
    { id: 4, empresa: 'Arenal Water', sector: 'Bebidas y embotellado', descripcion: 'Consulta sobre requisitos sanitarios para expansión de planta.', fecha: '19 ago, 09:55', prioridad: 'Media', estado: 'Enviada', iniciales: 'AW', color: 'blue' },
    { id: 5, empresa: 'Solaris Energy CR', sector: 'Energías renovables', descripcion: 'Solicita agenda de visita técnica para evaluación del sitio.', fecha: '18 ago, 14:10', prioridad: 'Alta', estado: 'Enviada', iniciales: 'SE', color: 'orange' }
  ],
  incumplimientos: [
    { id: 1, empresa: 'TicoTech Solutions', tipo: 'Exportaciones', detalle: 'Reporte mensual pendiente', valor: 'Hace 8 días', nivel: 'Alto' },
    { id: 2, empresa: 'Nexa Components', tipo: 'Empleo', detalle: '6 empleos por debajo del compromiso', valor: 'Hace 2 días', nivel: 'Medio' },
    { id: 3, empresa: 'EcoPack CR', tipo: 'Mercadería', detalle: 'Diferencia entre manifiesto y reporte', valor: 'Hace 1 día', nivel: 'Medio' },
    { id: 4, empresa: 'Mangrove Textiles', tipo: 'Ambiental', detalle: 'Vertimientos sin informe de laboratorio', valor: 'Hace 5 días', nivel: 'Alto' },
    { id: 5, empresa: 'Sierra Cloud', tipo: 'Tributación', detalle: 'Exoneración de activos sin declarar', valor: 'Hace 4 días', nivel: 'Medio' },
    { id: 6, empresa: 'Coral Pharma', tipo: 'Reportes', detalle: 'Informe trimestral fuera de plazo', valor: 'Hace 3 días', nivel: 'Bajo' },
    { id: 7, empresa: 'Volcán Energy', tipo: 'Empleo', detalle: 'Rotación de personal superior al 15%', valor: 'Hace 6 días', nivel: 'Medio' },
    { id: 8, empresa: 'Norte Textiles', tipo: 'Mercadería', detalle: 'Salida de mercadería sin registro previo', valor: 'Hace 2 días', nivel: 'Bajo' }
  ],
  auditorias: [
    { id: 1, fecha: '22 ago 2024', empresa: 'TicoTech Solutions', tipo: 'Cumplimiento trimestral', estado: 'Pendiente' },
    { id: 2, fecha: '28 ago 2024', empresa: 'Nexa Components', tipo: 'Auditoría de instalación', estado: 'Programada' },
    { id: 3, fecha: '04 sep 2024', empresa: 'EcoPack CR', tipo: 'Revisión de mercadería', estado: 'Pendiente' },
    { id: 4, fecha: '11 sep 2024', empresa: 'Coral Pharma', tipo: 'Auditoría de cumplimiento', estado: 'Programada' },
    { id: 5, fecha: '19 sep 2024', empresa: 'Mangrove Textiles', tipo: 'Auditoría ambiental', estado: 'Pendiente' },
    { id: 6, fecha: '26 sep 2024', empresa: 'Río Frío Foods', tipo: 'Revisión de mercadería', estado: 'Programada' },
    { id: 7, fecha: '03 oct 2024', empresa: 'Solaris Energy CR', tipo: 'Seguimiento de instalación', estado: 'Pendiente' },
    { id: 8, fecha: '15 ago 2024', empresa: 'VerdeLogix', tipo: 'Auditoría de instalación', estado: 'Completada' }
  ],
  actividad: [
    { id: 1, dia: 'Vie 16', entrantes: 3, respuestas: 2 },
    { id: 2, dia: 'Sáb 17', entrantes: 2, respuestas: 1 },
    { id: 3, dia: 'Dom 18', entrantes: 1, respuestas: 2 },
    { id: 4, dia: 'Lun 19', entrantes: 4, respuestas: 2 },
    { id: 5, dia: 'Mar 20', entrantes: 3, respuestas: 3 },
    { id: 6, dia: 'Mié 21', entrantes: 5, respuestas: 4 },
    { id: 7, dia: 'Jue 22', entrantes: 2, respuestas: 1 }
  ]
}

let db = structuredClone(fallbackDb)
let activityChart = null

const app = document.querySelector('#app')
const mainView = document.querySelector('main')
const toast = document.querySelector('#toast')
const darkModeToggle = document.querySelector('#dark-mode-toggle')
const templates = {
  outgoing: document.querySelector('#outgoing-template'),
  alert: document.querySelector('#alert-template'),
  audit: document.querySelector('#audit-template'),
  mySent: document.querySelector('#my-sent-template'),
}
const statusValues = { outgoing: ['En preparación', 'Lista para enviar', 'Enviada'] }
const priorityValues = ['Alta', 'Media', 'Baja']
const monthMap = { ene: 0, feb: 1, mar: 2, abr: 3, may: 4, jun: 5, jul: 6, ago: 7, sep: 8, oct: 9, nov: 10, dic: 11 }

const aplicarPerfil = () => {
  const nombreCompleto = String(usuario.nombre || '').trim()
  const iniciales = nombreCompleto.split(/\s+/).map(word => word[0]).join('').slice(0, 2).toUpperCase() || 'US'
  const escapar = texto => String(texto).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]))

  const avatar = document.querySelector('.sidebar-bottom .profile .avatar')
  if (avatar) avatar.textContent = iniciales
  const perfilNombre = document.querySelector('.sidebar-bottom .profile strong')
  if (perfilNombre) perfilNombre.textContent = nombreCompleto
  const perfilRol = document.querySelector('.sidebar-bottom .profile small')
  if (perfilRol) perfilRol.textContent = usuario.rol || ''

  const hora = new Date().getHours()
  const saludo = hora < 12 ? 'Buenos días' : hora < 19 ? 'Buenas tardes' : 'Buenas noches'
  const primerNombre = nombreCompleto.split(/\s+/)[0] || ''
  const titulo = document.querySelector('main header h1')
  if (titulo) titulo.innerHTML = `${saludo}, ${escapar(primerNombre)} <span>✦</span>`

  const fechaHeader = document.querySelector('main header .eyebrow')
  if (fechaHeader) fechaHeader.textContent = new Date().toLocaleDateString('es-CR', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })
}

document.querySelector('#logout-btn')?.addEventListener('click', () => {
  cerrarSesion()
  window.location.href = 'login.html'
})

aplicarPerfil()

const safeArray = value => Array.isArray(value) ? value : []
const showToast = message => {
  if (!toast) return
  toast.textContent = message
  toast.classList.add('show')
  clearTimeout(showToast.timer)
  showToast.timer = setTimeout(() => toast.classList.remove('show'), 2600)
}
const setText = (element, selector, value) => {
  const target = element.querySelector(selector)
  if (target) target.textContent = value
}
const replaceChildren = (selector, nodes) => {
  const host = document.querySelector(selector)
  if (!host) return
  host.replaceChildren(...nodes)
}
const setOptions = (select, values, selected) => {
  select.replaceChildren(...values.map(value => new Option(value, value, false, value === selected)))
}
const cloneTemplate = name => templates[name].content.firstElementChild.cloneNode(true)
const parseSpanishDate = value => {
  const text = String(value || '').trim().toLowerCase()
  const match = text.match(/(\d{1,2})\s+([a-z]{3})\s+(\d{4})/)
  if (!match) return new Date(0)
  const [, day, month, year] = match
  return new Date(Number(year), monthMap[month] ?? 0, Number(day))
}
const sortByDate = (a, b) => parseSpanishDate(a.fecha || a.valor || '').getTime() - parseSpanishDate(b.fecha || b.valor || '').getTime()

const renderBaseRow = (row, item, detail) => {
  const avatar = row.querySelector('[data-field="avatar"]')
  if (avatar) {
    avatar.textContent = item.iniciales || 'NA'
    if (item.color) avatar.classList.add(item.color)
  }
  setText(row, '[data-field="empresa"]', item.empresa)
  setText(row, '[data-field="detalle"]', detail)
  setText(row, '[data-field="fecha"]', item.fecha)
  const priorityNode = row.querySelector('[data-field="prioridad"]')
  if (priorityNode) {
    priorityNode.textContent = item.prioridad
    priorityNode.classList.add(String(item.prioridad || 'media').toLowerCase())
  }
  const statusNode = row.querySelector('[data-field="estado"]')
  if (statusNode) statusNode.textContent = item.estado
}

const renderOutgoingRow = (item, index) => {
  const row = cloneTemplate('outgoing')
  renderBaseRow(row, item, item.tipo)
  row.querySelector('[data-control="priority"]').dataset.outgoingPriority = index
  row.querySelector('[data-control="status"]').dataset.outgoingStatus = index
  setOptions(row.querySelector('[data-control="priority"]'), priorityValues, item.prioridad)
  setOptions(row.querySelector('[data-control="status"]'), statusValues.outgoing, item.estado)
  const send = row.querySelector('[data-send]')
  send.dataset.send = index
  send.textContent = item.estado === 'Enviada' ? 'Enviada' : 'Enviar'
  send.disabled = item.estado === 'Enviada'
  return row
}

const renderAlertRow = item => {
  const row = cloneTemplate('alert')
  setText(row, '[data-field="empresa"]', item.empresa)
  setText(row, '[data-field="detalle"]', `${item.tipo} · ${item.detalle}`)
  setText(row, '[data-field="fecha"]', item.valor)
  const levelNode = row.querySelector('[data-field="nivel"]')
  levelNode.textContent = item.nivel
  levelNode.classList.add(String(item.nivel || 'medio').toLowerCase())
  return row
}

const renderAuditRow = item => {
  const row = cloneTemplate('audit')
  setText(row, '[data-field="fecha"]', item.fecha)
  setText(row, '[data-field="empresa"]', item.empresa)
  setText(row, '[data-field="detalle"]', item.tipo)
  const stateNode = row.querySelector('[data-field="estado"]')
  stateNode.textContent = item.estado
  stateNode.parentElement.classList.add(String(item.estado || 'pendiente').toLowerCase())
  return row
}

const renderMySentRow = item => {
  const row = cloneTemplate('mySent')
  renderBaseRow(row, item, `${item.sector} · ${item.descripcion}`)
  return row
}

const renderOutgoing = () => {
  const pending = safeArray(db.solicitudesSalida).filter(item => item.estado !== 'Enviada')
  replaceChildren('#outgoing-list', pending.map((item, idx) => renderOutgoingRow(item, safeArray(db.solicitudesSalida).indexOf(item))))
  const countNode = document.querySelector('.outgoing-count')
  if (countNode) countNode.textContent = `${pending.length} pendientes`
}

const renderSent = () => {
  const sent = safeArray(db.solicitudesSalida).filter(item => item.estado === 'Enviada')
  replaceChildren('#sent-list', sent.map((item, idx) => renderOutgoingRow(item, safeArray(db.solicitudesSalida).indexOf(item))))
  const countNode = document.querySelector('.sent-count')
  if (countNode) countNode.textContent = `${sent.length} enviadas`
}

const renderAlerts = (filter = 'Todos') => {
  const alerts = safeArray(db.incumplimientos)
  replaceChildren('#alert-list', alerts.filter(item => filter === 'Todos' || item.nivel === filter).map(renderAlertRow))
  const counts = { Todos: alerts.length, Alto: 0, Medio: 0, Bajo: 0 }
  alerts.forEach(item => {
    if (counts[item.nivel] !== undefined) counts[item.nivel]++
  })
  document.querySelectorAll('.filter-bar .filter').forEach(button => {
    const target = button.querySelector('span')
    if (target && counts[button.dataset.filter] !== undefined) target.textContent = counts[button.dataset.filter]
  })
  const total = document.querySelector('.alerts-count')
  if (total) total.textContent = `${alerts.length} activas`
}

const renderAudits = (filter = 'Todas') => {
  const list = safeArray(db.auditorias)
  replaceChildren('#audit-list', list.filter(item => filter === 'Todas' || item.estado === filter).map(renderAuditRow))
}

const renderMySent = () => {
  const sent = safeArray(db.solicitudesEnviadas)
  replaceChildren('#my-sent-list', sent.map(renderMySentRow))
  const countNode = document.querySelector('.my-sent-count')
  if (countNode) countNode.textContent = `${sent.length} enviadas`
}

const renderStats = () => {
  const entrantes = safeArray(db.solicitudes).length
  const alertas = safeArray(db.incumplimientos).length
  const pendientes = safeArray(db.auditorias).filter(item => item.estado !== 'Completada').length

  const entradasNode = document.querySelector('#stat-entrantes')
  if (entradasNode) entradasNode.textContent = String(entrantes)
  const alertasNode = document.querySelector('#stat-alertas')
  if (alertasNode) alertasNode.textContent = String(alertas)
  const auditoriasNode = document.querySelector('#stat-auditorias')
  if (auditoriasNode) auditoriasNode.textContent = String(pendientes)

  const nextAudit = safeArray(db.auditorias)
    .filter(item => item.estado !== 'Completada')
    .sort(sortByDate)[0]
  const metaNode = document.querySelector('#stat-auditorias-meta')
  if (metaNode) metaNode.textContent = nextAudit ? `Próxima: ${nextAudit.fecha}` : 'Sin auditorías pendientes'
}

const renderDaily = () => {
  const todays = safeArray(db.solicitudes).filter(item => String(item.fecha || '').toLowerCase().includes('hoy'))
  replaceChildren('#daily-list', todays.length ? todays.slice(0, 6).map(renderMySentRow) : [(() => {
    const note = document.createElement('div')
    note.className = 'empty-note'
    note.textContent = 'Sin solicitudes recibidas hoy.'
    return note
  })()])
  const countNode = document.querySelector('#daily-count')
  if (countNode) countNode.textContent = String(todays.length)
}

const renderMiniAudits = () => {
  const list = safeArray(db.auditorias)
    .filter(item => item.estado !== 'Completada')
    .sort(sortByDate)
    .slice(0, 4)

  replaceChildren('#mini-audits', list.length ? list.map(item => {
    const row = document.createElement('div')
    row.className = 'mini-audit-row'
    row.innerHTML = `
      <div class="mini-audit-content">
        <strong>${item.empresa}</strong>
        <span>${item.fecha}</span>
      </div>
      <div class="mini-audit-meta">
        <small>${item.tipo}</small>
        <span class="status-pill ${String(item.estado || 'pendiente').toLowerCase()}">${item.estado}</span>
      </div>
    `
    return row
  }) : [Object.assign(document.createElement('div'), { className: 'empty-note', textContent: 'No hay auditorías próximas.' })])
}

const renderActivityFeed = () => {
  const all = []
  safeArray(db.solicitudes).slice(0, 2).forEach(item => all.push({ icon: '⌁', text: `${item.empresa} registró una nueva solicitud`, time: item.fecha, tone: 'incoming' }))
  safeArray(db.solicitudesSalida).slice(0, 2).forEach(item => all.push({ icon: '↗', text: `${item.empresa} tiene una respuesta lista`, time: item.fecha, tone: 'outgoing' }))
  safeArray(db.incumplimientos).slice(0, 2).forEach(item => all.push({ icon: '!', text: `${item.empresa} requiere revisión por ${item.nivel.toLowerCase()}`, time: item.valor, tone: 'alert' }))
  safeArray(db.auditorias).slice(0, 2).forEach(item => all.push({ icon: '◷', text: `Auditoría de ${item.empresa} programada`, time: item.fecha, tone: 'audit' }))

  replaceChildren('#activity-feed', all.slice(0, 6).map(entry => {
    const item = document.createElement('div')
    item.className = 'activity-item'
    item.innerHTML = `
      <span class="act-icon ${entry.tone}">${entry.icon}</span>
      <div class="activity-copy">
        <strong>${entry.text}</strong>
        <time>${entry.time}</time>
      </div>
    `
    return item
  }))
}

const renderLevelBars = () => {
  const levels = [
    { label: 'Alto', key: 'Alto', color: 'var(--coral)' },
    { label: 'Medio', key: 'Medio', color: 'var(--amber)' },
    { label: 'Bajo', key: 'Bajo', color: 'var(--green)' }
  ]
  const grouped = { Alto: 0, Medio: 0, Bajo: 0 }
  safeArray(db.incumplimientos).forEach(item => {
    if (grouped[item.nivel] !== undefined) grouped[item.nivel] += 1
  })
  const total = Math.max(1, Object.values(grouped).reduce((sum, value) => sum + value, 0))

  replaceChildren('#level-bars', levels.map(level => {
    const value = grouped[level.key]
    const width = Math.max(8, (value / total) * 100)
    const row = document.createElement('div')
    row.className = 'bar-row'
    row.innerHTML = `
      <div class="bar-label-wrap"><span>${level.label}</span><strong>${value}</strong></div>
      <div class="bar-track"><div class="bar-fill" style="width:${width}%; background:${level.color};"></div></div>
    `
    return row
  }))
}

const renderPriorityDonut = () => {
  const counts = { Alta: 0, Media: 0, Baja: 0 }
  safeArray(db.solicitudes).forEach(item => {
    if (counts[item.prioridad] !== undefined) counts[item.prioridad] += 1
  })
  const total = Object.values(counts).reduce((sum, value) => sum + value, 0) || 1
  const palette = { Alta: '#0d9488', Media: '#dda63a', Baja: '#43aa7b' }
  let start = 0
  const stops = Object.keys(counts).map(key => {
    const value = counts[key]
    const end = start + (value / total) * 100
    const stop = `${palette[key]} ${start}% ${end}%`
    start = end
    return stop
  })
  const donut = document.querySelector('#priority-donut')
  if (donut) donut.style.background = `conic-gradient(${stops.join(', ')})`
  const totalNode = document.querySelector('#donut-total')
  if (totalNode) totalNode.textContent = String(total)

  const legend = document.querySelector('#priority-legend')
  if (!legend) return
  legend.innerHTML = ['Alta', 'Media', 'Baja'].map(key => `
    <div class="donut-legend-item">
      <span class="legend-swatch" style="background:${palette[key]}"></span>
      <span>${key}</span>
      <strong>${counts[key]}</strong>
      <em>${Math.round((counts[key] / total) * 100)}%</em>
    </div>
  `).join('')
}

const renderActivityChart = () => {
  const canvas = document.querySelector('#activity-chart')
  if (!canvas) return

  const labels = safeArray(db.actividad).map(item => item.dia)
  const entrantes = safeArray(db.actividad).map(item => item.entrantes)
  const respuestas = safeArray(db.actividad).map(item => item.respuestas)

  if (activityChart) activityChart.destroy()

  activityChart = new Chart(canvas, {
    type: 'line',
    data: {
      labels,
      datasets: [
        {
          label: 'Entrantes',
          data: entrantes,
          borderColor: '#0d9488',
          backgroundColor: 'rgba(13,148,136,0.18)',
          borderWidth: 2,
          tension: 0.35,
          fill: true,
          pointRadius: 3,
        },
        {
          label: 'Respuestas',
          data: respuestas,
          borderColor: '#6aa1d9',
          backgroundColor: 'rgba(106,161,217,0.14)',
          borderWidth: 2,
          tension: 0.35,
          fill: true,
          pointRadius: 3,
        }
      ]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: { legend: { display: true, position: 'bottom' }, tooltip: { enabled: true } },
      scales: {
        y: { beginAtZero: true, ticks: { precision: 0 } },
        x: { grid: { display: false } }
      }
    }
  })
}

const setDarkMode = enabled => {
  document.documentElement.classList.toggle('dark-mode', enabled)
  if (darkModeToggle) {
    darkModeToggle.checked = enabled
    darkModeToggle.setAttribute('aria-label', enabled ? 'Desactivar modo oscuro' : 'Activar modo oscuro')
  }
  localStorage.setItem('zofranca-dark-mode', String(enabled))
}

const setView = view => {
  const validViews = ['inicio', 'nueva-solicitud', 'salidas', 'enviadas', 'mis-enviadas', 'incumplimientos', 'auditorias', 'configuracion']
  const nextView = validViews.includes(view) ? view : 'inicio'
  if (mainView) mainView.dataset.view = nextView
  document.querySelectorAll('nav a, .sidebar-bottom > a').forEach(link => link.classList.toggle('active', link.hash === `#${nextView}`))
  const activeGroup = document.querySelector(`.nav-submenu a[href="#${nextView}"]`)?.closest('.nav-group')
  if (activeGroup) document.querySelectorAll('.nav-group.open').forEach(group => group.classList.toggle('open', group === activeGroup))
  document.querySelectorAll('.nav-toggle').forEach(button => button.classList.toggle('active', button.closest('.nav-group') === activeGroup))
  if (window.location.hash !== `#${nextView}`) history.replaceState(null, '', `#${nextView}`)
  window.scrollTo({ top: 0, behavior: 'smooth' })
}

const renderAll = () => {
  renderStats()
  renderDaily()
  renderMiniAudits()
  renderActivityFeed()
  renderLevelBars()
  renderPriorityDonut()
  renderActivityChart()
  renderOutgoing()
  renderSent()
  renderAlerts()
  renderAudits()
  renderMySent()
}

const requestJson = async (url, options = {}) => {
  const response = await fetch(url, {
    headers: { 'Content-Type': 'application/json' },
    ...options,
  })
  if (!response.ok) throw new Error(`Request failed: ${response.status}`)
  if (response.status === 204) return null
  return response.json()
}

const loadDb = async () => {
  try {
    const [solicitudes, solicitudesSalida, solicitudesEnviadas, incumplimientos, auditorias, actividad] = await Promise.all([
      requestJson(`${API}/solicitudes`),
      requestJson(`${API}/solicitudesSalida`),
      requestJson(`${API}/solicitudesEnviadas`),
      requestJson(`${API}/incumplimientos`),
      requestJson(`${API}/auditorias`),
      requestJson(`${API}/actividad`),
    ])

    db = {
      solicitudes: safeArray(solicitudes),
      solicitudesSalida: safeArray(solicitudesSalida),
      solicitudesEnviadas: safeArray(solicitudesEnviadas),
      incumplimientos: safeArray(incumplimientos),
      auditorias: safeArray(auditorias),
      actividad: safeArray(actividad),
    }
    showToast('Datos cargados desde API')
  } catch (error) {
    db = structuredClone(fallbackDb)
    showToast('API no disponible')
  }

  renderAll()
}

app.addEventListener('click', event => {
  const toggle = event.target.closest('.nav-toggle')
  if (toggle) {
    const group = toggle.closest('.nav-group')
    const wasOpen = group.classList.contains('open')
    document.querySelectorAll('.nav-group.open').forEach(open => open.classList.remove('open'))
    if (!wasOpen) group.classList.add('open')
    return
  }

  const navigation = event.target.closest('nav a, .sidebar-bottom > a')
  if (navigation && navigation.hash) {
    event.preventDefault()
    setView(navigation.hash.slice(1))
    return
  }

  const filter = event.target.closest('.filter')
  if (filter) {
    document.querySelectorAll('.filter').forEach(button => button.classList.remove('active'))
    filter.classList.add('active')
    renderAlerts(filter.dataset.filter)
    return
  }

  const more = event.target.closest('.more')
  if (more && more.nextElementSibling?.classList.contains('row-menu')) {
    document.querySelectorAll('.row-menu.open').forEach(menu => menu !== more.nextElementSibling && menu.classList.remove('open'))
    more.nextElementSibling.classList.toggle('open')
    return
  }

  const send = event.target.closest('[data-send]')
  if (send) {
    const item = safeArray(db.solicitudesSalida)[Number(send.dataset.send)]
    if (!item) return
    item.estado = 'Enviada'
    const payload = { estado: item.estado }
    fetch(`${API}/solicitudesSalida/${item.id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    }).catch(() => undefined)
    renderOutgoing()
    renderSent()
    showToast(`Respuesta enviada a ${item.empresa}`)
  }
})

app.addEventListener('change', event => {
  const control = event.target
  if (control.id === 'dark-mode-toggle') {
    setDarkMode(control.checked)
    return
  }

  const outgoingIndex = control.dataset.outgoingPriority ?? control.dataset.outgoingStatus
  const item = outgoingIndex !== undefined ? safeArray(db.solicitudesSalida)[Number(outgoingIndex)] : null
  if (!item) return

  if (control.dataset.outgoingPriority) item.prioridad = control.value
  if (control.dataset.outgoingStatus) item.estado = control.value

  fetch(`${API}/solicitudesSalida/${item.id}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ prioridad: item.prioridad, estado: item.estado }),
  }).catch(() => undefined)

  const row = control.closest('.request-row')
  if (row) {
    setText(row, '[data-field="prioridad"]', item.prioridad)
    setText(row, '[data-field="estado"]', item.estado)
    const priorityNode = row.querySelector('[data-field="prioridad"]')
    if (priorityNode) priorityNode.className = `priority ${String(item.prioridad).toLowerCase()}`
  }
  renderOutgoing()
  renderSent()
  showToast('Cambios guardados')
})

document.querySelector('#request-form')?.addEventListener('submit', async event => {
  event.preventDefault()
  const data = new FormData(event.currentTarget)
  const empresa = String(data.get('empresa') || '').trim()
  const sector = String(data.get('sector') || '').trim()
  const descripcion = String(data.get('descripcion') || '').trim()
  const prioridad = String(data.get('prioridad') || 'Media')
  const initials = empresa.split(/\s+/).map(word => word[0]).join('').slice(0, 2).toUpperCase() || 'SO'

  const item = {
    empresa,
    sector,
    descripcion,
    fecha: 'Ahora',
    prioridad,
    estado: 'Enviada',
    iniciales: initials,
    color: 'coral',
  }

  try {
    const saved = await requestJson(`${API}/solicitudesEnviadas`, {
      method: 'POST',
      body: JSON.stringify(item),
    })
    db.solicitudesEnviadas.unshift(saved || item)
  } catch {
    db.solicitudesEnviadas.unshift(item)
  }

  renderMySent()
  event.currentTarget.reset()
  showToast('Solicitud enviada correctamente')
})

document.addEventListener('click', event => {
  if (event.target.closest('.row-actions')) return
  document.querySelectorAll('.row-menu.open').forEach(menu => menu.classList.remove('open'))
})

document.querySelector('#audit-filter')?.addEventListener('change', event => renderAudits(event.target.value))
document.querySelector('#add-audit')?.addEventListener('click', () => document.querySelector('#audit-dialog')?.showModal())
document.querySelector('#audit-form')?.addEventListener('submit', async event => {
  event.preventDefault()
  const data = new FormData(event.currentTarget)
  const fecha = String(data.get('fecha') || '')
  const empresa = String(data.get('empresa') || '').trim()
  const tipo = String(data.get('tipo') || '')
  const audit = {
    fecha: new Date(`${fecha}T12:00:00`).toLocaleDateString('es-CR', { day: '2-digit', month: 'short', year: 'numeric' }),
    empresa,
    tipo,
    estado: 'Pendiente',
  }

  try {
    const saved = await requestJson(`${API}/auditorias`, {
      method: 'POST',
      body: JSON.stringify(audit),
    })
    db.auditorias.unshift(saved || audit)
  } catch {
    db.auditorias.unshift(audit)
  }

  renderAudits(document.querySelector('#audit-filter')?.value || 'Todas')
  renderMiniAudits()
  renderStats()
  document.querySelector('#audit-dialog')?.close()
  event.currentTarget.reset()
  showToast('Auditoría añadida correctamente')
})

window.addEventListener('hashchange', () => setView(window.location.hash.slice(1) || 'inicio'))

setDarkMode(localStorage.getItem('zofranca-dark-mode') === 'true')
renderAll()
loadDb()
setView(window.location.hash.slice(1) || 'inicio')
