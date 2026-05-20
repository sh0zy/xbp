// ケシバト用アイコンソース画像生成スクリプト
// assets/icon.png, icon-foreground.png, icon-background.png を1024x1024で出力
import sharp from 'sharp';
import { mkdirSync } from 'node:fs';
import { join, dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ASSETS = resolve(__dirname, '..', 'assets');
mkdirSync(ASSETS, { recursive: true });

// ------- 背景(単色グラデ) -------
const backgroundSvg = `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1024 1024">
  <defs>
    <linearGradient id="g" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="#1a1e26"/>
      <stop offset="100%" stop-color="#2a2f3a"/>
    </linearGradient>
  </defs>
  <rect width="1024" height="1024" fill="url(#g)"/>
</svg>`;

// ------- 前景(adaptive icon safe zone内に収める) -------
// Android adaptive iconは中心 66% が常に可視。512pxを中心に ±336 の範囲を意識
const foregroundSvg = `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1024 1024">
  <!-- 机(中央に大きく) -->
  <g transform="translate(512 512)">
    <rect x="-300" y="-170" width="600" height="340" rx="38" fill="#f3d38a" stroke="#c99a4a" stroke-width="12"/>
    <rect x="-278" y="-148" width="556" height="296" rx="26" fill="#ffe3a6"/>
    <!-- 消しピン 青 -->
    <circle cx="-130" cy="20" r="74" fill="#4ea9ff" stroke="#f5f5f7" stroke-width="10"/>
    <text x="-130" y="34" text-anchor="middle" font-family="sans-serif" font-weight="900" font-size="36" fill="#0b0e14">1P</text>
    <!-- 消しピン 赤 -->
    <circle cx="120" cy="55" r="74" fill="#ff6b6b" stroke="#f5f5f7" stroke-width="10"/>
    <text x="120" y="69" text-anchor="middle" font-family="sans-serif" font-weight="900" font-size="36" fill="#0b0e14">2P</text>
    <!-- 鉛筆 -->
    <g transform="translate(-210 -90) rotate(-20)">
      <rect x="-10" y="0" width="20" height="120" fill="#ffd166" stroke="#8a5a00" stroke-width="3"/>
      <polygon points="-10,0 10,0 0,-22" fill="#2e2e2e"/>
      <polygon points="-10,120 10,120 0,140" fill="#ff7878"/>
    </g>
  </g>
</svg>`;

// ------- 旧ランチャー兼用(背景+前景を合成した1枚) -------
const combinedSvg = `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1024 1024">
  <defs>
    <linearGradient id="g" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="#1a1e26"/>
      <stop offset="100%" stop-color="#2a2f3a"/>
    </linearGradient>
  </defs>
  <rect width="1024" height="1024" rx="200" fill="url(#g)"/>
  <g transform="translate(512 450)">
    <rect x="-300" y="-150" width="600" height="300" rx="38" fill="#f3d38a" stroke="#c99a4a" stroke-width="12"/>
    <rect x="-278" y="-128" width="556" height="256" rx="26" fill="#ffe3a6"/>
    <circle cx="-130" cy="10" r="70" fill="#4ea9ff" stroke="#f5f5f7" stroke-width="10"/>
    <text x="-130" y="22" text-anchor="middle" font-family="sans-serif" font-weight="900" font-size="34" fill="#0b0e14">1P</text>
    <circle cx="120" cy="40" r="70" fill="#ff6b6b" stroke="#f5f5f7" stroke-width="10"/>
    <text x="120" y="54" text-anchor="middle" font-family="sans-serif" font-weight="900" font-size="34" fill="#0b0e14">2P</text>
  </g>
  <text x="512" y="820" text-anchor="middle" font-family="sans-serif" font-weight="900" font-size="128" fill="#ffd166">ケシバト</text>
</svg>`;

async function svgToPng(svg, filename) {
  const out = join(ASSETS, filename);
  await sharp(Buffer.from(svg)).resize(1024, 1024).png().toFile(out);
  console.log('✓', filename);
}

await svgToPng(backgroundSvg, 'icon-background.png');
await svgToPng(foregroundSvg, 'icon-foreground.png');
await svgToPng(combinedSvg, 'icon.png');
await svgToPng(combinedSvg, 'icon-only.png');
console.log('done');
