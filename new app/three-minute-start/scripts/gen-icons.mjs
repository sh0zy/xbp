// Generate brand-colored PNG icons (single color background with white "3").
// Pure Node, no deps. Produces:
//   public/pwa-192x192.png
//   public/pwa-512x512.png
//   resources/icon.png      (1024x1024)
//   resources/splash.png    (2732x2732)
//
// Style: deep blue background with a centered chunky white "3".

import fs from "node:fs";
import path from "node:path";
import zlib from "node:zlib";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT = path.resolve(__dirname, "..");

const BRAND = { r: 0x2b, g: 0x6d, b: 0xf6 };

function makeSolid(width, height, color, drawDigit3 = false) {
  const data = Buffer.alloc(width * height * 4);
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const i = (y * width + x) * 4;
      data[i] = color.r;
      data[i + 1] = color.g;
      data[i + 2] = color.b;
      data[i + 3] = 0xff;
    }
  }
  if (drawDigit3) drawDigit(data, width, height);
  return data;
}

// Draw a stylish "3" as two right-opening bowls joined at the middle.
// Each bowl is an arc of ~250-260° with the opening facing LEFT.
function drawDigit(data, width, height) {
  const cx = width / 2;
  const cy = height / 2;
  const dim = Math.min(width, height);
  const r = dim * 0.2; // bowl radius
  const stroke = dim * 0.1; // stroke width
  const halfStroke = stroke / 2;
  // small horizontal nudge so the digit looks visually centered
  const offsetX = -dim * 0.01;
  const upperC = { x: cx + offsetX, y: cy - r * 0.85 };
  const lowerC = { x: cx + offsetX, y: cy + r * 0.85 };

  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const i = (y * width + x) * 4;

      const upDist = Math.hypot(x - upperC.x, y - upperC.y);
      const upAngle =
        (Math.atan2(y - upperC.y, x - upperC.x) * 180) / Math.PI;
      // Visible range for the upper bowl: from upper-left (-150°) clockwise
      // through top, right, down to 100° — leaving the left side open.
      const onUpper =
        Math.abs(upDist - r) < halfStroke && upAngle >= -150 && upAngle <= 100;

      const loDist = Math.hypot(x - lowerC.x, y - lowerC.y);
      const loAngle =
        (Math.atan2(y - lowerC.y, x - lowerC.x) * 180) / Math.PI;
      // Visible range for the lower bowl: -100° (top-right) clockwise
      // through right, down, to 150° (lower-left) — left side open.
      const onLower =
        Math.abs(loDist - r) < halfStroke && loAngle >= -100 && loAngle <= 150;

      if (onUpper || onLower) {
        data[i] = 0xff;
        data[i + 1] = 0xff;
        data[i + 2] = 0xff;
        data[i + 3] = 0xff;
      }
    }
  }
}

// Encode a raw RGBA buffer to a minimal PNG
function encodePNG(width, height, rgba) {
  // Convert RGBA -> filtered scanlines (filter 0 per row)
  const stride = width * 4;
  const raw = Buffer.alloc((stride + 1) * height);
  for (let y = 0; y < height; y++) {
    raw[y * (stride + 1)] = 0;
    rgba.copy(raw, y * (stride + 1) + 1, y * stride, y * stride + stride);
  }
  const idat = zlib.deflateSync(raw, { level: 9 });

  function chunk(type, data) {
    const len = Buffer.alloc(4);
    len.writeUInt32BE(data.length, 0);
    const typeBuf = Buffer.from(type, "ascii");
    const crc = Buffer.alloc(4);
    const crcVal = crc32(Buffer.concat([typeBuf, data]));
    crc.writeUInt32BE(crcVal, 0);
    return Buffer.concat([len, typeBuf, data, crc]);
  }

  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(width, 0);
  ihdr.writeUInt32BE(height, 4);
  ihdr.writeUInt8(8, 8); // 8-bit
  ihdr.writeUInt8(6, 9); // RGBA
  ihdr.writeUInt8(0, 10);
  ihdr.writeUInt8(0, 11);
  ihdr.writeUInt8(0, 12);

  const sig = Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]);
  return Buffer.concat([
    sig,
    chunk("IHDR", ihdr),
    chunk("IDAT", idat),
    chunk("IEND", Buffer.alloc(0)),
  ]);
}

