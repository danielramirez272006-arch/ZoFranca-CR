/**
 * Biblioteca de iconos SVG inline (trazo, cuadrícula 24×24).
 * Decorativos por defecto: los componentes deciden aria-hidden o role="img".
 */

const stroke = {
  fill: 'none',
  stroke: 'currentColor',
  'stroke-width': '1.8',
  'stroke-linecap': 'round',
  'stroke-linejoin': 'round',
}

const paths = {
  menu: '<path d="M4 7h16M4 12h16M4 17h16"/>',
  close: '<path d="M6 6l12 12M18 6L6 18"/>',
  chevronDown: '<path d="M6 9l6 6 6-6"/>',
  arrowRight: '<path d="M5 12h14M13 6l6 6-6 6"/>',
  download: '<path d="M12 4v11m0 0l-4-4m4 4l4-4M5 20h14"/>',
  fileText: '<path d="M14 3H7a1.5 1.5 0 0 0-1.5 1.5v15A1.5 1.5 0 0 0 7 21h10a1.5 1.5 0 0 0 1.5-1.5V7.5L14 3z"/><path d="M14 3v4.5h4.5M9 12h6M9 16h6"/>',
  search: '<circle cx="11" cy="11" r="6.5"/><path d="M20 20l-3.8-3.8"/>',
  filter: '<path d="M4 6h16M7 12h10M10 18h4"/>',
  mail: '<rect x="3" y="5" width="18" height="14" rx="2"/><path d="M3 7l9 6 9-6"/>',
  phone: '<path d="M5 4h4l2 5-2.5 1.5a12 12 0 0 0 5 5L15 13l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2"/>',
  clock: '<circle cx="12" cy="12" r="8.5"/><path d="M12 7v5l3 2"/>',
  pin: '<path d="M12 21s-7-5.5-7-11a7 7 0 0 1 14 0c0 5.5-7 11-7 11z"/><circle cx="12" cy="10" r="2.5"/>',
  check: '<path d="M5 13l4 4L19 7"/>',
  checkCircle: '<circle cx="12" cy="12" r="8.5"/><path d="M8.5 12.5l2.5 2.5 4.5-5"/>',
  alertCircle: '<circle cx="12" cy="12" r="8.5"/><path d="M12 8v4.5M12 16h.01"/>',
  info: '<circle cx="12" cy="12" r="8.5"/><path d="M12 11v5M12 8h.01"/>',
  shield: '<path d="M12 3l7 3v5c0 4.5-3 8.5-7 10-4-1.5-7-5.5-7-10V6l7-3z"/><path d="M9 12l2 2 4-4"/>',
  badgeCheck: '<circle cx="12" cy="10" r="6"/><path d="M9.5 10l1.8 1.8L15 8.5M8.5 15.5L7 21l5-2 5 2-1.5-5.5"/>',
  searchCheck: '<circle cx="11" cy="11" r="6.5"/><path d="M20 20l-3.8-3.8M8.5 11l1.8 1.8L13.5 9"/>',
  clipboardCheck: '<rect x="6" y="4" width="12" height="17" rx="2"/><path d="M9 4a3 3 0 0 1 6 0M9.5 13l2 2 3.5-4"/>',
  target: '<circle cx="12" cy="12" r="8.5"/><circle cx="12" cy="12" r="4.5"/><circle cx="12" cy="12" r="1" fill="currentColor" stroke="none"/>',
  crosshair: '<circle cx="12" cy="12" r="8.5"/><path d="M12 3.5v4M12 16.5v4M3.5 12h4M16.5 12h4"/>',
  sparkles: '<path d="M12 4l1.8 4.7L18.5 10.5l-4.7 1.8L12 17l-1.8-4.7L5.5 10.5l4.7-1.8L12 4z"/><path d="M19 15l.9 2.1L22 18l-2.1.9L19 21l-.9-2.1L16 18l2.1-.9L19 15z"/>',
  layers: '<path d="M12 3l9 5-9 5-9-5 9-5z"/><path d="M3 13l9 5 9-5"/>',
  globe: '<circle cx="12" cy="12" r="8.5"/><path d="M3.5 12h17M12 3.5c2.5 2.5 3.8 5.4 3.8 8.5S14.5 18 12 20.5C9.5 18 8.2 15.1 8.2 12S9.5 6 12 3.5z"/>',
  heartPulse: '<path d="M12 20s-7.5-4.7-7.5-10A4.5 4.5 0 0 1 12 7a4.5 4.5 0 0 1 7.5 3c0 5.3-7.5 10-7.5 10z"/><path d="M6.5 12h3l1.5-2.5 2 4 1.5-1.5h3"/>',
  box: '<path d="M12 3l8 4.5v9L12 21l-8-4.5v-9L12 3z"/><path d="M4 7.5l8 4.5 8-4.5M12 12v9"/>',
  settings: '<circle cx="12" cy="12" r="3.2"/><path d="M12 4.5v2M12 17.5v2M4.5 12h2M17.5 12h2M6.7 6.7l1.4 1.4M15.9 15.9l1.4 1.4M17.3 6.7l-1.4 1.4M8.1 15.9l-1.4 1.4"/>',
  ruler: '<rect x="3" y="9" width="18" height="6" rx="1.5" transform="rotate(-35 12 12)"/><path d="M8.5 14.5l1.2 1.7M11.5 12.4l1.2 1.7M14.5 10.3l1.2 1.7"/>',
  flask: '<path d="M10 3h4M11 3v6L5.5 18a2 2 0 0 0 1.8 3h9.4a2 2 0 0 0 1.8-3L13 9V3"/><path d="M8 15h8"/>',
  fingerprint: '<path d="M6 12a6 6 0 0 1 12 0c0 3-.5 5.5-1.5 7.5M9 12a3 3 0 0 1 6 0c0 2.8-.4 5-1.3 7M12 12c0 3-.4 5.5-1.2 7.5M4.5 9.5A7.5 7.5 0 0 1 12 4.5"/>',
  mold: '<rect x="4" y="4" width="16" height="16" rx="2"/><path d="M4 9h16M4 15h16M9 4v16M15 4v16"/>',
  assembly: '<circle cx="7" cy="8" r="2.5"/><circle cx="17" cy="8" r="2.5"/><circle cx="12" cy="17" r="2.5"/><path d="M9 9.5l2 5M15 9.5l-2 5M9.5 8h5"/>',
  automation: '<rect x="5" y="7" width="14" height="10" rx="2"/><path d="M12 7V4M9 17v3M15 17v3M9 12h.01M15 12h.01M12 12h.01"/>',
  package: '<path d="M12 3l8 4v10l-8 4-8-4V7l8-4z"/><path d="M4 7l8 4 8-4M12 11v10M8 5l8 4"/>',
  trendingUp: '<path d="M4 17l6-6 4 4 6-7"/><path d="M15 8h5v5"/>',
  bookOpen: '<path d="M12 6c-1.5-1.5-4-2-8-2v14c4 0 6.5.5 8 2 1.5-1.5 4-2 8-2V4c-4 0-6.5.5-8 2z"/><path d="M12 6v14"/>',
  lightbulb: '<path d="M9 18h6M10 21h4"/><path d="M12 3a6 6 0 0 1 3.5 10.9c-.8.6-1 1.3-1 2.1h-5c0-.8-.2-1.5-1-2.1A6 6 0 0 1 12 3z"/>',
  rocket: '<path d="M12 15c-1.5-4.5 0-9 5.5-11.5C20 9 18 14 13.5 15.5L12 15z"/><path d="M12 15l-3-3M9 12c-2 .3-3.5 1.5-4.5 4.5C7.5 15.6 9 15 9.5 14M13.5 15.5c-.3 2-1.5 3.5-4.5 4.5.9-3 1.5-4.5 2.5-5M15 6.5h.01"/>',
  users: '<circle cx="9" cy="8.5" r="3.2"/><path d="M3.5 19c.6-3 2.8-4.7 5.5-4.7s4.9 1.7 5.5 4.7"/><path d="M15.5 5.6a3.2 3.2 0 0 1 0 5.8M17.5 14.6c1.7.7 2.7 2.2 3 4.4"/>',
  briefcase: '<rect x="3.5" y="7.5" width="17" height="12" rx="2"/><path d="M9 7.5V6a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v1.5M3.5 12.5h17"/>',
  upload: '<path d="M12 15V4m0 0L8 8m4-4l4 4"/><path d="M5 15v3a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2v-3"/>',
  plus: '<path d="M12 5v14M5 12h14"/>',
  external: '<path d="M14 4h6v6M20 4L11 13"/><path d="M19 14v5a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V9a2 2 0 0 1 2-2h5"/>',
  catheter: '<path d="M4 20c6-2 8-5 9-9s3-6 7-7"/><circle cx="4" cy="20" r="1.4"/><path d="M16.5 7.5L20 4"/>',
  drip: '<path d="M9 3h6M12 3v3M8 6h8v4a4 4 0 0 1-8 0V6z"/><path d="M12 14v3"/><path d="M12 20.5c-.8 0-1.5-.6-1.5-1.4 0-.9 1.5-2.1 1.5-2.1s1.5 1.2 1.5 2.1c0 .8-.7 1.4-1.5 1.4z"/>',
  gear: '<circle cx="12" cy="12" r="3"/><path d="M12 2.8v3M12 18.2v3M2.8 12h3M18.2 12h3M5.5 5.5l2.1 2.1M16.4 16.4l2.1 2.1M18.5 5.5l-2.1 2.1M7.6 16.4l-2.1 2.1"/>',
  port: '<circle cx="12" cy="12" r="7"/><circle cx="12" cy="12" r="2.8"/><path d="M12 2v3M12 19v3M2 12h3M19 12h3" stroke-dasharray="1.5 2.5"/>',
  tube: '<path d="M7 3c0 6 2 8 5 9s5 3 5 9"/><path d="M7 3h4M17 21h-4" stroke-width="2.4"/>',
  stent: '<path d="M4 18L18 4M4 18l2.8-.4.4-2.8M18 4l-2.8.4-.4 2.8"/><path d="M7 13l4 4M9.5 10.5l4 4M12 8l4 4M14.5 5.5l4 4"/>',
}

export const icon = (name, cls = '') => {
  const body = paths[name] ?? paths.info
  return `<svg class="icon-svg ${cls}" viewBox="0 0 24 24" ${Object.entries(stroke).map(([k, v]) => `${k}="${v}"`).join(' ')} aria-hidden="true" focusable="false">${body}</svg>`
}
