// Vigilancia de vigencia: normativas FNR, FTM, Pautas HC/UdelaR, aprobaciones FDA, CHMP de la EMA, guías ESMO
// e ítems revisados por vencer. Escribe un informe en markdown (salida estándar) y termina con código 3 si hay algo que revisar.
// La instantánea anterior se lee de tools/vigencia-snapshot.json (o VIGENCIA_SNAPSHOT); el workflow la guarda
// en la rama vigencia-estado, así cada cambio se reporta una sola vez.
// Uso: node tools/vigencia.mjs > informe.md
//      VIGENCIA_FIXTURES=tests/fixtures/vigencia node tools/vigencia.mjs   (sin red: lee <id>.html de esa carpeta)
import fs from 'node:fs';
import path from 'node:path';
import { ROOT, load } from './load.mjs';
import { SOURCES, extractLinks, docLinks, tagTumors, stripTags, diff, pautasReport } from './vigilancia.mjs';

const FIX = process.env.VIGENCIA_FIXTURES && path.resolve(process.env.VIGENCIA_FIXTURES);
const snapPath = path.resolve(process.env.VIGENCIA_SNAPSHOT || path.join(ROOT, 'tools/vigencia-snapshot.json'));
let old = {};
try { old = JSON.parse(fs.readFileSync(snapPath, 'utf8')); } catch { /* sin instantánea o vacía */ }
const snap = old.version === 2 ? old : { version: 2, sources: {} };
const next = { version: 2, checked: new Date().toISOString().slice(0, 10), sources: {}, pautas: snap.pautas };
const R = load();
const lines = [];
let attention = false;

