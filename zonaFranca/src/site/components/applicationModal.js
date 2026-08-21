/**
 * Formulario de candidatura (modal) con carga de CV.
 * Validaciones: campos obligatorios, formato de correo, tipo de archivo
 * (PDF/DOC/DOCX) y tamaño máximo. El envío es honesto: registra metadatos
 * en el backend de demostración o localmente; nunca simula un envío real
 * del archivo a reclutamiento.
 */
import { jobs } from '../data/jobs.js'
import { el, esc } from '../ui/dom.js'
import { icon } from '../ui/icons.js'
import { showToast } from '../ui/toast.js'
import { saveSubmission } from '../ui/api.js'

const MAX_FILE_MB = 4
const ALLOWED_EXT = ['pdf', 'doc', 'docx']

let currentJob = null
let selectedFile = null

const dialog = () => document.querySelector('#application-dialog')
const body = () => document.querySelector('#application-dialog-body')

const setError = (field, message) => {
  const wrapper = field?.closest('.form-field')
  const error = wrapper?.querySelector('.field-error')
  if (!error) return false
  error.textContent = message
  error.hidden = !message
  field?.classList.toggle('invalid', Boolean(message))
  return Boolean(message)
}

const validators = {
  nombre: value => (value.trim().length >= 3 ? '' : 'Ingrese su nombre completo.'),
  correo: value => (/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(value.trim()) ? '' : 'Ingrese un correo electrónico válido.'),
  telefono: value => {
    if (!value.trim()) return ''
    return /^[+\d][\d\s().-]{6,}$/.test(value.trim()) ? '' : 'Ingrese un teléfono válido (ej. +506 8888-8888).'
  },
  puesto: value => (value ? '' : 'Seleccione el puesto al que aplica.'),
}

export const openApplicationDialog = job => {
  const modal = dialog()
  const container = body()
  if (!modal || !container) return

  currentJob = job
  selectedFile = null

  container.innerHTML = `
    <header class="modal-head">
      <div>
        <p class="eyebrow">Candidatura</p>
        <h3 id="application-dialog-title">Aplicar: ${esc(job.title)}</h3>
        <p class="modal-desc">${esc(job.area)} · ${esc(job.schedule)} · ${esc(job.location)}</p>
      </div>
      <button type="button" class="modal-close" data-close-modal aria-label="Cerrar formulario">${icon('close')}</button>
    </header>

    <form id="application-form" novalidate>
      <div class="form-row">
        <div class="form-field">
          <label for="app-nombre">Nombre completo <b aria-hidden="true">*</b></label>
          <input id="app-nombre" name="nombre" type="text" autocomplete="name" required />
          <small class="field-error" hidden></small>
        </div>
        <div class="form-field">
          <label for="app-correo">Correo electrónico <b aria-hidden="true">*</b></label>
          <input id="app-correo" name="correo" type="email" autocomplete="email" required />
          <small class="field-error" hidden></small>
        </div>
      </div>
      <div class="form-row">
        <div class="form-field">
          <label for="app-telefono">Teléfono</label>
          <input id="app-telefono" name="telefono" type="tel" inputmode="tel" autocomplete="tel" placeholder="+506 8888-8888" />
          <small class="field-error" hidden></small>
        </div>
        <div class="form-field">
          <label for="app-puesto">Puesto al que aplica <b aria-hidden="true">*</b></label>
          <select id="app-puesto" name="puesto" required>
            ${jobs.map(option => `<option value="${esc(option.title)}" ${option.id === job.id ? 'selected' : ''}>${esc(option.title)}</option>`).join('')}
          </select>
          <small class="field-error" hidden></small>
        </div>
      </div>
      <div class="form-field">
        <label for="app-linkedin">LinkedIn (opcional)</label>
        <input id="app-linkedin" name="linkedin" type="url" placeholder="https://linkedin.com/in/…" />
        <small class="field-error" hidden></small>
      </div>
      <div class="form-field">
        <label for="app-mensaje">Mensaje</label>
        <textarea id="app-mensaje" name="mensaje" rows="4" placeholder="Breve presentación y motivación…"></textarea>
      </div>

      <div class="form-field upload-field">
        <span class="field-label">Currículum vitae <b aria-hidden="true">*</b> <em>(PDF, DOC o DOCX · máx. ${MAX_FILE_MB} MB)</em></span>
        <label class="upload-box" for="app-cv">
          ${icon('upload')}
          <strong>Seleccionar archivo</strong>
          <span>o arrástrelo aquí</span>
          <input id="app-cv" name="cv" type="file" accept=".pdf,.doc,.docx,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document" required />
        </label>
        <p class="file-selected" id="file-selected" hidden></p>
        <small class="field-error" hidden></small>
      </div>

      <p class="form-status" id="application-status" role="status" aria-live="polite"></p>

      <footer class="modal-actions">
        <button type="button" class="btn btn-ghost-dark" data-close-modal>Cancelar</button>
        <button type="submit" class="btn btn-primary" id="application-submit">${icon('checkCircle')} Enviar candidatura</button>
      </footer>
    </form>`

  bindForm(container)
  modal.showModal()
}

