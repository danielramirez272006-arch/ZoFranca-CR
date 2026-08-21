import '../css/style.css'
import '../css/polish.css'
import db from '../db.json'
import { leerSesion, cerrarSesion, iniciarControlInactividad } from './sesion.js'

const usuario = leerSesion()
if (!usuario) { window.location.href = 'login.html'; throw new Error('No autenticado') }

const escaparHtml = texto => String(texto).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]))
const nombreSeguro = escaparHtml(usuario.nombre)
const rolSeguro = escaparHtml(usuario.rol)

iniciarControlInactividad()

const isAdmin = usuario.rol === 'Administrador'
const solicitudes = db.solicitudes
const solicitudesSalida = db.solicitudesSalida
const incumplimientos = db.incumplimientos
let auditorias = [...db.auditorias]

const initials = (name) => name.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase()

const app = document.querySelector('#app')

app.innerHTML = `<div class="shell">
  <aside class="sidebar">
    <div class="brand"><span class="brand-mark">Z</span><span>ZoFranca <em>CR</em></span></div>
    <div class="workspace"><span>Operaciones</span><span class="icon" aria-hidden="true">⌄</span></div>
    <nav aria-label="Navegación principal">
      <a class="active" href="#inicio"><span class="icon" aria-hidden="true">▦</span> Inicio</a>
      <a href="#solicitudes"><span class="icon" aria-hidden="true">⌁</span> Solicitudes <b>${solicitudes.length}</b></a>
      <a href="#incumplimientos"><span class="icon" aria-hidden="true">!</span> Incumplimientos <b class="red">${incumplimientos.length}</b></a>
      <a href="#auditorias"><span class="icon" aria-hidden="true">◷</span> Auditorías</a>
    </nav>
    <div class="sidebar-bottom">
      ${isAdmin ? '<a href="#configuracion"><span class="icon" aria-hidden="true">⚙</span> Configuración</a>' : ''}
      <div class="profile">
        <span class="avatar dark">${initials(nombreSeguro)}</span>
        <span>
          <strong>${nombreSeguro}</strong>
          <small>${rolSeguro}</small>
        </span>
        <button id="logout-btn" class="icon" aria-label="Cerrar sesión" style="margin-left:auto;cursor:pointer;border:none;background:none;color:#8292a4;font-size:14px;" title="Cerrar sesión">⏻</button>
      </div>
    </div>
  </aside>
  <main>
    <header>
      <button class="mobile-menu" aria-label="Abrir menú">☰</button>
      <div>
        <p class="eyebrow">Panel de control</p>
        <h1>Buenos días, ${nombreSeguro.split(' ')[0]} <span>✦</span></h1>
      </div>
      <div class="header-actions">
        <button class="icon-button" aria-label="Notificaciones"><span class="icon" aria-hidden="true">♧</span><i></i></button>
        ${isAdmin ? '<button class="new-button" id="new-audit"><span class="icon">+</span> Nueva auditoría</button>' : ''}
      </div>
    </header>
    <section class="stats" aria-label="Resumen operativo">
      <div class="stat-card"><span class="stat-icon coral-bg"><span class="icon">⌁</span></span><div><span>Solicitudes entrantes</span><strong>${solicitudes.length}</strong><small class="up">↗ 18% <em>vs. mes anterior</em></small></div></div>
      <div class="stat-card"><span class="stat-icon amber-bg"><span class="icon">!</span></span><div><span>Alertas activas</span><strong>${String(incumplimientos.length).padStart(2, '0')}</strong><small class="down">↘ 4% <em>vs. mes anterior</em></small></div></div>
      <div class="stat-card"><span class="stat-icon green-bg"><span class="icon">✓</span></span><div><span>Auditorías pendientes</span><strong>${String(auditorias.filter(a => a.estado === 'Pendiente').length).padStart(2, '0')}</strong><small><em>Próxima: en 2 días</em></small></div></div>
    </section>
    <section class="content-grid">
      <div class="panel requests" id="solicitudes">
        <div class="panel-heading"><div><h2>Solicitudes recientes</h2><p>Revisa y prioriza las nuevas solicitudes de instalación.</p></div><a href="#solicitudes">Ver todas <span class="icon">→</span></a></div>
        <div class="request-head"><span>EMPRESA</span><span>RECIBIDA</span><span>PRIORIDAD</span><span>ESTADO</span></div>
        <div id="request-list"></div>
      </div>
      <div class="panel alerts" id="incumplimientos">
        <div class="panel-heading"><div><h2>Incumplimientos</h2><p>Detecta a tiempo las desviaciones de las empresas.</p></div><span class="count">${incumplimientos.length} activas</span></div>
        <div class="filter-bar"><button class="filter active" data-filter="Todos">Todos <span>${incumplimientos.length}</span></button><button class="filter" data-filter="Alto">Alta <span>${incumplimientos.filter(i => i.nivel === 'Alto').length}</span></button><button class="filter" data-filter="Medio">Media <span>${incumplimientos.filter(i => i.nivel === 'Medio').length}</span></button></div>
        <div id="alert-list"></div>
      </div>
    </section>
    <section class="panel outgoing-panel" id="salidas">
      <div class="panel-heading"><div><h2>Respuestas y entregas</h2><p>Asigna prioridad, actualiza el estado y envía cuando la respuesta esté lista.</p></div><span class="count outgoing-count">${solicitudesSalida.filter(s => s.estado !== 'Enviada').length} pendientes</span></div>
      <div class="request-head outgoing-head"><span>EMPRESA</span><span>FECHA</span><span>PRIORIDAD</span><span>ESTADO</span><span>ACCIÓN</span></div>
      <div id="outgoing-list"></div>
    </section>
    <section class="panel sent-panel" id="enviadas">
      <div class="panel-heading"><div><h2>Enviadas</h2><p>Respuestas y documentos entregados recientemente.</p></div><span class="count sent-count">${solicitudesSalida.filter(s => s.estado === 'Enviada').length} enviadas</span></div>
      <div class="request-head outgoing-head"><span>EMPRESA</span><span>FECHA</span><span>PRIORIDAD</span><span>ESTADO</span></div>
      <div id="sent-list"></div>
    </section>
    <section class="panel audits" id="auditorias">
      <div class="panel-heading"><div><h2>Agenda de auditorías</h2><p>Control de revisiones programadas y tareas pendientes.</p></div>
        <div class="audit-tools"><select id="audit-filter" aria-label="Filtrar auditorías"><option value="Todas">Todas las fechas</option><option value="Pendiente">Solo pendientes</option><option value="Programada">Programadas</option></select>${isAdmin ? '<button class="outline-button" id="add-audit"><span class="icon">+</span> Añadir auditoría</button>' : ''}</div>
      </div>
      <div class="audit-table">
        <div class="audit-head"><span>FECHA</span><span>EMPRESA</span><span>TIPO DE AUDITORÍA</span><span>ESTADO</span><span></span></div>
        <div id="audit-list"></div>
      </div>
    </section>
    ${isAdmin ? `
    <section class="panel standalone-view configuration-view" id="configuracion">
      <div class="panel-heading"><div><h2>Configuración</h2><p>Personaliza las reglas y preferencias de ZoFranca CR.</p></div></div>
      <div class="settings-grid">
        <label class="setting theme-setting"><span><strong>Apariencia</strong><small>Cambia toda la interfaz entre modo claro y oscuro.</small></span><input type="checkbox" id="dark-mode-toggle" aria-label="Activar modo oscuro"><i class="toggle"></i></label>
        <label class="setting"><span><strong>Alertas de incumplimiento</strong><small>Recibir avisos cuando un reporte se retrase.</small></span><input type="checkbox" checked><i class="toggle"></i></label>
        <label class="setting"><span><strong>Resumen diario</strong><small>Enviar un resumen de solicitudes cada mañana.</small></span><input type="checkbox" checked><i class="toggle"></i></label>
        <label class="setting"><span><strong>Umbral de prioridad alta</strong><small>Solicitudes que requieren revisión inmediata.</small></span><select><option>Menos de 48 horas</option><option>Menos de 24 horas</option><option>Menos de 12 horas</option></select></label>
      </div>
    </section>` : ''}
  </main>
</div>
<div class="toast" id="toast" role="status"></div>
<dialog id="audit-dialog">
  <form method="dialog" id="audit-form"><button class="close" value="cancel" aria-label="Cerrar">×</button>
    <p class="eyebrow">Control operativo</p>
    <h2>Programar auditoría</h2><label>Empresa<input name="empresa" required placeholder="Nombre de la empresa"></label><label>Fecha<input name="fecha" type="date" required></label><label>Tipo<select name="tipo"><option>Auditoría de cumplimiento</option><option>Revisión de mercadería</option><option>Auditoría de instalación</option></select></label><button class="new-button" type="submit">Guardar auditoría</button>
  </form>
</dialog>
<template id="request-template">
  <article class="request-row editable-row">
    <div class="avatar" data-field="avatar"></div>
    <div class="request-main"><strong data-field="empresa"></strong><span data-field="detalle"></span></div>
    <span class="date" data-field="fecha"></span><span class="priority" data-field="prioridad"><i></i></span><span class="status" data-field="estado"></span>
    <div class="row-actions"><button class="more" aria-label="Más opciones">•••</button>
      <div class="row-menu"><label>Prioridad<select data-control="priority"></select></label><label>Estado<select data-control="status"></select></label></div>
    </div>
  </article>
</template>
<template id="outgoing-template">
  <article class="request-row outgoing-row editable-row">
    <div class="avatar" data-field="avatar"></div>
    <div class="request-main"><strong data-field="empresa"></strong><span data-field="detalle"></span></div>
    <span class="date" data-field="fecha"></span><span class="priority" data-field="prioridad"><i></i></span><span class="status outgoing-status" data-field="estado"></span>
    <div class="row-actions"><button class="more" aria-label="Más opciones">•••</button>
      <div class="row-menu"><label>Prioridad<select data-control="priority"></select></label><label>Estado<select data-control="status"></select></label></div>
    </div><button class="send-button" data-send>Enviar</button>
  </article>
</template>
<template id="alert-template">
  <article class="alert-row"><span class="alert-icon">!</span>
    <div><strong data-field="empresa"></strong><span data-field="detalle"></span></div><time data-field="fecha"></time><span class="alert-level" data-field="nivel"></span>
  </article>
</template>
<template id="audit-template">
  <div class="audit-row"><span class="audit-date"><strong data-field="fecha"></strong></span><strong data-field="empresa"></strong><span data-field="detalle"></span><span class="audit-status"><i></i><span data-field="estado"></span></span>${isAdmin ? '<button class="more" aria-label="Más opciones">•••</button>' : ''}</div>
</template>`

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
  if (darkModeToggle) darkModeToggle.checked = enabled
  localStorage.setItem('zofranca-dark-mode', String(enabled))
}

const setView = view => {
  const validViews = ['inicio', 'solicitudes', 'incumplimientos', 'auditorias', 'configuracion']
  const nextView = validViews.includes(view) ? view : 'inicio'
  if (nextView === 'configuracion' && !isAdmin) { setView('inicio'); return }
  mainView.dataset.view = nextView
  document.querySelectorAll('nav a, .sidebar-bottom > a').forEach(link => link.classList.toggle('active', link.hash === `#${nextView}`))
  if (window.location.hash !== `#${nextView}`) history.replaceState(null, '', `#${nextView}`)
  window.scrollTo({ top: 0, behavior: 'smooth' })
}

document.querySelector('#logout-btn')?.addEventListener('click', () => {
  cerrarSesion()
  window.location.href = 'login.html'
})

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

const auditFilter = document.querySelector('#audit-filter')
if (auditFilter) auditFilter.addEventListener('change', event => renderAudits(event.target.value))

const addAuditBtn = document.querySelector('#add-audit')
if (addAuditBtn) addAuditBtn.addEventListener('click', () => document.querySelector('#audit-dialog').showModal())

document.querySelector('#audit-form')?.addEventListener('submit', event => {
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
