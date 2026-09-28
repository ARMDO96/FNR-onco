// Valida el contenido clínico: estructura de las vías, referencias cruzadas y reglas de sala limpia.
import fs from 'node:fs';
import path from 'node:path';
import { ROOT, load, contentFiles } from './load.mjs';
import { citations } from './vigilancia.mjs';

const R = load();
const errors = [];
const err = (where, msg) => errors.push(`${where}: ${msg}`);

// Estadios posibles por tumor: se obtienen recorriendo todas las combinaciones de las tablas.
function stagesOf(tid) {
  const d = R.staging[tid]; if (!d) return null;
  const out = new Set();
  const rec = (i, sel) => {
    const axes = d.pre ? [d.pre, ...d.axes] : d.axes; // 'pre' (p. ej. histología en pulmón) también se combina
    if (i === axes.length) { const r = d.stage(sel); if (r && r.stage) out.add(r.stage); return; }
    for (const o of axes[i].options) rec(i + 1, { ...sel, [axes[i].key]: o.v });
  };
  rec(0, {});
  return [...out];
}

const fnrInds = R.fnr.TUMORS.flatMap(t => t.inds.map(i => i.id));
const ids = new Set();
for (const t of R.fnr.TUMORS) for (const i of t.inds) { if (ids.has(i.id)) err('fnr', `id duplicado ${i.id}`); ids.add(i.id); }

for (const [id, rg] of Object.entries(R.regimens || {})) {
  if (!rg.name) err(`régimen ${id}`, 'sin nombre');
  if (!rg.drugs || !rg.drugs.length) err(`régimen ${id}`, 'sin fármacos');
  (rg.drugs || []).forEach((d, i) => {
    const t = d.dose && d.dose.type;
    if (!['m2', 'kg', 'auc', 'flat', 'text'].includes(t)) err(`régimen ${id}.drugs[${i}]`, `tipo de dosis inválido: ${t}`);
    if (t !== 'text' && !(typeof d.dose.value === 'number' && d.dose.value > 0)) err(`régimen ${id}.drugs[${i}]`, 'dosis no numérica');
  });
  (rg.refs || []).forEach((r, j) => { if (!r.pmid && !r.nct && !r.url) err(`régimen ${id}.refs[${j}]`, 'sin pmid/nct/url'); });
}

for (const [tid, pw] of Object.entries(R.pathways || {})) {
  if (!['borrador', 'revisado'].includes(pw.status)) err(`vía ${tid}`, 'status debe ser borrador o revisado');
  if (!/^\d{4}-\d{2}-\d{2}$/.test(pw.updated || '')) err(`vía ${tid}`, 'updated debe ser AAAA-MM-DD');
  // Gobernanza: una vía sólo puede declararse revisada si todos sus ítems tienen doble aprobación vigente.
  if (pw.status === 'revisado') {
    const tr = R.engine.tumorReview(tid, pw, R.regimens || {}, (R.reviews || {})[tid]);
    if (!tr.complete) err(`vía ${tid}`, `status "revisado" pero sólo ${tr.count.revisado || 0} de ${tr.total} ítems tienen doble aprobación vigente`);
  }
  const stages = stagesOf(tid);
  for (const e of R.engine.check(pw, { fnrInds, regimens: R.regimens || {}, stages })) err(`vía ${tid}`, e);
  // Todo estadio que produce la app debería poder sugerirse en algún nodo.
  if (stages) {
    const used = new Set(Object.values(pw.nodes).flatMap(n => n.type === 'q' ? n.options.flatMap(o => o.stages || []) : []));
    const miss = stages.filter(s => !used.has(s));
    if (miss.length) err(`vía ${tid}`, `estadios sin opción sugerida: ${miss.join(', ')}`);
  }
}

