# Metodologia AI para Converter Sites HTML/CSS/JS em WordPress

> **Objetivo**: Esta "engenharia de contexto" define *como* orientar uma IA (em IDE com IA integrada) a transformar um site estático (HTML/CSS/JS) em um site WordPress padronizado, performático, acessível e compatível com plugins populares (Elementor, Meta Box etc.). O pacote abaixo deve ser inserido em uma pasta do repositório para ser reaproveitado em projetos futuros.

---

## 0) Filosofia & Escopo

* **Entrada**: pasta `/input_static/` com HTML, CSS, JS, imagens e fontes do site original.
* **Saída**: tema WordPress padronizado em `/wp-content/themes/{{proj_slug}}/` + artefatos de mapeamento, testes e documentação.
* **Modos de Geração**:

  1. **Builder‑friendly (Elementor/compat)**: tema clássico minimalista com modelos base e *page template* para page-builder.
  2. **Block‑native (Gutenberg/FSE‑ready)**: tema com `theme.json`, padrões de blocos, *template parts* e *block patterns*.
* **Princípios**: segurança, acessibilidade (WCAG), desempenho (Core Web Vitals), i18n/L10n, extensibilidade e código limpo.

---

## 1) Estrutura da Pasta de Engenharia de Contexto

```
/context-engineering/
  README.md
  ai_context.json
  prompts/
    00-bootstrap.md
    10-ingest-static.md
    20-architecture.md
    30-theme-skeleton.md
    40-mapping-rules.md
    50-cpts-taxonomies.md
    60-fields-metabox.md
    70-elementor-compat.md
    80-accessibility-performance.md
    90-qa-release.md
  standards/
    coding-standards.md
    naming-conventions.md
    folder-conventions.md
    enqueue-conventions.md
  templates/
    theme-skeleton-classic/
      style.css
      functions.php
      theme.json
      index.php
      header.php
      footer.php
      page.php
      single.php
      archive.php
      search.php
      404.php
      page-elementor.php
      inc/
        setup.php
        security.php
        enqueue.php
        menus.php
        images.php
        widgets.php
        cpt.php
        taxonomies.php
        shortcodes.php
        blocks.php
      assets/
        css/
        js/
        images/
        fonts/
      parts/
        head-meta.php
        header-nav.php
        footer-widgets.php
    theme-skeleton-block/
      (estrutura equivalente, privilegiando patterns e template parts de blocos)
  mappings/
    mapping.example.yaml
    fields.example.yaml
    patterns.example.json
  scripts/
    generate-theme-from-static.mjs
    validate-mapping.mjs
    build-critical-css.mjs
  qa/
    checklist-acessibilidade.md
    checklist-performance.md
    checklist-wp.md
    lighthouse-budget.json
  ci/
    phpstan.neon
    rector.php
    phpcs.xml
```

> **Uso**: a IA lerá `ai_context.json` e os *prompts* em `prompts/` para guiar cada etapa. O time humano mantém `standards/` como fonte da verdade.

---

## 2) Contrato de Saída (o que a IA deve gerar para cada projeto)

1. **Tema** em `/wp-content/themes/{{proj_slug}}/` (modo clássico *ou* block‑native), com arquivos mínimos e includes bem organizados.
2. **Relatório de mapeamento** `mappings/mapping.yaml` contendo:

   * Páginas HTML → *templates* WordPress
   * Regiões repetidas → `header.php`, `footer.php`, `parts/*`
   * Menus estáticos → `wp_nav_menu()` e localização registrada
   * Formulários → plugin sugerido (ex.: Contact Form 7) + shortcodes
   * Loops dinâmicos (se houver) → CPTs/Taxonomias/Queries
   * Recursos estáticos → `wp_enqueue_script/style` (com dependências)
3. **Metadados de campos** `mappings/fields.yaml` (Meta Box/ACF): grupos, campos, tipos, *show on*.
4. **Padrões de bloco ou templates Elementor** (conforme modo): `patterns/*.json` ou `elementor-templates/*.json`.
5. **Relatório de Acessibilidade e Performance** com itens resolvidos e pendências.
6. **Checklist QA** preenchida.

---

## 3) Padrões de Desenvolvimento (resumo)

