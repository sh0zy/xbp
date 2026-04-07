import { writeFileSync } from 'fs';
import { deflateSync } from 'zlib';

// Generate custom colored PNG icons for Android launcher
const sizes = {
  'mipmap-mdpi': 48,
  'mipmap-hdpi': 72,
  'mipmap-xhdpi': 96,
  'mipmap-xxhdpi': 144,
  'mipmap-xxxhdpi': 192,
};

function createPng(size, r, g, b) {
  const width = size;
  const height = size;
  const signature = Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]);

  const ihdrData = Buffer.alloc(13);
  ihdrData.writeUInt32BE(width, 0);
  ihdrData.writeUInt32BE(height, 4);
  ihdrData[8] = 8;
  ihdrData[9] = 2; // RGB
  const ihdr = createChunk('IHDR', ihdrData);

  const rawRow = Buffer.alloc(1 + width * 3);
  rawRow[0] = 0;

  // Create gradient-like icon with app color
  const allRows = Buffer.alloc(rawRow.length * height);
  for (let y = 0; y < height; y++) {
    const rowBuf = Buffer.alloc(1 + width * 3);
    rowBuf[0] = 0;
    for (let x = 0; x < width; x++) {
      // Simple gradient from primary-600 to primary-700
      const factor = (y / height) * 0.15;
      rowBuf[1 + x * 3] = Math.max(0, Math.round(r - r * factor));
      rowBuf[1 + x * 3 + 1] = Math.max(0, Math.round(g - g * factor));
      rowBuf[1 + x * 3 + 2] = Math.max(0, Math.round(b - b * factor));
    }
    rowBuf.copy(allRows, y * rowBuf.length);
  }

  const compressed = deflateSync(allRows);
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

for (const [dir, size] of Object.entries(sizes)) {
  const png = createPng(size, 0x4F, 0x46, 0xE5); // primary-600
  const fgPng = createPng(size, 0x4F, 0x46, 0xE5);
  const basePath = `android/app/src/main/res/${dir}`;
  writeFileSync(`${basePath}/ic_launcher.png`, png);
  writeFileSync(`${basePath}/ic_launcher_foreground.png`, fgPng);
  writeFileSync(`${basePath}/ic_launcher_round.png`, png);
  console.log(`Generated ${dir} icons (${size}x${size})`);
}

console.log('Android icons generated successfully');
