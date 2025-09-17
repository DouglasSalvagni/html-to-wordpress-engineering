# Prompt 60: Fields & Meta Box - Campos Customizados

## Objetivo
Criar campos customizados (Meta Box/ACF) baseados no conteúdo específico detectado nas páginas HTML, permitindo que administradores editem conteúdo dinâmico através do painel WordPress.

## Instruções para a IA

### 1. Análise de Conteúdo Específico

Identifique seções que precisam ser editáveis:
- **Hero sections** → Título, subtítulo, imagem de fundo, CTA
- **Seções sobre** → Texto da empresa, missão, visão, valores
- **Informações de contato** → Endereço, telefone, email, redes sociais
- **Configurações gerais** → Logo, cores, tipografia
- **Seções de produtos** → Características específicas, preços, especificações

### 2. Estrutura de Campos

Crie `mappings/fields.yaml` com definição completa:

```yaml
field_groups:
  hero_section:
    title: "Seção Hero"
    location:
      - post_type: "page"
        post_template: "front-page.php"
    fields:
      hero_title:
        type: "text"
        label: "Título Principal"
        required: true
        default: "Bem-vindos ao nosso site"
      hero_subtitle:
        type: "textarea"
        label: "Subtítulo"
        required: false
        rows: 3
      hero_background:
        type: "image"
        label: "Imagem de Fundo"
        return_format: "url"
        required: false
      hero_cta_text:
        type: "text"
        label: "Texto do Botão"
        default: "Saiba Mais"
      hero_cta_url:
        type: "url"
        label: "Link do Botão"
        required: false
        
  company_info:
    title: "Informações da Empresa"
    location:
      - post_type: "page"
        post_template: "page-about.php"
    fields:
      company_mission:
        type: "wysiwyg"
        label: "Missão"
        toolbar: "basic"
        media_upload: false
      company_vision:
        type: "wysiwyg"
        label: "Visão"
        toolbar: "basic"
        media_upload: false
      company_values:
        type: "repeater"
        label: "Valores"
        sub_fields:
          value_title:
            type: "text"
            label: "Título do Valor"
          value_description:
            type: "textarea"
            label: "Descrição"
            rows: 2
          value_icon:
            type: "image"
            label: "Ícone"
            return_format: "url"
            
  contact_info:
    title: "Informações de Contato"
    location:
      - post_type: "page"
        post_template: "page-contact.php"
      - options_page: "theme-options"
    fields:
      contact_address:
        type: "textarea"
        label: "Endereço"
        rows: 3
      contact_phone:
        type: "text"
        label: "Telefone"
        prepend: "+55"
      contact_email:
        type: "email"
        label: "Email"
      contact_hours:
        type: "text"
        label: "Horário de Funcionamento"
      social_media:
        type: "group"
        label: "Redes Sociais"
        sub_fields:
          facebook_url:
            type: "url"
            label: "Facebook"
          instagram_url:
            type: "url"
            label: "Instagram"
          linkedin_url:
            type: "url"
            label: "LinkedIn"
          twitter_url:
            type: "url"
            label: "Twitter"
            
  product_details:
    title: "Detalhes do Produto"
    location:
      - post_type: "{{proj_slug}}_product"
    fields:
      product_price:
        type: "number"
        label: "Preço"
        prepend: "R$"
        step: 0.01
      product_features:
        type: "repeater"
        label: "Características"
        sub_fields:
          feature_name:
            type: "text"
            label: "Característica"
          feature_value:
            type: "text"
            label: "Valor"
      product_gallery:
        type: "gallery"
        label: "Galeria de Imagens"
        return_format: "array"
      product_datasheet:
        type: "file"
        label: "Ficha Técnica (PDF)"
        return_format: "url"
        mime_types: "pdf"
        
  team_member:
    title: "Informações do Membro"
    location:
      - post_type: "{{proj_slug}}_team"
    fields:
      member_position:
        type: "text"
        label: "Cargo"
        required: true
      member_bio:
        type: "wysiwyg"
        label: "Biografia"
        toolbar: "basic"
      member_social:
        type: "group"
        label: "Redes Sociais"
        sub_fields:
          linkedin:
            type: "url"
            label: "LinkedIn"
          email:
            type: "email"
            label: "Email"
      member_skills:
        type: "checkbox"
        label: "Habilidades"
        choices:
          design: "Design"
          development: "Desenvolvimento"
          marketing: "Marketing"
          management: "Gestão"
          sales: "Vendas"
```

