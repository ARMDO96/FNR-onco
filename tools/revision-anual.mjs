// Revisión anual del pautado: qué edición cita el contenido, cuál es la vigente, qué citas hay que
// verificar y qué citas apuntan a portadas genéricas. La usa el workflow del 15 de abril y sirve a mano.
// Uso: node tools/revision-anual.mjs > informe.md
import fs from 'node:fs';
import path from 'node:path';
import { ROOT, load } from './load.mjs';
import { citations } from './vigilancia.mjs';

const R = load();
const ph = R.sources.pautasHC;
const { pautas, generic } = citations(R);
const snapPath = path.resolve(process.env.VIGENCIA_SNAPSHOT || path.join(ROOT, 'tools/vigencia-snapshot.json'));
let snap = {};
try { snap = JSON.parse(fs.readFileSync(snapPath, 'utf8')); } catch { /* sin instantánea o vacía */ }
const tumor = w => w.startsWith('régimen') ? 'Regímenes' : (R.pathways[w.split('/')[0]] || {}).title || w;

const out = ['## Revisión anual del pautado', '',
  `- Edición citada por el contenido: **${ph.citada}** · edición vigente registrada: **${ph.vigente}**${ph.citada === ph.vigente ? '' : ' → hay que actualizar'}.`,
  snap.pautas ? `- Último PDF del pautado analizado por la vigilancia: ${decodeURIComponent(snap.pautas.pdf.split('/').pop())} (${snap.pautas.analyzed}).`
    : '- La vigilancia todavía no analizó ningún PDF del pautado.',
  `- Página del pautado: ${ph.pagina}`, '',
  `### Citas al pautado (${pautas.length})`];
const by = {};
for (const r of pautas) (by[tumor(r.where)] = by[tumor(r.where)] || []).push(r);
for (const [t, rs] of Object.entries(by)) {
  out.push('', `**${t}**`);
  for (const r of rs) out.push(`- [ ] \`${r.where}\` ${r.label} — cita: ${r.edicion ? 'edición ' + r.edicion : 'sin edición'}${r.edicion && r.edicion !== ph.vigente ? ' ⚠' : ''}`);
}
if (generic.length) {
  out.push('', `### Citas a portadas genéricas (${generic.length}): reemplazar por la guía o el capítulo concreto`);
  for (const r of generic) out.push(`- [ ] \`${r.where}\` ${r.label} — "${r.name}" → ${r.url}`);
}
out.push('', '### Pasos (GOBERNANZA.md → Revisión anual del pautado)',
  '1. Confirmar la edición vigente en la página del pautado y actualizar `content/sources.js` (`vigente`).',
  '2. Verificar cada cita de esta lista contra el capítulo nuevo: si la conducta sigue igual, actualizar edición y enlace; si cambió, registrar una objeción con la fuente.',
  '3. Actualizar `citada` en `content/sources.js`; el validador falla si queda alguna cita a otra edición (con `estricto: true`).',
  '4. Los ítems cuya cita cambió vuelven a revisión (cambió su huella) y necesitan las dos aprobaciones.');
console.log(out.join('\n'));
