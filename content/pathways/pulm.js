/* Vía terapéutica — Cáncer de pulmón no microcítico (CPCNP / NSCLC)
   Borrador asistido por IA. Fuentes: ensayos pivotales (PMIDs verificados),
   aprobaciones FDA/EMA, y resumen con palabras propias de las Pautas de
   Oncología Médica HC/UdelaR y de guías de sociedades oncológicas europeas.
   Cobertura FNR según normativa vigente en content/fnr.js (ids u-adj, u-1g,
   u-osi, u-alec, u-io, u-abcp). Ante cualquier duda de cobertura o evidencia
   se usó cov:{t:'?'} o {t:'NC'} con nota explicativa; no se inventó cobertura. */
(function (R) {
"use strict";
R.pathways = R.pathways || {};

R.pathways.pulm = {
  tumor: 'pulm',
  title: 'Cáncer de pulmón no microcítico',
  status: 'borrador',
  updated: '2026-09-28',
  authors: ['Borrador asistido por IA'],
  start: 'eval-inicial',
  nodes: {

    /* ================= EVALUACIÓN INICIAL ================= */
    'eval-inicial': {
      type: 'rec',
      title: 'Evaluación inicial',
      phase: 'evaluación',
      items: [
        { label: 'Anatomía patológica: histología (adenocarcinoma, escamoso, etc.) y subtipo', cov: { t: 'NA' } },
        { label: 'Panel molecular: EGFR, ALK, ROS1, KRAS, BRAF, MET (exón 14), RET, NTRK', detail: 'Reflejo obligatorio en no escamoso/no fumador; considerar también en escamoso si nunca fumador', cov: { t: 'NA' } },
        { label: 'PD-L1 por IHQ (método validado, TPS)', cov: { t: 'NA' } },
        { label: 'Estadificación: TC de tórax/abdomen, PET-TC si disponible, RNM/TC de cráneo si síntomas', cov: { t: 'NA' } },
        { label: 'Estadificación mediastínica invasiva (EBUS/mediastinoscopia) si hay sospecha N2/N3 o previo a cirugía en estadios II–III', cov: { t: 'NA' } },
        { label: 'Evaluación funcional respiratoria y cardiovascular si se considera cirugía o RT torácica', cov: { t: 'NA' } }
      ],
      next: [ { label: 'Continuar', next: 'q-estadio' } ]
    },

    'q-estadio': {
      type: 'q',
      text: '¿Cuál es el estadio clínico (TNM 9ª ed.) y el escenario?',
      options: [
        { label: 'Estadio 0–IB, potencialmente resecable', next: 'q-operable-temprano', stages: ['0','IA1','IA2','IA3','IB'] },
        { label: 'Estadio IIA–IIB, potencialmente resecable', next: 'q-operable-ii', stages: ['IIA','IIB'] },
        { label: 'Estadio III (IIIA–IIIC)', next: 'q-resecable-iii', stages: ['IIIA','IIIB','IIIC'] },
        { label: 'Estadio IV o recaída metastásica', next: 'av-driver', stages: ['IVA','IVB'] }
      ]
    },

    /* ================= ESTADIO 0–IB ================= */
    'q-operable-temprano': {
      type: 'q',
      text: '¿Es candidato a cirugía?',
      options: [
        { label: 'Operable', next: 'cirugia-temprana' },
        { label: 'No operable (comorbilidad, función pulmonar)', next: 'sbrt-temprano' }
      ]
    },
    'cirugia-temprana': {
      type: 'rec',
      title: 'Cirugía con intención curativa',
      phase: 'primario',
      items: [
        { label: 'Lobectomía (o resección sublobar en tumores muy pequeños/comorbilidad) + linfadenectomía mediastínica sistemática', cov: { t: 'NA' } }
      ],
      next: [ { label: 'Anatomía patológica postoperatoria', next: 'adj-decision-temprano' } ]
    },
    'sbrt-temprano': {
      type: 'rec',
      title: 'Radioterapia estereotáctica corporal (SBRT)',
      phase: 'primario',
      items: [
        { label: 'SBRT sobre el tumor primario, dosis ablativa fraccionada según protocolo de radioterapia', cov: { t: 'NA' } }
      ],
      next: [ { label: 'Seguimiento', next: 'seguimiento' } ]
    },
    'adj-decision-temprano': {
      type: 'q',
      text: '¿Resultado del panel molecular y riesgo de recaída en estadio IA–IB resecado?',
      options: [
        { label: 'EGFR Ex19del/L858R positivo', next: 'adj-egfr-temprano' },
        { label: 'PD-L1 ≥ 1% (sin driver EGFR/ALK)', next: 'adj-pdl1-temprano' },
        { label: 'Bajo riesgo / sin indicación de terapia sistémica adyuvante', next: 'seguimiento' }
      ]
    },
    'adj-egfr-temprano': {
      type: 'rec',
      title: 'EGFR mutado, adyuvancia (estadio IB–IIA resecado)',
      phase: 'adyuvancia',
      items: [
        {
          label: 'Osimertinib 80 mg/día × 3 años',
          detail: 'ADAURA incluyó estadios IB–IIIA; la normativa FNR vigente sólo cubre adyuvancia en estadio IIIA (u-adj). En IB–IIA verificar cobertura institucional/FTM antes de indicar.',
          regimen: 'pulm-osimertinib-adj',
          level: 'A',
          refs: [ { name: 'ADAURA (DFS)', pmid: '32955177' }, { name: 'ADAURA (SG)', pmid: '37272535' } ],
          cov: { t: '?' }
        }
      ],
      next: [ { label: 'Seguimiento', next: 'seguimiento' } ]
    },
    'adj-pdl1-temprano': {
      type: 'rec',
      title: 'PD-L1 positivo sin driver, adyuvancia (estadio IB–IIA resecado)',
      phase: 'adyuvancia',
      items: [
        {
          label: 'Atezolizumab 1200 mg IV c/21 días × 16 ciclos (post-QT adyuvante con platino)',
          detail: 'IMpower010 incluyó estadio IB–IIIA con PD-L1 ≥ 1%; en IB la evidencia de beneficio es más marginal',
          regimen: 'pulm-atezolizumab-adj',
          level: 'C',
          refs: [ { name: 'IMpower010', pmid: '34555333' } ],
          cov: { t: 'NC' }
        }
      ],
      notes: ['No integra la normativa FNR vigente para pulmón; verificar cobertura institucional o FTM.'],
      next: [ { label: 'Seguimiento', next: 'seguimiento' } ]
    },

    /* ================= ESTADIO IIA–IIB ================= */
    'q-operable-ii': {
      type: 'q',
      text: '¿Es candidato a cirugía?',
      options: [
        { label: 'Operable', next: 'q-perioperatorio-ii' },
        { label: 'No operable', next: 'sbrt-temprano' }
      ]
    },
    'q-perioperatorio-ii': {
      type: 'q',
      text: '¿Se considera terapia perioperatoria (quimioinmunoterapia neoadyuvante) antes de la cirugía?',
      help: 'Aplica sobre todo si no hay driver EGFR/ALK conocido',
      options: [
        { label: 'Sí, iniciar neoadyuvancia', next: 'neo-io-ii' },
        { label: 'No, cirugía directa', next: 'cirugia-ii' }
      ]
    },
    'neo-io-ii': {
      type: 'rec',
      title: 'Quimioinmunoterapia neoadyuvante (± adyuvancia perioperatoria)',
      phase: 'neoadyuvancia',
      items: [
        {
          label: 'Nivolumab + QT con platino, 3 ciclos preoperatorios',
          detail: 'Sin inmunoterapia adyuvante posterior en el esquema evaluado por CheckMate 816',
          regimen: 'pulm-nivolumab-neo',
          level: 'A',
          refs: [ { name: 'CheckMate 816', pmid: '35403841' } ],
          cov: { t: 'NC' }
        },
        {
          label: 'Pembrolizumab + QT con platino neoadyuvante (4 ciclos) + pembrolizumab adyuvante (hasta 13 ciclos)',
          regimen: 'pulm-pembrolizumab-perioperatorio',
          level: 'A',
          refs: [ { name: 'KEYNOTE-671', pmid: '37272513' } ],
          cov: { t: 'NC' }
        }
      ],
      notes: ['Ninguno de los dos esquemas perioperatorios integra la normativa FNR vigente para pulmón; verificar cobertura institucional antes de indicar.'],
      next: [ { label: 'Cirugía', next: 'cirugia-ii-post-neo' } ]
    },
    'cirugia-ii-post-neo': {
      type: 'rec',
      title: 'Cirugía post-neoadyuvancia',
      phase: 'primario',
      items: [
        { label: 'Lobectomía o resección anatómica + linfadenectomía mediastínica, según respuesta y resecabilidad', cov: { t: 'NA' } }
      ],
      next: [ { label: 'Continuar adyuvancia si corresponde / seguimiento', next: 'seguimiento' } ]
    },
    'cirugia-ii': {
      type: 'rec',
      title: 'Cirugía con intención curativa',
      phase: 'primario',
      items: [
        { label: 'Lobectomía (o resección anatómica mayor si se requiere) + linfadenectomía mediastínica sistemática', cov: { t: 'NA' } }
      ],
      next: [ { label: 'Anatomía patológica postoperatoria', next: 'adj-decision-ii' } ]
    },
    'adj-decision-ii': {
      type: 'q',
      text: '¿Resultado del panel molecular y PD-L1 en la pieza resecada (estadio II–IIIA)?',
      options: [
        { label: 'EGFR Ex19del/L858R positivo', next: 'adj-egfr-ii' },
        { label: 'PD-L1 ≥ 1% (sin driver EGFR/ALK)', next: 'adj-pdl1-ii' },
        { label: 'QT adyuvante con platino sin biomarcador accionable', next: 'adj-qt-ii' },
        { label: 'Sin indicación de terapia adyuvante', next: 'seguimiento' }
      ]
    },
    'adj-egfr-ii': {
      type: 'rec',
      title: 'EGFR mutado, adyuvancia (estadio II–IIIA resecado)',
      phase: 'adyuvancia',
      items: [
        {
          label: 'Osimertinib 80 mg/día × 3 años',
          detail: 'FNR cubre esta indicación específicamente en estadio IIIA (indicación u-adj)',
          regimen: 'pulm-osimertinib-adj',
          level: 'A',
          refs: [ { name: 'ADAURA (DFS)', pmid: '32955177' }, { name: 'ADAURA (SG)', pmid: '37272535' } ],
          cov: { t: 'FNR', ind: 'u-adj' }
        }
      ],
      notes: ['En estadio II la evidencia de ADAURA es igual de sólida, pero la cobertura FNR vigente sólo nombra IIIA; confirmar con FNR antes de asumir cobertura en II.'],
      next: [ { label: 'Seguimiento', next: 'seguimiento' } ]
    },
    'adj-pdl1-ii': {
      type: 'rec',
      title: 'PD-L1 positivo sin driver, adyuvancia (estadio II–IIIA resecado)',
      phase: 'adyuvancia',
      items: [
        {
          label: 'Atezolizumab 1200 mg IV c/21 días × 16 ciclos (post-QT adyuvante con platino)',
          regimen: 'pulm-atezolizumab-adj',
          level: 'A',
          refs: [ { name: 'IMpower010', pmid: '34555333' } ],
          cov: { t: 'NC' }
        },
        {
          label: 'Pembrolizumab 200 mg IV c/21 días × 18 ciclos (post-QT adyuvante con platino, independiente de PD-L1)',
          regimen: 'pulm-pembrolizumab-adj',
          level: 'A',
          refs: [ { name: 'KEYNOTE-091', pmid: '36108662' } ],
          cov: { t: 'NC' }
        }
      ],
      notes: ['No integran la normativa FNR vigente; verificar cobertura institucional.'],
      next: [ { label: 'Seguimiento', next: 'seguimiento' } ]
    },
    'adj-qt-ii': {
      type: 'rec',
      title: 'Quimioterapia adyuvante con platino (sin biomarcador accionable)',
      phase: 'adyuvancia',
      items: [
        {
          label: 'Cisplatino + Vinorelbina, 4 ciclos',
          regimen: 'pulm-cis-vinorelbina',
          level: 'A',
          refs: [ { name: 'LACE (metaanálisis)', pmid: '18506026' } ],
          cov: { t: 'FTM' }
        },
        {
          label: 'Cisplatino + Pemetrexed, 4 ciclos (no escamoso)',
          detail: 'Extrapolación: los ensayos del metaanálisis LACE no usaron pemetrexed; se acepta como doblete de cisplatino alternativo en no escamosos.',
          regimen: 'pulm-cis-pem',
          level: 'C',
          refs: [ { name: 'LACE (metaanálisis)', pmid: '18506026' } ],
          cov: { t: 'FTM' }
        }
      ],
      next: [ { label: 'Reevaluar PD-L1 para adyuvancia con IO', next: 'adj-pdl1-ii' }, { label: 'Seguimiento', next: 'seguimiento' } ]
    },

    /* ================= ESTADIO III ================= */
    'q-resecable-iii': {
      type: 'q',
      text: '¿La enfermedad en estadio III es resecable (evaluación multidisciplinaria, incluida estadificación mediastínica invasiva)?',
      options: [
        { label: 'Resecable (generalmente IIIA, N2 de una estación)', next: 'q-perioperatorio-iii', stages: ['IIIA'] },
        { label: 'Irresecable (N2 multiestación/N3, o T4 no resecable)', next: 'qrt-irresecable', stages: ['IIIB','IIIC'] }
      ]
    },
    'q-perioperatorio-iii': {
      type: 'q',
      text: '¿Terapia perioperatoria (quimioinmunoterapia neoadyuvante ± adyuvante) antes de la cirugía?',
      options: [
        { label: 'Sí', next: 'neo-io-iii' },
        { label: 'No, cirugía directa (o driver EGFR/ALK conocido)', next: 'cirugia-iii' }
      ]
    },
    'neo-io-iii': {
      type: 'rec',
      title: 'Quimioinmunoterapia neoadyuvante (± adyuvancia perioperatoria), estadio III resecable',
      phase: 'neoadyuvancia',
      items: [
        {
          label: 'Nivolumab + QT con platino, 3 ciclos preoperatorios',
          regimen: 'pulm-nivolumab-neo',
          level: 'A',
          refs: [ { name: 'CheckMate 816', pmid: '35403841' } ],
          cov: { t: 'NC' }
        },
        {
          label: 'Pembrolizumab + QT con platino neoadyuvante (4 ciclos) + pembrolizumab adyuvante (hasta 13 ciclos)',
          regimen: 'pulm-pembrolizumab-perioperatorio',
          level: 'A',
          refs: [ { name: 'KEYNOTE-671', pmid: '37272513' } ],
          cov: { t: 'NC' }
        }
      ],
      notes: ['No integran la normativa FNR vigente para pulmón; verificar cobertura institucional.'],
      next: [ { label: 'Cirugía', next: 'cirugia-ii-post-neo' } ]
    },
    'cirugia-iii': {
      type: 'rec',
      title: 'Cirugía con intención curativa (estadio IIIA resecable)',
      phase: 'primario',
      items: [
        { label: 'Resección anatómica (lobectomía, bilobectomía o neumonectomía según extensión) + linfadenectomía mediastínica sistemática', cov: { t: 'NA' } }
      ],
      next: [ { label: 'Anatomía patológica postoperatoria', next: 'adj-decision-ii' } ]
    },
    'qrt-irresecable': {
      type: 'rec',
      title: 'Quimiorradioterapia concurrente (estadio III irresecable)',
      phase: 'primario',
      items: [
        { label: 'RT torácica concurrente con QT basada en platino (esquema con cisplatino semanal o cada 21 días, según protocolo de radioterapia)', cov: { t: 'NA' } }
      ],
      next: [ { label: 'Sin progresión tras QRT', next: 'q-consolidacion' }, { label: 'Progresión durante/post QRT', next: 'av-pdl1' } ]
    },
    'q-consolidacion': {
      type: 'q',
      text: '¿Hay driver EGFR/ALK conocido?',
      options: [
        { label: 'EGFR/ALK negativo (o no estudiado)', next: 'consolidacion-durva' },
        { label: 'EGFR mutado', next: 'consolidacion-egfr' }
      ]
    },
    'consolidacion-durva': {
      type: 'rec',
      title: 'Consolidación con durvalumab post-QRT',
      phase: 'consolidación',
      items: [
        {
          label: 'Durvalumab 10 mg/kg IV c/14 días, hasta 12 meses',
          detail: 'Iniciar dentro de 42 días de finalizada la QRT concurrente, sin progresión',
          regimen: 'pulm-durvalumab-consolidacion',
          level: 'A',
          refs: [ { name: 'PACIFIC', pmid: '28885881' } ],
          cov: { t: 'NC' }
        }
      ],
      notes: ['No integra la normativa FNR vigente para pulmón; verificar cobertura institucional.'],
      next: [ { label: 'Seguimiento', next: 'seguimiento' } ]
    },
    'consolidacion-egfr': {
      type: 'rec',
      title: 'Estadio III EGFR mutado post-QRT',
      phase: 'consolidación',
      items: [
        {
          label: 'Osimertinib de consolidación/adyuvancia post-QRT',
          detail: 'LAURA: osimertinib tras QRT mejoró la sobrevida libre de progresión en estadio III irresecable EGFR mutado; la sobrevida global todavía era inmadura. En el subgrupo EGFR de PACIFIC, durvalumab no mostró beneficio claro.',
          regimen: 'pulm-osimertinib-1l',
          level: 'B',
          refs: [ { name: 'LAURA', pmid: '38828946' } ],
          cov: { t: '?' }
        }
      ],
      notes: ['Escenario no cubierto por la normativa FNR de pulmón vigente; requiere confirmación puntual.'],
      next: [ { label: 'Seguimiento', next: 'seguimiento' } ]
    },

    /* ================= ESTADIO IV / METASTÁSICO — POR DRIVER ================= */
    'av-driver': {
      type: 'q',
      text: '¿Cuál es el resultado del panel molecular (enfermedad avanzada/metastásica)?',
      options: [
        { label: 'EGFR Ex19del/L858R (u otra sensibilizante)', next: 'av-egfr' },
        { label: 'ALK positivo', next: 'av-alk' },
        { label: 'ROS1 positivo', next: 'av-ros1' },
        { label: 'KRAS G12C', next: 'av-kras' },
        { label: 'MET (exón 14), RET, BRAF V600E o NTRK', next: 'av-otros-drivers' },
        { label: 'Sin driver conocido', next: 'av-pdl1' }
      ]
    },

    'av-egfr': {
      type: 'rec',
      title: 'EGFR mutado (Ex19del / L858R), 1ª línea',
      phase: 'avanzada · 1ª línea',
      items: [
        {
          label: 'Osimertinib 80 mg/día',
          regimen: 'pulm-osimertinib-1l',
          level: 'A',
          refs: [ { name: 'FLAURA', pmid: '29151359' }, { name: 'FLAURA, sobrevida global', pmid: '31751012' } ],
          cov: { t: 'FNR', ind: 'u-osi' }
        },
        {
          label: 'Erlotinib 150 mg/día o gefitinib 250 mg/día',
          detail: 'Alternativa de 1ª generación; si progresa con T790M+ se puede rotar a osimertinib',
          regimen: 'pulm-erlotinib',
          level: 'B',
          refs: [ { name: 'EURTAC', pmid: '22285168' }, { name: 'IPASS', pmid: '19692680' } ],
          cov: { t: 'FNR', ind: 'u-1g' }
        }
      ],
      next: [ { label: 'Progresión', next: 'av-egfr-2l' } ]
    },
    'av-egfr-2l': {
      type: 'q',
      text: '¿Recibió erlotinib/gefitinib en 1ª línea y progresa con T790M+, o venía con osimertinib?',
      options: [
        { label: 'Progresión post 1ª/2ª generación, T790M+', next: 'av-egfr-2l-osi' },
        { label: 'Progresión post osimertinib (u otro escenario sin T790M accionable)', next: 'av-2l-chemo' }
      ]
    },
    'av-egfr-2l-osi': {
      type: 'rec',
      title: 'Osimertinib 2ª línea (T790M+ tras TKI de 1ª/2ª generación)',
      phase: 'avanzada · 2ª línea',
      items: [
        {
          label: 'Osimertinib 80 mg/día',
          regimen: 'pulm-osimertinib-2l',
          level: 'B',
          detail: 'La normativa FNR de osimertinib (u-osi) exige no haber recibido tratamiento sistémico previo para la enfermedad avanzada: tras gefitinib/erlotinib la cobertura se discute caso a caso.',
          refs: [ { name: 'AURA3', pmid: '27959700' } ],
          cov: { t: '?' }
        }
      ],
      notes: ['La normativa FNR contempla el cambio desde gefitinib/erlotinib como caso individualizado; confirmar ventana temporal vigente.'],
      next: [ { label: 'Progresión', next: 'av-2l-chemo' } ]
    },

    'av-alk': {
      type: 'rec',
      title: 'ALK positivo, 1ª línea',
      phase: 'avanzada · 1ª línea',
      items: [
        {
          label: 'Alectinib 600 mg c/12 h',
          regimen: 'pulm-alectinib',
          level: 'B',
          refs: [ { name: 'ALEX', pmid: '28586279' } ],
          cov: { t: 'FNR', ind: 'u-alec' }
        }
      ],
      next: [ { label: 'Progresión', next: 'av-alk-2l' } ]
    },
    'av-alk-2l': {
      type: 'rec',
      title: 'ALK positivo, progresión post-alectinib',
      phase: 'avanzada · 2ª línea',
      items: [
        {
          label: 'Lorlatinib 100 mg/día',
          detail: 'Tras alectinib la evidencia es de fase II de un solo brazo; CROWN (citado) probó lorlatinib en 1ª línea y aquí se usa como extrapolación.',
          regimen: 'pulm-lorlatinib',
          level: 'C',
          refs: [ { name: 'CROWN (1ª línea; extrapolación)', pmid: '33207094' } ],
          cov: { t: 'NC' }
        },
        {
          label: 'Brigatinib 180 mg/día (lead-in 90 mg × 7 d)',
          detail: 'Tras alectinib la actividad de brigatinib es modesta y proviene de estudios de un solo brazo; ALTA-1L (citado) fue en 1ª línea.',
          regimen: 'pulm-brigatinib',
          level: 'C',
          refs: [ { name: 'ALTA-1L (1ª línea; extrapolación)', pmid: '30280657' } ],
          cov: { t: 'NC' }
        }
      ],
      notes: ['Ningún ALK-TKI de 2ª/3ª generación distinto de alectinib integra la normativa FNR vigente; verificar cobertura institucional.'],
      next: [ { label: 'Progresión', next: 'av-2l-chemo' } ]
    },

    'av-ros1': {
      type: 'rec',
      title: 'ROS1 positivo, 1ª línea',
      phase: 'avanzada · 1ª línea',
      items: [
        {
          label: 'Crizotinib 250 mg c/12 h',
          regimen: 'pulm-crizotinib-ros1',
          level: 'C',
          refs: [ { name: 'PROFILE 1001', pmid: '30980071' } ],
          cov: { t: 'NC' }
        }
      ],
      notes: ['ROS1 no integra la normativa FNR de pulmón vigente; verificar cobertura institucional.'],
      next: [ { label: 'Progresión', next: 'av-2l-chemo' } ]
    },

    'av-kras': {
      type: 'rec',
      title: 'KRAS G12C, ≥ 2ª línea',
      phase: 'avanzada · 2ª línea',
      items: [
        {
          label: 'Sotorasib 960 mg/día',
          detail: 'Tras progresión a QT/inmunoterapia de 1ª línea',
          regimen: 'pulm-sotorasib',
          level: 'B',
          refs: [ { name: 'CodeBreaK 200', pmid: '36764316' } ],
          cov: { t: 'NC' }
        }
      ],
      notes: ['KRAS G12C no integra la normativa FNR de pulmón vigente; en 1ª línea se maneja según PD-L1 (ver rama sin driver).'],
      next: [ { label: '1ª línea sin terapia dirigida disponible / progresión', next: 'av-pdl1' } ]
    },

    'av-otros-drivers': {
      type: 'rec',
      title: 'MET exón 14, RET, BRAF V600E o NTRK positivos',
      phase: 'avanzada · 1ª línea',
      items: [
        {
          label: 'Terapia dirigida específica (p. ej. capmatinib/tepotinib para MET, selpercatinib/pralsetinib para RET, dabrafenib+trametinib para BRAF V600E, entrectinib/larotrectinib para NTRK)',
          detail: 'Cada alteración tiene aprobación regulatoria específica (FDA/EMA) con evidencia de fase II de un solo brazo en su mayoría; no se detalla dosis por régimen individual dada la baja frecuencia',
          level: 'C',
          refs: [ { name: 'GEOMETRY mono-1 (capmatinib, MET)', pmid: '32877583' }, { name: 'LIBRETTO-001 (selpercatinib, RET)', pmid: '32846060' }, { name: 'Dabrafenib + trametinib (BRAF V600E)', pmid: '27283860' }, { name: 'Entrectinib (NTRK), análisis integrado', pmid: '31838007' } ],
          cov: { t: '?' }
        }
      ],
      notes: ['Drivers infrecuentes: no integran la normativa FNR de pulmón vigente. Evaluar caso a caso, verificar aprobación regulatoria vigente en Uruguay y disponibilidad institucional. [Dato confirmado: existen aprobaciones FDA/EMA específicas para cada alteración; extrapolación: no se buscó el PMID de cada ensayo individual por tratarse de alteraciones de baja frecuencia y quedar fuera del foco de cobertura FNR.]'],
      next: [ { label: 'Progresión / sin terapia dirigida disponible', next: 'av-pdl1' } ]
    },

    /* ================= ESTADIO IV / METASTÁSICO — SIN DRIVER, POR PD-L1 ================= */
    'av-pdl1': {
      type: 'q',
      text: '¿Cuál es el nivel de PD-L1 y la histología (sin driver EGFR/ALK)?',
      options: [
        { label: 'PD-L1 ≥ 50%', next: 'av-pdl1-alto' },
        { label: 'PD-L1 1–49%, histología no escamosa', next: 'av-abcp' },
        { label: 'PD-L1 < 1%, o escamoso con PD-L1 1–49%', next: 'av-quimio-io' }
      ]
    },
    'av-pdl1-alto': {
      type: 'rec',
      title: 'PD-L1 ≥ 50%, sin driver, 1ª línea',
      phase: 'avanzada · 1ª línea',
      items: [
        {
          label: 'Pembrolizumab 200 mg IV c/21 días, hasta 35 ciclos',
          regimen: 'pulm-pembrolizumab-mono',
          level: 'A',
          refs: [ { name: 'KEYNOTE-024', pmid: '27718847' } ],
          cov: { t: 'FNR', ind: 'u-io' }
        },
        {
          label: 'Atezolizumab 1200 mg IV c/21 días (o 1875 mg SC)',
          regimen: 'pulm-atezolizumab-mono',
          level: 'A',
          refs: [ { name: 'IMpower110', pmid: '32997907' } ],
          cov: { t: 'FNR', ind: 'u-io' }
        }
      ],
      next: [ { label: 'Progresión', next: 'av-2l-general' } ]
    },
    'av-abcp': {
      type: 'rec',
      title: 'PD-L1 1–49%, no escamoso, 1ª línea',
      phase: 'avanzada · 1ª línea',
      items: [
        {
          label: 'Atezolizumab + Bevacizumab + Carboplatino + Paclitaxel (ABCP)',
          regimen: 'pulm-abcp',
          level: 'A',
          refs: [ { name: 'IMpower150', pmid: '29863955' } ],
          cov: { t: 'FNR', ind: 'u-abcp' }
        },
        {
          label: 'Pembrolizumab 1 % ≤ PD-L1 < 50 %: alternativa en monoterapia según KEYNOTE-042',
          detail: 'Opción si no se desea o tolera el esquema con bevacizumab. El beneficio en el subgrupo 1–49 % surge de un análisis exploratorio: la sobrevida global mejoró sobre todo a expensas de PD-L1 ≥ 50 %.',
          regimen: 'pulm-pembrolizumab-mono',
          level: 'C',
          refs: [ { name: 'KEYNOTE-042', pmid: '30955977' } ],
          cov: { t: 'FNR', ind: 'u-io' }
        }
      ],
      next: [ { label: 'Progresión', next: 'av-2l-general' } ]
    },
    'av-quimio-io': {
      type: 'rec',
      title: 'PD-L1 < 1% (o escamoso 1–49%), 1ª línea',
      phase: 'avanzada · 1ª línea',
      items: [
        {
          label: 'Carboplatino/Cisplatino + Pemetrexed + Pembrolizumab (no escamoso)',
          regimen: 'pulm-carbo-pem-pembro',
          level: 'A',
          refs: [ { name: 'KEYNOTE-189', pmid: '29658856' } ],
          cov: { t: '?' }
        },
        {
          label: 'Carboplatino + Paclitaxel/nab-paclitaxel + Pembrolizumab (escamoso)',
          regimen: 'pulm-carbo-tax-pembro',
          level: 'A',
          refs: [ { name: 'KEYNOTE-407', pmid: '30280635' } ],
          cov: { t: '?' }
        },
        {
          label: 'QT doblete con platino sola (si IO+QT no está disponible)',
          detail: 'No escamoso: cisplatino/carboplatino + pemetrexed; escamoso: carboplatino + paclitaxel',
          regimen: 'pulm-cis-pem',
          level: 'A',
          refs: [ { name: 'Scagliotti 2008 (cisplatino + pemetrexed)', pmid: '18506025' } ],
          cov: { t: 'FTM' }
        }
      ],
      notes: ['La normativa FNR vigente cubre pembrolizumab/atezolizumab en monoterapia según PD-L1 (u-io), pero no menciona explícitamente su combinación con quimioterapia: confirmar con el FNR antes de indicar el esquema combinado.'],
      next: [ { label: 'Progresión', next: 'av-2l-general' } ]
    },

    /* ================= 2ª LÍNEA GENERAL / SEGUIMIENTO ================= */
    'av-2l-general': {
      type: 'rec',
      title: '2ª línea, enfermedad avanzada sin driver (progresión post-IO ± QT)',
      phase: 'avanzada · 2ª línea',
      items: [
        {
          label: 'Docetaxel 75 mg/m² c/21 días',
          regimen: 'pulm-docetaxel',
          level: 'A',
          refs: [ { name: 'TAX 317', pmid: '10811675' } ],
          cov: { t: 'FTM' }
        },
        {
          label: 'Docetaxel + Ramucirumab',
          detail: 'Mayor beneficio de SLP/SG que docetaxel solo, a costa de más toxicidad',
          regimen: 'pulm-docetaxel-ramucirumab',
          level: 'A',
          refs: [ { name: 'REVEL', pmid: '24933332' } ],
          cov: { t: '?' }
        }
      ],
      next: [ { label: 'Seguimiento', next: 'seguimiento' } ]
    },
    'av-2l-chemo': {
      type: 'rec',
      title: '2ª línea tras progresión a terapia dirigida (EGFR/ALK/ROS1), sin nueva mutación accionable',
      phase: 'avanzada · 2ª línea',
      items: [
        {
          label: 'Doblete de platino + pemetrexed (no escamoso), suspendiendo el inhibidor de EGFR',
          detail: 'En IMPRESS, continuar gefitinib junto con la QT no mejoró la sobrevida libre de progresión y sugirió peor sobrevida global. En progresión oligometastásica puede discutirse tratamiento local y seguir con el TKI.',
          regimen: 'pulm-cis-pem',
          level: 'B',
          refs: [ { name: 'IMPRESS', pmid: '26159065' } ],
          cov: { t: 'FTM' }
        },
        {
          label: 'Inmunoterapia + QT tras inhibidor de EGFR: sin beneficio demostrado, sólo individualizado',
          detail: 'KEYNOTE-789 y CheckMate 722 no mejoraron la sobrevida al agregar inmunoterapia a la QT tras progresión a TKI de EGFR.',
          level: 'C',
          refs: [ { name: 'KEYNOTE-789', nct: 'NCT03515837' }, { name: 'CheckMate 722', nct: 'NCT02864251' } ],
          cov: { t: '?' }
        }
      ],
      next: [ { label: 'Seguimiento', next: 'seguimiento' } ]
    },

    'seguimiento': {
      type: 'rec',
      title: 'Seguimiento',
      phase: 'seguimiento',
      items: [
        { label: 'Postoperatorio/curativo: TC de tórax cada 6 meses los primeros 2–3 años, luego anual', cov: { t: 'NA' } },
        { label: 'Enfermedad avanzada en tratamiento: reevaluación por RECIST cada 2–3 meses (según esquema)', cov: { t: 'NA' } },
        { label: 'Cesación tabáquica activa en todo paciente fumador', cov: { t: 'NA' } }
      ]
    }
  },
  notes: [
    'Vía de contenido clínico de referencia rápida; no reemplaza el juicio clínico ni la normativa FNR vigente, que debe consultarse en su texto completo ante cada solicitud.',
    'Las alteraciones moleculares infrecuentes (MET, RET, BRAF, NTRK) y varias líneas de terapia dirigida de rescate (ALK 2ª/3ª línea, ROS1, KRAS G12C) no están cubiertas por la normativa FNR de pulmón vigente; se marcaron como NC o "?" según corresponda.'
  ]
};

})(window.FNRO = window.FNRO || {});
