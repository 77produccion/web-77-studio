import fs from 'fs';

const file = 'src/components/home/TestimonialsSection.astro';
let content = fs.readFileSync(file, 'utf8');

const replacements = [
  // ── Logos remotos → logos locales ──────────────────────────────────────
  ['https://77studio.co/wp-content/uploads/2026/04/imagen_2025-11-05_221654413.png', '/img/clientes/aguar-antio-logo.webp'],
  ['https://77studio.co/wp-content/uploads/2026/04/imagen_2025-11-05_221839330.png', '/img/clientes/epic-const-logo.webp'],
  ['https://77studio.co/wp-content/uploads/2026/04/imagen_2025-11-05_221118111.png', '/img/clientes/sena-logo.svg'],
  ['https://77studio.co/wp-content/uploads/2026/04/imagen_2025-11-05_221420078.png', '/img/clientes/univalle-logo.webp'],
  ['https://77studio.co/wp-content/uploads/2026/04/imagen_2025-11-05_221350535.png', '/img/clientes/sievert-logo.webp'],
  ['https://77studio.co/wp-content/uploads/2026/04/imagen_2025-11-05_221931913.png', '/img/clientes/especial-logo.webp'],

  // ── Fondos de tarjeta remotos → locales ────────────────────────────────
  // EPIC (encrypted-tbn)
  [
    "url('https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQu_cHz7GBu5e7ywf0QOMOQXRkMB2mVbjvdjxeYQg1xK6NVmPGmxfyvUGM&s=10')",
    "url('/img/clientes/epic-constructora.jpg')"
  ],
  // SENA (cloudfront arcpublishing)
  [
    "url('https://cloudfront-us-east-1.images.arcpublishing.com/prisaradioco/5PKBVYL7NRPZDCRJ77CDBZAXJY.jpg')",
    "url('/img/clientes/sena.jpg')"
  ],
  // Universidad del Valle
  [
    "url('https://laravel.universidadesyprofesiones.com/images/universidades/campus/universidad-del-valle-banner.jpg')",
    "url('/img/clientes/univalle.jpg')"
  ],
  // Sievert (usa el logo como fondo)
  [
    "url('https://www.sievert.com.co/wp-content/uploads/2024/04/LOGO-PERU.png')",
    "url('/img/clientes/sievert-logo.webp')"
  ],
  // Especial Impresores
  [
    "url('https://especial.com.co/wp-content/uploads/2024/04/carrusel-foto-maquila.jpg')",
    "url('/img/clientes/especial-impresores.jpg')"
  ],
];

for (const [from, to] of replacements) {
  const before = (content.split(from).length - 1);
  content = content.replaceAll(from, to);
  const after = (content.split(from).length - 1);
  console.log(`Replaced ${before - after} occurrences: ${from.slice(0, 60)}... → ${to}`);
}

// Add loading/decoding attrs to logos that don't have them yet
let logoFixes = 0;
content = content.replace(/class="testimonial-client-logo"(?! loading)/g, () => {
  logoFixes++;
  return 'class="testimonial-client-logo" loading="lazy" decoding="async"';
});
console.log(`Added loading/decoding to ${logoFixes} logo tags`);

fs.writeFileSync(file, content, 'utf8');
console.log('\n✅ Done! Checking for remaining external URLs...');

const checks = [
  ['WP uploads', 'wp-content'],
  ['encrypted-tbn', 'encrypted-tbn'],
  ['caobahotels', 'caobahotels'],
  ['cloudfront arcpublishing', 'arcpublishing'],
  ['laravel universidades', 'laravel.universidades'],
  ['sievert.com.co', 'sievert.com.co'],
  ['especial.com.co/wp', 'especial.com.co/wp'],
];

let allClear = true;
for (const [label, needle] of checks) {
  const count = (content.split(needle).length - 1);
  if (count > 0) {
    console.log(`⚠️  ${label}: ${count} remaining`);
    allClear = false;
  } else {
    console.log(`✓  ${label}: cleared`);
  }
}
if (allClear) console.log('\n🎉 All external image URLs replaced successfully!');