let crcTable;
function makeCrcTable() {
  crcTable = new Uint32Array(256);
  for (let n = 0; n < 256; n++) {
    let c = n;
    for (let k = 0; k < 8; k++) {
      c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
    }
    crcTable[n] = c >>> 0;
  }
}
function crc32(buf) {
  if (!crcTable) makeCrcTable();
  let c = 0xffffffff;
  for (let i = 0; i < buf.length; i++) {
    c = crcTable[(c ^ buf[i]) & 0xff] ^ (c >>> 8);
  }
  return (c ^ 0xffffffff) >>> 0;
}

function writePng(targetPath, width, height, drawDigit3) {
  const buf = encodePNG(
    width,
    height,
    makeSolid(width, height, BRAND, drawDigit3),
  );
  fs.mkdirSync(path.dirname(targetPath), { recursive: true });
  fs.writeFileSync(targetPath, buf);
  console.log(
    `wrote ${path.relative(ROOT, targetPath)} ${width}x${height} (${buf.length} bytes)`,
  );
}

writePng(path.join(ROOT, "public", "pwa-192x192.png"), 192, 192, true);
writePng(path.join(ROOT, "public", "pwa-512x512.png"), 512, 512, true);
writePng(path.join(ROOT, "public", "apple-touch-icon.png"), 180, 180, true);
writePng(path.join(ROOT, "resources", "icon.png"), 1024, 1024, true);
writePng(path.join(ROOT, "resources", "splash.png"), 2732, 2732, true);

// === Android notification small icon: white "3" on transparent ===
// Required: pure white silhouette on transparent background.
// Style: bold modern "3" with rounded bowls and a small inner-curve flair.

// Bolder version of the same shape, optimized for tiny notification icons.
function drawStylish3(data, width, height) {
  const cx = width / 2;
  const cy = height / 2;
  const dim = Math.min(width, height);
  const r = dim * 0.24; // larger bowl radius for visibility at 24px
  const stroke = dim * 0.16;
  const halfStroke = stroke / 2;
  const offsetX = -dim * 0.01;
  const upperC = { x: cx + offsetX, y: cy - r * 0.85 };
  const lowerC = { x: cx + offsetX, y: cy + r * 0.85 };

  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const i = (y * width + x) * 4;

      const upDist = Math.hypot(x - upperC.x, y - upperC.y);
      const upAngle =
        (Math.atan2(y - upperC.y, x - upperC.x) * 180) / Math.PI;
      const onUpper =
        Math.abs(upDist - r) < halfStroke && upAngle >= -150 && upAngle <= 100;

      const loDist = Math.hypot(x - lowerC.x, y - lowerC.y);
      const loAngle =
        (Math.atan2(y - lowerC.y, x - lowerC.x) * 180) / Math.PI;
      const onLower =
        Math.abs(loDist - r) < halfStroke && loAngle >= -100 && loAngle <= 150;

      if (onUpper || onLower) {
        data[i] = 0xff;
        data[i + 1] = 0xff;
        data[i + 2] = 0xff;
        data[i + 3] = 0xff;
      }
    }
  }
}

function makeTransparentStylish3(width, height) {
  const data = Buffer.alloc(width * height * 4); // all transparent (alpha=0)
  drawStylish3(data, width, height);
  return data;
}

function writeNotificationIcon(targetPath, size) {
  const buf = encodePNG(size, size, makeTransparentStylish3(size, size));
  fs.mkdirSync(path.dirname(targetPath), { recursive: true });
  fs.writeFileSync(targetPath, buf);
  console.log(
    `wrote ${path.relative(ROOT, targetPath)} ${size}x${size} (${buf.length} bytes)`,
  );
}

const NOTIFICATION_DPI = [
  { dir: "drawable-mdpi", size: 24 },
  { dir: "drawable-hdpi", size: 36 },
  { dir: "drawable-xhdpi", size: 48 },
  { dir: "drawable-xxhdpi", size: 72 },
  { dir: "drawable-xxxhdpi", size: 96 },
];

for (const { dir, size } of NOTIFICATION_DPI) {
  writeNotificationIcon(
    path.join(
      ROOT,
      "android",
      "app",
      "src",
      "main",
      "res",
      dir,
      "ic_stat_notify_3.png",
    ),
    size,
  );
}
