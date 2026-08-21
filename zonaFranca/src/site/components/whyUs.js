/** Diferenciadores — ¿Por qué elegir MedTech Precision? */
import { differentiators } from '../data/company.js'
import { el, esc } from '../ui/dom.js'
import { icon } from '../ui/icons.js'

export const renderWhyUs = () => {
  const grid = document.querySelector('#whyus-grid')
  if (!grid) return
  grid.replaceChildren(
    ...differentiators.map(item => el(`
      <article class="whyus-card reveal">
        <span class="whyus-icon" aria-hidden="true">${icon(item.icon)}</span>
        <h3>${esc(item.title)}</h3>
        <p>${esc(item.text)}</p>
      </article>`)),
  )
}
