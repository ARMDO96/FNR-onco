// Lee un PDF del pautado y lo divide en capítulos: huella del texto y fármacos nombrados por capítulo.
// No guarda ni imprime texto del pautado (sala limpia y derechos de autor).
// Uso: node tools/pautas.mjs <url o archivo.pdf>   (imprime el resumen por capítulo)
import fs from 'node:fs';
import path from 'node:path';
import { createRequire } from 'node:module';
import { splitChapters } from './vigilancia.mjs';

export async function readPdf(src) {
  const pdfjs = await import('pdfjs-dist/legacy/build/pdf.mjs');
  let data;
  if (/^https?:/.test(src)) {
    const res = await fetch(src, { headers: { 'user-agent': 'FNR-onco vigencia (github.com/ARMDO96/FNR-onco)' } });
    if (!res.ok) throw new Error(`HTTP ${res.status} al bajar el pautado`);
    data = new Uint8Array(await res.arrayBuffer());
  } else data = new Uint8Array(fs.readFileSync(src));
  const fonts = path.join(path.dirname(createRequire(import.meta.url).resolve('pdfjs-dist/package.json')), 'standard_fonts') + path.sep;
  const pdf = await pdfjs.getDocument({ data, isEvalSupported: false, standardFontDataUrl: fonts }).promise;
  const pages = [];
  for (let i = 1; i <= pdf.numPages; i++) {
    const tc = await (await pdf.getPage(i)).getTextContent();
    pages.push(tc.items.map(it => it.str + (it.hasEOL ? '\n' : ' ')).join(''));
  }
  // Índice del PDF (marcadores), aplanado con la página de cada entrada.
  const outline = [];
  const walk = async items => {
    for (const it of items || []) {
      try {
        const dest = typeof it.dest === 'string' ? await pdf.getDestination(it.dest) : it.dest;
        if (dest && dest[0]) outline.push({ title: it.title, page: await pdf.getPageIndex(dest[0]) });
      } catch { /* entrada sin destino válido */ }
      await walk(it.items);
    }
  };
  await walk(await pdf.getOutline());
  return { pages, outline, numPages: pdf.numPages };
}

export async function analyzePdf(src) {
  const { pages, outline, numPages } = await readPdf(src);
  return { numPages, fromOutline: outline.length > 0, chapters: splitChapters(pages, outline) };
}

if (process.argv[1] && process.argv[1].endsWith('pautas.mjs') && process.argv[2]) {
  const r = await analyzePdf(process.argv[2]);
  console.log(`${r.numPages} páginas · capítulos por ${r.fromOutline ? 'índice del PDF' : 'títulos de página'}: ${r.chapters.length}`);
  for (const c of r.chapters) console.log(`- ${c.tema}${c.tumor ? ` [${c.tumor}]` : ''} · p. ${c.pages[0]}–${c.pages[1]} · ${c.drugs.length} fármacos · ${c.hash}`);
}
