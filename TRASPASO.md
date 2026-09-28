# Traspaso: App para el Cáncer (FNR-onco)

Documento para la sesión que sigue. Resume qué se decidió, qué está hecho y qué falta. Lo que no está acá no fue decidido: preguntarle a la usuaria antes de asumir.

## 1. Cómo trabajar con la usuaria (obligatorio)
- **Idioma:** español rioplatense, con voseo.
- **Rol esperado:** revisor metodológico, no asistente que confirma. **La debilidad va primero.** Sin relleno ("buena pregunta", "tenés razón", "por supuesto").
- **Certeza:** etiquetar cada afirmación como **[Dato confirmado]** (fuente primaria o código), **[Inferencia razonable]** o **[Extrapolación]**. Distinguir qué sale del repositorio y qué de una búsqueda.
- **Posiciones:** no cambiar una postura técnica solo porque la usuaria insista. Sí cambiarla ante un dato nuevo o un error real.
- **Contenido clínico:**
  - la IA redacta y verifica, pero **nunca aprueba** (ver `GOBERNANZA.md`);
  - sala limpia: prohibido usar documentos NCCN; las guías se resumen con palabras propias.
- **Git:**
  - rama de trabajo: `ARMDO96-patch-1`, con push a `origin ARMDO96-patch-1`;
  - no abrir un PR sin que la usuaria lo pida;
  - no reescribir historia.

## 2. Qué es y hacia dónde va
- **Hoy:** una PWA estática sin paso de compilación, solo para el médico. Estadio → tratamiento según guía propia → requisitos del FNR. Las fichas se guardan en el `localStorage` del celular (`app/app.js:5`).
- **Objetivo:** "App para el Cáncer", con dos lados conectados por Supabase:
  - **Lado doctor:** lo que ya existe, más asignar estudios y tratamientos a cada paciente, una ficha con lo que el paciente reporta y una bandeja de pendientes.
  - **Lado paciente:**
    - entra con cédula + código por mail, o con cédula + código de invitación + PIN;
    - ve lo que le asignó su doctor y carga la fecha que coordinó;
    - recibe la preparación y los avisos;
    - confirma si se hizo el estudio o recibió el tratamiento, y comenta;
    - consulta un catálogo de síntomas con la conducta que corresponde.

    Todo lo que marca le llega al doctor con fecha y hora.
- **Piloto:** las dos doctoras (la usuaria y la segunda revisora) y 10–20 pacientes con consentimiento firmado.

## 3. Decisiones tomadas (no volver a discutir sin un dato nuevo)
| Tema | Decisión | Motivo |
|---|---|---|
| Servidor | Supabase, región **Frankfurt (eu-central-1)** | [Dato confirmado] La Res. URCDP 23/021 clasifica a Brasil como país **no adecuado**. La UE sí es adecuada. |
| Servidor de prueba | **Supabase gratis online**, proyecto `app-cancer-demo` en Frankfurt, **solo pacientes ficticios** | Se pausa tras 1 semana sin uso y no tiene copias de respaldo. No sirve para datos reales: para eso hace falta Pro, más la parte legal. |
| Acceso del paciente | Cédula + **código de 6 dígitos** por mail (no enlace mágico, que en iPhone abre Safari y no la PWA), o cédula + invitación + PIN | — |
| PIN | **Verificado en el servidor**: secreto del dispositivo + hash del PIN + 5 intentos | Un PIN que solo existe en el celular se adivina sin conexión si lo roban. |
| Doctores | Registro → **la administradora aprueba** → segundo factor TOTP. Las políticas de seguridad por fila exigen `aal2`. | — |
| Administradora | Aprueba doctores pero **no ve pacientes** por ese rol | Mínimo privilegio. |
| Cliente Supabase | Se copia `supabase-js` (UMD, versión fija y hash) a `vendor/`. **No se carga desde CDN.** | La CSP de `index.html` es `script-src 'self'`. Solo se agrega `connect-src` al dominio del proyecto. |
| Triage de síntomas | Se calcula **en el celular** con el catálogo guardado en caché. El reporte queda en cola si no hay red. | Un paciente sin señal igual tiene que ver "consultá a emergencia ya". |
| Fiebre | ≥38 °C en quimioterapia → emergencia **siempre**, sin preguntas de gravedad. Avisos los días 7 y 10, y mensaje fijo en la pantalla de inicio del día 5 al 14 de cada ciclo. | — |
| Preparaciones | **Ninguna preparación genérica indica suspender** anticoagulantes, antiagregantes, insulina ni metformina. La indicación concreta la escribe el doctor. | [Dato confirmado, ACR] Con TFGe ≥30 no se suspende la metformina; con TFGe <30 se suspende 48 h *después* del contraste. |
| Avisos | Ayuno o premedicación: la noche anterior a las 20:00. El día del estudio: `min(07:00, hora − 2 h)`. Zona `America/Montevideo`. En la base, `timestamptz`. | — |
| Datos compartidos sin conexión | En el piloto se escriben **solo con conexión**. Se leen de una copia local. | La sincronización con resolución de conflictos no se justifica para 20 pacientes. |
| Auditoría | La ficha se lee **solo a través de funciones RPC `security definer`**, que registran en `audit_log` | Las políticas de seguridad por fila no registran los `SELECT`. |
| Notificaciones | Sin datos clínicos en el texto. Respaldo por mail, porque en iPhone el push solo funciona con la app en la pantalla de inicio (iOS 16.4 o posterior). | — |
| Nombre | "App para el Cáncer". `short_name`: "Para el Cáncer". Agregar `"id": "./"` al manifest **antes** de renombrar. | — |
| Pautado | El mecanismo principal es la vigilancia semanal. El recordatorio anual es el 15 de abril. | [Dato confirmado] Las fechas de publicación varían: febrero de 2023 y 2024, septiembre de 2024, abril de 2026. |