### 3. Implementação com Meta Box

**inc/metabox.php** (se usando Meta Box):
```php
<?php
/**
 * Meta Box Fields
 */

// Prevent direct access
if (!defined('ABSPATH')) {
    exit;
}

add_filter('rwmb_meta_boxes', '{{proj_slug}}_register_meta_boxes');
function {{proj_slug}}_register_meta_boxes($meta_boxes) {
    
    // Hero Section Fields
    $meta_boxes[] = [
        'title'      => __('Seção Hero', '{{proj_slug}}'),
        'post_types' => ['page'],
        'include'    => [
            'template' => ['front-page.php']
        ],
        'fields'     => [
            [
                'id'       => 'hero_title',
                'name'     => __('Título Principal', '{{proj_slug}}'),
                'type'     => 'text',
                'required' => true,
                'std'      => __('Bem-vindos ao nosso site', '{{proj_slug}}')
            ],
            [
                'id'   => 'hero_subtitle',
                'name' => __('Subtítulo', '{{proj_slug}}'),
                'type' => 'textarea',
                'rows' => 3
            ],
            [
                'id'               => 'hero_background',
                'name'             => __('Imagem de Fundo', '{{proj_slug}}'),
                'type'             => 'image_advanced',
                'max_file_uploads' => 1
            ],
            [
                'id'   => 'hero_cta_text',
                'name' => __('Texto do Botão', '{{proj_slug}}'),
                'type' => 'text',
                'std'  => __('Saiba Mais', '{{proj_slug}}')
            ],
            [
                'id'   => 'hero_cta_url',
                'name' => __('Link do Botão', '{{proj_slug}}'),
                'type' => 'url'
            ]
        ]
    ];
    
    // Company Info Fields
    $meta_boxes[] = [
        'title'      => __('Informações da Empresa', '{{proj_slug}}'),
        'post_types' => ['page'],
        'include'    => [
            'template' => ['page-about.php']
        ],
        'fields'     => [
            [
                'id'   => 'company_mission',
                'name' => __('Missão', '{{proj_slug}}'),
                'type' => 'wysiwyg',
                'options' => [
                    'textarea_rows' => 5,
                    'teeny'         => true
                ]
            ],
            [
                'id'   => 'company_vision',
                'name' => __('Visão', '{{proj_slug}}'),
                'type' => 'wysiwyg',
                'options' => [
                    'textarea_rows' => 5,
                    'teeny'         => true
                ]
            ],
            [
                'id'     => 'company_values',
                'name'   => __('Valores', '{{proj_slug}}'),
                'type'   => 'group',
                'clone'  => true,
                'fields' => [
                    [
                        'id'   => 'value_title',
                        'name' => __('Título do Valor', '{{proj_slug}}'),
                        'type' => 'text'
                    ],
                    [
                        'id'   => 'value_description',
                        'name' => __('Descrição', '{{proj_slug}}'),
                        'type' => 'textarea',
                        'rows' => 2
                    ],
                    [
                        'id'               => 'value_icon',
                        'name'             => __('Ícone', '{{proj_slug}}'),
                        'type'             => 'image_advanced',
                        'max_file_uploads' => 1
                    ]
                ]
            ]
        ]
    ];
    
    // Product Details
    $meta_boxes[] = [
        'title'      => __('Detalhes do Produto', '{{proj_slug}}'),
        'post_types' => ['{{proj_slug}}_product'],
        'fields'     => [
            [
                'id'      => 'product_price',
                'name'    => __('Preço', '{{proj_slug}}'),
                'type'    => 'number',
                'prepend' => 'R$',
                'step'    => 0.01
            ],
            [
                'id'     => 'product_features',
                'name'   => __('Características', '{{proj_slug}}'),
                'type'   => 'group',
                'clone'  => true,
                'fields' => [
                    [
                        'id'   => 'feature_name',
                        'name' => __('Característica', '{{proj_slug}}'),
                        'type' => 'text'
                    ],
                    [
                        'id'   => 'feature_value',
                        'name' => __('Valor', '{{proj_slug}}'),
                        'type' => 'text'
                    ]
                ]
            ],
            [
                'id'   => 'product_gallery',
                'name' => __('Galeria de Imagens', '{{proj_slug}}'),
                'type' => 'image_advanced'
            ],
            [
                'id'         => 'product_datasheet',
                'name'       => __('Ficha Técnica (PDF)', '{{proj_slug}}'),
                'type'       => 'file_advanced',
                'mime_type'  => 'application/pdf',
                'max_file_uploads' => 1
            ]
        ]
    ];
    
    return $meta_boxes;
}
```

