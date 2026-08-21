/**
 * Centro de documentación técnica.
 * Descarga documentos de demostración generados localmente; la estructura
 * admite reemplazarlos por archivos reales agregando `url` en data/documents.js.
 */
import { documents } from '../data/documents.js'
import { el, esc, formatDate } from '../ui/dom.js'
import { icon } from '../ui/icons.js'
import { downloadDemoPdf } from '../ui/demoPdf.js'
import { showToast } from '../ui/toast.js'

const download = doc => {
  downloadDemoPdf({
    filename: `${doc.id}-demo.pdf`,
    title: doc.name,
    subtitle: 'MedTech Precision - Documento de demostracion',
    body: [
      'Tipo de documento: ' + doc.type,
      'Fecha de emision: ' + formatDate(doc.date),
      '',
      'Resumen: ' + doc.description,
      '',
      'Este archivo es una muestra generada en su navegador con fines de demostracion.',
      'La version definitiva acompanara cada proceso comercial o de auditoria cuando se trate',
      'de documentacion vigente y autorizada por MedTech Precision.',
    ],
  })
  showToast(`Descargando "${doc.name}" (demostración)`)
}

export const renderDocumentation = () => {
  const list = document.querySelector('#docs-list')
  if (!list) return

  list.replaceChildren(
    ...documents.map(doc => {
      const card = el(`
        <article class="doc-card reveal">
          <span class="doc-icon" aria-hidden="true">${icon('fileText')}</span>
          <div class="doc-body">
            <div class="doc-meta">
              <span class="tag tag-category">${esc(doc.type)}</span>
              <time datetime="${esc(doc.date)}">${esc(formatDate(doc.date))}</time>
            </div>
            <h3>${esc(doc.name)}</h3>
            <p>${esc(doc.description)}</p>
          </div>
          <button type="button" class="btn btn-outline btn-sm" data-doc="${esc(doc.id)}">
            ${icon('download')} Descargar
          </button>
        </article>`)
      return card
    }),
  )

  list.addEventListener('click', event => {
    const button = event.target.closest('[data-doc]')
    if (!button) return
    const doc = documents.find(item => item.id === button.dataset.doc)
    if (doc) download(doc)
  })
}
