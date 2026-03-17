---
title: "Guía de redacción de documentos"
order: 7
section: "developer"
---

# Guía de redacción de documentos

Esta guía describe las mejores prácticas para redactar y mantener la documentación en todo el código base y los archivos complementarios.

---

## Documentación en el código (Docstrings)

Los docstrings son esenciales para comprender el propósito, el uso y el comportamiento de su código. Por favor, siga las siguientes convenciones:

### Reglas generales

- Documente **todas las clases, métodos y funciones públicas** utilizando docstrings.
- Utilice docstrings al **estilo Sphinx**.
- **No** incluya los tipos de parámetros en el docstring; se espera que se declaren en la firma de la función mediante `type hints`.

### Formato y directivas

Utilice las siguientes directivas para describir los diferentes elementos:

- `:param <nombre>:` — Describe un parámetro.
- `:return:` — Describe el valor de retorno.
- `:raises <excepción>:` — Describe las excepciones que la función podría lanzar.

#### Ejemplo

```python
def add(a: int, b: int) -> int:
    """
    Add two integers.

    :param a: The first integer.
    :param b: The second integer.
    :return: The sum of the two integers.
    :raises ValueError: If either input is not an integer.
    """
    if not isinstance(a, int) or not isinstance(b, int):
        raise ValueError("Inputs must be integers.")
    return a + b
```

---

## Documentación externa (directorio `docs/`)

Toda la documentación a nivel de proyecto se encuentra en el directorio `docs/`. Estos documentos sirven de apoyo tanto a usuarios como a desarrolladores, proporcionando guías, ejemplos y referencias.

### Formato

- Utilice **Markdown (`.md`)** o **Jupyter Notebooks (`.ipynb`)** para la documentación.
- Se prefiere Markdown para el contenido narrativo y la documentación estática.
- Utilice Jupyter Notebooks para contenido ejecutable e interactivo (por ejemplo, tutoriales o demostraciones).

### Directrices para Jupyter Notebooks

- Asegúrese de que todos los notebooks sean **completamente ejecutables**.
- Siempre **ejecute todas las celdas** y **guarde la salida** antes de realizar el `commit`.
- Nuestro entorno de CI/CD **no admite la ejecución en GPU**, por lo que los notebooks deben ejecutarse previamente de forma local.

### Directivas de Markdown y Notebooks

Utilice los siguientes patrones para un formato enriquecido:

- `[nombre](#ref)` — Referencia cruzada interna, por ejemplo, `[ModuleBase](#evox.core.module.ModuleBase)` o `[ModuleBase](#ModuleBase)`
- `![Texto alternativo](ruta)` — Incrustar imágenes, por ejemplo, `![Module base](/_static/modulebase.png)`

---

## Traducción

La documentación admite contenido multilingüe. Siga los pasos a continuación para actualizar o generar traducciones.

### Actualización de traducciones (por ejemplo, para `zh_CN`)

```bash
cd docs
make gettext
sphinx-intl update -p build/gettext -l zh_CN
cd ..
python docs/fix_output.py
```