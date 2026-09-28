// Funciones puras de la vigilancia de vigencia: fuentes, extracción de enlaces, etiquetado por tumor,
// detección de fármacos y división del pautado en capítulos. Sin red ni archivos: se prueban con fixtures.
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { ROOT } from './load.mjs';

export const PAUTAS_URL = 'https://oncologiamedica.hc.edu.uy/publicaciones/pautas-de-oncologia-medica-para-el-diagnostico-tratamiento-sistemico-y-seguimiento/';

// kind 'docs': se vigila la lista de documentos enlazados (pdf, doc, xls).
// kind 'items': se vigilan los enlaces que pasan el filtro; cada novedad se etiqueta por tumor.
// follow: además se lee la página de cada novedad para etiquetarla (máximo 5 por corrida).
export const SOURCES = [
  { id: 'fnr', name: 'Normativas FNR', url: 'https://www.fnr.gub.uy/normativas-2/', kind: 'docs' },
  { id: 'ftm', name: 'Formulario Terapéutico de Medicamentos (MSP)', url: 'https://www.gub.uy/ministerio-salud-publica/formulario-terapeutico-de-medicamentos-FTM', kind: 'docs' },
  { id: 'pautas', name: 'Pautas de Oncología Médica HC/UdelaR', url: PAUTAS_URL, kind: 'docs', pautas: true },
  { id: 'fda', name: 'FDA: aprobaciones en oncología', kind: 'items',
    url: 'https://www.fda.gov/drugs/resources-information-approved-drugs/oncology-cancer-hematologic-malignancies-approval-notifications',
    filter: l => /\/resources-information-approved-drugs\/fda-/i.test(l.href) },
  { id: 'ema', name: 'EMA: reuniones del CHMP', kind: 'items', follow: true,
    url: 'https://www.ema.europa.eu/en/news-events/whats-new',
    filter: l => /meeting-highlights-committee-medicinal-products-human-use-chmp/i.test(l.href) },
  { id: 'esmo', name: 'Guías ESMO', kind: 'items',
    url: 'https://www.esmo.org/guidelines',
    filter: l => /\/guidelines\/guidelines-by-topic\/.+/i.test(l.href) },
];

export const norm = s => String(s || '').toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '');
export const hash = s => crypto.createHash('sha256').update(s).digest('hex').slice(0, 16);

