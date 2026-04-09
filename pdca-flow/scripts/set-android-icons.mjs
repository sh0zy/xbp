import sharp from 'sharp';
import { existsSync } from 'fs';

// Android mipmap sizes
const sizes = [
  { dir: 'mipmap-mdpi', size: 48 },
  { dir: 'mipmap-hdpi', size: 72 },
  { dir: 'mipmap-xhdpi', size: 96 },
  { dir: 'mipmap-xxhdpi', size: 144 },
  { dir: 'mipmap-xxxhdpi', size: 192 },
];

const resBase = 'android/app/src/main/res';

async function main() {
  const iconSrc = 'resources/icon.png';
  const fgSrc = 'resources/adaptive-icon-foreground.png';

  if (!existsSync(iconSrc)) {
    console.error('resources/icon.png not found!');
    process.exit(1);
  }

  for (const { dir, size } of sizes) {
    const outDir = `${resBase}/${dir}`;

    // ic_launcher.png
    await sharp(iconSrc).resize(size, size).png().toFile(`${outDir}/ic_launcher.png`);
    console.log(`  ${outDir}/ic_launcher.png (${size}x${size})`);

    // ic_launcher_round.png (same as launcher for now)
    await sharp(iconSrc).resize(size, size).png().toFile(`${outDir}/ic_launcher_round.png`);
    console.log(`  ${outDir}/ic_launcher_round.png (${size}x${size})`);

    // ic_launcher_foreground.png (for adaptive icon)
    if (existsSync(fgSrc)) {
      await sharp(fgSrc).resize(size, size).png().toFile(`${outDir}/ic_launcher_foreground.png`);
      console.log(`  ${outDir}/ic_launcher_foreground.png (${size}x${size})`);
    }
  }

  // Also create the background color drawable if needed
  const bgDrawable = `${resBase}/values/ic_launcher_background.xml`;
  if (!existsSync(`${resBase}/values`)) {
    const { mkdirSync } = await import('fs');
    mkdirSync(`${resBase}/values`, { recursive: true });
  }

  const { writeFileSync } = await import('fs');
  writeFileSync(bgDrawable,
    `<?xml version="1.0" encoding="utf-8"?>
<resources>
    <color name="ic_launcher_background">#0f172a</color>
</resources>
`);
  console.log(`  ${bgDrawable}`);

  console.log('Android icons set!');
}

main().catch(console.error);
