/* Regímenes de cáncer de mama.
   Dosis y esquemas resumidos con palabras propias a partir de las publicaciones de los ensayos
   pivotales citados en cada uno (ver refs) y de la práctica habitual descrita en Pautas de
   Oncología Médica HC/UdelaR 2023 y guías ESMO. */
(function (R) {
  R.regimens = R.regimens || {};

  R.regimens['mama-ac'] = {
    name: 'Doxorrubicina + ciclofosfamida (AC)',
    cycle: 'cada 14 o 21 días × 4 ciclos (habitualmente seguido de taxano)',
    drugs: [
      { name: 'Doxorrubicina', dose: { type: 'm2', value: 60, unit: 'mg' }, day: 'D1' },
      { name: 'Ciclofosfamida', dose: { type: 'm2', value: 600, unit: 'mg' }, day: 'D1' }
    ],
    notes: [
      'Esquema dosis-densa (cada 14 días) con soporte de G-CSF si el estado general lo permite',
      'Requiere control de FEVI basal antes de iniciar antraciclina'
    ],
    refs: [{ name: 'ECOG E1199 (paclitaxel semanal)', pmid: '18420499' }, { name: 'CALGB 9741 (dosis densa)', pmid: '12668651' }]
  };

  R.regimens['mama-paclitaxel-semanal'] = {
    name: 'Paclitaxel semanal',
    cycle: 'semanal × 12 dosis (habitualmente tras AC)',
    drugs: [
      { name: 'Paclitaxel', dose: { type: 'm2', value: 80, unit: 'mg' }, day: 'D1' }
    ],
    notes: ['Premedicación con corticoides y antihistamínicos por riesgo de hipersensibilidad'],
    refs: [{ name: 'ECOG E1199 (paclitaxel semanal)', pmid: '18420499' }, { name: 'CALGB 9741 (dosis densa)', pmid: '12668651' }]
  };

  R.regimens['mama-docetaxel-carbo'] = {
    name: 'Docetaxel + carboplatino (TC)',
    cycle: 'cada 21 días × 4–6 ciclos',
    drugs: [
      { name: 'Docetaxel', dose: { type: 'm2', value: 75, unit: 'mg' }, day: 'D1' },
      { name: 'Carboplatino', dose: { type: 'auc', value: 6 }, day: 'D1' }
    ],
    notes: ['Base quimioterápica habitual para combinar con anti-HER2 o pembrolizumab según subtipo'],
    refs: [{ name: 'TNT trial (carboplatino en triple negativo)', pmid: '29713086' }]
  };

  R.regimens['mama-tchp'] = {
    name: 'Docetaxel + carboplatino + trastuzumab + pertuzumab (TCHP)',
    cycle: 'cada 21 días × 6 ciclos (neoadyuvancia)',
    drugs: [
      { name: 'Docetaxel', dose: { type: 'm2', value: 75, unit: 'mg' }, day: 'D1' },
      { name: 'Carboplatino', dose: { type: 'auc', value: 6 }, day: 'D1' },
      { name: 'Trastuzumab', dose: { type: 'kg', value: 6, unit: 'mg/kg' }, day: 'D1 (carga 8 mg/kg en C1)' },
      { name: 'Pertuzumab', dose: { type: 'flat', value: 420, unit: 'mg' }, day: 'D1 (carga 840 mg en C1)' }
    ],
    notes: ['Cirugía tras completar 6 ciclos; continuar trastuzumab ± pertuzumab hasta completar 1 año'],
    refs: [
      { name: 'NeoSphere', pmid: '22153890' },
      { name: 'TRYPHAENA', nct: 'NCT00976989' }
    ]
  };

  R.regimens['mama-th-neo'] = {
    name: 'Paclitaxel + trastuzumab neoadyuvante',
    cycle: 'paclitaxel semanal × 12 + trastuzumab cada 21 días, seguido de AC si no se administró antes',
    drugs: [
      { name: 'Paclitaxel', dose: { type: 'm2', value: 80, unit: 'mg' }, day: 'D1 semanal' },
      { name: 'Trastuzumab', dose: { type: 'kg', value: 6, unit: 'mg/kg' }, day: 'D1 c/21d (carga 8 mg/kg)' }
    ],
    notes: ['Alternativa cuando pertuzumab neoadyuvante no está disponible'],
    refs: [{ name: 'NeoSphere (brazo THA)', pmid: '22153890' }]
  };

  R.regimens['mama-apt'] = {
    name: 'Paclitaxel + trastuzumab adyuvante (esquema APT)',
    cycle: 'paclitaxel semanal × 12, luego trastuzumab solo hasta completar 1 año',
    drugs: [
      { name: 'Paclitaxel', dose: { type: 'm2', value: 80, unit: 'mg' }, day: 'D1 semanal' },
      { name: 'Trastuzumab', dose: { type: 'kg', value: 6, unit: 'mg/kg' }, day: 'D1 c/21d (carga 4 mg/kg semanal durante paclitaxel)' }
    ],
    notes: ['Reservado a tumores HER2+ pequeños (≤3 cm) con ganglios negativos'],
    refs: [{ name: 'APT trial', pmid: '30939096' }]
  };

  R.regimens['mama-trastuzumab-adj'] = {
    name: 'Trastuzumab adyuvante (monoterapia de mantenimiento)',
    cycle: 'cada 21 días hasta completar 1 año total de tratamiento anti-HER2',
    drugs: [
      { name: 'Trastuzumab', dose: { type: 'kg', value: 6, unit: 'mg/kg' }, day: 'D1 (carga 8 mg/kg si no recibió carga previa)' }
    ],
    notes: ['Continúa lo iniciado en neoadyuvancia o se inicia de novo tras cirugía si no hubo neoadyuvancia'],
    refs: [{ name: 'APHINITY', pmid: '28581356' }]
  };

  R.regimens['mama-pertuzumab-trastuzumab-adj'] = {
    name: 'Trastuzumab + pertuzumab adyuvante (mantenimiento)',
    cycle: 'cada 21 días hasta completar 1 año total',
    drugs: [
      { name: 'Trastuzumab', dose: { type: 'kg', value: 6, unit: 'mg/kg' }, day: 'D1' },
      { name: 'Pertuzumab', dose: { type: 'flat', value: 420, unit: 'mg' }, day: 'D1' }
    ],
    notes: ['Continuación de lo iniciado en neoadyuvancia con TCHP'],
    refs: [{ name: 'APHINITY', pmid: '28581356' }]
  };

  R.regimens['mama-tdm1'] = {
    name: 'Trastuzumab emtansina (T-DM1)',
    cycle: 'cada 21 días',
    drugs: [
      { name: 'Trastuzumab emtansina', dose: { type: 'kg', value: 3.6, unit: 'mg/kg' }, day: 'D1' }
    ],
    notes: [
      'En adyuvancia por enfermedad residual: hasta 14 ciclos (KATHERINE)',
      'En avanzado 2ª línea: hasta progresión o toxicidad (EMILIA)'
    ],
    refs: [
      { name: 'KATHERINE', pmid: '30516102' },
      { name: 'EMILIA', pmid: '23020162' }
    ]
  };

  R.regimens['mama-docetaxel-tp-av'] = {
    name: 'Docetaxel + trastuzumab + pertuzumab (avanzado, 1ª línea)',
    cycle: 'cada 21 días; docetaxel por 6–8 ciclos, luego trastuzumab + pertuzumab de mantenimiento hasta progresión',
    drugs: [
      { name: 'Docetaxel', dose: { type: 'm2', value: 75, unit: 'mg' }, day: 'D1' },
      { name: 'Trastuzumab', dose: { type: 'kg', value: 6, unit: 'mg/kg' }, day: 'D1 (carga 8 mg/kg)' },
      { name: 'Pertuzumab', dose: { type: 'flat', value: 420, unit: 'mg' }, day: 'D1 (carga 840 mg)' }
    ],
    notes: ['Puede sustituirse docetaxel por paclitaxel semanal según tolerancia'],
    refs: [{ name: 'CLEOPATRA', pmid: '22149875' }]
  };

  R.regimens['mama-lapatinib-capecitabina'] = {
    name: 'Lapatinib + capecitabina',
    cycle: 'continuo, capecitabina D1–D14 cada 21 días',
    drugs: [
      { name: 'Lapatinib', dose: { type: 'flat', value: 1250, unit: 'mg/día' }, day: 'continuo' },
      { name: 'Capecitabina', dose: { type: 'm2', value: 2000, unit: 'mg (dividido c/12h)' }, day: 'D1–D14' }
    ],
    notes: ['Indicado tras progresión a trastuzumab y taxano en enfermedad avanzada'],
    refs: [{ name: 'Geyer et al. (lapatinib + capecitabina)', pmid: '17192538' }]
  };

  R.regimens['mama-tamoxifeno'] = {
    name: 'Tamoxifeno',
    cycle: 'continuo, habitualmente 5–10 años',
    drugs: [
      { name: 'Tamoxifeno', dose: { type: 'flat', value: 20, unit: 'mg/día' }, day: 'continuo' }
    ],
    notes: ['En premenopáusicas de alto riesgo se asocia supresión ovárica'],
    refs: [{ name: 'NSABP B-24 (uso en carcinoma in situ)', pmid: '10376613' }]
  };

  R.regimens['mama-ai'] = {
    name: 'Inhibidor de aromatasa (letrozol / anastrozol / exemestano)',
    cycle: 'continuo',
    drugs: [
      { name: 'Letrozol', dose: { type: 'flat', value: 2.5, unit: 'mg/día' }, day: 'continuo' }
    ],
    notes: ['Solo en mujeres postmenopáusicas (o con supresión ovárica); anastrozol 1 mg/día y exemestano 25 mg/día son alternativas equivalentes'],
    refs: [{ name: 'Pautas de Oncología Médica HC/UdelaR 2023', url: 'https://oncologiamedica.hc.edu.uy/wp-content/uploads/2024/09/R-PAUTAS-DE-ONCOLOGIA-MEDICA-2023-final.pdf' }]
  };

  R.regimens['mama-ofs-ai'] = {
    name: 'Supresión ovárica (goserelina) + inhibidor de aromatasa',
    cycle: 'goserelina cada 28 días + inhibidor de aromatasa continuo',
    drugs: [
      { name: 'Goserelina', dose: { type: 'flat', value: 3.6, unit: 'mg' }, day: 'D1 c/28d' },
      { name: 'Letrozol', dose: { type: 'flat', value: 2.5, unit: 'mg/día' }, day: 'continuo' }
    ],
    notes: ['Alternativa en premenopáusicas de alto riesgo, en lugar de tamoxifeno solo'],
    refs: [{ name: 'Pautas de Oncología Médica HC/UdelaR 2023', url: 'https://oncologiamedica.hc.edu.uy/wp-content/uploads/2024/09/R-PAUTAS-DE-ONCOLOGIA-MEDICA-2023-final.pdf' }]
  };

  R.regimens['mama-ribociclib-ai'] = {
    name: 'Ribociclib + inhibidor de aromatasa (± supresión ovárica)',
    cycle: 'ribociclib D1–D21 cada 28 días (3 semanas sí, 1 semana no) + inhibidor de aromatasa continuo',
    drugs: [
      { name: 'Ribociclib', dose: { type: 'flat', value: 600, unit: 'mg/día' }, day: 'D1–D21 c/28d' },
      { name: 'Letrozol', dose: { type: 'flat', value: 2.5, unit: 'mg/día' }, day: 'continuo' }
    ],
    notes: ['En premenopáusicas se asocia supresión ovárica con goserelina', 'Requiere ECG basal por riesgo de prolongación de QT'],
    refs: [{ name: 'MONALEESA-2', pmid: '27717303' }]
  };

  R.regimens['mama-ribociclib-fulvestrant'] = {
    name: 'Ribociclib + fulvestrant',
    cycle: 'ribociclib D1–D21 cada 28 días + fulvestrant D1 y D15 del ciclo 1, luego D1 cada 28 días',
    drugs: [
      { name: 'Ribociclib', dose: { type: 'flat', value: 600, unit: 'mg/día' }, day: 'D1–D21 c/28d' },
      { name: 'Fulvestrant', dose: { type: 'flat', value: 500, unit: 'mg' }, day: 'D1 (y D15 en C1)' }
    ],
    notes: ['Requiere ECG basal por riesgo de prolongación de QT'],
    refs: [{ name: 'MONALEESA-3', pmid: '29860922' }]
  };

  R.regimens['mama-fulvestrant'] = {
    name: 'Fulvestrant en monoterapia',
    cycle: 'D1 y D15 del ciclo 1, luego D1 cada 28 días',
    drugs: [
      { name: 'Fulvestrant', dose: { type: 'flat', value: 500, unit: 'mg' }, day: 'D1 (y D15 en C1)' }
    ],
    notes: ['Opción cuando un inhibidor de CDK4/6 está contraindicado o no disponible'],
    refs: [{ name: 'FALCON', pmid: '27908454' }]
  };

  R.regimens['mama-capecitabina'] = {
    name: 'Capecitabina',
    cycle: 'D1–D14 cada 21 días',
    drugs: [
      { name: 'Capecitabina', dose: { type: 'm2', value: 1250, unit: 'mg (dividido c/12h)' }, day: 'D1–D14' }
    ],
    notes: ['En adyuvancia por enfermedad residual triple negativa: 6–8 ciclos (CREATE-X)'],
    refs: [{ name: 'CREATE-X', pmid: '28564564' }]
  };

  R.regimens['mama-pembrolizumab-quimio'] = {
    name: 'Pembrolizumab + quimioterapia (nab-paclitaxel / paclitaxel / gemcitabina-carboplatino)',
    cycle: 'pembrolizumab cada 21 días + quimioterapia según esquema elegido',
    drugs: [
      { name: 'Pembrolizumab', dose: { type: 'flat', value: 200, unit: 'mg' }, day: 'D1 c/21d' },
      { name: 'Nab-paclitaxel', dose: { type: 'm2', value: 100, unit: 'mg' }, day: 'D1, D8, D15 c/28d' }
    ],
    notes: ['Solo si PD-L1 CPS ≥ 10; puede sustituirse nab-paclitaxel por paclitaxel o gemcitabina+carboplatino'],
    refs: [{ name: 'KEYNOTE-355', pmid: '33278935' }]
  };

  R.regimens['mama-paclitaxel-av'] = {
    name: 'Paclitaxel en monoterapia (avanzado, PD-L1 negativo)',
    cycle: 'semanal, D1-D8-D15 cada 28 días',
    drugs: [
      { name: 'Paclitaxel', dose: { type: 'm2', value: 90, unit: 'mg' }, day: 'D1, D8, D15 c/28d' }
    ],
    notes: ['Quimioterapia estándar cuando no corresponde inmunoterapia (PD-L1 CPS < 10)'],
    refs: [{ name: 'Pautas de Oncología Médica HC/UdelaR 2023', url: 'https://oncologiamedica.hc.edu.uy/wp-content/uploads/2024/09/R-PAUTAS-DE-ONCOLOGIA-MEDICA-2023-final.pdf' }]
  };

  R.regimens['mama-eribulina'] = {
    name: 'Eribulina',
    cycle: 'D1 y D8 cada 21 días',
    drugs: [
      { name: 'Eribulina', dose: { type: 'm2', value: 1.4, unit: 'mg' }, day: 'D1, D8' }
    ],
    notes: ['Línea posterior en enfermedad avanzada, tras progresión a antraciclina y taxano'],
    refs: [{ name: 'EMBRACE', pmid: '21376385' }]
  };

  R.regimens['mama-sacituzumab'] = {
    name: 'Sacituzumab govitecan',
    cycle: 'D1 y D8 cada 21 días',
    drugs: [
      { name: 'Sacituzumab govitecan', dose: { type: 'kg', value: 10, unit: 'mg/kg' }, day: 'D1, D8' }
    ],
    notes: ['Cobertura en Uruguay a confirmar (no listado en FNR/FTM al momento de este borrador)'],
    refs: [{ name: 'ASCENT', pmid: '33882206' }]
  };
})(window.FNRO = window.FNRO || {});
