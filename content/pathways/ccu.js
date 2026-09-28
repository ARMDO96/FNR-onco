(function (R) {
  R.pathways = R.pathways || {};

  R.pathways.ccu = {
    tumor: 'ccu',
    title: 'Cáncer de cuello uterino',
    status: 'borrador',
    updated: '2026-09-28',
    authors: ['Borrador asistido por IA'],
    start: 'inicio',
    nodes: {

      'inicio': {
        type: 'rec',
        title: 'Evaluación inicial',
        phase: 'evaluación',
        items: [
          {
            label: 'Historia y examen ginecológico + biopsia con histología (confirmar tipo histológico)',
            level: 'A',
            refs: [{ name: 'Guía ESGO/ESTRO/ESP 2023, cáncer de cuello uterino (Cibula et al.)', pmid: '37127326' }, { name: 'Estadificación FIGO 2018 (Bhatla et al.)', pmid: '30656645' }],
            cov: { t: 'NA' }
          },
          {
            label: 'RM de pelvis con contraste (tamaño tumoral, invasión parametrial, ganglios)',
            detail: 'De elección para planificar cirugía o radioterapia en estadios ≥ IB1',
            level: 'B',
            refs: [{ name: 'Guía ESGO/ESTRO/ESP 2023, cáncer de cuello uterino (Cibula et al.)', pmid: '37127326' }],
            cov: { t: 'NA' }
          },
          {
            label: 'PET-TC de cuerpo entero',
            detail: 'Recomendado en enfermedad localmente avanzada (desde IB3, salvo IIA1), en estadios tempranos con ganglios sospechosos en la imagen y antes de quimiorradioterapia con intención curativa',
            level: 'B',
            refs: [{ name: 'Guía ESGO/ESTRO/ESP 2023, cáncer de cuello uterino (Cibula et al.)', pmid: '37127326' }],
            cov: { t: 'NA' }
          },
          {
            label: 'Determinación de PD-L1 (CPS) en tejido tumoral',
            detail: 'Reservar para escenario de enfermedad persistente/recurrente/metastásica, donde define elegibilidad a inmunoterapia',
            level: 'A',
            refs: [{ name: 'KEYNOTE-826', pmid: '34534429' }],
            cov: { t: 'NA' }
          }
        ],
        next: [ { label: 'Continuar a estadificación', next: 'q-estadio' } ]
      },

      'q-estadio': {
        type: 'q',
        text: '¿Cuál es el estadio FIGO 2018?',
        options: [
          { label: 'IA1 / IA2 (microinvasor)', next: 'q-ia', stages: ['IA1', 'IA2'] },
          { label: 'IB1 / IB2 / IIA1 (enfermedad temprana, ≤ 4 cm sin invasión vaginal alta)', next: 'q-temprano', stages: ['IB1', 'IB2', 'IIA1'] },
          { label: 'IB3–IVA (localmente avanzado, incluye compromiso parametrial/ganglionar)', next: 'la-qrt', stages: ['IB3', 'IIA2', 'IIB', 'IIIA', 'IIIB', 'IIIC1', 'IIIC2', 'IVA'] },
          { label: 'IVB o recaída / enfermedad persistente', next: 'avanzado-inicio', stages: ['IVB'] }
        ]
      },

      'q-ia': {
        type: 'q',
        text: 'IA1/IA2: ¿invasión linfovascular (ILV) y deseo de preservar fertilidad?',
        help: 'La presencia de ILV en IA1 equipara el manejo al de IA2',
        options: [
          { label: 'IA1 sin ILV, sin deseo de fertilidad', next: 'ia1-conizacion', stages: ['IA1'] },
          { label: 'IA1 con ILV, o IA2, sin deseo de fertilidad', next: 'ia-linfadenectomia', stages: ['IA2'] },
          { label: 'Deseo de preservar fertilidad (IA1 con ILV, IA2, o IB1 seleccionada)', next: 'ia-fertilidad' }
        ]
      },

      'ia1-conizacion': {
        type: 'rec',
        title: 'IA1 sin invasión linfovascular',
        phase: 'primario',
        items: [
          {
            label: 'Conización con márgenes negativos (o histerectomía simple si no desea más fertilidad)',
            detail: 'Riesgo de compromiso ganglionar despreciable; no requiere linfadenectomía',
            level: 'B',
            refs: [{ name: 'Guía ESGO/ESTRO/ESP 2023, cáncer de cuello uterino (Cibula et al.)', pmid: '37127326' }],
            cov: { t: 'NA' }
          }
        ],
        next: [ { label: 'Continuar', next: 'seguimiento' } ]
      },

      'ia-linfadenectomia': {
        type: 'rec',
        title: 'IA1 con ILV / IA2, sin deseo de fertilidad',
        phase: 'primario',
        items: [
          {
            label: 'Histerectomía simple (o conización con márgenes libres si se prefiere) + ganglio centinela, sin resección parametrial',
            detail: 'Según la guía ESGO 2023, la histerectomía radical o la parametrectomía son sobretratamiento en IA1 y la resección parametrial no está indicada en IA2. Estadificación ganglionar: ganglio centinela en IA1 con ILV; en IA2 con ILV corresponde evaluar los ganglios (linfadenectomía pélvica si no se identifica el centinela).',
            level: 'C',
            refs: [{ name: 'Guía ESGO/ESTRO/ESP 2023, cáncer de cuello uterino (Cibula et al.)', pmid: '37127326' }, { name: 'SHAPE, histerectomía simple vs. radical (Plante et al.)', pmid: '38416430' }],
            cov: { t: 'NA' }
          }
        ],
        next: [ { label: 'Continuar', next: 'q-adyuvancia-temprana' } ]
      },

      'ia-fertilidad': {
        type: 'rec',
        title: 'Preservación de fertilidad (IA1 con ILV, IA2 o IB1 seleccionada ≤ 2 cm)',
        phase: 'primario',
        items: [
          {
            label: 'IA1 con ILV o IA2: conización o traquelectomía simple + ganglio centinela. IB1 ≤ 2 cm con ILV: traquelectomía radical (tipo B) + ganglio centinela',
            detail: 'El estado ganglionar negativo es condición previa: el ganglio centinela va primero. Selección estricta: tumor ≤ 2 cm, histología favorable, sin compromiso del orificio cervical interno. En IB1 sin ILV también son adecuadas la conización o la traquelectomía simple.',
            level: 'C',
            refs: [{ name: 'Guía ESGO/ESTRO/ESP 2023, cáncer de cuello uterino (Cibula et al.)', pmid: '37127326' }],
            cov: { t: 'NA' }
          }
        ],
        next: [ { label: 'Continuar', next: 'seguimiento' } ]
      },

      'q-temprano': {
        type: 'q',
        text: 'IB1–IB2/IIA1: ¿candidata a cirugía radical?',
        help: 'Considerar comorbilidad, preferencia de la paciente y recursos quirúrgicos disponibles',
        options: [
          { label: 'Sí, cirugía radical', next: 'cx-radical' },
          { label: 'No candidata quirúrgica / prefiere manejo no quirúrgico', next: 'qrt-temprana' }
        ]
      },

      'cx-radical': {
        type: 'rec',
        title: 'Cirugía radical (IB1–IB2/IIA1)',
        phase: 'primario',
        items: [
          {
            label: 'Histerectomía radical + linfadenectomía pélvica (considerar ganglio centinela)',
            detail: 'El ensayo LACC mostró peor sobrevida libre de enfermedad y global con abordaje mínimamente invasivo: se prefiere la vía abierta',
            level: 'A',
            refs: [{ name: 'LACC', pmid: '30380365' }],
            cov: { t: 'NA' }
          }
        ],
        next: [ { label: 'Continuar', next: 'q-adyuvancia-temprana' } ]
      },

      'q-adyuvancia-temprana': {
        type: 'q',
        text: '¿Factores de riesgo en la pieza quirúrgica?',
        options: [
          { label: 'Alto riesgo: ganglios positivos, invasión parametrial o márgenes positivos', next: 'adyuvancia-qrt' },
          { label: 'Riesgo intermedio: ≥ 2 de tamaño tumoral, invasión estromal profunda, invasión linfovascular (criterios de Sedlis)', next: 'adyuvancia-rt' },
          { label: 'Sin factores de riesgo', next: 'seguimiento' }
        ]
      },

      'adyuvancia-qrt': {
        type: 'rec',
        title: 'Adyuvancia de alto riesgo',
        phase: 'adyuvancia',
        items: [
          {
            label: 'Radioterapia pélvica + cisplatino semanal concurrente',
            regimen: 'ccu-cisplatino-semanal',
            level: 'A',
            refs: [{ name: 'Peters (GOG-109/SWOG-8797)', pmid: '10764420' }],
            cov: { t: 'FTM' }
          }
        ],
        next: [ { label: 'Continuar', next: 'seguimiento' } ]
      },

      'adyuvancia-rt': {
        type: 'rec',
        title: 'Adyuvancia de riesgo intermedio (criterios de Sedlis)',
        phase: 'adyuvancia',
        items: [
          {
            label: 'Radioterapia pélvica adyuvante (sin quimioterapia)',
            detail: 'Reduce recurrencia locorregional frente a observación; el agregado de cisplatino concurrente es extrapolación del esquema de alto riesgo y no está establecido en este subgrupo',
            level: 'A',
            refs: [{ name: 'Sedlis (GOG-92)', pmid: '10329031' }],
            cov: { t: 'NA' }
          }
        ],
        next: [ { label: 'Continuar', next: 'seguimiento' } ]
      },

      'qrt-temprana': {
        type: 'rec',
        title: 'Quimiorradioterapia definitiva (alternativa a cirugía en enfermedad temprana)',
        phase: 'primario',
        items: [
          {
            label: 'Radioterapia externa pélvica + braquiterapia + cisplatino semanal concurrente',
            regimen: 'ccu-cisplatino-semanal',
            level: 'A',
            refs: [{ name: 'Rose (GOG-120)', pmid: '10202165' }],
            cov: { t: 'FTM' }
          }
        ],
        next: [ { label: 'Continuar', next: 'seguimiento' } ]
      },

      'la-qrt': {
        type: 'rec',
        title: 'Enfermedad localmente avanzada (IB3–IVA): quimiorradioterapia definitiva',
        phase: 'primario',
        items: [
          {
            label: 'Radioterapia externa pélvica + braquiterapia intracavitaria (componente esencial, no sustituible por dosis externa sola)',
            level: 'A',
            refs: [{ name: 'Guía ESGO/ESTRO/ESP 2023, cáncer de cuello uterino (Cibula et al.)', pmid: '37127326' }, { name: 'EMBRACE-I (Pötter et al.)', pmid: '33794207' }],
            cov: { t: 'NA' }
          },
          {
            label: 'Cisplatino semanal concurrente con la radioterapia',
            regimen: 'ccu-cisplatino-semanal',
            level: 'A',
            refs: [
              { name: 'Rose (GOG-120)', pmid: '10202165' },
              { name: 'Meta-análisis quimiorradioterapia concurrente', pmid: '12109823' }
            ],
            cov: { t: 'FTM' }
          }
        ],
        next: [
          { label: 'Considerar quimioterapia de inducción antes de iniciar', next: 'la-induccion' },
          { label: 'Considerar inmunoterapia concurrente/mantenimiento (en evaluación)', next: 'la-keynote-a18' },
          { label: 'Esquema completado', next: 'seguimiento' }
        ]
      },

      'la-induccion': {
        type: 'rec',
        title: 'Quimioterapia de inducción previa a quimiorradioterapia (IB3–IVA)',
        phase: 'neoadyuvancia',
        items: [
          {
            label: 'Carboplatino + paclitaxel semanal × 6, seguido de quimiorradioterapia definitiva',
            detail: 'Mejoró sobrevida libre de progresión y global frente a quimiorradioterapia sola; no debe retrasar el inicio de la radioterapia',
            regimen: 'ccu-induccion-carbo-pacli-semanal',
            level: 'A',
            refs: [{ name: 'INTERLACE', pmid: '39419054' }],
            cov: { t: 'FTM' }
          }
        ],
        next: [ { label: 'Continuar con quimiorradioterapia', next: 'seguimiento' } ]
      },

      'la-keynote-a18': {
        type: 'rec',
        title: 'Pembrolizumab concurrente y de mantenimiento con quimiorradioterapia (IB2–IIB con ganglios positivos, o III–IVA)',
        phase: 'primario',
        items: [
          {
            label: 'Pembrolizumab concurrente con quimiorradioterapia y luego en mantenimiento',
            detail: 'Mejora sobrevida global y libre de progresión sobre quimiorradioterapia sola en enfermedad de alto riesgo; aún no incorporado a la normativa de cobertura FNR vigente (que solo contempla pembrolizumab en enfermedad persistente/recurrente/metastásica)',
            regimen: 'ccu-pembro-qrt',
            level: 'A',
            refs: [{ name: 'KEYNOTE-A18/ENGOT-cx11/GOG-3047', pmid: '39288779' }],
            cov: { t: '?' }
          }
        ],
        notes: ['[Dato confirmado] Beneficio de sobrevida demostrado en el ensayo pivotal. [Inferencia razonable] Cobertura no definida: verificar normativa FNR actualizada antes de indicar.'],
        next: [ { label: 'Continuar', next: 'seguimiento' } ]
      },

      'seguimiento': {
        type: 'rec',
        title: 'Seguimiento post-tratamiento primario',
        phase: 'seguimiento',
        items: [
          {
            label: 'Examen físico y ginecológico cada 3–6 meses los primeros 2 años, luego cada 6–12 meses',
            detail: 'Esquema orientativo: la guía ESGO 2023 pide individualizar intensidad y duración según el riesgo de recaída (hay una calculadora de riesgo anual de ESGO). Tras preservación de fertilidad, test de VPH a los 6–12 y a los 24 meses.',
            level: 'C',
            refs: [{ name: 'Guía ESGO/ESTRO/ESP 2023, cáncer de cuello uterino (Cibula et al.)', pmid: '37127326' }],
            cov: { t: 'NA' }
          },
          {
            label: 'Citología/colposcopia e imágenes según hallazgos clínicos o síntomas (no de rutina en asintomáticas)',
            level: 'C',
            refs: [{ name: 'Guía ESGO/ESTRO/ESP 2023, cáncer de cuello uterino (Cibula et al.)', pmid: '37127326' }],
            cov: { t: 'NA' }
          }
        ],
        next: [ { label: 'Recaída, progresión o enfermedad persistente', next: 'avanzado-inicio' } ]
      },

      'avanzado-inicio': {
        type: 'q',
        text: 'Enfermedad persistente, recurrente o metastásica (incluye IVB): ¿es la primera línea de tratamiento sistémico?',
        options: [
          { label: 'Recaída locorregional aislada, potencialmente rescatable (sin diseminación a distancia)', next: 'av-rescate-local' },
          { label: 'Primera línea sistémica, CPS (PD-L1) ≥ 1', next: 'av-1l-cps-pos', stages: ['IVB'] },
          { label: 'Primera línea sistémica, CPS < 1 o no disponible', next: 'av-1l-cps-neg' },
          { label: 'Progresión luego de 1ª línea sistémica', next: 'av-2l' }
        ]
      },

      'av-sistemico': {
        type: 'q',
        text: 'Tratamiento sistémico: ¿qué escenario?',
        options: [
          { label: 'Primera línea sistémica, CPS (PD-L1) ≥ 1', next: 'av-1l-cps-pos' },
          { label: 'Primera línea sistémica, CPS < 1 o no disponible', next: 'av-1l-cps-neg' },
          { label: 'Progresión luego de 1ª línea sistémica', next: 'av-2l' }
        ]
      },
      'av-rescate-local': {
        type: 'rec',
        title: 'Recaída central aislada: rescate locorregional',
        phase: 'avanzada · rescate local',
        items: [
          {
            label: 'Exenteración pélvica (recaída central sin compromiso de pared) o reirradiación ± braquiterapia si no irradiada antes',
            detail: 'Selección estricta de casos en centro con experiencia; evaluación multidisciplinaria',
            level: 'C',
            refs: [{ name: 'Guía ESGO/ESTRO/ESP 2023, cáncer de cuello uterino (Cibula et al.)', pmid: '37127326' }],
            cov: { t: 'NA' }
          }
        ],
        next: [ { label: 'No candidata a rescate local: iniciar tratamiento sistémico', next: 'av-sistemico' } ]
      },

      'av-1l-cps-pos': {
        type: 'rec',
        title: 'Primera línea, enfermedad persistente/recurrente/metastásica, CPS ≥ 1',
        phase: 'avanzada · 1ª línea',
        items: [
          {
            label: 'Pembrolizumab + cisplatino + paclitaxel',
            regimen: 'ccu-pembro-cis-pacli',
            level: 'A',
            refs: [{ name: 'KEYNOTE-826', pmid: '34534429' }],
            cov: { t: 'FNR', ind: 'u-ccu' }
          },
          {
            label: 'Pembrolizumab + carboplatino + paclitaxel (alternativa si contraindicación a cisplatino)',
            regimen: 'ccu-pembro-carbo-pacli',
            level: 'A',
            refs: [{ name: 'KEYNOTE-826', pmid: '34534429' }],
            cov: { t: 'FNR', ind: 'u-ccu' }
          },
          {
            label: 'Agregar bevacizumab al doblete (con o sin pembrolizumab)',
            detail: 'Mejora sobrevida global agregado a platino-taxano; contraindicado si fístula o alto riesgo de perforación',
            regimen: 'ccu-bevacizumab',
            level: 'A',
            refs: [{ name: 'GOG-240', pmid: '24552320' }],
            cov: { t: 'NC' }
          }
        ],
        notes: ['[Dato confirmado] La normativa FNR (indicación u-ccu) cubre pembrolizumab asociado a platino + taxano con CPS ≥ 1 en 1ª línea; no incluye bevacizumab.'],
        next: [ { label: 'Progresión', next: 'av-2l' } ]
      },

      'av-1l-cps-neg': {
        type: 'rec',
        title: 'Primera línea, enfermedad persistente/recurrente/metastásica, CPS < 1 o no disponible',
        phase: 'avanzada · 1ª línea',
        items: [
          {
            label: 'Cisplatino + paclitaxel',
            regimen: 'ccu-cis-pacli',
            level: 'A',
            refs: [{ name: 'GOG-240', pmid: '24552320' }],
            cov: { t: 'FTM' }
          },
          {
            label: 'Agregar bevacizumab al doblete',
            detail: 'Mejora sobrevida global; no cubierto por la normativa FNR vigente (que solo contempla pembrolizumab)',
            regimen: 'ccu-bevacizumab',
            level: 'A',
            refs: [{ name: 'GOG-240', pmid: '24552320' }],
            cov: { t: 'NC' }
          }
        ],
        notes: ['[Dato confirmado] Sin CPS ≥ 1 documentado no corresponde pembrolizumab por normativa FNR.'],
        next: [ { label: 'Progresión', next: 'av-2l' } ]
      },

      'av-2l': {
        type: 'rec',
        title: 'Segunda línea (progresión tras platino ± inmunoterapia)',
        phase: 'avanzada · 2ª línea',
        items: [
          {
            label: 'Tisotumab vedotina',
            regimen: 'ccu-tisotumab-vedotin',
            level: 'A',
            refs: [{ name: 'innovaTV 301/ENGOT-cx12/GOG-3057', pmid: '38959480' }],
            cov: { t: '?' }
          },
          {
            label: 'Cemiplimab en monoterapia (si no recibió inhibidor de PD-1/PD-L1 previo)',
            regimen: 'ccu-cemiplimab',
            level: 'A',
            refs: [{ name: 'EMPOWER-Cervical 1/GOG-3016/ENGOT-cx9', pmid: '35139273' }],
            cov: { t: '?' }
          },
          {
            label: 'Quimioterapia de agente único (p. ej. topotecán)',
            detail: 'Actividad modesta. GOG-179 evaluó topotecán combinado con cisplatino; su uso en monoterapia es extrapolación.',
            regimen: 'ccu-topotecan',
            level: 'C',
            refs: [{ name: 'GOG-179 (topotecán + cisplatino)', pmid: '15911865' }],
            cov: { t: 'FTM' }
          },
          {
            label: 'Evaluar ensayo clínico disponible',
            level: 'C',
            refs: [{ name: 'Guía ESGO/ESTRO/ESP 2023, cáncer de cuello uterino (Cibula et al.)', pmid: '37127326' }],
            cov: { t: 'NA' }
          }
        ],
        notes: ['[Inferencia razonable] Cobertura de tisotumab vedotina y cemiplimab a verificar: no confirmada su inclusión en FNR ni en FTM al momento de este borrador.'],
        next: [ { label: 'Progresión', next: 'av-3l' } ]
      },

      'av-3l': {
        type: 'rec',
        title: 'Tercera línea y más allá',
        phase: 'avanzada · 3ª línea',
        items: [
          {
            label: 'Mejor soporte, reevaluar opción de ensayo clínico, o rechallenge de agente previo según estado funcional',
            level: 'C',
            refs: [{ name: 'Guía ESGO/ESTRO/ESP 2023, cáncer de cuello uterino (Cibula et al.)', pmid: '37127326' }],
            cov: { t: 'NA' }
          }
        ]
      }

    },
    notes: [
      'Contenido generado como borrador asistido por IA a partir de ensayos pivotales publicados y guías de sociedades científicas resumidas con palabras propias; no reemplaza la evaluación de un oncólogo.',
      'La braquiterapia intracavitaria es un componente obligatorio (no opcional) del tratamiento radical con radioterapia en enfermedad localmente avanzada.',
      'Verificar siempre la normativa FNR vigente al momento de indicar tratamiento, dado que las indicaciones se actualizan periódicamente.'
    ]
  };

})(window.FNRO = window.FNRO || {});
