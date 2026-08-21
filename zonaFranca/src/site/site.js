/**
 * Sitio corporativo MedTech Precision — punto de entrada.
 * Importa estilos, monta los datos en cada sección e inicializa
 * los comportamientos compartidos (navbar, reveal, contadores, modales).
 */
import './styles/base.css'
import './styles/components.css'
import './styles/sections.css'

import { initNavbar } from './components/navbar.js'
import { renderStats } from './components/stats.js'
import { renderAbout } from './components/about.js'
import { initProducts } from './components/products.js'
import { renderDocumentation } from './components/documentation.js'
import { renderQuality } from './components/quality.js'
import { renderManufacturing } from './components/manufacturing.js'
import { renderExportMarkets, renderMarketChips } from './components/exportMarkets.js'
import { renderWhyUs } from './components/whyUs.js'
import { renderCareers } from './components/careers.js'
import { initContact } from './components/contact.js'
import { renderSocials, initLegalModals } from './components/footer.js'
import { initReveal, initActiveNav } from './ui/reveal.js'
import { initCounters } from './ui/counters.js'

const mount = () => {
  renderStats()
  renderAbout()
  initProducts()
  renderDocumentation()
  renderQuality()
  renderManufacturing()
  renderExportMarkets()
  renderMarketChips()
  renderWhyUs()
  renderCareers()
  renderSocials()

  initNavbar()
  initContact()
  initLegalModals()
  initReveal()
  initActiveNav()
  initCounters()
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', mount)
} else {
  mount()
}

// Cierre genérico de diálogos (botones data-close-modal y clic en el fondo)
document.addEventListener('click', event => {
  const closeButton = event.target.closest('[data-close-modal]')
  if (closeButton) {
    closeButton.closest('dialog')?.close()
    return
  }
  if (event.target instanceof HTMLDialogElement) event.target.close()
})
