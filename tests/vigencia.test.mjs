import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { spawnSync } from 'node:child_process';
import { load, ROOT } from '../tools/load.mjs';
import { extractLinks, docLinks, tagTumors, detectDrugs, drugKey, chapterOf, splitChapters, pautasReport, citations, SOURCES } from '../tools/vigilancia.mjs';

const R = load();
const FIX = path.join(ROOT, 'tests/fixtures/vigencia');

test('enlaces: rutas relativas a absolutas, sin repetir, y documentos', () => {
  const html = '<a href="/a.pdf">A</a> <a class="x" href=\'b/c.docx?v=2\'>B <b>c</b></a> <a href="/a.pdf">A otra vez</a> <a href="/p">P</a>';
  const l = extractLinks(html, 'https://ej.uy/dir/');
  assert.deepEqual(l.map(x => x.href), ['https://ej.uy/a.pdf', 'https://ej.uy/dir/b/c.docx?v=2', 'https://ej.uy/p']);
  assert.equal(l[1].text, 'B c');
  assert.deepEqual(docLinks(html, 'https://ej.uy/dir/'), ['https://ej.uy/a.pdf', 'https://ej.uy/dir/b/c.docx?v=2']);
});

test('filtros de las fuentes sobre los fixtures', () => {
  const pick = id => { const s = SOURCES.find(s => s.id === id); return extractLinks(fs.readFileSync(path.join(FIX, `${id}.html`), 'utf8'), s.url).filter(s.filter); };
  assert.equal(pick('fda').length, 2);
  assert.equal(pick('ema').length, 1);
  assert.equal(pick('esmo').length, 2);
});

test('etiquetado por tumor: el pulmón de la app es no microcítico', () => {
  assert.deepEqual(tagTumors('FDA approves X for non-small cell lung cancer'), ['pulm']);
  assert.deepEqual(tagTumors('FDA approves X for extensive-stage small cell lung cancer'), []);
  assert.deepEqual(tagTumors('HER2-positive breast cancer and metastatic colorectal cancer'), ['mama', 'ccr']);
  assert.deepEqual(tagTumors('Cáncer de próstata resistente a la castración'), ['pros']);
  assert.deepEqual(tagTumors('multiple myeloma'), []);
});

test('fármacos: diccionario, sufijos y tildes', () => {
  const d = detectDrugs('FOLFIRI (irinotecán, 5-fluorouracilo, leucovorina) con cetuximab; nuevo: zanidatamab. Mesa de trabajo.');
  for (const x of ['irinotecan', 'fluorouracilo', 'leucovorina', 'cetuximab', 'zanidatamab']) assert.ok(d.includes(x), x);
  assert.ok(!d.includes('mesa'));
  assert.ok(!detectDrugs('fluorouracilo').includes('fluorouracil'), 'la variante inglesa no se confunde con la española');
  for (const [a, b] of [['capecitabine', 'capecitabina'], ['epirrubicina', 'epirubicina'], ['letrozole', 'letrozol'], ['exemestane', 'exemestano'], ['vinorelbine', 'vinorelbina']])
    assert.equal(drugKey(a), drugKey(b), `${a} y ${b} se comparan como el mismo fármaco`);
  assert.notEqual(drugKey('palbociclib'), drugKey('ribociclib'));
});

test('mapa de capítulos: lo específico gana', () => {
  assert.equal(chapterOf('Cáncer de pulmón no microcítico').tumor, 'pulm');
  assert.equal(chapterOf('Carcinoma de pulmón no de células pequeñas').tumor, 'pulm');
  assert.equal(chapterOf('Cáncer de pulmón microcítico').tumor, null);
  assert.equal(chapterOf('Cáncer de mama asociado al embarazo').tema, 'Mama asociado al embarazo');
  assert.equal(chapterOf('CÁNCER DE MAMA').tumor, 'mama');
  assert.equal(chapterOf('Cáncer de recto').tumor, 'ccr');
  assert.equal(chapterOf('Introducción').candidato, false, 'la introducción corta capítulos pero no es un tumor');
  assert.equal(chapterOf('Otro tema cualquiera'), null);
  // títulos reales del índice del pautado 2025
  assert.equal(chapterOf('CÁNCER DE CUELLO DE UTERO').tumor, 'ccu');
  assert.equal(chapterOf('CÁNCER DE REGION ANAL').tema, 'Canal anal');
  assert.equal(chapterOf('CÁNCER DE A PULMON A CELULAS PEQUEÑAS').tema, 'Pulmón microcítico');
  assert.equal(chapterOf('CÁNCER DE PULMON CELULAS NO PEQUEÑAS').tumor, 'pulm');
  assert.equal(chapterOf('TUMORES DE PIEL NO MELANOMA').tema, 'Piel no melanoma');
});

