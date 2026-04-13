// Generate PNG icons from resources/icon.svg.
// Requires: sharp (devDependency). Run: node scripts/generate-icons.mjs
import { readFile, writeFile, mkdir } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { dirname, resolve } from 'node:path';
import sharp from 'sharp';

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = resolve(__dirname, '..');
const svgPath = resolve(root, 'resources/icon.svg');

const targets = [
  { out: 'public/favicon.png', size: 64 },
  { out: 'public/pwa-192.png', size: 192 },
  { out: 'public/pwa-512.png', size: 512 },
  { out: 'public/icon-1024.png', size: 1024 },
  { out: 'resources/icon.png', size: 1024 },
  { out: 'resources/icon-foreground.png', size: 1024, padding: 0.22 },
  { out: 'resources/splash.png', size: 2732, splash: true },
];

const run = async () => {
  const svg = await readFile(svgPath);
  for (const t of targets) {
    const outPath = resolve(root, t.out);
    await mkdir(dirname(outPath), { recursive: true });
    if (t.splash) {
      const iconSize = Math.round(t.size * 0.28);
      const iconBuf = await sharp(svg).resize(iconSize, iconSize).png().toBuffer();
      await sharp({
        create: {
          width: t.size,
          height: t.size,
          channels: 4,
          background: { r: 11, g: 16, b: 32, alpha: 1 },
        },
      })
        .composite([{ input: iconBuf, gravity: 'center' }])
        .png()
        .toFile(outPath);
    } else if (t.padding) {
      const inner = Math.round(t.size * (1 - t.padding * 2));
      const iconBuf = await sharp(svg).resize(inner, inner).png().toBuffer();
      await sharp({
        create: {
          width: t.size,
          height: t.size,
          channels: 4,
          background: { r: 0, g: 0, b: 0, alpha: 0 },
        },
      })
        .composite([{ input: iconBuf, gravity: 'center' }])
        .png()
        .toFile(outPath);
    } else {
      await sharp(svg).resize(t.size, t.size).png().toFile(outPath);
    }
    console.log('wrote', t.out);
  }
  // favicon.ico-alike: copy favicon.png to .ico path is not trivial; keep .png only.
  void writeFile;
};

run().catch((e) => {
  console.error(e);
  process.exit(1);
});
