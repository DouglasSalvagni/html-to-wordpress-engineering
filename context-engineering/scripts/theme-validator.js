/**
 * Theme Validator - Validador de temas WordPress
 * 
 * Este script valida temas WordPress gerados, verificando conformidade
 * com padrões do WordPress, segurança, performance e boas práticas.
 * 
 * @author WordPress Creator Context Engineering
 * @version 1.0.0
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

class ThemeValidator {
    constructor(options = {}) {
        this.options = {
            strictMode: options.strictMode || false,
            checkSecurity: options.checkSecurity || true,
            checkPerformance: options.checkPerformance || true,
            checkAccessibility: options.checkAccessibility || true,
            outputFormat: options.outputFormat || 'console', // 'console', 'json', 'html'
            ...options
        };
        
        this.errors = [];
        this.warnings = [];
        this.info = [];
        this.themeData = {};
        
        this.requiredFiles = {
            classic: ['style.css', 'index.php', 'functions.php'],
            block: ['style.css', 'index.php', 'theme.json']
        };
        
        this.recommendedFiles = {
            classic: ['header.php', 'footer.php', 'single.php', 'page.php', 'archive.php', 'search.php', '404.php'],
            block: ['templates/index.html', 'templates/single.html', 'templates/page.html']
        };
    }

    /**
     * Valida um tema WordPress
     * @param {string} themePath - Caminho para o diretório do tema
     * @returns {Object} Resultado da validação
     */
    async validateTheme(themePath) {
        try {
            console.log(`🔍 Validando tema em: ${themePath}`);
            
            // Reset dos arrays de resultados
            this.errors = [];
            this.warnings = [];
            this.info = [];
            
            // Verificar se o diretório existe
            if (!fs.existsSync(themePath)) {
                this.addError('THEME_NOT_FOUND', `Diretório do tema não encontrado: ${themePath}`);
                return this.generateReport();
            }
            
            // Detectar tipo do tema
            this.themeData.type = this.detectThemeType(themePath);
            this.addInfo('THEME_TYPE', `Tipo de tema detectado: ${this.themeData.type}`);
            
            // Validações principais
            await this.validateRequiredFiles(themePath);
            await this.validateStyleCSS(themePath);
            await this.validateFunctionsPHP(themePath);
            await this.validateTemplateFiles(themePath);
            
            if (this.themeData.type === 'block') {
                await this.validateThemeJSON(themePath);
            }
            
            // Validações de segurança
            if (this.options.checkSecurity) {
                await this.validateSecurity(themePath);
            }
            
            // Validações de performance
            if (this.options.checkPerformance) {
                await this.validatePerformance(themePath);
            }
            
            // Validações de acessibilidade
            if (this.options.checkAccessibility) {
                await this.validateAccessibility(themePath);
            }
            
            // Validações de estrutura
            await this.validateFileStructure(themePath);
            
            // Validações de código
            await this.validateCodeQuality(themePath);
            
            const report = this.generateReport();
            console.log(`✅ Validação concluída: ${this.errors.length} erros, ${this.warnings.length} avisos`);
            
            return report;
            
        } catch (error) {
            console.error(`❌ Erro durante validação:`, error.message);
            this.addError('VALIDATION_ERROR', `Erro interno: ${error.message}`);
            return this.generateReport();
        }
    }

    /**
     * Detecta o tipo do tema (classic ou block)
     * @param {string} themePath - Caminho do tema
     * @returns {string} Tipo do tema
     */
    detectThemeType(themePath) {
        const themeJsonPath = path.join(themePath, 'theme.json');
        return fs.existsSync(themeJsonPath) ? 'block' : 'classic';
    }

    /**
     * Valida arquivos obrigatórios
     * @param {string} themePath - Caminho do tema
     */
    async validateRequiredFiles(themePath) {
        const requiredFiles = this.requiredFiles[this.themeData.type];
        
        for (const file of requiredFiles) {
            const filePath = path.join(themePath, file);
            if (!fs.existsSync(filePath)) {
                this.addError('MISSING_REQUIRED_FILE', `Arquivo obrigatório não encontrado: ${file}`);
            } else {
                this.addInfo('REQUIRED_FILE_FOUND', `Arquivo obrigatório encontrado: ${file}`);
            }
        }
        
        // Verificar arquivos recomendados
        const recommendedFiles = this.recommendedFiles[this.themeData.type];
        for (const file of recommendedFiles) {
            const filePath = path.join(themePath, file);
            if (!fs.existsSync(filePath)) {
                this.addWarning('MISSING_RECOMMENDED_FILE', `Arquivo recomendado não encontrado: ${file}`);
            }
        }
    }

    /**
     * Valida o arquivo style.css
     * @param {string} themePath - Caminho do tema
     */
    async validateStyleCSS(themePath) {
        const stylePath = path.join(themePath, 'style.css');
        
        if (!fs.existsSync(stylePath)) {
            return; // Já reportado em validateRequiredFiles
        }
        
        const content = fs.readFileSync(stylePath, 'utf8');
        
        // Verificar cabeçalho do tema
        const headerRegex = /\/\*[\s\S]*?Theme Name:[\s\S]*?\*\//;
        if (!headerRegex.test(content)) {
            this.addError('INVALID_STYLE_HEADER', 'Cabeçalho do tema não encontrado ou inválido em style.css');
        } else {
            this.addInfo('VALID_STYLE_HEADER', 'Cabeçalho do tema válido encontrado');
            
            // Extrair informações do cabeçalho
            this.extractThemeInfo(content);
        }
        
        // Verificar campos obrigatórios
        const requiredFields = ['Theme Name', 'Description', 'Version'];
        for (const field of requiredFields) {
            const fieldRegex = new RegExp(`${field}:\\s*(.+)`, 'i');
            if (!fieldRegex.test(content)) {
                this.addError('MISSING_HEADER_FIELD', `Campo obrigatório ausente no cabeçalho: ${field}`);
            }
        }
        
        // Verificar se há CSS além do cabeçalho
        const cssContent = content.replace(headerRegex, '').trim();
        if (cssContent.length === 0) {
            this.addWarning('EMPTY_CSS', 'Arquivo style.css não contém estilos CSS');
        }
    }

    /**
     * Valida o arquivo functions.php
     * @param {string} themePath - Caminho do tema
     */
    async validateFunctionsPHP(themePath) {
        const functionsPath = path.join(themePath, 'functions.php');
        
        if (!fs.existsSync(functionsPath)) {
            return; // Já reportado em validateRequiredFiles
        }
        
        const content = fs.readFileSync(functionsPath, 'utf8');
        
        // Verificar abertura PHP
        if (!content.startsWith('<?php')) {
            this.addError('INVALID_PHP_OPENING', 'functions.php deve começar com <?php');
        }
        
        // Verificar se não há fechamento PHP
        if (content.trim().endsWith('?>')) {
            this.addWarning('PHP_CLOSING_TAG', 'Evite usar ?> no final do functions.php');
        }
        
        // Verificar funções essenciais
        const essentialFunctions = [
            'wp_enqueue_style',
            'add_theme_support',
            'register_nav_menus'
        ];
        
        for (const func of essentialFunctions) {
            if (!content.includes(func)) {
                this.addWarning('MISSING_ESSENTIAL_FUNCTION', `Função recomendada não encontrada: ${func}`);
            }
        }
        
        // Verificar suporte a recursos do WordPress
        const themeSupports = [
            'post-thumbnails',
            'title-tag',
            'custom-logo',
            'html5'
        ];
        
        for (const support of themeSupports) {
            if (!content.includes(support)) {
                this.addWarning('MISSING_THEME_SUPPORT', `Suporte recomendado não encontrado: ${support}`);
            }
        }
    }

    /**
     * Valida arquivos de template
     * @param {string} themePath - Caminho do tema
     */
    async validateTemplateFiles(themePath) {
        const templateFiles = this.getTemplateFiles(themePath);
        
        for (const file of templateFiles) {
            await this.validateTemplateFile(path.join(themePath, file));
        }
    }

    /**
     * Valida um arquivo de template específico
     * @param {string} filePath - Caminho do arquivo
     */
    async validateTemplateFile(filePath) {
        if (!fs.existsSync(filePath)) {
            return;
        }
        
        const content = fs.readFileSync(filePath, 'utf8');
        const fileName = path.basename(filePath);
        
        // Verificar abertura PHP
        if (!content.startsWith('<?php')) {
            this.addError('INVALID_TEMPLATE_OPENING', `Template ${fileName} deve começar com <?php`);
        }
        
        // Verificar funções de escape
        const escapeFunctions = ['esc_html', 'esc_attr', 'esc_url', 'wp_kses'];
        let hasEscaping = false;
        
        for (const func of escapeFunctions) {
            if (content.includes(func)) {
                hasEscaping = true;
                break;
            }
        }
        
        if (!hasEscaping && content.includes('echo')) {
            this.addWarning('MISSING_ESCAPING', `Template ${fileName} pode precisar de funções de escape`);
        }
        
        // Verificar hooks do WordPress
        if (fileName === 'header.php') {
            if (!content.includes('wp_head()')) {
                this.addError('MISSING_WP_HEAD', 'header.php deve incluir wp_head()');
            }
        }
        
        if (fileName === 'footer.php') {
            if (!content.includes('wp_footer()')) {
                this.addError('MISSING_WP_FOOTER', 'footer.php deve incluir wp_footer()');
            }
        }
    }

    /**
     * Valida o arquivo theme.json (para temas block)
     * @param {string} themePath - Caminho do tema
     */
    async validateThemeJSON(themePath) {
        const themeJsonPath = path.join(themePath, 'theme.json');
        
        if (!fs.existsSync(themeJsonPath)) {
            return;
        }
        
        try {
            const content = fs.readFileSync(themeJsonPath, 'utf8');
            const themeJson = JSON.parse(content);
            
            // Verificar versão do schema
            if (!themeJson.version) {
                this.addError('MISSING_THEME_JSON_VERSION', 'theme.json deve especificar uma versão');
            } else if (themeJson.version < 2) {
                this.addWarning('OLD_THEME_JSON_VERSION', 'Considere usar versão 2 ou superior do theme.json');
            }
            
            // Verificar estrutura básica
            const requiredSections = ['settings', 'styles'];
            for (const section of requiredSections) {
                if (!themeJson[section]) {
                    this.addWarning('MISSING_THEME_JSON_SECTION', `Seção recomendada ausente em theme.json: ${section}`);
                }
            }
            
            this.addInfo('VALID_THEME_JSON', 'theme.json é válido');
            
        } catch (error) {
            this.addError('INVALID_THEME_JSON', `theme.json inválido: ${error.message}`);
        }
    }

    /**
     * Validações de segurança
     * @param {string} themePath - Caminho do tema
     */
    async validateSecurity(themePath) {
        const phpFiles = this.getPHPFiles(themePath);
        
        for (const file of phpFiles) {
            await this.validateFileSecurity(path.join(themePath, file));
        }
    }

    /**
     * Valida segurança de um arquivo PHP
     * @param {string} filePath - Caminho do arquivo
     */
    async validateFileSecurity(filePath) {
        const content = fs.readFileSync(filePath, 'utf8');
        const fileName = path.basename(filePath);
        
        // Verificar funções perigosas
        const dangerousFunctions = [
            'eval(',
            'exec(',
            'system(',
            'shell_exec(',
            'passthru(',
            'file_get_contents($_',
            '$_GET',
            '$_POST',
            '$_REQUEST'
        ];
        
        for (const dangerous of dangerousFunctions) {
            if (content.includes(dangerous)) {
                if (dangerous.startsWith('$_')) {
                    // Verificar se há sanitização
                    const lines = content.split('\n');
                    for (let i = 0; i < lines.length; i++) {
                        if (lines[i].includes(dangerous)) {
                            const nextLines = lines.slice(i, i + 3).join(' ');
                            if (!nextLines.includes('sanitize_') && !nextLines.includes('wp_kses')) {
                                this.addError('UNSANITIZED_INPUT', `Entrada não sanitizada em ${fileName}: ${dangerous}`);
                            }
                        }
                    }
                } else {
                    this.addError('DANGEROUS_FUNCTION', `Função perigosa encontrada em ${fileName}: ${dangerous}`);
                }
            }
        }
        
        // Verificar nonces em formulários
        if (content.includes('<form') && !content.includes('wp_nonce_field')) {
            this.addWarning('MISSING_NONCE', `Formulário sem nonce em ${fileName}`);
        }
        
        // Verificar SQL direto
        if (content.includes('mysql_') || content.includes('mysqli_')) {
            this.addError('DIRECT_SQL', `SQL direto encontrado em ${fileName}, use $wpdb`);
        }
    }

    /**
     * Validações de performance
     * @param {string} themePath - Caminho do tema
     */
    async validatePerformance(themePath) {
        const functionsPath = path.join(themePath, 'functions.php');
        
        if (fs.existsSync(functionsPath)) {
            const content = fs.readFileSync(functionsPath, 'utf8');
            
            // Verificar enfileiramento de scripts
            if (content.includes('<script') || content.includes('<link')) {
                this.addWarning('INLINE_ASSETS', 'Evite incluir assets inline, use wp_enqueue_script/style');
            }
            
            // Verificar otimizações
            if (!content.includes('wp_enqueue_script')) {
                this.addWarning('NO_SCRIPT_ENQUEUE', 'Nenhum script enfileirado encontrado');
            }
            
            if (!content.includes('wp_enqueue_style')) {
                this.addWarning('NO_STYLE_ENQUEUE', 'Nenhum estilo enfileirado encontrado');
            }
        }
        
        // Verificar tamanho dos arquivos
        const files = this.getAllFiles(themePath);
        for (const file of files) {
            const stats = fs.statSync(file);
            const fileName = path.basename(file);
            
            if (fileName.endsWith('.css') && stats.size > 100000) {
                this.addWarning('LARGE_CSS_FILE', `Arquivo CSS grande: ${fileName} (${Math.round(stats.size/1024)}KB)`);
            }
            
            if (fileName.endsWith('.js') && stats.size > 50000) {
                this.addWarning('LARGE_JS_FILE', `Arquivo JS grande: ${fileName} (${Math.round(stats.size/1024)}KB)`);
            }
        }
    }

    /**
     * Validações de acessibilidade
     * @param {string} themePath - Caminho do tema
     */
    async validateAccessibility(themePath) {
        const templateFiles = this.getTemplateFiles(themePath);
        
        for (const file of templateFiles) {
            const filePath = path.join(themePath, file);
            if (fs.existsSync(filePath)) {
                await this.validateFileAccessibility(filePath);
            }
        }
    }

    /**
     * Valida acessibilidade de um arquivo
     * @param {string} filePath - Caminho do arquivo
     */
    async validateFileAccessibility(filePath) {
        const content = fs.readFileSync(filePath, 'utf8');
        const fileName = path.basename(filePath);
        
        // Verificar elementos de acessibilidade
        if (content.includes('<img') && !content.includes('alt=')) {
            this.addWarning('MISSING_ALT_TEXT', `Imagens sem alt text em ${fileName}`);
        }
        
        if (content.includes('<a') && content.includes('href="#"') && !content.includes('aria-label')) {
            this.addWarning('MISSING_ARIA_LABEL', `Links sem aria-label em ${fileName}`);
        }
        
        // Verificar estrutura de headings
        const headings = content.match(/<h[1-6]/g);
        if (headings && headings.length > 0) {
            const levels = headings.map(h => parseInt(h.charAt(2)));
            for (let i = 1; i < levels.length; i++) {
                if (levels[i] - levels[i-1] > 1) {
                    this.addWarning('HEADING_HIERARCHY', `Hierarquia de headings pode estar incorreta em ${fileName}`);
                    break;
                }
            }
        }
    }

    /**
     * Valida estrutura de arquivos
     * @param {string} themePath - Caminho do tema
     */
    async validateFileStructure(themePath) {
        // Verificar estrutura de diretórios recomendada
        const recommendedDirs = ['assets', 'inc', 'template-parts'];
        
        for (const dir of recommendedDirs) {
            const dirPath = path.join(themePath, dir);
            if (!fs.existsSync(dirPath)) {
                this.addInfo('MISSING_RECOMMENDED_DIR', `Diretório recomendado não encontrado: ${dir}`);
            }
        }
        
        // Verificar arquivos desnecessários
        const unnecessaryFiles = ['.DS_Store', 'Thumbs.db', '*.log', 'node_modules'];
        
        for (const pattern of unnecessaryFiles) {
            const files = this.findFilesByPattern(themePath, pattern);
            if (files.length > 0) {
                this.addWarning('UNNECESSARY_FILES', `Arquivos desnecessários encontrados: ${pattern}`);
            }
        }
    }

    /**
     * Valida qualidade do código
     * @param {string} themePath - Caminho do tema
     */
    async validateCodeQuality(themePath) {
        const phpFiles = this.getPHPFiles(themePath);
        
        for (const file of phpFiles) {
            await this.validatePHPCodeQuality(path.join(themePath, file));
        }
    }

    /**
     * Valida qualidade do código PHP
     * @param {string} filePath - Caminho do arquivo
     */
    async validatePHPCodeQuality(filePath) {
        const content = fs.readFileSync(filePath, 'utf8');
        const fileName = path.basename(filePath);
        
        // Verificar indentação
        const lines = content.split('\n');
        let inconsistentIndentation = false;
        
        for (const line of lines) {
            if (line.startsWith('\t') && line.includes('    ')) {
                inconsistentIndentation = true;
                break;
            }
        }
        
        if (inconsistentIndentation) {
            this.addWarning('INCONSISTENT_INDENTATION', `Indentação inconsistente em ${fileName}`);
        }
        
        // Verificar comentários
        const commentRatio = (content.match(/\/\*[\s\S]*?\*\/|\/\/.*$/gm) || []).length / lines.length;
        if (commentRatio < 0.1) {
            this.addInfo('LOW_COMMENT_RATIO', `Poucos comentários em ${fileName}`);
        }
        
        // Verificar funções muito longas
        const functions = content.match(/function\s+\w+\s*\([^)]*\)\s*{[^}]*}/g) || [];
        for (const func of functions) {
            const funcLines = func.split('\n').length;
            if (funcLines > 50) {
                this.addWarning('LONG_FUNCTION', `Função muito longa em ${fileName} (${funcLines} linhas)`);
            }
        }
    }

    /**
     * Extrai informações do tema do cabeçalho
     * @param {string} content - Conteúdo do style.css
     */
    extractThemeInfo(content) {
        const fields = {
            'Theme Name': 'name',
            'Description': 'description',
            'Author': 'author',
            'Version': 'version',
            'Text Domain': 'textDomain'
        };
        
        this.themeData.info = {};
        
        Object.entries(fields).forEach(([field, key]) => {
            const regex = new RegExp(`${field}:\\s*(.+)`, 'i');
            const match = content.match(regex);
            if (match) {
                this.themeData.info[key] = match[1].trim();
            }
        });
    }

    /**
     * Obtém lista de arquivos de template
     * @param {string} themePath - Caminho do tema
     * @returns {Array} Lista de arquivos
     */
    getTemplateFiles(themePath) {
        const files = [];
        const items = fs.readdirSync(themePath);
        
        items.forEach(item => {
            if (item.endsWith('.php')) {
                files.push(item);
            }
        });
        
        return files;
    }

    /**
     * Obtém lista de arquivos PHP
     * @param {string} themePath - Caminho do tema
     * @returns {Array} Lista de arquivos
     */
    getPHPFiles(themePath) {
        const files = [];
        const allFiles = this.getAllFiles(themePath);
        
        allFiles.forEach(file => {
            if (file.endsWith('.php')) {
                files.push(path.relative(themePath, file));
            }
        });
        
        return files;
    }

    /**
     * Obtém todos os arquivos recursivamente
     * @param {string} dir - Diretório
     * @returns {Array} Lista de arquivos
     */
    getAllFiles(dir) {
        const files = [];
        const items = fs.readdirSync(dir);
        
        items.forEach(item => {
            const fullPath = path.join(dir, item);
            const stat = fs.statSync(fullPath);
            
            if (stat.isDirectory()) {
                files.push(...this.getAllFiles(fullPath));
            } else {
                files.push(fullPath);
            }
        });
        
        return files;
    }

    /**
     * Encontra arquivos por padrão
     * @param {string} dir - Diretório
     * @param {string} pattern - Padrão
     * @returns {Array} Lista de arquivos
     */
    findFilesByPattern(dir, pattern) {
        const files = this.getAllFiles(dir);
        const regex = new RegExp(pattern.replace('*', '.*'));
        
        return files.filter(file => regex.test(path.basename(file)));
    }

    /**
     * Adiciona erro
     * @param {string} code - Código do erro
     * @param {string} message - Mensagem
     */
    addError(code, message) {
        this.errors.push({ code, message, type: 'error' });
    }

    /**
     * Adiciona aviso
     * @param {string} code - Código do aviso
     * @param {string} message - Mensagem
     */
    addWarning(code, message) {
        this.warnings.push({ code, message, type: 'warning' });
    }

    /**
     * Adiciona informação
     * @param {string} code - Código da informação
     * @param {string} message - Mensagem
     */
    addInfo(code, message) {
        this.info.push({ code, message, type: 'info' });
    }

    /**
     * Gera relatório da validação
     * @returns {Object} Relatório
     */
    generateReport() {
        const report = {
            summary: {
                errors: this.errors.length,
                warnings: this.warnings.length,
                info: this.info.length,
                isValid: this.errors.length === 0,
                score: this.calculateScore()
            },
            theme: this.themeData,
            results: {
                errors: this.errors,
                warnings: this.warnings,
                info: this.info
            },
            validatedAt: new Date().toISOString()
        };
        
        return report;
    }

    /**
     * Calcula pontuação do tema
     * @returns {number} Pontuação (0-100)
     */
    calculateScore() {
        let score = 100;
        
        // Penalizar erros
        score -= this.errors.length * 10;
        
        // Penalizar avisos
        score -= this.warnings.length * 2;
        
        // Garantir que não seja negativo
        return Math.max(0, score);
    }

    /**
     * Salva relatório em arquivo
     * @param {Object} report - Relatório
     * @param {string} outputPath - Caminho de saída
     */
    async saveReport(report, outputPath) {
        const dir = path.dirname(outputPath);
        if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir, { recursive: true });
        }
        
        if (this.options.outputFormat === 'json') {
            fs.writeFileSync(outputPath, JSON.stringify(report, null, 2));
        } else if (this.options.outputFormat === 'html') {
            const html = this.generateHTMLReport(report);
            fs.writeFileSync(outputPath.replace('.json', '.html'), html);
        }
        
        console.log(`📄 Relatório salvo em: ${outputPath}`);
    }

    /**
     * Gera relatório HTML
     * @param {Object} report - Relatório
     * @returns {string} HTML
     */
    generateHTMLReport(report) {
        return `<!DOCTYPE html>
<html>
<head>
    <title>Relatório de Validação - ${report.theme.info?.name || 'Tema'}</title>
    <style>
        body { font-family: Arial, sans-serif; margin: 20px; }
        .summary { background: #f5f5f5; padding: 15px; border-radius: 5px; }
        .error { color: #d32f2f; }
        .warning { color: #f57c00; }
        .info { color: #1976d2; }
        .score { font-size: 24px; font-weight: bold; }
    </style>
</head>
<body>
    <h1>Relatório de Validação</h1>
    <div class="summary">
        <h2>Resumo</h2>
        <p class="score">Pontuação: ${report.summary.score}/100</p>
        <p>Erros: ${report.summary.errors}</p>
        <p>Avisos: ${report.summary.warnings}</p>
        <p>Informações: ${report.summary.info}</p>
    </div>
    
    <h2>Resultados</h2>
    ${report.results.errors.map(item => `<p class="error">❌ ${item.message}</p>`).join('')}
    ${report.results.warnings.map(item => `<p class="warning">⚠️ ${item.message}</p>`).join('')}
    ${report.results.info.map(item => `<p class="info">ℹ️ ${item.message}</p>`).join('')}
</body>
</html>`;
    }
}

// Exportar classe
module.exports = ThemeValidator;

// CLI se executado diretamente
if (require.main === module) {
    const validator = new ThemeValidator({
        outputFormat: 'json',
        checkSecurity: true,
        checkPerformance: true,
        checkAccessibility: true
    });
    
    const themePath = process.argv[2];
    if (!themePath) {
        console.log('❌ Uso: node theme-validator.js <caminho-do-tema>');
        process.exit(1);
    }
    
    validator.validateTheme(themePath)
        .then(report => {
            console.log('\n📊 Resumo da Validação:');
            console.log(`Pontuação: ${report.summary.score}/100`);
            console.log(`Erros: ${report.summary.errors}`);
            console.log(`Avisos: ${report.summary.warnings}`);
            console.log(`Informações: ${report.summary.info}`);
            
            if (report.summary.isValid) {
                console.log('\n✅ Tema válido!');
            } else {
                console.log('\n❌ Tema possui erros que precisam ser corrigidos.');
            }
            
            // Salvar relatório
            const outputPath = `./validation-report-${Date.now()}.json`;
            return validator.saveReport(report, outputPath);
        })
        .catch(error => {
            console.error('❌ Erro na validação:', error.message);
            process.exit(1);
        });
}