// Regímenes — Cáncer colorrectal (ccr)
// Redactado con palabras propias a partir de publicaciones primarias (PubMed) y
// resúmenes de Pautas de Oncología Médica HC/UdelaR y ESMO. Ver content/SCHEMA.md.
(function (R) {
  R.regimens = R.regimens || {};

  R.regimens['ccr-folfox6m'] = {
    name: 'mFOLFOX6 (oxaliplatino + 5-FU/leucovorina)',
    cycle: 'cada 14 días',
    drugs: [
      { name: 'Oxaliplatino', dose: { type: 'm2', value: 85, unit: 'mg' }, day: 'D1' },
      { name: 'Leucovorina (ácido folínico)', dose: { type: 'm2', value: 400, unit: 'mg' }, day: 'D1' },
      { name: '5-fluorouracilo en bolo', dose: { type: 'm2', value: 400, unit: 'mg' }, day: 'D1' },
      { name: '5-fluorouracilo en infusión continua', dose: { type: 'm2', value: 2400, unit: 'mg' }, day: 'D1-D2 (46 h)' }
    ],
    notes: ['Esquema adyuvante o en enfermedad avanzada; en adyuvancia suele omitirse el bolo en protocolos posteriores a MOSAIC.'],
    refs: [{ name: 'MOSAIC', pmid: '15175436' }]
  };

  R.regimens['ccr-capox'] = {
    name: 'CAPOX / XELOX (capecitabina + oxaliplatino)',
    cycle: 'cada 21 días',
    drugs: [
      { name: 'Oxaliplatino', dose: { type: 'm2', value: 130, unit: 'mg' }, day: 'D1' },
      { name: 'Capecitabina', dose: { type: 'm2', value: 1000, unit: 'mg' }, day: 'D1-D14, cada 12 h' }
    ],
    notes: ['Alternativa oral a FOLFOX; usado en el estudio IDEA para comparar 3 vs 6 meses de adyuvancia.'],
    refs: [{ name: 'IDEA collaboration', pmid: '29590544' }]
  };

  R.regimens['ccr-folfiri'] = {
    name: 'FOLFIRI (irinotecán + 5-FU/leucovorina)',
    cycle: 'cada 14 días',
    drugs: [
      { name: 'Irinotecán', dose: { type: 'm2', value: 180, unit: 'mg' }, day: 'D1' },
      { name: 'Leucovorina (ácido folínico)', dose: { type: 'm2', value: 400, unit: 'mg' }, day: 'D1' },
      { name: '5-fluorouracilo en bolo', dose: { type: 'm2', value: 400, unit: 'mg' }, day: 'D1' },
      { name: '5-fluorouracilo en infusión continua', dose: { type: 'm2', value: 2400, unit: 'mg' }, day: 'D1-D2 (46 h)' }
    ],
    notes: ['Esquema estándar de 1ª/2ª línea en enfermedad metastásica.'],
    refs: [{ name: 'CRYSTAL', pmid: '19339720' }]
  };

  R.regimens['ccr-folfoxiri'] = {
    name: 'FOLFOXIRI (oxaliplatino + irinotecán + 5-FU/leucovorina)',
    cycle: 'cada 14 días',
    drugs: [
      { name: 'Oxaliplatino', dose: { type: 'm2', value: 85, unit: 'mg' }, day: 'D1' },
      { name: 'Irinotecán', dose: { type: 'm2', value: 165, unit: 'mg' }, day: 'D1' },
      { name: 'Leucovorina (ácido folínico)', dose: { type: 'm2', value: 200, unit: 'mg' }, day: 'D1' },
      { name: '5-fluorouracilo en infusión continua', dose: { type: 'm2', value: 3200, unit: 'mg' }, day: 'D1-D2 (48 h), sin bolo' }
    ],
    notes: ['Triplete reservado para pacientes con buen performance status; mayor toxicidad hematológica y digestiva que los dobletes.'],
    refs: [{ name: 'TRIBE', pmid: '26338525' }]
  };

  R.regimens['ccr-capecitabina'] = {
    name: 'Capecitabina monoterapia',
    cycle: 'cada 21 días',
    drugs: [
      { name: 'Capecitabina', dose: { type: 'm2', value: 1250, unit: 'mg' }, day: 'D1-D14, cada 12 h' }
    ],
    notes: ['Alternativa oral a 5-FU/LV en bolo; usada en adyuvancia o en pacientes frágiles con enfermedad avanzada.'],
    refs: [{ name: 'X-ACT', pmid: '15987918' }]
  };

  R.regimens['ccr-capecitabina-rt'] = {
    name: 'Capecitabina concurrente con radioterapia pélvica',
    cycle: 'diario los días de radioterapia, durante ~5-5.5 semanas',
    drugs: [
      { name: 'Capecitabina', dose: { type: 'm2', value: 825, unit: 'mg' }, day: 'cada 12 h, días de RT' }
    ],
    notes: ['Radiosensibilizante en quimiorradioterapia neoadyuvante/adyuvante de recto; reemplaza al 5-FU en infusión continua con eficacia comparable.'],
    refs: [{ name: 'NSABP R-04 / consenso ESMO', url: 'https://doi.org/10.1093/annonc/mds628' }]
  };

  R.regimens['ccr-folfox-bev'] = {
    name: 'mFOLFOX6 + bevacizumab',
    cycle: 'cada 14 días',
    drugs: [
      { name: 'Oxaliplatino', dose: { type: 'm2', value: 85, unit: 'mg' }, day: 'D1' },
      { name: 'Leucovorina (ácido folínico)', dose: { type: 'm2', value: 400, unit: 'mg' }, day: 'D1' },
      { name: '5-fluorouracilo en bolo', dose: { type: 'm2', value: 400, unit: 'mg' }, day: 'D1' },
      { name: '5-fluorouracilo en infusión continua', dose: { type: 'm2', value: 2400, unit: 'mg' }, day: 'D1-D2 (46 h)' },
      { name: 'Bevacizumab', dose: { type: 'kg', value: 5, unit: 'mg' }, day: 'D1' }
    ],
    notes: ['Esquema de 1ª línea en enfermedad metastásica, cualquier estado RAS/BRAF.'],
    refs: [{ name: 'NO16966', pmid: '18421054' }]
  };

  R.regimens['ccr-capox-bev'] = {
    name: 'CAPOX + bevacizumab',
    cycle: 'cada 21 días',
    drugs: [
      { name: 'Oxaliplatino', dose: { type: 'm2', value: 130, unit: 'mg' }, day: 'D1' },
      { name: 'Capecitabina', dose: { type: 'm2', value: 1000, unit: 'mg' }, day: 'D1-D14, cada 12 h' },
      { name: 'Bevacizumab', dose: { type: 'kg', value: 7.5, unit: 'mg' }, day: 'D1' }
    ],
    notes: ['Alternativa oral a FOLFOX-bevacizumab en 1ª línea metastásica.'],
    refs: [{ name: 'NO16966', pmid: '18421054' }]
  };

  R.regimens['ccr-folfiri-bev'] = {
    name: 'FOLFIRI + bevacizumab',
    cycle: 'cada 14 días',
    drugs: [
      { name: 'Irinotecán', dose: { type: 'm2', value: 180, unit: 'mg' }, day: 'D1' },
      { name: 'Leucovorina (ácido folínico)', dose: { type: 'm2', value: 400, unit: 'mg' }, day: 'D1' },
      { name: '5-fluorouracilo en bolo', dose: { type: 'm2', value: 400, unit: 'mg' }, day: 'D1' },
      { name: '5-fluorouracilo en infusión continua', dose: { type: 'm2', value: 2400, unit: 'mg' }, day: 'D1-D2 (46 h)' },
      { name: 'Bevacizumab', dose: { type: 'kg', value: 5, unit: 'mg' }, day: 'D1' }
    ],
    notes: ['Usado en 1ª línea (alternativa a FOLFOX-bev) y en 2ª línea tras progresión a un esquema con oxaliplatino.'],
    refs: [{ name: 'TRIBE', pmid: '26338525' }]
  };

  R.regimens['ccr-folfoxiri-bev'] = {
    name: 'FOLFOXIRI + bevacizumab',
    cycle: 'cada 14 días',
    drugs: [
      { name: 'Oxaliplatino', dose: { type: 'm2', value: 85, unit: 'mg' }, day: 'D1' },
      { name: 'Irinotecán', dose: { type: 'm2', value: 165, unit: 'mg' }, day: 'D1' },
      { name: 'Leucovorina (ácido folínico)', dose: { type: 'm2', value: 200, unit: 'mg' }, day: 'D1' },
      { name: '5-fluorouracilo en infusión continua', dose: { type: 'm2', value: 3200, unit: 'mg' }, day: 'D1-D2 (48 h), sin bolo' },
      { name: 'Bevacizumab', dose: { type: 'kg', value: 5, unit: 'mg' }, day: 'D1' }
    ],
    notes: ['1ª línea para pacientes seleccionados (buen PS, enfermedad de alto volumen o BRAF mutado), reservar por mayor toxicidad.'],
    refs: [{ name: 'TRIBE2', pmid: '32164906' }]
  };

  R.regimens['ccr-folfiri-cetux'] = {
    name: 'FOLFIRI + cetuximab',
    cycle: 'cada 14 días (cetuximab semanal o quincenal)',
    drugs: [
      { name: 'Irinotecán', dose: { type: 'm2', value: 180, unit: 'mg' }, day: 'D1' },
      { name: 'Leucovorina (ácido folínico)', dose: { type: 'm2', value: 400, unit: 'mg' }, day: 'D1' },
      { name: '5-fluorouracilo en bolo', dose: { type: 'm2', value: 400, unit: 'mg' }, day: 'D1' },
      { name: '5-fluorouracilo en infusión continua', dose: { type: 'm2', value: 2400, unit: 'mg' }, day: 'D1-D2 (46 h)' },
      { name: 'Cetuximab (dosis de carga)', dose: { type: 'm2', value: 400, unit: 'mg' }, day: 'D1 del ciclo 1' },
      { name: 'Cetuximab (mantenimiento)', dose: { type: 'm2', value: 250, unit: 'mg' }, day: 'semanal (o 500 mg/m² quincenal)' }
    ],
    notes: ['Solo en tumores RAS y BRAF wild-type; el beneficio se concentra en primarios de colon izquierdo/recto.'],
    refs: [{ name: 'CRYSTAL', pmid: '19339720' }, { name: 'FIRE-3', pmid: '25456373' }]
  };

  R.regimens['ccr-folfox-cetux'] = {
    name: 'mFOLFOX6 + cetuximab',
    cycle: 'cada 14 días (cetuximab semanal o quincenal)',
    drugs: [
      { name: 'Oxaliplatino', dose: { type: 'm2', value: 85, unit: 'mg' }, day: 'D1' },
      { name: 'Leucovorina (ácido folínico)', dose: { type: 'm2', value: 400, unit: 'mg' }, day: 'D1' },
      { name: '5-fluorouracilo en bolo', dose: { type: 'm2', value: 400, unit: 'mg' }, day: 'D1' },
      { name: '5-fluorouracilo en infusión continua', dose: { type: 'm2', value: 2400, unit: 'mg' }, day: 'D1-D2 (46 h)' },
      { name: 'Cetuximab (dosis de carga)', dose: { type: 'm2', value: 400, unit: 'mg' }, day: 'D1 del ciclo 1' },
      { name: 'Cetuximab (mantenimiento)', dose: { type: 'm2', value: 250, unit: 'mg' }, day: 'semanal (o 500 mg/m² quincenal)' }
    ],
    notes: ['Alternativa a FOLFIRI-cetuximab; solo RAS/BRAF wild-type, preferentemente colon izquierdo.'],
    refs: [{ name: 'OPUS', pmid: '21597447' }]
  };

  R.regimens['ccr-pembrolizumab'] = {
    name: 'Pembrolizumab monoterapia',
    cycle: 'cada 21 días (o 400 mg cada 6 semanas)',
    drugs: [
      { name: 'Pembrolizumab', dose: { type: 'flat', value: 200, unit: 'mg' }, day: 'D1' }
    ],
    notes: ['1ª línea en CCR metastásico dMMR/MSI-H; reemplaza a la quimioterapia en ese subgrupo.'],
    refs: [{ name: 'KEYNOTE-177', pmid: '33264544' }]
  };

  R.regimens['ccr-dostarlimab'] = {
    name: 'Dostarlimab neoadyuvante (recto dMMR)',
    cycle: 'cada 21 días × 6-9 ciclos, evaluación de respuesta clínica completa',
    drugs: [
      { name: 'Dostarlimab', dose: { type: 'flat', value: 500, unit: 'mg' }, day: 'D1' }
    ],
    notes: ['Experiencia de un solo centro/serie pequeña en recto localmente avanzado dMMR; permitió preservación de órgano sin RT ni cirugía en la serie publicada. No es aún un estándar validado en fase III.'],
    refs: [{ name: 'Cercek et al.', pmid: '35660797' }]
  };

  R.regimens['ccr-mfolfirinox-tnt'] = {
    name: 'mFOLFIRINOX (inducción, terapia neoadyuvante total de recto)',
    cycle: 'cada 14 días × 6 ciclos, seguido de quimiorradioterapia',
    drugs: [
      { name: 'Oxaliplatino', dose: { type: 'm2', value: 85, unit: 'mg' }, day: 'D1' },
      { name: 'Irinotecán', dose: { type: 'm2', value: 180, unit: 'mg' }, day: 'D1' },
      { name: 'Leucovorina (ácido folínico)', dose: { type: 'm2', value: 400, unit: 'mg' }, day: 'D1' },
      { name: '5-fluorouracilo en infusión continua', dose: { type: 'm2', value: 2400, unit: 'mg' }, day: 'D1-D2 (46 h)' }
    ],
    notes: ['Componente de quimioterapia de inducción de la terapia neoadyuvante total (TNT) en recto localmente avanzado.'],
    refs: [{ name: 'PRODIGE 23', pmid: '33862000' }]
  };

  R.regimens['ccr-folfox-consolidacion'] = {
    name: 'mFOLFOX6 (consolidación, TNT de recto)',
    cycle: 'cada 14 días × 4-8 ciclos, después de quimiorradioterapia',
    drugs: [
      { name: 'Oxaliplatino', dose: { type: 'm2', value: 85, unit: 'mg' }, day: 'D1' },
      { name: 'Leucovorina (ácido folínico)', dose: { type: 'm2', value: 400, unit: 'mg' }, day: 'D1' },
      { name: '5-fluorouracilo en bolo', dose: { type: 'm2', value: 400, unit: 'mg' }, day: 'D1' },
      { name: '5-fluorouracilo en infusión continua', dose: { type: 'm2', value: 2400, unit: 'mg' }, day: 'D1-D2 (46 h)' }
    ],
    notes: ['Quimioterapia de consolidación tras quimiorradioterapia, antes de decidir cirugía vs. observación (watch & wait).'],
    refs: [{ name: 'OPRA', pmid: '35483010' }]
  };

  R.regimens['ccr-regorafenib'] = {
    name: 'Regorafenib',
    cycle: 'cada 28 días (21 días de tratamiento, 7 de descanso)',
    drugs: [
      { name: 'Regorafenib', dose: { type: 'text', value: '160 mg/día VO' }, day: 'D1-D21' }
    ],
    notes: ['Línea tardía tras progresión a quimioterapia, anti-VEGF y anti-EGFR (si aplica). Beneficio modesto en sobrevida global.'],
    refs: [{ name: 'CORRECT', pmid: '23177514' }]
  };

  R.regimens['ccr-trifluridina-tipiracil'] = {
    name: 'Trifluridina-tipiracil (TAS-102)',
    cycle: 'cada 28 días (D1-D5 y D8-D12, descanso D13-D28)',
    drugs: [
      { name: 'Trifluridina-tipiracil', dose: { type: 'm2', value: 35, unit: 'mg' }, day: 'cada 12 h, D1-D5 y D8-D12' }
    ],
    notes: ['Línea tardía, alternativa a regorafenib; puede combinarse con bevacizumab según evidencia posterior.'],
    refs: [{ name: 'RECOURSE', pmid: '25970050' }]
  };

  R.regimens['ccr-encorafenib-cetux'] = {
    name: 'Encorafenib + cetuximab',
    cycle: 'continuo, cada 21 días',
    drugs: [
      { name: 'Encorafenib', dose: { type: 'text', value: '300 mg/día VO' }, day: 'D1-D21 continuo' },
      { name: 'Cetuximab', dose: { type: 'm2', value: 400, unit: 'mg' }, day: 'D1 del ciclo 1' },
      { name: 'Cetuximab (mantenimiento)', dose: { type: 'm2', value: 250, unit: 'mg' }, day: 'semanal' }
    ],
    notes: ['Específico para BRAF V600E mutado, tras progresión a 1ª línea.'],
    refs: [{ name: 'BEACON CRC', pmid: '31566309' }]
  };
})(window.FNRO = window.FNRO || {});