test('capítulos: por índice del PDF y por títulos de página', () => {
  const pages = ['Cáncer de mama\ntrastuzumab', 'más mama: palbociclib', 'Cáncer de pulmón no microcítico\nosimertinib', 'Cáncer renal\ncabozantinib'];
  const byOutline = splitChapters(pages, [{ title: 'Cáncer de mama', page: 0 }, { title: 'Mama HER2', page: 1 }, { title: 'Cáncer de pulmón', page: 2 }, { title: 'Cáncer renal', page: 3 }]);
  assert.deepEqual(byOutline.map(c => [c.tema, c.pages]), [['Mama', [1, 2]], ['Pulmón no microcítico', [3, 3]], ['Riñón', [4, 4]]]);
  assert.deepEqual(byOutline[0].drugs, ['palbociclib', 'trastuzumab']);
  const byPages = splitChapters(pages, []);
  assert.deepEqual(byPages.map(c => c.tema), ['Mama', 'Pulmón no microcítico', 'Riñón']);
  assert.ok(!JSON.stringify(byOutline).includes('más mama'), 'no guarda texto del pautado');
  assert.equal(byOutline.method, 'indice'); assert.equal(byPages.method, 'paginas');
  // un título del índice sin tema corta el capítulo anterior: sus fármacos no se atribuyen a colorrecto
  const anal = splitChapters(['Cáncer de colon\ncetuximab', 'Otro capítulo\nmitomicina', 'Cáncer renal\ncabozantinib'],
    [{ title: 'Cáncer de colon', page: 0 }, { title: 'Otro capítulo', page: 1 }, { title: 'Cáncer renal', page: 2 }]);
  assert.deepEqual(anal.map(c => [c.tema, c.pages, c.drugs]), [['Colon y recto', [1, 1], ['cetuximab']], ['Riñón', [3, 3], ['cabozantinib']]]);
  assert.deepEqual(anal.unmapped, ['Otro capítulo']);
  // los subtítulos (nivel más profundo) no cortan el capítulo
  const deep = splitChapters(['Cáncer de mama', 'Adyuvancia\npalbociclib', 'Cáncer renal'],
    [{ title: 'Cáncer de mama', page: 0, depth: 0 }, { title: 'Adyuvancia', page: 1, depth: 1 }, { title: 'Cáncer renal', page: 2, depth: 0 }]);
  assert.deepEqual(deep.map(c => [c.tema, c.pages]), [['Mama', [1, 2]], ['Riñón', [3, 3]]]);
});

test('informe del pautado: cambios, fármacos ausentes y temas no cubiertos', () => {
  const ch = JSON.parse(fs.readFileSync(path.join(FIX, 'pautas-chapters.json'), 'utf8'));
  const first = pautasReport(ch, null, R).lines.join('\n');
  assert.match(first, /Primera lectura/);
  assert.match(first, /inavolisib/, 'fármaco del pautado ausente en la vía de mama');
  assert.doesNotMatch(first, /tamoxifeno/, 'tamoxifeno ya está en la app');
  assert.match(first, /Riñón/);
  const changed = ch.map(c => c.tema === 'Mama' ? { ...c, hash: 'otro' } : c);
  const rep = pautasReport(changed, ch, R);
  assert.match(rep.lines[0], /Mama/);
  assert.deepEqual(rep.changedTumors, ['mama']);
});

test('citas: edición del pautado y portadas genéricas', () => {
  const { pautas, generic } = citations(R);
  assert.ok(pautas.length > 0);
  assert.ok(pautas.every(r => r.edicion === null || /^20\d\d$/.test(r.edicion)));
  assert.ok(generic.every(r => /^https?:\/\/[^/]+\/?$/.test(r.url)));
});

