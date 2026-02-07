---
title: "Guia de Escritura de Documentacion"
order: 7
section: "developer"
---

# Guia de Escritura de Documentacion

Esta guia describe las mejores practicas para escribir y mantener documentacion en el codigo fuente y archivos complementarios.

---

## Documentacion en el Codigo (Docstrings)

Los docstrings son esenciales para entender el proposito, uso y comportamiento de su codigo. Por favor, siga las siguientes convenciones:

### Reglas Generales

- Documente **todas las clases, metodos y funciones publicas** usando docstrings.
- Use docstrings de **estilo Sphinx**.
- **No** incluya tipos de parametros en el docstring; se espera que se declaren en la firma de la funcion usando anotaciones de tipo.

### Formato y Directivas

Use las siguientes directivas para describir diferentes elementos:

- `:param <name>:` -- Describir un parametro.
- `:return:` -- Describir el valor de retorno.
- `:raises <exception>:` -- Describir excepciones que la funcion podria lanzar.

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

## Documentacion Externa (Directorio `docs/`)

Toda la documentacion a nivel de proyecto se encuentra en el directorio `docs/`. Estos documentos apoyan tanto a usuarios como a desarrolladores proporcionando guias, ejemplos y referencias.

### Formato

- Use **Markdown (`.md`)** o **Jupyter Notebooks (`.ipynb`)** para la documentacion.
- Se prefiere Markdown para contenido narrativo y documentacion estatica.
- Use Jupyter Notebooks para contenido ejecutable e interactivo (por ejemplo, tutoriales o demos).

### Directrices para Jupyter Notebook

- Asegurese de que todos los notebooks sean **completamente ejecutables**.
- Siempre **ejecute todas las celdas** y **guarde la salida** antes de hacer commit.
- Nuestro entorno CI/CD **no soporta ejecucion con GPU**, por lo que los notebooks deben ser pre-ejecutados localmente.

### Directivas de Markdown y Notebook

Use los siguientes patrones para formato enriquecido:

- `[name](#ref)` -- Referencia cruzada interna, por ejemplo, `[ModuleBase](#evox.core.module.ModuleBase)` o `[ModuleBase](#ModuleBase)`
- `![Alt Text](path)` -- Incrustar imagenes, por ejemplo, `![Module base](/_static/modulebase.png)`

---

## Traduccion

La documentacion soporta contenido multilingue. Siga los pasos a continuacion para actualizar o generar traducciones.

### Actualizar Traducciones (por ejemplo, para `zh_CN`)

```bash
cd docs
make gettext
sphinx-intl update -p build/gettext -l zh_CN
cd ..
python docs/fix_output.py
```