## 4. Estado actual (rama `ARMDO96-patch-1`)
- `main` ya está fusionado en la rama (commit de merge `315259a`).
- Commit `f53060b`: vigilancia y revisión anual.
  - `tools/vigilancia.mjs`: funciones puras con las fuentes (FNR, FTM, Pautas HC, FDA, EMA/CHMP, ESMO), enlaces, etiquetado por tumor, fármacos (diccionario `tools/farmacos.json` + sufijos DCI), capítulos (`tools/pautas-map.json`) e informe del pautado.
  - `tools/vigencia.mjs`: orquesta la vigilancia. La instantánea se guarda en la rama `vigencia-estado` (workflow `vigencia.yml`), así que cada novedad se reporta una sola vez.
  - `tools/pautas.mjs`: lee el PDF con `pdfjs-dist` 5.6.205. Usa el índice del PDF o, si no tiene, los títulos de página. **Solo guarda huellas y fármacos, nunca texto.**
  - `tools/revision-anual.mjs` y `.github/workflows/revision-anual.yml`: el issue del 15 de abril.
  - `content/sources.js`: `pautasHC = { citada: '2023', vigente: '2025', estricto: false }`.
  - `tools/validate.mjs`: rechaza citas a otra edición y avisa citas sin edición o a portadas genéricas. Con `estricto: true`, esos avisos pasan a ser errores.
  - `tests/vigencia.test.mjs` con fixtures armados a mano en `tests/fixtures/vigencia/`.
- `npm run check`: 16 de 16 pruebas pasan. La prueba de punta a punta pasa 7 de 7.
- Hallazgo pendiente: **39 citas al pautado** (18 dicen "2023" y 21 no dicen edición, en colorrecto y próstata) y **33 citas a portadas genéricas** (14 `esmo.org`, 11 `esgo.org`, 1 `figo.org`, 7 `hc.edu.uy`; una versión anterior de este documento decía 48 por error). Se listan con `node tools/revision-anual.mjs`.
- `FNR-onco-v4.zip` está en la rama porque lo subió la usuaria. No borrarlo sin que lo pida.

## 5. Trabajo pendiente, en orden

### D. Actualizar las citas al pautado vigente (primero)
La usuaria ya habilitó `oncologiamedica.hc.edu.uy`.
1. Comprobar el acceso: `curl -sS -o /dev/null -w "%{http_code}" https://oncologiamedica.hc.edu.uy/`. Si da 403, avisar y no insistir.
2. Abrir la página del pautado (`R.sources.pautasHC.pagina`) y confirmar la edición vigente y sus archivos. [Inferencia pendiente de confirmar] Sería la actualización 2025 de 15 temas, publicada en abril de 2026. Puede venir en un solo PDF o en varios por tema.
3. `node tools/pautas.mjs <pdf>` sobre cada archivo. Ajustar `tools/pautas-map.json` si algún título no coincide.
4. Verificar **cada una de las 39 citas** contra el capítulo nuevo:
   - si la conducta sigue igual, actualizar nombre, edición y URL (que apunte al capítulo o al PDF);
   - si cambió, **no corregirla en silencio**: dejar una nota u objeción con la fuente y avisarle a la usuaria.