const showFile = fileInput => {
  const display = body().querySelector('#file-selected')
  const file = fileInput.files[0]
  if (!display) return
  if (file) {
    const ext = file.name.split('.').pop().toLowerCase()
    if (!ALLOWED_EXT.includes(ext)) {
      display.hidden = true
      setError(fileInput, 'Tipo de archivo no permitido. Use PDF, DOC o DOCX.')
      return
    }
    if (file.size > MAX_FILE_MB * 1024 * 1024) {
      display.hidden = true
      setError(fileInput, `El archivo supera el máximo de ${MAX_FILE_MB} MB.`)
      return
    }
    setError(fileInput, '')
    display.hidden = false
    display.textContent = `CV seleccionado: ${file.name}`
  } else {
    display.hidden = true
  }
}

const validateFile = fileInput => {
  const file = fileInput.files[0]
  if (!file) return setError(fileInput, 'Adjunte su currículum (PDF, DOC o DOCX).')
  const ext = file.name.split('.').pop().toLowerCase()
  if (!ALLOWED_EXT.includes(ext)) return setError(fileInput, 'Tipo de archivo no permitido. Use PDF, DOC o DOCX.')
  if (file.size > MAX_FILE_MB * 1024 * 1024) return setError(fileInput, `El archivo supera el máximo de ${MAX_FILE_MB} MB.`)
  return setError(fileInput, '')
}

const setLoading = (button, loading) => {
  button.disabled = loading
  button.classList.toggle('loading', loading)
  button.innerHTML = loading
    ? '<span class="spinner" aria-hidden="true"></span> Enviando…'
    : `${icon('checkCircle')} Enviar candidatura`
}

const bindForm = container => {
  const form = container.querySelector('#application-form')
  const fileInput = form.querySelector('#app-cv')
  fileInput.addEventListener('change', () => showFile(fileInput))

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
    if (validateFile(fileInput)) hasError = true

    const status = form.querySelector('#application-status')
    if (hasError) {
      status.textContent = 'Revise los campos marcados antes de continuar.'
      status.dataset.tone = 'error'
      showToast('Revise los campos del formulario', 'error')
      return
    }

    const submitButton = form.querySelector('#application-submit')
    setLoading(submitButton, true)
    status.textContent = ''

    // Registro honesto en entorno de demostración: se guardan metadatos,
    // no el archivo binario del CV.
    const data = new FormData(form)
    selectedFile = fileInput.files[0]
    const { remote } = await saveSubmission('postulaciones', {
      puesto: String(data.get('puesto') ?? ''),
      nombre: String(data.get('nombre') ?? '').trim(),
      correo: String(data.get('correo') ?? '').trim(),
      telefono: String(data.get('telefono') ?? '').trim(),
      linkedin: String(data.get('linkedin') ?? '').trim(),
      mensaje: String(data.get('mensaje') ?? '').trim(),
      cvNombreArchivo: selectedFile ? selectedFile.name : '',
      cvTamanoBytes: selectedFile ? selectedFile.size : 0,
      origen: 'sitio-web-demo',
    })

    setLoading(submitButton, false)
    status.dataset.tone = 'success'
    status.textContent = remote
      ? 'Candidatura registrada en el servidor de demostración. Este es un entorno de pruebas: ningún reclutador recibió el archivo.'
      : 'Entorno de demostración sin servidor disponible: la candidatura quedó registrada únicamente en este navegador.'
    showToast(remote ? 'Candidatura registrada (demostración)' : 'Registrada localmente — modo demostración')

    form.reset()
    container.querySelector('#file-selected').hidden = true
  })
}
