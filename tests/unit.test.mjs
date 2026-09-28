import test from 'node:test';
import assert from 'node:assert/strict';
import { load } from '../tools/load.mjs';

// Los objetos vienen de otro contexto (vm): se comparan por contenido.
const plain = x => JSON.parse(JSON.stringify(x));

const R = load();

test('estadificación: casos de referencia', () => {
  const cases = [
    ['pulm', { T: 'T1b', N: 'N1', M: 'M0' }, 'IIA'], ['pulm', { T: 'T2a', N: 'N1', M: 'M0' }, 'IIB'],
    ['pulm', { T: 'T1c', N: 'N2a', M: 'M0' }, 'IIB'], ['pulm', { T: 'T2b', N: 'N2a', M: 'M0' }, 'IIIA'],
    ['pulm', { T: 'T1a', N: 'N2b', M: 'M0' }, 'IIIA'], ['pulm', { T: 'T3', N: 'N2b', M: 'M0' }, 'IIIB'],
    ['pulm', { T: 'T4', N: 'N3', M: 'M0' }, 'IIIC'], ['pulm', { T: 'T1a', N: 'N0', M: 'M1c2' }, 'IVB'],
    ['mama', { T: 'T0', N: 'N1mi', M: 'M0' }, 'IB'], ['mama', { T: 'T0', N: 'N1', M: 'M0' }, 'IIA'],
    ['mama', { T: 'T0', N: 'N2', M: 'M0' }, 'IIIA'], ['mama', { T: 'T4d', N: 'N0', M: 'M0' }, 'IIIB'],
    ['mama', { T: 'T2', N: 'N3', M: 'M0' }, 'IIIC'],
    ['ccr', { T: 'T4b', N: 'N0', M: 'M0' }, 'IIC'], ['ccr', { T: 'T2', N: 'N2a', M: 'M0' }, 'IIIB'],
    ['ccr', { T: 'T3', N: 'N0', M: 'M1c' }, 'IVC'],
    ['pros', { T: 'T1c', N: 'N0', M: 'M0', PSA: 'lt10', GG: 'GG1' }, 'I'],
    ['pros', { T: 'T2c', N: 'N0', M: 'M0', PSA: 'lt10', GG: 'GG1' }, 'IIA'],
    ['pros', { T: 'T3a', N: 'N0', M: 'M0', PSA: 'lt10', GG: 'GG2' }, 'IIIB'],
    ['pros', { T: 'T1c', N: 'N0', M: 'M0', PSA: 'ge20', GG: 'GG2' }, 'IIIA'],
    ['pros', { T: 'T2a', N: 'N0', M: 'M0', PSA: 'lt10', GG: 'GG5' }, 'IIIC'],
    ['ccu', { FIGO: 'IIIB', N: 'IIIC1' }, 'IIIC1'], ['ccu', { FIGO: 'IB2', N: 'N0' }, 'IB2'],
    ['ccu', { FIGO: 'IVA', N: 'IIIC2' }, 'IVA'],
  ];
  for (const [t, sel, want] of cases) assert.equal(R.staging[t].stage(sel).stage, want, `${t} ${JSON.stringify(sel)}`);
});

test('calculadoras: valores conocidos', () => {
  const p = { peso: '70', talla: '170', edad: '60', sexo: 'M', creat: '1' };
  assert.equal(R.calc.bsa(p).toFixed(2), '1.82');                          // Mosteller
  assert.equal(R.calc.crcl(p).toFixed(1), '77.8');                         // Cockcroft-Gault hombre
  assert.equal(R.calc.crcl({ ...p, sexo: 'F' }).toFixed(1), '66.1');      // ×0,85 en mujeres
  assert.equal(Math.round(R.calc.calvert(5, p)), 514);                     // AUC 5 × (77,8 + 25)
  assert.equal(R.calc.calvert(5, { ...p, creat: '0.4' }), 5 * 150);        // TFG topeada en 125
  assert.equal(R.calc.bsa({ peso: '70,5', talla: '170' }).toFixed(3), Math.sqrt(70.5 * 170 / 3600).toFixed(3)); // coma decimal
  assert.equal(R.calc.crcl({ ...p, sexo: '' }), null);
  assert.deepEqual(plain(R.calc.dose({ dose: { type: 'm2', value: 75 } }, {})), { missing: 'peso y talla' });
  assert.equal(Math.round(R.calc.dose({ dose: { type: 'm2', value: 75 } }, p).mg), Math.round(75 * R.calc.bsa(p)));
});

test('motor: recorrido, sugerencia por estadio y validación', () => {
  const pw = { start: 'a', nodes: {
    a: { type: 'q', text: '¿?', options: [{ label: 'x', next: 'r', stages: ['I'] }, { label: 'y', next: 'r2', stages: ['IV'] }] },
    r: { type: 'rec', title: 't', items: [{ label: 'L', level: 'A', refs: [{ name: 'E', pmid: '1' }], cov: { t: 'FTM' } }], next: [{ label: 'sigue', next: 'r2' }] },
    r2: { type: 'rec', title: 't2', items: [{ label: 'Cirugía', cov: { t: 'NA' } }] } } };
  assert.equal(R.engine.walk(pw, {}, 'IV').current.suggested, 1);
  const w = R.engine.walk(pw, { a: 0, r: 0 }, 'I');
  assert.deepEqual(plain(w.steps.map(s => s.id)), ['a', 'r', 'r2']);
  assert.equal(w.end, true);
  assert.deepEqual(plain(R.engine.check(pw, { fnrInds: [], regimens: {} })), []);
  const bad = structuredClone(pw); bad.nodes.r2.next = [{ label: 'vuelta', next: 'a' }]; bad.nodes.r.items[0].cov = { t: 'FNR', ind: 'no-existe' };
  const errs = R.engine.check(bad, { fnrInds: [], regimens: {} });
  assert.ok(errs.some(e => e.includes('ciclo')));
  assert.ok(errs.some(e => e.includes('no-existe')));
});

test('contenido: toda vía pasa la validación estructural', () => {
  const fnrInds = R.fnr.TUMORS.flatMap(t => t.inds.map(i => i.id));
  for (const [tid, pw] of Object.entries(R.pathways || {})) {
    assert.deepEqual(plain(R.engine.check(pw, { fnrInds, regimens: R.regimens || {} })), [], `vía ${tid}`);
  }
});
