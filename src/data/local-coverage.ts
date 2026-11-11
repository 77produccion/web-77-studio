/**
 * Cobertura local del Eje Cafetero.
 * La sede física es Armenia. Pereira y Manizales se atienden desde ahí.
 * No hay páginas por municipio: el contenido distinto vive en la ciudad y en el servicio.
 */

export interface Faq {
  question: string;
  answer: string;
}

export interface Municipality {
  name: string;
  department: string;
  note: string;
}

export type ServiceSlug = 'marketing-digital' | 'automatizacion' | 'agentes-ia' | 'paginas-web';
export type CitySlug = 'armenia' | 'pereira' | 'manizales';

export interface LocalService {
  slug: ServiceSlug;
  name: string;
  short: string;
  parentPath: string;
  parentLabel: string;
}

export interface CityPage {
  slug: CitySlug;
  name: string;
  department: string;
  hasOffice: boolean;
  title: string;
  description: string;
  keywords: string[];
  h1: string;
  eyebrow: string;
  lead: string[];
  economyTitle: string;
  economy: string[];
  sectors: { title: string; text: string }[];
  serviceNotes: Record<ServiceSlug, string>;
  processNote: string;
  municipalitiesIntro: string;
  municipalities: Municipality[];
  faqs: Faq[];
  whatsappMessage: string;
}

export interface ServiceCityPage {
  city: CitySlug;
  service: ServiceSlug;
  title: string;
  description: string;
  keywords: string[];
  h1: string;
  lead: string[];
  sections: { heading: string; paragraphs: string[] }[];
  situations: { title: string; text: string }[];
  faqs: Faq[];
  whatsappMessage: string;
}

export const HUB_PATH = '/eje-cafetero/';

export const LOCAL_SERVICES: LocalService[] = [
  {
    slug: 'marketing-digital',
    name: 'Agencia de marketing digital',
    short: 'Estrategia, Meta Ads, Google Ads y contenido',
    parentPath: '/marketing/',
    parentLabel: 'Marketing',
  },
  {
    slug: 'automatizacion',
    name: 'Automatización de procesos con IA',
    short: 'Flujos, herramientas conectadas y seguimiento',
    parentPath: '/ia-automatizacion/',
    parentLabel: 'IA y automatización',
  },
  {
    slug: 'agentes-ia',
    name: 'Chatbots y agentes de IA',
    short: 'WhatsApp y agentes que entienden el mensaje',
    parentPath: '/ia-automatizacion/',
    parentLabel: 'IA y automatización',
  },
  {
    slug: 'paginas-web',
    name: 'Diseño de páginas web',
    short: 'Sitios y landing pages que convierten',
    parentPath: '/web/',
    parentLabel: 'Desarrollo web',
  },
];

export function cityPath(slug: string): string {
  return `/eje-cafetero/${slug}/`;
}

export function servicePath(city: string, service: string): string {
  return `/eje-cafetero/${city}/${service}/`;
}

const COLOMBIA = { '@type': 'Country', name: 'Colombia' };

function region(name: string) {
  return {
    '@type': 'AdministrativeArea',
    name,
    containedInPlace: COLOMBIA,
  };
}

function city(name: string, regionName: string) {
  return {
    '@type': 'City',
    name,
    containedInPlace: region(regionName),
  };
}

/** Ciudades y municipios que el LocalBusiness declara en areaServed. */
export const AREA_SERVED = [
  COLOMBIA,
  { '@type': 'Country', name: 'United States' },
  { '@type': 'Place', name: 'Latin America' },
  region('Quindío'),
  region('Risaralda'),
  region('Caldas'),
  region('Valle del Cauca'),
  city('Armenia', 'Quindío'),
  city('Calarcá', 'Quindío'),
  city('Montenegro', 'Quindío'),
  city('Quimbaya', 'Quindío'),
  city('La Tebaida', 'Quindío'),
  city('Circasia', 'Quindío'),
  city('Filandia', 'Quindío'),
  city('Salento', 'Quindío'),
  city('Pereira', 'Risaralda'),
  city('Dosquebradas', 'Risaralda'),
  city('Santa Rosa de Cabal', 'Risaralda'),
  city('La Virginia', 'Risaralda'),
  city('Manizales', 'Caldas'),
  city('Villamaría', 'Caldas'),
  city('Chinchiná', 'Caldas'),
  city('Cartago', 'Valle del Cauca'),
];

