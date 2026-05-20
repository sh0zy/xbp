const fs = require("fs");
const path = require("path");
const zlib = require("zlib");

function crc32(buf) {
  const t = [];
  for (let i = 0; i < 256; i++) {
    let c = i;
    for (let k = 0; k < 8; k++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
    t[i] = c >>> 0;
  }
  let c = 0xffffffff;
  for (let i = 0; i < buf.length; i++) c = t[(c ^ buf[i]) & 0xff] ^ (c >>> 8);
  return (c ^ 0xffffffff) >>> 0;
}
function chunk(type, data) {
  const l = Buffer.alloc(4);
  l.writeUInt32BE(data.length, 0);
  const ty = Buffer.from(type, "ascii");
  const c = Buffer.alloc(4);
  c.writeUInt32BE(crc32(Buffer.concat([ty, data])), 0);
  return Buffer.concat([l, ty, data, c]);
}
function encodePng(w, h, data) {
  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(w, 0);
  ihdr.writeUInt32BE(h, 4);
  ihdr[8] = 8;
  ihdr[9] = 6;
  ihdr[10] = 0;
  ihdr[11] = 0;
  ihdr[12] = 0;
  const idat = zlib.deflateSync(data, { level: 9 });
  return Buffer.concat([
    Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]),
    chunk("IHDR", ihdr),
    chunk("IDAT", idat),
    chunk("IEND", Buffer.alloc(0)),
  ]);
}

function smooth(e0, e1, x) {
  const t = Math.max(0, Math.min(1, (x - e0) / (e1 - e0)));
  return t * t * (3 - 2 * t);
}
function mix(c1, c2, t) {
  t = Math.max(0, Math.min(1, t));
  return [c1[0] + (c2[0] - c1[0]) * t, c1[1] + (c2[1] - c1[1]) * t, c1[2] + (c2[2] - c1[2]) * t];
}

function distSeg(px, py, ax, ay, bx, by) {
  const dx = bx - ax,
    dy = by - ay;
  const L = dx * dx + dy * dy;
  if (L === 0) return Math.hypot(px - ax, py - ay);
  let t = ((px - ax) * dx + (py - ay) * dy) / L;
  t = Math.max(0, Math.min(1, t));
  return Math.hypot(px - (ax + t * dx), py - (ay + t * dy));
}
function sampleBezier(p0, p1, p2, steps) {
  const pts = [];
  for (let i = 0; i <= steps; i++) {
    const t = i / steps;
    const x = (1 - t) * (1 - t) * p0[0] + 2 * (1 - t) * t * p1[0] + t * t * p2[0];
    const y = (1 - t) * (1 - t) * p0[1] + 2 * (1 - t) * t * p1[1] + t * t * p2[1];
    pts.push([x, y]);
  }
  return pts;
}
function distPoly(px, py, pts) {
  let m = Infinity;
  for (let i = 0; i < pts.length - 1; i++) {
    const d = distSeg(px, py, pts[i][0], pts[i][1], pts[i + 1][0], pts[i + 1][1]);
    if (d < m) m = d;
  }
  return m;
}

const C = {
  deepNight: [8, 9, 28],
  midnight: [22, 20, 66],
  deepPurple: [61, 47, 180],
  brand: [124, 108, 255],
  highlight: [176, 166, 255],
  white: [245, 246, 255],
};

function computeBg(x, y, size) {
  const nx = x / size,
    ny = y / size;
  const diag = (nx + ny) / 2;
  let col = mix(C.highlight, C.deepNight, smooth(0.0, 1.2, diag));
  const mid = Math.abs(diag - 0.5);
  col = mix(col, C.deepPurple, Math.max(0, 0.35 - mid) * 0.6);
  const gx = nx - 0.28,
    gy = ny - 0.22;
  const r = Math.hypot(gx, gy);
  const glow = 1 - smooth(0.0, 0.55, r);
  col = mix(col, C.highlight, glow * 0.35);
  const vx = nx - 0.85,
    vy = ny - 0.88;
  const rv = Math.hypot(vx, vy);
  const vig = 1 - smooth(0.0, 0.7, rv);
  col = mix(col, C.deepNight, vig * 0.45);
  const sx = nx - 0.1,
    sy = ny - 0.05;
  const rs = Math.hypot(sx, sy);
  const sheen = 1 - smooth(0.0, 0.25, rs);
  col = mix(col, C.white, sheen * 0.1);
  return col;
}

