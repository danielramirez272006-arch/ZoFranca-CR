/**
 * Datos corporativos de MedTech Precision (contenido de demostración).
 * Centralizados para ser consumidos por los componentes de la interfaz.
 */

export const company = {
  name: 'MedTech Precision',
  tagline: 'Zona Franca · Costa Rica',
  email: 'comercial@medtechprecision.cr',
  phone: '+506 4000 1200',
  hours: 'Lunes a viernes · 8:00 a.m. – 5:00 p.m.',
  location: 'Parque Industrial de Zona Franca, Costa Rica',
}

/** Indicadores de capacidad mostrados bajo el hero */
export const statistics = [
  { value: 15, suffix: '+', label: 'Años de experiencia' },
  { value: 25, suffix: 'M+', label: 'Unidades fabricadas' },
  { value: 18, suffix: '', label: 'Países de exportación' },
  { value: 99.8, suffix: '%', decimals: 1, label: 'Índice de conformidad' },
  { value: 3, suffix: '', label: 'Líneas de manufactura especializada' },
]

/** Historia / misión / visión / valores — sección Quiénes somos */
export const about = {
  founded: 2011,
  mission:
    'Fabricar insumos y dispositivos médicos de precisión con los más altos estándares de calidad, contribuyendo a mejores resultados clínicos para pacientes y profesionales de la salud en todo el mundo.',
  vision:
    'Ser el socio de manufactura médica de referencia en América Latina, reconocido por la exactitud de sus procesos, la innovación aplicada y la confianza de mercados internacionales.',
  history:
    'MedTech Precision nació en 2011 como un taller de micromaquinado dentro de una zona franca costarricense. Hoy opera líneas especializadas de moldeo, extrusión y ensamble que abastecen a hospitales, distribuidores y fabricantes de dispositivos en tres continentes.',
  values: [
    { icon: 'target', title: 'Precisión', text: 'Cada dimensión, tolerancia y proceso se controla bajo especificaciones rigurosas.' },
    { icon: 'shield', title: 'Integridad', text: 'Actuamos con ética, transparencia y respeto por la seguridad del paciente.' },
    { icon: 'sparkles', title: 'Innovación', text: 'Mejora continua y tecnología aplicada a la manufactura médica.' },
    { icon: 'users', title: 'Colaboración', text: 'Equipos multidisciplinarios que trabajan junto al cliente desde el diseño.' },
  ],
}

/** Diferenciadores — ¿Por qué elegir MedTech Precision? */
export const differentiators = [
  { icon: 'target', title: 'Precisión', text: 'Manufactura bajo especificaciones rigurosas y controles dimensionales estrictos.' },
  { icon: 'clipboardCheck', title: 'Calidad', text: 'Procesos controlados y trazables en cada etapa de producción.' },
  { icon: 'sparkles', title: 'Innovación', text: 'Tecnología aplicada a la manufactura médica y mejora continua.' },
  { icon: 'layers', title: 'Escalabilidad', text: 'Capacidad para atender diferentes volúmenes de producción sin perder consistencia.' },
  { icon: 'globe', title: 'Ubicación estratégica', text: 'Operación desde Costa Rica con conexión directa a mercados internacionales.' },
  { icon: 'heartPulse', title: 'Compromiso', text: 'Enfoque permanente en seguridad, calidad y satisfacción del cliente.' },
]

/** Pilares del sistema de calidad */
export const qualityPillars = [
  { icon: 'box', title: 'Control de materias primas', text: 'Verificación de certificados y características de cada lote recibido.' },
  { icon: 'settings', title: 'Control durante manufactura', text: 'Monitoreo de parámetros críticos del proceso en tiempo real.' },
  { icon: 'ruler', title: 'Inspección dimensional', text: 'Medición con equipos calibrados contra planos y tolerancias.' },
  { icon: 'flask', title: 'Pruebas de producto', text: 'Ensayos funcionales y de desempeño según especificación.' },
  { icon: 'fingerprint', title: 'Trazabilidad', text: 'Registro completo de materiales, lotes y procesos por unidad.' },
  { icon: 'searchCheck', title: 'Inspección final', text: 'Verificación del producto terminado antes del empaque.' },
  { icon: 'badgeCheck', title: 'Liberación de lotes', text: 'Revisión documental y aprobación formal de cada lote.' },
]

