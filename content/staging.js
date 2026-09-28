/* ============================================================
   TNM_DATA — Dataset de estadificación TNM para PWA de oncología clínica
   Idioma: español (Uruguay). JS plano ES2017, sin dependencias.

   Ediciones utilizadas (verificadas por búsqueda web, sept-2026):
   - Pulmón (CPNM): TNM 9ª ed. IASLC/UICC/AJCC — vigente desde el 1/1/2025.
   - Cuello uterino: FIGO 2018 (estadificación clínico-quirúrgica-imagenológica),
     con nota de correspondencia aproximada con AJCC 9ª ed.
   - Mama: AJCC 8ª ed., agrupación ANATÓMICA (T,N,M). NO incluye estadio
     pronóstico (requiere grado, RE/RP/HER2 y a veces Oncotype DX).
   - Colon y recto: AJCC 8ª ed.
   - Próstata: AJCC 8ª ed., con PSA y Grupo de Grado ISUP.

   IMPORTANTE: las descripciones de cada categoría están redactadas con
   palabras propias y de forma abreviada; no son transcripción literal de
   los manuales AJCC/UICC/FIGO (protegidos por derechos de autor). Ante
   dudas o casos límite, remitirse siempre al manual oficial vigente.
   ============================================================ */

(function () {
  'use strict';

  // ---------- Utilidades comunes ----------
  function has(sel, key) { return sel && sel[key] !== undefined && sel[key] !== null && sel[key] !== ''; }

  // ============================================================
  // 1) MAMA — AJCC 8ª ed., estadio ANATÓMICO (T,N,M)
  // Fuente: AJCC Cancer Staging Manual 8th ed. (Giuliano et al., CA Cancer J
  // Clin 2017;67:290-303 — "Breast Cancer—Major changes in AJCC 8th ed.")
  // ============================================================
  var mama = {
    id: 'mama',
    name: 'Mama',
    edition: 'AJCC 8ª ed. (estadio anatómico)',
    source: 'AJCC Cancer Staging Manual 8ª ed.; Giuliano et al. CA Cancer J Clin 2017;67:290-303',
    axes: [
      {
        key: 'T',
        label: 'Tumor primario (T)',
        options: [
          { v: 'T0', d: 'Sin evidencia de tumor primario (p. ej., sólo ganglio axilar)' },
          { v: 'Tis', d: 'Carcinoma in situ (ductal, o enfermedad de Paget sin tumor)' },
          { v: 'T1mi', d: 'Microinvasión ≤ 1 mm' },
          { v: 'T1a', d: 'Tumor > 1 mm y ≤ 5 mm' },
          { v: 'T1b', d: 'Tumor > 5 mm y ≤ 10 mm' },
          { v: 'T1c', d: 'Tumor > 10 mm y ≤ 20 mm' },
          { v: 'T2', d: 'Tumor > 20 mm y ≤ 50 mm' },
          { v: 'T3', d: 'Tumor > 50 mm' },
          { v: 'T4a', d: 'Invade pared torácica (no solo adherencia a pectoral)' },
          { v: 'T4b', d: 'Ulceración cutánea, nódulos satélites o edema/piel de naranja' },
          { v: 'T4c', d: 'Combinación de T4a + T4b' },
          { v: 'T4d', d: 'Carcinoma inflamatorio (clínico)' }
        ]
      },
      {
        key: 'N',
        label: 'Ganglios regionales (N) — clínico/patológico',
        options: [
          { v: 'N0', d: 'Sin metástasis ganglionar regional' },
          { v: 'N1mi', d: 'Micrometástasis (> 0,2 mm y ≤ 2 mm)' },
          { v: 'N1', d: 'Metástasis en 1 a 3 ganglios axilares móviles (o mamaria interna centinela)' },
          { v: 'N2', d: 'Metástasis en 4 a 9 ganglios axilares, o axilares fijos/apelmazados' },
          { v: 'N3', d: 'Metástasis en ≥ 10 axilares, infraclaviculares, mamaria interna clínica + axila, o supraclaviculares' }
        ]
      },
      {
        key: 'M',
        label: 'Metástasis a distancia (M)',
        options: [
          { v: 'M0', d: 'Sin metástasis a distancia' },
          { v: 'M1', d: 'Metástasis a distancia demostrada' }
        ]
      }
    ],
    stage: function (sel) {
      var T = sel.T, N = sel.N, M = sel.M;
      if (!has(sel, 'T') || !has(sel, 'N') || !has(sel, 'M')) {
        return { stage: null, note: 'Complete T, N y M para calcular el estadio.' };
      }
      if (M === 'M1') return { stage: 'IV', note: 'Cualquier T, cualquier N, con M1.' };

      if (T === 'Tis' && N === 'N0') return { stage: '0' };

      if (N === 'N0' && (T === 'T1mi' || T === 'T1a' || T === 'T1b' || T === 'T1c')) {
        return { stage: 'IA' };
      }
      if (N === 'N1mi' && (T === 'T0' || T === 'T1mi' || T === 'T1a' || T === 'T1b' || T === 'T1c')) {
        return { stage: 'IB' };
      }
      // IIA: T0-T1,N1  o  T2,N0
      var isT0T1 = (T === 'T0' || T === 'T1mi' || T === 'T1a' || T === 'T1b' || T === 'T1c');
      if (N === 'N1' && isT0T1) return { stage: 'IIA' };
      if (T === 'T2' && N === 'N0') return { stage: 'IIA' };

      // IIB: T2,N1  o  T3,N0
      if (T === 'T2' && N === 'N1') return { stage: 'IIB' };
      if (T === 'T3' && N === 'N0') return { stage: 'IIB' };

      // IIIA: T0-T2,N2  o  T3,N1-N2
      var isT0T2 = isT0T1 || T === 'T2';
      if (N === 'N2' && isT0T2) return { stage: 'IIIA' };
      if (T === 'T3' && (N === 'N1' || N === 'N2')) return { stage: 'IIIA' };

      // IIIB: T4, N0-N2
      var isT4 = (T === 'T4a' || T === 'T4b' || T === 'T4c' || T === 'T4d');
      if (isT4 && (N === 'N0' || N === 'N1' || N === 'N2')) return { stage: 'IIIB' };

      // IIIC: cualquier T, N3
      if (N === 'N3') return { stage: 'IIIC', note: 'Cualquier T con N3.' };

      return { stage: null, note: 'Combinación no reconocida; revisar valores de T/N/M.' };
    },
    notes: [
      'Este es el estadio ANATÓMICO puro (T,N,M). El estadio PRONÓSTICO de AJCC 8ª (el que suele usarse en la práctica en EE.UU.) exige además grado histológico, RE, RP, HER2 y a veces el score de Oncotype DX; no está implementado aquí por no contar con la tabla completa verificada.',
      'En Tx o Nx no se puede asignar estadio: reevaluar estudios.',
      'Ante discordancia clínico-patológica, prevalece la estadificación patológica (pN) cuando hay cirugía.'
    ]
  };

  // ============================================================
  // 2) COLON Y RECTO — AJCC 8ª ed.
  // Fuente: AJCC Cancer Staging Manual 8th ed., cap. Colon y Recto (2017)
  // ============================================================
  var ccr = {
    id: 'ccr',
    name: 'Colon y recto',
    edition: 'AJCC 8ª ed.',
    source: 'AJCC Cancer Staging Manual 8ª ed., capítulo de colon y recto',
    axes: [
      {
        key: 'T',
        label: 'Tumor primario (T)',
        options: [
          { v: 'Tis', d: 'Carcinoma in situ / intramucoso' },
          { v: 'T1', d: 'Invade la submucosa' },
          { v: 'T2', d: 'Invade la muscular propia' },
          { v: 'T3', d: 'Invade tejidos pericolorrectales, a través de la muscular propia' },
          { v: 'T4a', d: 'Perfora el peritoneo visceral' },
          { v: 'T4b', d: 'Invade directamente otros órganos o estructuras' }
        ]
      },
      {
        key: 'N',
        label: 'Ganglios regionales (N)',
        options: [
          { v: 'N0', d: 'Sin metástasis ganglionar regional' },
          { v: 'N1a', d: 'Metástasis en 1 ganglio regional' },
          { v: 'N1b', d: 'Metástasis en 2-3 ganglios regionales' },
          { v: 'N1c', d: 'Depósito(s) tumoral(es) en subserosa/mesenterio sin ganglios positivos' },
          { v: 'N2a', d: 'Metástasis en 4-6 ganglios regionales' },
          { v: 'N2b', d: 'Metástasis en 7 o más ganglios regionales' }
        ]
      },
      {
        key: 'M',
        label: 'Metástasis a distancia (M)',
        options: [
          { v: 'M0', d: 'Sin metástasis a distancia' },
          { v: 'M1a', d: 'Metástasis confinada a un órgano (p.ej. hígado) sin carcinomatosis peritoneal' },
          { v: 'M1b', d: 'Metástasis en más de un órgano' },
          { v: 'M1c', d: 'Metástasis al peritoneo (carcinomatosis), con o sin otras localizaciones' }
        ]
      }
    ],
    stage: function (sel) {
      var T = sel.T, N = sel.N, M = sel.M;
      if (!has(sel, 'T') || !has(sel, 'N') || !has(sel, 'M')) {
        return { stage: null, note: 'Complete T, N y M para calcular el estadio.' };
      }
      if (M === 'M1a') return { stage: 'IVA' };
      if (M === 'M1b') return { stage: 'IVB' };
      if (M === 'M1c') return { stage: 'IVC' };

      if (T === 'Tis' && N === 'N0') return { stage: '0' };
      if ((T === 'T1' || T === 'T2') && N === 'N0') return { stage: 'I' };
      if (T === 'T3' && N === 'N0') return { stage: 'IIA' };
      if (T === 'T4a' && N === 'N0') return { stage: 'IIB' };
      if (T === 'T4b' && N === 'N0') return { stage: 'IIC' };

      var N1group = (N === 'N1a' || N === 'N1b' || N === 'N1c');
      // IIIA
      if ((T === 'T1' || T === 'T2') && N1group) return { stage: 'IIIA' };
      if (T === 'T1' && N === 'N2a') return { stage: 'IIIA' };
      // IIIB
      if ((T === 'T3' || T === 'T4a') && N1group) return { stage: 'IIIB' };
      if ((T === 'T2' || T === 'T3') && N === 'N2a') return { stage: 'IIIB' };
      if ((T === 'T1' || T === 'T2') && N === 'N2b') return { stage: 'IIIB' };
      // IIIC
      if (T === 'T4a' && N === 'N2a') return { stage: 'IIIC' };
      if ((T === 'T3' || T === 'T4a') && N === 'N2b') return { stage: 'IIIC' };
      if (T === 'T4b' && (N === 'N1a' || N === 'N1b' || N === 'N1c' || N === 'N2a' || N === 'N2b')) return { stage: 'IIIC' };

      return { stage: null, note: 'Combinación no reconocida; revisar valores de T/N/M.' };
    },
    notes: [
      'N1c se usa cuando hay depósito(s) tumoral(es) en la subserosa o mesenterio SIN ganglios linfáticos regionales metastásicos.',
      'Tx o Nx impiden asignar estadio: falta información histopatológica.',
      'La misma tabla se aplica a colon y a recto en AJCC 8ª ed.'
    ]
  };

  // ============================================================
  // 3) PRÓSTATA — AJCC 8ª ed. (T,N,M,PSA,Grupo de Grado ISUP)
  // Fuente: AJCC Cancer Staging Manual 8th ed., cap. Próstata (2017)
  // ============================================================
  var pros = {
    id: 'pros',
    name: 'Próstata',
    edition: 'AJCC 8ª ed.',
    source: 'AJCC Cancer Staging Manual 8ª ed., capítulo de próstata',
    axes: [
      {
        key: 'T',
        label: 'Tumor primario (T) — clínico',
        options: [
          { v: 'T1a', d: 'Hallazgo incidental en < 5% del tejido resecado (RTU)' },
          { v: 'T1b', d: 'Hallazgo incidental en ≥ 5% del tejido resecado' },
          { v: 'T1c', d: 'Detectado por biopsia (p.ej. por PSA elevado), no palpable' },
          { v: 'T2a', d: 'Palpable, compromete ≤ la mitad de un lóbulo' },
          { v: 'T2b', d: 'Palpable, compromete más de la mitad de un lóbulo' },
          { v: 'T2c', d: 'Palpable, compromete ambos lóbulos' },
          { v: 'T3a', d: 'Extensión extraprostática (uni o bilateral)' },
          { v: 'T3b', d: 'Invade la(s) vesícula(s) seminal(es)' },
          { v: 'T4', d: 'Invade estructuras adyacentes fijas (recto, vejiga, esfínter, elevador, pared pélvica)' }
        ]
      },
      {
        key: 'N',
        label: 'Ganglios regionales (N)',
        options: [
          { v: 'N0', d: 'Sin metástasis ganglionar regional' },
          { v: 'N1', d: 'Metástasis en ganglio(s) regional(es) (pélvicos)' }
        ]
      },
      {
        key: 'M',
        label: 'Metástasis a distancia (M)',
        options: [
          { v: 'M0', d: 'Sin metástasis a distancia' },
          { v: 'M1a', d: 'Metástasis en ganglios no regionales' },
          { v: 'M1b', d: 'Metástasis ósea(s)' },
          { v: 'M1c', d: 'Metástasis en otro(s) sitio(s), con o sin compromiso óseo' }
        ]
      },
      {
        key: 'PSA',
        label: 'PSA (ng/mL)',
        options: [
          { v: 'lt10', d: 'PSA < 10 ng/mL' },
          { v: '10a20', d: 'PSA ≥ 10 y < 20 ng/mL' },
          { v: 'ge20', d: 'PSA ≥ 20 ng/mL' }
        ]
      },
      {
        key: 'GG',
        label: 'Grupo de Grado ISUP',
        options: [
          { v: 'GG1', d: 'Gleason ≤ 6 (bien diferenciado)' },
          { v: 'GG2', d: 'Gleason 3+4=7 (patrón predominante 3)' },
          { v: 'GG3', d: 'Gleason 4+3=7 (patrón predominante 4)' },
          { v: 'GG4', d: 'Gleason 8 (4+4, 3+5 o 5+3)' },
          { v: 'GG5', d: 'Gleason 9-10' }
        ]
      }
    ],
    stage: function (sel) {
      var T = sel.T, N = sel.N, M = sel.M, PSA = sel.PSA, GG = sel.GG;
      if (!has(sel, 'T') || !has(sel, 'N') || !has(sel, 'M')) {
        return { stage: null, note: 'Complete T, N y M para calcular el estadio.' };
      }
      if (M === 'M1a' || M === 'M1b' || M === 'M1c') {
        return { stage: 'IVB', note: 'Cualquier T, cualquier N, con M1 (independiente de PSA y grado).' };
      }
      if (N === 'N1') {
        return { stage: 'IVA', note: 'Cualquier T con N1, M0 (independiente de PSA y grado).' };
      }
      // A partir de aquí N0, M0. Se necesita PSA y GG.
      if (!has(sel, 'PSA') || !has(sel, 'GG')) {
        return { stage: null, note: 'Para N0/M0 se requiere además PSA y Grupo de Grado ISUP.' };
      }

      var isT1T2a = (T === 'T1a' || T === 'T1b' || T === 'T1c' || T === 'T2a');
      var isT1T2 = isT1T2a || T === 'T2b' || T === 'T2c';
      var isT3T4 = (T === 'T3a' || T === 'T3b' || T === 'T4');

      if (GG === 'GG5') return { stage: 'IIIC', note: 'Cualquier T (organo-confinado o T3/T4), N0M0, Grupo de Grado 5, cualquier PSA.' };

      if (isT3T4 && (GG === 'GG1' || GG === 'GG2' || GG === 'GG3' || GG === 'GG4')) {
        return { stage: 'IIIB', note: 'T3-T4, N0M0, Grupo de Grado 1-4, cualquier PSA.' };
      }

      if (isT1T2 && PSA === 'ge20' && (GG === 'GG1' || GG === 'GG2' || GG === 'GG3' || GG === 'GG4')) {
        return { stage: 'IIIA', note: 'T1-T2, N0M0, PSA ≥20, Grupo de Grado 1-4.' };
      }

      if (isT1T2 && (PSA === 'lt10' || PSA === '10a20') && (GG === 'GG3' || GG === 'GG4')) {
        return { stage: 'IIC', note: 'T1-T2, N0M0, PSA <20, Grupo de Grado 3 o 4.' };
      }
      if (isT1T2 && (PSA === 'lt10' || PSA === '10a20') && GG === 'GG2') {
        return { stage: 'IIB', note: 'T1-T2, N0M0, PSA <20, Grupo de Grado 2.' };
      }
      if (GG === 'GG1' && (PSA === 'lt10' || PSA === '10a20')) {
        if (T === 'T2b' || T === 'T2c') return { stage: 'IIA', note: 'T2b-T2c, N0M0, PSA <20, Grupo de Grado 1.' };
        if (isT1T2a) {
          if (PSA === 'lt10') return { stage: 'I' };
          if (PSA === '10a20') return { stage: 'IIA', note: 'T1-T2a, N0M0, PSA 10-20, Grupo de Grado 1.' };
        }
      }

      return { stage: null, note: 'Combinación no reconocida; revisar T/N/M/PSA/Grupo de Grado.' };
    },
    notes: [
      'El estadio clínico (cTNM) puede diferir del patológico (pTNM) tras prostatectomía radical.',
      'Ante PSA no disponible o Gleason no informado, no se puede asignar estadio AJCC completo.',
      'M1a/b/c no modifican el estadio final: cualquier M1 es Estadio IVB.'
    ]
  };

  // ============================================================
  // 4) PULMÓN (CPNM / NSCLC) — TNM 9ª ed. IASLC/UICC/AJCC (vigente 2025-)
  // Fuente: IASLC Staging Project propuestas 9ª ed. (J Thorac Oncol 2024-2025);
  // Radiology Assistant, resumen 9ª ed.
  // ============================================================
  var pulm = {
    id: 'pulm',
    name: 'Pulmón',
    // Primero el tipo histológico: define la vía de tratamiento. El TNM se elige después y se aplica a ambos.
    pre: {
      key: 'HIST',
      label: 'Tipo histológico',
      options: [
        { v: 'CPNCP', d: 'Cáncer de pulmón de células no pequeñas (no microcítico)' },
        { v: 'CPCP', d: 'Cáncer de pulmón de células pequeñas (microcítico)' }
      ]
    },
    edition: 'TNM 9ª ed. IASLC/UICC/AJCC (vigente desde 2025)',
    source: 'IASLC Staging Project, propuestas de 9ª ed. (J Thorac Oncol 2024-2025)',
    axes: [
      {
        key: 'T',
        label: 'Tumor primario (T)',
        options: [
          { v: 'Tis', d: 'Carcinoma in situ' },
          { v: 'T1mi', d: 'Adenocarcinoma mínimamente invasivo' },
          { v: 'T1a', d: 'Tumor ≤ 1 cm' },
          { v: 'T1b', d: 'Tumor > 1 cm y ≤ 2 cm' },
          { v: 'T1c', d: 'Tumor > 2 cm y ≤ 3 cm' },
          { v: 'T2a', d: 'Tumor > 3-4 cm, o invade pleura visceral/bronquio principal' },
          { v: 'T2b', d: 'Tumor > 4 cm y ≤ 5 cm' },
          { v: 'T3', d: 'Tumor > 5-7 cm, o invade pared torácica/pericardio/nervio frénico, o nódulo(s) adicional(es) en el mismo lóbulo' },
          { v: 'T4', d: 'Tumor > 7 cm, o invade mediastino/diafragma/corazón/grandes vasos/tráquea/esófago/carina/vértebra, o nódulo en otro lóbulo ipsilateral' }
        ]
      },
      {
        key: 'N',
        label: 'Ganglios regionales (N)',
        options: [
          { v: 'N0', d: 'Sin metástasis ganglionar regional' },
          { v: 'N1', d: 'Ganglios peribronquiales/hiliares ipsilaterales' },
          { v: 'N2a', d: 'Una sola estación mediastínica o subcarinal ipsilateral (9ª ed.)' },
          { v: 'N2b', d: 'Múltiples estaciones mediastínicas ipsilaterales (9ª ed.)' },
          { v: 'N3', d: 'Ganglios mediastínicos/hiliares contralaterales, o escaleno/supraclavicular' }
        ]
      },
      {
        key: 'M',
        label: 'Metástasis a distancia (M)',
        options: [
          { v: 'M0', d: 'Sin metástasis a distancia' },
          { v: 'M1a', d: 'Nódulo(s) en lóbulo contralateral, o derrame/nódulos pleurales o pericárdicos malignos' },
          { v: 'M1b', d: 'Única metástasis extratorácica en un solo órgano' },
          { v: 'M1c1', d: 'Múltiples metástasis extratorácicas en un solo órgano (9ª ed.)' },
          { v: 'M1c2', d: 'Múltiples metástasis extratorácicas en varios órganos (9ª ed.)' }
        ]
      }
    ],
    stage: function (sel) {
      var T = sel.T, N = sel.N, M = sel.M;
      if (!has(sel, 'T') || !has(sel, 'N') || !has(sel, 'M')) {
        return { stage: null, note: 'Complete T, N y M para calcular el estadio.' };
      }
      if (M === 'M1a' || M === 'M1b') return { stage: 'IVA' };
      if (M === 'M1c1' || M === 'M1c2') return { stage: 'IVB', note: 'M1c1 y M1c2 comparten el estadio IVB en la 9ª ed.' };

      if (T === 'Tis' && N === 'N0') return { stage: '0' };

      var isT1 = (T === 'T1mi' || T === 'T1a' || T === 'T1b' || T === 'T1c');
      var isT2 = (T === 'T2a' || T === 'T2b');

      if (N === 'N0') {
        if (T === 'T1mi' || T === 'T1a') return { stage: 'IA1' };
        if (T === 'T1b') return { stage: 'IA2' };
        if (T === 'T1c') return { stage: 'IA3' };
        if (T === 'T2a') return { stage: 'IB' };
        if (T === 'T2b') return { stage: 'IIA' };
        if (T === 'T3') return { stage: 'IIB' };
        if (T === 'T4') return { stage: 'IIIA' };
      }
      if (N === 'N1') {
        if (isT1) return { stage: 'IIA', note: 'En la 9ª ed. T1 N1 pasa de IIB a IIA.' };
        if (isT2) return { stage: 'IIB' };
        if (T === 'T3') return { stage: 'IIIA' };
        if (T === 'T4') return { stage: 'IIIA' };
      }
      if (N === 'N2a') {
        if (isT1) return { stage: 'IIB' };
        if (isT2) return { stage: 'IIIA' };
        if (T === 'T3') return { stage: 'IIIA' };
        if (T === 'T4') return { stage: 'IIIB' };
      }
      if (N === 'N2b') {
        if (isT1) return { stage: 'IIIA' };
        if (isT2) return { stage: 'IIIB' };
        if (T === 'T3') return { stage: 'IIIB' };
        if (T === 'T4') return { stage: 'IIIB' };
      }
      if (N === 'N3') {
        if (isT1 || isT2) return { stage: 'IIIB' };
        if (T === 'T3' || T === 'T4') return { stage: 'IIIC' };
      }

      return { stage: null, note: 'Combinación no reconocida; revisar valores de T/N/M.' };
    },
    notes: [
      'Novedad de la 9ª ed. (vigente desde 2025): N2 se divide en N2a (1 estación) y N2b (múltiples estaciones); M1c se divide en M1c1 y M1c2 (ambas en estadio IVB).',
      'Esta división de N2 y M1c reordena varias combinaciones de estadio II y III respecto de la 8ª ed.; use siempre la tabla 9ª ed. para casos nuevos desde 2025.',
      'El TNM se aplica a los dos tipos histológicos. En células pequeñas se usa además la clasificación en enfermedad limitada o extendida, que orienta el tratamiento.'
    ]
  };
  // El estadio exige el tipo histológico; en células pequeñas se agrega limitada/extendida (orientativa).
  var pulmTnm = pulm.stage;
  pulm.stage = function (sel) {
    if (!sel.HIST) return { stage: null, note: 'Elegí primero el tipo histológico' };
    var r = pulmTnm(sel);
    if (sel.HIST === 'CPCP' && r.stage) {
      var ext = /^M1/.test(sel.M || '');
      r.note = (r.note ? r.note + ' ' : '') + (ext
        ? 'Células pequeñas: enfermedad extendida.'
        : 'Células pequeñas: enfermedad limitada si toda la enfermedad puede incluirse en un campo de radioterapia; si no, extendida.');
    }
    return r;
  };

  // ============================================================
  // 5) CUELLO UTERINO — FIGO 2018
  // Fuente: Bhatla et al., Int J Gynecol Obstet 2018;143(S2):22-36
  // (revisión FIGO 2018); nota de correspondencia con AJCC 9ª ed.
  // ============================================================
  var ccu = {
    id: 'ccu',
    name: 'Cuello uterino',
    edition: 'FIGO 2018',
    source: 'Bhatla N, et al. "Cancer of the cervix uteri" (revisión FIGO 2018). Int J Gynecol Obstet 2018;143(S2):22-36',
    axes: [
      {
        key: 'FIGO',
        label: 'Estadio FIGO (extensión local, tamaño, invasión)',
        options: [
          { v: 'IA1', d: 'Invasión estromal < 3 mm de profundidad' },
          { v: 'IA2', d: 'Invasión estromal ≥ 3 mm y < 5 mm' },
          { v: 'IB1', d: 'Invasión ≥ 5 mm, tumor < 2 cm, confinado al cuello' },
          { v: 'IB2', d: 'Tumor ≥ 2 cm y < 4 cm, confinado al cuello' },
          { v: 'IB3', d: 'Tumor ≥ 4 cm, confinado al cuello' },
          { v: 'IIA1', d: 'Invade más allá del útero (2/3 sup. vagina), sin parametrio, tumor < 4 cm' },
          { v: 'IIA2', d: 'Igual que IIA1 pero tumor ≥ 4 cm' },
          { v: 'IIB', d: 'Invade el parametrio, sin llegar a la pared pélvica' },
          { v: 'IIIA', d: 'Invade el tercio inferior de la vagina, sin extensión a pared pélvica' },
          { v: 'IIIB', d: 'Extensión a la pared pélvica, y/o hidronefrosis o riñón excluido' },
          { v: 'IVA', d: 'Invade mucosa de vejiga o recto, o se extiende fuera de la pelvis verdadera' },
          { v: 'IVB', d: 'Metástasis a distancia (p. ej., ganglios inguinales, peritoneo, pulmón, hígado, hueso)' }
        ]
      },
      {
        key: 'N',
        label: 'Compromiso ganglionar (define IIIC, independiente del tamaño/T)',
        options: [
          { v: 'N0', d: 'Sin metástasis ganglionar pélvica ni paraaórtica' },
          { v: 'IIIC1', d: 'Metástasis en ganglios pélvicos solamente' },
          { v: 'IIIC2', d: 'Metástasis en ganglios paraaórticos (con o sin pélvicos)' }
        ]
      }
    ],
    stage: function (sel) {
      var F = sel.FIGO, N = sel.N;
      if (!has(sel, 'FIGO')) {
        return { stage: null, note: 'Seleccione el estadio FIGO según hallazgos locales.' };
      }
      if (F === 'IVB') return { stage: 'IVB', note: 'Metástasis a distancia: estadio IVB independiente de N.' };

      if (has(sel, 'N') && (N === 'IIIC1' || N === 'IIIC2')) {
        // El compromiso ganglionar reclasifica como IIIC, salvo que ya sea IVB
        if (F === 'IVA') return { stage: 'IVA', note: 'La invasión de vejiga/recto o extensión fuera de pelvis prevalece sobre el estado ganglionar (IVA no se reclasifica por N).' };
        return { stage: 'IIIC' + (N === 'IIIC1' ? '1' : '2'), note: 'Reclasificado por compromiso ganglionar: IIIC1 (pélvico) o IIIC2 (paraaórtico), agregando sufijo r (imagen) o p (patología) según el método de confirmación.' };
      }

      // Sin compromiso ganglionar (o no evaluado): usar el estadio FIGO directo
      var directStages = ['IA1', 'IA2', 'IB1', 'IB2', 'IB3', 'IIA1', 'IIA2', 'IIB', 'IIIA', 'IIIB', 'IVA'];
      for (var i = 0; i < directStages.length; i++) {
        if (F === directStages[i]) return { stage: F };
      }
      return { stage: null, note: 'Combinación no reconocida; revisar el estadio FIGO seleccionado.' };
    },
    notes: [
      'Desde 2018, FIGO incorpora imagenología y/o patología para asignar el estadio (ya no es solo examen clínico).',
      'El sufijo "r" indica confirmación por imagen (radiológica) y "p" por patología, aplicable sobre todo en IIIC1/IIIC2 (p.ej. IIIC1r, IIIC1p).',
      'Correspondencia con AJCC 9ª ed.: el TNM de cérvix de AJCC 9ª ed. adopta esencialmente la misma estructura de FIGO 2018 (T equivale al estadio local I-IVA, N1 equivale a IIIC1/IIIC2 según localización, M1 equivale a IVB); ante discrepancias, priorizar la publicación FIGO vigente. [Inferencia razonable: no se accedió al texto completo de AJCC 9ª ed. para cérvix.]',
      'IIIC1 y IIIC2 pueden coexistir con cualquier tamaño tumoral/T; el compromiso ganglionar por sí solo define el estadio IIIC.'
    ]
  };

  window.FNRO = window.FNRO || {};
  window.TNM_DATA = window.FNRO.staging = {
    mama: mama,
    ccr: ccr,
    pros: pros,
    pulm: pulm,
    ccu: ccu
  };
})();
