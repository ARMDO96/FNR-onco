// Régimenes — Próstata (id: pros)
// Sala limpia: redactado sin consultar guías de origen estadounidense de uso habitual en oncología.
// Dosis y ciclos tomados de los ensayos pivotales citados (PMID verificados por búsqueda) y de la
// información de prescripción aprobada por FDA/EMA.
(function (R) {
  R.regimens = R.regimens || {};

  R.regimens['pros-adt-agonista'] = {
    name: 'Deprivación androgénica — agonista LHRH',
    cycle: 'Continuo; aplicación mensual, trimestral o semestral según la formulación depot elegida',
    drugs: [
      { name: 'Leuprolide (acetato), formulación depot', dose: { type: 'text', value: '22.5 mg IM cada 3 meses (existen presentaciones mensuales de 7.5 mg y semestrales de 45 mg)' }, day: 'D1' }
    ],
    notes: [
      'Clase con varios agonistas equivalentes (leuprolide, goserelina, triptorelina); se ejemplifica con la formulación más usada localmente.',
      'Primer mes: cubrir el "flare" de testosterona con antiandrógeno (p. ej. bicalutamida) 1–2 semanas antes y ~2 semanas después de la primera dosis, sobre todo si hay enfermedad metastásica voluminosa o riesgo de compresión medular.',
      'Es la rama de deprivación androgénica utilizada como base en los ensayos de intensificación (CHAARTED, STAMPEDE, LATITUDE, ARASENS, TITAN, ENZAMET).'
    ],
    refs: [
      { name: 'CHAARTED (rama control con ADT)', pmid: '26244877' },
      { name: 'STAMPEDE — abiraterona (rama control con ADT)', pmid: '28578639' }
    ]
  };

  R.regimens['pros-adt-antagonista'] = {
    name: 'Deprivación androgénica — antagonista LHRH (degarelix)',
    cycle: 'Dosis de carga, luego mensual en forma continua',
    drugs: [
      { name: 'Degarelix', dose: { type: 'text', value: 'Carga 240 mg SC (dos inyecciones de 120 mg), luego 80 mg SC cada 4 semanas' }, day: 'D1' }
    ],
    notes: [
      'Alcanza castración más rápido que los agonistas y evita el "flare" inicial, por lo que no requiere antiandrógeno de cobertura.',
      'Alternativa a un agonista LHRH en el mismo escenario clínico; misma cobertura esperada.'
    ],
    refs: [
      { name: 'Aprobación FDA (degarelix, Firmagon)', url: 'https://www.accessdata.fda.gov/drugsatfda_docs/label/2008/022201lbl.pdf' }
    ]
  };

  R.regimens['pros-bicalutamida'] = {
    name: 'Bicalutamida',
    cycle: 'Continuo, mientras dure el beneficio clínico',
    drugs: [
      { name: 'Bicalutamida', dose: { type: 'text', value: '50 mg VO/día (bloqueo androgénico combinado o cobertura de flare); 150 mg VO/día por 24 meses si se usa junto con RT de rescate' }, day: 'Diario' }
    ],
    notes: [
      'A 50 mg/día: cobertura del flare al iniciar un agonista LHRH, o bloqueo androgénico combinado.',
      'A 150 mg/día por 24 meses: esquema de RTOG 9601 junto con radioterapia de rescate en recaída bioquímica post-prostatectomía. Duraciones más cortas no reproducen su beneficio en sobrevida.'
    ],
    refs: [
      { name: 'RTOG 9601 (bicalutamida 150 mg × 24 meses + RT de rescate)', pmid: '28146658' }
    ]
  };

  R.regimens['pros-abiraterona'] = {
    name: 'Abiraterona + prednisona/prednisolona',
    cycle: 'Continuo hasta progresión o toxicidad inaceptable',
    drugs: [
      { name: 'Abiraterona (acetato)', dose: { type: 'flat', value: 1000, unit: 'mg' }, day: 'Diario, en ayunas' },
      { name: 'Prednisona (o prednisolona)', dose: { type: 'text', value: '5 mg/día en CPSC metastásico (LATITUDE); 5 mg cada 12 h en CPRC metastásico (COU-AA-301/302)' }, day: 'Diario' }
    ],
    notes: [
      'Se administra siempre junto con deprivación androgénica continua (agonista/antagonista LHRH).',
      'La dosis de corticoide difiere según el escenario: 5 mg/día en hormonosensible de alto riesgo (LATITUDE) vs 5 mg c/12h en resistencia a la castración (COU-AA-301/302).',
      'Ajustar dosis con inhibidores/inductores potentes de CYP3A4; monitorizar tensión arterial, kalemia y función hepática.'
    ],
    refs: [
      { name: 'LATITUDE', pmid: '28578607' },
      { name: 'STAMPEDE — abiraterona', pmid: '28578639' },
      { name: 'COU-AA-301', pmid: '21612468' },
      { name: 'COU-AA-302', pmid: '23228172' }
    ]
  };

  R.regimens['pros-docetaxel'] = {
    name: 'Docetaxel + prednisona',
    cycle: 'Cada 21 días, hasta 6 ciclos',
    drugs: [
      { name: 'Docetaxel', dose: { type: 'm2', value: 75, unit: 'mg' }, day: 'D1' },
      { name: 'Prednisona', dose: { type: 'flat', value: 5, unit: 'mg' }, day: 'D1 y D2 (c/12h) o continuo según protocolo local' }
    ],
    notes: [
      'Profilaxis antiemética estándar; considerar soporte con G-CSF según riesgo de neutropenia febril.',
      'En CPSC metastásico se administra junto con deprivación androgénica (± abiraterona o darolutamida, ver regímenes triples).'
    ],
    refs: [
      { name: 'CHAARTED', pmid: '26244877' },
      { name: 'STAMPEDE — docetaxel', nct: 'NCT00268476' }
    ]
  };

  R.regimens['pros-dtx-abiraterona'] = {
    name: 'Triplete: ADT + docetaxel + abiraterona (PEACE-1)',
    cycle: 'Docetaxel 75 mg/m² D1 cada 21 días por 6 ciclos; abiraterona 1000 mg/día + prednisona 5 mg/día en forma continua junto con la deprivación androgénica',
    drugs: [
      { name: 'Docetaxel', dose: { type: 'm2', value: 75, unit: 'mg' }, day: 'D1, c/21 días x6' },
      { name: 'Abiraterona (acetato)', dose: { type: 'flat', value: 1000, unit: 'mg' }, day: 'Diario, continuo' },
      { name: 'Prednisona', dose: { type: 'flat', value: 5, unit: 'mg' }, day: 'Diario, continuo' }
    ],
    notes: [
      'Reservado para CPSC metastásico de alto volumen y buen estado funcional; mayor toxicidad que el doblete.',
      'Requiere deprivación androgénica concomitante (no incluida como fármaco aparte en este régimen).'
    ],
    refs: [{ name: 'PEACE-1', pmid: '35405085' }]
  };

  R.regimens['pros-dtx-darolutamida'] = {
    name: 'Triplete: ADT + docetaxel + darolutamida (ARASENS)',
    cycle: 'Docetaxel 75 mg/m² D1 cada 21 días por 6 ciclos; darolutamida 600 mg c/12h en forma continua junto con la deprivación androgénica',
    drugs: [
      { name: 'Docetaxel', dose: { type: 'm2', value: 75, unit: 'mg' }, day: 'D1, c/21 días x6' },
      { name: 'Darolutamida', dose: { type: 'flat', value: 600, unit: 'mg' }, day: 'Cada 12 h, continuo' }
    ],
    notes: ['Alternativa al triplete con abiraterona; mismo concepto de intensificación en alto volumen/alto riesgo.'],
    refs: [{ name: 'ARASENS', pmid: '35179323' }]
  };

  R.regimens['pros-enzalutamida'] = {
    name: 'Enzalutamida',
    cycle: 'Continuo hasta progresión o toxicidad inaceptable',
    drugs: [{ name: 'Enzalutamida', dose: { type: 'flat', value: 160, unit: 'mg' }, day: 'Diario' }],
    notes: ['Se administra junto con deprivación androgénica continua salvo en el escenario de recaída bioquímica no metastásica de muy alto riesgo (EMBARK), no cubierto por esta guía en detalle.'],
    refs: [
      { name: 'ENZAMET', pmid: '31157964' },
      { name: 'PROSPER', pmid: '29949494' }
    ]
  };

  R.regimens['pros-apalutamida'] = {
    name: 'Apalutamida',
    cycle: 'Continuo hasta progresión o toxicidad inaceptable',
    drugs: [{ name: 'Apalutamida', dose: { type: 'flat', value: 240, unit: 'mg' }, day: 'Diario' }],
    notes: ['Se administra junto con deprivación androgénica continua.'],
    refs: [
      { name: 'TITAN', pmid: '31150574' },
      { name: 'SPARTAN', pmid: '29420164' }
    ]
  };

  R.regimens['pros-darolutamida'] = {
    name: 'Darolutamida',
    cycle: 'Continuo hasta progresión o toxicidad inaceptable',
    drugs: [{ name: 'Darolutamida', dose: { type: 'flat', value: 600, unit: 'mg' }, day: 'Cada 12 h' }],
    notes: ['Se administra junto con deprivación androgénica continua. Perfil de interacciones/efectos en SNC algo más favorable que otros inhibidores de la vía del receptor de andrógenos, según los ensayos pivotales.'],
    refs: [
      { name: 'ARAMIS', pmid: '30763142' },
      { name: 'ARASENS', pmid: '35179323' }
    ]
  };

  R.regimens['pros-olaparib'] = {
    name: 'Olaparib',
    cycle: 'Continuo hasta progresión o toxicidad inaceptable',
    drugs: [{ name: 'Olaparib', dose: { type: 'flat', value: 300, unit: 'mg' }, day: 'Cada 12 h' }],
    notes: [
      'Indicado en CPRC metastásico con alteración en genes de reparación por recombinación homóloga (BRCA1/2, ATM y otros), tras progresión a un inhibidor de la vía del receptor de andrógenos.',
      'El mayor beneficio se observó en el subgrupo BRCA1/2; ATM aislado tiene beneficio más incierto.'
    ],
    refs: [{ name: 'PROfound', pmid: '32343890' }, { name: 'PROfound — sobrevida global', pmid: '32955174' }]
  };

  R.regimens['pros-cabazitaxel'] = {
    name: 'Cabazitaxel + prednisona',
    cycle: 'Cada 21 días',
    drugs: [
      { name: 'Cabazitaxel', dose: { type: 'm2', value: 25, unit: 'mg' }, day: 'D1' },
      { name: 'Prednisona', dose: { type: 'flat', value: 10, unit: 'mg' }, day: 'Diario' }
    ],
    notes: ['Profilaxis con G-CSF recomendada por riesgo de neutropenia febril. Uso tras progresión a docetaxel.'],
    refs: [{ name: 'TROPIC', pmid: '20888992' }]
  };

  R.regimens['pros-radio223'] = {
    name: 'Radio-223 (dicloruro)',
    cycle: 'Cada 4 semanas, hasta 6 dosis',
    drugs: [{ name: 'Radio-223 dicloruro', dose: { type: 'kg', value: 55, unit: 'kBq' }, day: 'D1' }],
    notes: ['Solo en metástasis óseas sintomáticas sin compromiso visceral. No se combina con abiraterona + prednisona (mayor riesgo de fracturas, ERA-223).'],
    refs: [{ name: 'ALSYMPCA', pmid: '23863050' }]
  };

  R.regimens['pros-lu-psma'] = {
    name: 'Lutecio-177-PSMA-617',
    cycle: 'Cada 6 semanas, 4–6 ciclos',
    drugs: [{ name: 'Lutecio-177-PSMA-617', dose: { type: 'flat', value: 7.4, unit: 'GBq' }, day: 'D1' }],
    notes: ['Requiere PET con trazador PSMA positivo. Uso tras progresión a un inhibidor de la vía del receptor de andrógenos y a taxano(s).'],
    refs: [{ name: 'VISION', pmid: '34161051' }]
  };
})(window.FNRO = window.FNRO || {});
