import './medtech.css'

const MEDTECH_METRICS = [
  { icon: '▦', label: 'Área de planta', value: '18,000 m²' },
  { icon: '✚', label: 'Salas limpias ISO 7', value: '6' },
  { icon: '⌁', label: 'Capacidad productiva', value: '4.2M/mes' },
  { icon: '◷', label: 'Operación', value: '24/7' },
]

const MEDTECH_SUSTAINABILITY = [
  'Gestión de residuos peligrosos',
  'Monitoreo de huella de carbono',
  'Manejo responsable de agua industrial',
]

const createMetricCard = ({ icon, label, value }) => {
  const card = document.createElement('article')
  card.className = 'mt-metric-card'

  const iconWrap = document.createElement('span')
  iconWrap.className = 'stat-icon coral-bg'
  const iconSpan = document.createElement('span')
  iconSpan.className = 'icon'
  iconSpan.setAttribute('aria-hidden', 'true')
  iconSpan.textContent = icon
  iconWrap.appendChild(iconSpan)

  const body = document.createElement('div')
  const labelEl = document.createElement('span')
  labelEl.textContent = label
  const valueEl = document.createElement('strong')
  valueEl.textContent = value
  body.appendChild(labelEl)
  body.appendChild(valueEl)

  card.appendChild(iconWrap)
  card.appendChild(body)
  return card
}

const createSustainabilityItem = text => {
  const item = document.createElement('li')

  const marker = document.createElement('span')
  marker.className = 'mt-sustainability-check'
  marker.setAttribute('aria-hidden', 'true')
  marker.textContent = '✓'

  const copy = document.createElement('span')
  copy.textContent = text

  item.appendChild(marker)
  item.appendChild(copy)
  return item
}

const renderMedtechMetrics = () => {
  const container = document.querySelector('#medtech-metrics')
  if (!container || container.dataset.mounted === 'true') return
  MEDTECH_METRICS.map(createMetricCard).forEach(card => container.appendChild(card))
  container.dataset.mounted = 'true'
}

const renderMedtechSustainability = () => {
  const list = document.querySelector('#medtech-sustainability-list')
  if (!list || list.dataset.mounted === 'true') return
  MEDTECH_SUSTAINABILITY.map(createSustainabilityItem).forEach(item => list.appendChild(item))
  list.dataset.mounted = 'true'
}

renderMedtechMetrics()
renderMedtechSustainability()
