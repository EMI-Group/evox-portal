---
title: "Genesis conecta la configuración de cuentas, los modelos y el inicio de sesión con ChatGPT"
pubDate: 2026-11-22
updatedDate: 2026-11-25
summary: "Un asistente renovado reúne credenciales, inventarios de modelos, razonamiento y horarios, con una conexión de suscripción ChatGPT gestionada por Genesis."
---

Una conexión de modelo necesita más que un nombre: autenticación, endpoint, razonamiento admitido y límites compartidos deben encajar. Los cambios integrados en Genesis `main` el 19 y 20 de noviembre de 2026 reconstruyen Welcome y Settings alrededor de cuentas de proveedor. La PR #175 añade **Sign in with ChatGPT**, que sustituye la antigua importación de credenciales de Codex para perfiles de suscripción ChatGPT. [Integración][pr]

![Una llave de cuenta y los ajustes del modelo elegido encajan en un estuche de instrumentos](./cover.webp)

*Ilustración conceptual: la autenticación y los modelos pertenecen a una misma cuenta configurada.*

## Configurar la cuenta y después sus modelos

Welcome utiliza ahora un asistente de proveedor por pasos; Settings permite administrar las cuentas posteriormente. Los nombres e identificadores generados proceden del proveedor, no del modelo elegido. Una cuenta puede contener varios modelos y niveles de razonamiento que comparten credenciales, concurrencia y horarios. Conviene crear cuentas separadas cuando esas propiedades difieren. [Contrato de perfiles][profiles]

Por ejemplo, un equipo con un endpoint compatible con OpenAI puede configurar una vez la URL base y la credencial, añadir los modelos realmente disponibles y elegir modelo y razonamiento para cada tarea. La integración permite introducir claves API en endpoints personalizados y dirige sus cuentas de modelos mediante OpenAI Chat Completions. Cada modelo seleccionable debe figurar en el inventario; indicar únicamente el modelo predeterminado no lo registra. Pruebe el modelo elegido, no solo si se ha rellenado la credencial. [Integración y pruebas de navegador][pr]

El asistente separa los niveles anunciados de razonamiento de su valor predeterminado. El valor elegido llega a la entrada guardada del modelo y a la solicitud de prueba. La escala canónica es `none`, `minimal`, `low`, `medium`, `high`, `xhigh`; el antiguo `max` se lee como `xhigh` y se guarda así posteriormente. Las variantes de nombres del proveedor se adaptan al construir la solicitud. La compatibilidad depende del modelo real: mostrar la escala no significa que todos los endpoints acepten todos los niveles. [Reglas de razonamiento][profiles]

## Autorizar ChatGPT desde Genesis

Seleccione **ChatGPT Subscription** en Welcome o **Settings → LLM → Provider accounts**. La guía versionada ofrece `genesis chatgpt login`, `genesis chatgpt status` y `genesis chatgpt models` para iniciar sesión e inspeccionarla. Desde el código fuente, la entrada es `mix genesis.chatgpt login`. Abra la URL mostrada en el navegador y autorice a Genesis. [Guía de suscripción][oauth]

Después, utilice **Check connection**, seleccione el registro y un modelo disponible para esa cuenta. En Settings guarde la cuenta antes de **Connection Test**; Welcome prueba el modelo antes de finalizar. El perfil conserva `provider = "openai_codex"` por compatibilidad, usa `auth_mode = "oauth"` y emplea `siwc_account` para identificar el registro de Genesis.

Los perfiles de suscripción existentes requieren una nueva autorización mediante Genesis: esta conexión no usa las antiguas credenciales importadas de Codex. Si el modelo anterior no aparece en el inventario descubierto, elija uno disponible. Las cuentas OpenAI con clave API siguen siendo una opción separada. Para varios registros, utilice un alias explícito como `genesis chatgpt login --account work` y selecciónelo en el perfil. [Migración y alias][oauth]

## Mantener la conexión en el equipo de ejecución

