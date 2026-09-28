# Gobernanza del contenido clínico de FNR-onco

Este documento fija quién puede cambiar el contenido clínico de la app, cómo se revisa y cuándo una recomendación deja de ser borrador. Se aplica a todo lo que está en `content/`: normativas FNR, estadificación, vías terapéuticas y regímenes.

## Principios

1. **Ninguna recomendación se publica como revisada sin dos aprobaciones humanas independientes.**
2. **La inteligencia artificial redacta, verifica y aplica cambios, pero nunca aprueba.** No cuenta como revisor.
3. **Toda aprobación queda atada a la versión exacta del contenido.** Si el contenido cambia, la aprobación caduca sola.
4. **Ante la duda, se retira.** Una opción objetada o sin respaldo no se muestra como revisada.
5. **Todo queda registrado.** Las decisiones viven en el repositorio (`content/reviews/`) y en su historial de git.

## Roles

| Rol | Responsabilidad |
|---|---|
| **Editor clínico responsable** | Primera revisión de cada ítem. Decide la agenda, firma la publicación de cada tumor y resuelve con el segundo revisor los desacuerdos. |
| **Segundo revisor** | Revisión independiente y a ciegas de cada ítem. |
| **Mantenimiento técnico** (Claude) | Redacta borradores con la regla de sala limpia, verifica citas, aplica correcciones e incorpora las revisiones al registro. No aprueba. |

Los nombres y la declaración de conflictos de interés de cada revisor se publican en la app, en "Acerca de".

## Qué se revisa

La unidad de revisión es **cada ítem**: una opción terapéutica dentro de una recomendación. Un tumor pasa a `status: 'revisado'` sólo cuando el 100 % de sus ítems tiene doble aprobación vigente. El validador (`tools/validate.mjs`) impide declarar revisado un tumor que no cumple esta condición.

### Lista de control por ítem

Para **aprobar** hay que marcar todos los controles que correspondan:

- [ ] Abrí la referencia: existe y respalda esta opción en esta población y en esta línea. La app muestra el título real del artículo obtenido de PubMed.
- [ ] El nivel de evidencia cumple la escala A/B/C (`content/SCHEMA.md`).
- [ ] La cobertura coincide con la normativa FNR vigente (con su fecha) o con el FTM.
- [ ] Dosis y ciclo correctos, si el ítem tiene régimen.

### Decisiones posibles

| Decisión | Cuándo | Comentario |
|---|---|---|
| Aprobar | El ítem es correcto tal como está | Opcional |
| Aprobar con cambio menor | Correcto en lo clínico; hay que ajustar la redacción | Obligatorio |
| Objetar | Hay un error clínico, de cita, de cobertura o de dosis | Obligatorio, con fuente |
| Retirar | La opción es peligrosa o no tiene respaldo | Obligatorio |

## Cómo se revisa

1. El revisor abre **"Acerca de → Modo revisión"** en la app. Elige su rol y declara sus conflictos de interés una sola vez.
2. Recorre los ítems del tumor, completa la lista de control y decide.
3. **A ciegas:** no ve las decisiones del otro revisor hasta cerrar su propia pasada de ese tumor.
4. Al cerrar la pasada, la app genera un **archivo de revisión** con todas sus decisiones y las huellas del contenido. Ese archivo se envía al mantenimiento técnico.
5. El mantenimiento técnico lo incorpora con `node tools/apply-review.mjs <archivo>`. Se rechazan:
   - las decisiones sobre contenido que cambió después de revisarlo (huella distinta),
   - las aprobaciones sin controles completos,
   - las objeciones sin comentario.
6. El estado se consulta con `node tools/review-status.mjs`.

## Estados de un ítem

| Estado | Significado | Qué muestra la app |
|---|---|---|
| Pendiente | Sin decisiones sobre la versión actual | Nada (el tumor sigue con la advertencia de borrador) |
| 1 de 2 | Una sola aprobación vigente | Nada |
| **Revisado** | Aprobado por los dos roles, sobre esta versión exacta y hace menos de 12 meses | "Revisado por dos oncólogos · mes/año" |
| En discusión | Algún revisor lo objetó | "En discusión entre revisores" |
| Caducado | Aprobado sobre una versión anterior, o hace más de 12 meses | Nada: vuelve a revisión |
| Retirado | Algún revisor pidió retirarlo | Se oculta |

## Desacuerdos

Con dos revisores no hay tercero que desempate. Por eso:

- Un ítem objetado se discute entre los dos revisores, con las fuentes sobre la mesa.
- Si hay consenso, se corrige el contenido. El ítem vuelve a revisión, porque cambió su huella, y los dos lo aprueban de nuevo.
- Si en **2 semanas** no hay consenso, el ítem se retira o queda "en discusión" con advertencia visible. **Nunca se publica como revisado.**

## Conflictos de interés

- Cada revisor declara sus vínculos con la industria de los últimos 3 años: honorarios, investigación, viajes financiados.
- Si un ítem involucra un fármaco o una empresa con la que el revisor tiene vínculo, lo marca en la lista de control. **Esa aprobación no cuenta**, y el ítem necesita otra aprobación sin conflicto.

## Vigencia y actualización

- Cada aprobación vence a los **12 meses**.
- También se revisa antes si:
  - cambia la normativa FNR o el FTM,
  - se publica un ensayo fase III que cambia la práctica,
  - hay una alerta regulatoria.
- La acción semanal **"Vigilancia de vigencia"** (`.github/workflows/vigencia.yml`) abre un issue cuando:
  - un PMID o NCT citado deja de existir,
  - cambia la lista de documentos de las páginas de normativas FNR o del FTM,
  - hay ítems revisados que vencen en los próximos 30 días.

## Fe de erratas urgente

Si alguien detecta un error con potencial de daño para un paciente:

1. Se marca el ítem con `retirado: true` en el contenido, o se registra una decisión "Retirar". El ítem deja de mostrarse en **menos de 24 horas**, sin borrar su historia.
2. Después se corrige por la vía normal y vuelve a revisión completa.

Los errores se reportan en [los issues del repositorio](https://github.com/ARMDO96/FNR-onco/issues), indicando el tumor, la opción y la fuente.

## Sala limpia (propiedad intelectual)

- El contenido se redacta **sin usar documentos NCCN**. El validador rechaza cualquier aparición de esa marca.
- Pautas nacionales, ESMO y demás guías se citan y resumen con palabras propias. No se copian frases ni diagramas.
- En cada ciclo de revisión se toma una muestra de textos y se busca copia literal de guías con derechos.

## Piloto

El proceso se calibra primero con **pulmón no microcítico**. Se mide el tiempo por ítem, la tasa de objeción y los tipos de error encontrados. Con esos datos se ajusta la lista de control antes de revisar mama, colorrecto, próstata y cuello uterino.
