# Verificación de citas contra las Pautas HC/UdelaR 2025

Edición verificada: "Pautas de Oncología Médica para el diagnóstico, tratamiento sistémico y seguimiento", diciembre de 2025. Es un único PDF de unas 780 páginas; el índice marca con asterisco los capítulos actualizados en 2025, entre ellos mama localizado, mama metastásico, colon y recto, y próstata.

Fecha: 2026-09-28. Redactó: mantenimiento técnico (IA). **Nada de esto es una aprobación**: cada cambio de conducta lo deciden las dos revisoras (ver `GOBERNANZA.md`). Se resume con palabras propias, sin copiar texto del pautado.

## Alcance real de esta verificación

- Se leyó el texto que devuelve Google Drive del PDF. Ese texto **se corta en la página 79**: cubre mama localizado y mama metastásico, pero no colorrecto (desde p. 232), cuello uterino (p. 330) ni próstata (p. 451).
- Las 21 citas de colorrecto y próstata siguen **sin verificar**. Hace falta el capítulo en un archivo de menos de 10 MB.

## Mama: la conducta sigue igual → cita actualizada a 2025

| Ítem | Qué dice el pautado 2025 (resumen propio) |
|---|---|
| `rh-adj-horm-premeno#0` Tamoxifeno 5–10 años | Tamoxifeno ± supresión ovárica; si sigue premenopáusica, considerar completar 10 años. |
| `rh-adj-horm-postmeno#0` IA 5 años | IA por 5 o 10 años, o secuencia tamoxifeno → IA. La app muestra solo una de las opciones; no la contradice. |
| `rh-adj-horm-postmeno#1` Tamoxifeno si intolerancia a IA | Tamoxifeno 5 años, a considerar extensión a 10. |
| `rh-neo#0` AC → taxano neoadyuvante en luminal | Se puede usar en neoadyuvancia el mismo régimen adyuvante; tasa de RCp ~20 % y sin impacto demostrado en sobrevida. |
| `tn-adj-rpc-si#0` Sin QT adicional tras RCp | Capecitabina (CREATE-X) y olaparib (OlympiA) se plantean con enfermedad residual; tras KEYNOTE-522 se completa pembrolizumab adyuvante. |
| `seguimiento#2` Sin marcadores ni imágenes de rutina | En asintomáticas solo la mamografía mostró beneficio. |
| `rh-av-2l#1` Fulvestrant tras CDK4/6 | Figura entre las opciones tras progresión a IA + CDK4/6, todas sin beneficio en sobrevida global. |
| `rh-av-3l#0` / `#1` Capecitabina, taxano | Monoquimioterapia secuencial cuando no hay crisis visceral. |
| `tn-av-1l-neg#0` Taxano en TN avanzado sin indicación de inmunoterapia | Monoquimioterapia (docetaxel, paclitaxel, capecitabina y otros) en enfermedad no agresiva. Pembrolizumab + QT se reserva para CPS ≥10 (KEYNOTE-355). |
| Régimen `mama-ai` | Consistente. |
| Régimen `mama-paclitaxel-av` | 90 mg/m² D1, D8, D15 cada 28 días, igual que el brazo de KEYNOTE-355. |

## Mama: la conducta difiere o el pautado no la respalda → cita sin tocar, a decisión de las revisoras

1. **`tn-temprano#0`** (detalle "considerar neoadyuvancia si ≥T2 o N+"). El pautado 2025 considera la neoadyuvancia **estándar en triple negativo ≥T1c y/o N+**. El umbral de la app es más alto.
2. **`tn-neo#0`** (docetaxel + carboplatino, o AC → taxano + carboplatino; nivel A).
   - El pautado 2025 no menciona docetaxel + carboplatino sin antraciclina.
   - Plantea el carboplatino agregado a antraciclina + taxano (BrighTNess) como opción a considerar en pacientes jóvenes con tumores localmente avanzados, a costa de más toxicidad.
   - Describe como régimen válido en estadios II–III el de KEYNOTE-522: pembrolizumab + QT con platino, taxano y antraciclina.
   - Revisar la opción sin antraciclina y el nivel A.
