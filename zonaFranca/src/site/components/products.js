/**
 * Catálogo de productos: filtros (categoría, aplicación, tipo de dispositivo),
 * búsqueda por texto y renderizado dinámico de tarjetas con estado vacío.
 */
import { products } from '../data/products.js'
import { el, esc } from '../ui/dom.js'
import { icon } from '../ui/icons.js'
import { downloadDemoPdf } from '../ui/demoPdf.js'
import { showToast } from '../ui/toast.js'
import { renderProductCard } from './productCard.js'

const filters = { search: '', category: '', application: '', device: '' }

/** Abre el diálogo con la ficha técnica del producto (demo). */
export const openProductSheet = productId => {
  const product = products.find(item => item.id === productId)
  const dialog = document.querySelector('#sheet-dialog')
  const body = document.querySelector('#sheet-dialog-body')
  if (!product || !dialog || !body) return

  body.innerHTML = `
    <header class="modal-head">
      <div>
        <p class="eyebrow">Ficha técnica · demostración</p>
        <h3 id="sheet-dialog-title">${esc(product.name)}</h3>
      </div>
      <button type="button" class="modal-close" data-close-modal aria-label="Cerrar">${icon('close')}</button>
    </header>
    <p class="modal-desc">${esc(product.description)}</p>
    <table class="spec-table">
      <caption class="visually-hidden">Especificaciones de ${esc(product.name)}</caption>
      <tbody>
        <tr><th scope="row">Categoría</th><td>${esc(product.category)}</td></tr>
        <tr><th scope="row">Tipo de dispositivo</th><td>${esc(product.deviceType)}</td></tr>
        <tr><th scope="row">Aplicaciones</th><td>${esc(product.applications.join(', '))}</td></tr>
        <tr><th scope="row">Características</th><td>${esc(product.features.join(' · '))}</td></tr>
        <tr><th scope="row">Trazabilidad</th><td>Lote y fecha documentados por unidad</td></tr>
      </tbody>
    </table>
    <footer class="modal-actions">
      <button type="button" class="btn btn-primary" data-download-sheet="${esc(product.id)}">${icon('download')} Descargar ficha (PDF demo)</button>
      <button type="button" class="btn btn-outline" data-request-info="${esc(product.id)}">Solicitar información</button>
    </footer>`

  dialog.showModal()
}

const downloadSheet = productId => {
  const product = products.find(item => item.id === productId)
  if (!product) return
  downloadDemoPdf({
    filename: `ficha-${product.id}-demo.pdf`,
    title: `Ficha tecnica - ${product.name}`,
    subtitle: 'MedTech Precision - Documento de demostracion',
    body: [
      'Descripcion: ' + product.description,
      'Categoria: ' + product.category,
      'Tipo de dispositivo: ' + product.deviceType,
      'Aplicaciones: ' + product.applications.join(', '),
      '',
      'Caracteristicas principales:',
      ...product.features.map(feature => `- ${feature}`),
      '',
      'Nota: Este archivo es una muestra generada automaticamente para fines de demostracion.',
      'Las especificaciones definitivas se entregan junto a cada cotizacion formal.',
    ],
  })
  showToast('Ficha técnica de demostración descargada')
}

const fillSelect = (select, values, placeholder = 'Todas') => {
  if (!select) return
  const options = [`<option value="">${placeholder}</option>`]
    .concat(values.map(value => `<option value="${esc(value)}">${esc(value)}</option>`))
  select.replaceChildren(...options.map(html => el(html)))
}

const uniqueSorted = values => [...new Set(values)].sort((a, b) => a.localeCompare(b, 'es'))

const matches = product => {
  const term = filters.search.trim().toLowerCase()
  const haystack = `${product.name} ${product.description} ${product.applications.join(' ')}`.toLowerCase()
  return (
    (!term || haystack.includes(term)) &&
    (!filters.category || product.category === filters.category) &&
    (!filters.application || product.applications.includes(filters.application)) &&
    (!filters.device || product.deviceType === filters.device)
  )
}

const applyFilters = () => {
  const grid = document.querySelector('#product-grid')
  const empty = document.querySelector('#products-empty')
  const meta = document.querySelector('#products-meta')
  if (!grid || !empty || !meta) return

  const visible = products.filter(matches)
  meta.textContent = visible.length === products.length
    ? `Mostrando los ${products.length} productos del catálogo`
    : `${visible.length} de ${products.length} productos coinciden`

  grid.replaceChildren(...visible.map(renderProductCard))
  grid.querySelectorAll('.reveal').forEach(node => node.classList.add('is-visible'))
  empty.hidden = visible.length > 0
  grid.hidden = visible.length === 0
}

const resetFilters = () => {
  filters.search = ''
  filters.category = ''
  filters.application = ''
  filters.device = ''
  const search = document.querySelector('#product-search')
  if (search) search.value = ''
  ;['#filter-category', '#filter-application', '#filter-device'].forEach(selector => {
    const node = document.querySelector(selector)
    if (node) node.value = ''
  })
  applyFilters()
}

export const requestProductInfo = productId => {
  const product = products.find(item => item.id === productId)
  const contactForm = document.querySelector('#contact-form')
  if (product && contactForm) {
    const select = contactForm.querySelector('#cf-producto')
    if (select) select.value = product.id
  }
  document.querySelector('#contacto')?.scrollIntoView({ behavior: 'smooth' })
  showToast(`Producto seleccionado: ${product ? product.name : ''}`)
  const sheetDialog = document.querySelector('#sheet-dialog')
  if (sheetDialog?.open) sheetDialog.close()
}

export const initProducts = () => {
  const grid = document.querySelector('#product-grid')
  if (!grid) return

  fillSelect(document.querySelector('#filter-category'), uniqueSorted(products.map(p => p.category)))
  fillSelect(document.querySelector('#filter-application'), uniqueSorted(products.flatMap(p => p.applications)))
  fillSelect(document.querySelector('#filter-device'), uniqueSorted(products.map(p => p.deviceType)), 'Todos')

  // Poblar selector "producto de interés" del formulario de contacto
  const contactSelect = document.querySelector('#cf-producto')
  if (contactSelect) {
    products.forEach(product => {
      contactSelect.appendChild(el(`<option value="${esc(product.id)}">${esc(product.name)}</option>`))
    })
  }

  document.querySelector('#product-search')?.addEventListener('input', event => {
    filters.search = event.target.value
    applyFilters()
  })

  const bindFilter = (selector, key) => {
    document.querySelector(selector)?.addEventListener('change', event => {
      filters[key] = event.target.value
      applyFilters()
    })
  }
  bindFilter('#filter-category', 'category')
  bindFilter('#filter-application', 'application')
  bindFilter('#filter-device', 'device')

  document.querySelector('#clear-filters')?.addEventListener('click', resetFilters)
  document.querySelector('[data-clear-products]')?.addEventListener('click', () => {
    resetFilters()
    document.querySelector('#product-search')?.focus()
  })

  grid.addEventListener('click', event => {
    const sheetButton = event.target.closest('[data-sheet]')
    if (sheetButton) openProductSheet(sheetButton.dataset.sheet)
    const infoButton = event.target.closest('[data-request-info]')
    if (infoButton) requestProductInfo(infoButton.dataset.requestInfo)
  })

  document.addEventListener('click', event => {
    const download = event.target.closest('[data-download-sheet]')
    if (download) downloadSheet(download.dataset.downloadSheet)
    const info = event.target.closest('.modal [data-request-info]')
    if (info) requestProductInfo(info.dataset.requestInfo)
  })

  applyFilters()
}