async function getText(url, fixtureName) {
  if (FIX) return fs.readFileSync(path.join(FIX, fixtureName), 'utf8');
  const res = await fetch(url, { headers: { 'user-agent': 'FNR-onco vigencia (github.com/ARMDO96/FNR-onco)' } });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return res.text();
}
async function analyzePautas(pdf) {
  if (FIX) {
    const own = path.join(FIX, `pautas-chapters-${decodeURIComponent(pdf.split('/').pop()).replace(/\.pdf.*$/i, '')}.json`);
    return JSON.parse(fs.readFileSync(fs.existsSync(own) ? own : path.join(FIX, 'pautas-chapters.json'), 'utf8'));
  }
  const { analyzePdf } = await import('./pautas.mjs');
  return (await analyzePdf(pdf)).chapters;
}
const year = s => Math.max(0, ...(decodeURIComponent(s.split('/').pop()).match(/20\d\d/g) || []).map(Number));
const uploaded = s => (s.match(/\/uploads\/(\d{4}\/\d{2})\//) || [])[1] || '';
const tumorNames = ids => ids.map(t => (R.pathways[t] && R.pathways[t].title) || t).join(', ');

for (const src of SOURCES) {
  const prev = snap.sources[src.id];
  try {
    const html = await getText(src.url, `${src.id}.html`);
    if (src.kind === 'docs') {
      const docs = docLinks(html, src.url);
      next.sources[src.id] = { url: src.url, docs };
      if (!prev) lines.push(`- ${src.name}: primera instantánea (${docs.length} documentos), queda como referencia.`);
      else {
        const { added, removed } = diff(prev.docs, docs);
        if (added.length || removed.length) {
          attention = true;
          lines.push(`- **${src.name}** cambió: ${added.length} documentos nuevos, ${removed.length} quitados.`);
          added.forEach(d => lines.push(`  - nuevo: ${d}`)); removed.forEach(d => lines.push(`  - quitado: ${d}`));
        } else lines.push(`- ${src.name}: sin cambios.`);
      }
      // Pautado: se analizan los PDF nuevos de la página. La primera vez, la edición más reciente más los PDF
      // subidos después de ella (las actualizaciones por tema pueden venir en archivos separados).
      // Un capítulo de un archivo subido después reemplaza al del mismo tema.
      if (src.pautas) {
        const pdfs = docs.filter(d => /\.pdf(?:$|[?#])/i.test(d));
        let set;
        if (snap.pautas) set = prev ? diff(prev.docs, pdfs).added : [];
        else {
          const base = pdfs.filter(d => /pauta/i.test(decodeURIComponent(d))).sort((a, b) => year(a) - year(b) || uploaded(a).localeCompare(uploaded(b))).pop();
          set = base ? [base, ...pdfs.filter(d => uploaded(d) > uploaded(base))] : [];
        }
        set = set.sort((a, b) => uploaded(a).localeCompare(uploaded(b)) || a.localeCompare(b)).slice(-25);
        if (set.length) {
          const byTema = new Map(((snap.pautas && snap.pautas.chapters) || []).map(c => [c.tema, c]));
          const read = [];
          for (const pdf of set) {
            const name = decodeURIComponent(pdf.split('/').pop());
            try {
              const chs = await analyzePautas(pdf);
              chs.forEach(c => byTema.set(c.tema, { ...c, pdf }));
              read.push(`${name} (${chs.length} capítulos reconocidos)`);
            } catch (e) { read.push(`${name}: no se pudo leer (${e.message})`); }
          }
          const chapters = [...byTema.values()];
          const rep = pautasReport(chapters, snap.pautas && snap.pautas.chapters, R);
          next.pautas = { pdf: set[set.length - 1], pdfs: set, analyzed: next.checked, chapters };
          attention = true;
          lines.push('', '### Pautado', `- Archivos leídos: ${read.join('; ')}.`, ...rep.lines);
          if (rep.changedTumors.length) lines.push(`- Ítems a revisar: los que citan el pautado en ${tumorNames(rep.changedTumors)} (\`node tools/revision-anual.mjs\` los lista).`);
          lines.push('');
        }
      }
    } else {
      const items = extractLinks(html, src.url).filter(src.filter);
      next.sources[src.id] = { url: src.url, items: items.map(l => l.href) };
      if (!items.length) {
        attention = true;
        lines.push(`- **${src.name}**: el filtro no encontró ningún enlace. La página probablemente cambió de estructura: revisar el filtro en tools/vigilancia.mjs.`);
        if (prev) next.sources[src.id].items = prev.items; // no perder la referencia por una página rota
        continue;
      }
      if (!prev) { lines.push(`- ${src.name}: primera instantánea (${items.length} enlaces), queda como referencia.`); continue; }
      const added = items.filter(l => !prev.items.includes(l.href));
      const relevant = [];
      let followed = 0;
      for (const l of added) {
        let tags = tagTumors(`${l.text} ${l.href}`);
        if (src.follow && followed < 5) {
          followed++;
          try { tags = [...new Set([...tags, ...tagTumors(stripTags(await getText(l.href, `follow-${src.id}-${followed}.html`)))])]; }
          catch (e) { tags.push('?'); }
        }
        if (tags.length) relevant.push(`  - [${l.text || l.href}](${l.href}) — ${tags.includes('?') ? 'no se pudo leer la página; revisar a mano' : tumorNames(tags)}`);
      }
      if (relevant.length) { attention = true; lines.push(`- **${src.name}**: ${relevant.length} novedades sobre tumores de la app${added.length > relevant.length ? ` (y ${added.length - relevant.length} de otros tumores)` : ''}:`, ...relevant); }
      else lines.push(`- ${src.name}: ${added.length ? `${added.length} novedades, ninguna sobre tumores de la app` : 'sin novedades'}.`);
    }
  } catch (e) {
    attention = true;
    lines.push(`- **${src.name}**: no se pudo consultar (${e.message}).`);
    if (prev) next.sources[src.id] = prev;
  }
}

// Ediciones: el contenido debería citar la edición vigente del pautado.
const ph = R.sources && R.sources.pautasHC;
if (ph && ph.citada !== ph.vigente) lines.push('', `- El contenido cita las Pautas ${ph.citada} y la edición vigente es ${ph.vigente}: \`node tools/revision-anual.mjs\` lista las citas a actualizar.`);

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
  'Si cambió una normativa o una guía: revisar las indicaciones afectadas y las opciones de ese tumor; todo cambio de contenido vuelve esos ítems a revisión (cambia su huella).',
  'Las novedades se reportan una sola vez: la instantánea queda guardada en la rama `vigencia-estado`.'].join('\n'));
process.exit(attention ? 3 : 0);
