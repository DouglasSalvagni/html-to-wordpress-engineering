# Prompt 50: CPTs & Taxonomies - Custom Post Types e Taxonomias

## Objetivo
Criar Custom Post Types e Taxonomias baseados em componentes repetitivos detectados no site estático, implementando estrutura de dados dinâmica para conteúdo que antes era estático.

## Instruções para a IA

### 1. Análise de Componentes Repetitivos

Baseado na análise anterior, identifique padrões que justifiquem CPTs:
- **Cards de produtos/serviços** → CPT "Produto" ou "Serviço"
- **Posts de blog** → Usar post type nativo "post"
- **Membros da equipe** → CPT "Membro da Equipe"
- **Portfólio/Cases** → CPT "Portfólio"
- **Depoimentos** → CPT "Depoimento"
- **FAQ** → CPT "FAQ"

### 2. Implementação de Custom Post Types

**inc/cpt.php** - Estrutura base:
```php
<?php
/**
 * Custom Post Types
 */

// Prevent direct access
if (!defined('ABSPATH')) {
    exit;
}

add_action('init', '{{proj_slug}}_register_post_types');
function {{proj_slug}}_register_post_types() {
    
    // CPT: Produto (exemplo)
    register_post_type('{{proj_slug}}_product', [
        'labels' => [
            'name'               => __('Produtos', '{{proj_slug}}'),
            'singular_name'      => __('Produto', '{{proj_slug}}'),
            'menu_name'          => __('Produtos', '{{proj_slug}}'),
            'add_new'            => __('Adicionar Novo', '{{proj_slug}}'),
            'add_new_item'       => __('Adicionar Novo Produto', '{{proj_slug}}'),
            'edit_item'          => __('Editar Produto', '{{proj_slug}}'),
            'new_item'           => __('Novo Produto', '{{proj_slug}}'),
            'view_item'          => __('Ver Produto', '{{proj_slug}}'),
            'search_items'       => __('Buscar Produtos', '{{proj_slug}}'),
            'not_found'          => __('Nenhum produto encontrado', '{{proj_slug}}'),
            'not_found_in_trash' => __('Nenhum produto na lixeira', '{{proj_slug}}')
        ],
        'public'              => true,
        'publicly_queryable'  => true,
        'show_ui'             => true,
        'show_in_menu'        => true,
        'show_in_rest'        => true, // Para Gutenberg e API REST
        'query_var'           => true,
        'rewrite'             => ['slug' => 'produtos'],
        'capability_type'     => 'post',
        'has_archive'         => true,
        'hierarchical'        => false,
        'menu_position'       => 20,
        'menu_icon'           => 'dashicons-products',
        'supports'            => ['title', 'editor', 'thumbnail', 'excerpt', 'custom-fields'],
        'taxonomies'          => ['{{proj_slug}}_product_category']
    ]);
    
    // CPT: Membro da Equipe (exemplo)
    register_post_type('{{proj_slug}}_team', [
        'labels' => [
            'name'               => __('Equipe', '{{proj_slug}}'),
            'singular_name'      => __('Membro', '{{proj_slug}}'),
            'menu_name'          => __('Equipe', '{{proj_slug}}'),
            'add_new'            => __('Adicionar Membro', '{{proj_slug}}'),
            'add_new_item'       => __('Adicionar Novo Membro', '{{proj_slug}}'),
            'edit_item'          => __('Editar Membro', '{{proj_slug}}'),
            'new_item'           => __('Novo Membro', '{{proj_slug}}'),
            'view_item'          => __('Ver Membro', '{{proj_slug}}'),
            'search_items'       => __('Buscar Membros', '{{proj_slug}}'),
            'not_found'          => __('Nenhum membro encontrado', '{{proj_slug}}'),
            'not_found_in_trash' => __('Nenhum membro na lixeira', '{{proj_slug}}')
        ],
        'public'              => true,
        'publicly_queryable'  => true,
        'show_ui'             => true,
        'show_in_menu'        => true,
        'show_in_rest'        => true,
        'query_var'           => true,
        'rewrite'             => ['slug' => 'equipe'],
        'capability_type'     => 'post',
        'has_archive'         => true,
        'hierarchical'        => false,
        'menu_position'       => 21,
        'menu_icon'           => 'dashicons-groups',
        'supports'            => ['title', 'editor', 'thumbnail', 'custom-fields'],
        'taxonomies'          => ['{{proj_slug}}_team_department']
    ]);
}
```