* **Prefixo de código**: `{{proj_slug}}_` (funções, handles, classes) para evitar conflitos.
* **Includes** em `inc/` com nomes semânticos e *single responsibility*.
* **Assets** via `wp_enqueue_*` no `inc/enqueue.php`; evitar `link/script` diretos no template.
* **Arquivos estáticos** em `assets/` (subpastas por tipo). Nunca *hotlinkar*.
* **i18n**: `load_theme_textdomain( '{{proj_slug}}', get_template_directory() . '/languages' );`
* **Segurança**: remover *emoji scripts*, cabeçalhos desnecessários, `wp_generator`, aplicar `esc_*`, `wp_nonce_*` onde couber.
* **Acessibilidade**: usar landmarks, hierarquia de headings, *focus states*, `aria-*` pragmáticos.
* **Desempenho**: critical CSS, `defer/async`, `rel=preload/preconnect` com `wp_resource_hints`, imagens responsivas.

Detalhes completos em `standards/`.

---

## 4) Regras de Mapeamento HTML → WordPress (algoritmo)

**Passo a passo (executado pela IA):**

1. **Ingestão**: varrer `/input_static/` e construir árvore dos arquivos; identificar *layout master* (head, header, nav, footer) por similaridade.
2. **Segmentação**: extrair **head/meta** → `parts/head-meta.php`, **header/nav** → `header.php`/`parts/header-nav.php`, **footer** → `footer.php`.
3. **Conteúdo**: para cada página HTML, classificar em **Página**, **Post**, **Arquivo**, **Busca**, **404**, **Landing** etc., e sugerir template.
4. **Menus**: transformar `<nav>` estática em `wp_nav_menu()` + registrar `register_nav_menus(['primary' => __( 'Primário', '{{proj_slug}}' )]);`.
5. **CSS/JS**: consolidar folhas estilo e scripts em `assets/` e enfileirar no `enqueue.php`; remover duplicados; marcar dependências.
6. **Imagens/Fonts**: mover para `assets/images|fonts`; criar *resource hints*; ajustar caminhos relativos.
7. **Formulários**: identificar `<form>`; escolher plugin alvo (CF7/WPForms), extrair campos e gerar shortcode + CSS de compatibilidade.
8. **Dinâmico**: se houver listas/repetições, mapear para **CPT + Taxonomia**; gerar `inc/cpt.php`, `inc/taxonomies.php` e `archive-*.php`.
9. **Blocks ou Builder**:

   * **Block‑native**: converter seções repetíveis em padrões (`patterns/*.json`) e *template parts*; criar `theme.json`.
   * **Elementor**: criar `page-elementor.php` (*full width*, sem *the\_content* chrome) e *templates* `.json`.
10. **A11y & Perf**: injetar landmarks, `alt` em imagens, ordem de foco; gerar *critical CSS*; habilitar `loading="lazy"` (WP já faz por padrão nas imagens nativas).
11. **Relatórios**: salvar `mapping.yaml`, `fields.yaml`, *diff* de assets e *checklists*.

---

## 5) Conteúdo Base dos Arquivos do Tema (clássico)

**`style.css` (cabeçalho):**

```css
/*
Theme Name: {{proj_name}} Theme
Theme URI: {{repo_url}}
Author: {{author}}
Author URI: {{author_url}}
Description: Tema convertido automaticamente de HTML/CSS/JS.
Version: 0.1.0
Text Domain: {{proj_slug}}
Requires at least: 6.5
Tested up to: 6.6
*/
```

**`functions.php` (bootstrap):**

```php
<?php
// Carrega includes organizados
foreach ([
  'inc/setup.php',
  'inc/security.php',
  'inc/enqueue.php',
  'inc/menus.php',
  'inc/images.php',
  'inc/widgets.php',
  'inc/cpt.php',
  'inc/taxonomies.php',
  'inc/shortcodes.php',
  'inc/blocks.php',
] as $file) { require_once get_template_directory() . '/' . $file; }
```

**`inc/setup.php`**

```php
<?php
add_action('after_setup_theme', function() {
  load_theme_textdomain('{{proj_slug}}', get_template_directory() . '/languages');
  add_theme_support('title-tag');
  add_theme_support('post-thumbnails');
  add_theme_support('html5', ['search-form','comment-form','comment-list','gallery','caption','style','script']);
  add_theme_support('align-wide');
});
```

**`inc/enqueue.php`**

