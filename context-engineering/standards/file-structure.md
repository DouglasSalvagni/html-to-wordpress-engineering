# Padrões de Estrutura de Arquivos

## Objetivo
Definir a organização padrão de arquivos e pastas para temas WordPress gerados pelo sistema.

## Estrutura Base do Tema

```
{{theme_name}}/
├── style.css                 # Arquivo principal do tema
├── index.php                 # Template principal
├── functions.php             # Configurações e includes
├── screenshot.png            # Screenshot do tema (1200x900px)
├── README.md                 # Documentação do tema
├── CHANGELOG.md              # Histórico de versões
├── LICENSE                   # Licença do tema
│
├── assets/                   # Assets estáticos
│   ├── css/
│   │   ├── main.css         # CSS principal compilado
│   │   ├── admin.css        # Estilos do admin
│   │   └── editor.css       # Estilos do editor
│   ├── js/
│   │   ├── main.js          # JavaScript principal
│   │   ├── admin.js         # Scripts do admin
│   │   └── customizer.js    # Scripts do customizer
│   ├── images/
│   │   ├── logo.svg         # Logo padrão
│   │   ├── favicon.ico      # Favicon
│   │   └── placeholder.svg  # Imagem placeholder
│   └── fonts/               # Fontes customizadas
│
├── inc/                      # Funcionalidades PHP
│   ├── setup.php            # Configuração do tema
│   ├── enqueue.php          # Enfileiramento de assets
│   ├── customizer.php       # Customizer do WordPress
│   ├── widgets.php          # Widgets customizados
│   ├── menus.php            # Configuração de menus
│   ├── cpt.php              # Custom Post Types
│   ├── taxonomies.php       # Taxonomias customizadas
│   ├── metabox.php          # Meta boxes
│   ├── fields-helpers.php   # Funções helper para campos
│   ├── elementor.php        # Integração com Elementor
│   ├── performance.php      # Otimizações de performance
│   └── security.php         # Configurações de segurança
│
├── template-parts/           # Partes de templates
│   ├── header/
│   │   ├── site-branding.php
│   │   └── site-navigation.php
│   ├── content/
│   │   ├── content-post.php
│   │   ├── content-page.php
│   │   ├── content-search.php
│   │   └── content-none.php
│   ├── footer/
│   │   ├── site-info.php
│   │   └── footer-widgets.php
│   └── navigation/
│       ├── pagination.php
│       └── post-navigation.php
│
├── templates/                # Templates principais
│   ├── archive.php
│   ├── single.php
│   ├── page.php
│   ├── home.php
│   ├── front-page.php
│   ├── search.php
│   ├── 404.php
│   └── custom/               # Templates customizados
│       ├── page-landing.php
│       └── single-portfolio.php
│
├── elementor/                # Integração Elementor
│   ├── widgets/
│   │   ├── custom-widget-1.php
│   │   └── custom-widget-2.php
│   ├── templates/
│   │   ├── header.php
│   │   ├── footer.php
│   │   └── single.php
│   └── theme-builder/
│       ├── conditions.php
│       └── locations.php
│
├── languages/                # Arquivos de tradução
│   ├── {{text_domain}}.pot
│   ├── pt_BR.po
│   └── pt_BR.mo
│
├── docs/                     # Documentação
│   ├── installation.md
│   ├── customization.md
│   ├── hooks-filters.md
│   └── troubleshooting.md
│
└── tests/                    # Testes (opcional)
    ├── phpunit.xml
    ├── bootstrap.php
    └── test-theme-setup.php
```

## Estrutura para Tema Block (FSE)

```
{{theme_name}}/
├── style.css
├── index.php
├── functions.php
├── theme.json               # Configurações FSE
├── screenshot.png
│
├── assets/                  # Mesmo que tema clássico
├── inc/                     # Funcionalidades reduzidas
├── languages/
│
├── parts/                   # Template parts FSE
│   ├── header.html
│   ├── footer.html
│   ├── navigation.html
│   └── post-meta.html
│
├── patterns/                # Block patterns
│   ├── hero-section.php
│   ├── call-to-action.php
│   └── testimonials.php
│
└── templates/               # Templates FSE
    ├── index.html
    ├── single.html
    ├── page.html
    ├── archive.html
    ├── search.html
    ├── 404.html
    └── front-page.html
```

## Convenções de Nomenclatura

### Arquivos PHP
- **Templates principais**: Nome padrão do WordPress
  - `index.php`, `single.php`, `page.php`, `archive.php`
- **Template parts**: Prefixo descritivo + função
  - `content-post.php`, `navigation-main.php`
- **Includes**: Nome da funcionalidade
  - `setup.php`, `customizer.php`, `enqueue.php`
- **Custom templates**: Prefixo + tipo + nome
  - `page-landing.php`, `single-portfolio.php`

### Arquivos CSS
- **Principal**: `style.css` (obrigatório)
- **Compilados**: `main.css`, `admin.css`
- **Componentes**: `components.css`, `utilities.css`
- **Responsivo**: `responsive.css`

