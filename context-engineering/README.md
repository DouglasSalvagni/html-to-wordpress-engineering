# Engenharia de Contexto para Conversão HTML/CSS/JS → WordPress

## Visão Geral

Esta pasta contém toda a "engenharia de contexto" necessária para orientar uma IA a transformar sites estáticos (HTML/CSS/JS) em temas WordPress padronizados, performáticos e acessíveis.

## Estrutura

- **`ai_context.json`**: Configurações principais do projeto e contratos de saída
- **`prompts/`**: Prompts sequenciais para guiar a IA em cada etapa
- **`standards/`**: Padrões de código, nomenclatura e convenções
- **`templates/`**: Esqueletos de tema (clássico e block-native)
- **`mappings/`**: Exemplos de mapeamento HTML→WordPress
- **`scripts/`**: Scripts de automação e validação
- **`qa/`**: Checklists de qualidade e configurações de CI
- **`ci/`**: Configurações para análise estática de código

## Como Usar

1. Coloque o site estático em `/input_static/`
2. Configure `ai_context.json` com dados do projeto
3. Execute o prompt bootstrap (`prompts/00-bootstrap.md`)
4. A IA seguirá os prompts sequenciais automaticamente
5. Revise os checklists e ajuste conforme necessário

## Modos de Geração

- **Builder-friendly**: Tema clássico compatível com Elementor
- **Block-native**: Tema FSE com theme.json e block patterns

## Saída Esperada

- Tema WordPress completo em `/wp-content/themes/{{proj_slug}}/`
- Relatórios de mapeamento (`mapping.yaml`, `fields.yaml`)
- Checklists de QA preenchidos
- Documentação de acessibilidade e performance