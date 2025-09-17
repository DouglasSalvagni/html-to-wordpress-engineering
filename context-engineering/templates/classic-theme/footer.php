<?php
/**
 * The template for displaying the footer
 *
 * @package {{theme_name}}
 */

?>

    <footer id="colophon" class="site-footer">
        <?php if (is_active_sidebar('footer-1') || is_active_sidebar('footer-2') || is_active_sidebar('footer-3')) : ?>
            <div class="footer-widgets">
                <div class="container">
                    <div class="footer-widget-area">
                        <?php if (is_active_sidebar('footer-1')) : ?>
                            <div class="footer-widget footer-widget-1">
                                <?php dynamic_sidebar('footer-1'); ?>
                            </div>
                        <?php endif; ?>
                        
                        <?php if (is_active_sidebar('footer-2')) : ?>
                            <div class="footer-widget footer-widget-2">
                                <?php dynamic_sidebar('footer-2'); ?>
                            </div>
                        <?php endif; ?>
                        
                        <?php if (is_active_sidebar('footer-3')) : ?>
                            <div class="footer-widget footer-widget-3">
                                <?php dynamic_sidebar('footer-3'); ?>
                            </div>
                        <?php endif; ?>
                    </div>
                </div>
            </div>
        <?php endif; ?>
        
        <div class="site-info">
            <div class="container">
                <div class="footer-content">
                    <div class="copyright">
                        <p>
                            &copy; <?php echo date('Y'); ?> 
                            <a href="<?php echo esc_url(home_url('/')); ?>">
                                <?php bloginfo('name'); ?>
                            </a>
                            <?php esc_html_e('Todos os direitos reservados.', '{{text_domain}}'); ?>
                        </p>
                    </div>
                    
                    <?php if (has_nav_menu('footer')) : ?>
                        <nav class="footer-navigation">
                            <?php
                            wp_nav_menu(array(
                                'theme_location' => 'footer',
                                'menu_id'        => 'footer-menu',
                                'container'      => false,
                                'menu_class'     => 'footer-menu',
                                'depth'          => 1,
                            ));
                            ?>
                        </nav>
                    <?php endif; ?>
                    
                    <div class="theme-info">
                        <p>
                            <?php
                            printf(
                                esc_html__('Desenvolvido com %1$s por %2$s', '{{text_domain}}'),
                                '<a href="' . esc_url('https://wordpress.org/') . '">WordPress</a>',
                                '<a href="#">{{author_name}}</a>'
                            );
                            ?>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    </footer>
</div><!-- #page -->

<?php
// Back to top button
if (apply_filters('{{theme_slug}}_show_back_to_top', true)) :
?>
    <button id="back-to-top" class="back-to-top" aria-label="<?php esc_attr_e('Voltar ao topo', '{{text_domain}}'); ?>">
        <span class="back-to-top-icon">↑</span>
    </button>
<?php endif; ?>

<?php wp_footer(); ?>

