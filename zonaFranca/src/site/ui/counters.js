/**
 * Contadores animados para indicadores numéricos.
 * Se animan una sola vez al entrar en pantalla; con `prefers-reduced-motion`
 * muestran el valor final de inmediato.
 */

const format = (value, decimals) =>
  decimals > 0
    ? value.toFixed(decimals)
    : String(Math.round(value))

const animateCounter = node => {
  const target = Number(node.dataset.count)
  const suffix = node.dataset.suffix ?? ''
  const decimals = Number(node.dataset.decimals ?? 0)
  const duration = 1600

  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    node.textContent = `${format(target, decimals)}${suffix}`
    return
  }

  const start = performance.now()
  const tick = now => {
    const progress = Math.min((now - start) / duration, 1)
    const eased = 1 - Math.pow(1 - progress, 3)
    node.textContent = `${format(target * eased, decimals)}${suffix}`
    if (progress < 1) requestAnimationFrame(tick)
  }
  requestAnimationFrame(tick)
}

/** Inicializa todos los [data-count] visibles en el documento. */
export const initCounters = () => {
  const counters = document.querySelectorAll('[data-count]')
  if (!counters.length) return

  if (!('IntersectionObserver' in window)) {
    counters.forEach(animateCounter)
    return
  }

  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return
      animateCounter(entry.target)
      observer.unobserve(entry.target)
    })
  }, { threshold: 0.4 })

  counters.forEach(counter => observer.observe(counter))
}
