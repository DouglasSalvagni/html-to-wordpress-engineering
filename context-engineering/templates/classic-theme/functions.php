<?php
/**
 * {{theme_name}} functions and definitions
 *
 * @package {{theme_name}}
 */

// Prevent direct access
if (!defined('ABSPATH')) {
    exit;
}

// Theme version
define('THEME_VERSION', '1.0.0');

/**
 * Theme setup
 */
function {{theme_slug}}_setup() {
    // Add theme support
    add_theme_support('title-tag');
    add_theme_support('post-thumbnails');
    add_theme_support('custom-logo');
    add_theme_support('custom-background');
    add_theme_support('custom-header');
    add_theme_support('html5', array(
        'search-form',
        'comment-form',
        'comment-list',
        'gallery',
        'caption',
    ));
    
    // Add Elementor support
    add_theme_support('elementor');
    add_theme_support('elementor-pro');
    
    // Register navigation menus
    register_nav_menus(array(
        'primary' => esc_html__('Primary Menu', '{{text_domain}}'),
        'footer' => esc_html__('Footer Menu', '{{text_domain}}'),
    ));
    
    // Add image sizes
    add_image_size('{{theme_slug}}-featured', 800, 400, true);
    add_image_size('{{theme_slug}}-thumbnail', 300, 200, true);
}
add_action('after_setup_theme', '{{theme_slug}}_setup');

/**
 * Enqueue scripts and styles
 */
function {{theme_slug}}_scripts() {
    // Main stylesheet
    wp_enqueue_style('{{theme_slug}}-style', get_stylesheet_uri(), array(), THEME_VERSION);
    
    // Custom styles
    wp_enqueue_style('{{theme_slug}}-custom', get_template_directory_uri() . '/assets/css/custom.css', array(), THEME_VERSION);
    
    // Main JavaScript
    wp_enqueue_script('{{theme_slug}}-script', get_template_directory_uri() . '/assets/js/main.js', array('jquery'), THEME_VERSION, true);
    
    // Comment reply script
    if (is_singular() && comments_open() && get_option('thread_comments')) {
        wp_enqueue_script('comment-reply');
    }
}
add_action('wp_enqueue_scripts', '{{theme_slug}}_scripts');

/**
 * Register widget areas
 */
function {{theme_slug}}_widgets_init() {
    register_sidebar(array(
        'name'          => esc_html__('Sidebar', '{{text_domain}}'),
        'id'            => 'sidebar-1',
        'description'   => esc_html__('Add widgets here.', '{{text_domain}}'),
        'before_widget' => '<section id="%1$s" class="widget %2$s">',
        'after_widget'  => '</section>',
        'before_title'  => '<h2 class="widget-title">',
        'after_title'   => '</h2>',
    ));
    
    register_sidebar(array(
        'name'          => esc_html__('Footer 1', '{{text_domain}}'),
        'id'            => 'footer-1',
        'description'   => esc_html__('Footer widget area 1.', '{{text_domain}}'),
        'before_widget' => '<div id="%1$s" class="widget %2$s">',
        'after_widget'  => '</div>',
        'before_title'  => '<h3 class="widget-title">',
        'after_title'   => '</h3>',
    ));
    
    register_sidebar(array(
        'name'          => esc_html__('Footer 2', '{{text_domain}}'),
        'id'            => 'footer-2',
        'description'   => esc_html__('Footer widget area 2.', '{{text_domain}}'),
        'before_widget' => '<div id="%1$s" class="widget %2$s">',
        'after_widget'  => '</div>',
        'before_title'  => '<h3 class="widget-title">',
        'after_title'   => '</h3>',
    ));
    
    register_sidebar(array(
        'name'          => esc_html__('Footer 3', '{{text_domain}}'),
        'id'            => 'footer-3',
        'description'   => esc_html__('Footer widget area 3.', '{{text_domain}}'),
        'before_widget' => '<div id="%1$s" class="widget %2$s">',
        'after_widget'  => '</div>',
        'before_title'  => '<h3 class="widget-title">',
        'after_title'   => '</h3>',
    ));
}
add_action('widgets_init', '{{theme_slug}}_widgets_init');

/**
 * Include theme files
 */
