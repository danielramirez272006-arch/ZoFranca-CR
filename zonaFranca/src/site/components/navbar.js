/**
 * Navbar fija: estado de scroll, menú hamburguesa accesible y cierre
 * del menú móvil al navegar.
 */
import { qs } from '../ui/dom.js'

export const initNavbar = () => {
  const navbar = qs('#navbar')
  const toggle = qs('#nav-toggle')
  const nav = qs('#primary-nav')
  if (!navbar || !toggle || !nav) return

  const setScrolled = () => navbar.classList.toggle('scrolled', window.scrollY > 24)
  setScrolled()
  window.addEventListener('scroll', setScrolled, { passive: true })

  const closeMenu = () => {
    nav.classList.remove('open')
    toggle.setAttribute('aria-expanded', 'false')
    toggle.setAttribute('aria-label', 'Abrir menú de navegación')
    document.body.classList.remove('nav-locked')
  }

  toggle.addEventListener('click', () => {
    const isOpen = !nav.classList.contains('open')
    nav.classList.toggle('open', isOpen)
    document.body.classList.toggle('nav-locked', isOpen && window.innerWidth <= 960)
    toggle.setAttribute('aria-expanded', String(isOpen))
    toggle.setAttribute('aria-label', isOpen ? 'Cerrar menú de navegación' : 'Abrir menú de navegación')
  })

  nav.addEventListener('click', event => {
    if (event.target.closest('a')) closeMenu()
  })

  document.addEventListener('keydown', event => {
    if (event.key === 'Escape') closeMenu()
  })

  document.addEventListener('click', event => {
    if (
      nav.classList.contains('open') &&
      !nav.contains(event.target) &&
      !toggle.contains(event.target)
    ) {
      closeMenu()
    }
  })
}
