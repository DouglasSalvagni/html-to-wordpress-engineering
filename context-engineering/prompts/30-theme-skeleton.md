# Prompt 30: Theme Skeleton - Criação da Estrutura Base do Tema

## Objetivo
Criar a estrutura base do tema WordPress usando os templates apropriados e configurar arquivos fundamentais como `style.css`, `functions.php` e includes.

## Instruções para a IA

### 1. Copiar Template Base
Baseado no modo definido na arquitetura:

**Para Builder-friendly**:
- Copie a estrutura de `templates/theme-skeleton-classic/`
- Substitua todas as variáveis `{{proj_slug}}`, `{{proj_name}}`, etc.

**Para Block-native**:
- Copie a estrutura de `templates/theme-skeleton-block/`
- Configure `theme.json` com cores e tipografia do site original

### 2. Configurar style.css
Crie o cabeçalho do tema com informações do projeto:

```css
/*
Theme Name: {{proj_name}} Theme
Theme URI: {{repo_url}}
Author: {{author}}
Author URI: {{author_url}}
Description: Tema convertido automaticamente de HTML/CSS/JS para WordPress.
Version: 0.1.0
Text Domain: {{proj_slug}}
Requires at least: 6.5
Tested up to: 6.6
Requires PHP: 8.1
License: GPL v2 or later
License URI: https://www.gnu.org/licenses/gpl-2.0.html
*/
```

### 3. Configurar functions.php
Crie o bootstrap principal que carrega todos os includes:

```php
<?php
/**
 * {{proj_name}} Theme Functions
 * 
 * @package {{proj_name}}
 * @since 1.0.0
 */

// Prevent direct access
if (!defined('ABSPATH')) {
    exit;
}

// Define theme constants
define('{{PROJ_SLUG_UPPER}}_VERSION', wp_get_theme()->get('Version'));
define('{{PROJ_SLUG_UPPER}}_THEME_DIR', get_template_directory());
define('{{PROJ_SLUG_UPPER}}_THEME_URL', get_template_directory_uri());

// Load theme includes
${{proj_slug}}_includes = [
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
];

foreach (${{proj_slug}}_includes as $file) {
    $filepath = {{PROJ_SLUG_UPPER}}_THEME_DIR . '/' . $file;
    if (file_exists($filepath)) {
        require_once $filepath;
    }
}
```

### 4. Configurar Includes Básicos

**inc/setup.php** - Configurações básicas do tema:
```php
<?php
/**
 * Theme Setup
 */

add_action('after_setup_theme', '{{proj_slug}}_setup');
function {{proj_slug}}_setup() {
    // Load text domain
    load_theme_textdomain('{{proj_slug}}', get_template_directory() . '/languages');
    
    // Add theme supports
    add_theme_support('title-tag');
    add_theme_support('post-thumbnails');
    add_theme_support('html5', [
        'search-form',
        'comment-form', 
        'comment-list',
        'gallery',
        'caption',
        'style',
        'script'
    ]);
    add_theme_support('align-wide');
    add_theme_support('responsive-embeds');
    
    // Set content width
    $GLOBALS['content_width'] = 1200;
}
```

**inc/security.php** - Remoção de bloat e segurança:
```php
<?php
/**
 * Security and WordPress Cleanup
 */

// Remove WordPress version from head
remove_action('wp_head', 'wp_generator');

// Remove emoji scripts
remove_action('wp_head', 'print_emoji_detection_script', 7);
remove_action('wp_print_styles', 'print_emoji_styles');

// Remove RSD link
remove_action('wp_head', 'rsd_link');

// Remove Windows Live Writer link
remove_action('wp_head', 'wlwmanifest_link');

// Remove shortlink
remove_action('wp_head', 'wp_shortlink_wp_head');

// Disable XML-RPC
add_filter('xmlrpc_enabled', '__return_false');
```

### 5. Criar Templates Básicos