export const WORK_STEPS = [
  {
    name: 'Entendemos',
    text: 'Revisamos el negocio, a quién le vende, por dónde llegan las preguntas y dónde se atasca la operación. Sin ese mapa no proponemos pauta ni software.',
  },
  {
    name: 'Proponemos',
    text: 'Armamos un plan concreto: qué canal, qué página, qué flujo y qué se mide. El alcance cabe en una conversación, no en un documento eterno.',
  },
  {
    name: 'Creamos',
    text: 'Ejecutamos campañas, piezas, el sitio o la automatización. Marketing, web e IA salen del mismo equipo, no de tres proveedores que no se hablan.',
  },
  {
    name: 'Optimizamos',
    text: 'Miramos mensajes respondidos, citas, cotizaciones y costo por resultado. Ajustamos lo que el número muestra, no lo que se siente en una reunión.',
  },
];

const sharedPriceAnswer =
  'No publicamos una tarifa única. Una landing para una campaña no cuesta lo mismo que un sistema de seguimiento con WhatsApp, pauta y sitio. En la primera conversación acotamos el alcance y de ahí sale una propuesta. El diagnóstico inicial no exige un contrato.';

const notSocialAnswer =
  'No. 77 Studio no es una agencia de redes sociales. El contenido y la pauta sirven para captar demanda y conectar con la web, el WhatsApp y la operación. Publicar por publicar no es el servicio.';

