# Textos para pacientes: pendientes de revisión clínica

La IA los redactó y **no están aprobados**. Siguen el mismo proceso que el contenido clínico (`GOBERNANZA.md`): los aprueban las dos revisoras, y además se controla que sean comprensibles para el paciente.

| Dónde | Texto | Origen |
|---|---|---|
| Pantalla inicial y acceso del paciente | "No es un servicio de emergencia. Ante una urgencia llamá al 911 o a tu emergencia móvil." (el "911" ahora es un enlace `tel:911`, mismo sentido) | Decisión del plan (`TRASPASO.md`) |
| Inicio del paciente, ventana de riesgo (día 5 a 14 desde la quimio, TRASPASO §3) | "Si tenés fiebre de 38 °C o más durante la quimioterapia, andá a emergencia ahora. No esperes a la próxima consulta ni a que baje sola." | Decisión del plan: fiebre ≥38 °C en quimioterapia → emergencia siempre. Antes se mostraba siempre que había quimio coordinada; ahora sólo en la ventana decidida (ver mejora 2, `app/ciclo.js`) |
| Inicio del paciente, fuera de la ventana de riesgo (nuevo) | "Si tenés fiebre de 38 °C o más, entrá en Síntomas." | Recordatorio discreto para no perder la indicación fuera de la ventana fija; el botón de fiebre en Síntomas sigue disponible siempre |
| Síntomas → "Tengo fiebre de 38 °C o más" | "Andá a emergencia ahora. Con fiebre de 38 °C o más durante la quimioterapia hay que consultar enseguida, aunque te sientas bien." + botón "Llamar al 911" (enlace `tel:911`) + "O llamá a tu emergencia móvil y decí que estás en tratamiento de quimioterapia." | Ídem. Se separó el 911 en un botón de llamada directa (mejora 2 del informe de UX) |
| "Lo que enviaste" → alarma de fiebre (nuevo, 2.ª persona) | "Avisaste que tenés fiebre. Te indicamos ir a emergencia." | Antes se repetía ahí el texto de auditoría para el médico ("ALARMA: fiebre ≥38 °C..."); ahora el paciente lee un texto propio (mejora 1 del informe de UX). El texto para el médico no cambia (`app/doctor.js` sigue mostrando `e.texto`) |
| "Lo que enviaste" → coordinaste una fecha (nuevo, 2.ª persona) | 'Coordinaste "«nombre del ítem»" para el «fecha en español, 24 h».' | Ídem |
| "Lo que enviaste" → confirmaste que se hizo / que no se hizo (nuevo, 2.ª persona) | 'Confirmaste que se realizó "«nombre»". Tu médico ya lo sabe.' / 'Avisaste que "«nombre»" no se hizo. Tu médico ya lo sabe.' | Ídem |
| "Lo que enviaste" → comentario (nuevo, 2.ª persona) | 'Le escribiste a tu médico sobre "«nombre»": «tu comentario».' | Ídem |
| "Lo que enviaste" → otro síntoma (nuevo, 2.ª persona) | "Le contaste a tu médico: «tu texto»." | Ídem |
| "Lo que enviaste" → texto genérico de compatibilidad (nuevo) | Un texto genérico según el tipo de evento (p. ej. "Marcaste una indicación de tu plan.") para eventos guardados antes de este cambio, que no tienen el texto en 2.ª persona | Compatibilidad con datos ya guardados en el dispositivo |
| Mi plan → fecha coordinada (nuevo) | Debajo del campo de fecha y hora: "Vas a guardar: «fecha en español, 24 h»" mientras se elige, y "Fecha coordinada: «fecha»" si ya hay una guardada | Mejora 6 del informe de UX: evitar la confusión día/mes del campo de fecha en inglés/12 h del navegador |
| Mi plan → toast al guardar la fecha (cambiado) | "Fecha guardada: «fecha en español, 24 h». Tu médico la ve." (antes no repetía la fecha) | Ídem |
| Mi plan → toast al confirmar "¿Se realizó?" (nuevo) | "Gracias, tu médico lo ve." (Sí) / "Avisado a tu médico." (No) | Mejora 7 del informe de UX: antes no había ninguna confirmación visible |
| Mi plan → botón de calendario (nuevo) | Botón "Agregar a mi calendario" en cada ítem con fecha; el archivo .ics descargado usa el título genérico "Turno médico" (sin dato clínico) y pone el nombre del ítem sólo en la descripción | Mejora 9 del informe de UX y decisión de TRASPASO ("notificaciones sin datos clínicos"): se aplicó el mismo criterio al título del evento de calendario |
| Preparación de cada estudio | "La indicación concreta (ayuno, medicación, qué llevar) te la da tu médico." y "No suspendas ningún medicamento sin que tu médico te lo indique." | Decisión del plan: ninguna preparación genérica indica suspender medicamentos |
| Banda en todas las pantallas | "DEMO: no cargar datos reales" | Decisión del plan |
| Síntomas → otro síntoma | "Tu médico lo lee cuando revisa su bandeja, que no es inmediata. Si empeorás o no podés esperar, consultá a emergencia." | Límite del piloto: no hay lectura garantizada |

**Todavía no hay** textos de preparación por estudio ni catálogo de síntomas. Son las fases 5 y 6 del plan: el catálogo se basa en PRO-CTCAE (NCI) y necesita la doble revisión.

**La etiqueta "Texto pendiente de revisión clínica" sigue mostrándose siempre**, a toda sesión de paciente (piloto incluido): no se condicionó a `R.esProduccion()` ni a ningún otro entorno. Es una decisión tomada, no un pendiente (ver informe de UX, mejora 3, descartada).
