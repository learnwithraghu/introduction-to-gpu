const fs = require('fs');
const path = require('path');

const root = path.resolve(__dirname, '..');
const materialsDir = path.join(root, 'introduction-to-gpu');
const mapPath = path.join(__dirname, 'slide-source-map.json');
const sourcePath = path.join(__dirname, 'build-deck.js');
const manifestPath = path.join(__dirname, 'build-manifest.json');

const sourceMap = JSON.parse(fs.readFileSync(mapPath, 'utf8'));
const sourceText = fs.readFileSync(sourcePath, 'utf8');
const errors = [];
const sourceFiles = new Set();

for (const slide of sourceMap.slides) {
  if (!slide.id) errors.push('A mapped slide is missing an id.');
  const hasMarker = sourceText.includes(`slideId('${slide.id}')`)
    || sourceText.includes(`newSlide('${slide.id}'`)
    || new RegExp(`['"]${escapeRegExp(slide.id)}['"]`).test(sourceText);
  if (!hasMarker) errors.push(`Missing slide marker: ${slide.id}`);

  for (const source of slide.sources) {
    sourceFiles.add(source.file);
    const fullPath = path.join(materialsDir, source.file);
    if (!fs.existsSync(fullPath)) {
      errors.push(`${slide.id}: missing source file ${source.file}`);
      continue;
    }

    if (source.file.endsWith('.md')) {
      const markdown = fs.readFileSync(fullPath, 'utf8');
      if (!markdown.split(/\r?\n/).some((line) => line.trim() === source.heading)) {
        errors.push(`${slide.id}: missing heading "${source.heading}" in ${source.file}`);
      }
    }
  }
}

const requiredDocs = fs.readdirSync(materialsDir)
  .filter((file) => /^\d\d-.*\.md$/.test(file));
for (const file of requiredDocs) {
  if (!sourceFiles.has(file)) errors.push(`Unmapped teaching document: ${file}`);
}

const manifest = fs.existsSync(manifestPath)
  ? JSON.parse(fs.readFileSync(manifestPath, 'utf8'))
  : null;
const changedSinceBuild = [];
if (manifest) {
  for (const [file, hash] of Object.entries(manifest.sources || {})) {
    const fullPath = path.join(root, file);
    if (!fs.existsSync(fullPath)) changedSinceBuild.push(`${file} (deleted)`);
    else if (hash !== hashFile(fullPath)) changedSinceBuild.push(file);
  }
}

if (errors.length) {
  console.error('Slide source validation failed:');
  errors.forEach((error) => console.error(`- ${error}`));
  process.exitCode = 1;
} else {
  console.log(`Validated ${sourceMap.slides.length} mapped slides across ${sourceFiles.size} sources.`);
  if (changedSinceBuild.length) {
    console.warn('Markdown or slide sources changed since the last build:');
    changedSinceBuild.forEach((file) => console.warn(`- ${file}`));
    process.exitCode = 2;
  } else if (manifest) {
    console.log('No mapped sources changed since the last build.');
  } else {
    console.warn('No build-manifest.json found; run the deck build first.');
  }
}

function hashFile(filePath) {
  return require('crypto').createHash('sha256').update(fs.readFileSync(filePath)).digest('hex');
}

function escapeRegExp(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}