/** Proceso de control de calidad (pasos 01–06) */
export const qualityProcess = [
  { step: '01', title: 'Recepción', text: 'Verificación de materias primas y componentes.' },
  { step: '02', title: 'Inspección', text: 'Control de especificaciones y características.' },
  { step: '03', title: 'Manufactura', text: 'Producción bajo parámetros establecidos.' },
  { step: '04', title: 'Control en proceso', text: 'Monitoreo de variables críticas.' },
  { step: '05', title: 'Inspección final', text: 'Verificación del producto terminado.' },
  { step: '06', title: 'Liberación', text: 'Revisión documental y liberación del lote.' },
]

/**
 * Certificaciones de ejemplo.
 * IMPORTANTE: contenido de demostración — no constituye certificación vigente.
 */
export const certifications = [
  { code: 'ISO 13485', name: 'Dispositivos médicos', text: 'Sistema de gestión de calidad para dispositivos médicos (demostrativo).' },
  { code: 'ISO 9001', name: 'Gestión de calidad', text: 'Sistema de gestión de calidad organizacional (demostrativo).' },
  { code: 'BPM', name: 'Buenas prácticas', text: 'Buenas prácticas de manufactura aplicadas a producción médica (demostrativo).' },
  { code: 'SGC', name: 'Sistema integrado', text: 'Gestión documental, auditorías y mejora continua (demostrativo).' },
]

/** Áreas de manufactura */
export const manufacturingAreas = [
  { icon: 'mold', title: 'Inyección y moldeo', text: 'Moldeo técnico de polímeros grado médico con control de parámetros.' },
  { icon: 'assembly', title: 'Ensamble', text: 'Ensamble de conjuntos y subconjuntos en salas controladas.' },
  { icon: 'automation', title: 'Automatización', text: 'Estaciones automatizadas para procesos repetitivos de alta exactitud.' },
  { icon: 'ruler', title: 'Inspección', text: 'Laboratorio metrológico con equipos calibrados y trazables.' },
  { icon: 'package', title: 'Empaque', text: 'Empaque protector y de barra para productos estériles o limpios.' },
  { icon: 'shield', title: 'Control de calidad', text: 'Unidad independiente con autoridad de liberación de lotes.' },
]

/** Flujo productivo Diseño → Distribución */
export const manufacturingFlow = ['Diseño', 'Manufactura', 'Inspección', 'Empaque', 'Distribución']

/** Números de capacidad productiva */
export const capacityStats = [
  { value: 250, suffix: '+', label: 'Colaboradores especializados' },
  { value: 3, suffix: '', label: 'Plantas / líneas especializadas' },
  { value: 25, suffix: 'M+', label: 'Unidades producidas' },
  { value: 18, suffix: '', label: 'Mercados internacionales' },
]

/**
 * Mercados de exportación (contenido demostrativo del sitio;
 * no constituye afirmación comercial específica).
 */
export const exportMarkets = [
  { country: 'Estados Unidos', code: 'US', x: 22, y: 34 },
  { country: 'Canadá', code: 'CA', x: 27, y: 20 },
  { country: 'México', code: 'MX', x: 17, y: 33 },
  { country: 'Alemania', code: 'DE', x: 52, y: 24 },
  { country: 'España', code: 'ES', x: 46, y: 30 },
  { country: 'Colombia', code: 'CO', x: 26, y: 56 },
  { country: 'Panamá', code: 'PA', x: 24, y: 55 },
  { country: 'Chile', code: 'CL', x: 29, y: 78 },
  { country: 'Brasil', code: 'BR', x: 37, y: 68 },
]

/** Razones para trabajar aquí */
export const careerBenefits = [
  { icon: 'trendingUp', title: 'Desarrollo profesional', text: 'Planes de carrera y movilidad interna entre áreas técnicas.' },
  { icon: 'bookOpen', title: 'Capacitación continua', text: 'Formación técnica y normativa constante, pagada por la empresa.' },
  { icon: 'lightbulb', title: 'Ambiente de innovación', text: 'Proyectos de mejora y nuevas tecnologías en procesos reales.' },
  { icon: 'users', title: 'Trabajo multidisciplinario', text: 'Ingeniería, calidad y producción colaborando codo a codo.' },
  { icon: 'rocket', title: 'Oportunidades de crecimiento', text: 'La operación crece y las personas crecen con ella.' },
  { icon: 'globe', title: 'Impacto internacional', text: 'Productos que llegan a hospitales y clínicas de todo el mundo.' },
]
