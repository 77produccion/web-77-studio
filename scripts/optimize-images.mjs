import fs from 'fs';
import path from 'path';
import sharp from 'sharp';

const TARGET_DIRS = [
  path.resolve('public/img/bgs'),
  path.resolve('public/img/clientes'),
  path.resolve('public/img'),
  path.resolve('public/images')
];

const MAX_WIDTH_HERO = 1920;
const MAX_WIDTH_THUMB = 1000;

async function optimizeFile(filePath) {
  const ext = path.extname(filePath).toLowerCase();
  if (!['.jpg', '.jpeg', '.png'].includes(ext)) return null;

  const stat = fs.statSync(filePath);
  const sizeMB = stat.size / (1024 * 1024);

  // Focus on files larger than 250 KB
  if (stat.size < 250 * 1024) return null;

  try {
    const image = sharp(filePath);
    const metadata = await image.metadata();

    const isThumb = filePath.includes('clientes') || filePath.includes('thumb');
    const maxWidth = isThumb ? MAX_WIDTH_THUMB : MAX_WIDTH_HERO;

    const needsResize = metadata.width && metadata.width > maxWidth;
    const targetWidth = needsResize ? maxWidth : metadata.width;

    // 1. Generate .webp version
    const webpPath = filePath.replace(new RegExp(`${ext}$`, 'i'), '.webp');
    const webpPipeline = sharp(filePath);
    if (needsResize) {
      webpPipeline.resize({ width: targetWidth, withoutEnlargement: true });
    }
    await webpPipeline
      .webp({ quality: 82, effort: 5 })
      .toFile(webpPath + '.tmp');
    fs.renameSync(webpPath + '.tmp', webpPath);
    const webpStat = fs.statSync(webpPath);

    // 2. Also compress the original file in-place so fallback / existing URLs are lightweight
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

    return {
      file: path.basename(filePath),
      oldSizeKB: (stat.size / 1024).toFixed(1),
      newOriginalKB: (newOriginalStat.size / 1024).toFixed(1),
      webpKB: (webpStat.size / 1024).toFixed(1),
      reductionPct: (((stat.size - webpStat.size) / stat.size) * 100).toFixed(1)
    };
  } catch (err) {
    console.error(`Error optimizing ${filePath}:`, err.message);
    return null;
  }
}

async function run() {
  console.log('--- 🚀 Iniciando optimización de imágenes con Sharp ---');
  let totalSavedBytes = 0;
  const results = [];

  for (const dir of TARGET_DIRS) {
    if (!fs.existsSync(dir)) continue;
    const files = fs.readdirSync(dir);

    for (const file of files) {
      const fullPath = path.join(dir, file);
      if (!fs.statSync(fullPath).isFile()) continue;

      const res = await optimizeFile(fullPath);
      if (res) {
        results.push(res);
        console.log(`✓ ${res.file}: ${res.oldSizeKB} KB -> WebP: ${res.webpKB} KB (-${res.reductionPct}%)`);
      }
    }
  }

  console.log('\n--- Resumen de optimización ---');
  console.table(results);
  console.log('¡Optimización completada con éxito!');
}

run();
