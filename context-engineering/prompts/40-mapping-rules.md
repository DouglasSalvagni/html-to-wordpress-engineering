# Prompt 40: Mapping Rules - Mapeamento de Conteúdo HTML para WordPress

## Objetivo
Converter o conteúdo HTML estático para templates WordPress dinâmicos, mapeando seções, menus, formulários e conteúdo para estruturas WordPress apropriadas.

## Instruções para a IA

### 1. Extração de Layout Master

**Header (header.php)**:
- Extraia `<head>` e converta para `wp_head()`
- Identifique logo e converta para `get_custom_logo()` ou `bloginfo('name')`
- Localize navegação principal e converta para `wp_nav_menu()`
- Preserve classes CSS e estrutura HTML

**Footer (footer.php)**:
- Extraia rodapé completo
- Converta links estáticos para dinâmicos quando apropriado
- Adicione `wp_footer()` antes de `</body>`
- Mantenha widgets areas se detectadas

### 2. Conversão de Navegação

**De HTML estático**:
```html
<nav class="main-navigation">
    <ul>
        <li><a href="index.html">Home</a></li>
        <li><a href="about.html">Sobre</a></li>
        <li><a href="contact.html">Contato</a></li>
    </ul>
</nav>
```

**Para WordPress dinâmico**:
```php
<nav class="main-navigation" role="navigation">
    <?php
    wp_nav_menu([
        'theme_location' => 'primary',
        'menu_class'     => 'main-menu',
        'container'      => false,
        'fallback_cb'    => '{{proj_slug}}_fallback_menu'
    ]);
    ?>
</nav>
```

**Registrar menu em inc/menus.php**:
```php
add_action('after_setup_theme', '{{proj_slug}}_register_menus');
function {{proj_slug}}_register_menus() {
    register_nav_menus([
        'primary' => __('Menu Principal', '{{proj_slug}}'),
        'footer'  => __('Menu Rodapé', '{{proj_slug}}')
    ]);
}
```

### 3. Mapeamento de Páginas

**Para cada arquivo HTML, criar template correspondente**:

**index.html → front-page.php**:
```php
<?php
/**
 * Front Page Template
 */

get_header();
?>

<main id="main" class="site-main" role="main">
    <!-- Converter seções HTML estáticas para dinâmicas -->
    
    <!-- Hero Section -->
    <section class="hero-section">
        <div class="container">
            <h1><?php echo get_theme_mod('hero_title', 'Título Padrão'); ?></h1>
            <p><?php echo get_theme_mod('hero_subtitle', 'Subtítulo padrão'); ?></p>
            <a href="<?php echo get_theme_mod('hero_cta_url', '#'); ?>" class="btn btn-primary">
                <?php echo get_theme_mod('hero_cta_text', 'Saiba Mais'); ?>
            </a>
        </div>
    </section>
    
    <!-- Features Section -->
    <section class="features-section">
        <!-- Converter lista estática para loop dinâmico se necessário -->
    </section>
    
</main>

<?php get_footer(); ?>
```

**about.html → page.php ou page-about.php**:
```php
<?php
/**
 * Page Template
 */

get_header();
?>

<main id="main" class="site-main" role="main">
    <?php while (have_posts()) : the_post(); ?>
        <article id="post-<?php the_ID(); ?>" <?php post_class(); ?>>
            <header class="entry-header">
                <?php the_title('<h1 class="entry-title">', '</h1>'); ?>
            </header>
            
            <div class="entry-content">
                <?php the_content(); ?>
                
                <!-- Seções específicas da página sobre -->
                <?php if (get_field('team_section_enabled')) : ?>
                    <section class="team-section">
                        <!-- Conteúdo da equipe -->
                    </section>
                <?php endif; ?>
            </div>
        </article>
    <?php endwhile; ?>
</main>

<?php get_footer(); ?>
```

### 4. Conversão de Formulários

**Identificar formulários HTML**:
```html
<form class="contact-form" action="#" method="post">
    <input type="text" name="name" placeholder="Nome" required>
    <input type="email" name="email" placeholder="Email" required>
    <textarea name="message" placeholder="Mensagem" required></textarea>
    <button type="submit">Enviar</button>
</form>
```

**Converter para shortcode Contact Form 7**:
```php
<!-- No template PHP -->
<div class="contact-form-wrapper">
    <?php echo do_shortcode('[contact-form-7 id="123" title="Formulário de Contato"]'); ?>
</div>
```

**Gerar configuração CF7**:
```
<label> Seu nome
    [text* your-name] </label>

<label> Seu email
    [email* your-email] </label>

<label> Sua mensagem
    [textarea* your-message] </label>

[submit "Enviar"]
```

### 5. Migração de Assets

