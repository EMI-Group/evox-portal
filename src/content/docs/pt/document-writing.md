---
title: "Guia de Escrita de Documentação"
order: 7
section: "developer"
---

# Guia de Escrita de Documentação

Este guia descreve as melhores práticas para escrever e manter documentação em todo o código-fonte e ficheiros suplementares.

---

## Documentação no Código (Docstrings)

As docstrings são essenciais para compreender o propósito, utilização e comportamento do seu código. Por favor, siga as seguintes convenções:

### Regras Gerais

- Documente **todas as classes, métodos e funções públicas** utilizando docstrings.
- Utilize docstrings ao **estilo Sphinx**.
- **Não** inclua tipos de parâmetros na docstring — espera-se que sejam declarados na assinatura da função utilizando type hints.

### Formato e Diretivas

Utilize as seguintes diretivas para descrever diferentes elementos:

- `:param <name>:` — Descrever um parâmetro.
- `:return:` — Descrever o valor de retorno.
- `:raises <exception>:` — Descrever exceções que a função pode lançar.

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

- Utilize **Markdown (`.md`)** ou **Jupyter Notebooks (`.ipynb`)** para documentação.
- Markdown é preferido para conteúdo narrativo e documentação estática.
- Utilize Jupyter Notebooks para conteúdo executável e interativo (por exemplo, tutoriais ou demonstrações).

### Diretrizes para Jupyter Notebooks

- Certifique-se de que todos os notebooks são **totalmente executáveis**.
- Execute sempre **todas as células** e **guarde a saída** antes de fazer commit.
- O nosso ambiente de CI/CD **não suporta execução em GPU**, portanto os notebooks devem ser pré-executados localmente.

### Diretivas de Markdown e Notebooks

Utilize os seguintes padrões para formatação rica:

- `[name](#ref)` — Referência cruzada interna, por exemplo, `[ModuleBase](#evox.core.module.ModuleBase)` ou `[ModuleBase](#ModuleBase)`
- `![Alt Text](path)` — Incorporar imagens, por exemplo, `![Module base](/_static/modulebase.png)`

---

## Tradução

A documentação suporta conteúdo multilingue. Siga os passos abaixo para atualizar ou gerar traduções.

### Atualizar Traduções (por exemplo, para `zh_CN`)

```bash
cd docs
make gettext
sphinx-intl update -p build/gettext -l zh_CN
cd ..
python docs/fix_output.py
```
