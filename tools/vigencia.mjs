// Vigilancia de vigencia: detecta cambios en las páginas de normativas FNR y del FTM, e ítems revisados por vencer.
// Escribe un informe en markdown (salida estándar) y termina con código 3 si hay algo que revisar.
// Uso: node tools/vigencia.mjs > informe.md
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { ROOT, load } from './load.mjs';

const SOURCES = {
  'Normativas FNR': 'https://www.fnr.gub.uy/normativas-2/',
  'Formulario Terapéutico de Medicamentos (MSP)': 'https://www.gub.uy/ministerio-salud-publica/formulario-terapeutico-de-medicamentos-FTM',
};
const snapPath = path.join(ROOT, 'tools/vigencia-snapshot.json');
const snap = fs.existsSync(snapPath) ? JSON.parse(fs.readFileSync(snapPath, 'utf8')) : {};
const next = {};
const lines = [];
let attention = false;

for (const [name, url] of Object.entries(SOURCES)) {
  try {
    const html = await (await fetch(url, { headers: { 'user-agent': 'FNR-onco vigencia' } })).text();
    // Sólo los enlaces a documentos: el resto de la página cambia por motivos irrelevantes.
    const docs = [...new Set([...html.matchAll(/href="([^"]+\.(?:pdf|docx?|xlsx?))"/gi)].map(m => m[1]))].sort();
    const hash = crypto.createHash('sha256').update(docs.join('\n')).digest('hex').slice(0, 16);
    next[name] = { url, hash, docs };
    const prev = snap[name];
    if (!prev) { lines.push(`- **${name}**: primera instantánea (${docs.length} documentos).`); attention = true; }
    else if (prev.hash !== hash) {
      const added = docs.filter(d => !prev.docs.includes(d)), removed = prev.docs.filter(d => !docs.includes(d));
      lines.push(`- **${name}** cambió: ${added.length} documentos nuevos, ${removed.length} quitados.`);
      added.forEach(d => lines.push(`  - nuevo: ${d}`)); removed.forEach(d => lines.push(`  - quitado: ${d}`));
      attention = true;
    } else lines.push(`- ${name}: sin cambios.`);
  } catch (e) { lines.push(`- **${name}**: no se pudo consultar (${e.message}).`); attention = true; }
}

const R = load();
const limit = new Date(Date.now() + 30 * 86400000).toISOString().slice(0, 10);
const due = [];
for (const [tid, pw] of Object.entries(R.pathways)) {
  const tr = R.engine.tumorReview(tid, pw, R.regimens, R.reviews[tid]);
  tr.items.filter(s => (s.state === 'revisado' && s.expires <= limit) || s.state === 'caducado' && (R.reviews[tid] || []).some(d => d.item === s.ri.key))
    .forEach(s => due.push(`- ${s.ri.key} — ${s.ri.item.label} (${s.state === 'caducado' ? 'caducado' : 'vence ' + s.expires})`));
}
if (due.length) { attention = true; lines.push('', '### Ítems revisados que vencen o caducaron', ...due); }

fs.writeFileSync(snapPath, JSON.stringify(next, null, 1) + '\n');
console.log(['## Vigilancia de vigencia', '', ...lines, '',
  'Si cambió una normativa: revisar las indicaciones afectadas en `content/fnr.js` y las opciones con esa cobertura; todo cambio de contenido vuelve esos ítems a revisión (cambia su huella).',
  'Una vez revisado, actualizar `tools/vigencia-snapshot.json` con la versión generada por este informe.'].join('\n'));
process.exit(attention ? 3 : 0);
