# Prompt 20: Architecture - Definição da Arquitetura do Tema

## Objetivo
Definir a arquitetura do tema WordPress baseada na análise dos arquivos estáticos, escolhendo entre modo clássico (builder-friendly) ou block-native (FSE).

## Instruções para a IA

### 1. Escolha do Modo de Tema
Baseado no `ai_context.json` e análise prévia:

**Builder-friendly (Clássico)**:
- Use quando `mode: "builder-friendly"` no config
- Ideal para compatibilidade com Elementor/Visual Composer
- Estrutura tradicional com `functions.php` e templates PHP

**Block-native (FSE)**:
- Use quando `mode: "block-native"` no config
- Ideal para sites que usarão apenas Gutenberg
- Estrutura com `theme.json`, templates HTML e block patterns

### 2. Definição da Estrutura de Arquivos
Com base no modo escolhido, defina:

**Para Builder-friendly**:
```
/wp-content/themes/{{proj_slug}}/
├── style.css (cabeçalho do tema)
├── functions.php (bootstrap)
├── index.php
├── header.php
├── footer.php
├── page.php
├── single.php
├── archive.php
├── search.php
├── 404.php
├── page-elementor.php (template full-width)
├── inc/
│   ├── setup.php
│   ├── security.php
│   ├── enqueue.php
│   ├── menus.php
│   ├── images.php
│   ├── widgets.php
│   ├── cpt.php
│   ├── taxonomies.php
│   ├── shortcodes.php
│   └── blocks.php
├── assets/
│   ├── css/
│   ├── js/
│   ├── images/
│   └── fonts/
└── parts/
    ├── head-meta.php
    ├── header-nav.php
    └── footer-widgets.php
```

**Para Block-native**:
```
/wp-content/themes/{{proj_slug}}/
├── style.css
├── theme.json
├── index.html
├── templates/
│   ├── index.html
│   ├── front-page.html
│   ├── page.html
│   ├── single.html
│   ├── archive.html
│   └── 404.html
├── parts/
│   ├── header.html
│   ├── footer.html
│   └── navigation.html
├── patterns/
│   ├── hero-section.php
│   ├── features-grid.php
│   └── call-to-action.php
├── assets/
│   ├── css/
│   ├── js/
│   ├── images/
│   └── fonts/
└── functions.php (mínimo necessário)
```

### 3. Mapeamento de Templates
Defina qual template WordPress corresponde a cada página HTML:

- `index.html` → `front-page.php` ou `index.php`
- `about.html` → `page.php` ou template específico
- `contact.html` → `page.php` com campos customizados
- `blog.html` → `home.php` ou `index.php`
- `post.html` → `single.php`
- `products.html` → `archive-product.php` (se CPT)

### 4. Definição de CPTs e Taxonomias
Baseado nos componentes repetitivos detectados:

```yaml
custom_post_types:
  - name: "produto"
    slug: "{{proj_slug}}_product"
    supports: ["title", "editor", "thumbnail", "excerpt"]
    public: true
    show_in_rest: true
    
custom_taxonomies:
  - name: "categoria-produto"
    slug: "{{proj_slug}}_product_category"
    post_types: ["{{proj_slug}}_product"]
    hierarchical: true
```

### 5. Estratégia de Assets
Defina como os assets serão organizados:

- **CSS**: Consolidar em arquivos temáticos (vendor, main, responsive)
- **JS**: Separar por funcionalidade (main, vendor, page-specific)
- **Imagens**: Otimizar e organizar por contexto
- **Fontes**: Localizar Google Fonts quando possível

### 6. Compatibilidade com Plugins
Defina integrações necessárias:

- **Elementor**: Template full-width, desativação de estilos conflitantes
- **Meta Box/ACF**: Grupos de campos para páginas específicas
- **Yoast SEO**: Suporte a breadcrumbs, meta tags
- **WooCommerce**: Se detectado e-commerce

## Saída Esperada

Atualizar `mappings/mapping.yaml`:

```yaml
architecture:
  theme_mode: "builder-friendly" # ou "block-native"
  theme_structure: "classic" # ou "fse"
  
template_mapping:
  - html_file: "index.html"
    wp_template: "front-page.php"
    priority: "high"
  - html_file: "about.html"
    wp_template: "page.php"
    custom_fields: true

cpt_strategy:
  required: true
  post_types:
    - name: "{{proj_slug}}_product"
      from_component: "product-card"
      archive_template: "archive-product.php"
      single_template: "single-product.php"

assets_strategy:
  css_consolidation:
    - target: "vendor.css"
      sources: ["bootstrap.css", "normalize.css"]
    - target: "main.css"
      sources: ["style.css", "responsive.css"]
  js_consolidation:
    - target: "vendor.js"
      sources: ["jquery.min.js", "bootstrap.js"]
    - target: "main.js"
      sources: ["app.js", "custom.js"]

plugin_compatibility:
  elementor:
    enabled: true
    template: "page-elementor.php"
  meta_box:
    enabled: true
    field_groups: ["hero_fields", "page_options"]
```

## Próximo Passo
Prosseguir para `30-theme-skeleton.md` para criar estrutura base do tema.

## Validações
- [ ] Modo de tema definido (clássico vs. block-native)
- [ ] Estrutura de arquivos planejada
- [ ] Templates mapeados para páginas HTML
- [ ] CPTs e taxonomias definidos se necessário
- [ ] Estratégia de assets consolidada
- [ ] Compatibilidade com plugins planejada
- [ ] `mapping.yaml` atualizado com arquitetura