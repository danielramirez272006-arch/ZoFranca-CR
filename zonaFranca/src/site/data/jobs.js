/**
 * Vacantes activas (contenido de demostración).
 * Cada vacante alimenta una JobCard y el selector del formulario
 * de candidatura.
 */

export const jobs = [
  {
    id: 'ing-manufactura',
    title: 'Ingeniero/a de Manufactura',
    area: 'Ingeniería',
    schedule: 'Tiempo completo · Jornada diurna',
    location: 'Zona Franca, Costa Rica',
    description:
      'Definir y mejorar procesos de manufactura para líneas de dispositivos médicos, asegurando capacidad, calidad y cumplimiento de especificaciones.',
    requirements: [
      'Bachillerato o licenciatura en Ingeniería Industrial, Mecánica, Electromecánica o afín',
      '2+ años en entornos de manufactura regulada (deseable médico)',
      'Manejo de herramientas de análisis de procesos e ingeniería de métodos',
      'Inglés técnico intermedio',
    ],
  },
  {
    id: 'tec-calidad',
    title: 'Técnico/a de Calidad',
    area: 'Calidad',
    schedule: 'Tiempo completo · Turno rotativo',
    location: 'Zona Franca, Costa Rica',
    description:
      'Ejecutar inspecciones dimensionales y funcionales de producto en proceso y terminado, registrando resultados con trazabilidad completa.',
    requirements: [
      'Técnico medio en Calidad, Mecánica de Precisión o afín',
      'Manejo de instrumentos de medición (micrómetros, comparadores, calibradores)',
      'Experiencia previa en inspección (deseable industria médica o médica-adjacente)',
      'Atención al detalle y registro documental riguroso',
    ],
  },
  {
    id: 'op-produccion',
    title: 'Operario/a de Producción',
    area: 'Manufactura',
    schedule: 'Tiempo completo · Turnos disponibles',
    location: 'Zona Franca, Costa Rica',
    description:
      'Operar estaciones de ensamble y moldeo siguiendo instrucciones de trabajo, manteniendo estándares de seguridad y calidad del producto.',
    requirements: [
      'Noveno año aprobado (deseable técnica media)',
      'Sin experiencia requerida — capacitación pagada incluida',
      'Disponibilidad para turnos rotativos',
      'Motivación por el trabajo bajo normas de sala limpia',
    ],
  },
  {
    id: 'ing-calidad',
    title: 'Ingeniero/a de Calidad',
    area: 'Calidad',
    schedule: 'Tiempo completo · Jornada diurna',
    location: 'Zona Franca, Costa Rica',
    description:
      'Administrar el sistema de gestión de calidad de la planta: auditorías internas, control de documentos, proveedores y liberación de lotes.',
    requirements: [
      'Licenciatura en Ingeniería o carrera afín',
      '3+ años en sistemas de calidad (normativa ISO 13485 deseada)',
      'Experiencia en gestión de no conformidades y acciones correctivas',
      'Deseable formación como auditor interno',
    ],
  },
]