### 3. Implementação de Taxonomias

**inc/taxonomies.php**:
```php
<?php
/**
 * Custom Taxonomies
 */

// Prevent direct access
if (!defined('ABSPATH')) {
    exit;
}

add_action('init', '{{proj_slug}}_register_taxonomies');
function {{proj_slug}}_register_taxonomies() {
    
    // Taxonomia: Categoria de Produto
    register_taxonomy('{{proj_slug}}_product_category', ['{{proj_slug}}_product'], [
        'labels' => [
            'name'              => __('Categorias de Produto', '{{proj_slug}}'),
            'singular_name'     => __('Categoria de Produto', '{{proj_slug}}'),
            'search_items'      => __('Buscar Categorias', '{{proj_slug}}'),
            'all_items'         => __('Todas as Categorias', '{{proj_slug}}'),
            'parent_item'       => __('Categoria Pai', '{{proj_slug}}'),
            'parent_item_colon' => __('Categoria Pai:', '{{proj_slug}}'),
            'edit_item'         => __('Editar Categoria', '{{proj_slug}}'),
            'update_item'       => __('Atualizar Categoria', '{{proj_slug}}'),
            'add_new_item'      => __('Adicionar Nova Categoria', '{{proj_slug}}'),
            'new_item_name'     => __('Nome da Nova Categoria', '{{proj_slug}}'),
            'menu_name'         => __('Categorias', '{{proj_slug}}')
        ],
        'hierarchical'      => true, // Como categorias
        'public'            => true,
        'publicly_queryable' => true,
        'show_ui'           => true,
        'show_admin_column' => true,
        'show_in_nav_menus' => true,
        'show_in_rest'      => true,
        'query_var'         => true,
        'rewrite'           => ['slug' => 'categoria-produto']
    ]);
    
    // Taxonomia: Departamento da Equipe
    register_taxonomy('{{proj_slug}}_team_department', ['{{proj_slug}}_team'], [
        'labels' => [
            'name'              => __('Departamentos', '{{proj_slug}}'),
            'singular_name'     => __('Departamento', '{{proj_slug}}'),
            'search_items'      => __('Buscar Departamentos', '{{proj_slug}}'),
            'all_items'         => __('Todos os Departamentos', '{{proj_slug}}'),
            'edit_item'         => __('Editar Departamento', '{{proj_slug}}'),
            'update_item'       => __('Atualizar Departamento', '{{proj_slug}}'),
            'add_new_item'      => __('Adicionar Novo Departamento', '{{proj_slug}}'),
            'new_item_name'     => __('Nome do Novo Departamento', '{{proj_slug}}'),
            'menu_name'         => __('Departamentos', '{{proj_slug}}')
        ],
        'hierarchical'      => false, // Como tags
        'public'            => true,
        'publicly_queryable' => true,
        'show_ui'           => true,
        'show_admin_column' => true,
        'show_in_nav_menus' => true,
        'show_in_rest'      => true,
        'query_var'         => true,
        'rewrite'           => ['slug' => 'departamento']
    ]);
}
```

### 4. Criação de Templates para CPTs

