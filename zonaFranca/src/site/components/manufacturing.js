/** Manufactura: áreas de producción, flujo productivo y números de capacidad. */
import { manufacturingAreas, manufacturingFlow, capacityStats } from '../data/company.js'
import { el, esc } from '../ui/dom.js'
import { icon } from '../ui/icons.js'

export const renderManufacturing = () => {
  const areas = document.querySelector('#area-grid')
  if (areas) {
    areas.replaceChildren(
      ...manufacturingAreas.map(area => el(`
        <article class="area-card reveal">
          <span class="area-icon" aria-hidden="true">${icon(area.icon)}</span>
          <h3>${esc(area.title)}</h3>
          <p>${esc(area.text)}</p>
        </article>`)),
    )
  }

  const flow = document.querySelector('#flow-steps')
  if (flow) {
    flow.replaceChildren(
      ...manufacturingFlow.map((step, index) => el(`
        <li class="flow-step">
          <span class="flow-dot" aria-hidden="true">${String(index + 1).padStart(2, '0')}</span>
          <span class="flow-name">${esc(step)}</span>
          ${index < manufacturingFlow.length - 1 ? '<span class="flow-arrow" aria-hidden="true">→</span>' : ''}
        </li>`)),
    )
  }

  const capacity = document.querySelector('#capacity-grid')
  if (capacity) {
    capacity.replaceChildren(
      ...capacityStats.map((stat, index) => el(`
        <div class="capacity-item reveal" style="--stagger:${index}">
          <strong data-count="${stat.value}" data-suffix="${esc(stat.suffix)}" data-decimals="${stat.decimals ?? 0}">0${esc(stat.suffix)}</strong>
          <span>${esc(stat.label)}</span>
        </div>`)),
    )
  }
}