3. **`seguimiento#0`** (examen clínico cada 3–6 meses por 3 años, luego anual). El pautado agrega un escalón: **cada 6–12 meses en los años 4 y 5**, y después anual.
4. **`seguimiento#1`** (mamografía anual). El pautado indica **mamografía cada 1–2 años** (ipsilateral tras cirugía conservadora y contralateral).
5. **Régimen `mama-ofs-ai`** (goserelina + **letrozol**). La evidencia que cita el pautado para supresión ovárica + IA (TEXT/SOFT) es con **exemestano**. Lo recomienda en premenopáusicas que no toleran tamoxifeno o de mayor riesgo.
6. **`cis#0`** (cirugía conservadora o mastectomía; ganglio centinela no siempre necesario). El capítulo 2025 solo trata los márgenes del CDIS. No encontré en el texto respaldo para lo del ganglio centinela. Conviene otra fuente, por ejemplo una guía quirúrgica.

## Colorrecto: revisión de la editora (2026-09-28)

Se incorporaron 18 decisiones. `colon-I#0` ("aprobar con cambio menor") se rechazó porque llegó sin los controles marcados. El comentario decía que la referencia no respalda, así que el control de referencia no podía estar marcado. Se corrigieron los ítems que pidió la editora, y esos ítems vuelven a revisión:

- `colon-I#0`: referencia a la guía ESMO 2020 de colon localizado (PMID 32702383) en lugar de la portada de esmo.org.
- `colon-II-alto#0`:
  - se agregan ACHIEVE-2 (PMID 33121997) e IDEA estadio II (PMID 33439695), y la condición de la editora para 3 meses de CAPOX;
  - advertencia metodológica: en IDEA estadio II **no se demostró la no inferioridad** en la población global (HR 1,17; límite 1,2);
  - el dato favorable a 3 meses de CAPOX (HR 1,02) sale de un análisis por esquema **no aleatorizado**;
  - ACHIEVE-2 (n = 525) tiene un IC amplio (HR 1,12; IC 95 % 0,67–1,87).
- `seguimiento-colon#1`: TC anual los primeros 3 años; después, opcional.
- `seguimiento-colon#2`: colonoscopía al año; luego cada 3–5 años, o antes según hallazgos o síntomas.

Queda abierto:

- **Esquema de controles clínicos y CEA** que pidió la editora en `seguimiento-colon#1`: cada 3 meses los años 1–2, cada 3–6 meses el año 3, cada 6 meses desde el año 4. Contradice `seguimiento-colon#0` (CEA cada 3–6 meses por 2 años, luego cada 6 meses hasta el año 5), que la misma editora aprobó sin cambios. Hay que definir cuál rige antes de tocar #0.
- **`recto-dmmr#0`** (dostarlimab), objetado: "fase 2 con pocos pacientes, evidencia muy baja, no se usa".
  - La referencia del ítem es la serie de 2022 (12 pacientes).
  - La actualización de 2025 (Cercek et al., NEJM, PMID 40293177) tiene 49 pacientes con recto que completaron el tratamiento, todos con respuesta clínica completa, y 37 con respuesta sostenida a 12 meses. Sigue siendo un fase 2 de un solo brazo, con mediana de seguimiento de 20 meses.
  - El nivel C y la etiqueta "en investigación" son coherentes con eso. La objeción de que "no se usa" es de práctica local y cobertura, no de evidencia.
  - A decidir entre las dos revisoras: retirar el ítem o mantenerlo como investigacional con la referencia actualizada.
- `stage0#0` y `seguimiento-colon#0` se aprobaron con la referencia a la portada de esmo.org, que no lleva a ninguna evidencia. Reemplazarla invalida esas aprobaciones.
- La editora todavía no declaró conflictos de interés (el campo del archivo vino vacío).
