import './style.css'
import './polish.css'

const solicitudes = [
  { empresa: 'Nexa Components', sector: 'Manufactura avanzada', fecha: 'Hoy, 09:42', prioridad: 'Alta', estado: 'Nueva', iniciales: 'NC', color: 'coral' },
  { empresa: 'Pacific Data Lab', sector: 'Servicios / BPO', fecha: 'Hoy, 08:15', prioridad: 'Media', estado: 'En revisión', iniciales: 'PD', color: 'blue' },
  { empresa: 'VerdeLogix', sector: 'Tecnología limpia', fecha: 'Ayer, 16:30', prioridad: 'Baja', estado: 'Nueva', iniciales: 'VL', color: 'green' },
  { empresa: 'Altura Robotics', sector: 'Manufactura inteligente', fecha: 'Ayer, 13:20', prioridad: 'Alta', estado: 'Nueva', iniciales: 'AR', color: 'purple' },
  { empresa: 'Pura Vida Analytics', sector: 'Tecnología / Datos', fecha: 'Ayer, 11:05', prioridad: 'Media', estado: 'En revisión', iniciales: 'PA', color: 'orange' },
  { empresa: 'Central BioLabs', sector: 'Ciencias de la vida', fecha: '20 ago, 15:48', prioridad: 'Baja', estado: 'Nueva', iniciales: 'CB', color: 'blue' },
]
const solicitudesSalida = [
  { empresa: 'Innova Medical', tipo: 'Respuesta de instalación', fecha: 'Hoy, 10:20', estado: 'Lista para enviar', prioridad: 'Alta', iniciales: 'IM', color: 'purple' },
  { empresa: 'Caribe Logistics', tipo: 'Entrega de documentación', fecha: 'Ayer, 14:05', estado: 'En preparación', prioridad: 'Media', iniciales: 'CL', color: 'orange' },
  { empresa: 'Bosque Digital', tipo: 'Respuesta de cumplimiento', fecha: 'Ayer, 12:40', estado: 'Lista para enviar', prioridad: 'Alta', iniciales: 'BD', color: 'green' },
  { empresa: 'Norte Textiles', tipo: 'Entrega de resolución', fecha: '20 ago, 16:15', estado: 'En preparación', prioridad: 'Baja', iniciales: 'NT', color: 'blue' },
  { empresa: 'Alimentos del Valle', tipo: 'Respuesta de inspección', fecha: '20 ago, 13:30', estado: 'Lista para enviar', prioridad: 'Media', iniciales: 'AV', color: 'coral' },
  { empresa: 'Sierra Cloud', tipo: 'Entrega de aprobación', fecha: '19 ago, 09:10', estado: 'En preparación', prioridad: 'Alta', iniciales: 'SC', color: 'purple' },
  { empresa: 'Mar Azul Services', tipo: 'Respuesta de seguimiento', fecha: '18 ago, 16:45', estado: 'Enviada', prioridad: 'Baja', iniciales: 'MA', color: 'orange' },
  { empresa: 'Volcán Energy', tipo: 'Entrega de resolución', fecha: '18 ago, 11:25', estado: 'Enviada', prioridad: 'Media', iniciales: 'VE', color: 'green' },
]
const incumplimientos = [
  { empresa: 'TicoTech Solutions', tipo: 'Exportaciones', detalle: 'Reporte mensual pendiente', valor: 'Hace 8 días', nivel: 'Alto' },
  { empresa: 'Nexa Components', tipo: 'Empleo', detalle: '6 empleos por debajo del compromiso', valor: 'Hace 2 días', nivel: 'Medio' },
  { empresa: 'EcoPack CR', tipo: 'Mercadería', detalle: 'Diferencia entre manifiesto y reporte', valor: 'Hace 1 día', nivel: 'Medio' },
]
let auditorias = [
  { fecha: '22 ago 2024', empresa: 'TicoTech Solutions', tipo: 'Cumplimiento trimestral', estado: 'Pendiente' },
  { fecha: '28 ago 2024', empresa: 'Nexa Components', tipo: 'Auditoría de instalación', estado: 'Programada' },
  { fecha: '04 sep 2024', empresa: 'EcoPack CR', tipo: 'Revisión de mercadería', estado: 'Pendiente' },
]