**archive-{{proj_slug}}_product.php**:
```php
<?php
/**
 * Archive Template for Products
 */

get_header();
?>

<main id="main" class="site-main" role="main">
    <header class="page-header">
        <div class="container">
            <h1 class="page-title">
                <?php esc_html_e('Nossos Produtos', '{{proj_slug}}'); ?>
            </h1>
            <?php
            $description = get_the_archive_description();
            if ($description) :
            ?>
                <div class="archive-description"><?php echo wp_kses_post($description); ?></div>
            <?php endif; ?>
        </div>
    </header>
    
    <div class="container">
        <?php if (have_posts()) : ?>
            <div class="products-grid">
                <?php while (have_posts()) : the_post(); ?>
                    <article id="post-<?php the_ID(); ?>" <?php post_class('product-card'); ?>>
                        <?php if (has_post_thumbnail()) : ?>
                            <div class="product-image">
                                <a href="<?php the_permalink(); ?>">
                                    <?php the_post_thumbnail('medium'); ?>
                                </a>
                            </div>
                        <?php endif; ?>
                        
                        <div class="product-content">
                            <h2 class="product-title">
                                <a href="<?php the_permalink(); ?>"><?php the_title(); ?></a>
                            </h2>
                            
                            <div class="product-excerpt">
                                <?php the_excerpt(); ?>
                            </div>
                            
                            <div class="product-meta">
                                <?php
                                $categories = get_the_terms(get_the_ID(), '{{proj_slug}}_product_category');
                                if ($categories && !is_wp_error($categories)) :
                                ?>
                                    <div class="product-categories">
                                        <?php foreach ($categories as $category) : ?>
                                            <span class="category-tag"><?php echo esc_html($category->name); ?></span>
                                        <?php endforeach; ?>
                                    </div>
                                <?php endif; ?>
                            </div>
                            
                            <a href="<?php the_permalink(); ?>" class="btn btn-primary">
                                <?php esc_html_e('Ver Detalhes', '{{proj_slug}}'); ?>
                            </a>
                        </div>
                    </article>
                <?php endwhile; ?>
            </div>
            
            <?php
            the_posts_pagination([
                'prev_text' => __('« Anterior', '{{proj_slug}}'),
                'next_text' => __('Próximo »', '{{proj_slug}}')
            ]);
            ?>
            
        <?php else : ?>
            <p><?php esc_html_e('Nenhum produto encontrado.', '{{proj_slug}}'); ?></p>
        <?php endif; ?>
    </div>
</main>

<?php get_footer(); ?>
```

**single-{{proj_slug}}_product.php**:
```php
<?php
/**
 * Single Product Template
 */

get_header();
?>

<main id="main" class="site-main" role="main">
    <?php while (have_posts()) : the_post(); ?>
        <article id="post-<?php the_ID(); ?>" <?php post_class('single-product'); ?>>
            <div class="container">
                <header class="entry-header">
                    <?php the_title('<h1 class="entry-title">', '</h1>'); ?>
                    
                    <?php
                    $categories = get_the_terms(get_the_ID(), '{{proj_slug}}_product_category');
                    if ($categories && !is_wp_error($categories)) :
                    ?>
                        <div class="product-categories">
                            <?php foreach ($categories as $category) : ?>
                                <a href="<?php echo get_term_link($category); ?>" class="category-link">
                                    <?php echo esc_html($category->name); ?>
                                </a>
                            <?php endforeach; ?>
                        </div>
                    <?php endif; ?>
                </header>
                
                <div class="entry-content">
                    <?php if (has_post_thumbnail()) : ?>
                        <div class="featured-image">
                            <?php the_post_thumbnail('large'); ?>
                        </div>
                    <?php endif; ?>
                    
                    <?php the_content(); ?>
                    
                    <?php
                    wp_link_pages([
                        'before' => '<div class="page-links">' . esc_html__('Páginas:', '{{proj_slug}}'),
                        'after'  => '</div>'
                    ]);
                    ?>
                </div>
                
                <footer class="entry-footer">
                    <div class="post-navigation">
                        <?php
                        $prev_post = get_previous_post();
                        $next_post = get_next_post();
                        
                        if ($prev_post) :
                        ?>
                            <div class="nav-previous">
                                <a href="<?php echo get_permalink($prev_post); ?>">
                                    « <?php echo get_the_title($prev_post); ?>
                                </a>
                            </div>
                        <?php endif; ?>
                        
                        <?php if ($next_post) : ?>
                            <div class="nav-next">
                                <a href="<?php echo get_permalink($next_post); ?>">
                                    <?php echo get_the_title($next_post); ?> »
                                </a>
                            </div>
                        <?php endif; ?>
                    </div>
                </footer>
            </div>
        </article>
    <?php endwhile; ?>
</main>

<?php get_footer(); ?>
```

