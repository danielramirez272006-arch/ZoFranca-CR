/** Indicadores de capacidad bajo el hero (contadores animados). */
import { statistics } from '../data/company.js'
import { el, esc } from '../ui/dom.js'

export const renderStats = () => {
  const grid = document.querySelector('#stats-grid')
  if (!grid) return

  grid.replaceChildren(
    ...statistics.map((stat, index) => {
      const decimals = stat.decimals ?? 0
      return el(`
        <article class="stat-card reveal" style="--stagger:${index}">
          <strong class="stat-value" data-count="${stat.value}" data-suffix="${esc(stat.suffix)}" data-decimals="${decimals}">0${esc(stat.suffix)}</strong>
          <span class="stat-label">${esc(stat.label)}</span>
        </article>
      `)
    }),
  )
}