const app = document.querySelector('#app')
const mainView = document.querySelector('main')
const toast = document.querySelector('#toast')
const darkModeToggle = document.querySelector('#dark-mode-toggle')
const templates = {
  request: document.querySelector('#request-template'),
  outgoing: document.querySelector('#outgoing-template'),
  alert: document.querySelector('#alert-template'),
  audit: document.querySelector('#audit-template'),
}
const statusValues = {
  request: ['Nueva', 'En revisión', 'Aprobada', 'Rechazada'],
  outgoing: ['En preparación', 'Lista para enviar', 'Enviada'],
}
const priorityValues = ['Alta', 'Media', 'Baja']

const setText = (element, selector, value) => {
  const target = element.querySelector(selector)
  if (target) target.textContent = value
}
const setOptions = (select, values, selected) => {
  select.replaceChildren(...values.map(value => { const option = new Option(value, value, false, value === selected); return option }))
}
const cloneTemplate = (name) => templates[name].content.firstElementChild.cloneNode(true)
const renderBaseRow = (row, item, detail) => {
  row.querySelector('[data-field="avatar"]').textContent = item.iniciales
  row.querySelector('[data-field="avatar"]').classList.add(item.color)
  setText(row, '[data-field="empresa"]', item.empresa)
  setText(row, '[data-field="detalle"]', detail)
  setText(row, '[data-field="fecha"]', item.fecha)
  setText(row, '[data-field="prioridad"]', item.prioridad)
  setText(row, '[data-field="estado"]', item.estado)
  row.querySelector('[data-field="prioridad"]').classList.add(item.prioridad.toLowerCase())
}
const renderRequestRow = (item, index) => {
  const row = cloneTemplate('request')
  renderBaseRow(row, item, item.sector)
  row.querySelector('[data-control="priority"]').dataset.requestPriority = index
  row.querySelector('[data-control="status"]').dataset.requestStatus = index
  setOptions(row.querySelector('[data-control="priority"]'), priorityValues, item.prioridad)
  setOptions(row.querySelector('[data-control="status"]'), statusValues.request, item.estado)
  return row
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
  setText(row, '[data-field="nivel"]', item.nivel)
  row.querySelector('[data-field="nivel"]').classList.add(item.nivel.toLowerCase())
  return row
}
const renderAuditRow = item => {
  const row = cloneTemplate('audit')
  setText(row, '[data-field="fecha"]', item.fecha)
  setText(row, '[data-field="empresa"]', item.empresa)
  setText(row, '[data-field="detalle"]', item.tipo)
  setText(row, '[data-field="estado"]', item.estado)
  row.querySelector('[data-field="estado"]').parentElement.classList.add(item.estado.toLowerCase())
  return row
}
const replaceChildren = (selector, rows) => document.querySelector(selector).replaceChildren(...rows)
const renderRequests = () => replaceChildren('#request-list', solicitudes.map(renderRequestRow))
const renderOutgoing = () => {
  const pending = solicitudesSalida.filter(item => item.estado !== 'Enviada')
  replaceChildren('#outgoing-list', pending.map(item => renderOutgoingRow(item, solicitudesSalida.indexOf(item))))
  document.querySelector('.outgoing-count').textContent = `${pending.length} pendientes`
}
const renderSent = () => {
  const sent = solicitudesSalida.filter(item => item.estado === 'Enviada')
  replaceChildren('#sent-list', sent.map(item => renderOutgoingRow(item, solicitudesSalida.indexOf(item))))
  document.querySelector('.sent-count').textContent = `${sent.length} enviadas`
}
const renderAlerts = (filter = 'Todos') => replaceChildren('#alert-list', incumplimientos.filter(item => filter === 'Todos' || item.nivel === filter).map(renderAlertRow))
const renderAudits = (filter = 'Todas') => replaceChildren('#audit-list', auditorias.filter(item => filter === 'Todas' || item.estado === filter).map(renderAuditRow))
const showToast = message => { toast.textContent = message; toast.classList.add('show'); clearTimeout(showToast.timer); showToast.timer = setTimeout(() => toast.classList.remove('show'), 2600) }
const setDarkMode = enabled => {
  document.documentElement.classList.toggle('dark-mode', enabled)
  darkModeToggle.checked = enabled
  darkModeToggle.setAttribute('aria-label', enabled ? 'Desactivar modo oscuro' : 'Activar modo oscuro')
  localStorage.setItem('zofranca-dark-mode', String(enabled))
}