### Arquivos JavaScript
- **Principal**: `main.js`
- **Específicos**: `customizer.js`, `admin.js`
- **Componentes**: `navigation.js`, `slider.js`

### Imagens
- **Logo**: `logo.svg` (preferir SVG)
- **Favicon**: `favicon.ico`
- **Screenshot**: `screenshot.png` (1200x900px)
- **Placeholders**: `placeholder-{size}.{ext}`

## Organização por Funcionalidade

### Custom Post Types
```
inc/
├── cpt.php                  # Registro de CPTs
├── taxonomies.php           # Taxonomias relacionadas
└── cpt-helpers.php          # Funções helper para CPTs

templates/
├── archive-portfolio.php    # Archive do CPT
├── single-portfolio.php     # Single do CPT
└── taxonomy-skill.php       # Taxonomy template
```

### Elementor Integration
```
elementor/
├── widgets/
│   ├── base-widget.php      # Classe base
│   ├── hero-widget.php      # Widget específico
│   └── testimonial-widget.php
├── controls/
│   ├── custom-control.php   # Controles customizados
│   └── icon-picker.php
└── extensions/
    ├── custom-css.php       # CSS customizado
    └── motion-effects.php   # Efeitos de movimento
```

### Performance Optimization
```
inc/
├── performance.php          # Otimizações gerais
├── cache.php               # Sistema de cache
├── minification.php        # Minificação de assets
└── lazy-loading.php        # Lazy loading de imagens

assets/
├── critical.css            # Critical CSS
├── deferred.js             # JavaScript diferido
└── optimized/              # Assets otimizados
```

## Padrões de Comentários

### Cabeçalho de Arquivos
```php
<?php
/**
 * {{Descrição do arquivo}}
 *
 * @package {{Theme_Name}}
 * @subpackage {{Subpackage}}
 * @since {{Version}}
 * @author {{Author}}
 */

// Prevent direct access
if (!defined('ABSPATH')) {
    exit;
}
```

### Seções de Código
```php
/**
 * ============================================================================
 * THEME SETUP
 * ============================================================================
 */

/**
 * Theme setup function
 * Configures theme support and features
 */
function {{theme_slug}}_setup() {
    // Code here
}
```

## Estrutura de Assets

### CSS Organization
```
assets/css/
├── src/                     # Arquivos fonte (SCSS/LESS)
│   ├── base/
│   │   ├── _reset.scss
│   │   ├── _typography.scss
│   │   └── _variables.scss
│   ├── components/
│   │   ├── _buttons.scss
│   │   ├── _forms.scss
│   │   └── _navigation.scss
│   ├── layout/
│   │   ├── _header.scss
│   │   ├── _footer.scss
│   │   └── _grid.scss
│   └── main.scss           # Arquivo principal
├── main.css                # CSS compilado
├── main.min.css            # CSS minificado
└── admin.css               # Estilos do admin
```

### JavaScript Organization
```
assets/js/
├── src/                    # Arquivos fonte
│   ├── modules/
│   │   ├── navigation.js
│   │   ├── slider.js
│   │   └── forms.js
│   ├── utils/
│   │   ├── helpers.js
│   │   └── polyfills.js
│   └── main.js            # Arquivo principal
├── main.min.js            # JavaScript minificado
└── vendor/                # Bibliotecas terceiras
    ├── jquery.min.js
    └── swiper.min.js
```

## Configuração de Build

### Package.json (se usar build tools)
```json
{
  "name": "{{theme-slug}}",
  "version": "1.0.0",
  "scripts": {
    "build": "npm run build:css && npm run build:js",
    "build:css": "sass assets/css/src/main.scss assets/css/main.css",
    "build:js": "webpack --mode=production",
    "watch": "npm run watch:css & npm run watch:js",
    "watch:css": "sass --watch assets/css/src/main.scss assets/css/main.css",
    "watch:js": "webpack --mode=development --watch"
  }
}
```

## Validação de Estrutura

### Arquivos Obrigatórios
- [ ] `style.css` com header correto
- [ ] `index.php` funcional
- [ ] `functions.php` com configurações básicas
- [ ] `screenshot.png` (1200x900px)

### Arquivos Recomendados
- [ ] `README.md` com instruções
- [ ] `404.php` para páginas não encontradas
- [ ] `search.php` para resultados de busca
- [ ] `archive.php` para listagens
- [ ] `single.php` para posts individuais

### Estrutura de Pastas
- [ ] `/assets/` para arquivos estáticos
- [ ] `/inc/` para funcionalidades PHP
- [ ] `/template-parts/` para partes reutilizáveis
- [ ] `/languages/` para traduções

## Checklist de Organização

- [ ] Estrutura de pastas segue o padrão
- [ ] Nomenclatura de arquivos é consistente
- [ ] Comentários de cabeçalho estão presentes
- [ ] Assets estão organizados por tipo
- [ ] Template parts são reutilizáveis
- [ ] Funcionalidades estão em arquivos separados
- [ ] Documentação está presente
- [ ] Arquivos desnecessários foram removidos
- [ ] Permissões de arquivos estão corretas
- [ ] Estrutura é escalável e manutenível