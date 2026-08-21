/** Notificaciones tipo toast reutilizables (patrón ya usado por el dashboard). */

let toastNode = null
let hideTimer = null

const ensureToast = () => {
  if (toastNode) return toastNode
  toastNode = document.createElement('div')
  toastNode.className = 'site-toast'
  toastNode.setAttribute('role', 'status')
  toastNode.setAttribute('aria-live', 'polite')
  document.body.appendChild(toastNode)
  return toastNode
}

export const showToast = (message, tone = 'success') => {
  const toast = ensureToast()
  clearTimeout(hideTimer)
  toast.textContent = message
  toast.dataset.tone = tone
  toast.classList.add('show')
  hideTimer = setTimeout(() => toast.classList.remove('show'), 3600)
}
