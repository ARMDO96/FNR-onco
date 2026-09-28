/* Regímenes — Cáncer de pulmón no microcítico (CPCNP / NSCLC)
   Dosis y ciclos resumidos con palabras propias a partir de los ensayos pivotales citados
   en cada ítem de content/pathways/pulm.js. Ante duda de dosis, remitirse a ficha técnica vigente. */
(function (R) {
"use strict";
R.regimens = R.regimens || {};

/* ---------- Terapias dirigidas EGFR ---------- */

R.regimens['pulm-osimertinib-adj'] = {
  name: 'Osimertinib adyuvante',
  cycle: 'VO continuo, 1 comprimido/día, hasta completar 3 años o hasta progresión/toxicidad inaceptable',
  drugs: [
    { name: 'Osimertinib', dose: { type: 'flat', value: 80, unit: 'mg' }, day: 'continuo' }
  ],
  notes: ['Iniciar entre 4 y 10 semanas post-resección, con recuperación adecuada de la cirugía.'],
  refs: [
    { name: 'ADAURA (DFS)', pmid: '32955177' },
    { name: 'ADAURA (SG)', pmid: '37272535' }
  ]
};

R.regimens['pulm-osimertinib-1l'] = {
  name: 'Osimertinib 1ª línea (avanzado)',
  cycle: 'VO continuo, 1 comprimido/día, hasta progresión o toxicidad inaceptable',
  drugs: [
    { name: 'Osimertinib', dose: { type: 'flat', value: 80, unit: 'mg' }, day: 'continuo' }
  ],
  refs: [{ name: 'FLAURA', pmid: '29151359' }]
};

R.regimens['pulm-osimertinib-2l'] = {
  name: 'Osimertinib 2ª línea (post-TKI 1ª/2ª gen., T790M+)',
  cycle: 'VO continuo, 1 comprimido/día, hasta progresión o toxicidad inaceptable',
  drugs: [
    { name: 'Osimertinib', dose: { type: 'flat', value: 80, unit: 'mg' }, day: 'continuo' }
  ],
  notes: ['Requiere confirmación de mutación de resistencia T790M en tejido o biopsia líquida tras progresar a erlotinib/gefitinib.'],
  refs: [{ name: 'AURA3', pmid: '27959700' }]
};

R.regimens['pulm-erlotinib'] = {
  name: 'Erlotinib',
  cycle: 'VO continuo, 1 comprimido/día, hasta progresión o toxicidad inaceptable',
  drugs: [
    { name: 'Erlotinib', dose: { type: 'flat', value: 150, unit: 'mg' }, day: 'continuo' }
  ],
  refs: [{ name: 'EURTAC', pmid: '22285168' }]
};

R.regimens['pulm-gefitinib'] = {
  name: 'Gefitinib',
  cycle: 'VO continuo, 1 comprimido/día, hasta progresión o toxicidad inaceptable',
  drugs: [
    { name: 'Gefitinib', dose: { type: 'flat', value: 250, unit: 'mg' }, day: 'continuo' }
  ],
  refs: [{ name: 'IPASS', pmid: '19692680' }]
};

/* ---------- Terapias dirigidas ALK / ROS1 / KRAS ---------- */

R.regimens['pulm-alectinib'] = {
  name: 'Alectinib',
  cycle: 'VO continuo, cada 12 horas, hasta progresión o toxicidad inaceptable',
  drugs: [
    { name: 'Alectinib', dose: { type: 'flat', value: 600, unit: 'mg' }, day: 'c/12 h' }
  ],
  refs: [{ name: 'ALEX', pmid: '28586279' }]
};

R.regimens['pulm-lorlatinib'] = {
  name: 'Lorlatinib',
  cycle: 'VO continuo, 1 comprimido/día, hasta progresión o toxicidad inaceptable',
  drugs: [
    { name: 'Lorlatinib', dose: { type: 'flat', value: 100, unit: 'mg' }, day: 'continuo' }
  ],
  notes: ['Vigilar hiperlipidemia, edema y efectos neurocognitivos.'],
  refs: [{ name: 'CROWN', pmid: '33207094' }]
};

R.regimens['pulm-brigatinib'] = {
  name: 'Brigatinib',
  cycle: 'VO continuo: 90 mg/día × 7 días (lead-in), luego 180 mg/día, hasta progresión o toxicidad',
  drugs: [
    { name: 'Brigatinib', dose: { type: 'flat', value: 90, unit: 'mg' }, day: 'D1–7 (lead-in)' },
    { name: 'Brigatinib', dose: { type: 'flat', value: 180, unit: 'mg' }, day: 'desde D8, continuo' }
  ],
  refs: [{ name: 'ALTA-1L', pmid: '30280657' }]
};

R.regimens['pulm-crizotinib-ros1'] = {
  name: 'Crizotinib (ROS1+)',
  cycle: 'VO continuo, cada 12 horas, hasta progresión o toxicidad inaceptable',
  drugs: [
    { name: 'Crizotinib', dose: { type: 'flat', value: 250, unit: 'mg' }, day: 'c/12 h' }
  ],
  refs: [{ name: 'PROFILE 1001', pmid: '30980071' }]
};

R.regimens['pulm-sotorasib'] = {
  name: 'Sotorasib (KRAS G12C+)',
  cycle: 'VO continuo, 1 vez/día, hasta progresión o toxicidad inaceptable',
  drugs: [
    { name: 'Sotorasib', dose: { type: 'flat', value: 960, unit: 'mg' }, day: 'continuo' }
  ],
  refs: [{ name: 'CodeBreaK 200', pmid: '36764316' }]
};

/* ---------- Inmunoterapia monoterapia / combinada ---------- */

R.regimens['pulm-pembrolizumab-mono'] = {
  name: 'Pembrolizumab monoterapia',
  cycle: 'cada 21 días, hasta 35 ciclos o hasta progresión/toxicidad',
  drugs: [
    { name: 'Pembrolizumab', dose: { type: 'flat', value: 200, unit: 'mg' }, day: 'D1' }
  ],
  refs: [
    { name: 'KEYNOTE-024', pmid: '27718847' },
    { name: 'KEYNOTE-042', pmid: '30955977' }
  ]
};

R.regimens['pulm-atezolizumab-mono'] = {
  name: 'Atezolizumab monoterapia',
  cycle: 'cada 21 días, hasta progresión o toxicidad inaceptable',
  drugs: [
    { name: 'Atezolizumab', dose: { type: 'flat', value: 1200, unit: 'mg' }, day: 'D1 (IV); alternativa SC 1875 mg' }
  ],
  refs: [{ name: 'IMpower110', pmid: '32997907' }]
};

R.regimens['pulm-abcp'] = {
  name: 'Atezolizumab + Bevacizumab + Carboplatino + Paclitaxel (ABCP)',
  cycle: 'cada 21 días × 4–6 ciclos, luego mantenimiento con atezolizumab + bevacizumab',
  drugs: [
    { name: 'Atezolizumab', dose: { type: 'flat', value: 1200, unit: 'mg' }, day: 'D1' },
    { name: 'Bevacizumab', dose: { type: 'kg', value: 15, unit: 'mg' }, day: 'D1' },
    { name: 'Carboplatino', dose: { type: 'auc', value: 6 }, day: 'D1' },
    { name: 'Paclitaxel', dose: { type: 'm2', value: 200, unit: 'mg' }, day: 'D1' }
  ],
  notes: ['Sólo histología no escamosa. Vigilar hipertensión, proteinuria y riesgo hemorrágico por bevacizumab.'],
  refs: [{ name: 'IMpower150', pmid: '29863955' }]
};

R.regimens['pulm-carbo-pem-pembro'] = {
  name: 'Carboplatino/Cisplatino + Pemetrexed + Pembrolizumab',
  cycle: 'cada 21 días × 4, luego mantenimiento pemetrexed + pembrolizumab hasta progresión (pembrolizumab máx. 35 ciclos)',
  drugs: [
    { name: 'Carboplatino', dose: { type: 'auc', value: 5 }, day: 'D1' },
    { name: 'Pemetrexed', dose: { type: 'm2', value: 500, unit: 'mg' }, day: 'D1' },
    { name: 'Pembrolizumab', dose: { type: 'flat', value: 200, unit: 'mg' }, day: 'D1' }
  ],
  notes: ['Ácido fólico + vitamina B12 antes de pemetrexed.', 'No escamoso.'],
  refs: [{ name: 'KEYNOTE-189', pmid: '29658856' }]
};

R.regimens['pulm-carbo-tax-pembro'] = {
  name: 'Carboplatino + Paclitaxel/nab-paclitaxel + Pembrolizumab',
  cycle: 'cada 21 días × 4, luego mantenimiento con pembrolizumab hasta progresión (máx. 35 ciclos)',
  drugs: [
    { name: 'Carboplatino', dose: { type: 'auc', value: 6 }, day: 'D1' },
    { name: 'Paclitaxel', dose: { type: 'm2', value: 200, unit: 'mg' }, day: 'D1' },
    { name: 'Pembrolizumab', dose: { type: 'flat', value: 200, unit: 'mg' }, day: 'D1' }
  ],
  notes: ['Histología escamosa.'],
  refs: [{ name: 'KEYNOTE-407', pmid: '30280635' }]
};

/* ---------- Inmunoterapia perioperatoria / adyuvante / consolidación ---------- */

R.regimens['pulm-nivolumab-neo'] = {
  name: 'Nivolumab + quimioterapia neoadyuvante (3 ciclos prequirúrgicos)',
  cycle: 'cada 21 días × 3 ciclos antes de la cirugía',
  drugs: [
    { name: 'Nivolumab', dose: { type: 'flat', value: 360, unit: 'mg' }, day: 'D1' },
    { name: 'Platino + doblete (según histología)', dose: { type: 'text', value: 'esquema doblete con platino, elegido según histología' }, day: 'D1' }
  ],
  refs: [{ name: 'CheckMate 816', pmid: '35403841' }]
};

R.regimens['pulm-pembrolizumab-perioperatorio'] = {
  name: 'Pembrolizumab perioperatorio (neoadyuvante + adyuvante)',
  cycle: '4 ciclos neoadyuvantes c/21 días con QT con platino, cirugía, luego hasta 13 ciclos adyuvantes de pembrolizumab en monoterapia',
  drugs: [
    { name: 'Pembrolizumab (fase neoadyuvante)', dose: { type: 'flat', value: 200, unit: 'mg' }, day: 'D1 c/21 días × 4' },
    { name: 'Cisplatino o carboplatino + doblete', dose: { type: 'text', value: 'esquema con platino, elegido según histología' }, day: 'D1' },
    { name: 'Pembrolizumab (fase adyuvante)', dose: { type: 'flat', value: 200, unit: 'mg' }, day: 'D1 c/21 días, hasta 13 ciclos' }
  ],
  refs: [{ name: 'KEYNOTE-671', pmid: '37272513' }]
};

R.regimens['pulm-durvalumab-consolidacion'] = {
  name: 'Durvalumab de consolidación post-QRT',
  cycle: 'cada 14 días, hasta 12 meses o hasta progresión/toxicidad inaceptable',
  drugs: [
    { name: 'Durvalumab', dose: { type: 'kg', value: 10, unit: 'mg' }, day: 'D1' }
  ],
  notes: ['Iniciar dentro de los 42 días de finalizada la quimiorradioterapia concurrente, sin progresión.'],
  refs: [{ name: 'PACIFIC', pmid: '28885881' }]
};

R.regimens['pulm-atezolizumab-adj'] = {
  name: 'Atezolizumab adyuvante',
  cycle: 'cada 21 días, hasta 16 ciclos (~1 año) o hasta progresión/toxicidad',
  drugs: [
    { name: 'Atezolizumab', dose: { type: 'flat', value: 1200, unit: 'mg' }, day: 'D1' }
  ],
  notes: ['Post quimioterapia adyuvante con platino, en tumores PD-L1 ≥ 1%.'],
  refs: [{ name: 'IMpower010', pmid: '34555333' }]
};

R.regimens['pulm-pembrolizumab-adj'] = {
  name: 'Pembrolizumab adyuvante',
  cycle: 'cada 21 días, hasta 18 ciclos (~1 año) o hasta progresión/toxicidad',
  drugs: [
    { name: 'Pembrolizumab', dose: { type: 'flat', value: 200, unit: 'mg' }, day: 'D1' }
  ],
  notes: ['Post quimioterapia adyuvante con platino, independiente de PD-L1.'],
  refs: [{ name: 'KEYNOTE-091', pmid: '36108662' }]
};

/* ---------- Quimioterapia convencional ---------- */

R.regimens['pulm-cis-pem'] = {
  name: 'Cisplatino + Pemetrexed',
  cycle: 'cada 21 días × 4 (adyuvante) o hasta progresión con mantenimiento de pemetrexed (avanzado)',
  drugs: [
    { name: 'Cisplatino', dose: { type: 'm2', value: 75, unit: 'mg' }, day: 'D1' },
    { name: 'Pemetrexed', dose: { type: 'm2', value: 500, unit: 'mg' }, day: 'D1' }
  ],
  notes: ['Sólo histología no escamosa.', 'Ácido fólico + vitamina B12 antes de pemetrexed.'],
  refs: [{ name: 'Scagliotti 2008 (cisplatino + pemetrexed)', pmid: '18506025' }]
};

R.regimens['pulm-cis-vinorelbina'] = {
  name: 'Cisplatino + Vinorelbina',
  cycle: 'cada 21 días × 4 ciclos (adyuvancia)',
  drugs: [
    { name: 'Cisplatino', dose: { type: 'm2', value: 75, unit: 'mg' }, day: 'D1' },
    { name: 'Vinorelbina', dose: { type: 'm2', value: 25, unit: 'mg' }, day: 'D1, D8' }
  ],
  refs: [{ name: 'LACE (metaanálisis QT adyuvante)', pmid: '18506026' }]
};

R.regimens['pulm-carbo-pac'] = {
  name: 'Carboplatino + Paclitaxel',
  cycle: 'cada 21 días × 4–6 ciclos',
  drugs: [
    { name: 'Carboplatino', dose: { type: 'auc', value: 6 }, day: 'D1' },
    { name: 'Paclitaxel', dose: { type: 'm2', value: 200, unit: 'mg' }, day: 'D1' }
  ],
  refs: [{ name: 'LACE (metaanálisis QT adyuvante)', pmid: '18506026' }]
};

R.regimens['pulm-docetaxel'] = {
  name: 'Docetaxel',
  cycle: 'cada 21 días, hasta progresión o toxicidad inaceptable',
  drugs: [
    { name: 'Docetaxel', dose: { type: 'm2', value: 75, unit: 'mg' }, day: 'D1' }
  ],
  refs: [{ name: 'TAX 317', pmid: '10811675' }]
};

R.regimens['pulm-docetaxel-ramucirumab'] = {
  name: 'Docetaxel + Ramucirumab',
  cycle: 'cada 21 días, hasta progresión o toxicidad inaceptable',
  drugs: [
    { name: 'Docetaxel', dose: { type: 'm2', value: 75, unit: 'mg' }, day: 'D1' },
    { name: 'Ramucirumab', dose: { type: 'kg', value: 10, unit: 'mg' }, day: 'D1' }
  ],
  refs: [{ name: 'REVEL', pmid: '24933332' }]
};

})(window.FNRO = window.FNRO || {});