require get_template_directory() . '/inc/customizer.php';
require get_template_directory() . '/inc/template-tags.php';
require get_template_directory() . '/inc/template-functions.php';

// Include custom post types and taxonomies if they exist
if (file_exists(get_template_directory() . '/inc/cpt.php')) {
    require get_template_directory() . '/inc/cpt.php';
}

if (file_exists(get_template_directory() . '/inc/taxonomies.php')) {
    require get_template_directory() . '/inc/taxonomies.php';
}

// Include meta boxes if they exist
if (file_exists(get_template_directory() . '/inc/metabox.php')) {
    require get_template_directory() . '/inc/metabox.php';
}

// Include Elementor compatibility if it exists
if (file_exists(get_template_directory() . '/inc/elementor-compat.php')) {
    require get_template_directory() . '/inc/elementor-compat.php';
}

// Include performance optimizations if they exist
if (file_exists(get_template_directory() . '/inc/performance.php')) {
    require get_template_directory() . '/inc/performance.php';
}

/**
 * Custom excerpt length
 */
function {{theme_slug}}_excerpt_length($length) {
    return 20;
}
add_filter('excerpt_length', '{{theme_slug}}_excerpt_length', 999);

/**
 * Custom excerpt more
 */
function {{theme_slug}}_excerpt_more($more) {
    return '...';
}
add_filter('excerpt_more', '{{theme_slug}}_excerpt_more');

/**
 * Add custom body classes
 */
function {{theme_slug}}_body_classes($classes) {
    // Add class for Elementor pages
    if (defined('ELEMENTOR_VERSION') && \Elementor\Plugin::$instance->documents->get(get_the_ID())->is_built_with_elementor()) {
        $classes[] = 'elementor-page';
    }
    
    return $classes;
}
add_filter('body_class', '{{theme_slug}}_body_classes');

/**
 * Disable Elementor default colors and fonts
 */
function {{theme_slug}}_disable_elementor_defaults() {
    if (defined('ELEMENTOR_VERSION')) {
        update_option('elementor_disable_color_schemes', 'yes');
        update_option('elementor_disable_typography_schemes', 'yes');
    }
}
add_action('after_switch_theme', '{{theme_slug}}_disable_elementor_defaults');

/**
 * Custom logo setup
 */
function {{theme_slug}}_custom_logo_setup() {
    $defaults = array(
        'height'      => 100,
        'width'       => 400,
        'flex-height' => true,
        'flex-width'  => true,
        'header-text' => array('site-title', 'site-description'),
    );
    add_theme_support('custom-logo', $defaults);
}
add_action('after_setup_theme', '{{theme_slug}}_custom_logo_setup');

/**
 * Security enhancements
 */
// Remove WordPress version from head
remove_action('wp_head', 'wp_generator');

// Remove RSD link
remove_action('wp_head', 'rsd_link');

// Remove Windows Live Writer link
remove_action('wp_head', 'wlwmanifest_link');

// Remove shortlink
remove_action('wp_head', 'wp_shortlink_wp_head');

/**
 * Performance optimizations
 */
// Remove emoji scripts
remove_action('wp_head', 'print_emoji_detection_script', 7);
remove_action('wp_print_styles', 'print_emoji_styles');
remove_action('admin_print_scripts', 'print_emoji_detection_script');
remove_action('admin_print_styles', 'print_emoji_styles');

// Disable embeds
remove_action('wp_head', 'wp_oembed_add_discovery_links');
remove_action('wp_head', 'wp_oembed_add_host_js');

/**
 * Custom functions for theme
 */

// Get custom logo or site title
function {{theme_slug}}_get_logo() {
    if (has_custom_logo()) {
        return get_custom_logo();
    } else {
        return '<h1 class="site-title"><a href="' . esc_url(home_url('/')) . '" rel="home">' . get_bloginfo('name') . '</a></h1>';
    }
}

// Get navigation menu
function {{theme_slug}}_get_nav_menu($location = 'primary') {
    if (has_nav_menu($location)) {
        wp_nav_menu(array(
            'theme_location' => $location,
            'menu_id'        => $location . '-menu',
            'container'      => 'nav',
            'container_class' => 'main-navigation',
        ));
    }
}

// Check if sidebar has widgets
function {{theme_slug}}_has_sidebar() {
    return is_active_sidebar('sidebar-1');
}