function checkPath(size, safeInset) {
  const s = safeInset;
  const w = size - 2 * s;
  const p0 = [s + w * 0.18, s + w * 0.56];
  const c1 = [s + w * 0.30, s + w * 0.82];
  const p1 = [s + w * 0.42, s + w * 0.75];
  const c2 = [s + w * 0.55, s + w * 0.50];
  const p2 = [s + w * 0.84, s + w * 0.22];
  const seg1 = sampleBezier(p0, c1, p1, 60);
  const seg2 = sampleBezier(p1, c2, p2, 80);
  return seg1.concat(seg2.slice(1));
}

function drawCheck(x, y, path, strokeHalf, glowHalf) {
  const d = distPoly(x, y, path);
  if (d < strokeHalf + glowHalf) {
    const stroke = 1 - smooth(strokeHalf - 1.5, strokeHalf + 0.5, d);
    const outer = (1 - smooth(strokeHalf, strokeHalf + glowHalf, d)) * 0.45;
    return { stroke, glow: outer };
  }
  return { stroke: 0, glow: 0 };
}
function drawDot(x, y, cx, cy, r, glow) {
  const d = Math.hypot(x - cx, y - cy);
  if (d < r + glow) {
    const core = 1 - smooth(r - 1.2, r + 0.6, d);
    const outer = (1 - smooth(r, r + glow, d)) * 0.5;
    return { core, outer };
  }
  return { core: 0, outer: 0 };
}

function renderFull(size) {
  const data = Buffer.alloc(size * (1 + size * 4));
  const path = checkPath(size, size * 0.18);
  const stroke = size * 0.048;
  const glow = size * 0.07;
  const dotR = size * 0.035;
  const dotCX = size * 0.82;
  const dotCY = size * 0.20;
  for (let y = 0; y < size; y++) {
    data[y * (1 + size * 4)] = 0;
    for (let x = 0; x < size; x++) {
      const off = y * (1 + size * 4) + 1 + x * 4;
      let col = computeBg(x, y, size);
      const ch = drawCheck(x, y, path, stroke, glow);
      const dt = drawDot(x, y, dotCX, dotCY, dotR, size * 0.06);
      if (ch.glow > 0) col = mix(col, C.brand, ch.glow * 0.8);
      if (dt.outer > 0) col = mix(col, C.highlight, dt.outer * 0.9);
      if (ch.stroke > 0) {
        const ny = y / size;
        const strokeCol = mix(C.white, C.highlight, smooth(0.2, 0.8, ny));
        col = mix(col, strokeCol, ch.stroke);
      }
      if (dt.core > 0) col = mix(col, C.white, dt.core);
      data[off] = Math.round(Math.max(0, Math.min(255, col[0])));
      data[off + 1] = Math.round(Math.max(0, Math.min(255, col[1])));
      data[off + 2] = Math.round(Math.max(0, Math.min(255, col[2])));
      data[off + 3] = 255;
    }
  }
  return encodePng(size, size, data);
}

function renderForegroundAdaptive(size) {
  const data = Buffer.alloc(size * (1 + size * 4));
  const inset = size * 0.19;
  const path = checkPath(size, inset);
  const stroke = size * 0.050;
  const glow = size * 0.08;
  const dotR = size * 0.037;
  const dotCX = size * 0.80;
  const dotCY = size * 0.21;
  for (let y = 0; y < size; y++) {
    data[y * (1 + size * 4)] = 0;
    for (let x = 0; x < size; x++) {
      const off = y * (1 + size * 4) + 1 + x * 4;
      const ch = drawCheck(x, y, path, stroke, glow);
      const dt = drawDot(x, y, dotCX, dotCY, dotR, size * 0.065);
      let col = [0, 0, 0];
      let a = 0;
      if (ch.glow > 0) {
        col = C.brand;
        a = Math.max(a, ch.glow * 0.55);
      }
      if (dt.outer > 0) {
        col = C.highlight;
        a = Math.max(a, dt.outer * 0.7);
      }
      if (ch.stroke > 0) {
        const ny = y / size;
        const strokeCol = mix(C.white, C.highlight, smooth(0.2, 0.8, ny));
        col = strokeCol;
        a = Math.max(a, ch.stroke);
      }
      if (dt.core > 0) {
        col = C.white;
        a = Math.max(a, dt.core);
      }
      data[off] = Math.round(Math.max(0, Math.min(255, col[0])));
      data[off + 1] = Math.round(Math.max(0, Math.min(255, col[1])));
      data[off + 2] = Math.round(Math.max(0, Math.min(255, col[2])));
      data[off + 3] = Math.round(Math.max(0, Math.min(255, a * 255)));
    }
  }
  return encodePng(size, size, data);
}

