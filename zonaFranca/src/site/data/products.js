/**
 * Línea de productos de MedTech Precision (contenido de demostración).
 * Cada producto define categoría, tipo de dispositivo y aplicaciones
 * para alimentar los filtros del catálogo.
 */

export const productCategories = [
  'Dispositivos vasculares',
  'Sistemas de administración',
  'Componentes de precisión',
  'Tubos y extrusionados',
  'Intervencionismo',
]

export const products = [
  {
    id: 'cateteres-precision',
    name: 'Catéteres médicos de precisión',
    icon: 'catheter',
    category: 'Dispositivos vasculares',
    deviceType: 'Catéter',
    applications: ['Acceso vascular', 'Uso hospitalario'],
    description:
      'Dispositivos diseñados para procedimientos médicos especializados, fabricados bajo estrictos controles dimensionales y de calidad.',
    features: [
      'Tolerancias dimensionales controladas',
      'Materiales grado médico biocompatibles',
      'Marcadores radiopacos opcionales',
      'Empaque protector individual',
    ],
  },
  {
    id: 'sets-administracion',
    name: 'Sets de administración médica',
    icon: 'drip',
    category: 'Sistemas de administración',
    deviceType: 'Set',
    applications: ['Uso hospitalario', 'Terapia intravenosa'],
    description:
      'Componentes y sistemas destinados a la administración controlada de soluciones médicas.',
    features: [
      'Conectores con estándares internacionales',
      'Tubos libres de PVC y DEHP disponibles',
      'Filtros y llaves de paso integrables',
      'Configuraciones personalizadas por cliente',
    ],
  },
  {
    id: 'componentes-dispositivos',
    name: 'Componentes para dispositivos médicos',
    icon: 'gear',
    category: 'Componentes de precisión',
    deviceType: 'Componente',
    applications: ['Equipos médicos', 'OEM / Manufactura por contrato'],
    description:
      'Piezas de alta precisión utilizadas en equipos y dispositivos médicos especializados.',
    features: [
      'Micromaquinado y moldeo técnico',
      'Inspección dimensional 100% documentada',
      'Polímeros y metales implantables no implantables',
      'Trazabilidad completa por lote',
    ],
  },
  {
    id: 'acceso-vascular',
    name: 'Sistemas de acceso vascular',
    icon: 'port',
    category: 'Dispositivos vasculares',
    deviceType: 'Sistema',
    applications: ['Acceso vascular', 'Oncología', 'Uso hospitalario'],
    description:
      'Componentes diseñados para aplicaciones de acceso vascular bajo especificaciones técnicas controladas.',
    features: [
      'Diseño de flujo validado en banco de pruebas',
      'Compatibilidad con técnicas Seldinger',
      'Introductores y guías complementarios',
      'Presentación estéril de un solo uso',
    ],
  },
  {
    id: 'tubos-especializados',
    name: 'Tubos médicos especializados',
    icon: 'tube',
    category: 'Tubos y extrusionados',
    deviceType: 'Tubo',
    applications: ['Equipos médicos', 'Terapia intravenosa', 'OEM / Manufactura por contrato'],
    description:
      'Tubos fabricados con materiales seleccionados para aplicaciones médicas específicas.',
    features: [
      'Extrusión multicapa y microextrusión',
      'Silicona, TPU, PE y materiales técnicos',
      'Marcado por radio y tinta comestible',
      'Control de concentricidad en línea',
    ],
  },
  {
    id: 'dispositivos-intervencion',
    name: 'Dispositivos de intervención',
    icon: 'stent',
    category: 'Intervencionismo',
    deviceType: 'Dispositivo',
    applications: ['Intervencionismo', 'Acceso vascular'],
    description:
      'Componentes y dispositivos orientados a procedimientos médicos mínimamente invasivos.',
    features: [
      'Perfiles de baja fricción para navegación',
      'Ensamble limpio en sala controlada',
      'Pruebas funcionales por lote',
      'Documentación técnica de soporte regulatorio',
    ],
  },
]
