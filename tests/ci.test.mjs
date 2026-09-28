// Cédula uruguaya: dígito verificador (pesos 2-9-8-7-6-3-4) y entorno de la app (banda DEMO, falla cerrado).
import test from 'node:test';
import assert from 'node:assert/strict';
import { load } from '../tools/load.mjs';

const R = load();

test('cédula: dígito verificador', () => {
  assert.equal(R.ci.digito('1234567'), 2);
  assert.equal(R.ci.validar('1.234.567-2').ok, true);
  assert.equal(R.ci.validar('12345672').ci, '12345672');
  assert.equal(R.ci.validar('1.234.567-3').ok, false, 'dígito incorrecto');
  assert.equal(R.ci.validar('123').ok, false, 'muy corta');
  assert.equal(R.ci.validar('abc').ok, false);
  const siete = R.ci.validar(`765432${R.ci.digito('765432')}`); // cédula de 6 dígitos base + verificador
  assert.equal(siete.ok, true); assert.equal(siete.ci.length, 8, 'se completa con cero a la izquierda');
  assert.equal(R.ci.formatear('12345672'), '1.234.567-2');
});

test('entorno: la banda DEMO sólo se oculta con un proyecto de producción habilitado', () => {
  const orig = { ...R.config };
  try {
    assert.equal(R.esProduccion(), false, 'la configuración del repo es demo');
    Object.assign(R.config, { ENTORNO: 'produccion', SUPABASE_URL: 'https://abc123.supabase.co', PROYECTOS_PRODUCCION: [] });
    assert.equal(R.esProduccion(), false, 'producción sin proyecto habilitado sigue mostrando DEMO');
    R.config.PROYECTOS_PRODUCCION = ['abc123'];
    assert.equal(R.esProduccion(), true);
    R.config.SUPABASE_URL = 'https://otro.supabase.co';
    assert.equal(R.esProduccion(), false, 'otro proyecto');
  } finally { Object.assign(R.config, orig); }
});
