// Carga el contenido y las funciones puras de la app en un contexto aislado (sin navegador).
import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';

export const ROOT = path.resolve(path.dirname(new URL(import.meta.url).pathname), '..');

// Orden de carga: normativas, estadificación, regímenes, vías; luego funciones puras.
export function contentFiles() {
  const list = d => fs.existsSync(path.join(ROOT, d))
    ? fs.readdirSync(path.join(ROOT, d)).filter(f => f.endsWith('.js')).sort().map(f => `${d}/${f}`) : [];
  return ['content/fnr.js', 'content/staging.js', ...list('content/regimens'), ...list('content/pathways')];
}

export function load() {
  const ctx = { window: {}, console };
  vm.createContext(ctx);
  for (const f of [...contentFiles(), 'app/calc.js', 'app/engine.js']) {
    vm.runInContext(fs.readFileSync(path.join(ROOT, f), 'utf8'), ctx, { filename: f });
  }
  return ctx.window.FNRO;
}
