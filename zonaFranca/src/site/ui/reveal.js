/**
 * Animaciones de aparición al hacer scroll y resaltado del enlace activo
 * en la barra de navegación. Respeta `prefers-reduced-motion`.
 */

const prefersReducedMotion = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches

/** Observa elementos .reveal y agrega .is-visible al entrar en pantalla. */
export const initReveal = () => {
  const items = document.querySelectorAll('.reveal')
  if (!items.length) return

  if (prefersReducedMotion() || !('IntersectionObserver' in window)) {
    items.forEach(item => item.classList.add('is-visible'))
    return
  }

  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return
      entry.target.classList.add('is-visible')
      observer.unobserve(entry.target)
    })
  }, { threshold: 0.15, rootMargin: '0px 0px -40px 0px' })

  items.forEach(item => observer.observe(item))
}

/** Marca como activo el enlace de navegación de la sección visible. */
export const initActiveNav = () => {
  const links = document.querySelectorAll('[data-nav-link]')
  if (!links.length) return

  const sections = [...links]
    .map(link => document.querySelector(link.getAttribute('href')))
    .filter(Boolean)

  if (!sections.length || !('IntersectionObserver' in window)) return

  const setActive = id => {
    links.forEach(link => link.classList.toggle('active', link.getAttribute('href') === `#${id}`))
  }

  const observer = new IntersectionObserver(entries => {
    const visible = entries
      .filter(entry => entry.isIntersecting)
      .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0]
    if (visible) setActive(visible.target.id)
  }, { rootMargin: '-40% 0px -55% 0px', threshold: [0, 0.1, 0.5] })

  sections.forEach(section => observer.observe(section))
}
