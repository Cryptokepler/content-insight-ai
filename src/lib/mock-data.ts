export interface AnalysisResult {
  score: number
  claridad: { nivel: string; detalle: string }
  propuestaValor: { nivel: string; detalle: string }
  fortalezas: string[]
  mejoras: string[]
  recomendaciones: string[]
  versionOptimizada: string
}

export const CONTENT_TYPES = [
  'Landing page',
  'Anuncio',
  'Email comercial',
  'Propuesta de valor',
  'Descripción de servicio',
  'Bio / presentación',
  'Video de YouTube',
] as const

export const EXAMPLE_TEXTS = [
  {
    label: 'Landing page mal optimizada',
    type: 'Landing page',
    text: 'Somos una empresa líder en soluciones digitales. Ofrecemos servicios de marketing, diseño y desarrollo web para todo tipo de empresas. Contáctanos hoy para una cotización gratuita. Nuestro equipo de expertos está listo para ayudarte a crecer tu negocio.',
  },
  {
    label: 'Anuncio corto',
    type: 'Anuncio',
    text: '¿Cansado de perder clientes? Nuestro software automatiza todo tu proceso de ventas. Prueba gratis 14 días.',
  },
  {
    label: 'Descripción de servicio',
    type: 'Descripción de servicio',
    text: 'Ofrecemos consultoría empresarial para PyMEs que buscan mejorar sus procesos internos y aumentar su productividad. Nuestros consultores tienen más de 10 años de experiencia en diferentes industrias.',
  },
]

const MOCK_RESPONSES: AnalysisResult[] = [
  {
    score: 42,
    claridad: {
      nivel: 'Bajo',
      detalle: 'El mensaje usa frases genéricas como "empresa líder" y "todo tipo de empresas" que no comunican nada específico. El lector no entiende qué te hace diferente ni por qué debería elegirte.',
    },
    propuestaValor: {
      nivel: 'Muy débil',
      detalle: 'No hay una propuesta de valor clara. "Servicios de marketing, diseño y desarrollo" es una lista de servicios, no un beneficio. No responde a la pregunta: ¿qué resultado voy a obtener?',
    },
    fortalezas: [
      'Incluye un llamado a la acción (CTA)',
      'Menciona que la cotización es gratuita (reduce fricción)',
      'Tono profesional y corporativo',
    ],
    mejoras: [
      'Eliminar clichés como "empresa líder" y "equipo de expertos"',
      'Definir un público objetivo específico en lugar de "todo tipo de empresas"',
      'Agregar un resultado concreto o métrica de éxito',
      'Crear urgencia o escasez en el mensaje',
      'Incluir prueba social (clientes, resultados, testimonios)',
    ],
    recomendaciones: [
      'Reemplazar "empresa líder" por un dato concreto: "Más de 200 empresas han aumentado sus ventas con nosotros"',
      'Definir el nicho: ¿PyMEs? ¿E-commerce? ¿Startups?',
      'Agregar un beneficio cuantificable: "Aumenta tus conversiones un 40%"',
      'Incluir al menos un testimonio o caso de éxito',
      'Reducir el texto a la mitad — cada palabra debe aportar valor',
    ],
    versionOptimizada: '¿Tu sitio web no genera clientes? Ayudamos a PyMEs de e-commerce a duplicar sus conversiones en 90 días con estrategias de marketing digital probadas.\n\n✅ +200 empresas atendidas | ⭐ 4.9/5 en satisfacción\n\nSolicita tu diagnóstico gratuito →',
  },
  {
    score: 74,
    claridad: {
      nivel: 'Alto',
      detalle: 'El mensaje es directo y va al punto. Identifica un problema claro ("perder clientes"), presenta una solución y ofrece una prueba gratuita. Buena estructura para un anuncio.',
    },
    propuestaValor: {
      nivel: 'Medio',
      detalle: 'La propuesta es clara pero genérica. "Automatiza todo tu proceso de ventas" es ambiguo — ¿qué parte exactamente? Falta especificidad sobre el resultado esperado.',
    },
    fortalezas: [
      'Abre con una pregunta que conecta con el dolor del cliente',
      'Mensaje conciso y fácil de escanear',
      'Incluye prueba gratuita que reduce el riesgo percibido',
    ],
    mejoras: [
      'Especificar qué parte del proceso se automatiza',
      'Agregar un dato de resultado ("Aumenta ventas un X%")',
      'Incluir diferenciador frente a la competencia',
    ],
    recomendaciones: [
      'Agregar una métrica: "Recupera hasta un 35% de clientes perdidos"',
      'Especificar el beneficio: "Automatiza seguimiento, cotizaciones y cierre"',
      'Añadir urgencia: "Cupos limitados" o "Solo esta semana"',
      'Incluir prueba social breve: "Usado por +500 equipos de ventas"',
    ],
    versionOptimizada: '¿Pierdes clientes por falta de seguimiento? Automatiza cotizaciones, seguimiento y cierre con un solo software.\n\n📈 Empresas que lo usan recuperan un 35% más de oportunidades.\n\nPrueba gratis 14 días — sin tarjeta de crédito →',
  },
  {
    score: 56,
    claridad: {
      nivel: 'Medio',
      detalle: 'El mensaje es comprensible pero poco memorable. Describe lo que haces pero no el impacto. "Mejorar procesos internos" es vago — el lector necesita saber el resultado tangible.',
    },
    propuestaValor: {
      nivel: 'Débil',
      detalle: '"10 años de experiencia" no es un diferenciador — muchos consultores lo dicen. No hay una razón clara por la que elegirte sobre otros.',
    },
    fortalezas: [
      'Define el público objetivo (PyMEs)',
      'Menciona experiencia como respaldo de credibilidad',
      'Estructura clara: problema → solución → credencial',
    ],
    mejoras: [
      'Reemplazar "mejorar procesos" por un resultado medible',
      'Cambiar "10 años de experiencia" por resultados logrados',
      'Agregar un caso de éxito o dato de impacto',
      'Incluir un CTA claro',
    ],
    recomendaciones: [
      'Liderar con el resultado: "Reducimos costos operativos un 30% en PyMEs"',
      'Cambiar credenciales por resultados: "Hemos optimizado +150 empresas" en vez de "10 años"',
      'Agregar un CTA: "Agenda tu diagnóstico gratuito"',
      'Especificar industrias fuertes en vez de "diferentes industrias"',
      'Incluir un mini caso de éxito de una línea',
    ],
    versionOptimizada: '¿Tu PyME pierde tiempo y dinero en procesos ineficientes? Nuestros consultores han ayudado a más de 150 empresas a reducir costos operativos hasta un 30%.\n\n🏭 Especialistas en manufactura, retail y servicios profesionales.\n\nAgenda tu diagnóstico gratuito — te mostramos dónde estás perdiendo dinero →',
  },
]

