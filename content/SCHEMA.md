# Esquema de contenido clínico

Todo el contenido clínico vive en `content/` como scripts planos (ES2017, sin módulos ni dependencias) que se registran en el objeto global `window.FNRO`. La app no tiene paso de compilación.

```js
(function (R) {
  R.pathways = R.pathways || {};
  R.pathways.pulm = { /* ... */ };
})(window.FNRO = window.FNRO || {});
```

## Reglas de redacción ("sala limpia")

1. **Prohibido usar documentos NCCN** (guías, algoritmos, notas al pie, tablas). La palabra "NCCN" no puede aparecer en ningún archivo de `content/`.
2. Cada opción terapéutica se respalda con evidencia primaria: ensayo (nombre + PMID o NCT) o aprobación regulatoria.
3. Pautas de Oncología Médica HC/UdelaR, ESMO, normativas FNR y FTM se pueden citar y **resumir con palabras propias**. No se copian frases ni diagramas.
4. Texto en español rioplatense, breve y clínico. Cada etiqueta de opción tiene como máximo unos 120 caracteres.
5. Ante duda sobre cobertura o evidencia, no se inventa: se usa `cov: {t: '?'}` o se agrega una nota con el motivo.
6. Todo archivo nuevo nace con `status: 'borrador'`. Solo un oncólogo humano lo pasa a `'revisado'`.

## Escala de evidencia propia

| Nivel | Criterio |
|---|---|
| `A` | Ensayo fase III aleatorizado (o metaanálisis) con beneficio en sobrevida global, o en sobrevida libre de enfermedad/recaída en el contexto curativo |
| `B` | Fase III con beneficio en un subrogado (SLP, respuesta), o fase II aleatorizado |
| `C` | Fase II de un solo brazo, análisis de subgrupo, extrapolación o consenso de expertos |

## Cobertura en Uruguay (`cov`)

| `t` | Significado | Campos extra |
|---|---|---|
| `FNR` | Financiado por el Fondo Nacional de Recursos | `ind`: id de una indicación existente en `content/fnr.js` (obligatorio) |
| `FTM` | Incluido en el Formulario Terapéutico de Medicamentos: lo cubre el prestador | — |
| `NC` | No cubierto (ni FNR ni FTM) | — |
| `NA` | No farmacológico (cirugía, radioterapia, observación) | — |
| `?` | Cobertura a verificar | — |

## Vía terapéutica: `R.pathways[<tumorId>]`

```js
{
  tumor: 'pulm',                  // id de tumor (mama, ccr, pros, pulm, ccu, …)
  title: 'Cáncer de pulmón no microcítico',
  status: 'borrador',             // 'borrador' | 'revisado'
  updated: '2026-09-28',
  authors: ['Borrador asistido por IA'],
  start: 'inicio',                // id del primer nodo
  nodes: {
    // Nodo pregunta
    'inicio': {
      type: 'q',
      text: '¿Qué escenario?',
      help: 'opcional, una línea',
      options: [
        // stages: si el estadio calculado del paciente está en la lista, la app preselecciona esta opción
        { label: 'Estadio I–II resecable', next: 'res-adj', stages: ['IA1','IA2','IA3','IB','IIA','IIB'] },
        { label: 'Estadio IV / recaída', next: 'av-driver', stages: ['IVA','IVB'] }
      ]
    },
    // Nodo recomendación
    'av-egfr': {
      type: 'rec',
      title: 'EGFR mutado (del19 / L858R), 1ª línea',
      phase: 'Enfermedad avanzada · 1ª línea',   // evaluación | primario | neoadyuvancia | adyuvancia | seguimiento | avanzada…
      items: [
        {
          label: 'Osimertinib 80 mg/día',
          detail: 'opcional: 1–2 líneas con matices',
          regimen: 'pulm-osimertinib',            // opcional: id en R.regimens
          level: 'A',
          refs: [{ name: 'FLAURA', pmid: '29151359' }],   // pmid o nct o url
          cov: { t: 'FNR', ind: 'u-osi' }
        }
      ],
      next: [ { label: 'Progresión', next: 'av-egfr-2l' } ]   // opcional
    }
  },
  notes: ['advertencias generales opcionales']
}
```

Reglas: todo `next` apunta a un nodo existente, todo nodo es alcanzable desde `start`, no hay ciclos y todo `rec` tiene al menos un ítem.

## Regímenes: `R.regimens[<id>]`

Id con prefijo de tumor: `pulm-carbo-pem-pembro`.

```js
{
  name: 'Carboplatino + pemetrexed + pembrolizumab',
  cycle: 'cada 21 días × 4, luego mantenimiento pemetrexed + pembrolizumab',
  drugs: [
    { name: 'Carboplatino', dose: { type: 'auc', value: 5 }, day: 'D1' },
    { name: 'Pemetrexed', dose: { type: 'm2', value: 500, unit: 'mg' }, day: 'D1' },
    { name: 'Pembrolizumab', dose: { type: 'flat', value: 200, unit: 'mg' }, day: 'D1' }
  ],
  // type: 'm2' (por m² de superficie corporal) | 'kg' (por kg de peso) | 'auc' (carboplatino, Calvert) | 'flat' (dosis fija) | 'text' (value: texto libre)
  notes: ['Ácido fólico + B12 antes de pemetrexed'],
  refs: [{ name: 'KEYNOTE-189', pmid: '29658856' }]
}
```