### 4. Funções Helper para Campos

**inc/fields-helpers.php**:
```php
<?php
/**
 * Field Helper Functions
 */

// Get hero section data
function {{proj_slug}}_get_hero_data($post_id = null) {
    if (!$post_id) {
        $post_id = get_the_ID();
    }
    
    return [
        'title'      => rwmb_meta('hero_title', [], $post_id) ?: get_the_title($post_id),
        'subtitle'   => rwmb_meta('hero_subtitle', [], $post_id),
        'background' => rwmb_meta('hero_background', ['size' => 'full'], $post_id),
        'cta_text'   => rwmb_meta('hero_cta_text', [], $post_id) ?: __('Saiba Mais', '{{proj_slug}}'),
        'cta_url'    => rwmb_meta('hero_cta_url', [], $post_id)
    ];
}

// Get company info
function {{proj_slug}}_get_company_info($post_id = null) {
    if (!$post_id) {
        $post_id = get_the_ID();
    }
    
    return [
        'mission' => rwmb_meta('company_mission', [], $post_id),
        'vision'  => rwmb_meta('company_vision', [], $post_id),
        'values'  => rwmb_meta('company_values', [], $post_id)
    ];
}

// Get product details
function {{proj_slug}}_get_product_details($post_id = null) {
    if (!$post_id) {
        $post_id = get_the_ID();
    }
    
    return [
        'price'      => rwmb_meta('product_price', [], $post_id),
        'features'   => rwmb_meta('product_features', [], $post_id),
        'gallery'    => rwmb_meta('product_gallery', ['size' => 'medium'], $post_id),
        'datasheet'  => rwmb_meta('product_datasheet', [], $post_id)
    ];
}

// Format price
function {{proj_slug}}_format_price($price) {
    if (!$price) {
        return '';
    }
    
    return 'R$ ' . number_format((float)$price, 2, ',', '.');
}

// Display product features
function {{proj_slug}}_display_features($features) {
    if (!$features || !is_array($features)) {
        return '';
    }
    
    $output = '<ul class="product-features">';
    foreach ($features as $feature) {
        if (!empty($feature['feature_name'])) {
            $output .= '<li>';
            $output .= '<strong>' . esc_html($feature['feature_name']) . ':</strong> ';
            $output .= esc_html($feature['feature_value'] ?? '');
            $output .= '</li>';
        }
    }
    $output .= '</ul>';
    
    return $output;
}
```

### 5. Uso nos Templates

