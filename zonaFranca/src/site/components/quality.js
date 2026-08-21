/** Calidad y cumplimiento: pilares, proceso de 6 pasos y certificaciones demo. */
import { qualityPillars, qualityProcess, certifications } from '../data/company.js'
import { el, esc } from '../ui/dom.js'
import { icon } from '../ui/icons.js'

export const renderQuality = () => {
  const pillars = document.querySelector('#pillar-grid')
  if (pillars) {
    pillars.replaceChildren(
      ...qualityPillars.map(pillar => el(`
        <article class="pillar-card reveal">
          <span class="pillar-icon" aria-hidden="true">${icon(pillar.icon)}</span>
          <h3>${esc(pillar.title)}</h3>
          <p>${esc(pillar.text)}</p>
        </article>`)),
    )
  }

  const steps = document.querySelector('#process-steps')
  if (steps) {
    steps.replaceChildren(
      ...qualityProcess.map(step => el(`
        <li class="process-step reveal">
          <span class="step-number" aria-hidden="true">${esc(step.step)}</span>
          <h4>${esc(step.title)}</h4>
          <p>${esc(step.text)}</p>
        </li>`)),
    )
  }

  const certs = document.querySelector('#cert-grid')
  if (certs) {
    certs.replaceChildren(
      ...certifications.map(cert => el(`
        <article class="cert-card reveal">
          <span class="cert-badge" aria-hidden="true">${icon('badgeCheck')}</span>
          <strong class="cert-code">${esc(cert.code)}</strong>
          <span class="cert-name">${esc(cert.name)}</span>
          <p>${esc(cert.text)}</p>
        </article>`)),
    )
  }
}