```php
<?php
add_action('wp_enqueue_scripts', function() {
  $ver = wp_get_theme()->get('Version');
  wp_enqueue_style('{{proj_slug}}-main', get_stylesheet_uri(), [], $ver);
  // Exemplos (a IA preenche a partir do mapeamento)
  // wp_enqueue_style('{{proj_slug}}-vendor', get_template_directory_uri().'/assets/css/vendor.css', [], $ver);
  // wp_enqueue_script('{{proj_slug}}-main', get_template_directory_uri().'/assets/js/main.js', ['jquery'], $ver, true);
});
```

**`inc/menus.php`**

```php
<?php
add_action('after_setup_theme', function(){
  register_nav_menus([
    'primary' => __('Primário','{{proj_slug}}'),
    'footer'  => __('Rodapé','{{proj_slug}}'),
  ]);
});
```

**`page-elementor.php`**

```php
<?php
/* Template Name: Largura Total (Builder) */
get_header();
while (have_posts()): the_post();
  the_content();
endwhile;
get_footer();
```

> A versão *block‑native* inclui `theme.json`, `templates/` e `parts/` conforme FSE; ver `templates/theme-skeleton-block/`.

---

## 6) Integração com Plugins (Elementor, Meta Box, Yoast)

* **Elementor**

  * *Page template* dedicado (`page-elementor.php`), largura total, sem *container* intrusivo.
  * Desativar estilos opinativos do tema nessa rota; definir `$content_width`.
  * Incluir *compat helpers* (ex.: corrigir `img` max-width; stack de z-index de header fixo).
* **Meta Box (ou ACF)**

  * Gerar `fields.yaml` com grupos/condições (ex.: campos de *Hero*, *CTA*, *Gallery*).
  * Registar via código em `inc/cpt.php` e `inc/taxonomies.php`; aplicar `show_in_rest` quando necessário.
* **Yoast/RankMath**

  * Garantir `<title>` por `title-tag`; evitar duplicação de meta; hooks para *breadcrumbs* se usados.

---

## 7) Acessibilidade (resumo operacional)

Checklist em `qa/checklist-acessibilidade.md`.

* **Estrutura**: `header`, `nav`, `main`, `footer` e `aside` coerentes; uma `h1` por página.
* **Imagens**: `alt` significativo; decorativas com `alt=""`.
* **Teclado**: navegação tabulável; *focus visible*; *skip link*.
* **Contraste**: respeitar WCAG AA; IA sugere ajustes no CSS se falhar.
* **ARIA**: apenas quando necessário; não duplicar semântica já presente.

---

## 8) Desempenho (resumo operacional)

Checklist em `qa/checklist-performance.md` + `lighthouse-budget.json`.

* **Critical CSS**: gerar com `scripts/build-critical-css.mjs` nas *templates* mais acessadas.
* **JS**: `defer/async`; remover *polyfills* desnecessários.
* **Fonts**: `preconnect`, `preload` para WOFF2; *fallbacks*; evitar FoIT.
* **Imagens**: conversão para WebP quando possível; `sizes/srcset` via WP; `loading="lazy"`.
* **Cache**: compatível com Autoptimize/WP Super Cache ou LiteSpeed.

---

## 9) Fluxo Operacional para a IA (prompts resumidos)

1. **Bootstrap** (`prompts/00-bootstrap.md`)

   * Ler `ai_context.json`, confirmar `{{proj_name}}` e `{{proj_slug}}`.
2. **Ingestão** (`10-ingest-static.md`)

   * Escanear `/input_static/`; detectar *layout* e componentes repetidos; gerar inventário de assets.
3. **Arquitetura** (`20-architecture.md`)

   * Escolher modo (Builder‑friendly vs Block‑native); montar árvore do tema a partir de `templates/`.
4. **Skeleton** (`30-theme-skeleton.md`)

   * Copiar esqueleto; preencher cabeçalhos; registrar menus, suportes, imagens.
5. **Mapeamento** (`40-mapping-rules.md`)

   * Converter páginas; quebrar *partials*; enfileirar assets; produzir `mapping.yaml`.
6. **CPTs/Taxonomias** (`50-cpts-taxonomies.md`)

   * Inferir conteúdos repetíveis; gerar registros e *archives*.
7. **Campos** (`60-fields-metabox.md`)

   * Criar `fields.yaml` com grupos/condições; opcionalmente export ACF/Meta Box JSON.
8. **Compat Plugins** (`70-elementor-compat.md`)

   * Gerar *page template*; *templates* Elementor/Patterns; ajustes CSS mínimos.