**index.php** - Template principal:
```php
<?php
/**
 * Main Template
 */

get_header();
?>

<main id="main" class="site-main" role="main">
    <?php if (have_posts()) : ?>
        <?php while (have_posts()) : the_post(); ?>
            <article id="post-<?php the_ID(); ?>" <?php post_class(); ?>>
                <header class="entry-header">
                    <?php the_title('<h1 class="entry-title">', '</h1>'); ?>
                </header>
                
                <div class="entry-content">
                    <?php the_content(); ?>
                </div>
            </article>
        <?php endwhile; ?>
    <?php else : ?>
        <p><?php esc_html_e('Nenhum conteúdo encontrado.', '{{proj_slug}}'); ?></p>
    <?php endif; ?>
</main>

<?php
get_footer();
```

**header.php** - Cabeçalho base:
```php
<!DOCTYPE html>
<html <?php language_attributes(); ?>>
<head>
    <meta charset="<?php bloginfo('charset'); ?>">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <?php wp_head(); ?>
</head>

<body <?php body_class(); ?>>
<?php wp_body_open(); ?>

<div id="page" class="site">
    <a class="skip-link screen-reader-text" href="#main">
        <?php esc_html_e('Pular para o conteúdo', '{{proj_slug}}'); ?>
    </a>
    
    <header id="masthead" class="site-header" role="banner">
        <!-- Header content will be populated from HTML analysis -->
    </header>
```

**footer.php** - Rodapé base:
```php
    <footer id="colophon" class="site-footer" role="contentinfo">
        <!-- Footer content will be populated from HTML analysis -->
    </footer>
</div><!-- #page -->

<?php wp_footer(); ?>
</body>
</html>
```

### 6. Configurar Elementor Template (se builder-friendly)

**page-elementor.php**:
```php
<?php
/**
 * Template Name: Largura Total (Page Builder)
 * 
 * Template para uso com Elementor e outros page builders
 */

get_header();
?>

<main id="main" class="site-main elementor-page" role="main">
    <?php while (have_posts()) : the_post(); ?>
        <div class="page-content">
            <?php the_content(); ?>
        </div>
    <?php endwhile; ?>
</main>

<?php
get_footer();
```

## Saída Esperada

Estrutura de arquivos criada:
```
/wp-content/themes/{{proj_slug}}/
├── style.css ✓
├── functions.php ✓
├── index.php ✓
├── header.php ✓
├── footer.php ✓
├── page.php
├── single.php
├── archive.php
├── search.php
├── 404.php
├── page-elementor.php ✓ (se builder-friendly)
└── inc/
    ├── setup.php ✓
    ├── security.php ✓
    ├── enqueue.php
    ├── menus.php
    ├── images.php
    ├── widgets.php
    ├── cpt.php
    ├── taxonomies.php
    ├── shortcodes.php
    └── blocks.php
```

Atualizar `mappings/mapping.yaml`:
```yaml
skeleton_created:
  timestamp: "{{current_timestamp}}"
  mode: "{{theme_mode}}"
  files_created:
    - "style.css"
    - "functions.php"
    - "index.php"
    - "header.php"
    - "footer.php"
    - "inc/setup.php"
    - "inc/security.php"
  
theme_info:
  name: "{{proj_name}} Theme"
  version: "0.1.0"
  text_domain: "{{proj_slug}}"
  constants_defined:
    - "{{PROJ_SLUG_UPPER}}_VERSION"
    - "{{PROJ_SLUG_UPPER}}_THEME_DIR"
    - "{{PROJ_SLUG_UPPER}}_THEME_URL"
```

## Próximo Passo
Prosseguir para `40-mapping-rules.md` para mapear conteúdo HTML para templates.

## Validações
- [ ] Estrutura base do tema criada
- [ ] `style.css` com cabeçalho correto
- [ ] `functions.php` carregando includes
- [ ] Templates básicos criados
- [ ] Includes de setup e security configurados
- [ ] Template Elementor criado (se aplicável)
- [ ] Todas as variáveis substituídas corretamente
- [ ] `mapping.yaml` atualizado com progresso