export const CITIES: CityPage[] = [
  {
    slug: 'armenia',
    name: 'Armenia',
    department: 'Quindío',
    hasOffice: true,
    title: 'Agencia de marketing digital, automatización e IA en Armenia | 77 Studio',
    description:
      'Sede en Armenia, Quindío. Marketing digital, automatización, agentes de IA y páginas web para empresas de la ciudad y del norte del departamento.',
    keywords: [
      'agencia de marketing digital en Armenia',
      'automatización de procesos con IA en Armenia',
      'chatbots para empresas en Armenia',
      'diseño de páginas web en Armenia',
      'agencia de marketing Armenia Quindío',
    ],
    h1: 'Agencia de marketing digital, automatización e IA en Armenia',
    eyebrow: 'Sede en Armenia, Quindío',
    lead: [
      '77 Studio trabaja desde Armenia. La sede está en la carrera 14 #35 Norte 18, al norte de la ciudad. Desde ahí acompañamos empresas que venden en Armenia y en los municipios cercanos del Quindío, y también equipos en Pereira, Manizales y por fuera de la región.',
      'Somos un socio de crecimiento: marketing, páginas web, automatización e inteligencia artificial en un solo equipo. No administramos redes sociales como servicio suelto. Si el anuncio, el sitio y el WhatsApp no conversan, el presupuesto se va en conversaciones que nadie cierra.',
    ],
    economyTitle: 'Cómo se mueve el negocio en Armenia',
    economy: [
      'Armenia es la capital del Quindío y el centro de servicios del departamento. El paisaje cafetero marca la economía de la región: hay marcas de café, fincas que reciben visitantes, exportadores y comercios que viven de esa cadena, aunque no todos vendan el grano directo al público.',
      'El turismo no se queda en el centro. Salento, Filandia, el Parque del Café en Montenegro y los pueblos del circuito cafetero jalan visitantes que muchas veces duermen, comen o contratan servicios con empresas basadas en Armenia. El comercio local, en cambio, le vende a quien vive aquí: clínicas, colegios, constructoras del norte, almacenes y firmas de servicios.',
      'También pesan la educación —la Universidad del Quindío y una oferta amplia de colegios y formación continua— y la salud, con consultorios y clínicas que reciben pacientes de Calarcá, Circasia, La Tebaida y Montenegro. La construcción se nota sobre todo en el norte, donde está la sede. No citamos cifras de mercado: cambian y no las necesitamos para saber dónde se atasca una empresa.',
    ],
    sectors: [
      {
        title: 'Café y experiencia',
        text: 'Marcas, fincas y tiendas que tienen que explicar origen, visita o producto a alguien que todavía no los conoce. Les sirve una página clara y una pauta que no dependa de publicar todos los días.',
      },
      {
        title: 'Turismo y hospitalidad',
        text: 'Hoteles, operadores y restaurantes reciben las mismas preguntas por WhatsApp: fechas, cupos, cómo llegar, qué incluye. Si eso se responde a mano, se pierden reservas en temporada.',
      },
      {
        title: 'Comercio y servicios',
        text: 'Negocios del norte y del centro que compiten por la misma búsqueda en Google y por el mismo mensaje en Instagram. Sin una página que explique la oferta, el anuncio termina en el perfil y ahí se enfría.',
      },
      {
        title: 'Salud',
        text: 'Consultorios y clínicas que agendan por chat. El cuello de botella suele ser confirmar, recordar y no dejar la cita en un chat que solo entiende una persona.',
      },
      {
        title: 'Construcción y educación',
        text: 'Constructoras que cotizan con PDF y academias o colegios con picos de matrícula. En ambos casos el seguimiento manual se rompe cuando sube el volumen.',
      },
    ],
    serviceNotes: {
      'marketing-digital':
        'En Armenia la pauta tiene dos públicos distintos: quien busca un servicio local (una clínica, un colegio, un local) y quien está planeando un viaje o una compra de café y todavía no eligió con quién. No se pautan igual.',
      automatizacion:
        'El patrón que más vemos es el mismo dato copiado tres veces: el mensaje de WhatsApp, una hoja y el cuaderno de quien atiende. Conectar eso ahorra más que “ponerle IA” a un proceso que nadie describió.',
      'agentes-ia':
        'Un agente sirve cuando las preguntas se repiten y la respuesta no es un diagnóstico ni una promesa. En turismo y comercio local, el primer filtro (fechas, municipio, qué necesitan) ya ordena el día.',
      'paginas-web':
        'Muchas empresas de Armenia siguen vendiendo desde el perfil de Instagram o un sitio lento. La página tiene que decir qué hacen, en qué municipios atienden y cómo escribir por WhatsApp, sin dar vueltas.',
    },
    processNote:
      'Las reuniones de arranque pueden ser en la sede del norte de Armenia o por videollamada. El teléfono de contacto es el de Colombia, +57 314 849 0955.',
    municipalitiesIntro:
      'Desde Armenia acompañamos empresas de estos municipios. No tenemos oficina en cada pueblo: el trabajo es remoto y, cuando hace falta ver la operación, se acuerda una visita desde la sede.',
    municipalities: [
      { name: 'Calarcá', department: 'Quindío', note: 'Va con Armenia en el día a día comercial. Muchos negocios atienden las dos ciudades y necesitan decirlo en la web y en la pauta.' },
      { name: 'Circasia', department: 'Quindío', note: 'Municipio pegado al norte, cerca de la sede. Comercio, fincas y servicios que a veces se anuncian solo como “Armenia” y pierden a quien busca Circasia.' },
      { name: 'Montenegro', department: 'Quindío', note: 'Café y turismo, con el Parque del Café como imán de visitantes. Las empresas de aquí compiten por la atención de quien ya viene a la región.' },
      { name: 'Quimbaya', department: 'Quindío', note: 'Café, campo y un comercio que vende tanto al residente como al visitante de fin de semana.' },
      { name: 'La Tebaida', department: 'Quindío', note: 'Corredor hacia el aeropuerto El Edén. Hoteles, transporte y servicios que dependen de que los encuentren antes de aterrizar.' },
      { name: 'Filandia', department: 'Quindío', note: 'Pueblo de visita corta. Quien tiene hotel, restaurante o experiencia necesita cupos claros y respuesta rápida, no un feed abandonado.' },
      { name: 'Salento', department: 'Quindío', note: 'El pueblo con más presión de demanda turística del departamento. La pregunta no es “¿hacemos redes?” sino “¿quién responde cuando escriben?”.' },
    ],
    faqs: [
      {
        question: '¿77 Studio tiene oficina en Armenia?',
        answer: 'Sí. La sede está en la carrera 14 #35 Norte 18, Armenia, Quindío, Colombia. Es la única sede física en el Eje Cafetero. El teléfono es +57 314 849 0955.',
      },
      {
        question: '¿Son una agencia de redes sociales en Armenia?',
        answer: notSocialAnswer,
      },
      {
        question: '¿Atienden empresas de Salento, Filandia y Calarcá?',
        answer: 'Sí. Esos municipios, junto con Montenegro, Quimbaya, La Tebaida y Circasia, hacen parte de la cobertura desde la sede de Armenia. No hay una oficina en cada uno.',
      },
      {
        question: '¿Cuánto cuesta el marketing o una página web en Armenia?',
        answer: sharedPriceAnswer,
      },
      {
        question: '¿Pueden automatizar el WhatsApp de un hotel o una clínica?',
        answer: 'Sí, cuando el flujo está claro: qué se responde solo, qué pasa a una persona y qué no debe contestar un bot. En salud no reemplazamos el criterio de un profesional. El agente recoge datos y entrega la conversación.',
      },
      {
        question: '¿Cuál es el horario?',
        answer: 'El horario de referencia, pendiente de confirmar con el equipo, es de lunes a viernes de 8:00 a. m. a 6:00 p. m. y sábados de 9:00 a. m. a 1:00 p. m. WhatsApp y el formulario quedan abiertos fuera de ese rango; la respuesta es en horario de trabajo.',
      },
      {
        question: '¿También trabajan con empresas por fuera del Quindío?',
        answer: 'Sí. Pereira y Manizales se atienden desde Armenia, igual que equipos en otras ciudades de Colombia y en Estados Unidos, en remoto. 77 Studio opera como 77 Studio SAS en Colombia y 77 Studio LLC en Estados Unidos.',
      },
    ],
    whatsappMessage:
      'Hola 77 Studio 👋 Vi la página de Armenia y quisiera conversar sobre marketing, automatización o la web de mi empresa.',
  },
  {
    slug: 'pereira',
    name: 'Pereira',
    department: 'Risaralda',
    hasOffice: false,
    title: 'Agencia de marketing digital, automatización e IA en Pereira | 77 Studio',
    description:
      'Marketing digital, automatización, agentes de IA y páginas web para empresas de Pereira, Dosquebradas y La Virginia. Se atiende desde la sede en Armenia.',
    keywords: [
      'agencia de marketing digital en Pereira',
      'automatización de procesos en Pereira',
      'chatbots para empresas en Pereira',
      'diseño de páginas web en Pereira',
      'marketing digital Dosquebradas',
    ],
    h1: 'Agencia de marketing digital, automatización e IA en Pereira',
    eyebrow: 'Pereira y el área metropolitana, desde Armenia',
    lead: [
      'No tenemos oficina en Pereira. Las empresas de Pereira, Dosquebradas, La Virginia, Santa Rosa de Cabal y Cartago se atienden desde la sede de Armenia, en la carrera 14 #35 Norte 18. El teléfono es el mismo: +57 314 849 0955.',
      'Pereira es un mercado más grande y más competido que el de un pueblo del Quindío. Aquí una empresa le vende al área metropolitana, no a una sola calle. Por eso el trabajo no es “estar en redes”: es captar una búsqueda con intención, tener una página que explique la oferta y no perder el mensaje que llega después del anuncio.',
    ],
    economyTitle: 'Pereira no es una versión grande de Armenia',
    economy: [
      'Pereira es la capital de Risaralda y el centro del Área Metropolitana de Centro Occidente, junto con Dosquebradas y La Virginia. Quien tiene un local, una clínica o un equipo comercial suele atender las tres ciudades aunque la razón social diga solo Pereira. Santa Rosa de Cabal suma turismo de termales y es el paso hacia Manizales. Cartago, ya en el norte del Valle, funciona como puerta entre el Eje y el valle del Cauca.',
      'La ciudad combina comercio, salud, educación superior —entre otras, la Universidad Tecnológica de Pereira— y empresas de servicios e industria liviana. El aeropuerto Matecaña acerca cuentas que venden a viajeros y a empresas de otras ciudades. El café sigue presente en la región, pero en Pereira el dinero del día a día también está en clínicas, distribución, educación y comercio urbano.',
      'Eso cambia la publicidad. En un pueblo turístico la gente pregunta por una experiencia. En Pereira mucha de la demanda ya trae intención: “odontología en Pereira”, “distribuidor en Dosquebradas”, “software para mi negocio”. Google Ads y una landing importan tanto como el contenido. No inventamos participación de mercado ni listas de clientes.',
    ],
    sectors: [
      {
        title: 'Salud en el área metropolitana',
        text: 'Clínicas, laboratorios y consultorios que reciben pacientes de Pereira y Dosquebradas. El anuncio llena la agenda solo si alguien confirma. Si el chat se atasca, la pauta se ve cara.',
      },
      {
        title: 'Comercio y distribución',
        text: 'Equipos que cotizan por WhatsApp a almacenes de Cuba, Centro, Circunvalar o Dosquebradas. El seguimiento de la cotización suele vivir en el celular de un vendedor.',
      },
      {
        title: 'Educación',
        text: 'Universidades, institutos y academias con picos de inscripción. Las preguntas se repiten y el equipo de admisiones no da abasto en esas semanas.',
      },
      {
        title: 'Industria y servicios B2B',
        text: 'Empresas que no venden por impulso. Necesitan que el anuncio y la web filtren y que un humano reciba un prospecto con contexto, no un “hola, info”.',
      },
      {
        title: 'Turismo de paso',
        text: 'Hoteles y transporte ligados a Matecaña o a la ruta hacia Santa Rosa y Manizales. Compiten con quien aparece primero cuando alguien busca la noche anterior.',
      },
    ],
    serviceNotes: {
      'marketing-digital':
        'En Pereira separamos búsqueda (alguien ya quiere el servicio) y descubrimiento (alguien todavía no sabe que lo necesita). El área metropolitana pide anuncios y páginas que nombren Dosquebradas y La Virginia cuando de verdad se atiende allá.',
      automatizacion:
        'El caso típico es comercial: cotización, seguimiento y el dato que nunca pasó del WhatsApp al sistema. Conectar eso importa más que un tablero nuevo que nadie abre.',
      'agentes-ia':
        'Un agente de primer contacto califica ciudad, necesidad y urgencia, y deja pasar de una vez lo que es una urgencia clínica o un cliente molesto. No deja sola la conversación.',
      'paginas-web':
        'Hace falta una web que cargue rápido en el celular y diga cobertura, servicios y el siguiente paso. En una subasta de Google más competida, una página lenta o confusa se come el clic.',
    },
    processNote:
      'La reunión de diagnóstico es por videollamada. Si el proyecto necesita ver la operación en Pereira o Dosquebradas, la visita se coordina desde Armenia. No hay sede en Risaralda.',
    municipalitiesIntro:
      'Estos son los municipios que cubrimos junto con Pereira. Cartago queda en el Valle; lo atendemos desde la misma operación porque comercialmente mira hacia Pereira.',
    municipalities: [
      { name: 'Dosquebradas', department: 'Risaralda', note: 'Hace parte del área metropolitana. Muchas empresas dicen “Pereira” y se olvidan de quien busca el servicio con el nombre de Dosquebradas.' },
      { name: 'La Virginia', department: 'Risaralda', note: 'Tercer municipio del área. Comercio y empresas que cruzan el río todos los días y no siempre aparecen en la pauta de la capital.' },
      { name: 'Santa Rosa de Cabal', department: 'Risaralda', note: 'Termales, hotel y la vía a Manizales. La demanda mezcla turismo y servicios para quien vive en el municipio.' },
      { name: 'Cartago', department: 'Valle del Cauca', note: 'Norte del Valle, a una distancia corta de Pereira. Lo cubrimos desde esta operación, no con una oficina propia.' },
    ],
    faqs: [
      {
        question: '¿77 Studio tiene oficina en Pereira?',
        answer: 'No. Pereira se atiende desde la sede de Armenia, carrera 14 #35 Norte 18. Las reuniones arrancan por videollamada. El teléfono es +57 314 849 0955.',
      },
      {
        question: '¿Trabajan con empresas de Dosquebradas y La Virginia?',
        answer: 'Sí. Son parte del área metropolitana y las tratamos junto con Pereira. También cubrimos Santa Rosa de Cabal y Cartago, en el norte del Valle.',
      },
      {
        question: '¿Qué es mejor en Pereira, Meta Ads o Google Ads?',
        answer: 'Depende de si la gente ya está buscando el servicio o todavía hay que explicar la oferta. En salud, educación y servicios con nombre propio, la búsqueda suele traer mejor intención. Meta sirve para mostrar algo que la persona aún no escribió en Google. Muchas veces se usan los dos, con una página y un WhatsApp que reciban el clic.',
      },
      {
        question: '¿Cuánto cuesta una agencia de marketing en Pereira?',
        answer: sharedPriceAnswer,
      },
      {
        question: '¿Pueden ir a una reunión presencial en Pereira?',
        answer: 'El día a día es remoto. Si el proyecto justifica ver el local o al equipo, coordinamos la visita desde Armenia. No prometemos una presencia semanal en la ciudad.',
      },
      {
        question: '¿Hacen manejo de redes sociales en Pereira?',
        answer: notSocialAnswer,
      },
    ],
    whatsappMessage:
      'Hola 77 Studio 👋 Vi la página de Pereira y quisiera conversar sobre marketing, automatización o la web de mi empresa.',
  },
  {
    slug: 'manizales',
    name: 'Manizales',
    department: 'Caldas',
    hasOffice: false,
    title: 'Agencia de marketing digital, automatización e IA en Manizales | 77 Studio',
    description:
      'Marketing digital, automatización, agentes de IA y páginas web para empresas de Manizales, Villamaría y Chinchiná. Se atiende desde la sede en Armenia.',
    keywords: [
      'agencia de marketing digital en Manizales',
      'automatización con IA en Manizales',
      'chatbots para empresas en Manizales',
      'diseño de páginas web en Manizales',
      'marketing digital Villamaría Chinchiná',
    ],
    h1: 'Agencia de marketing digital, automatización e IA en Manizales',
    eyebrow: 'Manizales y Caldas, desde Armenia',
    lead: [
      'No tenemos oficina en Manizales. La sede está en Armenia y desde ahí trabajamos con empresas de Manizales, Villamaría y Chinchiná. El contacto es +57 314 849 0955, por WhatsApp o por el formulario.',
      'Manizales es una ciudad universitaria, cafetera y de ladera. El cliente suele estar en el celular, entre el campus, el centro y Villamaría, que en la práctica funciona como la misma ciudad. Una página pesada o un anuncio que no dice para quién es se caen rápido en ese contexto.',
    ],
    economyTitle: 'Qué pide el mercado de Manizales',
    economy: [
      'Caldas es departamento cafetero y Manizales es su capital. Chinchiná, entre Manizales y Pereira, sigue siendo un municipio de café y de empresas ligadas al grano. Hay marcas, exportadores y comercios que venden tanto el producto como la historia. No trabajamos “para el sector” en abstracto: trabajamos para la empresa que tiene que explicar lote, visita, tienda o servicio sin perder el hilo comercial.',
      'La otra mitad de la ciudad es educativa. La Universidad Nacional sede Manizales, la Universidad de Caldas, la Universidad de Manizales y otras instituciones jalonan restaurantes, academias, vivienda y servicios alrededor de los campus. Esa demanda es estacional: inscripción, inicio de semestre, vacaciones. Quien no prepara el canal antes del pico, responde tarde.',
      'También hay salud, firmas profesionales y empresas de tecnología y servicios que ya viven en digital y no necesitan “que les manejen el Instagram”. Necesitan demanda medible y una operación que no dependa de una sola persona. La topografía importa poco en un anuncio y mucho en la promesa: si el cliente está en Villamaría, la página tiene que decirlo.',
    ],
    sectors: [
      {
        title: 'Café de Caldas',
        text: 'Marcas y comercializadores que venden a otras empresas o a un público que no está en la finca. La web y el seguimiento de la muestra o la cotización pesan más que un reel suelto.',
      },
      {
        title: 'Educación y alrededor del campus',
        text: 'Instituciones, academias y negocios que viven del calendario académico. Las preguntas de admisión se repiten y saturan el mismo WhatsApp.',
      },
      {
        title: 'Servicios profesionales',
        text: 'Estudios y firmas que se ven más chicos de lo que son porque el sitio quedó viejo o nunca existió. En un mercado pequeño, la confianza visual decide la llamada.',
      },
      {
        title: 'Salud',
        text: 'Igual que en el resto del Eje: la cita se pide por chat. El recordatorio y el orden de la agenda no deberían depender de la memoria de recepción.',
      },
      {
        title: 'Villamaría como la misma ciudad',
        text: 'Muchos clientes cruzan todos los días. Tratar a Villamaría como “otra plaza” en la página y en la pauta evita perder búsquedas obvias.',
      },
    ],
    serviceNotes: {
      'marketing-digital':
        'En Manizales conviene alinear la pauta con el calendario (matrículas, cosecha comercial, temporadas) y con búsquedas muy concretas. El mercado es más chico: un mensaje genérico se gasta rápido.',
      automatizacion:
        'Equipos pequeños hacen ventas y operación a la vez. Automatizar el recordatorio, el paso de la cotización y el reporte semanal les devuelve horas, sin montar un departamento de sistemas.',
      'agentes-ia':
        'El agente recoge programa de interés, municipio y plazo, o los datos de un pedido de café B2B, y se los pasa a una persona. No inventa precios ni cierra solo un negocio que exige criterio.',
      'paginas-web':
        'La página tiene que cargar bien en móvil, porque así llega la mayoría. Y tiene que verse a la altura de una firma o una marca de café que compite con empresas de otras ciudades.',
    },
    processNote:
      'El diagnóstico es por videollamada. Una visita a Manizales o Chinchiná se acuerda desde Armenia cuando el proyecto lo necesita. No hay sede en Caldas.',
    municipalitiesIntro:
      'Además de Manizales, esta es la cobertura cercana que declaramos. Chinchiná queda en el corredor hacia Pereira; Villamaría es contigua a la ciudad.',
    municipalities: [
      { name: 'Villamaría', department: 'Caldas', note: 'Conurbada con Manizales. Quien vende en una debería decirlo en la otra: la búsqueda y el cliente no respetan el límite municipal.' },
      { name: 'Chinchiná', department: 'Caldas', note: 'Municipio cafetero entre Manizales y Pereira. Marcas, comercio y servicios que a veces no aparecen ni en una ciudad ni en la otra.' },
    ],
    faqs: [
      {
        question: '¿77 Studio tiene oficina en Manizales?',
        answer: 'No. Manizales se atiende desde la sede de Armenia, carrera 14 #35 Norte 18. El teléfono es +57 314 849 0955.',
      },
      {
        question: '¿Atienden empresas de Villamaría y Chinchiná?',
        answer: 'Sí. Villamaría va con Manizales en la misma cobertura urbana y Chinchiná entra en el corredor cafetero entre Manizales y Pereira.',
      },
      {
        question: '¿Trabajan con universidades o con marcas de café?',
        answer: 'Podemos trabajar con instituciones educativas, academias y empresas del café si el proyecto encaja: página, captación o automatización del seguimiento. No publicamos clientes ni cifras que no sean de ese proyecto.',
      },
      {
        question: '¿Cuánto vale un chatbot o una página en Manizales?',
        answer: sharedPriceAnswer,
      },
      {
        question: '¿La inteligencia artificial reemplaza al equipo de la empresa?',
        answer: 'No. Quita la parte repetida: responder lo mismo, pasar datos, recordar una cita. La decisión comercial y el oficio siguen siendo de la empresa. Si no hay un proceso claro, la IA solo acelera el desorden.',
      },
      {
        question: '¿Hacen community manager en Manizales?',
        answer: notSocialAnswer,
      },
    ],
    whatsappMessage:
      'Hola 77 Studio 👋 Vi la página de Manizales y quisiera conversar sobre marketing, automatización o la web de mi empresa.',
  },
];