const decode = s => s.replace(/&amp;/g, '&').replace(/&quot;/g, '"').replace(/&#0?39;/g, "'").replace(/&nbsp;/g, ' ')
  .replace(/&lt;/g, '<').replace(/&gt;/g, '>');
export const stripTags = html => decode(String(html).replace(/<script[\s\S]*?<\/script>|<style[\s\S]*?<\/style>/gi, ' ')
  .replace(/<[^>]+>/g, ' ')).replace(/\s+/g, ' ').trim();

/* Enlaces de una página: [{href absoluto, text}] sin repetir href. */
export function extractLinks(html, base) {
  const out = new Map();
  for (const m of String(html).matchAll(/<a\b[^>]*?href\s*=\s*["']([^"']+)["'][^>]*>([\s\S]*?)<\/a>/gi)) {
    let href;
    try { href = new URL(decode(m[1]), base).href; } catch { continue; }
    if (!out.has(href)) out.set(href, stripTags(m[2]));
  }
  return [...out].map(([href, text]) => ({ href, text }));
}

export const docLinks = (html, base) =>
  [...new Set(extractLinks(html, base).map(l => l.href).filter(h => /\.(?:pdf|docx?|xlsx?)(?:$|[?#])/i.test(h)))].sort();

/* Tumores de la app mencionados en un texto (español o inglés). El pulmón de la app es no microcítico. */
const TUMOR_WORDS = {
  mama: /\b(breast|mama|mamario)/,
  ccr: /\b(colorectal|colon|rectal|recto|colorrecto)/,
  pros: /\b(prostate|prostata|prostatic)/,
  pulm: /\b(non-small|nsclc|no microcitico|lung|pulmon)/,
  ccu: /\b(cervical cancer|cervix|cuello uterino|cancer de cuello)/,
};
export function tagTumors(text) {
  const t = norm(text);
  return Object.entries(TUMOR_WORDS).filter(([id, re]) => re.test(t) && !(id === 'pulm' && /small cell lung|microcitico/.test(t) && !/non-small|no microcitico/.test(t))).map(([id]) => id);
}

/* Diferencia entre dos listas: lo que apareció y lo que ya no está. */
export function diff(prev = [], cur = []) {
  const p = new Set(prev), c = new Set(cur);
  return { added: cur.filter(x => !p.has(x)), removed: prev.filter(x => !c.has(x)) };
}

// Fármacos: diccionario (tools/farmacos.json) más sufijos de denominación común internacional.
const SUFFIX = /\b[a-z]{3,}(?:mab|nib|ciclib|parib|lisib|rafenib|degib|lutamida|lutamide|platino|platin|taxel|rubicina|rubicin|tecan|mustina|mustine|lintide|relix|relin)\b/g;
let DICT = null;
export function drugDict() {
  if (!DICT) DICT = JSON.parse(fs.readFileSync(path.join(ROOT, 'tools/farmacos.json'), 'utf8')).farmacos.map(norm);
  return DICT;
}
export function detectDrugs(text, dict = drugDict()) {
  const t = norm(text), found = new Set();
  for (const d of dict) if (new RegExp(`\\b${d.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\b`).test(t)) found.add(d);
  for (const m of t.matchAll(SUFFIX)) found.add(m[0]);
  // "trastuzumab deruxtecan" también contiene "trastuzumab": se conservan ambos a propósito.
  return [...found].sort();
}

/* Clave para comparar fármacos entre textos en español y en inglés: capecitabina = capecitabine,
   epirrubicina = epirubicina, letrozol = letrozole. Sólo compara; detectDrugs devuelve la forma escrita. */
export const drugKey = d => norm(d).replace(/(.)\1/g, '$1').replace(/[aeo]$/, '');

/* Texto de la app por tumor: etiquetas, detalles y regímenes de su vía. */
export function appText(R, tid) {
  const pw = R.pathways[tid]; if (!pw) return '';
  const parts = [];
  for (const n of Object.values(pw.nodes)) if (n.type === 'rec') for (const it of n.items) {
    parts.push(it.label, it.detail || '');
    const rg = it.regimen && R.regimens[it.regimen];
    if (rg) parts.push(rg.name, ...rg.drugs.map(d => d.name));
  }
  return parts.join('\n');
}

// Capítulos del pautado → tumor de la app. La primera coincidencia gana: lo específico va antes.
let MAP = null;
export function pautasMap() {
  if (!MAP) MAP = JSON.parse(fs.readFileSync(path.join(ROOT, 'tools/pautas-map.json'), 'utf8')).capitulos
    .map(c => ({ ...c, re: new RegExp(c.patron, 'i') }));
  return MAP;
}
export function chapterOf(title, map = pautasMap()) {
  const t = norm(title);
  const c = map.find(c => c.re.test(t));
  return c ? { tema: c.tema, tumor: c.tumor } : null;
}

/* Divide el pautado en capítulos.
   pages: [texto de cada página]; outline: [{title, page (0-based)}] del índice del PDF, si lo tiene.
   Sin índice: una página abre capítulo si su comienzo coincide con un tema del mapa. */
export function splitChapters(pages, outline = [], map = pautasMap()) {
  let starts = outline.map(o => ({ title: o.title, page: o.page, ch: chapterOf(o.title, map) })).filter(s => s.ch && s.page >= 0);
  if (!starts.length)
    pages.forEach((p, i) => { const head = p.slice(0, 160), ch = chapterOf(head, map); if (ch) starts.push({ title: ch.tema, page: i, ch }); });
  starts.sort((a, b) => a.page - b.page);
  // entradas seguidas con el mismo tema (subtítulos, páginas del mismo capítulo) son un solo capítulo
  starts = starts.filter((s, i) => i === 0 || s.ch.tema !== starts[i - 1].ch.tema);
  return starts.map((s, i) => {
    const end = i + 1 < starts.length ? starts[i + 1].page : pages.length;
    const text = pages.slice(s.page, Math.max(end, s.page + 1)).join('\n');
    return { title: s.title.trim(), tema: s.ch.tema, tumor: s.ch.tumor, pages: [s.page + 1, Math.max(end, s.page + 1)], hash: hash(norm(text).replace(/\s+/g, ' ')), drugs: detectDrugs(text) };
  });
}

/* Informe de un pautado nuevo frente al anterior y frente a la app. Sólo huellas y nombres de fármacos: nunca texto del pautado. */
export function pautasReport(chapters, prevChapters, R) {
  const lines = [];
  const prevBy = new Map((prevChapters || []).map(c => [c.tema, c]));
  const changed = [], added = [];
  for (const c of chapters) {
    const p = prevBy.get(c.tema);
    if (!p) added.push(c); else if (p.hash !== c.hash) changed.push(c);
  }
  if (prevChapters) {
    lines.push(`- Capítulos que cambiaron: ${changed.length ? changed.map(c => `${c.tema} (p. ${c.pages[0]}–${c.pages[1]})`).join('; ') : 'ninguno'}.`);
    if (added.length) lines.push(`- Capítulos nuevos: ${added.map(c => c.tema).join('; ')}.`);
  } else lines.push(`- Primera lectura del pautado: ${chapters.length} capítulos reconocidos.`);
  const covered = new Set(Object.keys(R.pathways));
  const byTumor = {};
  for (const c of chapters) if (c.tumor && covered.has(c.tumor)) {
    byTumor[c.tumor] = byTumor[c.tumor] || new Set();
    c.drugs.forEach(d => byTumor[c.tumor].add(d));
  }
  const gaps = [];
  for (const [tid, drugs] of Object.entries(byTumor)) {
    const have = new Set(detectDrugs(appText(R, tid)).map(drugKey));
    const miss = [...new Map([...drugs].filter(d => !have.has(drugKey(d))).map(d => [drugKey(d), d])).values()].sort();
    if (miss.length) gaps.push(`  - **${R.pathways[tid].title}**: ${miss.join(', ')}`);
  }
  if (gaps.length) lines.push('- Fármacos que nombra el pautado y no aparecen en la vía de la app (posible conducta nueva, a evaluar: el pautado también nombra fármacos que desaconseja):', ...gaps);
  const uncovered = [...new Set(chapters.filter(c => !c.tumor || !covered.has(c.tumor)).map(c => c.tema))];
  if (uncovered.length) lines.push(`- Temas del pautado que la app no cubre (candidatos a tumor nuevo, siempre como borrador): ${uncovered.join('; ')}.`);
  return { lines, changedTumors: [...new Set(changed.map(c => c.tumor).filter(Boolean))] };
}

/* Citas al pautado en el contenido: [{where, name, url, edicion|null}] y citas a portadas genéricas. */
export function citations(R) {
  const refs = [];
  for (const [tid, pw] of Object.entries(R.pathways || {}))
    for (const [id, n] of Object.entries(pw.nodes)) if (n.type === 'rec')
      n.items.forEach((it, i) => (it.refs || []).forEach(r => refs.push({ ...r, where: `${tid}/${id}#${i}`, label: it.label })));
  for (const [id, rg] of Object.entries(R.regimens || {})) (rg.refs || []).forEach(r => refs.push({ ...r, where: `régimen ${id}`, label: rg.name }));
  const pautas = refs.filter(r => /pautas/i.test(r.name || '')).map(r => ({ ...r, edicion: ((r.name || '').match(/\b(20\d\d)\b/) || [])[1] || null }));
  const generic = refs.filter(r => { if (!r.url || r.pmid || r.nct) return false; try { return /^\/?$/.test(new URL(r.url).pathname); } catch { return true; } });
  return { pautas, generic };
}
