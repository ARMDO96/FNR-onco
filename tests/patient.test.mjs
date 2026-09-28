// Ventana de riesgo de fiebre en quimioterapia (TRASPASO.md §3): día 5 a 14 desde la fecha del ítem de
// quimioterapia (coordinado o realizado). Función pura en app/ciclo.js, expuesta en R.patient.ventanaFiebre.
import test from 'node:test';
import assert from 'node:assert/strict';
import { load } from '../tools/load.mjs';

const R = load();
const dia = n => new Date(Date.UTC(2026, 0, 15, 12, 0, 0) + n * 86400000).toISOString();
const AHORA = new Date(dia(0));

test('ventanaFiebre: antes del día 5, no', () => {
  assert.equal(R.patient.ventanaFiebre(dia(-4), AHORA), false);
});

test('ventanaFiebre: día 5, sí (borde inferior)', () => {
  assert.equal(R.patient.ventanaFiebre(dia(-5), AHORA), true);
});

test('ventanaFiebre: día 10, sí (dentro de la ventana)', () => {
  assert.equal(R.patient.ventanaFiebre(dia(-10), AHORA), true);
});

test('ventanaFiebre: día 14, sí (borde superior)', () => {
  assert.equal(R.patient.ventanaFiebre(dia(-14), AHORA), true);
});

test('ventanaFiebre: día 15, no (ya pasó la ventana)', () => {
  assert.equal(R.patient.ventanaFiebre(dia(-15), AHORA), false);
});

test('ventanaFiebre: quimio todavía no sucedió (fecha futura), no', () => {
  assert.equal(R.patient.ventanaFiebre(dia(3), AHORA), false);
});

test('ventanaFiebre: sin fecha de ciclo, no (y no rompe)', () => {
  assert.equal(R.patient.ventanaFiebre(null, AHORA), false);
  assert.equal(R.patient.ventanaFiebre(undefined, AHORA), false);
  assert.equal(R.patient.ventanaFiebre('', AHORA), false);
});

test('ventanaFiebre: fecha inválida no rompe', () => {
  assert.equal(R.patient.ventanaFiebre('no-es-una-fecha', AHORA), false);
});

test('ventanaFiebre: acepta "ahora" como string ISO además de Date', () => {
  assert.equal(R.patient.ventanaFiebre(dia(-7), dia(0)), true);
});
