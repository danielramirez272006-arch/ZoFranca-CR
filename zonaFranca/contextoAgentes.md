1. Introducción y objetivos
En las zonas francas de Costa Rica, la gestión de solicitudes de instalación y el seguimiento del cumplimiento se hacen hoy
a mano y por correo, repartidos entre varios departamentos. El reto de este laboratorio es resolverlo: levantar los
requerimientos de una plataforma, validarlos con una IA revisora, y construir una primera versión funcional del sistema —
en pareja, con GitHub, Trello y Stitch como herramientas de trabajo.
1.1 Objetivo general
Diseñar y construir, en parejas, una plataforma para zonas francas de Costa Rica que automatice —con asincronía en
JavaScript, un backend simulado en json-server y un componente de IA— un proceso que hoy el sector realiza
manualmente, partiendo de un documento de requerimientos validado por una IA revisora.
1.2 Objetivos específicos
● Aplicar técnicas de levantamiento de requerimientos (entrevista, observación, análisis del enunciado) para entender a
fondo un problema real del sector de zonas francas.
● Redactar un documento de requerimientos exhaustivo y sometido a una validación tipo examen, mediante un prompt
que convierte a la IA en un profesional senior de revisión de requerimientos.
● Implementar operaciones asíncronas (Promesas, async/await, Promise.all) controlando estados de carga y error.
● Conectar el frontend a un backend simulado real, construido con Node y json-server, en lugar de solo simular datos en
memoria.
● Diseñar los mockups de la interfaz en Stitch antes de escribir una sola línea de código de interfaz.
● Integrar un componente de IA (real vía API o simulado) que sustituya una decisión o clasificación manual del proceso.
● Trabajar en un repositorio de GitHub compartido, usando ramas y pull requests entre los dos integrantes de la pareja.
● Dar seguimiento al avance del documento de requerimientos mediante un tablero de Trello.
● Comparar cuantitativa y cualitativamente la solución manual actual contra la solución automatizada propuesta.
● Plantear, al menos a nivel de documento, cómo se expandiría la plataforma a futuro (nuevas zonas francas, nuevos
tipos de reporte, integraciones reales).
2. Enunciado del caso
Caso: “ZoFranca CR”
PROCOMER administra el régimen de zonas francas de Costa Rica, donde operan empresas de manufactura, servicios de
back-office (BPO) y tecnología. Para instalarse, una empresa presenta una solicitud con su inversión proyectada, los
empleos que generará, su sector y su respaldo legal/fiscal.
Hoy esa solicitud se revisa a mano: un analista lee los documentos, transcribe los datos a una hoja de cálculo, compara a
criterio propio si la empresa cumple los umbrales del régimen, y responde por correo semanas después. Ya instalada, cada
empresa debe reportar periódicamente su cumplimiento real (empleos, inversión, exportaciones), y ese reporte también
se consolida a mano en Excel.
Resultado: solicitudes lentas, errores de transcripción, criterios inconsistentes entre analistas, incumplimientos que nadie
detecta a tiempo, y cero trazabilidad para una auditoría.
La zona franca necesita una plataforma que reciba solicitudes y reportes, los procese de forma asíncrona sin trabar la
pantalla, use IA para pre-clasificar y generar alertas, y deje siempre la decisión final en manos de un analista humano.
Un problema grande a propósito
Este caso no se resuelve por completo en un solo laboratorio: cada pareja entrega una primera versión
funcional de un recorte del problema (una zona franca, un flujo de solicitud, un flujo de cumplimiento), pero
pensada para crecer — más zonas francas, más tipos de reporte, más integraciones. La sección 10 pide
justamente ese ejercicio de proyección.
3.4 Historias de usuario (formato ágil)
● Como empresa solicitante, quiero enviar mi solicitud de instalación en línea para no depender de correos y archivos
adjuntos.
● Como analista de la zona franca, quiero que el sistema pre-clasifique las solicitudes automáticamente para no leer
cada una a mano.
● Como analista de la zona franca, quiero ver un puntaje de afinidad y su justificación para priorizar cuáles solicitudes
revisar primero.
● Como analista de cumplimiento, quiero que el sistema me alerte cuando una empresa esté incumpliendo sus
compromisos, para actuar a tiempo.
● Como administrador de la zona franca, quiero un panel con métricas del proceso para tomar decisiones informadas.
● Como gerente de la zona franca, quiero trazabilidad completa de las decisiones tomadas, para poder auditar el
proceso ante PROCOMER.
● Como equipo de desarrollo, quiero que el diseño de la plataforma esté validado en mockups de Stitch antes de
programar, para no rehacer trabajo.
● Como integrante del equipo, quiero que el documento de requerimientos esté validado por una IA revisora antes de
programar, para no construir sobre requerimientos ambiguos.
Diseño de la solución
5.1 Proceso manual (situación actual)
Se debe documentar cómo opera hoy la administración de la zona franca, para justificar la automatización:
1. Una empresa interesada envía su solicitud de instalación por correo, con documentos adjuntos.
2. Un analista de Operaciones abre cada archivo y lee el contenido.
3. Transcribe manualmente los datos clave a una hoja de cálculo compartida.
4. Compara a criterio propio la inversión y los empleos proyectados contra los umbrales del régimen.
5. Decide subjetivamente si la solicitud avanza, se revisa más a fondo o se rechaza.
6. Una vez instalada la empresa, cada reporte periódico de cumplimiento se recibe y consolida también por correo y Excel.
7. Se compara manualmente lo reportado contra lo comprometido, y rara vez se detectan incumplimientos a tiempo.
Problemas detectados: lentitud, errores de digitación, criterios inconsistentes entre analistas, incumplimientos no
detectados a tiempo y falta de trazabilidad para una auditoría.
5.2 Proceso automatizado (situación propuesta)
1. El sistema recibe los datos de la solicitud desde un formulario web (diseñado primero en Stitch).
2. De forma asíncrona, guarda y consulta la solicitud en el backend (json-server) sin bloquear la pantalla.
3. Envía el perfil al motor de IA, que devuelve un puntaje de afinidad y una justificación.
4. El sistema clasifica automáticamente la solicitud según umbrales definidos.
5. El analista humano revisa la lista ya priorizada y confirma la decisión final.
6. Cuando la empresa está instalada, sus reportes de cumplimiento se procesan igual de forma asíncrona, comparándose
automáticamente contra los compromisos originales.
7. El sistema genera alertas visibles cuando detecta incumplimientos, en lugar de esperar a una revisión manual periódica.
Arquitectura técnica y mockups
6.1 Mockups en Stitch
Antes de escribir código de interfaz, diseñen y aprueben sus pantallas en Stitch (la herramienta de mockups con IA de
Google). Como mínimo:
● Formulario de solicitud de instalación (empresa solicitante).
● Listado/dashboard de solicitudes con su estado (Recomendada / Revisar / Rechazada).
● Detalle de una solicitud, mostrando el puntaje de la IA y su justificación.
● Formulario de reporte de cumplimiento (empresa ya instalada).
● Panel de alertas de incumplimiento.
Entregan capturas de cada pantalla (o el enlace del proyecto) junto con los prompts de diseño usados. La interfaz final en
código debe corresponder a estos mockups — no se acepta una interfaz improvisada.
6.2 Backend simulado con Node y json-server
El sistema debe conectarse a un backend real (aunque simulado), levantado con json-server sobre Node, en lugar de
trabajar solo con datos en memoria del navegador.

