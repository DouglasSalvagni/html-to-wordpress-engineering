# Prompt 00: Bootstrap - Inicialização do Projeto

## Objetivo
Inicializar o processo de conversão de site estático para tema WordPress, configurando variáveis do projeto e validando estrutura de entrada.

## Instruções para a IA

### 1. Leitura de Configuração
- Leia o arquivo `ai_context.json` na pasta raiz
- Extraia as variáveis do projeto: `{{proj_name}}`, `{{proj_slug}}`, `{{author}}`, etc.
- Valide se o modo está definido ("builder-friendly" ou "block-native")

### 2. Validação da Estrutura de Entrada
- Verifique se existe a pasta `/input_static/` no projeto
- Liste todos os arquivos HTML, CSS, JS, imagens e fontes
- Identifique o arquivo HTML principal (geralmente `index.html`)
- Detecte se há múltiplas páginas HTML

### 3. Preparação do Ambiente
- Crie a pasta de saída `/wp-content/themes/{{proj_slug}}/` se não existir
- Prepare estrutura de logs para rastreamento do processo
- Inicialize o arquivo `mappings/mapping.yaml` com metadados básicos

### 4. Análise Inicial
- Identifique tecnologias utilizadas (frameworks CSS, bibliotecas JS)
- Detecte dependências externas (CDNs, Google Fonts, etc.)
- Analise a estrutura de navegação e menus
- Identifique formulários e elementos interativos

### 5. Definição de Estratégia
Com base na análise, defina:
- Quais assets precisam ser localizados
- Quais seções podem ser convertidas em templates
- Se há necessidade de CPTs/Taxonomias
- Complexidade estimada do projeto

## Saída Esperada

```yaml
# mappings/mapping.yaml (inicial)
project:
  name: "{{proj_name}}"
  slug: "{{proj_slug}}"
  mode: "{{mode}}"
  created_at: "{{timestamp}}"

input_analysis:
  html_files: []
  css_files: []
  js_files: []
  image_files: []
  font_files: []
  external_dependencies: []

strategy:
  complexity: "low|medium|high"
  estimated_templates: []
  requires_cpts: false
  requires_custom_fields: false
```

## Próximo Passo
Após completar este bootstrap, prossiga para `10-ingest-static.md`.

## Validações
- [ ] `ai_context.json` lido com sucesso
- [ ] Pasta `/input_static/` existe e contém arquivos
- [ ] Variáveis do projeto definidas
- [ ] Estrutura de saída preparada
- [ ] Análise inicial documentada em `mapping.yaml`