**Exemplo em front-page.php**:
```php
<?php
$hero_data = {{proj_slug}}_get_hero_data();
if ($hero_data['background']) {
    $bg_style = 'style="background-image: url(' . esc_url($hero_data['background']['url']) . ')"';
} else {
    $bg_style = '';
}
?>

<section class="hero-section" <?php echo $bg_style; ?>>
    <div class="container">
        <div class="hero-content">
            <h1 class="hero-title"><?php echo esc_html($hero_data['title']); ?></h1>
            
            <?php if ($hero_data['subtitle']) : ?>
                <p class="hero-subtitle"><?php echo esc_html($hero_data['subtitle']); ?></p>
            <?php endif; ?>
            
            <?php if ($hero_data['cta_url']) : ?>
                <a href="<?php echo esc_url($hero_data['cta_url']); ?>" class="btn btn-primary hero-cta">
                    <?php echo esc_html($hero_data['cta_text']); ?>
                </a>
            <?php endif; ?>
        </div>
    </div>
</section>
```

**Exemplo em single-product.php**:
```php
<?php
$product_details = {{proj_slug}}_get_product_details();
?>

<div class="product-details">
    <?php if ($product_details['price']) : ?>
        <div class="product-price">
            <span class="price"><?php echo {{proj_slug}}_format_price($product_details['price']); ?></span>
        </div>
    <?php endif; ?>
    
    <?php if ($product_details['features']) : ?>
        <div class="product-features">
            <h3><?php esc_html_e('Características', '{{proj_slug}}'); ?></h3>
            <?php echo {{proj_slug}}_display_features($product_details['features']); ?>
        </div>
    <?php endif; ?>
    
    <?php if ($product_details['gallery']) : ?>
        <div class="product-gallery">
            <h3><?php esc_html_e('Galeria', '{{proj_slug}}'); ?></h3>
            <div class="gallery-grid">
                <?php foreach ($product_details['gallery'] as $image) : ?>
                    <div class="gallery-item">
                        <img src="<?php echo esc_url($image['url']); ?>" 
                             alt="<?php echo esc_attr($image['alt']); ?>"
                             loading="lazy">
                    </div>
                <?php endforeach; ?>
            </div>
        </div>
    <?php endif; ?>
    
    <?php if ($product_details['datasheet']) : ?>
        <div class="product-datasheet">
            <a href="<?php echo esc_url($product_details['datasheet']['url']); ?>" 
               class="btn btn-secondary" target="_blank">
                <?php esc_html_e('Download Ficha Técnica', '{{proj_slug}}'); ?>
            </a>
        </div>
    <?php endif; ?>
</div>
```

## Saída Esperada

Atualizar `mappings/fields.yaml` com estrutura completa e criar:

```yaml
field_implementation:
  plugin_used: "meta-box" # ou "acf"
  total_field_groups: 5
  total_fields: 23
  
  files_created:
    - "inc/metabox.php"
    - "inc/fields-helpers.php"
    - "mappings/fields.yaml"
    
  helper_functions:
    - "{{proj_slug}}_get_hero_data()"
    - "{{proj_slug}}_get_company_info()"
    - "{{proj_slug}}_get_product_details()"
    - "{{proj_slug}}_format_price()"
    - "{{proj_slug}}_display_features()"
    
  templates_updated:
    - "front-page.php"
    - "page-about.php"
    - "single-{{proj_slug}}_product.php"
    - "single-{{proj_slug}}_team.php"
```

## Próximo Passo
Prosseguir para `70-elementor-compat.md` para compatibilidade com page builders.

## Validações
- [ ] `fields.yaml` criado com estrutura completa
- [ ] Meta boxes registrados para páginas específicas
- [ ] Campos apropriados para cada tipo de conteúdo
- [ ] Funções helper criadas para facilitar uso
- [ ] Templates atualizados para usar campos customizados
- [ ] Validação e sanitização implementadas
- [ ] Labels traduzidas corretamente
- [ ] Campos condicionais configurados quando necessário