5. Reemplazar las 33 portadas genéricas por la guía concreta (ESMO, ESGO o FIGO con su URL real, o el PDF del pautado).
6. Poner `citada = vigente` en `content/sources.js` y después `estricto: true`. Correr `npm run check`.
7. Cambiar una cita cambia la huella del ítem, así que ese ítem vuelve a revisión, que es lo correcto.
8. Con el acceso habilitado, probar también la vigilancia real: `VIGENCIA_SNAPSHOT=/tmp/s.json node tools/vigencia.mjs`. Revisar que los filtros de FDA, EMA y ESMO encuentren enlaces: se armaron sin ver las páginas en vivo [Inferencia razonable]. Si alguno falla, ajustar el `filter` en `SOURCES` y sumar un fixture.
9. Si el proxy lo permite, informe de fármacos por tumor: fármacos que nombra el pautado y faltan en la app. Entregárselo a la usuaria como **lista a evaluar**, no como cambios.

**Avance de D al 2026-09-28** (detalle en `content/reviews/pautado-2025.md` y `content/reviews/patron-editora.md`):

| Paso | Estado |
|---|---|
| 1. Acceso al dominio | 403 en el proxy. El PDF llegó por Google Drive ("PAUTAS-DE-ONCOLOGIA-MEDICA-FF-2025-.pdf", 13,5 MB). |
| 2. Edición vigente | [Dato confirmado] Diciembre de 2025, un solo PDF de unas 780 páginas. Mama, colon-recto y próstata figuran entre los capítulos actualizados. |
| 3. `pautas.mjs` | **Sin hacer**: Drive no descarga archivos de más de 10 MB, y su texto se corta en la p. 79. Hace falta el PDF partido por capítulo. |
| 4. Verificar las citas | **Mama**: hecho. 12 se actualizaron a 2025; 6 difieren del pautado y esperan decisión de las revisoras. **Colorrecto y próstata**: sin verificar contra el pautado. Sus citas se reemplazaron por guías ESMO/EAU y ensayos, así que hay que volver a citar el pautado cuando se lea el capítulo. |
| 5. Portadas genéricas | De 33 quedan 2 (`ccr/stage0#0` y `ccr/seguimiento-colon#0`), que tienen aprobación de la editora: se espera su respuesta. |
| 6. `citada`/`estricto` | Sin hacer: primero hay que cerrar el 4. Mientras tanto, el validador acepta mezclar las dos ediciones. |
| 8. Vigilancia real | Sin hacer por el bloqueo de red. |
| 9. Fármacos | Mama, hecho (lista para evaluar). |

- Revisión de la editora de colorrecto: incorporada. Se corrigieron los huecos de gobernanza en "aprobar con cambio menor" y en los vencimientos que se repetían.
- **NCCN**: la usuaria confirmó el 2026-09-28 que no hay autorización. Sigue la sala limpia.

### PR hacia `main` (preguntar primero)
Las tareas programadas de GitHub (`vigencia.yml`, `revision-anual.yml`) **solo corren desde `main`**. Hay que preguntarle a la usuaria si abre el PR. Después de fusionar, que dispare a mano "Vigilancia de vigencia" desde Actions.

### E. Servidor de prueba y app de pacientes (fases)
Necesita que la usuaria cree el proyecto gratis `app-cancer-demo` en Frankfurt y pase la URL y la clave `anon`. **La clave de servicio no va al repo.** Mientras tanto se puede avanzar con Supabase local en la CI.

1. **Nombre y pantalla inicial:**
   - `id` en el manifest, "App para el Cáncer", elección "Soy doctor / Soy paciente";
   - aviso "No es un servicio de emergencia: ante una urgencia llamá al 911 o a tu emergencia móvil";
   - íconos;
   - `app/config.js` con `ENTORNO: 'demo'` y la banda "DEMO: no cargar datos reales".
