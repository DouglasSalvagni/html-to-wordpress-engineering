# Convenções de Código

## Objetivo
Definir padrões de código consistentes para garantir qualidade, manutenibilidade e compatibilidade com WordPress.

## Convenções PHP

### Nomenclatura
- **Funções**: `snake_case` com prefixo do tema
  ```php
  function {{theme_slug}}_get_custom_logo() {}
  ```

- **Classes**: `PascalCase` com prefixo
  ```php
  class {{Theme_Slug}}_Custom_Widget {}
  ```

- **Constantes**: `UPPER_CASE` com prefixo
  ```php
  define('{{THEME_SLUG}}_VERSION', '1.0.0');
  ```

- **Variáveis**: `snake_case`
  ```php
  $custom_post_types = array();
  ```

### Estrutura de Arquivos
- **functions.php**: Apenas includes e configurações básicas
- **inc/**: Funcionalidades específicas em arquivos separados
- **templates/**: Templates customizados
- **assets/**: CSS, JS e imagens

### Hooks e Filtros
- Sempre usar prefixo do tema
- Prioridade padrão: 10
- Documentar parâmetros esperados

```php
// Ação
add_action('wp_enqueue_scripts', '{{theme_slug}}_enqueue_scripts');

// Filtro
add_filter('{{theme_slug}}_custom_filter', '{{theme_slug}}_modify_content', 10, 2);
```

### Segurança
- Sempre escapar output: `esc_html()`, `esc_attr()`, `esc_url()`
- Validar input: `sanitize_text_field()`, `wp_kses()`
- Verificar permissões: `current_user_can()`
- Usar nonces para formulários

```php
// Escape de output
echo esc_html(get_the_title());
echo '<a href="' . esc_url(get_permalink()) . '">';

// Sanitização de input
$clean_input = sanitize_text_field($_POST['user_input']);
```

## Convenções CSS

### Metodologia BEM
```css
/* Block */
.site-header {}

/* Element */
.site-header__logo {}
.site-header__navigation {}

/* Modifier */
.site-header--sticky {}
.site-header__logo--large {}
```

### Organização
1. Reset/Normalize
2. Base styles
3. Layout
4. Components
5. Utilities
6. Media queries

### Nomenclatura de Classes
- Prefixo do tema para classes principais
- BEM para componentes
- Utilities com prefixo `u-`

```css
/* Tema */
.{{theme-slug}}-container {}

/* Componentes */
.card {}
.card__header {}
.card__content {}
.card--featured {}

/* Utilities */
.u-text-center {}
.u-margin-bottom {}
```

### Variáveis CSS
```css
:root {
  --{{theme-slug}}-color-primary: #3498db;
  --{{theme-slug}}-color-secondary: #2ecc71;
  --{{theme-slug}}-font-family-base: system-ui, sans-serif;
  --{{theme-slug}}-spacing-unit: 1rem;
}
```

## Convenções JavaScript

### Nomenclatura
- **Variáveis e funções**: `camelCase`
- **Constantes**: `UPPER_CASE`
- **Classes**: `PascalCase`

```javascript
// Variáveis
const siteNavigation = document.querySelector('.site-navigation');

// Funções
function toggleMobileMenu() {}

// Classes
class CustomSlider {}

// Constantes
const API_ENDPOINT = '/wp-json/wp/v2/';
```

### Estrutura
- Usar IIFE para evitar conflitos globais
- Namespace com prefixo do tema
- Event listeners em DOMContentLoaded

```javascript
(function() {
    'use strict';
    
    const {{themeSlug}} = {
        init: function() {
            this.bindEvents();
        },
        
        bindEvents: function() {
            document.addEventListener('DOMContentLoaded', this.onDOMReady.bind(this));
        },
        
        onDOMReady: function() {
            // Código de inicialização
        }
    };
    
    {{themeSlug}}.init();
})();
```

## Convenções de Templates

### Hierarquia de Templates
1. Seguir hierarquia padrão do WordPress
2. Usar template parts para reutilização
3. Prefixar templates customizados

```
index.php
home.php
archive.php
single.php
page.php
404.php
search.php
```

### Template Parts
```php
// Header
get_header();

// Template parts
get_template_part('template-parts/content', 'post');
get_template_part('template-parts/navigation', 'pagination');

// Footer
get_footer();
```

### Conditional Tags
```php
if (is_home()) {
    // Blog home
} elseif (is_front_page()) {
    // Static front page
} elseif (is_single()) {
    // Single post
} elseif (is_page()) {
    // Static page
}
```

## Convenções de Acessibilidade

### HTML Semântico
```html
<header role="banner">
<nav role="navigation" aria-label="Main navigation">
<main role="main">
<aside role="complementary">
<footer role="contentinfo">
```

### ARIA Labels
```html
<button aria-label="Toggle mobile menu" aria-expanded="false">
<input type="search" aria-label="Search posts">
<img src="image.jpg" alt="Descriptive text">
```

### Skip Links
```html
<a class="skip-link screen-reader-text" href="#main">
    Skip to main content
</a>
```

## Convenções de Performance

### Otimização de Assets
- Minificar CSS/JS em produção
- Usar lazy loading para imagens
- Implementar cache de browser
- Otimizar imagens (WebP, tamanhos responsivos)

### Database Queries
- Usar WP_Query com parcimônia
- Implementar cache para queries customizadas
- Evitar queries dentro de loops
- Usar transients para dados temporários

```php
// Cache com transients
$cached_data = get_transient('{{theme_slug}}_custom_data');
if (false === $cached_data) {
    $cached_data = expensive_database_query();
    set_transient('{{theme_slug}}_custom_data', $cached_data, HOUR_IN_SECONDS);
}
```

## Convenções de Documentação

### PHPDoc
```php
/**
 * Get custom post types for theme
 *
 * @since 1.0.0
 * @param array $args Query arguments
 * @return array Array of post type objects
 */
function {{theme_slug}}_get_custom_post_types($args = array()) {
    // Function code
}
```

### Comentários
```php
// Single line comment for simple explanations

/*
 * Multi-line comment for complex logic
 * that requires detailed explanation
 */

/**
 * DocBlock for functions, classes, and methods
 */
```

## Validação e Testes

### Ferramentas Recomendadas
- **PHP**: PHP CodeSniffer com WordPress Coding Standards
- **CSS**: Stylelint
- **JavaScript**: ESLint
- **Acessibilidade**: axe-core, WAVE

### Comandos de Validação
```bash
# PHP CodeSniffer
phpcs --standard=WordPress .

# Stylelint
stylelint "**/*.css"

# ESLint
eslint assets/js/
```

## Checklist de Qualidade

- [ ] Código segue convenções de nomenclatura
- [ ] Funções têm prefixo do tema
- [ ] Output é escapado adequadamente
- [ ] Input é sanitizado
- [ ] CSS usa metodologia BEM
- [ ] JavaScript usa namespace
- [ ] Templates seguem hierarquia WP
- [ ] HTML é semântico
- [ ] ARIA labels estão presentes
- [ ] Performance foi considerada
- [ ] Documentação está completa
- [ ] Código passou na validação