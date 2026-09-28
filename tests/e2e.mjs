// Prueba de punta a punta en Chromium: ficha → estadio → tratamiento → requisitos FNR, sin conexión y datos dañados.
import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import assert from 'node:assert/strict';
import { ROOT } from '../tools/load.mjs';

let pw;
try { pw = await import('playwright'); } catch { pw = await import('/opt/node22/lib/node_modules/playwright/index.mjs'); }
const { chromium } = pw;

const TYPES = { '.html': 'text/html', '.js': 'text/javascript', '.css': 'text/css', '.json': 'application/json',
  '.webmanifest': 'application/manifest+json', '.png': 'image/png', '.woff2': 'font/woff2' };
const server = http.createServer((req, res) => {
  let p = decodeURIComponent(new URL(req.url, 'http://x').pathname);
  if (p.endsWith('/')) p += 'index.html';
  const f = path.join(ROOT, p);
  if (!f.startsWith(ROOT) || !fs.existsSync(f)) { res.writeHead(404); return res.end(); }
  res.writeHead(200, { 'content-type': TYPES[path.extname(f)] || 'application/octet-stream' });
  fs.createReadStream(f).pipe(res);
}).listen(0);
const URL0 = `http://localhost:${server.address().port}/`;

const browser = await chromium.launch();
const errors = [];
const ctx = await browser.newContext({ viewport: { width: 390, height: 844 } });
const page = await ctx.newPage();
page.on('pageerror', e => errors.push(e.message));
page.on('console', m => { if (m.type() === 'error') errors.push(m.text()); });
const step = async (name, fn) => { try { await fn(); console.log('✓', name); } catch (e) { console.error('✗', name); throw e; } };

try {
  await page.goto(URL0);
  await step('abrir ficha', async () => {
    await page.fill('#pid-input', '1.234.567-8'); await page.click('#pid-go');
    assert.equal(await page.textContent('#pbar b'), '12345678');
  });
  await step('estadificar pulmón', async () => {
    await page.click('.tt[data-t="pulm"]'); await page.click('#tab-tnm');
    for (const [a, v] of [['T', 'T2a'], ['N', 'N0'], ['M', 'M1c2']]) await page.click(`.opt[data-ax="${a}"][data-v="${v}"]`);
    assert.equal((await page.textContent('.st-val')).trim(), 'IVB');
  });
  const hasPw = await page.evaluate(() => !!(window.FNRO.pathways || {}).pulm);
  if (hasPw) {
    await step('tratamiento: la guía sugiere la opción del estadio', async () => {
      await page.click('#tab-tx');
      await page.waitForSelector('.qopt');
      // avanzar siguiendo la sugerida o la primera opción hasta llegar a una recomendación con ítems
      for (let i = 0; i < 12 && !(await page.$('.rx')); i++) {
        const sug = await page.$('.qopt.sug'); await (sug || (await page.$('.qopt'))).click();
      }
      assert.ok(await page.$('.rx'), 'se llegó a una recomendación');
    });
    await step('elegir plan y copiarlo', async () => {
      await page.click('.rx [data-pick]');
      assert.ok(await page.$('.plan'));
    });
    await step('régimen con dosis calculadas', async () => {
      const b = await page.$('[data-open]');
      if (b) {
        await b.click();
        for (const [k, v] of [['peso', '70'], ['talla', '170'], ['edad', '60'], ['creat', '1']]) { await page.fill(`#pp-${k}`, v); await page.press(`#pp-${k}`, 'Tab'); }
        await page.selectOption('#pp-sexo', 'M');
        assert.match(await page.textContent('.derived'), /1\.82 m²/);
      }
    });
  }
  await step('requisitos FNR siguen funcionando', async () => {
    await page.click('#tab-fnr');
    await page.locator('#cols input[type=checkbox]').first().check();
    assert.match(await page.textContent('#meter-txt'), /^1 de/);
  });
  await step('botón atrás vuelve a la lista con el estadio', async () => {
    await page.goBack();
    assert.match(await page.textContent('#plist .pid'), /12345678/);
  });
  await step('funciona sin conexión', async () => {
    await page.reload(); await page.waitForFunction(() => navigator.serviceWorker.controller);
    await ctx.setOffline(true); await page.reload();
    assert.match(await page.textContent('#plist'), /12345678/);
    await ctx.setOffline(false);
  });
  await step('datos dañados no rompen la app', async () => {
    await page.evaluate(() => { const k = 'fnr-onco-patients-v1'; const s = JSON.parse(localStorage.getItem(k));
      s.patients['99'] = { tumor: 'NOEXISTE', view: 'tx', sel: {}, checks: {}, path: { NOEXISTE: { a: { x: 9 } } }, updatedAt: Date.now() };
      localStorage.setItem(k, JSON.stringify(s)); });
    await page.reload(); await page.fill('#pid-input', '99'); await page.click('#pid-go');
    assert.ok((await page.textContent('#band h2')).length > 0);
  });
  assert.deepEqual(errors, [], 'errores de consola: ' + errors.join(' | '));
  console.log('E2E OK');
} finally {
  await browser.close(); server.close();
}
