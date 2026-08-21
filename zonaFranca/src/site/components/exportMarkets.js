/**
 * Exportación: mapa estilizado con Costa Rica como origen y líneas hacia
 * mercados internacionales de referencia (representación demostrativa).
 */
import { exportMarkets } from '../data/company.js'
import { el, esc } from '../ui/dom.js'
import { flag } from '../ui/flags.js'

const W = 640
const H = 420
const HUB = { x: W * 0.225, y: H * 0.51 }

const nodePosition = market => ({ x: (market.x / 100) * W, y: (market.y / 100) * (H - 60) + 20 })

const arcPath = ({ x, y }) => {
  const midX = (HUB.x + x) / 2
  const midY = Math.min(HUB.y, y) - Math.abs(x - HUB.x) * 0.18 - 18
  return `M ${HUB.x.toFixed(1)} ${HUB.y.toFixed(1)} Q ${midX.toFixed(1)} ${midY.toFixed(1)} ${x.toFixed(1)} ${y.toFixed(1)}`
}

export const renderExportMarkets = () => {
  const svg = document.querySelector('#market-map')
  if (!svg) return

  const routes = exportMarkets.map(market => {
    const pos = nodePosition(market)
    return `<path class="map-route" d="${arcPath(pos)}"/>`
  }).join('')

  const nodes = exportMarkets.map(market => {
    const pos = nodePosition(market)
    return `
      <g class="map-node" transform="translate(${pos.x.toFixed(1)} ${pos.y.toFixed(1)})">
        <circle r="5.2" class="node-dot"/>
        <circle r="10" class="node-ring"/>
        <text x="11" y="4" class="node-label">${esc(market.code)}</text>
      </g>`
  }).join('')

  svg.innerHTML = `
    <defs>
      <linearGradient id="map-bg" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0" stop-color="#0d2943"/><stop offset="1" stop-color="#081b2c"/>
      </linearGradient>
      <pattern id="map-dots" width="24" height="24" patternUnits="userSpaceOnUse">
        <circle cx="1.6" cy="1.6" r="1.6" fill="rgba(120,175,220,.16)"/>
      </pattern>
      <clipPath id="map-clip"><rect width="${W}" height="${H}" rx="20"/></clipPath>
    </defs>

    <g clip-path="url(#map-clip)">
      <rect width="${W}" height="${H}" fill="url(#map-bg)"/>
      <rect width="${W}" height="${H}" fill="url(#map-dots)"/>

      <!-- globo estilizado -->
      <g stroke="rgba(110,165,215,.30)" fill="none">
        <circle cx="300" cy="212" r="168"/>
        <ellipse cx="300" cy="212" rx="120" ry="168"/>
        <ellipse cx="300" cy="212" rx="70" ry="168"/>
        <ellipse cx="300" cy="212" rx="24" ry="168"/>
        <path d="M132 212h336M150 152h300M150 272h300M186 96h228M186 328h228"/>
      </g>

      <!-- rutas desde Costa Rica -->
      ${routes}

      <!-- origen -->
      <g transform="translate(${HUB.x} ${HUB.y})" class="hub-node">
        <circle r="26" class="hub-pulse"/>
        <circle r="9" class="hub-dot"/>
        <text x="0" y="-34" text-anchor="middle" class="hub-label">COSTA RICA</text>
      </g>

      ${nodes}
    </g>`
}

export const renderMarketChips = () => {
  const list = document.querySelector('#market-chips')
  if (!list) return
  list.replaceChildren(
    ...exportMarkets.map(market => el(`
      <li title="${esc(market.country)}">
        <span class="chip-flag" aria-hidden="true">${flag(market.code)}</span>
        <span>${esc(market.country)}</span>
      </li>`)),
  )
}
