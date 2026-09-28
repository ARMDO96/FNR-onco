# Patrón de la revisión de la editora (colorrecto, 2026-09-28) y ajustes derivados

Redactó el mantenimiento técnico (IA). **Nada de esto es una aprobación ni reemplaza la revisión.** Cada ítem modificado cambió de huella y vuelve a revisión. El objetivo es presentarle a la editora contenido que ya cumpla sus criterios explícitos, para que la segunda pasada sea más rápida.

## Limitación principal

El patrón sale de **19 decisiones sobre un solo tumor** (13 aprobaciones, 2 aprobaciones con cambio, 3 objeciones y 1 decisión rechazada por falta de controles). Alcanza para inferir criterios sobre **referencias y formato**, pero no para inferir su postura clínica en otros tumores.

Por eso no se extrapolaron sus preferencias de conducta de colon a mama, próstata, cuello uterino ni pulmón. En esos tumores solo se aplicó el criterio sobre la calidad de la referencia.

## Criterios que se desprenden de sus decisiones

| Criterio | De dónde sale | [Certeza] |
|---|---|---|
| Aprueba cuando se cita el ensayo pivotal concreto (MOSAIC, X-ACT, IDEA, PRODIGE 23, OPRA, Ribic) | 13 aprobaciones | [Dato confirmado] |
| Acepta la extrapolación si está rotulada como tal y el nivel es C | aprobó `colon-II-bajo#1` (X-ACT, extrapolación) | [Dato confirmado] |
| Rechaza como evidencia un enlace a una portada ("el link no lleva a la evidencia") | `colon-I#0` | [Dato confirmado] |
| Pide sumar el ensayo directo cuando existe, aunque la conducta no cambie | `colon-II-alto#0` (ACHIEVE-2) | [Dato confirmado] |
| En seguimiento prefiere esquemas concretos, con TC anual los primeros 3 años y colonoscopía a 1 año y después cada 3–5 | `seguimiento-colon#1` y `#2` | [Dato confirmado] |
| Desconfía de las estrategias con fase II y pocos pacientes que no se usan en el medio | `recto-dmmr#0` | [Dato confirmado] |
| Aprobó dos ítems con enlaces a portadas (`stage0#0`, `seguimiento-colon#0`) | — | Inconsistente con `colon-I#0`: [Inferencia razonable] fue un criterio que endureció durante la pasada |

## Ajustes aplicados (vuelven a revisión)

**Colorrecto**

- `seguimiento-recto#1`: TC anual los primeros 3 años; después, opcional. Es el mismo criterio que pidió para colon.
- `mets-1l-braf`:
  - FOLFOXIRI + bevacizumab deja de figurar como "preferido". [Dato confirmado, PubMed] El metaanálisis de datos individuales (Cremolini et al., JCO 2020, PMID 32816630) no mostró beneficio adicional en BRAF mutado; el "preferido" se apoyaba en un subgrupo.
  - Se agrega **encorafenib + cetuximab + mFOLFOX6** (BREAKWATER, fase III, PMID 40444708): SG 30,3 vs. 15,1 meses, HR 0,49 en análisis interino. Sin régimen cargado, porque las dosis del protocolo no se verificaron desde el resumen. Cobertura a verificar.

**Próstata** (criterio: citar el ensayo directo)

- Abiraterona en no metastásico de alto riesgo:
  - no es un subgrupo, sino un metaanálisis preespecificado de dos ensayos fase III de STAMPEDE (Attard et al., Lancet 2022, PMID 34953525), con SLM HR 0,53 y SG HR 0,60;
  - el nivel pasa de B a A según `SCHEMA.md`.
- Docetaxel en próstata resistente a la castración: la cita era CHAARTED "por extrapolación". La evidencia directa es TAX 327 (PMID 15470213).

**Pulmón**

- Lorlatinib tras alectinib: se agrega el fase II global (Solomon et al., PMID 30413378) con el dato del subgrupo pertinente (9 de 28 respuestas con un inhibidor previo distinto de crizotinib). Se mantiene el nivel C.

## Lo que queda para ella

- `stage0#0` y `seguimiento-colon#0` citan portadas. Reemplazarlas anula sus aprobaciones: ¿se reemplazan?
- Esquema de controles clínicos y CEA: su comentario en `seguimiento-colon#1` contradice `seguimiento-colon#0`, que aprobó. Lo mismo aplica a `seguimiento-recto#0`.
- `recto-dmmr#0` (dostarlimab): ver `pautado-2025.md`.
- Las citas a portadas genéricas de colorrecto, cuello uterino y próstata se reemplazan con propuestas verificadas en PubMed. Cada una vuelve a revisión.

## Portadas genéricas reemplazadas (2026-09-28)

Tres subagentes propusieron referencias concretas. El mantenimiento técnico verificó cada PMID en PubMed y, en cuello uterino, las recomendaciones contra el texto completo de la guía ESGO 2023 (PMC10176411). Quedan 2 portadas, en `stage0#0` y `seguimiento-colon#0`, porque tienen aprobación de la editora.

**Correcciones de conducta** (vuelven a revisión y **tienen prioridad**):

- `ccu/ia-linfadenectomia#0`: decía "histerectomía radical modificada tipo B" para IA1 con ILV / IA2.
  - ESGO 2023: la cirugía radical es **sobretratamiento** en IA1 [IV, D] y la resección parametrial **no está indicada** en IA2 [IV, D].
  - Pasa a histerectomía simple o conización + ganglio centinela. El nivel baja de B a C, porque la guía la gradúa IV.
- `ccu/ia-fertilidad#0`: decía "traquelectomía radical" para IA1 con ILV / IA2.
  - ESGO 2023: en IA1–IA2 alcanzan la conización o la traquelectomía simple, sea cual sea el estado de ILV.
  - La traquelectomía radical queda para IB1 con ILV.
- `ccu/inicio#2`: el PET-TC pasa a indicarse desde IB3, no IB2 (salvo ganglios sospechosos o antes de quimiorradioterapia).
- `ccu/seguimiento#0`: se aclara que el esquema es orientativo; la guía pide individualizarlo según el riesgo.
- `ccr/seguimiento-recto#0`: esquema de la editora (clínica y CEA cada 3 meses los primeros 2 años), respaldado por el protocolo de FACS.

**Matices agregados sin cambiar la conducta:**

- Próstata, linfadenectomía extendida: sin diferencia en recaída bioquímica en dos ensayos aleatorizados. El ensayo de MSKCC (aleatorizado por cirujano) mostró menos metástasis en la actualización de 2024.
- Próstata, recaída bioquímica post-RT: el momento de iniciar la DAE depende del tiempo de duplicación del PSA (TOAD).
- Próstata, riesgo intermedio favorable: ProtecT no mostró diferencia de mortalidad a 10 años.

**Niveles que la escala de `SCHEMA.md` cuestiona, a decisión de las revisoras** (no se cambiaron):

- Escisión total del mesorrecto (nivel A) y metastasectomía hepática (nivel A): son estándar universal, pero nunca se compararon en un ensayo aleatorizado. Por la escala corresponderían a C.
- Prostatectomía en riesgo intermedio (nivel A): el beneficio en sobrevida global viene de SPCG-4, de la era previa al PSA.

**Sin respaldo en la guía** (no se cambió): `ccu/av-3l#0`, "rechallenge de agente previo".