export function getAnalysisResult(index: number): AnalysisResult {
  return MOCK_RESPONSES[index % MOCK_RESPONSES.length]
}

export function getAnalysisForText(text: string): AnalysisResult {
  const len = text.length
  if (len < 120) return MOCK_RESPONSES[1]
  if (len < 220) return MOCK_RESPONSES[2]
  return MOCK_RESPONSES[0]
}

export interface HistoryEntry {
  id: string
  title: string
  contentType: string
  score: number
  date: string
  text: string
  result: AnalysisResult
}

export const MOCK_HISTORY: HistoryEntry[] = [
  { id: '1', title: 'Landing page - Agencia Digital', contentType: 'Landing page', score: 42, date: '2026-03-09', text: EXAMPLE_TEXTS[0].text, result: MOCK_RESPONSES[0] },
  { id: '2', title: 'Anuncio Facebook - Software CRM', contentType: 'Anuncio', score: 74, date: '2026-03-08', text: EXAMPLE_TEXTS[1].text, result: MOCK_RESPONSES[1] },
  { id: '3', title: 'Servicio de consultoría', contentType: 'Descripción de servicio', score: 56, date: '2026-03-07', text: EXAMPLE_TEXTS[2].text, result: MOCK_RESPONSES[2] },
  { id: '4', title: 'Email de bienvenida - SaaS', contentType: 'Email comercial', score: 83, date: '2026-03-06', text: 'Bienvenido a nuestra plataforma...', result: { ...MOCK_RESPONSES[1], score: 83 } },
  { id: '5', title: 'Bio LinkedIn - Consultor', contentType: 'Bio / presentación', score: 61, date: '2026-03-05', text: 'Soy consultor con experiencia...', result: { ...MOCK_RESPONSES[2], score: 61 } },
  { id: '6', title: 'Propuesta para inversores', contentType: 'Propuesta de valor', score: 88, date: '2026-03-04', text: 'Nuestra startup resuelve...', result: { ...MOCK_RESPONSES[1], score: 88 } },
  { id: '7', title: 'Anuncio Google Ads - Dentista', contentType: 'Anuncio', score: 45, date: '2026-03-03', text: 'Clínica dental profesional...', result: { ...MOCK_RESPONSES[0], score: 45 } },
  { id: '8', title: 'Landing curso online', contentType: 'Landing page', score: 71, date: '2026-03-02', text: 'Aprende marketing digital...', result: { ...MOCK_RESPONSES[1], score: 71 } },
  { id: '9', title: 'Email de seguimiento', contentType: 'Email comercial', score: 39, date: '2026-03-01', text: 'Hola, quería dar seguimiento...', result: { ...MOCK_RESPONSES[0], score: 39 } },
  { id: '10', title: 'Descripción servicio legal', contentType: 'Descripción de servicio', score: 67, date: '2026-02-28', text: 'Bufete de abogados especializado...', result: { ...MOCK_RESPONSES[2], score: 67 } },
]
