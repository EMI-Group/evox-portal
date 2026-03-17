---
title: "Guia de Escrita de Documentação"
order: 7
section: "developer"
---

# Guia de Escrita de Documentação

Este guia descreve as melhores práticas para escrever e manter a documentação em toda a base de código e ficheiros suplementares.

---

## Documentação no Código (Docstrings)

As docstrings são essenciais para compreender o propósito, a utilização e o comportamento do seu código. Por favor, siga as seguintes convenções:

### Regras Gerais

- Documente **todas as classes, métodos e funções públicas** utilizando docstrings.
- Utilize docstrings no **estilo Sphinx**.
- **Não** inclua tipos de parâmetros na docstring — espera-se que estes sejam declarados na assinatura da função utilizando type hints.

### Formato e Diretivas

Utilize as seguintes diretivas para descrever diferentes elementos:

- `:param <name>:` — Descreve um parâmetro.
- `:return:` — Descreve o valor de retorno.
- `:raises <exception>:` — Descreve as exceções que a função pode lançar.

#### Exemplo

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

## Documentação Externa (Diretório `docs/`)

Toda a documentação ao nível do projeto está localizada no diretório `docs/`. Estes documentos apoiam tanto utilizadores como programadores, fornecendo guias, exemplos e referências.

### Formato

- Utilize **Markdown (`.md`)** ou **Jupyter Notebooks (`.ipynb`)** para a documentação.
- O Markdown é preferível para conteúdo narrativo e documentação estática.
- Utilize Jupyter Notebooks para conteúdo executável e interativo (ex: tutoriais ou demonstrações).

### Diretrizes para Jupyter Notebooks

- Certifique-se de que todos os notebooks são **totalmente executáveis**.
- **Execute sempre todas as células** e **guarde o output** antes de submeter (commit).
- O nosso ambiente de CI/CD **não suporta execução em GPU**, pelo que os notebooks devem ser pré-executados localmente.

### Diretivas de Markdown e Notebook

Utilize os seguintes padrões para formatação avançada:

- `[name](#ref)` — Referência cruzada interna, ex: `[ModuleBase](#evox.core.module.ModuleBase)` ou `[ModuleBase](#ModuleBase)`
- `![Alt Text](path)` — Incorporar imagens, ex: `![Module base](/_static/modulebase.png)`

---

## Tradução

A documentação suporta conteúdo multilingue. Siga os passos abaixo para atualizar ou gerar traduções.

### Atualizar Traduções (ex: para `zh_CN`)

```bash
cd docs
make gettext
sphinx-intl update -p build/gettext -l zh_CN
cd ..
python docs/fix_output.py
```