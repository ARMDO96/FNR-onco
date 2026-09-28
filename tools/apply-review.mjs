// Incorpora al registro (content/reviews/<tumor>.js) el archivo que exporta un revisor desde el modo revisión.
// Uso: node tools/apply-review.mjs revision-pulm-editor-2026-10-02.json [--nombre "Dra. X"]
// Reglas: sólo se aceptan decisiones cuya huella coincide con el contenido actual; las demás se informan como caducas.
import fs from 'node:fs';
import path from 'node:path';
import { ROOT, load } from './load.mjs';

const file = process.argv[2];
if (!file) { console.error('Uso: node tools/apply-review.mjs <archivo.json>'); process.exit(2); }
const x = JSON.parse(fs.readFileSync(file, 'utf8'));
if (x.format !== 'fnr-onco-revision' || x.version !== 1) throw new Error('No es un archivo de revisión de FNR-onco');
if (!['editor', 'segundo'].includes(x.role)) throw new Error(`Rol desconocido: ${x.role}`);
const R = load();
const pw = R.pathways[x.tumor];
if (!pw) throw new Error(`Tumor desconocido: ${x.tumor}`);
const current = new Map(R.engine.reviewItems(x.tumor, pw, R.regimens).map(ri => [ri.key, ri.hash]));
const reg = [...(R.reviews[x.tumor] || [])].map(d => JSON.parse(JSON.stringify(d)));
const seen = new Set(reg.map(d => `${d.item}|${d.hash}|${d.role}|${d.date}|${d.decision}`));
const DEC = ['aprobar', 'aprobar-menor', 'objetar', 'retirar'];
let added = 0; const stale = [], invalid = [];
for (const d of x.decisions || []) {
  if (!DEC.includes(d.decision)) { invalid.push(`${d.item}: decisión "${d.decision}"`); continue; }
  if (d.decision !== 'aprobar' && !String(d.comment || '').trim()) { invalid.push(`${d.item}: falta comentario`); continue; }
  if (d.decision === 'aprobar' && !(d.checks && d.checks.ref && d.checks.lvl && d.checks.cov)) { invalid.push(`${d.item}: aprobación sin controles completos`); continue; }
  if (current.get(d.item) !== d.hash) { stale.push(d.item); continue; }
  const e = { item: d.item, hash: d.hash, role: x.role, name: x.name || '', date: d.date || x.exportedAt.slice(0, 10), decision: d.decision,
    checks: d.checks || {}, comment: String(d.comment || '').trim(), coi: !!d.coi };
  const k = `${e.item}|${e.hash}|${e.role}|${e.date}|${e.decision}`;
  if (seen.has(k)) continue;
  seen.add(k); reg.push(e); added++;
}
const out = path.join(ROOT, 'content/reviews', `${x.tumor}.js`);
fs.writeFileSync(out, `/* Registro de revisión clínica de la vía "${x.tumor}". Lo genera tools/apply-review.mjs: no editar a mano.
   Cada entrada es una decisión de un revisor sobre un ítem, ligada a la huella de su contenido. */
(function(R){
R.reviews=R.reviews||{};
R.reviews.${x.tumor}=${JSON.stringify(reg, null, 1)};
})(window.FNRO=window.FNRO||{});
`);
// nombre y declaración de conflictos del revisor
const rvPath = path.join(ROOT, 'content/reviewers.js');
const rv = JSON.parse(JSON.stringify(R.reviewers));
if (x.name) rv[x.role].nombre = x.name;
if (x.coi) rv[x.role].coi = x.coi;
fs.writeFileSync(rvPath, `/* Revisores clínicos y declaración de conflictos de interés (se muestran en "Acerca de"). */
(function(R){
R.reviewers=${JSON.stringify(rv, null, 1)};
})(window.FNRO=window.FNRO||{});
`);
console.log(`${x.tumor} · ${x.role} (${x.name || 'sin nombre'}): ${added} decisiones nuevas; ${stale.length} caducas (el contenido cambió después de revisarlo); ${invalid.length} inválidas; ${x.pending || 0} ítems sin decisión en el archivo.`);
if (stale.length) console.log('Caducas (volver a revisar):\n  ' + stale.join('\n  '));
if (invalid.length) console.log('Inválidas:\n  ' + invalid.join('\n  '));