7. Estado actual de la implementación (agosto 2026)
7.1 Arquitectura del frontend
● Vite 8 como bundler/dev server, con tres puntos de entrada: index.html (dashboard operativo),
login.html y recuperar.html (configurados en vite.config.js).
● src/main.js: módulo principal del dashboard ZoFranca. Contiene el fallback de datos en memoria, el
cliente fetch contra json-server (http://localhost:3000), renderizadores por sección y un router por hash
(setView) que marca main[data-view] según la vista válida: inicio, nueva-solicitud, salidas, enviadas,
mis-enviadas, incumplimientos, auditorias, configuracion.
● Contrato de visibilidad: src/polish.css oculta por defecto toda sección hija directa de <main>
(main > section.panel, main > section.stats) y solo las muestra según main[data-view="..."]. Cualquier
sección nueva debe respetar este contrato o declarar su propia regla de visibilidad.
● Estilos: src/style.css (base minificada con tokens :root: --ink, --line, --coral, --navy, --green,
--amber; tipografías DM Sans / Manrope) + src/polish.css (layout de vistas, componentes de dashboard y
tema oscuro vía html.dark-mode). La carpeta css/ es una copia legacy usada por login/recuperar.
● Scripts auxiliares en js/ (api.js, counter.js, sesion.js, validaciones.js) para login y recuperación.
● Backend: npm run api levanta json-server sobre db.json (puerto 3000). npm run dev levanta Vite.

7.2 Integración "MedTech Precisión" (aditiva, zero-regression)
Se integró una landing informativa dentro del dashboard sin eliminar ni renombrar nada del código previo:
● index.html: cuatro secciones nuevas al final de <main>, IDs únicos medtech-*:
  - #medtech-productos: grid estático de tarjetas .mt-product-card (estructura idéntica entre nodos);
    incluye "Equipos electrónicos (Monitores y dispositivos de diagnóstico)".
  - #medtech-manufactura: contenedor vacío #medtech-metrics que JS puebla dinámicamente
    (Área de planta 18,000 m², Salas limpias ISO 7: 6, Capacidad productiva 4.2M/mes, Operación 24/7).
  - #medtech-sostenibilidad: lista #medtech-sustainability-list poblada por JS (gestión de residuos
    peligrosos, monitoreo de huella de carbono, manejo responsable de agua industrial).
  - #medtech-nosotros: textos estáticos (Desde 2011, 1,200 colaboradores, 28 países) y contacto
    comercial@medtechprecision.cr.
