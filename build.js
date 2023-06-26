const fs = require('fs');
const path = require('path');

const sass = require('sass');
const JsObfuscator = require('javascript-obfuscator');
const archiver = require('archiver');

// Create build folder
const buildPath = path.join(__dirname, 'build');
if (fs.existsSync(buildPath)) {
  fs.rmSync(buildPath, { recursive: true, force: true });
}
fs.mkdirSync(buildPath);

for (let i of ['manifest.json', 'icon.png', 'icon_128.png']) {
  fs.copyFileSync(path.join(__dirname, i), path.join(buildPath, i));
}

// Create content folder
const contentPath = path.join(buildPath, 'content');
fs.mkdirSync(contentPath);

// Compile SCSS to CSS
const result = sass.compile(path.join(__dirname, 'content', 'content.scss'), {
  style: 'compressed',
});
fs.writeFileSync(path.join(contentPath, 'content.css'), result.css);

// Obfuscate JS
const jsCode = fs.readFileSync(path.join(__dirname, 'content', 'content.js'), {
  encoding: 'utf-8',
});
const obfuscatedJs = JsObfuscator.obfuscate(jsCode).getObfuscatedCode();
fs.writeFileSync(path.join(contentPath, 'content.js'), obfuscatedJs);

// Create popup folder
const popupPath = path.join(buildPath, 'popup');
fs.mkdirSync(popupPath);

fs.copyFileSync(
  path.join(__dirname, 'popup', 'popup.html'),
  path.join(buildPath, 'popup', 'popup.html')
);

// Create ZIP file
const output = fs.createWriteStream('build.zip');
const archive = archiver('zip', { zlib: { level: 9 } });
archive.directory(buildPath, false);
archive.finalize();
archive.pipe(output);
