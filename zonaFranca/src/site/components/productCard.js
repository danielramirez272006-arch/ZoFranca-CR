/** Tarjeta individual de producto con ilustración técnica y acciones. */
import { el, esc } from '../ui/dom.js'
import { icon } from '../ui/icons.js'

const productArt = name => `
  <svg viewBox="0 0 300 150" aria-hidden="true" focusable="false">
    <defs>
      <linearGradient id="pa-${esc(name)}-g" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0" stop-color="#eaf4fb"/><stop offset="1" stop-color="#d8e9f6"/>
      </linearGradient>
    </defs>
    <rect width="300" height="150" fill="url(#pa-${esc(name)}-g)"/>
    <g stroke="rgba(30,123,212,.14)">${Array.from({ length: 12 }, (_, i) => `<line x1="${i * 26}" y1="0" x2="${i * 26 - 40}" y2="150"/>`).join('')}</g>
    <circle cx="238" cy="34" r="52" fill="none" stroke="rgba(30,123,212,.18)" stroke-dasharray="3 6"/>
    <circle cx="60" cy="128" r="34" fill="none" stroke="rgba(30,123,212,.15)"/>
    <g transform="translate(118 43)" class="product-art-icon">${icon(name)}</g>
    <path d="M24 122h84" stroke="rgba(10,31,51,.35)" stroke-width="1.2"/>
    <path d="M24 117v10M108 117v10M62 112v20" stroke="rgba(10,31,51,.4)" stroke-width="1.2"/>
  </svg>`

export const renderProductCard = product => {
  const card = el(`
    <article class="product-card reveal" data-id="${esc(product.id)}">
      <figure class="product-media">${productArt(product.icon)}</figure>
      <div class="product-body">
        <div class="product-tags">
          <span class="tag tag-category">${esc(product.category)}</span>
          ${product.applications.map(app => `<span class="tag tag-soft">${esc(app)}</span>`).join('')}
        </div>
        <h3>${esc(product.name)}</h3>
        <p class="product-desc">${esc(product.description)}</p>
        <p class="product-app"><strong>Aplicación:</strong> ${esc(product.applications.join(' · '))}</p>
        <ul class="feature-list">
          ${product.features.map(feature => `<li>${icon('check')}<span>${esc(feature)}</span></li>`).join('')}
        </ul>
      </div>
      <div class="product-actions">
        <button type="button" class="btn btn-primary btn-sm" data-sheet="${esc(product.id)}">Ver ficha técnica</button>
        <button type="button" class="btn btn-outline btn-sm" data-request-info="${esc(product.id)}">Solicitar información</button>
      </div>
    </article>
  `)
  return card
}
