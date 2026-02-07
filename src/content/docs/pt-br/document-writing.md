---
title: "Guia de Escrita de Documentação"
order: 7
section: "developer"
---

# Guia de Escrita de Documentação

Este guia descreve as melhores práticas para escrever e manter documentação em todo o código-fonte e arquivos suplementares.

---

## Documentação no Código (Docstrings)

Docstrings são essenciais para entender o propósito, uso e comportamento do seu código. Por favor, siga as seguintes convenções:

### Regras Gerais

- Documente **todas as classes, métodos e funções públicas** usando docstrings.
- Use docstrings no **estilo Sphinx**.
- **Não** inclua tipos de parâmetros na docstring — espera-se que sejam declarados na assinatura da função usando type hints.

### Formato e Diretivas

Use as seguintes diretivas para descrever diferentes elementos:

- `:param <name>:` — Descreva um parâmetro.
- `:return:` — Descreva o valor de retorno.
- `:raises <exception>:` — Descreva exceções que a função pode lançar.

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

Toda a documentação em nível de projeto está localizada no diretório `docs/`. Esses documentos apoiam tanto usuários quanto desenvolvedores, fornecendo guias, exemplos e referências.

### Formato

- Use **Markdown (`.md`)** ou **Jupyter Notebooks (`.ipynb`)** para documentação.
- Markdown é preferido para conteúdo narrativo e documentação estática.
- Use Jupyter Notebooks para conteúdo executável e interativo (por exemplo, tutoriais ou demonstrações).

### Diretrizes para Jupyter Notebook

- Certifique-se de que todos os notebooks sejam **totalmente executáveis**.
- Sempre **execute todas as células** e **salve a saída** antes de fazer commit.
- Nosso ambiente de CI/CD **não suporta execução com GPU**, então os notebooks devem ser pré-executados localmente.

### Diretivas de Markdown e Notebook

Use os seguintes padrões para formatação rica:

- `[name](#ref)` — Referência cruzada interna, por exemplo, `[ModuleBase](#evox.core.module.ModuleBase)` ou `[ModuleBase](#ModuleBase)`
- `![Alt Text](path)` — Incorporar imagens, por exemplo, `![Module base](/_static/modulebase.png)`

---

## Tradução

A documentação suporta conteúdo multilíngue. Siga os passos abaixo para atualizar ou gerar traduções.

### Atualizando Traduções (por exemplo, para `zh_CN`)

```bash
cd docs
make gettext
sphinx-intl update -p build/gettext -l zh_CN
cd ..
python docs/fix_output.py
```
