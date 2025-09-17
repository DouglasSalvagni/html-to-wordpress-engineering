# Padrões de Segurança

## Objetivo
Definir práticas de segurança obrigatórias para todos os temas WordPress gerados pelo sistema.

## Princípios Fundamentais

### 1. Validação e Sanitização
- **SEMPRE** validar dados de entrada
- **SEMPRE** sanitizar dados antes de salvar
- **SEMPRE** escapar dados na saída
- **NUNCA** confiar em dados do usuário

### 2. Controle de Acesso
- Verificar permissões antes de executar ações
- Usar nonces para formulários
- Implementar rate limiting quando necessário
- Seguir princípio do menor privilégio

### 3. Prevenção de Ataques
- Proteger contra XSS (Cross-Site Scripting)
- Prevenir SQL Injection
- Evitar CSRF (Cross-Site Request Forgery)
- Implementar Content Security Policy

## Sanitização de Dados

### Entrada de Dados
```php
// Texto simples
$clean_text = sanitize_text_field($_POST['user_input']);

// Email
$clean_email = sanitize_email($_POST['email']);

// URL
$clean_url = esc_url_raw($_POST['website']);

// HTML permitido
$allowed_html = array(
    'p' => array(),
    'br' => array(),
    'strong' => array(),
    'em' => array()
);
$clean_html = wp_kses($_POST['content'], $allowed_html);

// Números
$clean_number = absint($_POST['post_id']);
$clean_float = floatval($_POST['price']);

// Arrays
$clean_array = array_map('sanitize_text_field', $_POST['items']);
```

### Validação de Dados
```php
/**
 * Validar dados de entrada
 */
function {{theme_slug}}_validate_input($data, $type = 'text') {
    switch ($type) {
        case 'email':
            return is_email($data) ? $data : false;
            
        case 'url':
            return filter_var($data, FILTER_VALIDATE_URL) ? $data : false;
            
        case 'number':
            return is_numeric($data) ? $data : false;
            
        case 'text':
        default:
            return !empty(trim($data)) ? $data : false;
    }
}

// Uso
$email = {{theme_slug}}_validate_input($_POST['email'], 'email');
if (!$email) {
    wp_die('Email inválido');
}
```

## Escape de Saída

### Funções de Escape
```php
// Texto HTML
echo esc_html($user_content);

// Atributos HTML
echo '<div class="' . esc_attr($css_class) . '">';

// URLs
echo '<a href="' . esc_url($link_url) . '">';

// JavaScript
echo '<script>var data = ' . wp_json_encode($data) . ';</script>';

// Textarea
echo '<textarea>' . esc_textarea($content) . '</textarea>';

// SQL (usar prepared statements)
$wpdb->prepare(
    "SELECT * FROM {$wpdb->posts} WHERE post_title = %s",
    $title
);
```

### Contextos Específicos
```php
// Para admin
if (is_admin()) {
    echo wp_kses_post($admin_content);
}

// Para frontend
echo wp_kses($frontend_content, array(
    'p' => array(),
    'br' => array(),
    'strong' => array(),
    'em' => array(),
    'a' => array(
        'href' => array(),
        'title' => array()
    )
));
```

## Controle de Acesso

### Verificação de Permissões
```php
/**
 * Verificar se usuário pode executar ação
 */
function {{theme_slug}}_check_permissions($capability = 'edit_posts') {
    if (!current_user_can($capability)) {
        wp_die('Você não tem permissão para executar esta ação.');
    }
}

// Uso em funções
function {{theme_slug}}_save_custom_data() {
    {{theme_slug}}_check_permissions('edit_posts');
    
    // Código para salvar dados
}

// Verificações específicas
if (current_user_can('manage_options')) {
    // Apenas administradores
}

if (current_user_can('edit_post', $post_id)) {
    // Usuário pode editar este post específico
}
```

### Nonces para Formulários
```php
// Gerar nonce
$nonce = wp_create_nonce('{{theme_slug}}_action');

// No formulário
echo '<input type="hidden" name="{{theme_slug}}_nonce" value="' . esc_attr($nonce) . '">';

// Ou usando wp_nonce_field
wp_nonce_field('{{theme_slug}}_action', '{{theme_slug}}_nonce');

// Verificar nonce
if (!wp_verify_nonce($_POST['{{theme_slug}}_nonce'], '{{theme_slug}}_action')) {
    wp_die('Token de segurança inválido.');
}
```

