<?php
/**
 * The main template file
 *
 * @package {{theme_name}}
 */

get_header();
?>

<div class="container">
    <div class="content-area">
        <main id="main" class="site-main">
            <?php if (have_posts()) : ?>
                
                <?php if (is_home() && !is_front_page()) : ?>
                    <header>
                        <h1 class="page-title screen-reader-text"><?php single_post_title(); ?></h1>
                    </header>
                <?php endif; ?>
                
                <?php while (have_posts()) : the_post(); ?>
                    
                    <article id="post-<?php the_ID(); ?>" <?php post_class(); ?>>
                        <header class="entry-header">
                            <?php
                            if (is_singular()) :
                                the_title('<h1 class="entry-title">', '</h1>');
                            else :
                                the_title('<h2 class="entry-title"><a href="' . esc_url(get_permalink()) . '" rel="bookmark">', '</a></h2>');
                            endif;
                            
                            if ('post' === get_post_type()) :
                            ?>
                            <div class="entry-meta">
                                <?php
                                echo '<span class="posted-on">';
                                echo '<time class="entry-date published" datetime="' . esc_attr(get_the_date('c')) . '">';
                                echo esc_html(get_the_date());
                                echo '</time>';
                                echo '</span>';
                                
                                echo '<span class="byline">';
                                echo ' por <span class="author vcard"><a class="url fn n" href="' . esc_url(get_author_posts_url(get_the_author_meta('ID'))) . '">';
                                echo esc_html(get_the_author());
                                echo '</a></span>';
                                echo '</span>';
                                
                                if (has_category()) {
                                    echo '<span class="cat-links"> em ';
                                    the_category(', ');
                                    echo '</span>';
                                }
                                ?>
                            </div>
                            <?php endif; ?>
                        </header>
                        
                        <?php if (has_post_thumbnail() && !is_singular()) : ?>
                            <div class="post-thumbnail">
                                <a href="<?php the_permalink(); ?>">
                                    <?php the_post_thumbnail('{{theme_slug}}-featured', array('alt' => get_the_title())); ?>
                                </a>
                            </div>
                        <?php endif; ?>
                        
                        <div class="entry-content">
                            <?php
                            if (is_singular()) :
                                the_content();
                                
                                wp_link_pages(array(
                                    'before' => '<div class="page-links">' . esc_html__('Páginas:', '{{text_domain}}'),
                                    'after'  => '</div>',
                                ));
                            else :
                                the_excerpt();
                            endif;
                            ?>
                        </div>
                        
                        <?php if (!is_singular()) : ?>
                            <footer class="entry-footer">
                                <a href="<?php the_permalink(); ?>" class="read-more">
                                    <?php esc_html_e('Leia mais', '{{text_domain}}'); ?>
                                </a>
                                
                                <?php if (has_tag()) : ?>
                                    <div class="tags-links">
                                        <?php the_tags('<span class="tags-label">' . esc_html__('Tags:', '{{text_domain}}') . '</span> ', ', '); ?>
                                    </div>
                                <?php endif; ?>
                            </footer>
                        <?php endif; ?>
                    </article>
                    
                <?php endwhile; ?>
                
                <?php
                // Pagination
                the_posts_pagination(array(
                    'prev_text' => esc_html__('Anterior', '{{text_domain}}'),
                    'next_text' => esc_html__('Próximo', '{{text_domain}}'),
                ));
                ?>
                
            <?php else : ?>
                
                <section class="no-results not-found">
                    <header class="page-header">
                        <h1 class="page-title"><?php esc_html_e('Nada encontrado', '{{text_domain}}'); ?></h1>
                    </header>
                    
                    <div class="page-content">
                        <?php if (is_home() && current_user_can('publish_posts')) : ?>
                            
                            <p><?php
                                printf(
                                    wp_kses(
                                        __('Pronto para publicar seu primeiro post? <a href="%1$s">Comece aqui</a>.', '{{text_domain}}'),
                                        array(
                                            'a' => array(
                                                'href' => array(),
                                            ),
                                        )
                                    ),
                                    esc_url(admin_url('post-new.php'))
                                );
                            ?></p>
                            
                        <?php elseif (is_search()) : ?>
                            
                            <p><?php esc_html_e('Desculpe, mas nada corresponde aos seus termos de pesquisa. Tente novamente com algumas palavras-chave diferentes.', '{{text_domain}}'); ?></p>
                            <?php get_search_form(); ?>
                            
                        <?php else : ?>
                            
                            <p><?php esc_html_e('Parece que não conseguimos encontrar o que você está procurando. Talvez a pesquisa possa ajudar.', '{{text_domain}}'); ?></p>
                            <?php get_search_form(); ?>
                            
                        <?php endif; ?>
                    </div>
                </section>
                
            <?php endif; ?>
        </main>
        
        <?php if ({{theme_slug}}_has_sidebar()) : ?>
            <?php get_sidebar(); ?>
        <?php endif; ?>
    </div>
</div>

<?php
get_footer();