9. **A11y & Perf** (`80-accessibility-performance.md`)

   * Inserir landmarks, *skip link*; rodar *critical CSS*; preparar *resource hints*.
10. **QA/Release** (`90-qa-release.md`)

* Preencher *checklists*; gerar relatório final; *diff* de assets.

---

## 10) Exemplo de `ai_context.json`

```json
{
  "project": {
    "name": "{{proj_name}}",
    "slug": "{{proj_slug}}",
    "mode": "builder-friendly",
    "text_domain": "{{proj_slug}}"
  },
  "objectives": [
    "Converter HTML/CSS/JS para tema WordPress padronizado",
    "Manter acessibilidade e alto desempenho",
    "Garantir compatibilidade com Elementor e Meta Box"
  ],
  "constraints": {
    "no_inline_assets": true,
    "enqueue_all_assets": true,
    "prefix": "{{proj_slug}}_",
    "php_min": "8.1",
    "wp_min": "6.5"
  },
  "mapping_contract": {
    "output_files": ["mappings/mapping.yaml", "mappings/fields.yaml"],
    "require_checklists": [
      "qa/checklist-acessibilidade.md",
      "qa/checklist-performance.md",
      "qa/checklist-wp.md"
    ]
  }
}
```

---

## 11) Padrões de Nomenclatura (resumo)

* **Handles**: `{{proj_slug}}-main`, `{{proj_slug}}-vendor`, `{{proj_slug}}-home`.
* **Funções**: `{{proj_slug}}_enqueue_assets()`, `{{proj_slug}}_register_menus()`.
* **CPT**: `{{proj_slug}}_case`, `{{proj_slug}}_service` (singular/plural coerentes, `show_in_rest: true`).

---

## 12) Checklists (trechos)

**QA WordPress**

* [ ] `style.css` com cabeçalho válido
* [ ] `functions.php` carrega todos `inc/*`
* [ ] `wp_nav_menu` + `register_nav_menus`
* [ ] `the_content()` presente nos *templates* de página/post
* [ ] Removidos *scripts emojis* e `wp_generator`

**Acessibilidade**

* [ ] `h1` único por página
* [ ] *Skip to content* antes do header
* [ ] Foco visível e ordem de tabulação lógica
* [ ] `alt` em todas imagens não decorativas

**Performance**

* [ ] JS `defer/async` quando seguro
* [ ] Critical CSS para páginas de maior tráfego
* [ ] `preconnect` para domínios de fontes/CDNs
* [ ] Imagens otimizadas (WebP onde possível)

---

## 13) Script de Partida (pseudo‑código)

**`scripts/generate-theme-from-static.mjs`** – executado pela IA/IDE

```js
// 1) Ler /input_static
// 2) Detectar layout e dividir em partes
// 3) Copiar skeleton de templates/theme-skeleton-<mode>/ para /wp-content/themes/{{proj_slug}}/
// 4) Preencher style.css, functions.php, inc/* com dados do projeto
// 5) Migrar CSS/JS para assets e criar enqueues no inc/enqueue.php
// 6) Converter nav em menu WP; gerar mapping.yaml
// 7) Se loops detectados: gerar CPT/Taxonomias e templates archive/single
// 8) Salvar checklists e rodar validações
```

---

## 14) Como usar na prática (passos rápidos)

1. Adicione `/context-engineering/` no repositório.
2. Coloque o site estático em `/input_static/`.
3. Abra a IDE com IA e execute o **prompt bootstrap** (arquivo `prompts/00-bootstrap.md`).
4. A IA seguirá os *prompts* sequenciais, gerará o tema e os relatórios.
5. Revise os *checklists*, rode Lighthouse e WPCS/PHPCS; ajuste o que faltar.

---

## 15) Roadmap de Evolução (opcional)

* Gerar *block patterns* automaticamente a partir de seções HTML recorrentes.
* Exportar e importar *Elementor templates* com imagens mapeadas para a *Media Library*.
* Integração de testes E2E (Playwright) para navegação básica e regressão visual.
* CLI único (`node cli.js convert --mode builder`) para operações repetíveis.

---

**Pronto.** Esta engenharia de contexto é plug‑and‑play: copie a pasta, a IA segue os *prompts* e você obtém um tema WordPress coerente a partir de HTML/CSS/JS. Ajuste os padrões em `standards/` para alinhar com seu time e stack.
