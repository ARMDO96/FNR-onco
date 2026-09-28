import test from 'node:test';
import assert from 'node:assert/strict';
import { load } from '../tools/load.mjs';

const R = load();
const E = R.engine;
const item = { label: 'Osimertinib 80 mg/día', level: 'A', refs: [{ name: 'FLAURA', pmid: '29151359' }], cov: { t: 'FNR', ind: 'u-osi' }, regimen: 'x' };
const reg = { name: 'Osimertinib', cycle: 'continuo', drugs: [{ name: 'Osimertinib', dose: { type: 'flat', value: 80 } }] };
const clone = x => JSON.parse(JSON.stringify(x));

test('huella: cambia con dosis, cobertura o cita; no con el orden de las claves', () => {
  const h = E.fingerprint(item, reg);
  const r2 = clone(reg); r2.drugs[0].dose.value = 40;
  assert.notEqual(E.fingerprint(item, r2), h, 'dosis');
  assert.notEqual(E.fingerprint({ ...item, cov: { t: '?' } }, reg), h, 'cobertura');
  assert.notEqual(E.fingerprint({ ...item, refs: [{ name: 'FLAURA', pmid: '1' }] }, reg), h, 'cita');
  const reordered = { cov: item.cov, refs: item.refs, level: item.level, regimen: item.regimen, label: item.label };
  assert.equal(E.fingerprint(reordered, reg), h, 'orden de claves');
});

test('estado: doble aprobación, caducidad por cambio y por tiempo, objeción, retiro y conflicto de interés', () => {
  const ri = { key: 'pulm/n#0', hash: E.fingerprint(item, reg) };
  const ok = (role, date, extra) => ({ item: ri.key, hash: ri.hash, role, date, decision: 'aprobar', ...extra });
  assert.equal(E.itemStatus(ri, [], '2026-10-01').state, 'pendiente');
  assert.equal(E.itemStatus(ri, [ok('editor', '2026-10-01')], '2026-10-02').state, 'parcial');
  const both = E.itemStatus(ri, [ok('editor', '2026-10-01'), ok('segundo', '2026-10-05')], '2026-10-06');
  assert.equal(both.state, 'revisado'); assert.equal(both.expires, '2027-10-05');
  assert.equal(E.itemStatus(ri, [ok('editor', '2026-10-01'), ok('segundo', '2026-10-05')], '2027-10-06').state, 'caducado', 'vence a los 12 meses');
  assert.equal(E.itemStatus({ ...ri, hash: 'otro' }, [ok('editor', '2026-10-01'), ok('segundo', '2026-10-05')], '2026-10-06').state, 'caducado', 'contenido cambiado');
  assert.equal(E.itemStatus(ri, [ok('editor', '2026-10-01'), ok('segundo', '2026-10-05', { decision: 'objetar' })], '2026-10-06').state, 'discusion');
  assert.equal(E.itemStatus(ri, [ok('editor', '2026-10-01', { decision: 'retirar' })], '2026-10-06').state, 'retirado');
  assert.equal(E.itemStatus(ri, [ok('editor', '2026-10-01'), ok('segundo', '2026-10-05', { coi: true })], '2026-10-06').state, 'parcial', 'con conflicto no cuenta');
  assert.equal(E.itemStatus(ri, [ok('editor', '2026-10-01'), ok('editor', '2026-10-02')], '2026-10-06').state, 'parcial', 'el mismo rol no cuenta dos veces');
  assert.equal(E.itemStatus(ri, [ok('segundo', '2026-10-01', { decision: 'objetar' }), ok('editor', '2026-10-02'), ok('segundo', '2026-10-09')], '2026-10-10').state, 'revisado', 'vale la última decisión de cada rol');
});

test('un tumor sólo está completo con todos sus ítems revisados', () => {
  const pw = R.pathways.pulm;
  const items = E.reviewItems('pulm', pw, R.regimens);
  const all = r => items.map(ri => ({ item: ri.key, hash: ri.hash, role: r, date: '2026-10-01', decision: 'aprobar' }));
  assert.equal(E.tumorReview('pulm', pw, R.regimens, all('editor'), '2026-10-02').complete, false);
  const decisions = all('editor').concat(all('segundo'));
  assert.equal(E.tumorReview('pulm', pw, R.regimens, decisions, '2026-10-02').complete, true);
  assert.equal(E.tumorReview('pulm', pw, R.regimens, decisions.slice(1), '2026-10-02').complete, false);
});
