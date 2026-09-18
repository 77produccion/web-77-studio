import fs from 'fs';
import path from 'path';

// Extensiones de código a revisar en src/
const CODE_EXTS = ['.astro', '.ts', '.tsx', '.js', '.jsx', '.css', '.md', '.mdx'];

function getFilesRecursively(dir, filterExts) {
  let results = [];
  const list = fs.readdirSync(dir, { withFileTypes: true });
  for (const item of list) {
    const fullPath = path.join(dir, item.name);
    if (item.isDirectory()) {
      results = results.concat(getFilesRecursively(fullPath, filterExts));
    } else if (filterExts.some(ext => item.name.endsWith(ext))) {
      results.push(fullPath);
    }
  }
  return results;
}

const srcFiles = getFilesRecursively(path.resolve('src'), CODE_EXTS);

console.log('===============================================================');
console.log('🚀 Iniciando migración de referencias a .webp en src/');
console.log(`📁 Archivos fuente encontrados: ${srcFiles.length}`);
console.log('===============================================================\n');

// Expresión regular para detectar rutas /img/... y /images/... con extensiones jpg, png, jpeg
// Admite espacios, paréntesis, guiones y caracteres especiales
const IMG_REGEX = /(["'`\(\s])(\/(?:img|images)\/[^"'`\(\)\s\n\r]+\.(?:png|jpg|jpeg|JPG|PNG))(["'`\)\s])/g;

let totalReplacements = 0;
const modifiedFiles = [];

for (const filePath of srcFiles) {
  let content = fs.readFileSync(filePath, 'utf8');
  let fileReplacements = 0;
  const changes = [];

  const newContent = content.replace(IMG_REGEX, (match, prefix, imgPath, suffix) => {
    // Decodificar URI si tiene escapes
    const cleanPath = decodeURIComponent(imgPath);
    const pubPath = path.join(path.resolve('public'), cleanPath);
    const ext = path.extname(cleanPath);
    const webpRelPath = cleanPath.slice(0, -ext.length) + '.webp';
    const webpPubFile = pubPath.slice(0, -ext.length) + '.webp';

    if (fs.existsSync(webpPubFile)) {
      fileReplacements++;
      changes.push({ from: imgPath, to: webpRelPath });
      return `${prefix}${webpRelPath}${suffix}`;
    }
    return match;
  });

  if (fileReplacements > 0) {
    fs.writeFileSync(filePath, newContent, 'utf8');
    totalReplacements += fileReplacements;
    const relFile = path.relative(process.cwd(), filePath).replace(/\\/g, '/');
    modifiedFiles.push({ file: relFile, count: fileReplacements, changes });
    console.log(`✓ [${relFile}] -> ${fileReplacements} referencias actualizadas a .webp`);
  }
}

console.log('\n===============================================================');
console.log(`🎉 Migración completada:`);
console.log(`   - Archivos modificados: ${modifiedFiles.length}`);
console.log(`   - Total de rutas migradas a .webp: ${totalReplacements}`);
console.log('===============================================================\n');
