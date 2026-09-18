import fs from 'fs';
import path from 'path';
import sharp from 'sharp';

// Directorio raíz a optimizar de forma recursiva
const TARGET_DIR = path.resolve('public/img');

// Reglas de ancho máximo por tipo de contenido
function getMaxWidth(filePath) {
  const norm = filePath.replace(/\\/g, '/').toLowerCase();
  if (norm.includes('bgs') || norm.includes('header') || norm.includes('degrades')) {
    return 1920;
  }
  if (norm.includes('equipo') || norm.includes('cards-nosotros')) {
    return 1200;
  }
  if (norm.includes('logos-platforms') || norm.includes('logo-variaciones') || norm.includes('clientes') || norm.includes('section-2-web') || norm.includes('sofia')) {
    return 800;
  }
  return 1600;
}

// Escaneo recursivo de archivos
function getFilesRecursively(dir) {
  let files = [];
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      files = files.concat(getFilesRecursively(fullPath));
    } else {
      files.push(fullPath);
    }
  }
  return files;
}

async function optimizeFile(filePath) {
  const ext = path.extname(filePath).toLowerCase();
  if (!['.jpg', '.jpeg', '.png'].includes(ext)) return null;

  const statBefore = fs.statSync(filePath);
  const oldSize = statBefore.size;

  const webpPath = filePath.replace(new RegExp(`${ext}$`, 'i'), '.webp');
  const webpExists = fs.existsSync(webpPath);

  // Optimizar si el archivo es > 45 KB o si no tiene versión .webp
  if (oldSize < 45 * 1024 && webpExists) return null;

  try {
    const image = sharp(filePath);
    const metadata = await image.metadata();

    const maxWidth = getMaxWidth(filePath);
    const needsResize = metadata.width && metadata.width > maxWidth;
    const targetWidth = needsResize ? maxWidth : metadata.width;

    // 1. Generar versión .webp ultraligera
    const webpPipeline = sharp(filePath);
    if (needsResize) {
      webpPipeline.resize({ width: targetWidth, withoutEnlargement: true });
    }
    await webpPipeline
      .webp({ quality: 82, effort: 5 })
      .toFile(webpPath + '.tmp');
    fs.renameSync(webpPath + '.tmp', webpPath);
    const webpStat = fs.statSync(webpPath);

    // 2. Comprimir el archivo original in-place con MozJPEG o PNG optimizado
    let newOriginalSize = oldSize;
    if (oldSize > 45 * 1024) {
      const inPlacePipeline = sharp(filePath);
      if (needsResize) {
        inPlacePipeline.resize({ width: targetWidth, withoutEnlargement: true });
      }
      const tempInPlace = filePath + '.tmp';
      if (ext === '.png') {
        await inPlacePipeline.png({ quality: 85, compressionLevel: 9 }).toFile(tempInPlace);
      } else {
        await inPlacePipeline.jpeg({ quality: 82, progressive: true, mozjpeg: true }).toFile(tempInPlace);
      }
      fs.renameSync(tempInPlace, filePath);
      const newOriginalStat = fs.statSync(filePath);
      newOriginalSize = newOriginalStat.size;
    }

    const relPath = path.relative(path.resolve('public'), filePath).replace(/\\/g, '/');
    const reductionPct = (((oldSize - webpStat.size) / oldSize) * 100).toFixed(1);

    return {
      file: relPath,
      oldSizeKB: (oldSize / 1024).toFixed(1),
      newOriginalKB: (newOriginalSize / 1024).toFixed(1),
      webpKB: (webpStat.size / 1024).toFixed(1),
      reductionPct: reductionPct + '%'
    };
  } catch (err) {
    console.error(`❌ Error optimizando ${filePath}:`, err.message);
    return null;
  }
}

async function run() {
  console.log('===============================================================');
  console.log('🚀 Iniciando optimización recursiva de imágenes en:');
  console.log(`   ${TARGET_DIR}`);
  console.log('===============================================================\n');

  const allFiles = getFilesRecursively(TARGET_DIR);
  console.log(`🔍 Total archivos encontrados en public/img: ${allFiles.length}`);

  const results = [];
  let totalSavedBytes = 0;

  for (const file of allFiles) {
    const res = await optimizeFile(file);
    if (res) {
      results.push(res);
      console.log(`✓ [${res.file}] ${res.oldSizeKB} KB -> Original: ${res.newOriginalKB} KB | WebP: ${res.webpKB} KB (${res.reductionPct})`);
    }
  }

  console.log('\n===============================================================');
  console.log(`🎉 Optimización completada. ${results.length} imágenes procesadas.`);
  console.log('===============================================================\n');
  console.table(results);
}

run();
