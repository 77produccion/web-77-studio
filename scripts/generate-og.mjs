import sharp from 'sharp';
import fs from 'fs';
import path from 'path';

async function generateOg() {
  const svgPath = path.resolve('public/img/openGraph/77-studio-logo-open-graph.svg');
  const outPngPath = path.resolve('public/img/openGraph/og-image.png');
  const outJpgPath = path.resolve('public/img/openGraph/og-image.jpg');

  console.log('Reading base SVG asset:', svgPath);
  const svgContent = fs.readFileSync(svgPath, 'utf8');

  // We want to generate a 1200x630 Open Graph preview image
  // 1. Ensure solid background, high contrast, perfect dimensions (1200x630)
  // 2. We render the full SVG at high density
  const highResSquare = await sharp(Buffer.from(svgContent), { density: 300 })
    .resize(1500, 1500)
    .toBuffer();

  // Create standard 1200x630 Open Graph Image
  // Background: Rich atmosphere from the brand asset covering 1200x630
  // Logo: Perfectly centered, crisp, with balanced padding for social cards (WhatsApp, Meta, Twitter)
  const bgAtmosphere = await sharp(highResSquare)
    .resize(1200, 630, { fit: 'cover', position: 'center' })
    .toBuffer();

  // Center logo emblem scaled to safe area (height: 480px, width: 480px)
  const logoEmblem = await sharp(highResSquare)
    .resize(500, 500, { fit: 'contain' })
    .toBuffer();

  // Composite emblem onto the 1200x630 background
  const finalImage = await sharp(bgAtmosphere)
    .composite([
      {
        input: logoEmblem,
        left: Math.round((1200 - 500) / 2),
        top: Math.round((630 - 500) / 2)
      }
    ])
    .flatten({ background: { r: 11, g: 15, b: 25 } }) // 100% solid background (no transparency)
    .png({
      quality: 95,
      compressionLevel: 8
    })
    .toBuffer();

  fs.writeFileSync(outPngPath, finalImage);

  // Also create optimized JPG version for maximum legacy scraper compatibility
  await sharp(finalImage)
    .jpeg({
      quality: 92,
      progressive: true,
      mozjpeg: true
    })
    .toFile(outJpgPath);

  // Clean up any test/extracted files in public/img/openGraph
  const openGraphDir = path.resolve('public/img/openGraph');
  const files = fs.readdirSync(openGraphDir);
  for (const file of files) {
    if (file.startsWith('test-') || file.startsWith('cand-') || file.startsWith('extracted-') || file.startsWith('view-')) {
      fs.unlinkSync(path.join(openGraphDir, file));
    }
  }

  const pngStats = await sharp(outPngPath).metadata();
  const pngPixelStats = await sharp(outPngPath).stats();
  const jpgStats = await sharp(outJpgPath).metadata();

  console.log('✅ Generated PNG:', {
    path: outPngPath,
    width: pngStats.width,
    height: pngStats.height,
    format: pngStats.format,
    channels: pngStats.channels,
    hasAlpha: pngStats.hasAlpha,
    isOpaque: pngPixelStats.isOpaque,
    sizeKB: (fs.statSync(outPngPath).size / 1024).toFixed(2) + ' KB'
  });

  console.log('✅ Generated JPG:', {
    path: outJpgPath,
    width: jpgStats.width,
    height: jpgStats.height,
    format: jpgStats.format,
    sizeKB: (fs.statSync(outJpgPath).size / 1024).toFixed(2) + ' KB'
  });
}

generateOg().catch((err) => {
  console.error('Error generating OG image:', err);
  process.exit(1);
});