function renderBackgroundAdaptive(size) {
  const data = Buffer.alloc(size * (1 + size * 4));
  for (let y = 0; y < size; y++) {
    data[y * (1 + size * 4)] = 0;
    for (let x = 0; x < size; x++) {
      const off = y * (1 + size * 4) + 1 + x * 4;
      const col = computeBg(x, y, size);
      data[off] = Math.round(Math.max(0, Math.min(255, col[0])));
      data[off + 1] = Math.round(Math.max(0, Math.min(255, col[1])));
      data[off + 2] = Math.round(Math.max(0, Math.min(255, col[2])));
      data[off + 3] = 255;
    }
  }
  return encodePng(size, size, data);
}

function renderPwa(size) {
  const data = Buffer.alloc(size * (1 + size * 4));
  const path = checkPath(size, size * 0.18);
  const stroke = size * 0.048;
  const glow = size * 0.07;
  const dotR = size * 0.035;
  const dotCX = size * 0.82;
  const dotCY = size * 0.20;
  const r = size * 0.22;
  for (let y = 0; y < size; y++) {
    data[y * (1 + size * 4)] = 0;
    for (let x = 0; x < size; x++) {
      const off = y * (1 + size * 4) + 1 + x * 4;
      const dx = Math.min(x, size - 1 - x);
      const dy = Math.min(y, size - 1 - y);
      let maskA = 1;
      if (dx < r && dy < r) {
        const ddx = r - dx,
          ddy = r - dy;
        const rd = Math.hypot(ddx, ddy);
        maskA = 1 - smooth(r - 1.2, r + 0.6, rd);
      }
      let col = computeBg(x, y, size);
      const ch = drawCheck(x, y, path, stroke, glow);
      const dt = drawDot(x, y, dotCX, dotCY, dotR, size * 0.06);
      if (ch.glow > 0) col = mix(col, C.brand, ch.glow * 0.8);
      if (dt.outer > 0) col = mix(col, C.highlight, dt.outer * 0.9);
      if (ch.stroke > 0) {
        const ny = y / size;
        const strokeCol = mix(C.white, C.highlight, smooth(0.2, 0.8, ny));
        col = mix(col, strokeCol, ch.stroke);
      }
      if (dt.core > 0) col = mix(col, C.white, dt.core);
      data[off] = Math.round(Math.max(0, Math.min(255, col[0])));
      data[off + 1] = Math.round(Math.max(0, Math.min(255, col[1])));
      data[off + 2] = Math.round(Math.max(0, Math.min(255, col[2])));
      data[off + 3] = Math.round(maskA * 255);
    }
  }
  return encodePng(size, size, data);
}

const outResources = path.resolve(__dirname, "..", "resources");
const outPublic = path.resolve(__dirname, "..", "public");
fs.mkdirSync(outResources, { recursive: true });
fs.mkdirSync(outPublic, { recursive: true });

fs.writeFileSync(path.join(outResources, "icon.png"), renderFull(1024));
fs.writeFileSync(path.join(outResources, "icon-foreground.png"), renderForegroundAdaptive(1024));
fs.writeFileSync(path.join(outResources, "icon-background.png"), renderBackgroundAdaptive(1024));
fs.writeFileSync(path.join(outPublic, "icon-512.png"), renderPwa(512));
fs.writeFileSync(path.join(outPublic, "icon-192.png"), renderPwa(192));
fs.writeFileSync(path.join(outPublic, "favicon.png"), renderPwa(64));
console.log("Premium icons generated successfully");
