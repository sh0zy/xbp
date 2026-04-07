import { writeFileSync } from 'fs';
import { deflateSync } from 'zlib';

function createPng(size) {
  const width = size;
  const height = size;
  const signature = Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]);

  const ihdrData = Buffer.alloc(13);
  ihdrData.writeUInt32BE(width, 0);
  ihdrData.writeUInt32BE(height, 4);
  ihdrData[8] = 8;
  ihdrData[9] = 2;
  const ihdr = createChunk('IHDR', ihdrData);

  const rawRow = Buffer.alloc(1 + width * 3);
  rawRow[0] = 0;
  for (let x = 0; x < width; x++) {
    rawRow[1 + x * 3] = 0x4F;
    rawRow[1 + x * 3 + 1] = 0x46;
    rawRow[1 + x * 3 + 2] = 0xE5;
  }

  const allRows = Buffer.alloc(rawRow.length * height);
  for (let y = 0; y < height; y++) {
    rawRow.copy(allRows, y * rawRow.length);
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

for (const size of [192, 512]) {
  const png = createPng(size);
  writeFileSync(`public/icon-${size}.png`, png);
  console.log(`Created icon-${size}.png`);
}