<script>
// Back to top functionality
(function() {
    var backToTop = document.getElementById('back-to-top');
    if (backToTop) {
        window.addEventListener('scroll', function() {
            if (window.pageYOffset > 300) {
                backToTop.style.display = 'block';
            } else {
                backToTop.style.display = 'none';
            }
        });
        
        backToTop.addEventListener('click', function(e) {
            e.preventDefault();
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }
})();

// Mobile menu toggle
(function() {
    var menuToggle = document.querySelector('.menu-toggle');
    var navigation = document.querySelector('.main-navigation');
    
    if (menuToggle && navigation) {
        menuToggle.addEventListener('click', function() {
            var expanded = menuToggle.getAttribute('aria-expanded') === 'true';
            menuToggle.setAttribute('aria-expanded', !expanded);
            navigation.classList.toggle('toggled');
        });
    }
})();

// Accessibility improvements
(function() {
    // Skip link focus fix
    var skipLink = document.querySelector('.skip-link');
    if (skipLink) {
        skipLink.addEventListener('click', function(e) {
            var target = document.querySelector(skipLink.getAttribute('href'));
            if (target) {
                target.focus();
                if (target.tabIndex === -1) {
                    target.tabIndex = -1;
                }
            }
        });
    }
    
    // Dropdown menu accessibility
    var menuItems = document.querySelectorAll('.main-navigation .menu-item-has-children > a');
    menuItems.forEach(function(item) {
        item.addEventListener('focus', function() {
            var submenu = this.nextElementSibling;
            if (submenu) {
                submenu.style.display = 'block';
            }
        });
        
        item.addEventListener('blur', function() {
            var submenu = this.nextElementSibling;
            if (submenu) {
                setTimeout(function() {
                    if (!submenu.contains(document.activeElement)) {
                        submenu.style.display = 'none';
                    }
                }, 100);
            }
        });
    });
})();
</script>

<style>
/* Footer Styles */
.footer-widgets {
    background: #2c3e50;
    color: #ecf0f1;
    padding: 3rem 0;
}

.footer-widget-area {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
    gap: 2rem;
}

.footer-widget h3 {
    color: #fff;
    margin-bottom: 1rem;
    font-size: 1.2rem;
}

.footer-widget ul {
    list-style: none;
    padding: 0;
}

.footer-widget ul li {
    margin-bottom: 0.5rem;
}

.footer-widget a {
    color: #bdc3c7;
    text-decoration: none;
    transition: color 0.3s ease;
}

.footer-widget a:hover {
    color: #fff;
}

.site-info {
    background: #34495e;
    color: #bdc3c7;
    padding: 1.5rem 0;
}

.footer-content {
    display: flex;
    justify-content: space-between;
    align-items: center;
    flex-wrap: wrap;
    gap: 1rem;
}

.footer-navigation ul {
    display: flex;
    list-style: none;
    margin: 0;
    padding: 0;
    gap: 1.5rem;
}

.footer-navigation a {
    color: #bdc3c7;
    text-decoration: none;
    transition: color 0.3s ease;
}

.footer-navigation a:hover {
    color: #fff;
}

/* Back to top button */
.back-to-top {
    position: fixed;
    bottom: 2rem;
    right: 2rem;
    background: #3498db;
    color: #fff;
    border: none;
    border-radius: 50%;
    width: 50px;
    height: 50px;
    font-size: 1.2rem;
    cursor: pointer;
    display: none;
    z-index: 1000;
    transition: all 0.3s ease;
    box-shadow: 0 2px 10px rgba(0,0,0,0.2);
}

.back-to-top:hover {
    background: #2980b9;
    transform: translateY(-2px);
}

/* Mobile menu styles */
.menu-toggle {
    display: none;
    background: none;
    border: none;
    padding: 1rem;
    cursor: pointer;
    flex-direction: column;
    align-items: center;
    gap: 0.5rem;
}

.menu-toggle-icon {
    display: flex;
    flex-direction: column;
    gap: 3px;
}

.menu-toggle-icon span {
    width: 25px;
    height: 3px;
    background: #333;
    transition: all 0.3s ease;
}

@media (max-width: 768px) {
    .menu-toggle {
        display: flex;
    }
    
    .main-navigation ul {
        display: none;
        flex-direction: column;
        position: absolute;
        top: 100%;
        left: 0;
        right: 0;
        background: #fff;
        box-shadow: 0 2px 10px rgba(0,0,0,0.1);
        z-index: 999;
    }
    
    .main-navigation.toggled ul {
        display: flex;
    }
    
    .footer-content {
        flex-direction: column;
        text-align: center;
    }
    
    .footer-navigation ul {
        justify-content: center;
    }
    
    .back-to-top {
        bottom: 1rem;
        right: 1rem;
        width: 45px;
        height: 45px;
    }
}
</style>

</body>
</html>