// Sala limpia: la marca NCCN no puede aparecer en el contenido ni en la app.
for (const f of [...contentFiles(), 'index.html', ...fs.readdirSync(path.join(ROOT, 'app')).map(f => `app/${f}`)]) {
  if (/nccn/i.test(fs.readFileSync(path.join(ROOT, f), 'utf8'))) err(f, 'contiene "NCCN" (regla de sala limpia)');
}

// Citas: las del pautado nombran la edición citada (content/sources.js) y ninguna apunta a una portada genérica.
// Mientras estricto sea false, las citas desactualizadas se avisan sin fallar (ver tools/revision-anual.mjs).
const ph = R.sources && R.sources.pautasHC;
if (!ph || !/^\d{4}$/.test(ph.citada || '') || !/^\d{4}$/.test(ph.vigente || '')) err('content/sources.js', 'pautasHC necesita citada y vigente (AAAA)');
else {
  const { pautas, generic } = citations(R);
  const warn = [];
  // Durante la actualización (citada ≠ vigente) conviven citas a las dos ediciones: las que ya se verificaron
  // contra la vigente y las que todavía no. Cualquier otra edición es un error.
  const lenient = ph.estricto ? err : (w, m) => warn.push(`${w}: ${m}`);
  let pendientes = 0;
  for (const r of pautas) {
    if (!r.edicion) lenient(r.where, 'cita al pautado sin edición');
    else if (r.edicion === ph.vigente) continue;
    else if (r.edicion === ph.citada) { pendientes++; if (ph.estricto) err(r.where, `cita las Pautas ${r.edicion} y la vigente es ${ph.vigente}`); }
    else err(r.where, `cita las Pautas ${r.edicion}: content/sources.js dice citada ${ph.citada} y vigente ${ph.vigente}`);
  }
  for (const r of generic) (ph.estricto ? err : (w, m) => warn.push(`${w}: ${m}`))(r.where, `cita a una portada genérica (${r.url})`);
  if (ph.citada !== ph.vigente) {
    if (ph.estricto) err('content/sources.js', `el contenido cita las Pautas ${ph.citada} y la vigente es ${ph.vigente}`);
    else warn.unshift(`${pendientes} citas al pautado corresponden a la edición ${ph.citada}; la vigente es ${ph.vigente}`);
  }
  if (warn.length) console.log(`⚠ citas a actualizar (${warn.length}):\n` + warn.map(w => '  · ' + w).join('\n'));
}

// Entorno (app/config.js): falla cerrado. 'produccion' exige un proyecto Supabase habilitado y la URL de ese
// proyecto; un proyecto habilitado para datos reales no puede usarse en 'demo' (se cargarían datos de prueba en él).
const cfg = R.config || {};
if (!['demo', 'produccion'].includes(cfg.ENTORNO)) err('app/config.js', `ENTORNO debe ser 'demo' o 'produccion' (es ${cfg.ENTORNO})`);
else {
  let host = null;
  if (cfg.SUPABASE_URL) { try { host = new URL(cfg.SUPABASE_URL).host; } catch { err('app/config.js', 'SUPABASE_URL no es una URL válida'); } }
  const habilitado = host && (cfg.PROYECTOS_PRODUCCION || []).some(r => host === `${r}.supabase.co`);
  if (cfg.ENTORNO === 'produccion' && !habilitado) err('app/config.js', "ENTORNO 'produccion' sin un proyecto de PROYECTOS_PRODUCCION en SUPABASE_URL");
  if (cfg.ENTORNO === 'demo' && habilitado) err('app/config.js', "ENTORNO 'demo' apuntando a un proyecto habilitado para datos reales");
}

const nP = Object.keys(R.pathways || {}).length, nR = Object.keys(R.regimens || {}).length;
if (errors.length) { console.error(errors.map(e => '✗ ' + e).join('\n')); console.error(`\n${errors.length} error(es)`); process.exit(1); }
console.log(`✓ contenido válido: ${nP} vías, ${nR} regímenes, ${fnrInds.length} indicaciones FNR`);