test('vigencia sin red: cada novedad se reporta una sola vez', () => {
  const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'vig-'));
  const fix = path.join(tmp, 'fix'); fs.cpSync(FIX, fix, { recursive: true });
  const snap = path.join(tmp, 'snap.json');
  const run = () => spawnSync(process.execPath, [path.join(ROOT, 'tools/vigencia.mjs')], { env: { ...process.env, VIGENCIA_FIXTURES: fix, VIGENCIA_SNAPSHOT: snap }, encoding: 'utf8' });

  let r = run(); // primera corrida: referencia de las listas y análisis inicial del pautado
  assert.equal(r.status, 3, r.stdout + r.stderr);
  assert.match(r.stdout, /Archivos leídos: PAUTAS-ONCOLOGIA-MEDICA-2025\.pdf .*; Actualizacion-mama-HER2\.pdf/, 'la edición más reciente y la actualización subida después');
  assert.doesNotMatch(r.stdout, /2023-final|afiche/, 'ni la edición vieja ni otros PDF del mismo mes');
  assert.match(r.stdout, /FDA: aprobaciones en oncología: primera instantánea/);
  let st = JSON.parse(fs.readFileSync(snap, 'utf8'));
  assert.equal(st.pautas.chapters.find(c => c.tema === 'Mama').hash, 'bbbb000000000001', 'el capítulo de la actualización reemplaza al de la edición');
  assert.equal(st.pautas.chapters.find(c => c.tema === 'Riñón').hash, 'aaaa000000000003', 'los demás capítulos se conservan');

  r = run(); // sin cambios: nada que reportar
  assert.equal(r.status, 0, r.stdout);

  // un PDF nuevo de un tema: sólo cambia ese capítulo
  fs.writeFileSync(path.join(fix, 'pautas.html'), fs.readFileSync(path.join(fix, 'pautas.html'), 'utf8').replace('</body>',
    '<a href="https://oncologiamedica.hc.edu.uy/wp-content/uploads/2027/03/Actualizacion-pulmon.pdf">Pulmón</a></body>'));
  fs.writeFileSync(path.join(fix, 'pautas-chapters-Actualizacion-pulmon.json'), JSON.stringify([
    { title: 'Pulmón', tema: 'Pulmón no microcítico', tumor: 'pulm', pages: [1, 9], hash: 'cccc000000000001', drugs: ['osimertinib', 'zongertinib'] }]));
  r = run();
  assert.equal(r.status, 3);
  assert.match(r.stdout, /Capítulos que cambiaron: Pulmón no microcítico/);
  assert.match(r.stdout, /zongertinib/);
  r = run();
  assert.equal(r.status, 0, r.stdout);

  fs.writeFileSync(path.join(fix, 'fda.html'), fs.readFileSync(path.join(fix, 'fda.html'), 'utf8').replace('</ul>',
    '<li><a href="/drugs/resources-information-approved-drugs/fda-approves-new-drug-her2-breast-cancer-example">FDA approves new drug for HER2-positive breast cancer (ejemplo)</a></li></ul>'));
  fs.writeFileSync(path.join(fix, 'ema.html'), '<a href="/en/news/meeting-highlights-committee-medicinal-products-human-use-chmp-example-2026-b">CHMP highlights b</a>');
  r = run();
  assert.equal(r.status, 3);
  assert.match(r.stdout, /FDA: aprobaciones en oncología\*\*: 1 novedades/);
  assert.match(r.stdout, /Cáncer de mama/);
  assert.match(r.stdout, /EMA: reuniones del CHMP\*\*: 1 novedades/, 'la página seguida menciona mama');

  r = run(); // ya reportadas
  assert.equal(r.status, 0, r.stdout);

  fs.writeFileSync(path.join(fix, 'esmo.html'), '<p>página rediseñada</p>');
  r = run();
  assert.equal(r.status, 3);
  assert.match(r.stdout, /el filtro no encontró ningún enlace/);
  assert.equal(JSON.parse(fs.readFileSync(snap, 'utf8')).sources.esmo.items.length, 2, 'conserva la referencia anterior');
});
