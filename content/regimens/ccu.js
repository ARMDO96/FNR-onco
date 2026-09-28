(function (R) {
  R.regimens = R.regimens || {};

  R.regimens['ccu-cisplatino-semanal'] = {
    name: 'Cisplatino semanal concurrente con radioterapia',
    cycle: 'semanal × 5–6 ciclos, concurrente con radioterapia pélvica externa + braquiterapia',
    drugs: [
      { name: 'Cisplatino', dose: { type: 'm2', value: 40, unit: 'mg' }, day: 'D1 semanal' }
    ],
    notes: ['Hidratación pre/post infusión.', 'Dosis máxima habitual 70 mg/dosis absoluta.'],
    refs: [
      { name: 'Rose (GOG-120)', pmid: '10202165' },
      { name: 'Meta-análisis quimiorradioterapia concurrente', pmid: '12109823' }
    ]
  };

  R.regimens['ccu-cisplatino-5fu-adyuvante'] = {
    name: 'Cisplatino + 5-fluorouracilo adyuvante concurrente con radioterapia',
    cycle: 'cada 3 semanas × 4 ciclos, concurrente con radioterapia pélvica adyuvante',
    drugs: [
      { name: 'Cisplatino', dose: { type: 'm2', value: 70, unit: 'mg' }, day: 'D1' },
      { name: '5-fluorouracilo', dose: { type: 'm2', value: 1000, unit: 'mg' }, day: 'D1–D4 (infusión continua 96h)' }
    ],
    notes: ['Esquema histórico de GOG-109; en la práctica actual suele preferirse cisplatino semanal solo (extrapolación).'],
    refs: [{ name: 'Peters (GOG-109/SWOG-8797)', pmid: '10764420' }]
  };

  R.regimens['ccu-induccion-carbo-pacli-semanal'] = {
    name: 'Inducción con carboplatino + paclitaxel semanal (previo a quimiorradioterapia)',
    cycle: 'semanal × 6 ciclos, seguido de quimiorradioterapia definitiva',
    drugs: [
      { name: 'Carboplatino', dose: { type: 'auc', value: 2 }, day: 'D1 semanal' },
      { name: 'Paclitaxel', dose: { type: 'm2', value: 80, unit: 'mg' }, day: 'D1 semanal' }
    ],
    notes: ['Debe completarse sin retrasar el inicio de la quimiorradioterapia más allá de lo protocolizado.'],
    refs: [{ name: 'INTERLACE', pmid: '39419054' }]
  };

  R.regimens['ccu-pembro-qrt'] = {
    name: 'Pembrolizumab concurrente y de mantenimiento con quimiorradioterapia',
    cycle: '5 ciclos de 200 mg c/3 semanas concurrentes con quimiorradioterapia, luego 15 ciclos de 400 mg c/6 semanas de mantenimiento',
    drugs: [
      { name: 'Pembrolizumab (fase concurrente)', dose: { type: 'flat', value: 200, unit: 'mg' }, day: 'D1 c/21d × 5' },
      { name: 'Pembrolizumab (mantenimiento)', dose: { type: 'flat', value: 400, unit: 'mg' }, day: 'D1 c/42d × 15' }
    ],
    notes: ['Se agrega a quimiorradioterapia estándar con cisplatino semanal + braquiterapia.'],
    refs: [{ name: 'KEYNOTE-A18/ENGOT-cx11/GOG-3047', pmid: '39288779' }]
  };

  R.regimens['ccu-cis-pacli'] = {
    name: 'Cisplatino + paclitaxel',
    cycle: 'cada 21 días',
    drugs: [
      { name: 'Cisplatino', dose: { type: 'm2', value: 50, unit: 'mg' }, day: 'D1' },
      { name: 'Paclitaxel', dose: { type: 'm2', value: 175, unit: 'mg' }, day: 'D1' }
    ],
    notes: ['Doblete platino-taxano de referencia en enfermedad persistente/recurrente/metastásica.'],
    refs: [{ name: 'KEYNOTE-826', pmid: '34534429' }]
  };

  R.regimens['ccu-pembro-cis-pacli'] = {
    name: 'Pembrolizumab + cisplatino + paclitaxel',
    cycle: 'cada 21 días × 6 ciclos, luego pembrolizumab de mantenimiento hasta 24 meses',
    drugs: [
      { name: 'Pembrolizumab', dose: { type: 'flat', value: 200, unit: 'mg' }, day: 'D1' },
      { name: 'Cisplatino', dose: { type: 'm2', value: 50, unit: 'mg' }, day: 'D1' },
      { name: 'Paclitaxel', dose: { type: 'm2', value: 175, unit: 'mg' }, day: 'D1' }
    ],
    notes: ['Requiere CPS (combined positive score) ≥ 1 por inmunohistoquímica PD-L1.', 'Puede sustituirse pembrolizumab 200 mg c/3 semanas por 400 mg c/6 semanas en mantenimiento.'],
    refs: [{ name: 'KEYNOTE-826', pmid: '34534429' }]
  };

  R.regimens['ccu-pembro-carbo-pacli'] = {
    name: 'Pembrolizumab + carboplatino + paclitaxel',
    cycle: 'cada 21 días × 6 ciclos, luego pembrolizumab de mantenimiento hasta 24 meses',
    drugs: [
      { name: 'Pembrolizumab', dose: { type: 'flat', value: 200, unit: 'mg' }, day: 'D1' },
      { name: 'Carboplatino', dose: { type: 'auc', value: 5 }, day: 'D1' },
      { name: 'Paclitaxel', dose: { type: 'm2', value: 175, unit: 'mg' }, day: 'D1' }
    ],
    notes: ['Alternativa a cisplatino cuando hay contraindicación o menor tolerancia esperada.', 'Requiere CPS ≥ 1.'],
    refs: [{ name: 'KEYNOTE-826', pmid: '34534429' }]
  };

  R.regimens['ccu-bevacizumab'] = {
    name: 'Bevacizumab (agregado a doblete platino-taxano)',
    cycle: 'cada 21 días, concurrente con el doblete de quimioterapia, hasta progresión o toxicidad',
    drugs: [
      { name: 'Bevacizumab', dose: { type: 'kg', value: 15, unit: 'mg' }, day: 'D1' }
    ],
    notes: ['Contraindicado si hay fístula, sangrado activo o riesgo alto de perforación intestinal/fistulización.'],
    refs: [{ name: 'GOG-240', pmid: '24552320' }]
  };

  R.regimens['ccu-tisotumab-vedotin'] = {
    name: 'Tisotumab vedotina',
    cycle: 'cada 21 días hasta progresión o toxicidad inaceptable',
    drugs: [
      { name: 'Tisotumab vedotina', dose: { type: 'kg', value: 2, unit: 'mg' }, day: 'D1 (máximo 200 mg absolutos)' }
    ],
    notes: ['Vigilar toxicidad ocular (conjuntivitis, queratitis) y neuropatía periférica.'],
    refs: [{ name: 'innovaTV 301/ENGOT-cx12/GOG-3057', pmid: '38959480' }]
  };

  R.regimens['ccu-cemiplimab'] = {
    name: 'Cemiplimab',
    cycle: 'cada 3 semanas hasta progresión o toxicidad inaceptable (máximo ~96 semanas en el ensayo pivotal)',
    drugs: [
      { name: 'Cemiplimab', dose: { type: 'flat', value: 350, unit: 'mg' }, day: 'D1' }
    ],
    notes: ['Estudiado en pacientes sin exposición previa a inhibidores de PD-1/PD-L1.'],
    refs: [{ name: 'EMPOWER-Cervical 1/GOG-3016/ENGOT-cx9', pmid: '35139273' }]
  };

  R.regimens['ccu-topotecan'] = {
    name: 'Topotecán monoterapia',
    cycle: 'cada 21 días',
    drugs: [
      { name: 'Topotecán', dose: { type: 'm2', value: 0.75, unit: 'mg' }, day: 'D1–D3' }
    ],
    notes: ['Dosis extrapolada del esquema en doblete con cisplatino (GOG-179); en monoterapia algunos protocolos usan 1.5 mg/m² D1–D5 (extrapolación de otros tumores).'],
    refs: [{ name: 'GOG-179 (topotecán + cisplatino)', pmid: '15911865' }]
  };
})(window.FNRO = window.FNRO || {});
