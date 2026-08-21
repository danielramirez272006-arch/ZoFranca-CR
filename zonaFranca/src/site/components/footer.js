/** Footer: redes sociales de demostración y modales legales. */
import { el, esc } from '../ui/dom.js'

const socials = [
  { name: 'LinkedIn', url: 'https://www.linkedin.com', path: '<path d="M6.5 9.5v8M6.5 6.4h.01"/><rect x="3" y="3" width="18" height="18" rx="3"/><path d="M10.5 17.5v-5a2.5 2.5 0 0 1 5 0v5"/>' },
  { name: 'Facebook', url: 'https://www.facebook.com', path: '<path d="M14.5 8.5H16V5.8h-2a3.2 3.2 0 0 0-3.2 3.2v2H9v2.7h1.8V21h3v-7.3h2.1l.4-2.7h-2.5V9.3a.8.8 0 0 1 .8-.8z" fill="currentColor" stroke="none"/>' },
  { name: 'Instagram', url: 'https://www.instagram.com', path: '<rect x="3.5" y="3.5" width="17" height="17" rx="4.5"/><circle cx="12" cy="12" r="4"/><path d="M17 7h.01"/>' },
  { name: 'X', url: 'https://x.com', path: '<path d="M5 5l14 14M19 5L5 19"/>' },
  { name: 'YouTube', url: 'https://www.youtube.com', path: '<rect x="3" y="6.5" width="18" height="11" rx="3"/><path d="M11 10l3.5 2L11 14z" fill="currentColor" stroke="none"/>' },
]

const legalContent = {
  terminos: {
    title: 'Términos y condiciones',
    body: [
      'Este sitio es un proyecto de demostración. Los contenidos, productos, cifras y capacidades descritos son ficticios y se presentan únicamente con fines ilustrativos.',
      'El uso de este sitio implica aceptar que la información técnica y comercial mostrada no constituye una oferta formal ni genera obligaciones para MedTech Precision.',
      'Para procesos reales, los términos definitivos se establecerían en contratos y cotizaciones formales entre las partes.',
    ],
  },
  privacidad: {
    title: 'Política de privacidad',
    body: [
      'Los formularios de este sitio de demostración registran datos únicamente con fines técnicos de prueba.',
      'Si el servidor local de demostración (json-server) está disponible, los datos se envían a ese servicio en su equipo; de lo contrario se guardan solo en su navegador (localStorage). Ninguna información se comparte con terceros.',
      'Un despliegue real requeriría una política de tratamiento de datos conforme a la legislación vigente en Costa Rica (Ley 8968) y estándares internacionales aplicables.',
    ],
  },
  cookies: {
    title: 'Política de cookies',
    body: [
      'Este sitio no utiliza cookies de seguimiento ni analítica de terceros.',
      'Se emplean mecanismos locales del navegador (localStorage) exclusivamente como respaldo de los datos enviados a los formularios cuando el servidor de demostración no está disponible.',
      'Puede eliminar estos registros en cualquier momento borrando los datos del sitio desde la configuración de su navegador.',
    ],
  },
}

export const renderSocials = () => {
  const list = document.querySelector('#social-list')
  if (!list) return
  list.replaceChildren(
    ...socials.map(social => {
      const item = document.createElement('li')
      item.innerHTML = `
        <a href="${esc(social.url)}" target="_blank" rel="noopener noreferrer"
           aria-label="${esc(social.name)} (perfil de demostración)" title="${esc(social.name)} — perfil de demostración">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false">${social.path}</svg>
        </a>`
      return item
    }),
  )
}

export const initLegalModals = () => {
  const dialog = document.querySelector('#legal-dialog')
  const container = document.querySelector('#legal-dialog-body')
  if (!dialog || !container) return

  document.querySelectorAll('[data-legal]').forEach(button => {
    button.addEventListener('click', () => {
      const content = legalContent[button.dataset.legal]
      if (!content) return
      container.innerHTML = `
        <header class="modal-head">
          <div>
            <p class="eyebrow">Documento de demostración</p>
            <h3 id="legal-dialog-title">${esc(content.title)}</h3>
          </div>
          <button type="button" class="modal-close" data-close-modal aria-label="Cerrar">${'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"><path d="M6 6l12 12M18 6L6 18"/></svg>'}</button>
        </header>
        ${content.body.map(paragraph => `<p class="modal-desc">${esc(paragraph)}</p>`).join('')}
        <footer class="modal-actions">
          <button type="button" class="btn btn-primary btn-sm" data-close-modal>Entendido</button>
        </footer>`
      dialog.showModal()
    })
  })
}
