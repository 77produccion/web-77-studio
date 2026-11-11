import { readdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { CITIES, HUB_PATH, LOCAL_SERVICES, cityPath, servicePath } from '../data/local-coverage';

const ORIGIN = 'https://www.77studio.co';

interface BlogPostSummary {
  slug: string;
  title: string;
  description: string;
}

function readFrontmatterValue(block: string, key: string): string | undefined {
  const match = block.match(new RegExp(`^${key}:\\s*(.+)$`, 'm'));
  if (!match) return undefined;
  return match[1].trim().replace(/^['"]|['"]$/g, '');
}

function readBlogPosts(): BlogPostSummary[] {
  const dir = join(process.cwd(), 'src/content/blog');
  const posts: BlogPostSummary[] = [];

  for (const file of readdirSync(dir)) {
    if (!/\.mdx?$/.test(file)) continue;
    const raw = readFileSync(join(dir, file), 'utf8');
    const frontmatter = raw.match(/^---\n([\s\S]*?)\n---/);
    if (!frontmatter) continue;
    const block = frontmatter[1];
    if (/^draft:\s*true\s*$/m.test(block)) continue;
    const title = readFrontmatterValue(block, 'title');
    const description = readFrontmatterValue(block, 'description');
    if (!title || !description) continue;
    posts.push({
      slug: file.replace(/\.mdx?$/, ''),
      title,
      description,
    });
  }

  return posts.sort((a, b) => a.slug.localeCompare(b.slug));
}

const SERVICES = [
  {
    esName: 'Marketing con IA',
    enName: 'AI marketing',
    esPath: '/marketing/',
    enPath: '/en/marketing/',
    summary:
      'Estrategia, Meta Ads, Google Ads, contenido y automatización para captar demanda. No es gestión de redes sociales como servicio suelto: la pauta y el contenido sirven a un sistema de crecimiento.',
  },
  {
    esName: 'Desarrollo web',
    enName: 'Web development',
    esPath: '/web/',
    enPath: '/en/web/',
    summary:
      'Sitios corporativos y landing pages rápidas, pensadas para explicar la oferta, transmitir confianza y convertir (WhatsApp, formulario, SEO técnico).',
  },
  {
    esName: 'IA y automatización',
    enName: 'AI and automation',
    esPath: '/ia-automatizacion/',
    enPath: '/en/ia-automatizacion/',
    summary:
      'Automatización de procesos, conexión de herramientas, seguimiento comercial y agentes de IA donde ahorran tiempo de verdad.',
  },
  {
    esName: 'Productos digitales',
    enName: 'Digital products',
    esPath: '/productos-digitales/',
    enPath: '/en/productos-digitales/',
    summary:
      'Software a medida, MVPs, plataformas SaaS, portales y dashboards cuando la herramienta que la empresa necesita todavía no existe.',
  },
] as const;

function serviceLines(): string {
  return SERVICES.map(
    (service) =>
      `- [${service.esName}](${ORIGIN}${service.esPath}): ${service.summary} English: [${service.enName}](${ORIGIN}${service.enPath}).`
  ).join('\n');
}

function coverageLines(): string {
  const cities = CITIES.map((city) => {
    const role = city.hasOffice ? 'sede' : 'se atiende desde Armenia, sin oficina';
    const services = LOCAL_SERVICES.map(
      (service) => `[${service.name}](${ORIGIN}${servicePath(city.slug, service.slug)})`
    ).join(', ');
    return `- [${city.name}](${ORIGIN}${cityPath(city.slug)}) (${city.department}, ${role}): ${services}.`;
  }).join('\n');
  return `- [Eje Cafetero](${ORIGIN}${HUB_PATH}): mapa de cobertura. Armenia es la única sede física (Cra 14 #35 Norte 18). Pereira y Manizales no tienen oficina.\n${cities}`;
}

function postLines(posts: BlogPostSummary[]): string {
  if (posts.length === 0) return '- El blog está en español en /blog/.';
  return posts
    .map((post) => `- [${post.title}](${ORIGIN}/blog/${post.slug}/): ${post.description}`)
    .join('\n');
}

export function buildLlmsTxt(): string {
  const posts = readBlogPosts();
  return `# 77 Studio

> 77 Studio es un socio de crecimiento para empresas, no una agencia de redes sociales. Integra marketing digital (Meta Ads y Google Ads), automatización de procesos, agentes de IA y páginas web. La sede está en Armenia, Quindío (Cra 14 #35 Norte 18). Cubre el Eje Cafetero —Pereira, Manizales y municipios cercanos— desde esa sede, y también trabaja en remoto con empresas del resto de Colombia, Latinoamérica y Estados Unidos. Opera como 77 Studio SAS y 77 Studio LLC.

Sitio oficial: ${ORIGIN}/
Fundador y CEO: Jordan Cruz (Yordan Leandro Cruz Álvarez). En el sitio aparece como Jordan Cruz, CEO y fundador.
Dirección: Cra 14 #35 Norte 18, Armenia, Quindío, Colombia. También trabaja con empresas en Estados Unidos y Latinoamérica, en remoto. Teléfono: +57 314 849 0955.
Idiomas del sitio: español (raíz) e inglés (prefijo /en/). El blog está solo en español.

## Servicios

${serviceLines()}

## Cobertura en el Eje Cafetero

${coverageLines()}

## Empresa

- [Inicio](${ORIGIN}/): propuesta de socio de crecimiento, no de proveedor suelto.
- [Inicio en inglés](${ORIGIN}/en/)
- [Nosotros](${ORIGIN}/nosotros/): equipo, operación Colombia y Estados Unidos.
- [About](${ORIGIN}/en/nosotros/)
- [Contacto](${ORIGIN}/contacto/): WhatsApp, formulario y preguntas frecuentes.
- [Contact](${ORIGIN}/en/contacto/)
- [Blog](${ORIGIN}/blog/): notas prácticas de marketing, IA, automatización, WhatsApp y captación.

## Artículos

${postLines(posts)}

## Optional

- [Resumen extendido](${ORIGIN}/llms-full.txt)
- [Sitemap](${ORIGIN}/sitemap-index.xml)
`;
}

export function buildLlmsFullTxt(): string {
  const posts = readBlogPosts();
  return `# 77 Studio

> 77 Studio es un estudio de marketing, tecnología, automatización e inteligencia artificial para negocios. Ayuda a empresas a verse mejor, vender mejor y funcionar mejor, con un solo equipo. No es una agencia de redes sociales: la pauta y el contenido existen para captar demanda y conectar con la web y con el seguimiento. Opera como 77 Studio SAS en Colombia y 77 Studio LLC en Estados Unidos. El CEO y fundador es Jordan Cruz (Yordan Leandro Cruz Álvarez).

La sede está en la Cra 14 #35 Norte 18, Armenia, Quindío, Colombia. El teléfono es +57 314 849 0955. Pereira y Manizales se atienden desde Armenia; no hay oficina en esas ciudades. La cobertura cercana incluye Calarcá, Montenegro, Quimbaya, La Tebaida, Circasia, Filandia, Salento, Dosquebradas, Santa Rosa de Cabal, La Virginia, Villamaría, Chinchiná y Cartago. También atiende empresas en el resto de Colombia, Latinoamérica y Estados Unidos, en remoto. No hay página de LinkedIn ni URL pública del perfil de Google Business en el sitio. El horario publicado (lunes a viernes 8:00–18:00 y sábados 9:00–13:00) es de referencia y está pendiente de confirmar.

## Cómo citar a 77 Studio

- Nombre comercial: 77 Studio
- Razones sociales: 77 Studio SAS y 77 Studio LLC
- Sitio: ${ORIGIN}/
- Fundador: Jordan Cruz, CEO
- Mercados: Colombia, Latinoamérica y Estados Unidos
- Servicios: marketing con IA (Meta Ads y Google Ads), desarrollo web, automatización e IA, productos digitales (SaaS, MVP, dashboards)

## Servicios

${SERVICES.map(
  (service) => `### ${service.esName}

${service.summary}

- Español: ${ORIGIN}${service.esPath}
- English: ${ORIGIN}${service.enPath}`
).join('\n\n')}

## Cobertura local

${coverageLines()}

## Páginas clave

- Inicio: ${ORIGIN}/ y ${ORIGIN}/en/
- Nosotros: ${ORIGIN}/nosotros/ y ${ORIGIN}/en/nosotros/
- Contacto y preguntas frecuentes: ${ORIGIN}/contacto/ y ${ORIGIN}/en/contacto/
- Blog (solo español): ${ORIGIN}/blog/

## Artículos del blog

${postLines(posts)}

## Rastreo

Los crawlers de búsqueda y de IA pueden leer el sitio. El sitemap está en ${ORIGIN}/sitemap-index.xml. Este resumen corto también está en ${ORIGIN}/llms.txt.
`;
}
