/**
 * Centro de documentación técnica (contenido de demostración).
 * Los archivos se generan localmente como PDF de demostración
 * mediante ui/demoPdf.js — la estructura está lista para
 * reemplazarse por documentos reales (url: '/docs/archivo.pdf').
 */

export const documentTypes = ['Ficha técnica', 'Certificación', 'Informe de calidad', 'Especificación', 'Corporativo']

export const documents = [
  {
    id: 'ft-cateteres',
    name: 'Ficha técnica · Catéteres de precisión',
    type: 'Ficha técnica',
    date: '2026-01-15',
    description: 'Especificaciones dimensionales, materiales y condiciones de uso de la línea de catéteres.',
  },
  {
    id: 'ft-sets',
    name: 'Ficha técnica · Sets de administración',
    type: 'Ficha técnica',
    date: '2025-11-30',
    description: 'Configuraciones disponibles, conectores y compatibilidad de los sets de administración.',
  },
  {
    id: 'ft-tubos',
    name: 'Ficha técnica · Tubos especializados',
    type: 'Ficha técnica',
    date: '2025-10-08',
    description: 'Materiales, diámetros y tolerancias del portafolio de tubos médicos extruidos.',
  },
  {
    id: 'cert-13485',
    name: 'Certificación ISO 13485 (demo)',
    type: 'Certificación',
    date: '2025-09-12',
    description: 'Documento demostrativo que ilustra cómo se presentaría una certificación del sistema de gestión.',
  },
  {
    id: 'inf-calidad',
    name: 'Informe trimestral de calidad',
    type: 'Informe de calidad',
    date: '2026-04-02',
    description: 'Resumen de indicadores, no conformidades y acciones correctivas del período (demostrativo).',
  },
  {
    id: 'esp-tolerancias',
    name: 'Estándar interno de tolerancias',
    type: 'Especificación',
    date: '2025-06-21',
    description: 'Criterios metrológicos y tolerancias generales aplicadas en inspección dimensional.',
  },
  {
    id: 'corp-perfil',
    name: 'Perfil corporativo MedTech Precision',
    type: 'Corporativo',
    date: '2026-02-10',
    description: 'Presentación general de la compañía: historia, capacidades y alcance internacional.',
  },
]