### AJAX com Nonces
```php
// PHP - Gerar nonce para AJAX
wp_localize_script('{{theme_slug}}-ajax', 'ajax_object', array(
    'ajax_url' => admin_url('admin-ajax.php'),
    'nonce' => wp_create_nonce('{{theme_slug}}_ajax_nonce')
));

// JavaScript - Enviar nonce
jQuery.ajax({
    url: ajax_object.ajax_url,
    type: 'POST',
    data: {
        action: '{{theme_slug}}_ajax_action',
        nonce: ajax_object.nonce,
        data: formData
    }
});

// PHP - Verificar nonce no AJAX
function {{theme_slug}}_ajax_handler() {
    if (!wp_verify_nonce($_POST['nonce'], '{{theme_slug}}_ajax_nonce')) {
        wp_die('Token de segurança inválido.');
    }
    
    // Processar requisição AJAX
}
add_action('wp_ajax_{{theme_slug}}_ajax_action', '{{theme_slug}}_ajax_handler');
add_action('wp_ajax_nopriv_{{theme_slug}}_ajax_action', '{{theme_slug}}_ajax_handler');
```

## Prevenção de Ataques

### XSS (Cross-Site Scripting)
```php
// NUNCA fazer isso
echo $_POST['user_input']; // PERIGOSO!

// SEMPRE fazer isso
echo esc_html($_POST['user_input']); // SEGURO

// Para conteúdo HTML permitido
$allowed_html = array(
    'p' => array(),
    'br' => array(),
    'strong' => array(),
    'em' => array(),
    'a' => array(
        'href' => array(),
        'title' => array()
    )
);
echo wp_kses($_POST['content'], $allowed_html);
```

### SQL Injection
```php
// NUNCA fazer isso
$query = "SELECT * FROM {$wpdb->posts} WHERE post_title = '{$_POST['title']}'";
$results = $wpdb->get_results($query); // PERIGOSO!

// SEMPRE usar prepared statements
$query = $wpdb->prepare(
    "SELECT * FROM {$wpdb->posts} WHERE post_title = %s",
    $_POST['title']
);
$results = $wpdb->get_results($query); // SEGURO

// Para múltiplos valores
$query = $wpdb->prepare(
    "SELECT * FROM {$wpdb->posts} WHERE post_status = %s AND post_type = %s",
    'publish',
    'post'
);
```

### CSRF (Cross-Site Request Forgery)
```php
// Sempre usar nonces em formulários
function {{theme_slug}}_process_form() {
    // Verificar nonce
    if (!wp_verify_nonce($_POST['nonce'], 'form_action')) {
        wp_die('Requisição inválida.');
    }
    
    // Verificar referer
    if (!wp_get_referer()) {
        wp_die('Requisição inválida.');
    }
    
    // Processar formulário
}
```

## Configurações de Segurança

### Headers de Segurança
```php
/**
 * Adicionar headers de segurança
 */
function {{theme_slug}}_security_headers() {
    if (!is_admin()) {
        // X-Content-Type-Options
        header('X-Content-Type-Options: nosniff');
        
        // X-Frame-Options
        header('X-Frame-Options: SAMEORIGIN');
        
        // X-XSS-Protection
        header('X-XSS-Protection: 1; mode=block');
        
        // Referrer Policy
        header('Referrer-Policy: strict-origin-when-cross-origin');
        
        // Content Security Policy (ajustar conforme necessário)
        header("Content-Security-Policy: default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval'; style-src 'self' 'unsafe-inline';");
    }
}
add_action('send_headers', '{{theme_slug}}_security_headers');
```

### Remover Informações Sensíveis
```php
/**
 * Remover versão do WordPress
 */
remove_action('wp_head', 'wp_generator');

/**
 * Remover versão de scripts e estilos
 */
function {{theme_slug}}_remove_version_strings($src) {
    if (strpos($src, 'ver=')) {
        $src = remove_query_arg('ver', $src);
    }
    return $src;
}
add_filter('style_loader_src', '{{theme_slug}}_remove_version_strings', 9999);
add_filter('script_loader_src', '{{theme_slug}}_remove_version_strings', 9999);

/**
 * Desabilitar XML-RPC se não necessário
 */
add_filter('xmlrpc_enabled', '__return_false');

/**
 * Remover links desnecessários do head
 */
remove_action('wp_head', 'rsd_link');
remove_action('wp_head', 'wlwmanifest_link');
remove_action('wp_head', 'wp_shortlink_wp_head');
```

### Proteção de Arquivos
```php
/**
 * Prevenir acesso direto a arquivos PHP
 */
if (!defined('ABSPATH')) {
    exit; // Exit if accessed directly
}

/**
 * Verificar se é requisição AJAX válida
 */
function {{theme_slug}}_verify_ajax_request() {
    if (defined('DOING_AJAX') && DOING_AJAX) {
        return true;
    }
    return false;
}
```

## Validação de Uploads

