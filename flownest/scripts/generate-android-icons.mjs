// Write Android launcher icons + splash from resources/icon.svg.
// Overwrites the default Capacitor icons with FlowNest branding.
import { readFile, mkdir } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { dirname, resolve } from 'node:path';
import sharp from 'sharp';

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = resolve(__dirname, '..');
const svgPath = resolve(root, 'resources/icon.svg');
const androidRes = resolve(root, 'android/app/src/main/res');

const mipmaps = [
  { dir: 'mipmap-mdpi', size: 48 },
  { dir: 'mipmap-hdpi', size: 72 },
  { dir: 'mipmap-xhdpi', size: 96 },
  { dir: 'mipmap-xxhdpi', size: 144 },
  { dir: 'mipmap-xxxhdpi', size: 192 },
];

const splashSizes = [
  { dir: 'drawable', file: 'splash.png', size: 1080 },
];

const run = async () => {
  const svg = await readFile(svgPath);
  for (const m of mipmaps) {
    const base = resolve(androidRes, m.dir);
    await mkdir(base, { recursive: true });
    // Main launcher icon
    await sharp(svg).resize(m.size, m.size).png().toFile(resolve(base, 'ic_launcher.png'));
    // Round launcher icon
    const roundMask = Buffer.from(
      `<svg xmlns='http://www.w3.org/2000/svg' width='${m.size}' height='${m.size}'><circle cx='${m.size / 2}' cy='${m.size / 2}' r='${m.size / 2}' fill='white'/></svg>`,
    );
    const iconBuf = await sharp(svg).resize(m.size, m.size).png().toBuffer();
    await sharp(iconBuf)
      .composite([{ input: roundMask, blend: 'dest-in' }])
      .png()
      .toFile(resolve(base, 'ic_launcher_round.png'));
    // Foreground (padded) for adaptive icon
    const fgSize = m.size;
    const inner = Math.round(fgSize * 0.62);
    const inBuf = await sharp(svg).resize(inner, inner).png().toBuffer();
    await sharp({
      create: {
        width: fgSize,
        height: fgSize,
        channels: 4,
        background: { r: 0, g: 0, b: 0, alpha: 0 },
      },
    })
      .composite([{ input: inBuf, gravity: 'center' }])
      .png()
      .toFile(resolve(base, 'ic_launcher_foreground.png'));
    console.log('wrote', m.dir);
  }

  // Splash variants (portrait + landscape)
  for (const s of splashSizes) {
    const base = resolve(androidRes, s.dir);
    await mkdir(base, { recursive: true });
    const iconSize = Math.round(s.size * 0.3);
    const iconBuf = await sharp(svg).resize(iconSize, iconSize).png().toBuffer();
    await sharp({
      create: {
        width: s.size,
        height: s.size,
        channels: 4,
        background: { r: 11, g: 16, b: 32, alpha: 1 },
      },
    })
      .composite([{ input: iconBuf, gravity: 'center' }])
      .png()
      .toFile(resolve(base, s.file));
    console.log('wrote', s.dir + '/' + s.file);
  }
};

run().catch((e) => {
  console.error(e);
  process.exit(1);
});
