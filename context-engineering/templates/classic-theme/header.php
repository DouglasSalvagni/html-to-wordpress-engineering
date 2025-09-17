<?php
/**
 * The header for our theme
 *
 * @package {{theme_name}}
 */

?>
<!doctype html>
<html <?php language_attributes(); ?>>
<head>
    <meta charset="<?php bloginfo('charset'); ?>">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <link rel="profile" href="https://gmpg.org/xfn/11">
    
    <?php wp_head(); ?>
</head>

<body <?php body_class(); ?>>
<?php wp_body_open(); ?>

<div id="page" class="site">
    <a class="skip-link screen-reader-text" href="#main"><?php esc_html_e('Pular para o conteúdo', '{{text_domain}}'); ?></a>
    
    <header id="masthead" class="site-header">
        <div class="container">
            <div class="site-branding">
                <?php
                if (has_custom_logo()) :
                    the_custom_logo();
                else :
                ?>
                    <div class="site-identity">
                        <?php if (is_front_page() && is_home()) : ?>
                            <h1 class="site-title">
                                <a href="<?php echo esc_url(home_url('/')); ?>" rel="home">
                                    <?php bloginfo('name'); ?>
                                </a>
                            </h1>
                        <?php else : ?>
                            <p class="site-title">
                                <a href="<?php echo esc_url(home_url('/')); ?>" rel="home">
                                    <?php bloginfo('name'); ?>
                                </a>
                            </p>
                        <?php endif; ?>
                        
                        <?php
                        $description = get_bloginfo('description', 'display');
                        if ($description || is_customize_preview()) :
                        ?>
                            <p class="site-description"><?php echo $description; ?></p>
                        <?php endif; ?>
                    </div>
                <?php endif; ?>
            </div>
            
            <?php if (has_nav_menu('primary')) : ?>
                <nav id="site-navigation" class="main-navigation">
                    <button class="menu-toggle" aria-controls="primary-menu" aria-expanded="false">
                        <span class="menu-toggle-text"><?php esc_html_e('Menu', '{{text_domain}}'); ?></span>
                        <span class="menu-toggle-icon">
                            <span></span>
                            <span></span>
                            <span></span>
                        </span>
                    </button>
                    
                    <?php
                    wp_nav_menu(array(
                        'theme_location' => 'primary',
                        'menu_id'        => 'primary-menu',
                        'container'      => false,
                        'menu_class'     => 'primary-menu',
                    ));
                    ?>
                </nav>
            <?php endif; ?>
        </div>
    </header>
    
    <?php
    // Custom header content for specific pages
    if (is_front_page() && !is_home()) :
        // Front page header content
    elseif (is_home()) :
        // Blog page header
    elseif (is_page()) :
        // Page header
        if (has_post_thumbnail()) :
        ?>
            <div class="page-header-image">
                <?php the_post_thumbnail('full'); ?>
            </div>
        <?php
        endif;
    elseif (is_single()) :
        // Single post header
        if (has_post_thumbnail()) :
        ?>
            <div class="post-header-image">
                <?php the_post_thumbnail('full'); ?>
            </div>
        <?php
        endif;
    elseif (is_archive()) :
        // Archive header
        ?>
        <div class="archive-header">
            <div class="container">
                <h1 class="archive-title">
                    <?php
                    if (is_category()) :
                        single_cat_title();
                    elseif (is_tag()) :
                        single_tag_title();
                    elseif (is_author()) :
                        printf(esc_html__('Autor: %s', '{{text_domain}}'), '<span class="vcard">' . get_the_author() . '</span>');
                    elseif (is_year()) :
                        printf(esc_html__('Ano: %s', '{{text_domain}}'), get_the_date(_x('Y', 'yearly archives date format', '{{text_domain}}')));
                    elseif (is_month()) :
                        printf(esc_html__('Mês: %s', '{{text_domain}}'), get_the_date(_x('F Y', 'monthly archives date format', '{{text_domain}}')));
                    elseif (is_day()) :
                        printf(esc_html__('Dia: %s', '{{text_domain}}'), get_the_date(_x('F j, Y', 'daily archives date format', '{{text_domain}}')));
                    elseif (is_tax('post_format')) :
                        if (is_tax('post_format', 'post-format-aside')) :
                            esc_html_e('Asides', '{{text_domain}}');
                        elseif (is_tax('post_format', 'post-format-gallery')) :
                            esc_html_e('Galerias', '{{text_domain}}');
                        elseif (is_tax('post_format', 'post-format-link')) :
                            esc_html_e('Links', '{{text_domain}}');
                        elseif (is_tax('post_format', 'post-format-image')) :
                            esc_html_e('Imagens', '{{text_domain}}');
                        elseif (is_tax('post_format', 'post-format-quote')) :
                            esc_html_e('Citações', '{{text_domain}}');
                        elseif (is_tax('post_format', 'post-format-status')) :
                            esc_html_e('Status', '{{text_domain}}');
                        elseif (is_tax('post_format', 'post-format-video')) :
                            esc_html_e('Vídeos', '{{text_domain}}');
                        elseif (is_tax('post_format', 'post-format-audio')) :
                            esc_html_e('Áudios', '{{text_domain}}');
                        else :
                            esc_html_e('Arquivos', '{{text_domain}}');
                        endif;
                    else :
                        esc_html_e('Arquivos', '{{text_domain}}');
                    endif;
                    ?>
                </h1>
                
                <?php
                $archive_description = get_the_archive_description();
                if ($archive_description) :
                ?>
                    <div class="archive-description"><?php echo wp_kses_post($archive_description); ?></div>
                <?php endif; ?>
            </div>
        </div>
        <?php
    elseif (is_search()) :
        // Search results header
        ?>
        <div class="search-header">
            <div class="container">
                <h1 class="search-title">
                    <?php
                    printf(
                        esc_html__('Resultados da pesquisa por: %s', '{{text_domain}}'),
                        '<span>' . get_search_query() . '</span>'
                    );
                    ?>
                </h1>
            </div>
        </div>
        <?php
    endif;
    ?>