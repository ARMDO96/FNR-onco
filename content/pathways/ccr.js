// Vía terapéutica — Cáncer colorrectal (ccr): colon y recto
// Redactado con palabras propias a partir de ensayos primarios (PubMed), aprobaciones
// regulatorias y resúmenes propios de Pautas de Oncología Médica HC/UdelaR y ESMO.
// Ver reglas de "sala limpia" en content/SCHEMA.md.
(function (R) {
  R.pathways = R.pathways || {};

  R.pathways.ccr = {
    tumor: 'ccr',
    title: 'Cáncer colorrectal (colon y recto)',
    status: 'borrador',
    updated: '2026-09-28',
    authors: ['Borrador asistido por IA'],
    start: 'inicio',
    nodes: {

      // ============================================================
      // 0) ENTRADA
      // ============================================================
      'inicio': {
        type: 'q',
        text: '¿Qué escenario clínico corresponde?',
        help: 'Solicitar MMR/MSI y, si hay enfermedad metastásica o irresecable, RAS/BRAF y lateralidad del primario.',
        options: [
          { label: 'Estadio 0 (Tis) / displasia de alto grado', next: 'stage0', stages: ['0'] },
          { label: 'Colon, estadio I–III resecado o resecable', next: 'colon-stage', stages: ['I', 'IIA', 'IIB', 'IIC', 'IIIA', 'IIIB', 'IIIC'] },
          { label: 'Recto, localmente avanzado, no metastásico', next: 'recto-eval', stages: ['IIA', 'IIB', 'IIC', 'IIIA', 'IIIB', 'IIIC'] },
          { label: 'Enfermedad metastásica (de novo o recaída)', next: 'mets-eval', stages: ['IVA', 'IVB', 'IVC'] }
        ]
      },

      'stage0': {
        type: 'rec',
        title: 'Estadio 0 (Tis) — carcinoma in situ / displasia de alto grado',
        phase: 'primario',
        items: [
          {
            label: 'Resección endoscópica completa (polipectomía o mucosectomía)',
            detail: 'Si el margen y la profundidad no permiten asegurar resección completa, considerar cirugía.',
            level: 'C',
            refs: [{ name: 'Consenso Pautas HC/UdelaR y ESMO (resumen propio)', url: 'https://www.esmo.org' }],
            cov: { t: 'NA' }
          }
        ],
        next: [ { label: 'Seguimiento', next: 'seguimiento-colon' } ]
      },

      // ============================================================
      // 1) COLON — ESTADIOS I–III
      // ============================================================
      'colon-stage': {
        type: 'q',
        text: 'Colon: ¿estadio patológico (pTNM) tras resección?',
        options: [
          { label: 'Estadio I (pT1–T2, N0)', next: 'colon-I', stages: ['I'] },
          { label: 'Estadio II (pT3–T4, N0)', next: 'colon-II-mmr', stages: ['IIA', 'IIB', 'IIC'] },
          { label: 'Estadio III (cualquier T, N+)', next: 'colon-III-risk', stages: ['IIIA', 'IIIB', 'IIIC'] }
        ]
      },

      'colon-I': {
        type: 'rec',
        title: 'Colon estadio I — sin adyuvancia',
        phase: 'adyuvancia',
        items: [
          {
            label: 'Vigilancia, sin quimioterapia adyuvante',
            detail: 'El beneficio de la quimioterapia adyuvante no está demostrado en estadio I.',
            level: 'C',
            refs: [{ name: 'ESMO 2020, cáncer de colon localizado (Argilés et al.)', pmid: '32702383' }],
            cov: { t: 'NA' }
          }
        ],
        next: [ { label: 'Seguimiento', next: 'seguimiento-colon' } ]
      },

      'colon-II-mmr': {
        type: 'q',
        text: 'Colon estadio II: ¿estado MMR/MSI del tumor?',
        help: 'El testeo de MMR/MSI se recomienda de forma universal en todo CCR.',
        options: [
          { label: 'dMMR / MSI-H', next: 'colon-II-dmmr' },
          { label: 'pMMR / MSS', next: 'colon-II-riesgo' }
        ]
      },

      'colon-II-dmmr': {
        type: 'rec',
        title: 'Colon estadio II, dMMR/MSI-H',
        phase: 'adyuvancia',
        items: [
          {
            label: 'Vigilancia, sin quimioterapia adyuvante con fluoropirimidina',
            detail: 'Los tumores dMMR/MSI-H no muestran beneficio de 5-FU/capecitabina en adyuvancia de estadio II y podrían tener peor evolución con fluoropirimidina en monoterapia.',
            level: 'B',
            refs: [{ name: 'Ribic et al. (MSI y beneficio de 5-FU adyuvante)', pmid: '12867608' }],
            cov: { t: 'NA' }
          }
        ],
        next: [ { label: 'Seguimiento', next: 'seguimiento-colon' } ]
      },

      'colon-II-riesgo': {
        type: 'q',
        text: 'Colon estadio II, pMMR/MSS: ¿tiene factores de alto riesgo?',
        help: 'Alto riesgo: T4, obstrucción/perforación, <12 ganglios examinados, invasión linfovascular o perineural, márgenes cercanos/positivos, grado 3 (indiferenciado).',
        options: [
          { label: 'Bajo riesgo', next: 'colon-II-bajo' },
          { label: 'Alto riesgo', next: 'colon-II-alto' }
        ]
      },

      'colon-II-bajo': {
        type: 'rec',
        title: 'Colon estadio II, pMMR, bajo riesgo',
        phase: 'adyuvancia',
        items: [
          {
            label: 'Vigilancia, sin quimioterapia adyuvante (preferido)',
            detail: 'El beneficio absoluto de la adyuvancia en estadio II de bajo riesgo es pequeño (≈2-4%); discutir con el paciente.',
            level: 'C',
            refs: [{ name: 'MOSAIC, subgrupo estadio II', pmid: '15175436' }],
            cov: { t: 'NA' }
          },
          {
            label: 'Capecitabina monoterapia, si se opta por adyuvancia',
            regimen: 'ccr-capecitabina',
            level: 'C',
            refs: [{ name: 'X-ACT (extrapolación de estadio III)', pmid: '15987918' }],
            cov: { t: 'FTM' }
          }
        ],
        next: [ { label: 'Seguimiento', next: 'seguimiento-colon' } ]
      },

      'colon-II-alto': {
        type: 'rec',
        title: 'Colon estadio II, pMMR, alto riesgo',
        phase: 'adyuvancia',
        items: [
          {
            label: 'CAPOX (capecitabina + oxaliplatino) por 3–6 meses',
            detail: '3 meses de CAPOX es una opción si el tumor no es T4 ni perforado y la resección ganglionar fue suficiente. En estadio II de alto riesgo, la no inferioridad de 3 meses no se demostró en la población global de IDEA; el resultado favorable a 3 meses con CAPOX sale del análisis por esquema, que no fue aleatorizado.',
            regimen: 'ccr-capox',
            level: 'C',
            refs: [{ name: 'IDEA, estadio II de alto riesgo (Iveson et al.)', pmid: '33439695' }, { name: 'ACHIEVE-2', pmid: '33121997' }],
            cov: { t: 'FTM' }
          },
          {
            label: 'mFOLFOX6 por 6 meses (alternativa)',
            regimen: 'ccr-folfox6m',
            level: 'B',
            refs: [{ name: 'MOSAIC', pmid: '15175436' }],
            cov: { t: 'FTM' }
          },
          {
            label: 'Capecitabina monoterapia, si oxaliplatino no tolerado o contraindicado',
            regimen: 'ccr-capecitabina',
            level: 'C',
            refs: [{ name: 'X-ACT', pmid: '15987918' }],
            cov: { t: 'FTM' }
          }
        ],
        next: [ { label: 'Seguimiento', next: 'seguimiento-colon' } ]
      },

      'colon-III-risk': {
        type: 'q',
        text: 'Colon estadio III: ¿riesgo bajo o alto?',
        help: 'Riesgo bajo: T1–T3 con N1 (1–3 ganglios). Riesgo alto: T4 y/o N2 (≥4 ganglios).',
        options: [
          { label: 'Riesgo bajo (T1–T3, N1)', next: 'colon-III-bajo' },
          { label: 'Riesgo alto (T4 y/o N2)', next: 'colon-III-alto' }
        ]
      },

      'colon-III-bajo': {
        type: 'rec',
        title: 'Colon estadio III, riesgo bajo (T1–T3N1)',
        phase: 'adyuvancia',
        items: [
          {
            label: 'CAPOX por 3 meses (preferido)',
            detail: 'En el subgrupo de bajo riesgo, 3 meses de CAPOX fue no inferior a 6 meses, con menor neurotoxicidad acumulada.',
            regimen: 'ccr-capox',
            level: 'A',
            refs: [{ name: 'IDEA collaboration', pmid: '29590544' }],
            cov: { t: 'FTM' }
          },
          {
            label: 'mFOLFOX6 por 3–6 meses (si se prefiere FOLFOX)',
            detail: 'Con FOLFOX la no-inferioridad de 3 meses fue menos consistente que con CAPOX; considerar 6 meses si el paciente tolera bien.',
            regimen: 'ccr-folfox6m',
            level: 'B',
            refs: [{ name: 'IDEA collaboration', pmid: '29590544' }],
            cov: { t: 'FTM' }
          }
        ],
        next: [ { label: 'Seguimiento', next: 'seguimiento-colon' } ]
      },

      'colon-III-alto': {
        type: 'rec',
        title: 'Colon estadio III, riesgo alto (T4 y/o N2)',
        phase: 'adyuvancia',
        items: [
          {
            label: 'CAPOX por 6 meses (preferido)',
            regimen: 'ccr-capox',
            level: 'A',
            refs: [{ name: 'IDEA collaboration', pmid: '29590544' }],
            cov: { t: 'FTM' }
          },
          {
            label: 'mFOLFOX6 por 6 meses (alternativa)',
            regimen: 'ccr-folfox6m',
            level: 'A',
            refs: [{ name: 'MOSAIC', pmid: '15175436' }, { name: 'IDEA collaboration', pmid: '29590544' }],
            cov: { t: 'FTM' }
          }
        ],
        next: [ { label: 'Seguimiento', next: 'seguimiento-colon' } ]
      },

      'seguimiento-colon': {
        type: 'rec',
        title: 'Seguimiento post-tratamiento — colon',
        phase: 'seguimiento',
        items: [
          {
            label: 'CEA cada 3–6 meses por 2 años, luego cada 6 meses hasta el año 5',
            level: 'C',
            refs: [{ name: 'Consenso ESMO / Pautas HC-UdelaR (resumen propio)', url: 'https://www.esmo.org' }],
            cov: { t: 'NA' }
          },
          {
            label: 'TC de tórax, abdomen y pelvis anual los primeros 3 años (estadio II–III); después, opcional',
            level: 'C',
            refs: [{ name: 'ESMO 2020, cáncer de colon localizado (Argilés et al.)', pmid: '32702383' }],
            cov: { t: 'NA' }
          },
          {
            label: 'Colonoscopía al año de la cirugía; luego cada 3–5 años, o antes según hallazgos o síntomas',
            level: 'C',
            refs: [{ name: 'ESMO 2020, cáncer de colon localizado (Argilés et al.)', pmid: '32702383' }],
            cov: { t: 'NA' }
          }
        ]
      },

      // ============================================================
      // 2) RECTO — LOCALMENTE AVANZADO
      // ============================================================
      'recto-eval': {
        type: 'q',
        text: 'Recto localmente avanzado: ¿estado MMR/MSI?',
        options: [
          { label: 'dMMR / MSI-H', next: 'recto-dmmr' },
          { label: 'pMMR / MSS', next: 'recto-tnt-eval' }
        ]
      },

      'recto-dmmr': {
        type: 'rec',
        title: 'Recto localmente avanzado, dMMR/MSI-H',
        phase: 'neoadyuvancia',
        items: [
          {
            label: 'Inmunoterapia neoadyuvante con dostarlimab (estrategia en investigación)',
            detail: 'Serie unicéntrica pequeña con remisión clínica completa en el 100% de los casos evaluables, permitiendo evitar quimiorradioterapia y cirugía; aún sin confirmación en fase III. Fármaco no evaluado por FNR/FTM; estrategia aún no estandarizada fuera de ensayo clínico: cobertura a verificar.',
            regimen: 'ccr-dostarlimab',
            level: 'C',
            refs: [{ name: 'Cercek et al.', pmid: '35660797' }],
            cov: { t: '?' }
          }
        ],
        next: [ { label: 'Manejo convencional (si no hay acceso a inmunoterapia)', next: 'recto-tnt-eval' } ]
      },

      'recto-tnt-eval': {
        type: 'q',
        text: 'Recto localmente avanzado, pMMR/MSS: ¿qué estrategia neoadyuvante?',
        help: 'La terapia neoadyuvante total (TNT) intensifica el tratamiento sistémico preoperatorio y habilita estrategias de preservación de órgano.',
        options: [
          { label: 'TNT: quimioterapia de inducción (mFOLFIRINOX) seguida de quimiorradioterapia', next: 'recto-induccion' },
          { label: 'TNT: quimiorradioterapia seguida de quimioterapia de consolidación', next: 'recto-consolidacion' },
          { label: 'TNT: radioterapia corta (5×5 Gy) seguida de quimioterapia sistémica', next: 'recto-rt-corta' },
          { label: 'Quimiorradioterapia larga preoperatoria clásica (sin TNT)', next: 'recto-qrt-clasica' }
        ]
      },

      'recto-induccion': {
        type: 'rec',
        title: 'TNT — quimioterapia de inducción + quimiorradioterapia',
        phase: 'neoadyuvancia',
        items: [
          {
            label: 'mFOLFIRINOX × 6 ciclos (inducción)',
            regimen: 'ccr-mfolfirinox-tnt',
            level: 'A',
            refs: [{ name: 'PRODIGE 23', pmid: '33862000' }],
            cov: { t: 'FTM' }
          },
          {
            label: 'Quimiorradioterapia con capecitabina concurrente',
            regimen: 'ccr-capecitabina-rt',
            level: 'A',
            refs: [{ name: 'PRODIGE 23', pmid: '33862000' }],
            cov: { t: 'FTM' }
          }
        ],
        next: [ { label: 'Reevaluar respuesta tras TNT', next: 'recto-reeval' } ]
      },

      'recto-consolidacion': {
        type: 'rec',
        title: 'TNT — quimiorradioterapia + quimioterapia de consolidación',
        phase: 'neoadyuvancia',
        items: [
          {
            label: 'Quimiorradioterapia con capecitabina concurrente',
            regimen: 'ccr-capecitabina-rt',
            level: 'A',
            refs: [{ name: 'OPRA', pmid: '35483010' }],
            cov: { t: 'FTM' }
          },
          {
            label: 'mFOLFOX6 × 4–8 ciclos (consolidación)',
            detail: 'Mayor duración de quimioterapia de consolidación se asoció a mayor tasa de preservación de órgano.',
            regimen: 'ccr-folfox-consolidacion',
            level: 'B',
            refs: [{ name: 'OPRA', pmid: '35483010' }],
            cov: { t: 'FTM' }
          }
        ],
        next: [ { label: 'Reevaluar respuesta tras TNT (candidato a watch & wait)', next: 'recto-reeval' } ]
      },

      'recto-rt-corta': {
        type: 'rec',
        title: 'TNT — radioterapia corta (5×5 Gy) + quimioterapia sistémica',
        phase: 'neoadyuvancia',
        items: [
          {
            label: 'Radioterapia corta, 25 Gy en 5 fracciones',
            level: 'B',
            refs: [{ name: 'RAPIDO', pmid: '36661037' }],
            cov: { t: 'NA' }
          },
          {
            label: 'CAPOX × 6 ciclos, tras la radioterapia',
            detail: 'A 5 años, esta secuencia redujo la falla a distancia pero mostró más recurrencia locorregional que la quimiorradioterapia larga clásica; individualizar según riesgo de cada componente.',
            regimen: 'ccr-capox',
            level: 'B',
            refs: [{ name: 'RAPIDO', pmid: '36661037' }],
            cov: { t: 'FTM' }
          }
        ],
        next: [ { label: 'Reevaluar respuesta tras TNT', next: 'recto-reeval' } ]
      },

      'recto-qrt-clasica': {
        type: 'rec',
        title: 'Quimiorradioterapia larga preoperatoria clásica',
        phase: 'neoadyuvancia',
        items: [
          {
            label: 'Quimiorradioterapia con capecitabina concurrente (sin quimioterapia de inducción/consolidación)',
            regimen: 'ccr-capecitabina-rt',
            level: 'A',
            refs: [{ name: 'CAO/ARO/AIO-94 (Sauer et al.)', pmid: '15496622' }, { name: 'Capecitabina vs. 5-FU en QRT (Hofheinz et al.)', pmid: '22503032' }, { name: 'ESMO 2017, cáncer de recto (Glynne-Jones et al.)', pmid: '28881920' }],
            cov: { t: 'FTM' }
          }
        ],
        next: [ { label: 'Cirugía y adyuvancia', next: 'recto-cirugia-adyuvancia' } ]
      },

      'recto-reeval': {
        type: 'q',
        text: 'Tras completar la TNT: ¿respuesta clínica?',
        options: [
          { label: 'Respuesta clínica completa', next: 'recto-wnw' },
          { label: 'Respuesta incompleta o persistencia tumoral', next: 'recto-cirugia' }
        ]
      },

      'recto-wnw': {
        type: 'rec',
        title: 'Respuesta clínica completa — vigilancia sin cirugía (watch & wait)',
        phase: 'seguimiento',
        items: [
          {
            label: 'Vigilancia estrecha con endoscopía y RM cada 3–4 meses los primeros 2 años',
            detail: 'Aproximadamente uno de cada cuatro a cinco pacientes recae localmente; la mayoría de las recaídas locales tempranas son rescatables con cirugía.',
            level: 'B',
            refs: [{ name: 'OPRA', pmid: '35483010' }],
            cov: { t: 'NA' }
          }
        ],
        next: [ { label: 'Recurrencia local durante seguimiento', next: 'recto-cirugia' } ]
      },

      'recto-cirugia': {
        type: 'rec',
        title: 'Cirugía de rescate o por respuesta incompleta — escisión total de mesorrecto',
        phase: 'primario',
        items: [
          {
            label: 'Escisión total de mesorrecto',
            level: 'A',
            refs: [{ name: 'Escisión total del mesorrecto (MacFarlane, Ryall y Heald)', pmid: '8094488' }, { name: 'Ensayo holandés ETM ± RT corta (Kapiteijn et al.)', pmid: '11547717' }],
            cov: { t: 'NA' }
          },
          {
            label: 'Completar quimioterapia adyuvante si la neoadyuvancia fue incompleta (individualizar)',
            regimen: 'ccr-folfox6m',
            level: 'C',
            refs: [{ name: 'ESMO 2017, cáncer de recto (Glynne-Jones et al.)', pmid: '28881920' }],
            cov: { t: 'FTM' }
          }
        ],
        next: [ { label: 'Seguimiento', next: 'seguimiento-recto' } ]
      },

      'recto-cirugia-adyuvancia': {
        type: 'rec',
        title: 'Cirugía + quimioterapia adyuvante (esquema clásico sin TNT)',
        phase: 'adyuvancia',
        items: [
          {
            label: 'Escisión total de mesorrecto',
            level: 'A',
            refs: [{ name: 'Escisión total del mesorrecto (MacFarlane, Ryall y Heald)', pmid: '8094488' }, { name: 'Ensayo holandés ETM ± RT corta (Kapiteijn et al.)', pmid: '11547717' }],
            cov: { t: 'NA' }
          },
          {
            label: 'CAPOX o mFOLFOX6 adyuvante, hasta completar ~6 meses de tratamiento sistémico total',
            regimen: 'ccr-capox',
            level: 'B',
            refs: [{ name: 'CAO/ARO/AIO-04 (Rödel et al.)', pmid: '26189067' }, { name: 'ESMO 2017, cáncer de recto (Glynne-Jones et al.)', pmid: '28881920' }],
            cov: { t: 'FTM' }
          }
        ],
        next: [ { label: 'Seguimiento', next: 'seguimiento-recto' } ]
      },

      'seguimiento-recto': {
        type: 'rec',
        title: 'Seguimiento post-tratamiento — recto',
        phase: 'seguimiento',
        items: [
          {
            label: 'Control clínico y CEA cada 3 meses los primeros 2 años, cada 3–6 meses el 3.er año y cada 6 meses los años 4 y 5',
            detail: 'El CEA y la TC programados aumentan la detección de recaídas resecables (FACS), sin beneficio demostrado en sobrevida global con un seguimiento más intensivo (COLOFOL).',
            level: 'C',
            refs: [{ name: 'FACS (Primrose et al.)', pmid: '24430319' }, { name: 'COLOFOL (Wille-Jørgensen et al.)', pmid: '29800179' }, { name: 'ESMO 2017, cáncer de recto (Glynne-Jones et al.)', pmid: '28881920' }],
            cov: { t: 'NA' }
          },
          {
            label: 'TC de tórax, abdomen y pelvis anual los primeros 3 años; después, opcional',
            level: 'C',
            refs: [{ name: 'ESMO 2017, cáncer de recto (Glynne-Jones et al.)', pmid: '28881920' }, { name: 'FACS (Primrose et al.)', pmid: '24430319' }],
            cov: { t: 'NA' }
          },
          {
            label: 'Endoscopía/RM pélvica según estrategia usada (más frecuente si watch & wait)',
            level: 'C',
            refs: [{ name: 'OPRA', pmid: '35483010' }],
            cov: { t: 'NA' }
          }
        ]
      },

      // ============================================================
      // 3) ENFERMEDAD METASTÁSICA
      // ============================================================
      'mets-eval': {
        type: 'q',
        text: 'Enfermedad metastásica: ¿estado MMR/MSI?',
        help: 'Solicitar también RAS (KRAS/NRAS), BRAF V600E y lateralidad del tumor primario en todo paciente pMMR/MSS candidato a terapia sistémica.',
        options: [
          { label: 'dMMR / MSI-H', next: 'mets-dmmr' },
          { label: 'pMMR / MSS (definir RAS/BRAF y resecabilidad)', next: 'mets-resecabilidad' }
        ]
      },

      'mets-dmmr': {
        type: 'rec',
        title: 'CCR metastásico, dMMR/MSI-H — 1ª línea',
        phase: 'Enfermedad avanzada · 1ª línea',
        items: [
          {
            label: 'Pembrolizumab 200 mg IV cada 3 semanas',
            regimen: 'ccr-pembrolizumab',
            level: 'A',
            refs: [{ name: 'KEYNOTE-177', pmid: '33264544' }],
            cov: { t: 'FNR', ind: 'c-pembro' }
          }
        ],
        next: [ { label: 'Progresión', next: 'mets-2l-general' } ]
      },

      'mets-resecabilidad': {
        type: 'q',
        text: 'Enfermedad metastásica pMMR/MSS: ¿resecabilidad de las metástasis (p. ej. hepáticas o pulmonares)?',
        options: [
          { label: 'Resecable de inicio', next: 'mets-resecable' },
          { label: 'Potencialmente resecable o irresecable: definir terapia sistémica por biomarcador y línea', next: 'mets-biomarcador' }
        ]
      },

      'mets-resecable': {
        type: 'rec',
        title: 'Metástasis resecables de inicio (p. ej. hepáticas oligometastásicas)',
        phase: 'Enfermedad avanzada · primario',
        items: [
          {
            label: 'Metastasectomía (p. ej. hepatectomía)',
            level: 'A',
            refs: [{ name: 'ESMO 2022, CCR metastásico (Cervantes et al.)', pmid: '36307056' }],
            cov: { t: 'NA' }
          },
          {
            label: 'Quimioterapia perioperatoria con mFOLFOX6 (≈3 meses antes y después de la cirugía)',
            detail: 'Mejora la sobrevida libre de progresión; el beneficio en sobrevida global no alcanzó significación estadística en el seguimiento a largo plazo.',
            regimen: 'ccr-folfox6m',
            level: 'B',
            refs: [{ name: 'EORTC 40983', pmid: '18358928' }],
            cov: { t: 'FTM' }
          }
        ],
        next: [ { label: 'Seguimiento', next: 'seguimiento-mets' } ]
      },

      'seguimiento-mets': {
        type: 'rec',
        title: 'Seguimiento tras metastasectomía',
        phase: 'seguimiento',
        items: [
          {
            label: 'CEA e imágenes (TC tórax/abdomen/pelvis) cada 3–6 meses por 2 años, luego cada 6–12 meses',
            level: 'C',
            refs: [{ name: 'ESMO 2022, CCR metastásico (Cervantes et al.)', pmid: '36307056' }, { name: 'FACS (Primrose et al.)', pmid: '24430319' }],
            cov: { t: 'NA' }
          }
        ]
      },

      'mets-biomarcador': {
        type: 'q',
        text: '¿RAS/BRAF y lateralidad del tumor primario?',
        help: 'La respuesta a anti-EGFR (cetuximab) requiere RAS y BRAF wild-type, y es mayor en primarios de colon izquierdo/recto que en colon derecho.',
        options: [
          { label: 'RAS/BRAF wild-type, colon izquierdo o recto', next: 'mets-1l-izq-wt' },
          { label: 'RAS/BRAF wild-type, colon derecho', next: 'mets-1l-der-wt' },
          { label: 'RAS mutado (KRAS/NRAS)', next: 'mets-1l-ras-mut' },
          { label: 'BRAF V600E mutado', next: 'mets-1l-braf' }
        ]
      },

      'mets-1l-izq-wt': {
        type: 'rec',
        title: '1ª línea, RAS/BRAF wild-type, colon izquierdo o recto',
        phase: 'Enfermedad avanzada · 1ª línea',
        items: [
          {
            label: 'FOLFIRI + cetuximab (preferido en primario izquierdo)',
            regimen: 'ccr-folfiri-cetux',
            level: 'A',
            refs: [{ name: 'CRYSTAL', pmid: '19339720' }, { name: 'FIRE-3', pmid: '25456373' }],
            cov: { t: 'FNR', ind: 'c-cetux' }
          },
          {
            label: 'mFOLFOX6 + cetuximab (alternativa)',
            detail: 'La normativa FNR cubre cetuximab sólo asociado a un plan con irinotecán (FOLFIRI); con oxaliplatino la cobertura no está contemplada.',
            regimen: 'ccr-folfox-cetux',
            level: 'B',
            refs: [{ name: 'OPUS', pmid: '19114683' }, { name: 'OPUS, actualización RAS', pmid: '21228335' }],
            cov: { t: '?' }
          },
          {
            label: 'mFOLFOX6 o FOLFIRI + bevacizumab (alternativa a anti-EGFR)',
            regimen: 'ccr-folfox-bev',
            level: 'A',
            refs: [{ name: 'CALGB/SWOG 80405', pmid: '28632865' }],
            cov: { t: 'FNR', ind: 'c-bev' }
          },
          {
            label: 'FOLFOXIRI + bevacizumab, si enfermedad de alto volumen/sintomática y buen estado general',
            regimen: 'ccr-folfoxiri-bev',
            level: 'A',
            refs: [{ name: 'TRIBE2', pmid: '32164906' }],
            cov: { t: 'FNR', ind: 'c-bev' }
          }
        ],
        next: [ { label: 'Progresión', next: 'mets-2l-general' } ]
      },

      'mets-1l-der-wt': {
        type: 'rec',
        title: '1ª línea, RAS/BRAF wild-type, colon derecho',
        phase: 'Enfermedad avanzada · 1ª línea',
        items: [
          {
            label: 'mFOLFOX6 o FOLFIRI + bevacizumab (preferido en primario derecho)',
            detail: 'En análisis por lateralidad, el beneficio de cetuximab sobre bevacizumab se concentra en primarios izquierdos; en el derecho, los anti-EGFR aportan poco o nada.',
            regimen: 'ccr-folfox-bev',
            level: 'A',
            refs: [{ name: 'CALGB/SWOG 80405', pmid: '28632865' }, { name: 'FIRE-3', pmid: '25456373' }],
            cov: { t: 'FNR', ind: 'c-bev' }
          },
          {
            label: 'FOLFOXIRI + bevacizumab, si enfermedad de alto volumen y buen estado general',
            regimen: 'ccr-folfoxiri-bev',
            level: 'A',
            refs: [{ name: 'TRIBE2', pmid: '32164906' }],
            cov: { t: 'FNR', ind: 'c-bev' }
          }
        ],
        next: [ { label: 'Progresión', next: 'mets-2l-general' } ]
      },

      'mets-1l-ras-mut': {
        type: 'rec',
        title: '1ª línea, RAS mutado (KRAS/NRAS)',
        phase: 'Enfermedad avanzada · 1ª línea',
        items: [
          {
            label: 'mFOLFOX6, CAPOX o FOLFIRI + bevacizumab',
            detail: 'Los anti-EGFR (cetuximab) están contraindicados: no hay beneficio en tumores RAS mutado.',
            regimen: 'ccr-folfox-bev',
            level: 'A',
            refs: [{ name: 'CALGB/SWOG 80405', pmid: '28632865' }],
            cov: { t: 'FNR', ind: 'c-bev' }
          },
          {
            label: 'FOLFOXIRI + bevacizumab, si enfermedad de alto volumen y buen estado general',
            regimen: 'ccr-folfoxiri-bev',
            level: 'A',
            refs: [{ name: 'TRIBE2', pmid: '32164906' }],
            cov: { t: 'FNR', ind: 'c-bev' }
          }
        ],
        next: [ { label: 'Progresión', next: 'mets-2l-general' } ]
      },

      'mets-1l-braf': {
        type: 'rec',
        title: '1ª línea, BRAF V600E mutado',
        phase: 'Enfermedad avanzada · 1ª línea',
        help: 'Peor pronóstico biológico. Es el único subgrupo con un ensayo fase III propio en 1ª línea (BREAKWATER).',
        items: [
          {
            label: 'Encorafenib + cetuximab + mFOLFOX6',
            detail: 'BREAKWATER (fase III) frente a quimioterapia ± bevacizumab: mejor SVLP (HR 0,53) y SG en análisis interino (mediana 30,3 vs. 15,1 meses; HR 0,49). Dosis: verificar contra el protocolo del ensayo antes de cargar el régimen. Fármaco no evaluado por FNR para esta indicación: cobertura a verificar.',
            level: 'A',
            refs: [{ name: 'BREAKWATER (Elez et al.)', pmid: '40444708' }],
            cov: { t: '?' }
          },
          {
            label: 'FOLFOXIRI + bevacizumab, si PS 0–1',
            detail: 'En el metaanálisis de datos individuales (5 ensayos, 1697 pacientes) FOLFOXIRI + bevacizumab mejoró la SG frente a dobletes + bevacizumab en la población general, pero no mostró beneficio adicional en tumores BRAF mutados. El dato favorable previo venía de un subgrupo de TRIBE.',
            regimen: 'ccr-folfoxiri-bev',
            level: 'C',
            refs: [{ name: 'Metaanálisis de datos individuales FOLFOXIRI + bevacizumab (Cremolini et al.)', pmid: '32816630' }, { name: 'TRIBE2', pmid: '32164906' }],
            cov: { t: 'FNR', ind: 'c-bev' }
          },
          {
            label: 'mFOLFOX6 o FOLFIRI + bevacizumab (alternativa)',
            regimen: 'ccr-folfox-bev',
            level: 'B',
            refs: [{ name: 'CALGB/SWOG 80405', pmid: '28632865' }],
            cov: { t: 'FNR', ind: 'c-bev' }
          }
        ],
        next: [ { label: 'Progresión', next: 'mets-2l-braf' } ]
      },

      'mets-2l-general': {
        type: 'rec',
        title: '2ª línea, CCR metastásico (no BRAF V600E)',
        phase: 'Enfermedad avanzada · 2ª línea',
        items: [
          {
            label: 'Cambio de backbone (FOLFOX↔FOLFIRI) + bevacizumab, continuando o iniciando anti-VEGF',
            detail: 'Mantener bevacizumab más allá de la progresión aporta beneficio de sobrevida global.',
            regimen: 'ccr-folfiri-bev',
            level: 'A',
            refs: [{ name: 'ML18147', pmid: '23168366' }],
            cov: { t: 'FNR', ind: 'c-bev' }
          },
          {
            label: 'FOLFIRI + cetuximab, si RAS/BRAF wild-type, primario izquierdo/recto y no usado en 1ª línea',
            detail: 'La normativa FNR de cetuximab exige no haber recibido tratamiento sistémico previo para la enfermedad metastásica: en 2ª línea no está cubierto por esa vía.',
            regimen: 'ccr-folfiri-cetux',
            level: 'B',
            refs: [{ name: 'EPIC (cetuximab + irinotecán en 2ª línea)', pmid: '18390971' }],
            cov: { t: '?' }
          }
        ],
        next: [ { label: 'Progresión ulterior', next: 'mets-3l' } ]
      },

      'mets-2l-braf': {
        type: 'rec',
        title: '2ª línea, BRAF V600E mutado',
        phase: 'Enfermedad avanzada · 2ª línea',
        items: [
          {
            label: 'Encorafenib + cetuximab',
            regimen: 'ccr-encorafenib-cetux',
            level: 'A',
            refs: [{ name: 'BEACON CRC', pmid: '31566309' }],
            cov: { t: 'NC' }
          }
        ],
        next: [ { label: 'Progresión ulterior', next: 'mets-3l' } ]
      },

      'mets-3l': {
        type: 'rec',
        title: '3ª línea o posterior, CCR metastásico',
        phase: 'Enfermedad avanzada · 3ª línea',
        items: [
          {
            label: 'Regorafenib 160 mg/día VO (3 semanas de cada 4)',
            detail: 'Una fuente indica que el FTM lo incorporó; no se pudo confirmar de forma independiente. Verificar normativa vigente antes de indicar.',
            regimen: 'ccr-regorafenib',
            level: 'A',
            refs: [{ name: 'CORRECT', pmid: '23177514' }],
            cov: { t: '?' }
          },
          {
            label: 'Trifluridina-tipiracil (TAS-102)',
            regimen: 'ccr-trifluridina-tipiracil',
            level: 'A',
            refs: [{ name: 'RECOURSE', pmid: '25970050' }],
            cov: { t: 'NC' }
          }
        ]
      }
    },
    notes: [
      'Borrador asistido por IA. Requiere revisión y validación por oncólogo humano antes de uso clínico.',
      'La cobertura FNR/FTM/NC se limita a lo indicado explícitamente en cada ítem; ante cualquier duda, verificar la normativa vigente antes de indicar tratamiento.',
      'Todo paciente con diagnóstico de CCR debe tener testeo de MMR/MSI; en metastásico se agrega RAS (KRAS/NRAS) y BRAF V600E.'
    ]
  };
})(window.FNRO = window.FNRO || {});
