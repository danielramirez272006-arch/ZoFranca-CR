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
