// Verifica que cada PMID y NCT citado exista, y guarda título, revista y año en content/refs-cache.js.
// Los revisores ven ese título real junto a cada cita: una cita que apunta a otro artículo salta a la vista.
// Uso: node tools/check-refs.mjs   (necesita acceso a eutils.ncbi.nlm.nih.gov y clinicaltrials.gov)
import fs from 'node:fs';
import path from 'node:path';
import { ROOT, load } from './load.mjs';

const R = load();
const refs = [];
for (const [tid, pw] of Object.entries(R.pathways || {}))
  for (const [id, n] of Object.entries(pw.nodes)) if (n.type === 'rec')
    n.items.forEach((it, i) => (it.refs || []).forEach(r => refs.push({ ...r, where: `${tid}/${id}#${i}` })));
for (const [id, rg] of Object.entries(R.regimens || {})) (rg.refs || []).forEach(r => refs.push({ ...r, where: `régimen ${id}` }));

const pmids = [...new Set(refs.filter(r => r.pmid).map(r => String(r.pmid)))];
const ncts = [...new Set(refs.filter(r => r.nct).map(r => String(r.nct).toUpperCase()))];
const cache = { pmid: {}, nct: {}, checked: new Date().toISOString().slice(0, 10) };
const missing = [];

for (let i = 0; i < pmids.length; i += 100) {
  const ids = pmids.slice(i, i + 100);
  const res = await fetch(`https://eutils.ncbi.nlm.nih.gov/entrez/eutils/esummary.fcgi?db=pubmed&retmode=json&id=${ids.join(',')}`);
  if (!res.ok) throw new Error(`PubMed respondió ${res.status}`);
  const j = await res.json();
  for (const id of ids) {
    const d = j.result && j.result[id];
    if (!d || d.error || !d.title) { missing.push(`PMID ${id}`); continue; }
    cache.pmid[id] = { title: d.title.replace(/\.$/, ''), journal: d.source || '', year: (d.pubdate || '').slice(0, 4) };
  }
  await new Promise(r => setTimeout(r, 400)); // respetar el límite de PubMed sin clave (3 pedidos/s)
}
for (const id of ncts) {
  const res = await fetch(`https://clinicaltrials.gov/api/v2/studies/${id}?fields=protocolSection.identificationModule`);
  if (!res.ok) { missing.push(`${id}`); continue; }
  const m = (await res.json()).protocolSection.identificationModule;
  cache.nct[id] = { title: m.briefTitle || m.officialTitle || '', acronym: m.acronym || '' };
}

fs.writeFileSync(path.join(ROOT, 'content/refs-cache.js'),
  `/* Títulos reales de las citas, generado por tools/check-refs.mjs el ${cache.checked}: no editar a mano. */\n` +
  `(function(R){\nR.refsCache=${JSON.stringify(cache, null, 1)};\n})(window.FNRO=window.FNRO||{});\n`);

// Aviso (no error): el nombre del ensayo no aparece en el título. Muchos títulos no llevan la sigla: lo decide un humano.
const norm = s => String(s || '').toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '');
const doubtful = refs.filter(r => {
  const c = r.pmid ? cache.pmid[r.pmid] : r.nct ? cache.nct[String(r.nct).toUpperCase()] : null;
  if (!c) return false;
  const key = norm(String(r.name || '').split(/[\s(,/]/)[0]);
  return key.length > 3 && !norm(c.title + ' ' + (c.acronym || '')).includes(key);
});
console.log(`Citas: ${pmids.length} PMID y ${ncts.length} NCT distintos.`);
if (doubtful.length) {
  console.log(`\nPara revisión humana (el nombre no figura en el título): ${doubtful.length}`);
  for (const r of doubtful) console.log(`  · ${r.where} — "${r.name}" → ${r.pmid ? 'PMID ' + r.pmid + ': ' + cache.pmid[r.pmid].title : r.nct + ': ' + cache.nct[String(r.nct).toUpperCase()].title}`);
}
if (missing.length) { console.error(`\n✗ No existen: ${missing.join(', ')}`); process.exit(1); }
console.log('\n✓ Todas las citas existen.');
