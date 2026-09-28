/* Vía terapéutica: Cáncer de mama.
   Borrador redactado en "sala limpia": sin consulta de guías de sociedades oncológicas
   estadounidenses. Fuentes: ensayos pivotales (PubMed), aprobaciones FDA/EMA, Pautas de
   Oncología Médica HC/UdelaR 2023 y ESMO resumidas con palabras propias. */
(function (R) {
  R.pathways = R.pathways || {};

  R.pathways.mama = {
    tumor: 'mama',
    title: 'Cáncer de mama',
    status: 'borrador',
    updated: '2026-09-28',
    authors: ['Borrador asistido por IA'],
    start: 'inicio',
    nodes: {

      /* ---------------- INICIO ---------------- */
      'inicio': {
        type: 'q',
        text: '¿Cuál es el escenario clínico y subtipo tumoral?',
        help: 'Definido por RE/RP (inmunohistoquímica) y HER2 (IHQ/ISH)',
        options: [
          { label: 'Carcinoma in situ (estadio 0)', next: 'cis', stages: ['0'] },
          { label: 'RH+ / HER2− invasivo', next: 'rh-esc' },
          { label: 'HER2+ invasivo (cualquier RH)', next: 'her2-esc' },
          { label: 'Triple negativo invasivo (RE−, RP−, HER2−)', next: 'tn-esc' },
          { label: 'Seguimiento post-tratamiento', next: 'seguimiento' }
        ]
      },

      'cis': {
        type: 'rec',
        title: 'Carcinoma in situ (estadio 0)',
        phase: 'primario',
        items: [
          {
            label: 'Cirugía conservadora o mastectomía según extensión',
            detail: 'Biopsia de ganglio centinela no siempre requerida en DCIS puro',
            level: 'A',
            refs: [{ name: 'Pautas de Oncología Médica HC/UdelaR 2023', url: 'https://oncologiamedica.hc.edu.uy/wp-content/uploads/2024/09/R-PAUTAS-DE-ONCOLOGIA-MEDICA-2023-final.pdf' }],
            cov: { t: 'NA' }
          },
          {
            label: 'Radioterapia adyuvante tras cirugía conservadora',
            detail: 'Reduce la recurrencia ipsilateral, sin impacto demostrado en sobrevida global.',
            level: 'B',
            refs: [{ name: 'NSABP B-17', pmid: '8292119' }],
            cov: { t: 'NA' }
          },
          {
            label: 'Tamoxifeno 20 mg/día × 5 años si RE positivo',
            detail: 'Reduce recurrencia ipsilateral y contralateral, sin impacto en sobrevida global',
            regimen: 'mama-tamoxifeno',
            level: 'A',
            refs: [{ name: 'NSABP B-24', pmid: '10376613' }],
            cov: { t: 'FTM' }
          }
        ],
        next: [{ label: 'Finalizado tratamiento', next: 'seguimiento' }]
      },

      /* ================= RH+ / HER2− ================= */
      'rh-esc': {
        type: 'q',
        text: '¿Escenario clínico dentro de RH+/HER2−?',
        options: [
          { label: 'Estadio I–IIIA operable', next: 'rh-temprano-q', stages: ['IA', 'IB', 'IIA', 'IIB', 'IIIA'] },
          { label: 'Localmente avanzado / inflamatorio (IIIB–IIIC)', next: 'rh-neo', stages: ['IIIB', 'IIIC'] },
          { label: 'Enfermedad metastásica', next: 'rh-av-1l', stages: ['IV'] }
        ]
      },

      'rh-temprano-q': {
        type: 'q',
        text: '¿Riesgo de recurrencia (tamaño, ganglios, grado, Ki67 o firma genómica si disponible)?',
        help: 'Test genómico (Oncotype DX / MammaPrint) no siempre disponible en nuestro medio',
        options: [
          { label: 'Bajo riesgo (ganglios negativos, score bajo si disponible)', next: 'rh-temprano-bajo-menop' },
          { label: 'Alto riesgo (ganglios positivos o score alto)', next: 'rh-temprano-alto-quimio' }
        ]
      },

      'rh-temprano-alto-quimio': {
        type: 'rec',
        title: 'RH+/HER2−, estadio temprano de alto riesgo: quimioterapia adyuvante',
        phase: 'adyuvancia',
        items: [
          {
            label: 'Doxorrubicina + ciclofosfamida (AC) × 4, luego paclitaxel semanal × 12',
            detail: 'Indicado en ganglios positivos o alto riesgo clínico-patológico',
            regimen: 'mama-ac',
            level: 'A',
            refs: [{ name: 'ECOG E1199 (paclitaxel semanal)', pmid: '18420499' }, { name: 'CALGB 9741 (dosis densa)', pmid: '12668651' }],
            cov: { t: 'FTM' }
          },
          {
            label: 'Inhibidor de CDK4/6 adyuvante (abemaciclib) en alto riesgo con ganglios positivos',
            detail: 'No evaluado en esta guía por falta de cobertura confirmada en Uruguay',
            level: 'A',
            refs: [{ name: 'monarchE', pmid: '32954927' }],
            cov: { t: 'NC' }
          }
        ],
        next: [{ label: 'Completada la quimioterapia, adyuvancia hormonal', next: 'rh-temprano-menop' }]
      },

      'rh-temprano-bajo-menop': {
        type: 'q',
        text: '¿Estado menopáusico?',
        options: [
          { label: 'Premenopáusica', next: 'rh-adj-horm-premeno' },
          { label: 'Postmenopáusica', next: 'rh-adj-horm-postmeno' }
        ]
      },

      'rh-temprano-menop': {
        type: 'q',
        text: '¿Estado menopáusico?',
        options: [
          { label: 'Premenopáusica', next: 'rh-adj-horm-premeno' },
          { label: 'Postmenopáusica', next: 'rh-adj-horm-postmeno' }
        ]
      },

      'rh-adj-horm-premeno': {
        type: 'rec',
        title: 'RH+/HER2−, adyuvancia hormonal en premenopáusica',
        phase: 'adyuvancia',
        items: [
          {
            label: 'Tamoxifeno 20 mg/día × 5–10 años',
            regimen: 'mama-tamoxifeno',
            level: 'A',
            refs: [{ name: 'Pautas de Oncología Médica HC/UdelaR 2025, cáncer de mama localizado', url: 'https://oncologiamedica.hc.edu.uy/publicaciones/pautas-de-oncologia-medica-para-el-diagnostico-tratamiento-sistemico-y-seguimiento/' }],
            cov: { t: 'FTM' }
          },
          {
            label: 'Supresión ovárica (goserelina) + inhibidor de aromatasa en alto riesgo',
            detail: 'Preferir sobre tamoxifeno solo en pacientes jóvenes de alto riesgo',
            regimen: 'mama-ofs-ai',
            level: 'A',
            refs: [{ name: 'SOFT/TEXT', pmid: '24881463' }],
            cov: { t: 'FTM' }
          }
        ],
        next: [{ label: 'Finalizado tratamiento', next: 'seguimiento' }]
      },

      'rh-adj-horm-postmeno': {
        type: 'rec',
        title: 'RH+/HER2−, adyuvancia hormonal en postmenopáusica',
        phase: 'adyuvancia',
        items: [
          {
            label: 'Inhibidor de aromatasa (letrozol/anastrozol/exemestano) × 5 años',
            regimen: 'mama-ai',
            level: 'A',
            refs: [{ name: 'Pautas de Oncología Médica HC/UdelaR 2025, cáncer de mama localizado', url: 'https://oncologiamedica.hc.edu.uy/publicaciones/pautas-de-oncologia-medica-para-el-diagnostico-tratamiento-sistemico-y-seguimiento/' }],
            cov: { t: 'FTM' }
          },
          {
            label: 'Tamoxifeno 20 mg/día si intolerancia a inhibidor de aromatasa',
            regimen: 'mama-tamoxifeno',
            level: 'A',
            refs: [{ name: 'Pautas de Oncología Médica HC/UdelaR 2025, cáncer de mama localizado', url: 'https://oncologiamedica.hc.edu.uy/publicaciones/pautas-de-oncologia-medica-para-el-diagnostico-tratamiento-sistemico-y-seguimiento/' }],
            cov: { t: 'FTM' }
          }
        ],
        next: [{ label: 'Finalizado tratamiento', next: 'seguimiento' }]
      },

      'rh-neo': {
        type: 'rec',
        title: 'RH+/HER2−, localmente avanzado: neoadyuvancia',
        phase: 'neoadyuvancia',
        items: [
          {
            label: 'Quimioterapia neoadyuvante AC seguida de taxano semanal',
            detail: 'Menor tasa de respuesta patológica completa que en HER2+ o triple negativo; valorar cirugía primaria si es operable',
            regimen: 'mama-ac',
            level: 'B',
            refs: [{ name: 'Pautas de Oncología Médica HC/UdelaR 2025, cáncer de mama localizado', url: 'https://oncologiamedica.hc.edu.uy/publicaciones/pautas-de-oncologia-medica-para-el-diagnostico-tratamiento-sistemico-y-seguimiento/' }],
            cov: { t: 'FTM' }
          }
        ],
        next: [
          { label: 'Cirugía realizada, definir adyuvancia hormonal', next: 'rh-temprano-menop' }
        ]
      },

      'rh-av-1l': {
        type: 'rec',
        title: 'RH+/HER2− avanzado, 1ª línea',
        phase: 'avanzada · 1ª línea',
        items: [
          {
            label: 'Ribociclib + inhibidor de aromatasa (+ supresión ovárica si premenopáusica)',
            detail: 'Beneficio en sobrevida global demostrado en postmenopáusicas; en premenopáusicas se agrega goserelina',
            regimen: 'mama-ribociclib-ai',
            level: 'A',
            refs: [{ name: 'MONALEESA-2', pmid: '27717303' }, { name: 'MONALEESA-2, SG (Hortobagyi et al.)', pmid: '35263519' }, { name: 'MONALEESA-7 (premenopáusicas)', pmid: '29804902' }],
            cov: { t: 'FNR', ind: 'm-ribo1' }
          },
          {
            label: 'Fulvestrant en monoterapia si inhibidor de CDK4/6 contraindicado',
            regimen: 'mama-fulvestrant',
            level: 'B',
            refs: [{ name: 'FALCON', pmid: '27908454' }],
            cov: { t: 'FNR', ind: 'm-fulv' }
          }
        ],
        next: [{ label: 'Progresión', next: 'rh-av-2l' }]
      },

      'rh-av-2l': {
        type: 'rec',
        title: 'RH+/HER2− avanzado, 2ª línea',
        phase: 'avanzada · 2ª línea',
        items: [
          {
            label: 'Ribociclib + fulvestrant (si no recibió CDK4/6 previo)',
            regimen: 'mama-ribociclib-fulvestrant',
            level: 'A',
            refs: [{ name: 'MONALEESA-3', pmid: '29860922' }, { name: 'MONALEESA-3, SG (Slamon et al.)', pmid: '31826360' }],
            cov: { t: 'FNR', ind: 'm-ribo2' }
          },
          {
            label: 'Fulvestrant en monoterapia tras progresión a un CDK4/6',
            regimen: 'mama-fulvestrant',
            level: 'B',
            refs: [{ name: 'Pautas de Oncología Médica HC/UdelaR 2025, cáncer de mama metastásico', url: 'https://oncologiamedica.hc.edu.uy/publicaciones/pautas-de-oncologia-medica-para-el-diagnostico-tratamiento-sistemico-y-seguimiento/' }],
            cov: { t: 'FNR', ind: 'm-fulv' }
          },
          {
            label: 'PIK3CA mutado: considerar inhibidor de PI3K (alpelisib) + fulvestrant',
            detail: 'Requiere testeo molecular no siempre disponible; cobertura a confirmar',
            level: 'B',
            refs: [{ name: 'SOLAR-1', pmid: '31091374' }],
            cov: { t: '?' }
          }
        ],
        next: [{ label: 'Progresión ulterior', next: 'rh-av-3l' }]
      },

      'rh-av-3l': {
        type: 'rec',
        title: 'RH+/HER2− avanzado, líneas posteriores',
        phase: 'avanzada · líneas posteriores',
        items: [
          {
            label: 'Quimioterapia secuencial: capecitabina',
            regimen: 'mama-capecitabina',
            level: 'B',
            refs: [{ name: 'Pautas de Oncología Médica HC/UdelaR 2025, cáncer de mama metastásico', url: 'https://oncologiamedica.hc.edu.uy/publicaciones/pautas-de-oncologia-medica-para-el-diagnostico-tratamiento-sistemico-y-seguimiento/' }],
            cov: { t: 'FTM' }
          },
          {
            label: 'Paclitaxel u otro taxano en monoterapia',
            regimen: 'mama-paclitaxel-av',
            level: 'B',
            refs: [{ name: 'Pautas de Oncología Médica HC/UdelaR 2025, cáncer de mama metastásico', url: 'https://oncologiamedica.hc.edu.uy/publicaciones/pautas-de-oncologia-medica-para-el-diagnostico-tratamiento-sistemico-y-seguimiento/' }],
            cov: { t: 'FTM' }
          },
          {
            label: 'Sacituzumab govitecan (RH+ post múltiples líneas)',
            detail: 'Aprobado por FDA/EMA para RH+/HER2− tras endocrino y ≥2 quimioterapias; sin cobertura confirmada en Uruguay',
            regimen: 'mama-sacituzumab',
            level: 'A',
            refs: [{ name: 'TROPiCS-02 (sobrevida global)', pmid: '37633306' }],
            cov: { t: 'NC' }
          }
        ]
      },

      /* ================= HER2+ ================= */
      'her2-esc': {
        type: 'q',
        text: '¿Escenario clínico dentro de HER2+?',
        options: [
          { label: 'Tumor pequeño, ganglios negativos (≤3 cm, N0)', next: 'her2-temprano-pequeno', stages: ['IA', 'IB'] },
          { label: 'Estadio II–IIIA (mayor tamaño o ganglios positivos)', next: 'her2-neo', stages: ['IIA', 'IIB', 'IIIA'] },
          { label: 'Localmente avanzado / inflamatorio (IIIB–IIIC)', next: 'her2-neo', stages: ['IIIB', 'IIIC'] },
          { label: 'Enfermedad metastásica', next: 'her2-av-1l', stages: ['IV'] }
        ]
      },

      'her2-temprano-pequeno': {
        type: 'rec',
        title: 'HER2+, tumor pequeño ganglios negativos: adyuvancia directa',
        phase: 'adyuvancia',
        items: [
          {
            label: 'Paclitaxel semanal + trastuzumab (esquema APT) × 12 semanas, trastuzumab hasta 1 año',
            detail: 'Reservado a tumores ≤3 cm con ganglios negativos; excelente pronóstico',
            regimen: 'mama-apt',
            level: 'C',
            refs: [{ name: 'APT trial', pmid: '30939096' }],
            cov: { t: 'FNR', ind: 'm-adj-t' }
          }
        ],
        next: [
          { label: 'RH positivo: agregar hormonoterapia adyuvante', next: 'rh-temprano-menop' },
          { label: 'RH negativo: finalizado tratamiento', next: 'seguimiento' }
        ]
      },

      'her2-neo': {
        type: 'rec',
        title: 'HER2+, neoadyuvancia',
        phase: 'neoadyuvancia',
        items: [
          {
            label: 'Docetaxel + carboplatino + trastuzumab + pertuzumab (TCHP) × 6 ciclos',
            detail: 'Mayor tasa de respuesta patológica completa que trastuzumab solo',
            regimen: 'mama-tchp',
            level: 'B',
            refs: [
              { name: 'NeoSphere', pmid: '22153890' },
              { name: 'TRYPHAENA', nct: 'NCT00976989' }
            ],
            cov: { t: 'FNR', ind: 'm-neo-tp' }
          },
          {
            label: 'Paclitaxel + trastuzumab neoadyuvante si pertuzumab no disponible',
            regimen: 'mama-th-neo',
            level: 'B',
            refs: [{ name: 'NeoSphere', pmid: '22153890' }],
            cov: { t: 'FNR', ind: 'm-neo-t' }
          }
        ],
        next: [{ label: 'Cirugía realizada, evaluar respuesta patológica', next: 'her2-rpc' }]
      },

      'her2-rpc': {
        type: 'q',
        text: '¿Respuesta patológica completa (ypT0/is ypN0) tras neoadyuvancia?',
        options: [
          { label: 'Sí, respuesta patológica completa', next: 'her2-adj-rpc-si' },
          { label: 'No, enfermedad residual invasiva', next: 'her2-adj-residual' }
        ]
      },

      'her2-adj-rpc-si': {
        type: 'rec',
        title: 'HER2+, adyuvancia tras respuesta patológica completa',
        phase: 'adyuvancia',
        items: [
          {
            label: 'Completar trastuzumab hasta 1 año total',
            regimen: 'mama-trastuzumab-adj',
            level: 'A',
            refs: [{ name: 'HERA', pmid: '16236737' }],
            cov: { t: 'FNR', ind: 'm-adj-t' }
          },
          {
            label: 'Agregar pertuzumab al trastuzumab adyuvante (ganglios positivos)',
            detail: 'La normativa FNR de adyuvancia cubre trastuzumab; pertuzumab adyuvante no figura en ella. El beneficio de APHINITY en sobrevida libre de enfermedad invasiva se concentró en ganglios positivos; a 6 años, sin diferencia significativa en SG.',
            regimen: 'mama-pertuzumab-trastuzumab-adj',
            level: 'A',
            refs: [{ name: 'APHINITY', pmid: '28581356' }, { name: 'APHINITY, 6 años (Piccart et al.)', pmid: '33539215' }],
            cov: { t: '?' }
          }
        ],
        next: [
          { label: 'RH positivo: agregar hormonoterapia adyuvante', next: 'rh-temprano-menop' },
          { label: 'RH negativo: finalizado tratamiento', next: 'seguimiento' }
        ]
      },

      'her2-adj-residual': {
        type: 'rec',
        title: 'HER2+, adyuvancia con enfermedad residual invasiva',
        phase: 'adyuvancia',
        items: [
          {
            label: 'Trastuzumab emtansina (T-DM1) × 14 ciclos',
            detail: 'Reduce 50% el riesgo de recaída invasiva o muerte frente a continuar trastuzumab solo',
            regimen: 'mama-tdm1',
            level: 'A',
            refs: [{ name: 'KATHERINE', pmid: '30516102' }],
            cov: { t: 'FNR', ind: 'm-adj-tdm1' }
          }
        ],
        next: [
          { label: 'RH positivo: agregar hormonoterapia adyuvante', next: 'rh-temprano-menop' },
          { label: 'RH negativo: finalizado tratamiento', next: 'seguimiento' }
        ]
      },

      'her2-av-1l': {
        type: 'rec',
        title: 'HER2+ avanzado, 1ª línea',
        phase: 'avanzada · 1ª línea',
        items: [
          {
            label: 'Docetaxel + trastuzumab + pertuzumab',
            detail: 'Sobrevida global mediana de 56 meses en el brazo con pertuzumab',
            regimen: 'mama-docetaxel-tp-av',
            level: 'A',
            refs: [{ name: 'CLEOPATRA', pmid: '22149875' }, { name: 'CLEOPATRA, SG final (Swain et al.)', pmid: '25693012' }],
            cov: { t: 'FNR', ind: 'm-av-tp' }
          }
        ],
        next: [{ label: 'Progresión', next: 'her2-av-2l' }]
      },

      'her2-av-2l': {
        type: 'rec',
        title: 'HER2+ avanzado, 2ª línea',
        phase: 'avanzada · 2ª línea',
        items: [
          {
            label: 'Trastuzumab emtansina (T-DM1)',
            regimen: 'mama-tdm1',
            level: 'A',
            refs: [{ name: 'EMILIA', pmid: '23020162' }],
            cov: { t: 'FNR', ind: 'm-av-tdm1' }
          },
          {
            label: 'Trastuzumab deruxtecan (alternativa con mayor eficacia que T-DM1)',
            detail: 'Superior a T-DM1 en SLP y SG; sin cobertura confirmada en Uruguay',
            level: 'A',
            refs: [{ name: 'DESTINY-Breast03', pmid: '35320644' }],
            cov: { t: 'NC' }
          }
        ],
        next: [{ label: 'Progresión ulterior', next: 'her2-av-3l' }]
      },

      'her2-av-3l': {
        type: 'rec',
        title: 'HER2+ avanzado, líneas posteriores',
        phase: 'avanzada · líneas posteriores',
        items: [
          {
            label: 'Lapatinib + capecitabina',
            regimen: 'mama-lapatinib-capecitabina',
            level: 'B',
            refs: [{ name: 'Geyer et al.', pmid: '17192538' }],
            cov: { t: 'FNR', ind: 'm-lap' }
          },
          {
            label: 'Tucatinib + trastuzumab + capecitabina (incluye actividad en metástasis SNC)',
            detail: 'Sin cobertura confirmada en Uruguay',
            level: 'A',
            refs: [{ name: 'HER2CLIMB', pmid: '31825569' }],
            cov: { t: 'NC' }
          }
        ]
      },

      /* ================= Triple negativo ================= */
      'tn-esc': {
        type: 'q',
        text: '¿Escenario clínico dentro de triple negativo?',
        options: [
          { label: 'Estadio I–IIA, tumor pequeño ganglios negativos', next: 'tn-temprano', stages: ['IA', 'IB', 'IIA'] },
          { label: 'Estadio IIB–IIIA o localmente avanzado/inflamatorio (candidata a neoadyuvancia)', next: 'tn-neo', stages: ['IIB', 'IIIA', 'IIIB', 'IIIC'] },
          { label: 'Enfermedad metastásica', next: 'tn-av-brca', stages: ['IV'] }
        ]
      },

      'tn-temprano': {
        type: 'rec',
        title: 'Triple negativo, estadio temprano: cirugía primaria y adyuvancia',
        phase: 'adyuvancia',
        items: [
          {
            label: 'Quimioterapia adyuvante con antraciclina y taxano (AC seguido de paclitaxel)',
            detail: 'En tumores ≥T1c o con factores de riesgo; considerar neoadyuvancia si ≥T2 o N+',
            regimen: 'mama-ac',
            level: 'A',
            refs: [{ name: 'Pautas de Oncología Médica HC/UdelaR 2023', url: 'https://oncologiamedica.hc.edu.uy/wp-content/uploads/2024/09/R-PAUTAS-DE-ONCOLOGIA-MEDICA-2023-final.pdf' }],
            cov: { t: 'FTM' }
          }
        ],
        next: [
          { label: 'Considerar abordaje neoadyuvante en su lugar', next: 'tn-neo' },
          { label: 'Finalizado tratamiento', next: 'seguimiento' }
        ]
      },

      'tn-neo': {
        type: 'rec',
        title: 'Triple negativo, neoadyuvancia',
        phase: 'neoadyuvancia',
        items: [
          {
            label: 'Docetaxel + carboplatino, o antraciclina-ciclofosfamida seguida de taxano + carboplatino',
            detail: 'La adición de platino aumenta la tasa de respuesta patológica completa',
            regimen: 'mama-docetaxel-carbo',
            level: 'A',
            refs: [{ name: 'Pautas de Oncología Médica HC/UdelaR 2023', url: 'https://oncologiamedica.hc.edu.uy/wp-content/uploads/2024/09/R-PAUTAS-DE-ONCOLOGIA-MEDICA-2023-final.pdf' }],
            cov: { t: 'FTM' }
          },
          {
            label: 'Pembrolizumab neoadyuvante y adyuvante asociado a quimioterapia',
            detail: 'Mejora respuesta patológica completa y sobrevida libre de eventos; sin cobertura confirmada en Uruguay para este uso',
            level: 'A',
            refs: [{ name: 'KEYNOTE-522', pmid: '35139274' }],
            cov: { t: 'NC' }
          }
        ],
        next: [{ label: 'Cirugía realizada, evaluar respuesta patológica', next: 'tn-rpc' }]
      },

      'tn-rpc': {
        type: 'q',
        text: '¿Respuesta patológica completa (ypT0/is ypN0) tras neoadyuvancia?',
        options: [
          { label: 'Sí, respuesta patológica completa', next: 'tn-adj-rpc-si' },
          { label: 'No, enfermedad residual invasiva', next: 'tn-adj-residual' }
        ]
      },

      'tn-adj-rpc-si': {
        type: 'rec',
        title: 'Triple negativo, adyuvancia tras respuesta patológica completa',
        phase: 'adyuvancia',
        items: [
          {
            label: 'Sin quimioterapia adicional; continuar seguimiento estrecho',
            detail: 'Si recibió pembrolizumab neoadyuvante, completar ciclos adyuvantes del mismo esquema (no evaluado aquí por cobertura)',
            level: 'B',
            refs: [{ name: 'Pautas de Oncología Médica HC/UdelaR 2025, cáncer de mama localizado', url: 'https://oncologiamedica.hc.edu.uy/publicaciones/pautas-de-oncologia-medica-para-el-diagnostico-tratamiento-sistemico-y-seguimiento/' }],
            cov: { t: 'NA' }
          }
        ],
        next: [{ label: 'Finalizado tratamiento', next: 'seguimiento' }]
      },

      'tn-adj-residual': {
        type: 'rec',
        title: 'Triple negativo, adyuvancia con enfermedad residual invasiva',
        phase: 'adyuvancia',
        items: [
          {
            label: 'Capecitabina adyuvante × 6–8 ciclos',
            detail: 'Mejora sobrevida libre de enfermedad y sobrevida global en enfermedad residual tras neoadyuvancia',
            regimen: 'mama-capecitabina',
            level: 'A',
            refs: [{ name: 'CREATE-X', pmid: '28564564' }],
            cov: { t: 'FTM' }
          }
        ],
        next: [{ label: 'Finalizado tratamiento', next: 'seguimiento' }]
      },

      'tn-av-brca': {
        type: 'q',
        text: '¿Mutación germinal BRCA1/2 conocida?',
        options: [
          { label: 'Sí, BRCA1/2 mutado', next: 'tn-av-brca-si' },
          { label: 'No, o desconocido', next: 'tn-av-pdl1' }
        ]
      },

      'tn-av-brca-si': {
        type: 'rec',
        title: 'Triple negativo avanzado, BRCA1/2 mutado',
        phase: 'avanzada · 1ª línea',
        items: [
          {
            label: 'Olaparib en monoterapia',
            detail: 'Alternativa a quimioterapia en BRCA1/2 mutado: mejor SLP (OlympiAD), sin diferencia significativa en SG en el análisis final. Sin cobertura confirmada en Uruguay para enfermedad avanzada',
            level: 'B',
            refs: [{ name: 'OlympiAD', pmid: '28578601' }, { name: 'OlympiAD, SG final (Robson et al.)', pmid: '30689707' }],
            cov: { t: 'NC' }
          },
          {
            label: 'Quimioterapia con platino como alternativa (carboplatino)',
            detail: 'En TNT el carboplatino no superó al docetaxel en la población global; el beneficio se vio en el subgrupo con BRCA mutado',
            regimen: 'mama-docetaxel-carbo',
            level: 'C',
            refs: [{ name: 'TNT trial', pmid: '29713086' }],
            cov: { t: 'FTM' }
          }
        ],
        next: [{ label: 'Progresión, evaluar PD-L1', next: 'tn-av-pdl1' }]
      },

      'tn-av-pdl1': {
        type: 'q',
        text: '¿PD-L1 positivo (CPS ≥ 10, ensayo validado)?',
        options: [
          { label: 'Sí, PD-L1 CPS ≥ 10', next: 'tn-av-1l-pos' },
          { label: 'No, PD-L1 CPS < 10 o desconocido', next: 'tn-av-1l-neg' }
        ]
      },

      'tn-av-1l-pos': {
        type: 'rec',
        title: 'Triple negativo avanzado, PD-L1 positivo, 1ª línea',
        phase: 'avanzada · 1ª línea',
        items: [
          {
            label: 'Pembrolizumab + quimioterapia (nab-paclitaxel/paclitaxel/gemcitabina-carboplatino)',
            detail: 'Beneficio en sobrevida global en el subgrupo PD-L1 CPS ≥ 10',
            regimen: 'mama-pembrolizumab-quimio',
            level: 'A',
            refs: [{ name: 'KEYNOTE-355', pmid: '33278935' }, { name: 'KEYNOTE-355, SG (Cortés et al.)', pmid: '35857659' }],
            cov: { t: 'FNR', ind: 'm-pembro' }
          }
        ],
        next: [{ label: 'Progresión', next: 'tn-av-2l' }]
      },

      'tn-av-1l-neg': {
        type: 'rec',
        title: 'Triple negativo avanzado, PD-L1 negativo, 1ª línea',
        phase: 'avanzada · 1ª línea',
        items: [
          {
            label: 'Quimioterapia en monoterapia (paclitaxel u otro taxano)',
            regimen: 'mama-paclitaxel-av',
            level: 'B',
            refs: [{ name: 'Pautas de Oncología Médica HC/UdelaR 2025, cáncer de mama metastásico', url: 'https://oncologiamedica.hc.edu.uy/publicaciones/pautas-de-oncologia-medica-para-el-diagnostico-tratamiento-sistemico-y-seguimiento/' }],
            cov: { t: 'FTM' }
          }
        ],
        next: [{ label: 'Progresión', next: 'tn-av-2l' }]
      },

      'tn-av-2l': {
        type: 'rec',
        title: 'Triple negativo avanzado, líneas posteriores',
        phase: 'avanzada · líneas posteriores',
        items: [
          {
            label: 'Sacituzumab govitecan',
            detail: 'Mejora SLP y SG frente a quimioterapia de elección del médico, tras ≥2 líneas previas',
            regimen: 'mama-sacituzumab',
            level: 'A',
            refs: [{ name: 'ASCENT', pmid: '33882206' }],
            cov: { t: 'NC' }
          },
          {
            label: 'Eribulina en monoterapia',
            detail: 'EMBRACE frente a tratamiento de elección del médico: mejor SG (HR 0,81), en pacientes con ≥2 líneas previas',
            regimen: 'mama-eribulina',
            level: 'A',
            refs: [{ name: 'EMBRACE', pmid: '21376385' }],
            cov: { t: 'FTM' }
          },
          {
            label: 'Capecitabina en monoterapia',
            detail: 'Activa tras taxanos; sin ensayo aleatorizado propio en esta línea',
            regimen: 'mama-capecitabina',
            level: 'C',
            refs: [{ name: 'Pautas de Oncología Médica HC/UdelaR 2025, cáncer de mama metastásico', url: 'https://oncologiamedica.hc.edu.uy/publicaciones/pautas-de-oncologia-medica-para-el-diagnostico-tratamiento-sistemico-y-seguimiento/' }],
            cov: { t: 'FTM' }
          }
        ]
      },

      /* ---------------- SEGUIMIENTO ---------------- */
      'seguimiento': {
        type: 'rec',
        title: 'Seguimiento post-tratamiento',
        phase: 'seguimiento',
        items: [
          {
            label: 'Examen clínico cada 3–6 meses los primeros 3 años, luego anual',
            level: 'B',
            refs: [{ name: 'Pautas de Oncología Médica HC/UdelaR 2023', url: 'https://oncologiamedica.hc.edu.uy/wp-content/uploads/2024/09/R-PAUTAS-DE-ONCOLOGIA-MEDICA-2023-final.pdf' }],
            cov: { t: 'NA' }
          },
          {
            label: 'Mamografía anual (bilateral o de la mama remanente)',
            level: 'A',
            refs: [{ name: 'Pautas de Oncología Médica HC/UdelaR 2023', url: 'https://oncologiamedica.hc.edu.uy/wp-content/uploads/2024/09/R-PAUTAS-DE-ONCOLOGIA-MEDICA-2023-final.pdf' }],
            cov: { t: 'NA' }
          },
          {
            label: 'No solicitar de rutina marcadores tumorales ni imágenes de estadificación asintomáticas',
            detail: 'Sin beneficio demostrado en sobrevida en pacientes asintomáticas',
            level: 'B',
            refs: [{ name: 'Pautas de Oncología Médica HC/UdelaR 2025, cáncer de mama localizado', url: 'https://oncologiamedica.hc.edu.uy/publicaciones/pautas-de-oncologia-medica-para-el-diagnostico-tratamiento-sistemico-y-seguimiento/' }],
            cov: { t: 'NA' }
          }
        ]
      }
    },
    notes: [
      'Este borrador simplifica la clasificación de riesgo (uso de firmas genómicas) por no disponibilidad universal en Uruguay.',
      'Toda indicación de cobertura FNR debe verificarse contra la normativa vigente al momento de la solicitud (content/fnr.js).'
    ]
  };
})(window.FNRO = window.FNRO || {});