const setView = view => {
  const validViews = ['inicio', 'solicitudes', 'incumplimientos', 'auditorias', 'configuracion']
  const nextView = validViews.includes(view) ? view : 'inicio'
  mainView.dataset.view = nextView
  document.querySelectorAll('nav a, .sidebar-bottom > a').forEach(link => link.classList.toggle('active', link.hash === `#${nextView}`))
  if (window.location.hash !== `#${nextView}`) history.replaceState(null, '', `#${nextView}`)
  window.scrollTo({ top: 0, behavior: 'smooth' })
}

app.addEventListener('click', event => {
  const navigation = event.target.closest('nav a, .sidebar-bottom > a')
  if (navigation) { event.preventDefault(); setView(navigation.hash.slice(1)); return }
  const filter = event.target.closest('.filter')
  if (filter) { document.querySelectorAll('.filter').forEach(button => button.classList.remove('active')); filter.classList.add('active'); renderAlerts(filter.dataset.filter); return }
  const more = event.target.closest('.more')
  if (more && more.nextElementSibling?.classList.contains('row-menu')) { document.querySelectorAll('.row-menu.open').forEach(menu => menu !== more.nextElementSibling && menu.classList.remove('open')); more.nextElementSibling.classList.toggle('open'); return }
  const send = event.target.closest('[data-send]')
  if (send) { const item = solicitudesSalida[Number(send.dataset.send)]; item.estado = 'Enviada'; renderOutgoing(); renderSent(); showToast(`Respuesta enviada a ${item.empresa}`) }
})
app.addEventListener('change', event => {
  const control = event.target
  if (control.id === 'dark-mode-toggle') { setDarkMode(control.checked); return }
  const requestIndex = control.dataset.requestPriority ?? control.dataset.requestStatus
  const outgoingIndex = control.dataset.outgoingPriority ?? control.dataset.outgoingStatus
  const item = requestIndex !== undefined ? solicitudes[Number(requestIndex)] : outgoingIndex !== undefined ? solicitudesSalida[Number(outgoingIndex)] : null
  if (!item) return
  if (control.dataset.requestPriority || control.dataset.outgoingPriority) item.prioridad = control.value
  if (control.dataset.requestStatus || control.dataset.outgoingStatus) item.estado = control.value
  const row = control.closest('.request-row')
  if (row) { setText(row, '[data-field="prioridad"]', item.prioridad); setText(row, '[data-field="estado"]', item.estado); row.querySelector('[data-field="prioridad"]').className = `priority ${item.prioridad.toLowerCase()}` }
  showToast('Cambios guardados')
})
document.addEventListener('click', event => {
  if (event.target.closest('.row-actions')) return
  document.querySelectorAll('.row-menu.open').forEach(menu => menu.classList.remove('open'))
})
document.querySelector('#audit-filter').addEventListener('change', event => renderAudits(event.target.value))
document.querySelector('#add-audit').addEventListener('click', () => document.querySelector('#audit-dialog').showModal())
document.querySelector('#audit-form').addEventListener('submit', event => {
  event.preventDefault()
  const data = new FormData(event.currentTarget)
  const date = new Date(`${data.get('fecha')}T12:00:00`)
  if (Number.isNaN(date.getTime())) return
  auditorias.unshift({ fecha: date.toLocaleDateString('es-CR', { day: '2-digit', month: 'short', year: 'numeric' }), empresa: data.get('empresa'), tipo: data.get('tipo'), estado: 'Pendiente' })
  renderAudits(document.querySelector('#audit-filter').value)
  document.querySelector('#audit-dialog').close()
  event.currentTarget.reset()
  showToast('Auditoría añadida correctamente')
})
window.addEventListener('hashchange', () => setView(window.location.hash.slice(1) || 'inicio'))

renderRequests()
renderOutgoing()
renderSent()
renderAlerts()
renderAudits()
setDarkMode(localStorage.getItem('zofranca-dark-mode') === 'true')
setView(window.location.hash.slice(1) || 'inicio')
