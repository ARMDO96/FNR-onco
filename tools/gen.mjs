// Regenera las etiquetas <script> de contenido en index.html y la lista de archivos del service worker.
// Uso: node tools/gen.mjs   (correr después de agregar o quitar archivos de content/)
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { ROOT, contentFiles } from './load.mjs';

const files = contentFiles();
const idxPath = path.join(ROOT, 'index.html');
let html = fs.readFileSync(idxPath, 'utf8');
const block = files.map(f => `<script src="${f}"></script>`).join('\n');
html = html.replace(/<!-- contenido: generado por tools\/gen\.mjs -->[\s\S]*?<!-- \/contenido -->/,
  `<!-- contenido: generado por tools/gen.mjs -->\n${block}\n<!-- /contenido -->`);
fs.writeFileSync(idxPath, html);

const ls = d => fs.readdirSync(path.join(ROOT, d)).sort().map(f => `${d}/${f}`);
const cache = ['./', 'index.html', 'manifest.webmanifest', 'app/app.css',
  ...ls('app').filter(f => f.endsWith('.js')), ...files, ...ls('icons'), ...ls('fonts')];
const swPath = path.join(ROOT, 'sw.js');
let sw = fs.readFileSync(swPath, 'utf8');
sw = sw.replace(/const FILES=\[[\s\S]*?\];/, `const FILES=${JSON.stringify(cache).replace(/","/g, '",\n"')};`);
// El nombre de la caché depende del contenido de los archivos: cualquier cambio publica una versión nueva
// y el service worker descarta la anterior (si no, los scripts se seguirían sirviendo desde la caché vieja).
const h = crypto.createHash('sha256');
for (const f of cache.filter(f => f !== './')) h.update(f).update(fs.readFileSync(path.join(ROOT, f)));
sw = sw.replace(/const CACHE='[^']*';/, `const CACHE='fnr-onco-${h.digest('hex').slice(0, 10)}';`);
fs.writeFileSync(swPath, sw);
console.log(`index.html: ${files.length} archivos de contenido · sw.js: ${cache.length} archivos en caché`);
