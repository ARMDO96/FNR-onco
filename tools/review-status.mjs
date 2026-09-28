// Informe del estado de revisión clínica por tumor. Uso: node tools/review-status.mjs [--vencen 30]
import { load } from './load.mjs';
const R = load();
const i = process.argv.indexOf('--vencen'), days = i > 0 ? +process.argv[i + 1] : 30;
const limit = new Date(Date.now() + days * 86400000).toISOString().slice(0, 10);
const NAMES = { revisado: 'revisados', parcial: 'con 1 de 2', pendiente: 'pendientes', discusion: 'en discusión', caducado: 'caducados', retirado: 'retirados' };
let soon = [];
for (const [tid, pw] of Object.entries(R.pathways)) {
  const tr = R.engine.tumorReview(tid, pw, R.regimens, R.reviews[tid]);
  const parts = Object.entries(tr.count).map(([k, v]) => `${v} ${NAMES[k] || k}`).join(' · ');
  console.log(`${tr.complete ? '✓' : '·'} ${pw.title} [${pw.status}]: ${tr.total} ítems — ${parts}`);
  tr.items.filter(s => s.state === 'discusion').forEach(s => console.log(`    en discusión: ${s.ri.key} — ${s.ri.item.label}`));
  soon = soon.concat(tr.items.filter(s => s.state === 'revisado' && s.expires <= limit).map(s => `${s.ri.key} vence ${s.expires}`));
}
if (soon.length) console.log(`\nVencen en ${days} días:\n  ` + soon.join('\n  '));
