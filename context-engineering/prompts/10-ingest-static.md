# Prompt 10: Ingest Static - Análise Profunda dos Arquivos Estáticos

## Objetivo
Analisar em detalhes todos os arquivos estáticos, identificar padrões, componentes reutilizáveis e estrutura de layout para mapeamento WordPress.

## Instruções para a IA

### 1. Análise de Layout Master
- Identifique elementos comuns entre páginas HTML:
  - `<head>` e meta tags
  - Header/cabeçalho
  - Navegação principal
  - Footer/rodapé
  - Sidebars/barras laterais
- Extraia a estrutura base que será `header.php`, `footer.php`

### 2. Segmentação de Conteúdo
Para cada arquivo HTML:
- Classifique o tipo de página (home, sobre, contato, blog, produto, etc.)
- Identifique seções únicas vs. reutilizáveis
- Detecte loops/repetições que podem virar CPTs
- Mapeie formulários e suas funcionalidades

### 3. Inventário de Assets
- **CSS**: Analise dependências, media queries, frameworks utilizados
- **JavaScript**: Identifique bibliotecas, dependências, scripts inline
- **Imagens**: Catalogue por tipo, tamanho, uso (decorativa vs. conteúdo)
- **Fontes**: Identifique fontes locais vs. externas (Google Fonts)

### 4. Análise de Navegação
- Extraia estrutura de menus
- Identifique links internos vs. externos
- Detecte breadcrumbs se existirem
- Mapeie âncoras e navegação interna

### 5. Detecção de Componentes
Identifique padrões reutilizáveis:
- Cards/cartões
- Botões e CTAs
- Formulários
- Galerias de imagens
- Sliders/carrosséis
- Modais/popups

### 6. Análise de Responsividade
- Verifique breakpoints utilizados
- Identifique padrões mobile-first vs. desktop-first
- Analise uso de flexbox, grid, etc.

## Saída Esperada

Atualizar `mappings/mapping.yaml`:

```yaml
layout_analysis:
  common_elements:
    head_meta: "path/to/extracted/head.html"
    header: "path/to/extracted/header.html"
    navigation: "path/to/extracted/nav.html"
    footer: "path/to/extracted/footer.html"
  
page_classification:
  - file: "index.html"
    type: "home"
    template_suggestion: "front-page.php"
    unique_sections: ["hero", "features", "testimonials"]
  - file: "about.html"
    type: "page"
    template_suggestion: "page.php"
    unique_sections: ["team", "history"]

assets_inventory:
  css:
    - file: "style.css"
      size: "45kb"
      dependencies: ["normalize.css"]
      frameworks: ["bootstrap"]
  js:
    - file: "main.js"
      size: "12kb"
      dependencies: ["jquery"]
      external_libs: ["swiper"]
  images:
    - file: "hero-bg.jpg"
      size: "250kb"
      usage: "background"
      optimization_needed: true
  fonts:
    - family: "Roboto"
      source: "google-fonts"
      weights: [300, 400, 700]

components_detected:
  - name: "product-card"
    occurrences: 12
    suggests_cpt: true
  - name: "contact-form"
    occurrences: 1
    suggests_plugin: "contact-form-7"

responsive_analysis:
  breakpoints: ["768px", "1024px", "1200px"]
  approach: "mobile-first"
  css_framework: "custom"
```

## Próximo Passo
Prosseguir para `20-architecture.md` para definir arquitetura do tema.

## Validações
- [ ] Todos os arquivos HTML analisados
- [ ] Layout master identificado e extraído
- [ ] Assets catalogados com dependências
- [ ] Componentes reutilizáveis detectados
- [ ] Estrutura de navegação mapeada
- [ ] `mapping.yaml` atualizado com análise completa