/**
 * Generador de documentos de demostración descargables.
 * Construye un PDF 1.4 válido de una página en memoria (sin dependencias),
 * claramente marcado como material de demostración.
 *
 * Cuando existan documentos reales basta agregar `url` en data/documents.js
 * y descargar directamente desde el servidor.
 */

const ascii = text =>
  String(text)
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^\x20-\x7E]/g, '')
    .replace(/\\/g, '\\\\')
    .replace(/\(/g, '\\(')
    .replace(/\)/g, '\\)')

const wrapLine = (text, maxChars = 88) => {
  const words = ascii(text).split(/\s+/).filter(Boolean)
  const lines = []
  let current = ''
  words.forEach(word => {
    if ((current + ' ' + word).trim().length > maxChars) {
      if (current) lines.push(current.trim())
      current = word
    } else {
      current = `${current} ${word}`
    }
  })
  if (current.trim()) lines.push(current.trim())
  return lines.length ? lines : ['']
}

const buildContentStream = ({ title, subtitle, body }) => {
  const commands = []
  commands.push('BT /F1 18 Tf 56 786 Td (' + ascii(title) + ') Tj ET')
  commands.push('BT /F1 11 Tf 56 764 Td (' + ascii(subtitle) + ') Tj ET')
  commands.push('0.05 0.45 0.62 RG 1.2 w 56 752 m 539 752 l S')

  let y = 726
  body.forEach(block => {
    const lines = wrapLine(block)
    lines.forEach(line => {
      commands.push(`BT /F2 10 Tf 56 ${y} Td (${line}) Tj ET`)
      y -= 15
      if (y < 60) y = 720
    })
    y -= 6
  })

  commands.push('BT /F2 8 Tf 56 40 Td (Documento generado automaticamente con fines de demostracion - MedTech Precision.) Tj ET')
  return commands.join('\n')
}

const buildPdf = model => {
  const content = buildContentStream(model)
  const objects = [
    '<< /Type /Catalog /Pages 2 0 R >>',
    '<< /Type /Pages /Kids [3 0 R] /Count 1 >>',
    '<< /Type /Page /Parent 2 0 R /MediaBox [0 0 595 842] /Resources << /Font << /F1 4 0 R /F2 5 0 R >> >> /Contents 6 0 R >>',
    '<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica-Bold >>',
    '<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>',
    `<< /Length ${content.length} >>\nstream\n${content}\nendstream`,
  ]

  let pdf = '%PDF-1.4\n'
  const offsets = []
  objects.forEach((body, index) => {
    offsets.push(pdf.length)
    pdf += `${index + 1} 0 obj\n${body}\nendobj\n`
  })

  const xrefStart = pdf.length
  pdf += `xref\n0 ${objects.length + 1}\n`
  pdf += '0000000000 65535 f \n'
  offsets.forEach(offset => {
    pdf += `${String(offset).padStart(10, '0')} 00000 n \n`
  })
  pdf += `trailer\n<< /Size ${objects.length + 1} /Root 1 0 R >>\nstartxref\n${xrefStart}\n%%EOF`
  return pdf
}

/** Descarga texto plano como archivo (utilidad pública). */
export const downloadTextFile = (filename, text, mime = 'text/plain;charset=utf-8') => {
  const blob = new Blob([text], { type: mime })
  triggerDownload(blob, filename)
}

const triggerDownload = (blob, filename) => {
  const url = URL.createObjectURL(blob)
  const anchor = document.createElement('a')
  anchor.href = url
  anchor.download = filename
  document.body.appendChild(anchor)
  anchor.click()
  anchor.remove()
  setTimeout(() => URL.revokeObjectURL(url), 1500)
}

/**
 * Genera y descarga un PDF de demostración a partir de título, subtítulo y párrafos.
 */
export const downloadDemoPdf = ({ filename, title, subtitle, body }) => {
  const pdf = buildPdf({ title, subtitle, body })
  triggerDownload(new Blob([pdf], { type: 'application/pdf' }), filename)
}
