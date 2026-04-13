// Generate placeholder icon.png (1024) and splash.png (2732) using sharp.
// Run with: node scripts/make-assets.mjs
import sharp from "sharp";
import { mkdirSync } from "fs";
import { resolve } from "path";

const outDir = resolve("resources");
mkdirSync(outDir, { recursive: true });

const iconSvg = `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1024 1024">
  <defs>
    <linearGradient id="bg" x1="0" x2="1" y1="0" y2="1">
      <stop offset="0" stop-color="#0d0f16"/>
      <stop offset="1" stop-color="#1c2030"/>
    </linearGradient>
    <linearGradient id="moon" x1="0" x2="1" y1="0" y2="1">
      <stop offset="0" stop-color="#a0a0ff"/>
      <stop offset="1" stop-color="#5a5aff"/>
    </linearGradient>
  </defs>
  <rect width="1024" height="1024" fill="url(#bg)"/>
  <path d="M720 600a220 220 0 1 1-260-260 190 190 0 0 0 260 260z" fill="url(#moon)"/>
  <circle cx="280" cy="300" r="6" fill="#c8c8ff"/>
  <circle cx="800" cy="260" r="5" fill="#c8c8ff"/>
  <circle cx="760" cy="820" r="5" fill="#c8c8ff"/>
  <circle cx="240" cy="760" r="4" fill="#c8c8ff"/>
  <text x="512" y="930" text-anchor="middle" font-family="Inter, sans-serif"
        font-size="88" font-weight="700" fill="#e8e8ff" letter-spacing="2">NightBack</text>
</svg>`;

const splashSvg = `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 2732 2732">
  <defs>
    <radialGradient id="bg" cx="50%" cy="50%" r="70%">
      <stop offset="0" stop-color="#151824"/>
      <stop offset="1" stop-color="#08090d"/>
    </radialGradient>
    <linearGradient id="moon" x1="0" x2="1" y1="0" y2="1">
      <stop offset="0" stop-color="#a0a0ff"/>
      <stop offset="1" stop-color="#5a5aff"/>
    </linearGradient>
  </defs>
  <rect width="2732" height="2732" fill="url(#bg)"/>
  <g transform="translate(1366 1280)">
    <path d="M240 160a300 300 0 1 1-360-360 260 260 0 0 0 360 360z"
          fill="url(#moon)" transform="translate(-40 -40)"/>
  </g>
  <text x="1366" y="1820" text-anchor="middle" font-family="Inter, sans-serif"
        font-size="150" font-weight="700" fill="#e8e8ff" letter-spacing="6">NightBack</text>
</svg>`;

await sharp(Buffer.from(iconSvg)).resize(1024, 1024).png().toFile(resolve(outDir, "icon.png"));
await sharp(Buffer.from(iconSvg)).resize(1024, 1024).flatten({ background: "#0d0f16" }).png().toFile(resolve(outDir, "icon-foreground.png"));
await sharp(Buffer.from(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1024 1024"><rect width="1024" height="1024" fill="#0d0f16"/></svg>`)).resize(1024, 1024).png().toFile(resolve(outDir, "icon-background.png"));
await sharp(Buffer.from(splashSvg)).resize(2732, 2732).png().toFile(resolve(outDir, "splash.png"));
await sharp(Buffer.from(splashSvg)).resize(2732, 2732).png().toFile(resolve(outDir, "splash-dark.png"));

console.log("Generated: resources/icon.png, icon-foreground.png, icon-background.png, splash.png, splash-dark.png");