2. **Servidor base** (`supabase/` versionado en el repo):
   - `migrations/`: tablas `profiles`, `doctors`, `patients` (cédula con dígito verificador), `care_links`, `invites`, `devices`, `plan_items`, `appointments`, `notifications`, `push_subscriptions`, `confirmations`, `symptom_reports` (con `client_created_at` y `received_at`) y `audit_log`;
   - políticas de seguridad por fila y funciones RPC;
   - `seed.sql` con datos ficticios;
   - pruebas pgTAP;
   - job de CI con `supabase start`.
3. **Doctores y administración:** registro, aprobación, TOTP con `aal2`, panel de administración. La migración de fichas locales es manual y paciente por paciente, con su consentimiento.
4. **Pacientes:** alta con validación de la cédula (pesos 2-9-8-7-6-3-4), invitación (un solo uso, 14 días, 5 intentos) y Edge Functions:
   - `patient-otp`: responde siempre lo mismo, exista o no la cédula, con límite de pedidos;
   - `verify-otp`;
   - `redeem-invite`;
   - `pin-login`: `admin.generateLink` → el cliente canjea con `verifyOtp({token_hash})`.

   Además: consentimiento, plan y fechas.
5. **Preparaciones y avisos:**
   - `content/prep/` con doble revisión y el control "comprensible para el paciente";
   - `app/schedule.js` como lógica pura, compartida con la Edge Function `send-due`;
   - `pg_cron` cada 5 minutos;
   - web push con claves VAPID, más mail;
   - confirmaciones y comentarios.
6. **Síntomas:**
   - `content/symptoms/` basado en **PRO-CTCAE (NCI)**, que tiene versión en español; verificar sus términos de uso;
   - umbrales contrastados con alguna herramienta publicada de triage oncológico;
   - `app/triage.js` como lógica pura;
   - bandeja del doctor y aviso de alarma por mail.
7. **Revisión clínica** de los catálogos con el modo revisión existente.
8. **Piloto.** Métrica principal: tiempo desde que el paciente reporta una alarma hasta que el doctor la ve.

   [Inferencia razonable] Los ensayos de seguimiento electrónico de síntomas mostraron beneficio con un equipo que respondía a las alertas, y acá no hay lectura garantizada. En el piloto no hay que esperar ese beneficio clínico.

## 6. Pendientes de la usuaria (bloquean el piloto, no el desarrollo)
- Definir el **responsable de la base de datos** ante la URCDP: persona física, institución o sociedad.
- **Consulta legal:**
  - transferencia internacional y DPA de Supabase (empresa de EE. UU.);
  - inscripción de la base;
  - política de privacidad;
  - [Extrapolación] si la normativa del MSP trata el catálogo de síntomas como dispositivo médico.
- **Comité de Ética:** [Inferencia razonable] un piloto con métricas probablemente sea investigación en seres humanos (Decreto 158/019).
- Dejar claro en los textos que **la app no es la historia clínica** (Decreto 242/017).
- Supabase Pro para datos reales, SMTP propio, dominio y marca (DNPI: "App para el Cáncer" es descriptivo; sumar un logo distintivo).

## 7. Particularidades del entorno
- **Prueba de punta a punta local:** el Playwright fijado (1.49.1) busca un navegador que no está instalado acá. Correr una copia temporal con `chromium.launch({executablePath: '/opt/pw-browsers/chromium'})` y borrarla después. En GitHub funciona sin cambios.
- **Docker** no tiene daemon en este contenedor. Supabase local solo corre en la CI de GitHub.
- **Dominios:** si un dominio da 403 en el proxy, no reintentar; avisarle a la usuaria.
  - 2026-09-28: `oncologiamedica.hc.edu.uy` dio 403 en el proxy pese a estar habilitado, y también `esmo.org`, `esgo.org`, `figo.org`, `fda.gov`, `ema.europa.eu` y `fnr.gub.uy`. La tarea D quedó sin empezar. [Inferencia razonable] El cambio de red se aplica a sesiones nuevas, o no se guardó.
- **Después de tocar `content/` o `app/`:** correr `node tools/gen.mjs`. La CI exige `index.html` y `sw.js` al día.
- **Antes de cada commit:** `npm run check`.

## 8. Seguir planificando
Además de ejecutar, esta sesión tiene que avanzar el plan. Para cada fase de la sección 5, antes de implementarla:
- escribir el diseño concreto: esquema SQL, políticas, pantallas, textos a revisar;
- listar las preguntas abiertas para la usuaria;
- identificar la debilidad principal de esa fase.

Presentarlo y esperar su validación al cierre de cada fase. No encadenar todas las fases seguidas.