● src/medtech.js: módulo ES6 aislado (scope de módulo, sin globales). Inyección segura del DOM con
createElement/appendChild/textContent (sin innerHTML), datos en constantes locales y guardas de
idempotencia (dataset.mounted). Se carga desde index.html con su propia etiqueta <script type="module">.
● src/medtech.css: estilos exclusivamente prefijados mt-*, reutiliza los tokens existentes (--card, --line,
--coral...) y añade soporte html.dark-mode. Incluye la regla de visibilidad
main[data-view="inicio"] > .mt-landing-section { display: block } que integra las secciones a la vista inicio
sin tocar polish.css. Breakpoints propios en 980px y 650px.

7.3 Reglas para agentes que modifiquen este repo
● Zero-regression: no eliminar contenedores padre, no renombrar clases/IDs existentes ni alterar el flujo
Flexbox/Grid vigente; los cambios deben ser aditivos o quirúrgicos.
● Lógica JS nueva va en módulos propios (scope aislado); no contaminar window ni editar main.js salvo
necesidad justificada.
● Para inyectar contenido dinámico preferir createElement/appendChild/textContent sobre innerHTML.
● Verificar con npm run build antes de entregar (requiere node_modules completo: npm install).
● El router solo acepta las vistas listadas en 7.1; anclas nuevas fuera de esa lista redirigen a inicio.

7.4 Formularios asíncronos de instalación y cumplimiento
● index.html: dos secciones panel con formularios semánticos (form > fieldset > legend > label[for]):
  - #zf-instalacion (form #zf-installation-request-form): empresa, sector (tecnologia/manufactura/bpo),
    inversión proyectada, empleos proyectados e input file con metadatos (nombre/tamaño/tipo; json-server
    no acepta binarios). Visible en la vista nueva-solicitud.
  - #zf-cumplimiento (form #zf-compliance-report-form): empresa, período reportado (input month) y
    empleos reales, inversión ejecutada y exportaciones. Visible en la vista incumplimientos.
