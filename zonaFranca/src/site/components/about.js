/** Sección Quiénes somos: historia, misión, visión y valores. */
import { about } from '../data/company.js'
import { icon } from '../ui/icons.js'
import { esc } from '../ui/dom.js'

export const renderAbout = () => {
  const history = document.querySelector('#about-history')
  const mission = document.querySelector('#about-mission')
  const vision = document.querySelector('#about-vision')
  const valuesList = document.querySelector('#values-list')

  if (history) history.textContent = about.history
  if (mission) mission.textContent = about.mission
  if (vision) vision.textContent = about.vision

  if (valuesList) {
    valuesList.replaceChildren(
      ...about.values.map(item => {
        const li = document.createElement('li')
        li.innerHTML = `
          <span class="value-icon" aria-hidden="true">${icon(item.icon)}</span>
          <div>
            <strong>${esc(item.title)}</strong>
            <p>${esc(item.text)}</p>
          </div>`
        return li
      }),
    )
  }
}
