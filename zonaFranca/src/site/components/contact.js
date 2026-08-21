/** Formulario de contacto con validaciones y envío demo honesto. */
import { company } from '../data/company.js'
import { el } from '../ui/dom.js'
import { icon } from '../ui/icons.js'
import { showToast } from '../ui/toast.js'
import { saveSubmission } from '../ui/api.js'

const setError = (field, message) => {
  const wrapper = field?.closest('.form-field')
  const error = wrapper?.querySelector('.field-error')
  if (!error) return Boolean(message)
  error.textContent = message
  error.hidden = !message
  field.classList.toggle('invalid', Boolean(message))
  return Boolean(message)
}

const validators = {
  nombre: value => (value.trim().length >= 3 ? '' : 'Ingrese su nombre.'),
  correo: value => (/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(value.trim()) ? '' : 'Ingrese un correo electrónico válido.'),
  telefono: value => {
    if (!value.trim()) return ''
    return /^[+\d][\d\s().-]{6,}$/.test(value.trim()) ? '' : 'Teléfono no válido (ej. +506 8888-8888).'
  },
  tipoConsulta: value => (value ? '' : 'Seleccione el tipo de consulta.'),
  mensaje: value => (value.trim().length >= 10 ? '' : 'Cuéntenos un poco más (mínimo 10 caracteres).'),
}

export const initContact = () => {
  const form = document.querySelector('#contact-form')
  if (!form) return

  Object.keys(validators).forEach(name => {
    form.querySelector(`[name="${name}"]`)?.addEventListener('blur', event => {
      setError(event.target, validators[name](event.target.value))
    })
  })

  form.addEventListener('submit', async event => {
    event.preventDefault()
    let hasError = false

    Object.entries(validators).forEach(([name, validate]) => {
      const field = form.querySelector(`[name="${name}"]`)
      if (field && setError(field, validate(field.value))) hasError = true
    })

    const status = document.querySelector('#contact-status')
    if (hasError) {
      status.dataset.tone = 'error'
      status.textContent = 'Revise los campos marcados antes de enviar.'
      return
    }

    const submitButton = form.querySelector('#contact-submit')
    submitButton.disabled = true
    submitButton.classList.add('loading')

    const data = new FormData(form)
    const { remote } = await saveSubmission('consultas', {
      nombre: String(data.get('nombre') ?? '').trim(),
      empresa: String(data.get('empresa') ?? '').trim(),
      correo: String(data.get('correo') ?? '').trim(),
      telefono: String(data.get('telefono') ?? '').trim(),
      tipoConsulta: String(data.get('tipoConsulta') ?? ''),
      producto: String(data.get('producto') ?? ''),
      mensaje: String(data.get('mensaje') ?? '').trim(),
      origen: 'sitio-web-demo',
    })

    submitButton.disabled = false
    submitButton.classList.remove('loading')
    status.dataset.tone = 'success'
    status.textContent = remote
      ? 'Consulta registrada en el servidor de demostración. Un miembro del equipo la revisará (entorno de pruebas).'
      : 'Entorno de demostración sin servidor disponible: la consulta quedó guardada solo en este navegador.'
    showToast(remote ? 'Solicitud enviada correctamente' : 'Consulta registrada localmente — modo demostración')
    form.reset()
  })

  // Rellena la lista de información corporativa
  const list = document.querySelector('#contact-info-list')
  if (list) {
    const items = [
      { icon: 'mail', label: company.email, href: `mailto:${company.email}` },
      { icon: 'phone', label: company.phone, href: 'tel:+50640001200' },
      { icon: 'clock', label: company.hours },
      { icon: 'pin', label: company.location },
    ]
    list.replaceChildren(
      ...items.map(item => el(`
        <li>
          <span class="info-icon" aria-hidden="true">${icon(item.icon)}</span>
          ${item.href ? `<a href="${item.href}">${item.label}</a>` : `<span>${item.label}</span>`}
        </li>`)),
    )
  }
}
