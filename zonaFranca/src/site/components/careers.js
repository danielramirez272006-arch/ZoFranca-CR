/**
 * Empleo / Carreras: beneficios y listado de vacantes.
 * Cada vacante abre el formulario de candidatura con el puesto preseleccionado.
 */
import { careerBenefits } from '../data/company.js'
import { jobs } from '../data/jobs.js'
import { el, esc } from '../ui/dom.js'
import { icon } from '../ui/icons.js'
import { openApplicationDialog } from './applicationModal.js'

export const renderCareers = () => {
  const benefits = document.querySelector('#benefit-grid')
  if (benefits) {
    benefits.replaceChildren(
      ...careerBenefits.map(item => el(`
        <article class="benefit-card reveal">
          <span class="benefit-icon" aria-hidden="true">${icon(item.icon)}</span>
          <h4>${esc(item.title)}</h4>
          <p>${esc(item.text)}</p>
        </article>`)),
    )
  }

  const jobList = document.querySelector('#job-list')
  if (!jobList) return

  jobList.replaceChildren(
    ...jobs.map(job => {
      const card = el(`
        <article class="job-card reveal" data-job="${esc(job.id)}">
          <header class="job-head">
            <div>
              <h4>${esc(job.title)}</h4>
              <ul class="job-meta">
                <li><span class="tag tag-category">${esc(job.area)}</span></li>
                <li>${icon('clock')} ${esc(job.schedule)}</li>
                <li>${icon('pin')} ${esc(job.location)}</li>
              </ul>
            </div>
            <button type="button" class="btn btn-primary btn-sm" data-apply="${esc(job.id)}">Aplicar</button>
          </header>
          <p class="job-desc">${esc(job.description)}</p>
          <details class="job-reqs">
            <summary>Requisitos del puesto</summary>
            <ul>${job.requirements.map(req => `<li>${esc(req)}</li>`).join('')}</ul>
          </details>
        </article>`)
      return card
    }),
  )

  jobList.addEventListener('click', event => {
    const apply = event.target.closest('[data-apply]')
    if (!apply) return
    const job = jobs.find(item => item.id === apply.dataset.apply)
    if (job) openApplicationDialog(job)
  })
}