**CSS - inc/enqueue.php**:
```php
add_action('wp_enqueue_scripts', '{{proj_slug}}_enqueue_assets');
function {{proj_slug}}_enqueue_assets() {
    $version = {{PROJ_SLUG_UPPER}}_VERSION;
    
    // CSS
    wp_enqueue_style('{{proj_slug}}-normalize', get_template_directory_uri() . '/assets/css/normalize.css', [], $version);
    wp_enqueue_style('{{proj_slug}}-main', get_stylesheet_uri(), ['{{proj_slug}}-normalize'], $version);
    
    // JavaScript
    wp_enqueue_script('{{proj_slug}}-main', get_template_directory_uri() . '/assets/js/main.js', ['jquery'], $version, true);
    
    // Localizar scripts se necessário
    wp_localize_script('{{proj_slug}}-main', '{{proj_slug}}_ajax', [
        'ajax_url' => admin_url('admin-ajax.php'),
        'nonce'    => wp_create_nonce('{{proj_slug}}_nonce')
    ]);
}
```

**Mover arquivos físicos**:
- `style.css` → `/assets/css/style.css`
- `script.js` → `/assets/js/main.js`
- `images/` → `/assets/images/`
- `fonts/` → `/assets/fonts/`

### 6. Otimização de Imagens

**Converter tags img estáticas**:
```html
<!-- De: -->
<img src="images/hero-bg.jpg" alt="Hero Background">

<!-- Para: -->
<img src="<?php echo get_template_directory_uri(); ?>/assets/images/hero-bg.jpg" 
     alt="<?php esc_attr_e('Hero Background', '{{proj_slug}}'); ?>"
     loading="lazy">
```

**Para imagens de conteúdo, usar WordPress Media**:
```php
<?php if (has_post_thumbnail()) : ?>
    <div class="featured-image">
        <?php the_post_thumbnail('large', ['loading' => 'lazy']); ?>
    </div>
<?php endif; ?>
```

### 7. Implementação de Resource Hints

**inc/enqueue.php - adicionar**:
```php
add_action('wp_head', '{{proj_slug}}_resource_hints');
function {{proj_slug}}_resource_hints() {
    // Preconnect para Google Fonts
    echo '<link rel="preconnect" href="https://fonts.googleapis.com">' . "\n";
    echo '<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>' . "\n";
    
    // Preload para fontes críticas
    echo '<link rel="preload" href="' . get_template_directory_uri() . '/assets/fonts/main-font.woff2" as="font" type="font/woff2" crossorigin>' . "\n";
}
```

### 8. Conversão de Loops Dinâmicos

**Se detectados componentes repetitivos (ex: cards de produtos)**:
```php
<!-- Converter de HTML estático para loop WordPress -->
<section class="products-section">
    <div class="container">
        <div class="products-grid">
            <?php
            $products = new WP_Query([
                'post_type' => '{{proj_slug}}_product',
                'posts_per_page' => 6,
                'post_status' => 'publish'
            ]);
            
            if ($products->have_posts()) :
                while ($products->have_posts()) : $products->the_post();
            ?>
                <div class="product-card">
                    <?php if (has_post_thumbnail()) : ?>
                        <div class="product-image">
                            <?php the_post_thumbnail('medium'); ?>
                        </div>
                    <?php endif; ?>
                    
                    <div class="product-content">
                        <h3><?php the_title(); ?></h3>
                        <p><?php the_excerpt(); ?></p>
                        <a href="<?php the_permalink(); ?>" class="btn btn-primary">
                            <?php esc_html_e('Ver Mais', '{{proj_slug}}'); ?>
                        </a>
                    </div>
                </div>
            <?php
                endwhile;
                wp_reset_postdata();
            endif;
            ?>
        </div>
    </div>
</section>
```

## Saída Esperada

Atualizar `mappings/mapping.yaml`:
```yaml
content_mapping:
  pages_converted:
    - html_file: "index.html"
      wp_template: "front-page.php"
      sections_mapped:
        - "hero-section": "customizer_fields"
        - "features-section": "static_content"
    - html_file: "about.html"
      wp_template: "page.php"
      custom_fields: ["team_section_enabled", "company_history"]
  
  navigation_converted:
    - location: "primary"
      original_structure: "main-navigation ul li"
      wp_function: "wp_nav_menu"
    
  forms_converted:
    - original_form: "contact-form"
      plugin_used: "contact-form-7"
      shortcode: "[contact-form-7 id='123']"
      
  assets_migrated:
    css_files:
      - original: "style.css"
        new_location: "assets/css/style.css"
        enqueued_as: "{{proj_slug}}-main"
    js_files:
      - original: "script.js"
        new_location: "assets/js/main.js"
        enqueued_as: "{{proj_slug}}-main"
        dependencies: ["jquery"]
    images:
      - original: "images/"
        new_location: "assets/images/"
        optimization_applied: true
```

## Próximo Passo
Prosseguir para `50-cpts-taxonomies.md` para criar Custom Post Types se necessário.

## Validações
- [ ] Header e footer extraídos e convertidos
- [ ] Navegação convertida para `wp_nav_menu()`
- [ ] Páginas HTML mapeadas para templates WordPress
- [ ] Formulários convertidos para plugins
- [ ] Assets migrados e enfileirados corretamente
- [ ] Imagens otimizadas e com lazy loading
- [ ] Resource hints implementados
- [ ] Loops dinâmicos criados se necessário
- [ ] `mapping.yaml` atualizado com todas as conversões