● src/formularios.js: módulo ES6 aislado con helper propio zfRequestJson (los helpers de main.js no están
  exportados). Un único registrador registrarFormulario({ selectorForm, selectorStatus, enviar,
  construirEnvio }) centraliza: preventDefault, reportValidity(), candado anti-doble-envío (WeakSet),
  estado de carga (botón deshabilitado + "Cargando..." + aria-busy), timeout de red de 10 s
  (AbortSignal.timeout), mensajes de error diferenciados (sin conexión / timeout / código HTTP) y limpieza
  automática del mensaje de éxito a los 6 s.
● Endpoints: POST /solicitudes (existente) y POST /reportesCumplimiento (colección vacía agregada a
  db.json; json-server v1 exige que el recurso exista).
● src/formularios.css: visibilidad por data-view, clases prefijadas zf-*, estados de éxito/error con icono
  y soporte html.dark-mode.

7.5 Motor de IA simulado (pre-clasificación y auditoría automática)
● src/ia.js: módulo ES6 puro (sin DOM ni fetch, testeable con Node). Motor heurístico local
  "heuristica-local-v1", sustituible a futuro por una API real sin tocar la interfaz:
  - evaluarSolicitud(solicitud): devuelve Promise con { puntajeAfinidad 0-100, clasificacion
    Recomendada/Revisar/Rechazada, criterios[] con puntos/máximo por métrica, justificación en lenguaje
    natural, motor, fechaEvaluacion }. Modelo: inversión 35 pts, empleos 35 pts, afinidad del sector 20 pts
    (manufactura 20 / tecnología 19 / BPO 17), respaldo documental 10 pts. Umbrales configurables en el
    objeto exportado UMBRALES_IA. Latencia simulada 600-1200 ms para ejercitar los estados asíncronos.
  - auditarReporteCumplimiento(reporte, compromiso): compara empleos reales e inversión ejecutada contra
    los compromisos de la solicitud original; tolerancia 90% (alerta Medio), crítico bajo 70% (alerta Alto).
    Devuelve { auditado, motivo, alertas[] } con el mismo esquema de la colección /incumplimientos.
● Integración (en src/formularios.js, hook procesarDespues tras el POST exitoso):
  - Solicitud de instalación: guarda → "Procesando con IA..." → veredicto pintado en #zf-inst-ia
    (badge por clasificación, justificación y criterios) y evaluación persistida en /evaluacionesIA
    (trazabilidad; fallo de persistencia no bloquea al usuario).
  - Reporte de cumplimiento: busca compromisos previos vía GET /solicitudes?empresa=... → auditoría →
    resultado en #zf-rep-auditoria; si hay desviaciones crea registros automáticamente en
    /incumplimientos (mismo esquema que consumen las alertas del dashboard).
● db.json: colección "evaluacionesIA": [] agregada para trazabilidad de decisiones del motor.

7.6 Rebrand "MedTech Precisión" (tema médico)
La plataforma se renombró de ZoFranca CR a MedTech Precisión con identidad clínica:
● Marca: brand-mark con ✚ en index/login/recuperar; <title> actualizados en las tres páginas;
  subtítulo del login "Tecnología médica de precisión · Costa Rica"; favicon.svg reemplazado por
  cruz médica blanca sobre cuadrado teal.
● Paleta clínica vía tokens (sin renombrar clases): --coral #ed775f → #0d9488 (teal clínico) y
  --navy #15283d → #0f333b en src/style.css; en modo oscuro --coral → #3fc1b0. Overrides aditivos al
  final de src/polish.css para los tonos fijos del sidebar (hover #1b4f57, bordes #275059, badges
  #2e616b). El resto de la UI hereda automáticamente por usar var(--coral)/var(--navy).
● Credenciales demo coherentes: correos @zofranca.cr → @medtechprecision.cr en db.json (usuarios 1,
  2, 4 y 5) y placeholders de login/recuperar. Contraseñas sin cambios. La clave de localStorage
  'zofranca-dark-mode' NO se renombró (compatibilidad de preferencias).
● Notas: css/style.css, css/polish.css y js/main.js son copias legado que ninguna página carga; se
  dejaron intactos. css/login.css ya usaba paleta clínica teal (--color-primary #00695c).
