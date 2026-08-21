/** Utilidades mínimas de DOM compartidas por los componentes del sitio. */

/** Escapa texto para interpolación segura en plantillas HTML. */
export const esc = value =>
  String(value ?? '').replace(/[&<>"']/g, char => (
    { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[char]
  ))

/** Convierte una plantilla HTML en un nodo (primer elemento). */
export const el = html => {
  const template = document.createElement('template')
  template.innerHTML = html.trim()
  return template.content.firstElementChild
}

/** Selecciona un elemento raíz opcionalmente dentro de un contenedor. */
export const qs = (selector, root = document) => root.querySelector(selector)

/** Formatea fechas ISO como "15 ene 2026" en español. */
export const formatDate = iso => {
  const date = new Date(`${iso}T12:00:00`)
  if (Number.isNaN(date.getTime())) return String(iso)
  return new Intl.DateTimeFormat('es-CR', { day: '2-digit', month: 'short', year: 'numeric' }).format(date)
}

/** Desplazamiento suave hacia un elemento considerando la navbar fija. */
export const scrollToSection = selector => {
  const target = document.querySelector(selector)
  if (!target) return
  target.scrollIntoView({ behavior: 'smooth', block: 'start' })
}
