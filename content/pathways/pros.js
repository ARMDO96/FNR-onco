// Vía terapéutica — Próstata (id: pros)
// Sala limpia: redactado sin consultar ni citar material de la guía estadounidense de referencia
// habitual en oncología (prohibida por SCHEMA.md). Fuentes: ensayos pivotales (PMID verificados),
// aprobaciones FDA/EMA, y resumen con palabras propias de Pautas de Oncología Médica HC/UdelaR y EAU/ESMO.
(function (R) {
  R.pathways = R.pathways || {};

  R.pathways.pros = {
    tumor: 'pros',
    title: 'Cáncer de próstata',
    status: 'borrador',
    updated: '2026-09-28',
    authors: ['Borrador asistido por IA'],
    start: 'inicio',
    nodes: {

      // ============================================================
      // 0) PUNTO DE ENTRADA
      // ============================================================
      'inicio': {
        type: 'q',
        text: '¿Qué escenario clínico querés evaluar?',
        help: 'Elegí el punto de la historia natural más cercano a la situación actual del paciente.',
        options: [
          { label: 'Enfermedad localizada o con ganglios pélvicos (N1 M0), sin tratamiento previo', next: 'loc-riesgo', stages: ['I', 'IIA', 'IIB', 'IIC', 'IIIA', 'IIIB', 'IIIC', 'IVA'] },
          { label: 'Recaída bioquímica tras tratamiento local (PSA en ascenso, sin metástasis visibles)', next: 'rbq-tipo' },
          { label: 'Enfermedad metastásica, hormonosensible (nunca resistente a la castración)', next: 'hspc-volumen', stages: ['IVB'] },
          { label: 'CPRC no metastásico (PSA en ascenso bajo deprivación androgénica, imágenes sin metástasis)', next: 'nmcrpc' },
          { label: 'CPRC metastásico', next: 'crpc-1l', stages: ['IVB'] },
          { label: 'Seguimiento post-tratamiento, sin evidencia de enfermedad activa', next: 'seguimiento' }
        ]
      },

      // ============================================================
      // 1) ENFERMEDAD LOCALIZADA POR GRUPO DE RIESGO
      // ============================================================
      'loc-riesgo': {
        type: 'q',
        text: '¿Cuál es el grupo de riesgo (D\'Amico/EAU modificado, según T clínico, PSA y Grupo de Grado ISUP)?',
        help: 'Muy bajo: T1c, GG1, PSA<10, <3 cilindros positivos, densidad PSA<0.15. Bajo: T1-T2a, GG1, PSA<10. Intermedio: T2b-T2c o GG2-3 o PSA 10-20 (favorable si un solo factor y GG≤2; desfavorable si varios factores o GG3, o patrón 4 predominante o >50% cilindros positivos). Alto: T3a o GG4-5 o PSA>20. Muy alto: T3b-T4, o GG5 con ≥2 factores adicionales, o >4 cilindros con GG4-5.',
        options: [
          { label: 'Muy bajo riesgo', next: 'loc-muybajo', stages: ['I'] },
          { label: 'Bajo riesgo', next: 'loc-bajo', stages: ['I'] },
          { label: 'Riesgo intermedio favorable', next: 'loc-int-fav', stages: ['IIA', 'IIB'] },
          { label: 'Riesgo intermedio desfavorable', next: 'loc-int-desf', stages: ['IIB', 'IIC'] },
          { label: 'Alto riesgo', next: 'loc-alto', stages: ['IIIA', 'IIIB'] },
          { label: 'Muy alto riesgo (T3b-T4 o carga tumoral extensa)', next: 'loc-muyalto', stages: ['IIIB', 'IIIC', 'IVA'] }
        ]
      },

      'loc-muybajo': {
        type: 'rec',
        title: 'Muy bajo riesgo',
        phase: 'Enfermedad localizada · manejo primario',
        items: [
          {
            label: 'Vigilancia activa (PSA cada 6 meses, tacto rectal, RMN y/o biopsia de reevaluación)',
            detail: 'Expectativa de vida prolongada no es contraindicación; se busca diferir o evitar el tratamiento radical sin perder la ventana curativa.',
            level: 'A',
            refs: [{ name: 'ProtecT (vigilancia vs. tratamiento radical)', nct: 'NCT02044172' }],
            cov: { t: 'NA' }
          }
        ],
        next: [
          { label: 'Reclasificación o progresión durante la vigilancia', next: 'loc-vigilancia-seg' }
        ]
      },

      'loc-bajo': {
        type: 'rec',
        title: 'Bajo riesgo',
        phase: 'Enfermedad localizada · manejo primario',
        items: [
          {
            label: 'Vigilancia activa',
            detail: 'Opción preferida si el paciente acepta el seguimiento estricto.',
            level: 'A',
            refs: [{ name: 'ProtecT', nct: 'NCT02044172' }],
            cov: { t: 'NA' }
          },
          {
            label: 'Prostatectomía radical (± linfadenectomía si el riesgo lo justifica)',
            level: 'A',
            refs: [{ name: 'ProtecT', nct: 'NCT02044172' }],
            cov: { t: 'NA' }
          },
          {
            label: 'Radioterapia externa o braquiterapia exclusiva',
            level: 'A',
            refs: [{ name: 'ProtecT', nct: 'NCT02044172' }],
            cov: { t: 'NA' }
          }
        ],
        next: [
          { label: 'Reclasificación o progresión durante la vigilancia', next: 'loc-vigilancia-seg' },
          { label: 'Recaída bioquímica tras tratamiento radical', next: 'rbq-tipo' }
        ]
      },

      'loc-vigilancia-seg': {
        type: 'rec',
        title: 'Seguimiento en vigilancia activa / reclasificación',
        phase: 'Enfermedad localizada · seguimiento',
        items: [
          {
            label: 'Ante reclasificación a mayor grado o volumen, o progresión de PSA: pasar a tratamiento activo',
            detail: 'La decisión de tratar se basa en nueva biopsia, RMN y cinética de PSA, no solo en el tiempo transcurrido.',
            level: 'B',
            refs: [{ name: 'ProtecT', nct: 'NCT02044172' }],
            cov: { t: 'NA' }
          }
        ],
        next: [
          { label: 'Definir tratamiento activo (riesgo intermedio favorable)', next: 'loc-int-fav' }
        ]
      },

      'loc-int-fav': {
        type: 'rec',
        title: 'Riesgo intermedio favorable',
        phase: 'Enfermedad localizada · manejo primario',
        items: [
          {
            label: 'Prostatectomía radical (± linfadenectomía)',
            detail: 'ProtecT (pacientes detectados por PSA) no mostró diferencia de mortalidad a 10 años frente a monitoreo activo o radioterapia, pero sí menos progresión y metástasis con tratamiento radical; el beneficio en sobrevida global de SPCG-4 es de la era previa al PSA.',
            level: 'A',
            refs: [{ name: 'Guía EAU-EANM-ESTRO-ESUR-SIOG 2020, parte I (Mottet et al.)', pmid: '33172724' }, { name: 'ProtecT (Hamdy et al.)', pmid: '27626136' }, { name: 'SPCG-4 (Bill-Axelson et al.)', pmid: '21542742' }],
            cov: { t: 'NA' }
          },
          {
            label: 'Radioterapia externa o braquiterapia ± deprivación androgénica corta (4–6 meses)',
            detail: 'La DAE corta agrega beneficio modesto en subgrupos seleccionados; muchos casos se tratan con RT sola.',
            level: 'B',
            regimen: 'pros-adt-agonista',
            refs: [{ name: 'RTOG 9408 (DAE corta + RT)', nct: 'NCT00002597' }],
            cov: { t: 'FTM' }
          }
        ],
        next: [
          { label: 'Recaída bioquímica', next: 'rbq-tipo' }
        ]
      },

      'loc-int-desf': {
        type: 'q',
        text: 'Riesgo intermedio desfavorable: ¿cirugía o radioterapia?',
        help: 'Ambas son opciones válidas; la elección depende de comorbilidades, función urinaria/sexual basal y preferencia informada del paciente.',
        options: [
          { label: 'Prostatectomía radical + linfadenectomía pélvica', next: 'loc-int-desf-cx' },
          { label: 'Radioterapia + deprivación androgénica (6 meses)', next: 'loc-int-desf-rt' }
        ]
      },
      'loc-int-desf-cx': {
        type: 'rec',
        title: 'Riesgo intermedio desfavorable — vía quirúrgica',
        phase: 'Enfermedad localizada · manejo primario',
        items: [
          {
            label: 'Prostatectomía radical + linfadenectomía pélvica extendida',
            detail: 'Linfadenectomía extendida: estadifica mejor; en dos ensayos aleatorizados no redujo la recaída bioquímica, y en el de MSKCC (aleatorizado por cirujano, un solo centro) redujo las metástasis con más seguimiento (HR 0,82), sin datos de sobrevida global.',
            level: 'A',
            refs: [{ name: 'Guía EAU-EANM-ESTRO-ESUR-SIOG 2020, parte I (Mottet et al.)', pmid: '33172724' }, { name: 'Linfadenectomía extendida vs. limitada (Lestingi et al.)', pmid: '33293077' }, { name: 'Linfadenectomía extendida vs. limitada, actualización MSKCC (Touijer et al.)', pmid: '39472200' }],
            cov: { t: 'NA' }
          }
        ],
        next: [{ label: 'Recaída bioquímica', next: 'rbq-tipo' }]
      },
      'loc-int-desf-rt': {
        type: 'rec',
        title: 'Riesgo intermedio desfavorable — radioterapia',
        phase: 'Enfermedad localizada · manejo primario',
        items: [
          {
            label: 'Radioterapia externa + deprivación androgénica por 6 meses',
            detail: 'El beneficio de agregar 6 meses de DAE se demostró en control bioquímico y clínico; la sobrevida global no difirió significativamente.',
            level: 'B',
            regimen: 'pros-adt-agonista',
            refs: [{ name: 'EORTC 22991 (RT ± 6 meses de DAE)', nct: 'NCT00021450' }],
            cov: { t: 'FTM' }
          }
        ],
        next: [{ label: 'Recaída bioquímica', next: 'rbq-tipo' }]
      },

      'loc-alto': {
        type: 'q',
        text: 'Alto riesgo: ¿cirugía o radioterapia?',
        help: 'Ambas requieren tratamiento multimodal; la cirugía sola rara vez es curativa y suele seguirse de radioterapia adyuvante o de rescate.',
        options: [
          { label: 'Prostatectomía radical + linfadenectomía extendida', next: 'loc-alto-cx' },
          { label: 'Radioterapia + deprivación androgénica prolongada (24–36 meses)', next: 'loc-alto-rt' }
        ]
      },
      'loc-alto-cx': {
        type: 'rec',
        title: 'Alto riesgo — vía quirúrgica',
        phase: 'Enfermedad localizada · manejo primario',
        items: [
          {
            label: 'Prostatectomía radical + linfadenectomía pélvica extendida',
            detail: 'Suele requerir radioterapia adyuvante o de rescate y, en algunos casos, deprivación androgénica adicional según patología final. Linfadenectomía extendida: estadifica mejor; en dos ensayos aleatorizados no redujo la recaída bioquímica, y en el de MSKCC (aleatorizado por cirujano, un solo centro) redujo las metástasis con más seguimiento (HR 0,82), sin datos de sobrevida global.',
            level: 'B',
            refs: [{ name: 'Guía EAU-EANM-ESTRO-ESUR-SIOG 2020, parte I (Mottet et al.)', pmid: '33172724' }, { name: 'Linfadenectomía extendida vs. limitada (Lestingi et al.)', pmid: '33293077' }, { name: 'Linfadenectomía extendida vs. limitada, actualización MSKCC (Touijer et al.)', pmid: '39472200' }],
            cov: { t: 'NA' }
          }
        ],
        next: [{ label: 'Recaída bioquímica', next: 'rbq-tipo' }]
      },
      'loc-alto-rt': {
        type: 'rec',
        title: 'Alto riesgo — radioterapia',
        phase: 'Enfermedad localizada · manejo primario',
        items: [
          {
            label: 'Radioterapia externa (± boost con braquiterapia) + deprivación androgénica por 24–36 meses',
            level: 'A',
            regimen: 'pros-adt-agonista',
            refs: [{ name: 'EORTC 22863 (DAE larga + RT, alto riesgo)', nct: 'NCT00849082' }],
            cov: { t: 'FTM' }
          }
        ],
        next: [{ label: 'Recaída bioquímica', next: 'rbq-tipo' }]
      },

      'loc-muyalto': {
        type: 'q',
        text: 'Muy alto riesgo (T3b-T4, GG5 con factores adicionales, o carga tumoral extensa): ¿cirugía o radioterapia?',
        help: 'Se trata siempre en forma multimodal; en este grupo se discute además intensificar la deprivación androgénica con un ARPI.',
        options: [
          { label: 'Prostatectomía radical + linfadenectomía extendida', next: 'loc-muyalto-cx' },
          { label: 'Radioterapia + deprivación androgénica prolongada (24–36 meses)', next: 'loc-muyalto-rt' }
        ]
      },
      'loc-muyalto-cx': {
        type: 'rec',
        title: 'Muy alto riesgo — vía quirúrgica',
        phase: 'Enfermedad localizada · manejo primario',
        items: [
          {
            label: 'Prostatectomía radical + linfadenectomía pélvica extendida',
            detail: 'Casi siempre requiere terapia adyuvante multimodal posterior. Linfadenectomía extendida: estadifica mejor; en dos ensayos aleatorizados no redujo la recaída bioquímica, y en el de MSKCC (aleatorizado por cirujano, un solo centro) redujo las metástasis con más seguimiento (HR 0,82), sin datos de sobrevida global.',
            level: 'C',
            refs: [{ name: 'Guía EAU-EANM-ESTRO-ESUR-SIOG 2020, parte I (Mottet et al.)', pmid: '33172724' }, { name: 'Linfadenectomía extendida vs. limitada (Lestingi et al.)', pmid: '33293077' }, { name: 'Linfadenectomía extendida vs. limitada, actualización MSKCC (Touijer et al.)', pmid: '39472200' }],
            cov: { t: 'NA' }
          }
        ],
        next: [{ label: 'Recaída bioquímica', next: 'rbq-tipo' }]
      },
      'loc-muyalto-rt': {
        type: 'rec',
        title: 'Muy alto riesgo — radioterapia',
        phase: 'Enfermedad localizada · manejo primario',
        items: [
          {
            label: 'Radioterapia externa + deprivación androgénica por 24–36 meses',
            level: 'A',
            regimen: 'pros-adt-agonista',
            refs: [{ name: 'EORTC 22863', nct: 'NCT00849082' }],
            cov: { t: 'FTM' }
          },
          {
            label: 'Agregar abiraterona + prednisona por 2 años a RT + DAE (no metastásico de alto riesgo)',
            detail: 'Alto riesgo según STAMPEDE: N+, o N0 con al menos dos de T3–T4, Gleason 8–10 o PSA ≥40. Metaanálisis preespecificado de dos ensayos fase III aleatorizados de la plataforma STAMPEDE: mejor sobrevida libre de metástasis (HR 0,53) y sobrevida global (HR 0,60); agregar enzalutamida no sumó beneficio y aumentó la toxicidad. La indicación FNR de abiraterona relevada para este documento cubre el escenario metastásico: cobertura a verificar.',
            level: 'A',
            regimen: 'pros-abiraterona',
            refs: [{ name: 'STAMPEDE, abiraterona en no metastásico de alto riesgo (Attard et al.)', pmid: '34953525' }],
            cov: { t: '?' }
          }
        ],
        next: [{ label: 'Recaída bioquímica', next: 'rbq-tipo' }]
      },

      // ============================================================
      // 2) RECAÍDA BIOQUÍMICA
      // ============================================================
      'rbq-tipo': {
        type: 'q',
        text: '¿La recaída bioquímica es posterior a prostatectomía o a radioterapia primaria?',
        help: 'Define si la radioterapia de rescate está disponible como opción local.',
        options: [
          { label: 'Post-prostatectomía (PSA detectable/en ascenso)', next: 'rbq-post-rp' },
          { label: 'Post-radioterapia primaria (criterio de Phoenix: nadir + 2 ng/mL)', next: 'rbq-post-rt' }
        ]
      },

      'rbq-post-rp': {
        type: 'rec',
        title: 'Recaída bioquímica post-prostatectomía',
        phase: 'Recaída bioquímica',
        items: [
          {
            label: 'Radioterapia de rescate sobre el lecho prostático + bicalutamida 150 mg/día por 24 meses',
            detail: 'Iniciar la RT antes de que el PSA supere ~0,5 ng/mL mejora el control. El beneficio en sobrevida se concentró en PSA prerrescate más alto (> 0,7 ng/mL); con PSA bajo el beneficio es incierto.',
            level: 'A',
            regimen: 'pros-bicalutamida',
            refs: [{ name: 'RTOG 9601', pmid: '28146658' }],
            cov: { t: 'FTM' }
          },
          {
            label: 'Radioterapia de rescate + agonista LHRH por 6 meses (alternativa)',
            detail: 'Esquema de GETUG-AFU 16 (goserelina): mejoró la sobrevida libre de progresión.',
            level: 'B',
            regimen: 'pros-adt-agonista',
            refs: [{ name: 'GETUG-AFU 16', nct: 'NCT00423475' }],
            cov: { t: 'FTM' }
          }
        ],
        next: [
          { label: 'Progresión a enfermedad metastásica', next: 'hspc-volumen' }
        ]
      },

      'rbq-post-rt': {
        type: 'rec',
        title: 'Recaída bioquímica post-radioterapia primaria',
        phase: 'Recaída bioquímica',
        items: [
          {
            label: 'Deprivación androgénica continua (si no hay opción de rescate local o el paciente no es candidato)',
            detail: 'Momento de inicio: individualizar según el tiempo de duplicación del PSA, el intervalo libre y la expectativa de vida. En TOAD, la DAE inmediata frente a la diferida mejoró la sobrevida global (HR 0,55; IC 95 %% 0,30–1,00; p = 0,05), con aleatorización estratificada por tiempo de duplicación del PSA.',
            level: 'B',
            regimen: 'pros-adt-agonista',
            refs: [{ name: 'Guía EAU-EANM-ESTRO-ESUR-SIOG 2020, parte II (Cornford et al.)', pmid: '33039206' }, { name: 'TOAD (Duchesne et al.)', pmid: '27155740' }],
            cov: { t: 'FTM' }
          },
          {
            label: 'Rescate local (prostatectomía, crioterapia o braquiterapia de rescate) en casos muy seleccionados',
            detail: 'Requiere confirmar recaída local (biopsia/RMN) y descartar enfermedad a distancia; mayor morbilidad que el tratamiento primario.',
            level: 'C',
            refs: [{ name: 'MASTER, metaanálisis de rescate local tras RT (Valle et al.)', pmid: '33309278' }, { name: 'Guía EAU-EANM-ESTRO-ESUR-SIOG 2020, parte II (Cornford et al.)', pmid: '33039206' }],
            cov: { t: 'NA' }
          }
        ],
        next: [
          { label: 'Progresión a enfermedad metastásica', next: 'hspc-volumen' }
        ]
      },

      // ============================================================
      // 3) CPSC METASTÁSICO (HORMONOSENSIBLE)
      // ============================================================
      'hspc-volumen': {
        type: 'q',
        text: '¿Alto o bajo volumen metastásico? (criterio CHAARTED)',
        help: 'Alto volumen: metástasis viscerales, y/o ≥4 lesiones óseas con al menos una fuera de columna/pelvis. Bajo volumen: el resto.',
        options: [
          { label: 'Alto volumen', next: 'hspc-alto' },
          { label: 'Bajo volumen', next: 'hspc-bajo' }
        ]
      },

      'hspc-alto': {
        type: 'rec',
        title: 'CPSC metastásico, alto volumen',
        phase: 'Enfermedad avanzada · 1ª línea',
        items: [
          {
            label: 'ADT + abiraterona + prednisona',
            level: 'A',
            regimen: 'pros-abiraterona',
            refs: [{ name: 'LATITUDE', pmid: '28578607' }, { name: 'STAMPEDE — abiraterona', pmid: '28578639' }],
            cov: { t: 'FNR', ind: 'p-hspc' }
          },
          {
            label: 'ADT + docetaxel + darolutamida (triplete)',
            detail: 'Preferible en pacientes jóvenes/buen estado funcional con alto volumen; mayor toxicidad que el doblete.',
            level: 'A',
            regimen: 'pros-dtx-darolutamida',
            refs: [{ name: 'ARASENS', pmid: '35179323' }],
            cov: { t: 'NC' }
          },
          {
            label: 'ADT + docetaxel + abiraterona (triplete)',
            detail: 'Alternativa de intensificación triple en el mismo subgrupo.',
            level: 'A',
            regimen: 'pros-dtx-abiraterona',
            refs: [{ name: 'PEACE-1', pmid: '35405085' }],
            cov: { t: 'FNR', ind: 'p-hspc' }
          },
          {
            label: 'ADT + docetaxel (doblete, si el ARPI no está disponible o hay contraindicación)',
            level: 'A',
            regimen: 'pros-docetaxel',
            refs: [{ name: 'CHAARTED', pmid: '26244877' }],
            cov: { t: 'FTM' }
          }
        ],
        next: [
          { label: 'Progresión a CPRC', next: 'crpc-1l' }
        ]
      },

      'hspc-bajo': {
        type: 'rec',
        title: 'CPSC metastásico, bajo volumen',
        phase: 'Enfermedad avanzada · 1ª línea',
        items: [
          {
            label: 'ADT + abiraterona + prednisona',
            detail: 'Cobertura FNR: debut metastásico, o metacrónico con al menos 2 de: Gleason ≥ 8, ≥ 3 lesiones óseas, metástasis visceral.',
            level: 'A',
            regimen: 'pros-abiraterona',
            refs: [{ name: 'LATITUDE', pmid: '28578607' }, { name: 'STAMPEDE — abiraterona', pmid: '28578639' }],
            cov: { t: 'FNR', ind: 'p-hspc' }
          },
          {
            label: 'ADT + apalutamida',
            level: 'A',
            regimen: 'pros-apalutamida',
            refs: [{ name: 'TITAN', pmid: '31150574' }],
            cov: { t: 'NC' }
          },
          {
            label: 'ADT + enzalutamida',
            level: 'A',
            regimen: 'pros-enzalutamida',
            refs: [{ name: 'ENZAMET', pmid: '31157964' }],
            cov: { t: 'NC' }
          }
        ],
        notes: ['El agregado de docetaxel no mostró beneficio consistente de sobrevida en bajo volumen y no se recomienda de rutina en este subgrupo.'],
        next: [
          { label: 'Progresión a CPRC', next: 'crpc-1l' }
        ]
      },

      // ============================================================
      // 4) CPRC NO METASTÁSICO
      // ============================================================
      'nmcrpc': {
        type: 'rec',
        title: 'CPRC no metastásico de alto riesgo (PSADT ≤10 meses)',
        phase: 'Enfermedad avanzada · CPRC no metastásico',
        items: [
          {
            label: 'Continuar deprivación androgénica + agregar apalutamida',
            level: 'A',
            regimen: 'pros-apalutamida',
            refs: [{ name: 'SPARTAN', pmid: '29420164' }],
            cov: { t: 'NC' }
          },
          {
            label: 'Continuar deprivación androgénica + agregar enzalutamida',
            level: 'A',
            regimen: 'pros-enzalutamida',
            refs: [{ name: 'PROSPER', pmid: '29949494' }],
            cov: { t: 'NC' }
          },
          {
            label: 'Continuar deprivación androgénica + agregar darolutamida',
            level: 'A',
            regimen: 'pros-darolutamida',
            refs: [{ name: 'ARAMIS', pmid: '30763142' }],
            cov: { t: 'NC' }
          }
        ],
        notes: ['Confirmar ausencia de metástasis con imagen convencional (y, si está disponible, PET-PSMA) antes de clasificar como no metastásico.'],
        next: [
          { label: 'Aparición de metástasis (progresión a CPRC metastásico)', next: 'crpc-1l' }
        ]
      },

      // ============================================================
      // 5) CPRC METASTÁSICO
      // ============================================================
      'crpc-1l': {
        type: 'rec',
        title: 'CPRC metastásico — primera línea (sin ARPI previo por enfermedad metastásica)',
        phase: 'Enfermedad avanzada · CPRC metastásico',
        items: [
          {
            label: 'Abiraterona + prednisona',
            detail: 'Preferida si no se usó un ARPI en la fase hormonosensible.',
            level: 'A',
            regimen: 'pros-abiraterona',
            refs: [{ name: 'COU-AA-302', pmid: '23228172' }],
            cov: { t: 'FNR', ind: 'p-crpc' }
          },
          {
            label: 'Enzalutamida',
            level: 'A',
            regimen: 'pros-enzalutamida',
            refs: [{ name: 'PREVAIL', pmid: '24881730' }],
            cov: { t: 'NC' }
          },
          {
            label: 'Docetaxel (si progresión rápida, síntomas viscerales o ya se usó un ARPI en fase hormonosensible)',
            level: 'A',
            regimen: 'pros-docetaxel',
            refs: [{ name: 'TAX 327 (Tannock et al.)', pmid: '15470213' }],
            cov: { t: 'FTM' }
          }
        ],
        next: [
          { label: '¿Se realizó test de alteraciones en genes de reparación por recombinación homóloga (HRR)?', next: 'crpc-post-arpi' }
        ]
      },

      'crpc-post-arpi': {
        type: 'q',
        text: 'Test de HRR (BRCA1/2, ATM u otros genes de la vía) en tejido tumoral o ctDNA: ¿resultado?',
        help: 'Se recomienda solicitarlo apenas se documenta enfermedad metastásica, para tenerlo disponible al progresar.',
        options: [
          { label: 'BRCA1/2 (o ATM) alterado', next: 'crpc-brca' },
          { label: 'Sin alteración HRR / no aplica', next: 'crpc-no-hrr' },
          { label: 'Test no realizado todavía', next: 'crpc-test-pendiente' }
        ]
      },

      'crpc-test-pendiente': {
        type: 'rec',
        title: 'Test HRR pendiente',
        phase: 'Enfermedad avanzada · CPRC metastásico',
        items: [
          {
            label: 'Solicitar panel germinal y/o somático de HRR (BRCA1/2, ATM, entre otros) antes de definir la siguiente línea si el cuadro clínico lo permite',
            detail: 'Mientras se espera el resultado, continuar con las opciones estándar de esta línea.',
            level: 'B',
            refs: [{ name: 'PROfound (selección biomarcador-dirigida)', pmid: '32343890' }],
            cov: { t: '?' }
          }
        ],
        next: [
          { label: 'Definir conducta con las opciones estándar disponibles', next: 'crpc-no-hrr' }
        ]
      },

      'crpc-brca': {
        type: 'rec',
        title: 'CPRC metastásico con alteración BRCA1/2 o ATM, progresión post-ARPI',
        phase: 'Enfermedad avanzada · CPRC metastásico',
        items: [
          {
            label: 'Olaparib',
            detail: 'Mayor magnitud de beneficio en BRCA1/2; en ATM aislado el beneficio es más incierto.',
            level: 'A',
            regimen: 'pros-olaparib',
            refs: [{ name: 'PROfound', pmid: '32343890' }, { name: 'PROfound — sobrevida global', pmid: '32955174' }],
            cov: { t: 'FNR', ind: 'p-ola' }
          }
        ],
        next: [
          { label: 'Progresión ulterior', next: 'crpc-post-docetaxel' }
        ]
      },

      'crpc-no-hrr': {
        type: 'rec',
        title: 'CPRC metastásico sin alteración HRR (o no testeado), progresión post-ARPI',
        phase: 'Enfermedad avanzada · CPRC metastásico',
        items: [
          {
            label: 'Docetaxel (si no se usó previamente)',
            level: 'A',
            regimen: 'pros-docetaxel',
            refs: [{ name: 'TAX 327 (docetaxel vs. mitoxantrona en CPRC)', pmid: '15470213' }],
            cov: { t: 'FTM' }
          }
        ],
        next: [
          { label: 'Progresión post-docetaxel', next: 'crpc-post-docetaxel' }
        ]
      },

      'crpc-post-docetaxel': {
        type: 'rec',
        title: 'CPRC metastásico, progresión post-docetaxel (y post-ARPI)',
        phase: 'Enfermedad avanzada · líneas posteriores',
        items: [
          {
            label: 'Cabazitaxel + prednisona',
            level: 'A',
            regimen: 'pros-cabazitaxel',
            refs: [{ name: 'TROPIC', pmid: '20888992' }],
            cov: { t: 'NC' }
          },
          {
            label: 'Radio-223 (solo si metástasis óseas sintomáticas, sin enfermedad visceral)',
            detail: 'No combinar con abiraterona + prednisona por mayor riesgo de fracturas.',
            level: 'A',
            regimen: 'pros-radio223',
            refs: [{ name: 'ALSYMPCA', pmid: '23863050' }],
            cov: { t: '?' }
          },
          {
            label: 'Lutecio-177-PSMA-617 (si PET-PSMA positivo, tras ARPI y taxano)',
            level: 'A',
            regimen: 'pros-lu-psma',
            refs: [{ name: 'VISION', pmid: '34161051' }],
            cov: { t: '?' }
          }
        ],
        next: [
          { label: 'Seguimiento / cuidados de soporte', next: 'seguimiento' }
        ]
      },

      // ============================================================
      // 6) SEGUIMIENTO
      // ============================================================
      'seguimiento': {
        type: 'rec',
        title: 'Seguimiento',
        phase: 'Seguimiento',
        items: [
          {
            label: 'PSA y examen clínico cada 3–6 meses; imágenes dirigidas por síntomas o cinética de PSA',
            detail: 'En pacientes bajo deprivación androgénica, controlar además testosterona, perfil metabólico, densidad mineral ósea y salud cardiovascular.',
            level: 'C',
            refs: [{ name: 'Guía EAU-EANM-ESTRO-ESUR-SIOG 2020, parte I (Mottet et al.)', pmid: '33172724' }, { name: 'Guía EAU-EANM-ESTRO-ESUR-SIOG 2020, parte II (Cornford et al.)', pmid: '33039206' }],
            cov: { t: 'NA' }
          }
        ]
      }
    },
    notes: [
      'Los grupos de riesgo de enfermedad localizada se describen según los factores clásicos (T clínico, PSA, Grupo de Grado ISUP), resumidos con palabras propias a partir de EAU/ESMO y de las Pautas de Oncología Médica HC/UdelaR; no reflejan ningún documento de origen estadounidense de uso habitual en oncología, que no fue consultado para este documento.',
      'La cobertura FNR relevada para este documento incluye únicamente abiraterona en CPSC metastásico (p-hspc), abiraterona en CPRC metastásico (p-crpc) y olaparib en CPRC metastásico con BRCA/ATM (p-ola); toda otra cobertura marcada "?" debe confirmarse contra la normativa vigente antes de indicarse.',
      'Documento borrador: requiere revisión por un oncólogo humano antes de su uso clínico.'
    ]
  };
})(window.FNRO = window.FNRO || {});