### 5. Flush Rewrite Rules

**Adicionar em inc/setup.php**:
```php
// Flush rewrite rules on theme activation
add_action('after_switch_theme', '{{proj_slug}}_flush_rewrite_rules');
function {{proj_slug}}_flush_rewrite_rules() {
    // Trigger CPT and taxonomy registration
    {{proj_slug}}_register_post_types();
    {{proj_slug}}_register_taxonomies();
    
    // Flush rewrite rules
    flush_rewrite_rules();
}
```

### 6. Queries Customizadas

**Adicionar em functions.php ou inc/setup.php**:
```php
// Modify main query for CPT archives
add_action('pre_get_posts', '{{proj_slug}}_modify_main_query');
function {{proj_slug}}_modify_main_query($query) {
    if (!is_admin() && $query->is_main_query()) {
        // Include CPTs in home page if needed
        if (is_home()) {
            $query->set('post_type', ['post', '{{proj_slug}}_product']);
        }
        
        // Set posts per page for CPT archives
        if (is_post_type_archive('{{proj_slug}}_product')) {
            $query->set('posts_per_page', 12);
        }
    }
}
```

## Saída Esperada

Atualizar `mappings/mapping.yaml`:
```yaml
custom_post_types:
  - name: "{{proj_slug}}_product"
    labels:
      singular: "Produto"
      plural: "Produtos"
    slug: "produtos"
    supports: ["title", "editor", "thumbnail", "excerpt", "custom-fields"]
    public: true
    has_archive: true
    show_in_rest: true
    menu_icon: "dashicons-products"
    templates_created:
      - "archive-{{proj_slug}}_product.php"
      - "single-{{proj_slug}}_product.php"
    
  - name: "{{proj_slug}}_team"
    labels:
      singular: "Membro"
      plural: "Equipe"
    slug: "equipe"
    supports: ["title", "editor", "thumbnail", "custom-fields"]
    public: true
    has_archive: true
    show_in_rest: true
    menu_icon: "dashicons-groups"

custom_taxonomies:
  - name: "{{proj_slug}}_product_category"
    labels:
      singular: "Categoria de Produto"
      plural: "Categorias de Produto"
    slug: "categoria-produto"
    post_types: ["{{proj_slug}}_product"]
    hierarchical: true
    public: true
    show_in_rest: true
    
  - name: "{{proj_slug}}_team_department"
    labels:
      singular: "Departamento"
      plural: "Departamentos"
    slug: "departamento"
    post_types: ["{{proj_slug}}_team"]
    hierarchical: false
    public: true
    show_in_rest: true

files_created:
  - "inc/cpt.php"
  - "inc/taxonomies.php"
  - "archive-{{proj_slug}}_product.php"
  - "single-{{proj_slug}}_product.php"
  - "archive-{{proj_slug}}_team.php"
  - "single-{{proj_slug}}_team.php"
```

## Próximo Passo
Prosseguir para `60-fields-metabox.md` para criar campos customizados.

## Validações
- [ ] CPTs criados baseados em componentes repetitivos
- [ ] Taxonomias associadas aos CPTs apropriados
- [ ] Templates archive e single criados para cada CPT
- [ ] Labels traduzidas e consistentes
- [ ] `show_in_rest` habilitado para Gutenberg
- [ ] Rewrite rules configuradas corretamente
- [ ] Query modifications implementadas se necessário
- [ ] `mapping.yaml` atualizado com estrutura de dados