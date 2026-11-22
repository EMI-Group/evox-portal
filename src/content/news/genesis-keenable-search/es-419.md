---
title: "Genesis añade una vía opcional de búsqueda sin clave API"
pubDate: 2026-11-22
summary: "El adaptador Keenable permite activar la búsqueda pública y conserva tanto el acceso con clave como el proveedor predeterminado."
---

Una tarea de investigación de un Agent puede detenerse antes de la primera consulta si la búsqueda exige otra credencial. La PR #174 de Genesis, integrada en `main` el 19 de noviembre de 2026, añade **Keenable** como proveedor opcional con un endpoint público que funciona sin clave API configurada. Las instalaciones existentes mantienen su comportamiento predeterminado. [Adaptador integrado][pr]

![Una entrada abierta de biblioteca conduce a documentos con referencias](./cover.webp)

*Ilustración conceptual: una vía pública opcional hacia la investigación web.*

## Activar explícitamente la vía pública

En `[tools.search]`, establezca `enabled = true` y `provider = "keenable"`. Sin clave, el adaptador envía consulta y límite de resultados al endpoint público, incluye `X-Keenable-Title: Genesis` y omite `X-API-Key`. Añadir `KEENABLE_API_KEY` al almacén de credenciales selecciona el acceso con clave. [Construcción de solicitudes][adapter]

La implementación cambia los dos controles necesarios: el proveedor seleccionado capaz de funcionar sin clave puede activar la herramienta de búsqueda del Agent, y la ejecución ya no lo rechaza solo por carecer de clave. Los proveedores que necesitan credenciales conservan sus comprobaciones.

## Leer los resultados con sus límites

Para recopilar referencias documentales, esto elimina un paso de configuración. El adaptador convierte títulos, URL y `snippet` al formato existente de resultados. Respeta `max_results`; Keenable no tiene equivalente de `search_depth`, por lo que ignora esa opción. [Mapeo de respuestas][adapter]

La vía pública limita solicitudes por IP. La PR registra pruebas de construcción, análisis y activación de herramientas, incluida una ejecución simulada, pero no llamadas reales a la API Keenable. Tras activarla, pruebe una consulta pequeña desde el equipo de ejecución e inspeccione enlaces y posibles errores antes de depender de ella en una investigación mayor. [Comprobaciones registradas][pr]

[pr]: https://github.com/EMI-Group/genesis/pull/174
[adapter]: https://github.com/EMI-Group/genesis/blob/975b9ba32be5f6772b456ea3c92bfa3b4ae22cb9/apps/evo_git/lib/evo_git/agent/tools/web_search_providers.ex