export function getCity(slug: string): CityPage | undefined {
  return CITIES.find((city) => city.slug === slug);
}

export function getLocalService(slug: string): LocalService | undefined {
  return LOCAL_SERVICES.find((service) => service.slug === slug);
}

export const HUB = {
  title: 'Marketing, automatización e IA en el Eje Cafetero | 77 Studio',
  description:
    'Cobertura de 77 Studio en Armenia, Pereira, Manizales y municipios cercanos. La sede está en Armenia. Marketing, automatización, agentes de IA y páginas web.',
  keywords: [
    'marketing digital Eje Cafetero',
    'agencia de marketing Armenia Pereira Manizales',
    'automatización e IA Eje Cafetero',
    '77 Studio Armenia',
  ],
  h1: 'Marketing digital, automatización e IA en el Eje Cafetero',
  lead: [
    '77 Studio es un socio de crecimiento para empresas: marketing con pauta, páginas web, automatización e inteligencia artificial. La sede está en Armenia, Quindío, en la carrera 14 #35 Norte 18. Pereira y Manizales no tienen oficina propia. Se atienden desde Armenia, igual que los municipios de alrededor.',
    'Esta página junta esa cobertura. Si buscas el detalle de una ciudad o de un servicio en esa ciudad, entra a la página correspondiente. No abrimos una URL por cada pueblo: ahí no habría nada distinto que decir y solo diluiría lo que sí somos.',
  ],
  faqs: [
    {
      question: '¿Dónde está la sede de 77 Studio?',
      answer: 'En la carrera 14 #35 Norte 18, Armenia, Quindío, Colombia. Teléfono y WhatsApp: +57 314 849 0955. La empresa opera como 77 Studio SAS en Colombia y 77 Studio LLC en Estados Unidos.',
    },
    {
      question: '¿Tienen oficinas en Pereira o Manizales?',
      answer: 'No. Esas ciudades, y los municipios cercanos, se atienden desde Armenia. La reunión inicial es por videollamada. Una visita se coordina si el proyecto la necesita.',
    },
    {
      question: '¿Qué municipios cubren?',
      answer: 'En el Quindío: Armenia, Calarcá, Montenegro, Quimbaya, La Tebaida, Circasia, Filandia y Salento. En Risaralda: Pereira, Dosquebradas, Santa Rosa de Cabal y La Virginia. En Caldas: Manizales, Villamaría y Chinchiná. En el Valle: Cartago. También trabajamos con empresas de otras ciudades y de Estados Unidos, en remoto.',
    },
    {
      question: '¿Son una agencia de redes sociales del Eje Cafetero?',
      answer: notSocialAnswer,
    },
    {
      question: '¿Cuál es el horario de atención?',
      answer: 'Horario de referencia, pendiente de confirmar: lunes a viernes de 8:00 a. m. a 6:00 p. m. y sábados de 9:00 a. m. a 1:00 p. m. Es el mismo para toda la cobertura.',
    },
  ] satisfies Faq[],
};
