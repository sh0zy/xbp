import sharp from 'sharp';
import { mkdirSync, existsSync } from 'fs';

function createSvg(size, padding = 0, background = true) {
  const s = size;
  const cx = s / 2;
  const cy = s / 2;
  const r = (s - padding * 2) * 0.32;
  const strokeW = r * 0.22;
  const arrowR = r * 0.42;
  const bg = background ? `<rect width="${s}" height="${s}" rx="${s * 0.22}" fill="#0f172a"/>` : '';

  return `<svg xmlns="http://www.w3.org/2000/svg" width="${s}" height="${s}" viewBox="0 0 ${s} ${s}">
  ${bg}
  <circle cx="${cx}" cy="${cy}" r="${r + strokeW}" fill="none" stroke="#3b82f620" stroke-width="${strokeW * 0.5}"/>
  <path d="M ${cx} ${cy - r} A ${r} ${r} 0 0 1 ${cx + r} ${cy}" fill="none" stroke="#3b82f6" stroke-width="${strokeW}" stroke-linecap="round"/>
  <path d="M ${cx + r} ${cy} A ${r} ${r} 0 0 1 ${cx} ${cy + r}" fill="none" stroke="#22c55e" stroke-width="${strokeW}" stroke-linecap="round"/>
  <path d="M ${cx} ${cy + r} A ${r} ${r} 0 0 1 ${cx - r} ${cy}" fill="none" stroke="#f59e0b" stroke-width="${strokeW}" stroke-linecap="round"/>
  <path d="M ${cx - r} ${cy} A ${r} ${r} 0 0 1 ${cx} ${cy - r}" fill="none" stroke="#a855f7" stroke-width="${strokeW}" stroke-linecap="round"/>
  <path d="M ${cx} ${cy + arrowR * 0.3} L ${cx} ${cy - arrowR * 0.5} M ${cx - arrowR * 0.25} ${cy - arrowR * 0.2} L ${cx} ${cy - arrowR * 0.5} L ${cx + arrowR * 0.25} ${cy - arrowR * 0.2}" fill="none" stroke="#06b6d4" stroke-width="${strokeW * 0.6}" stroke-linecap="round" stroke-linejoin="round"/>
</svg>`;
}

async function generate(svg, outPath, width, height) {
  const dir = outPath.substring(0, outPath.lastIndexOf('/'));
  if (!existsSync(dir)) mkdirSync(dir, { recursive: true });
  await sharp(Buffer.from(svg)).resize(width, height).png().toFile(outPath);
  console.log(`  ${outPath} (${width}x${height})`);
}

async function main() {
  console.log('Generating icons...');

  // Main icon 1024x1024
  await generate(createSvg(1024), 'resources/icon.png', 1024, 1024);

  // Adaptive icon foreground (with safe zone padding)
  const fgSvg = createSvg(1024, 1024 * 0.18, false);
  await generate(fgSvg, 'resources/adaptive-icon-foreground.png', 1024, 1024);

  // Adaptive icon background (solid color)
  const bgSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="1024" height="1024"><rect width="1024" height="1024" fill="#0f172a"/></svg>`;
  await generate(bgSvg, 'resources/adaptive-icon-background.png', 1024, 1024);

  // Splash screen
  const splashBg = `<svg xmlns="http://www.w3.org/2000/svg" width="2732" height="2732"><rect width="2732" height="2732" fill="#0f172a"/></svg>`;
  const splashBase = await sharp(Buffer.from(splashBg)).resize(2732, 2732).png().toBuffer();
  const iconOverlay = await sharp(Buffer.from(createSvg(400))).resize(400, 400).png().toBuffer();
  await sharp(splashBase).composite([{ input: iconOverlay, left: 1166, top: 1166 }]).toFile('resources/splash.png');
  console.log('  resources/splash.png (2732x2732)');

  // PWA icons
  await generate(createSvg(192), 'public/pwa-192x192.png', 192, 192);
  await generate(createSvg(512), 'public/pwa-512x512.png', 512, 512);
  await generate(createSvg(180), 'public/apple-touch-icon.png', 180, 180);

  // Favicon (32x32 ICO-like, using PNG)
  await generate(createSvg(32), 'public/favicon.ico', 32, 32);

  console.log('Done!');
}

main().catch(console.error);