Las credenciales de la cuenta elegida se resuelven y renuevan en el nodo de ejecución. Las actualizaciones se serializan entre la CLI de acceso y el servidor activo. Así se evita confundir un registro visible en el navegador con una conexión en otro equipo remoto. [Almacenamiento de cuentas][store]

Para instalaciones autogestionadas, la guía explica cómo reenviar por SSH el puerto de acceso local y ejecutar el inicio de sesión con la misma cuenta y directorio de configuración del servicio Genesis. También documenta una transferencia protegida de credenciales y `GENESIS_SIWC_HTTPS_PROXY` para equipos que necesitan proxy HTTP CONNECT. Complete los pasos específicos del equipo antes de probar inferencia: iniciar sesión en un portátil no configura otro servidor.

Las comprobaciones de renovación y streaming ChatGPT de la PR utilizaron fixtures; en esa revisión quedaba por verificar una autorización nueva con una cuenta ChatGPT real. Confirme su instalación mediante una respuesta efectiva del modelo en el equipo previsto. [Alcance de la verificación][pr]

## Explicitar los horarios de la cuenta

La cuenta también contiene concurrencia en horas punta y valle, zona horaria y política de programación. Los nuevos preajustes rellenan horarios compatibles, pero los números de slots son valores Genesis editables, no garantías de capacidad del proveedor ni de ahorro. Todos los modelos de una cuenta comparten slots; añadir un modelo no crea otra bolsa de cuota. [Implementación de preajustes][presets]

`off_peak_holidays = "CN"` incorpora el calendario chino incluido, con los días laborables compensatorios. Es un calendario estático para 2025–2027 y no se actualiza solo. Revise zona horaria, fines de semana y supuestos del preajuste. Una concurrencia punta de cero pone nuevas solicitudes en cola; reducir capacidad no expulsa trabajo ya iniciado. [Semántica de horarios][profiles]

Tras pasar a una compilación con estos cambios, revise inventario, razonamiento predeterminado y equipo de ejecución de cada cuenta. Reautorice el perfil ChatGPT y ejecute su prueba de conexión. En cuentas programadas, inspeccione el horario guardado y la próxima transición prevista. Así comprueba las identidades y límites que usarán realmente las tareas futuras.

## Actualizar los modelos después de guardar

Las actualizaciones de `main` del 23 de noviembre de 2026 vinculan el guardado de registros de ChatGPT con la actualización de la configuración. En el mismo nodo de ejecución, un cambio recarga el selector de modelos del proyecto; cerrar los ajustes del entorno de trabajo también solicita una recarga. Los resultados descartados ahora producen un error que permite reintentar, en lugar de una carga indefinida. Espere a que la conexión remota esté lista antes de reintentarlo. [GitHub](https://github.com/EMI-Group/genesis/commit/ffb0926723a4f2b695b1562a27954041be0cabd6)

Una cuenta incompleta ya no provoca un ciclo de fallos del planificador. Este registra que no puede resolver el modelo predeterminado; complete el inventario de la cuenta y seleccione un modelo válido antes de utilizar ese valor predeterminado. [GitHub](https://github.com/EMI-Group/genesis/commit/868842557371daff7bcf68ce5ad59199b897d807)

[pr]: https://github.com/EMI-Group/genesis/pull/175
[profiles]: https://github.com/EMI-Group/genesis/blob/975b9ba32be5f6772b456ea3c92bfa3b4ae22cb9/docs/llm-profiles.md
[oauth]: https://github.com/EMI-Group/genesis/blob/975b9ba32be5f6772b456ea3c92bfa3b4ae22cb9/docs/llm-oauth.md
[store]: https://github.com/EMI-Group/genesis/blob/975b9ba32be5f6772b456ea3c92bfa3b4ae22cb9/apps/evo_git/lib/evo_git/auth/chatgpt/store.ex
[presets]: https://github.com/EMI-Group/genesis/blob/975b9ba32be5f6772b456ea3c92bfa3b4ae22cb9/apps/evo_git/lib/evo_git/config/provider_presets.ex
