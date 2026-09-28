// Prueba de punta a punta en Chromium: ficha → estadio → tratamiento → requisitos FNR, sin conexión y datos dañados.
import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import assert from 'node:assert/strict';
import os from 'node:os';
import { execFileSync } from 'node:child_process';
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
  await step('pantalla inicial: nombre, banda DEMO y aviso de emergencia', async () => {
    assert.equal(await page.title(), 'App para el Cáncer');
    assert.ok(await page.isVisible('#entry'));
    assert.match(await page.textContent('#demo-band'), /DEMO/);
    assert.match(await page.textContent('#entry .sos'), /911/);
    await page.click('[data-role="doctor"]');
    assert.ok(await page.isVisible('#gate'));
  });
  await step('abrir ficha', async () => {
    await page.fill('#pid-input', '1.234.567-8'); await page.click('#pid-go');
    assert.equal(await page.textContent('#pbar b'), '12345678');
  });
  await step('estadificar pulmón', async () => {
    await page.click('.tt[data-t="pulm"]'); await page.click('#tab-tnm');
    await page.click('.opt[data-ax="HIST"][data-v="CPNCP"]');
    for (const [a, v] of [['T', 'T2a'], ['N', 'N0'], ['M', 'M1c2']]) await page.click(`.opt[data-ax="${a}"][data-v="${v}"]`);
    assert.equal((await page.textContent('.st-val')).trim(), 'IVB');
  });
  await step('histología de pulmón condiciona el tratamiento; ccu tiene evaluación inicial separada', async () => {
    // células pequeñas: tarjeta en vez de vía, sin preguntas de tratamiento
    await page.click('.opt[data-ax="HIST"][data-v="CPCP"]');
    await page.click('#tab-tx');
    assert.match(await page.textContent('.empty h4'), /células pequeñas/);
    assert.equal(await page.locator('.qopt').count(), 0);
    // volver a células no pequeñas: se restaura la vía de tratamiento
    await page.click('#tab-tnm');
    await page.click('.opt[data-ax="HIST"][data-v="CPNCP"]');
    await page.click('#tab-tx');
    await page.waitForSelector('.qopt');
    // cuello uterino: la evaluación inicial aparece como tarjeta en Estadio (no como paso del tratamiento)
    await page.click('.tt[data-t="ccu"]'); await page.click('#tab-tnm');
    await page.waitForSelector('details.workup');
    assert.match(await page.textContent('details.workup summary'), /Evaluación inicial/);
    await page.click('#tab-tx');
    await page.waitForSelector('.qopt');
    assert.ok(!(await page.textContent('#v-tx')).includes('Evaluación inicial'), 'la vía de ccu no arranca con la evaluación inicial');
    // dejar el tumor en pulmón con CPNCP para no romper los pasos siguientes
    await page.click('.tt[data-t="pulm"]');
  });
  const hasPw = await page.evaluate(() => !!(window.FNRO.pathways || {}).pulm);
  if (hasPw) {
    await step('tratamiento: la guía sugiere la opción del estadio', async () => {
      await page.click('#tab-tx');
      await page.waitForSelector('.qopt');
      // avanzar siguiendo la sugerida o la primera opción hasta llegar a una recomendación con ítems
      // (acotado a #v-tx: la tarjeta de evaluación inicial en Estadio también usa .rx, aunque esté oculta)
      for (let i = 0; i < 12 && !(await page.$('#v-tx .rx')); i++) {
        const sug = await page.$('.qopt.sug'); await (sug || (await page.$('.qopt'))).click();
      }
      assert.ok(await page.$('#v-tx .rx'), 'se llegó a una recomendación');
    });
    await step('elegir plan y copiarlo', async () => {
      await page.click('#v-tx .rx [data-pick]');
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
    await step('sincronizar Requisitos FNR con el plan elegido (mejora 1)', async () => {
      // el plan recién elegido en Tratamiento debe verse, sin más clics, en la pestaña Requisitos FNR
      const planLabel = (await page.textContent('.plan b')).trim();
      const indTitle = await page.evaluate((label) => {
        const pw = window.FNRO.pathways.pulm;
        let ind;
        for (const nid in pw.nodes) {
          const n = pw.nodes[nid];
          if (n.type !== 'rec') continue;
          const it = n.items.find((i) => i.label === label);
          if (it && it.cov && it.cov.t === 'FNR') { ind = it.cov.ind; break; }
        }
        const t = window.FNRO.fnr.TUMORS.find((x) => x.id === 'pulm');
        return t.inds.find((i) => i.id === ind).title;
      }, planLabel);
      await page.click('#tab-fnr');
      assert.equal(await page.textContent('#i-title'), indTitle, 'Requisitos FNR muestra la indicación del plan recién elegido, no una por defecto');
      assert.equal(await page.locator('#fnr-sync .warn').count(), 0, 'sin aviso mientras se ve la indicación del plan elegido');
      // cambiar a otra indicación del mismo tumor no debe desincronizar en silencio: tiene que avisar
      await page.locator('#picker .chip:not([aria-pressed="true"])').first().click();
      await page.waitForSelector('#fnr-sync .warn');
      assert.match(await page.textContent('#fnr-sync'), /tu plan elegido es/);
      await page.click('#fnr-goplan');
      assert.equal(await page.textContent('#i-title'), indTitle, 'el botón "Ver requisitos del plan" vuelve a la indicación del plan');
      assert.equal(await page.locator('#fnr-sync .warn').count(), 0, 'el aviso desaparece al volver a la indicación del plan');
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
  await step('paciente: ingreso, fecha, confirmación y alarma de fiebre', async () => {
    await page.goto(URL0);
    await page.click('#gate [data-role-reset]');
    await page.click('[data-role="paciente"]');
    await page.fill('#pt-ci', '1.234.567-3'); await page.click('[data-pt="pedir"]');
    assert.match(await page.textContent('#pt-err'), /verificador/, 'rechaza cédula con dígito incorrecto');
    await page.fill('#pt-ci', '1.234.567-2'); await page.click('[data-pt="pedir"]');
    await page.fill('#pt-cod', '000000'); await page.click('[data-pt="verificar"]');
    assert.match(await page.textContent('#pt-err'), /no es válido/);
    await page.fill('#pt-cod', '123456'); await page.click('[data-pt="verificar"]');
    assert.match(await page.textContent('.pt-top h1'), /Hola/);
    // La quimio de la demo está coordinada para dentro de unos días (app/demo.js: dia(3)): todavía no
    // entró en la ventana de riesgo (día 5 a 14 desde la sesión, TRASPASO §3), así que hoy se ve sólo el
    // recordatorio discreto, no el aviso fijo.
    assert.equal(await page.locator('.alarm.card').count(), 0, 'fuera de la ventana: sin aviso fijo de fiebre');
    assert.match(await page.textContent('#patient'), /Si tenés fiebre/, 'recordatorio discreto de fiebre siempre visible');
    await page.click('.todo');
    await page.fill('input[type="datetime-local"]', '2026-10-05T08:30'); await page.click('[data-pt-fecha]');
    assert.match(await page.textContent('#patient'), /Coordinado/);
    assert.match(await page.textContent('#toast'), /Fecha guardada: .*octubre/i, 'el toast repite la fecha en español');
    assert.match(await page.textContent('#patient'), /Agregar a mi calendario/, 'botón para descargar el .ics del ítem coordinado');
    await page.click('[data-pt-view="sintomas"]'); await page.click('[data-pt-sym="fiebre"]');
    assert.match(await page.textContent('.alarm.big'), /emergencia/);
    assert.match(await page.getAttribute('.alarm.big a[href="tel:911"]', 'href'), /tel:911/, 'llamar al 911 es un enlace tel:');
  });
  await step('doctor: la bandeja muestra la alarma y la fecha con hora', async () => {
    await page.click('#patient [data-role-reset]'); await page.click('[data-role="doctor"]');
    assert.match(await page.textContent('.dash-alarm'), /1 alarma/);
    assert.match(await page.textContent('.inbox'), /Coordinó/);
    await page.click('[data-dash-visto]');
    assert.equal(await page.locator('.inbox li').count(), 1, 'queda sólo lo no visto');
  });
  await step('modo revisión: aprobar, exportar e incorporar al registro', async () => {
    await page.goto(URL0);
    await page.click('#about summary'); await page.click('#rv-open');
    await page.selectOption('#rv-role', 'editor'); await page.fill('#rv-name', 'Revisor de prueba'); await page.fill('#rv-coi', 'ninguno');
    await page.click('#rv-start');
    await page.click('[data-rvt="pulm"]');
    const card = page.locator('.rv-item').first();
    // aprobar sin controles no alcanza
    await card.locator('[data-dec="aprobar"]').click();
    assert.ok(await page.locator('.rv-item').first().locator('.rv-miss').count());
    for (const box of await page.locator('.rv-item').first().locator('input[data-ck]:not([data-ck="coi"])').all()) await box.check();
    await page.click('#rv-export');
    const out = JSON.parse(await page.inputValue('#rv-json'));
    assert.equal(out.role, 'editor'); assert.equal(out.decisions.length, 1); assert.equal(out.decisions[0].decision, 'aprobar');
    // incorporar el archivo en una copia del repositorio y comprobar el estado
    const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'fnro-'));
    for (const d of ['app', 'content', 'tools']) fs.cpSync(path.join(ROOT, d), path.join(tmp, d), { recursive: true });
    fs.writeFileSync(path.join(tmp, 'rev.json'), JSON.stringify(out));
    const log = execFileSync('node', ['tools/apply-review.mjs', 'rev.json'], { cwd: tmp }).toString();
    assert.match(log, /1 decisiones nuevas/);
    const again = execFileSync('node', ['tools/apply-review.mjs', 'rev.json'], { cwd: tmp }).toString();
    assert.match(again, /0 decisiones nuevas/, 'no duplica');
    const st = execFileSync('node', ['tools/review-status.mjs'], { cwd: tmp }).toString();
    assert.match(st, /pulmón[^\n]*1 con 1 de 2/);
    assert.match(fs.readFileSync(path.join(tmp, 'content/reviewers.js'), 'utf8'), /Revisor de prueba/);
    fs.rmSync(tmp, { recursive: true, force: true });
    await page.click('#rv-exit');
  });
  assert.deepEqual(errors, [], 'errores de consola: ' + errors.join(' | '));
  console.log('E2E OK');
} finally {
  await browser.close(); server.close();
}