### Filtrar Tipos de Arquivo
```php
/**
 * Restringir tipos de arquivo permitidos
 */
function {{theme_slug}}_restrict_upload_types($mimes) {
    // Remover tipos perigosos
    unset($mimes['exe']);
    unset($mimes['php']);
    unset($mimes['js']);
    
    // Adicionar tipos específicos se necessário
    $mimes['svg'] = 'image/svg+xml';
    
    return $mimes;
}
add_filter('upload_mimes', '{{theme_slug}}_restrict_upload_types');

/**
 * Validar conteúdo de arquivos SVG
 */
function {{theme_slug}}_validate_svg_upload($file) {
    if ($file['type'] === 'image/svg+xml') {
        $svg_content = file_get_contents($file['tmp_name']);
        
        // Verificar por scripts maliciosos
        if (strpos($svg_content, '<script') !== false || 
            strpos($svg_content, 'javascript:') !== false ||
            strpos($svg_content, 'onload=') !== false) {
            $file['error'] = 'Arquivo SVG contém código malicioso.';
        }
    }
    
    return $file;
}
add_filter('wp_handle_upload_prefilter', '{{theme_slug}}_validate_svg_upload');
```

## Rate Limiting

### Limitar Tentativas de Login
```php
/**
 * Rate limiting para formulários
 */
function {{theme_slug}}_rate_limit_check($action = 'default') {
    $ip = $_SERVER['REMOTE_ADDR'];
    $transient_key = '{{theme_slug}}_rate_limit_' . md5($ip . $action);
    
    $attempts = get_transient($transient_key);
    
    if ($attempts === false) {
        $attempts = 1;
        set_transient($transient_key, $attempts, MINUTE_IN_SECONDS * 5);
    } else {
        $attempts++;
        set_transient($transient_key, $attempts, MINUTE_IN_SECONDS * 5);
        
        if ($attempts > 5) {
            wp_die('Muitas tentativas. Tente novamente em 5 minutos.');
        }
    }
}
```

## Logs de Segurança

### Sistema de Log
```php
/**
 * Log de eventos de segurança
 */
function {{theme_slug}}_security_log($message, $level = 'info') {
    if (defined('WP_DEBUG') && WP_DEBUG) {
        $log_entry = sprintf(
            '[%s] [%s] %s - IP: %s - User: %s',
            date('Y-m-d H:i:s'),
            strtoupper($level),
            $message,
            $_SERVER['REMOTE_ADDR'],
            is_user_logged_in() ? wp_get_current_user()->user_login : 'guest'
        );
        
        error_log($log_entry);
    }
}

// Uso
{{theme_slug}}_security_log('Tentativa de acesso negada', 'warning');
{{theme_slug}}_security_log('Upload de arquivo suspeito bloqueado', 'error');
```

## Checklist de Segurança

### Validação de Entrada
- [ ] Todos os dados de entrada são validados
- [ ] Sanitização adequada é aplicada
- [ ] Tipos de dados são verificados
- [ ] Limites de tamanho são respeitados

### Escape de Saída
- [ ] Todo output é escapado adequadamente
- [ ] Contexto correto de escape é usado
- [ ] HTML permitido é filtrado
- [ ] URLs são validadas

### Controle de Acesso
- [ ] Permissões são verificadas
- [ ] Nonces são implementados
- [ ] AJAX é protegido
- [ ] Rate limiting está ativo

### Prevenção de Ataques
- [ ] XSS é prevenido
- [ ] SQL Injection é bloqueado
- [ ] CSRF é mitigado
- [ ] Headers de segurança estão configurados

### Configurações Gerais
- [ ] Informações sensíveis são removidas
- [ ] Uploads são validados
- [ ] Logs de segurança funcionam
- [ ] Arquivos são protegidos contra acesso direto

## Ferramentas de Teste

### Plugins Recomendados
- **Wordfence Security**
- **Sucuri Security**
- **iThemes Security**
- **All In One WP Security**

### Testes Manuais
```bash
# Verificar headers de segurança
curl -I https://seusite.com

# Testar XSS
# Tentar inserir <script>alert('xss')</script> em formulários

# Testar SQL Injection
# Tentar inserir ' OR '1'='1 em campos

# Verificar arquivos expostos
curl https://seusite.com/wp-config.php
curl https://seusite.com/.htaccess
```

### Auditoria de Código
```bash
# Buscar por funções inseguras
grep -r "echo \$_" .
grep -r "print \$_" .
grep -r "\$wpdb->query" .
grep -r "eval(" .

# Verificar escape de output
grep -r "echo" . | grep -v "esc_"
```

## Atualizações e Manutenção

### Monitoramento Contínuo
- Manter WordPress, temas e plugins atualizados
- Monitorar logs de segurança regularmente
- Realizar auditorias de código periodicamente
- Implementar backups automáticos
- Configurar alertas de segurança

### Resposta a Incidentes
1. **Identificação**: Detectar o problema
2. **Contenção**: Isolar o sistema afetado
3. **Erradicação**: Remover a ameaça
4. **Recuperação**: Restaurar operações normais
5. **Lições Aprendidas**: Documentar e melhorar