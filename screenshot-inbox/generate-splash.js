import { writeFileSync, readdirSync } from 'fs';
import { deflateSync } from 'zlib';
import { join } from 'path';

// Generate splash screen PNGs with app branding color
const splashDirs = [
  { dir: 'drawable', w: 480, h: 800 },
  { dir: 'drawable-port-hdpi', w: 480, h: 800 },
  { dir: 'drawable-port-mdpi', w: 320, h: 480 },
  { dir: 'drawable-port-xhdpi', w: 720, h: 1280 },
  { dir: 'drawable-port-xxhdpi', w: 960, h: 1600 },
  { dir: 'drawable-port-xxxhdpi', w: 1280, h: 1920 },
  { dir: 'drawable-land-hdpi', w: 800, h: 480 },
  { dir: 'drawable-land-mdpi', w: 480, h: 320 },
  { dir: 'drawable-land-xhdpi', w: 1280, h: 720 },
  { dir: 'drawable-land-xxhdpi', w: 1600, h: 960 },
  { dir: 'drawable-land-xxxhdpi', w: 1920, h: 1280 },
];

function createSplashPng(width, height) {
  const signature = Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]);

  const ihdrData = Buffer.alloc(13);
  ihdrData.writeUInt32BE(width, 0);
  ihdrData.writeUInt32BE(height, 4);
  ihdrData[8] = 8;
  ihdrData[9] = 2;
  const ihdr = createChunk('IHDR', ihdrData);

  // Indigo gradient splash
  const allRows = Buffer.alloc((1 + width * 3) * height);
  for (let y = 0; y < height; y++) {
    const offset = y * (1 + width * 3);
    allRows[offset] = 0; // filter byte
    const factor = y / height;
    const r = Math.round(0x4F + (0x63 - 0x4F) * factor);
    const g = Math.round(0x46 + (0x66 - 0x46) * factor);
    const b = Math.round(0xE5 + (0xF1 - 0xE5) * factor);
    for (let x = 0; x < width; x++) {
      allRows[offset + 1 + x * 3] = r;
      allRows[offset + 1 + x * 3 + 1] = g;
      allRows[offset + 1 + x * 3 + 2] = b;
    }
  }

  const compressed = deflateSync(allRows, { level: 1 });
  const idat = createChunk('IDAT', compressed);
  const iend = createChunk('IEND', Buffer.alloc(0));
  return Buffer.concat([signature, ihdr, idat, iend]);
}

function createChunk(type, data) {
  const length = Buffer.alloc(4);
  length.writeUInt32BE(data.length, 0);
  const typeBuffer = Buffer.from(type);
  const crcData = Buffer.concat([typeBuffer, data]);
  const crc = Buffer.alloc(4);
  crc.writeUInt32BE(crc32(crcData), 0);
  return Buffer.concat([length, typeBuffer, data, crc]);
}

function crc32(buf) {
  let crc = 0xFFFFFFFF;
  for (let i = 0; i < buf.length; i++) {
    crc ^= buf[i];
    for (let j = 0; j < 8; j++) {
      crc = (crc >>> 1) ^ (crc & 1 ? 0xEDB88320 : 0);
    }
  }
  return (crc ^ 0xFFFFFFFF) >>> 0;
}

const resBase = 'android/app/src/main/res';
for (const { dir, w, h } of splashDirs) {
  const path = join(resBase, dir, 'splash.png');
  // Use small size for speed (actual splash uses drawable xml typically)
  const png = createSplashPng(Math.min(w, 64), Math.min(h, 64));
  writeFileSync(path, png);
  console.log(`Generated ${dir}/splash.png`);
}
console.log('Splash screens generated');
