/**
 * Banderas en SVG inline para los mercados de exportación y el origen.
 * Dibujos simplificados y reconocibles, sin dependencias externas ni
 * imágenes que puedan romperse (los emoji de bandera no se renderizan
 * en Windows, por eso se usan SVG propios).
 */

const C = {
  usRed: '#B22234', usBlue: '#3C3B6E',
  caRed: '#d52b1e',
  mxGreen: '#006847', mxRed: '#ce1126', mxEmblem: '#7a5230',
  esRed: '#AA151B', esYellow: '#F1BF00',
  coYellow: '#FCD116', coBlue: '#003893', coRed: '#CE1126',
  paBlue: '#005293', paRed: '#d21034',
  clBlue: '#0039A6', clRed: '#D52B1E',
  brGreen: '#009B3A', brYellow: '#FEDF00', brBlue: '#002776',
  crBlue: '#002B7F', crRed: '#CE1126',
}

/** Genera los puntos de una estrella de 5 puntas centrada en (cx, cy). */
const starPoints = (cx, cy, r) =>
  Array.from({ length: 10 }, (_, i) => {
    const angle = -Math.PI / 2 + (i * Math.PI) / 5
    const radius = i % 2 === 0 ? r : r * 0.42
    return `${(cx + radius * Math.cos(angle)).toFixed(2)},${(cy + radius * Math.sin(angle)).toFixed(2)}`
  }).join(' ')

const star = (cx, cy, r, fill) => `<polygon points="${starPoints(cx, cy, r)}" fill="${fill}"/>`

const FLAGS = {
  US: () => {
    const stripeH = 20 / 13
    const stripes = Array.from({ length: 7 }, (_, i) =>
      `<rect y="${(i * stripeH * 2).toFixed(2)}" width="30" height="${stripeH.toFixed(2)}" fill="${C.usRed}"/>`,
    ).join('')
    const dots = Array.from({ length: 12 }, (_, i) => {
      const col = i % 4
      const row = Math.floor(i / 4)
      return `<circle cx="${1.6 + col * 2.9}" cy="${1.8 + row * 3.4}" r=".62" fill="#fff"/>`
    }).join('')
    return `<rect width="30" height="20" fill="#fff"/>${stripes}
      <rect width="12.6" height="${(stripeH * 7).toFixed(2)}" fill="${C.usBlue}"/>${dots}`
  },

  CA: () => `
    <rect width="30" height="20" fill="#fff"/>
    <rect width="7.5" height="20" fill="${C.caRed}"/>
    <rect x="22.5" width="7.5" height="20" fill="${C.caRed}"/>
    <path fill="${C.caRed}" d="M15 4.5 16 7l2.5-1-.7 3 3.2-.8-1.5 2.7 3 1.5-3.2 1.3.9 2.2-4-1-.2 2.6h-1l-.2 2.6-4 1 .9-2.2-3.2-1.3 3-1.5L8.9 8.2l3.2.8-.7-3 2.5 1z"/>`,

  MX: () => `
    <rect width="10" height="20" fill="${C.mxGreen}"/>
    <rect x="10" width="10" height="20" fill="#fff"/>
    <rect x="20" width="10" height="20" fill="${C.mxRed}"/>
    <circle cx="15" cy="9.6" r="1.5" fill="${C.mxEmblem}"/>
    <path d="M12.6 10.6c1.6 1.5 3.2 1.5 4.8 0" stroke="${C.mxGreen}" stroke-width=".7" fill="none" stroke-linecap="round"/>`,

  DE: () => `
    <rect width="30" height="6.67" fill="#1a1a1a"/>
    <rect y="6.67" width="30" height="6.67" fill="#DD0000"/>
    <rect y="13.33" width="30" height="6.67" fill="#FFCE00"/>`,

  ES: () => `
    <rect width="30" height="20" fill="${C.esYellow}"/>
    <rect width="30" height="5" fill="${C.esRed}"/>
    <rect y="15" width="30" height="5" fill="${C.esRed}"/>
    <rect x="7" y="8.2" width="2.6" height="3.6" rx=".4" fill="${C.esRed}" opacity=".85"/>`,

  CO: () => `
    <rect width="30" height="10" fill="${C.coYellow}"/>
    <rect y="10" width="30" height="5" fill="${C.coBlue}"/>
    <rect y="15" width="30" height="5" fill="${C.coRed}"/>`,

  PA: () => `
    <rect width="15" height="10" fill="#fff"/>
    <rect x="15" width="15" height="10" fill="${C.paRed}"/>
    <rect y="10" width="15" height="10" fill="${C.paBlue}"/>
    <rect x="15" y="10" width="15" height="10" fill="#fff"/>
    ${star(7.5, 5, 2.6, C.paBlue)}
    ${star(22.5, 15, 2.6, C.paRed)}`,

  CL: () => `
    <rect width="30" height="10" fill="#fff"/>
    <rect y="10" width="30" height="10" fill="${C.clRed}"/>
    <rect width="10.5" height="10" fill="${C.clBlue}"/>
    ${star(5.2, 5, 2.8, '#fff')}`,

  BR: () => `
    <rect width="30" height="20" fill="${C.brGreen}"/>
    <polygon points="15,2.4 27.4,10 15,17.6 2.6,10" fill="${C.brYellow}"/>
    <circle cx="15" cy="10" r="4.5" fill="${C.brBlue}"/>
    <path d="M10.9 8.7Q15 7.3 19.1 9.5" stroke="#fff" stroke-width=".95" fill="none" stroke-linecap="round"/>`,

  CR: () => `
    <rect width="30" height="20" fill="${C.crBlue}"/>
    <rect y="3.33" width="30" height="13.34" fill="#fff"/>
    <rect y="6.67" width="30" height="6.66" fill="${C.crRed}"/>`,
}

/**
 * Devuelve la bandera como SVG inline.
 * @param {string} code Código de país (US, CA, MX…)
 * @param {{frame?: boolean, width?: number}} [opts]
 * - `frame`: agrega un marco oscuro redondeado, útil sobre el fondo del mapa.
 * - `width`: tamaño explícito en px, necesario cuando el SVG se anida dentro
 *   de otro SVG (los porcentajes se resolverían contra el lienzo padre).
 */
export const flag = (code, opts = {}) => {
  const painter = FLAGS[code]
  if (!painter) return ''
  const frame = opts.frame
    ? '<rect x=".45" y=".45" width="29.1" height="19.1" rx="2.6" fill="none" stroke="rgba(7,22,38,.75)" stroke-width=".9"/>'
    : ''
  const size = opts.width
    ? ` width="${opts.width}" height="${Math.round((opts.width * 20) / 30)}"`
    : ''
  return `<svg class="flag-svg" viewBox="0 0 30 20"${size} aria-hidden="true" focusable="false">${painter()}${frame}</svg>`
}
