/**
 * Theme Generator - Gerador automático de temas WordPress
 * 
 * Este script gera temas WordPress completos baseado na análise de HTML estático,
 * criando todos os arquivos necessários com base nos templates e mapeamentos.
 * 
 * @author WordPress Creator Context Engineering
 * @version 1.0.0
 */

const fs = require('fs');
const path = require('path');
const yaml = require('js-yaml');
const Handlebars = require('handlebars');

class ThemeGenerator {
    constructor(options = {}) {
        this.options = {
            templatesDir: options.templatesDir || '../templates',
            outputDir: options.outputDir || './generated-themes',
            themeType: options.themeType || 'classic', // 'classic' ou 'block'
            includeElementor: options.includeElementor || true,
            includeSecurity: options.includeSecurity || true,
            includePerformance: options.includePerformance || true,
            ...options
        };
        
        this.templates = new Map();
        this.helpers = new Map();
        this.themeData = {};
        
        this.initializeHandlebars();
    }

    /**
     * Inicializa Handlebars com helpers customizados
     */
    initializeHandlebars() {
        // Helper para slugify
        Handlebars.registerHelper('slugify', (text) => {
            return this.slugify(text);
        });
        
        // Helper para uppercase
        Handlebars.registerHelper('uppercase', (text) => {
            return text.toUpperCase();
        });
        
        // Helper para capitalize
        Handlebars.registerHelper('capitalize', (text) => {
            return text.charAt(0).toUpperCase() + text.slice(1);
        });
        
        // Helper para escape PHP
        Handlebars.registerHelper('escapePHP', (text) => {
            return text.replace(/'/g, "\\'")
                      .replace(/"/g, '\\"')
                      .replace(/\n/g, '\\n');
        });
        
        // Helper para gerar text domain
        Handlebars.registerHelper('textDomain', (themeName) => {
            return this.slugify(themeName);
        });
        
        // Helper para gerar prefixo de função
        Handlebars.registerHelper('functionPrefix', (themeName) => {
            return this.slugify(themeName).replace(/-/g, '_');
        });
        
        // Helper para condicionais
        Handlebars.registerHelper('ifEquals', function(arg1, arg2, options) {
            return (arg1 == arg2) ? options.fn(this) : options.inverse(this);
        });
        
        // Helper para loops com índice
        Handlebars.registerHelper('eachWithIndex', function(array, options) {
            let result = '';
            for (let i = 0; i < array.length; i++) {
                result += options.fn({...array[i], index: i, isFirst: i === 0, isLast: i === array.length - 1});
            }
            return result;
        });
    }

    /**
     * Carrega templates do diretório
     */
    async loadTemplates() {
        try {
            const templateType = this.options.themeType;
            const templatesPath = path.resolve(__dirname, this.options.templatesDir, `${templateType}-theme`);
            
            console.log(`📂 Carregando templates de: ${templatesPath}`);
            
            if (!fs.existsSync(templatesPath)) {
                throw new Error(`Diretório de templates não encontrado: ${templatesPath}`);
            }
            
            const files = this.getAllFiles(templatesPath);
            
            for (const file of files) {
                const relativePath = path.relative(templatesPath, file);
                const content = fs.readFileSync(file, 'utf8');
                
                this.templates.set(relativePath, {
                    path: relativePath,
                    content: content,
                    compiled: Handlebars.compile(content)
                });
            }
            
            console.log(`✅ ${this.templates.size} templates carregados`);
            
        } catch (error) {
            console.error('❌ Erro ao carregar templates:', error.message);
            throw error;
        }
    }

    /**
     * Gera tema WordPress baseado no mapeamento
     * @param {Object} mapping - Mapeamento do projeto
     * @param {Object} analysis - Análise HTML (opcional)
     * @returns {string} Caminho do tema gerado
     */
    async generateTheme(mapping, analysis = null) {
        try {
            console.log(`🚀 Iniciando geração do tema: ${mapping.theme_info.name}`);
            
            // Preparar dados do tema
            this.prepareThemeData(mapping, analysis);
            
            // Carregar templates
            await this.loadTemplates();
            
            // Criar diretório do tema
            const themeDir = await this.createThemeDirectory();
            
            // Gerar arquivos do tema
            await this.generateThemeFiles(themeDir);
            
            // Gerar template parts
            await this.generateTemplateParts(themeDir);
            
            // Gerar assets
            await this.generateAssets(themeDir);
            
            // Gerar arquivos de configuração
            await this.generateConfigFiles(themeDir);
            
            console.log(`✅ Tema gerado com sucesso em: ${themeDir}`);
            
            return themeDir;
            
        } catch (error) {
            console.error('❌ Erro na geração do tema:', error.message);
            throw error;
        }
    }

    /**
     * Prepara dados do tema para os templates
     * @param {Object} mapping - Mapeamento do projeto
     * @param {Object} analysis - Análise HTML
     */
    prepareThemeData(mapping, analysis) {
        this.themeData = {
            // Informações básicas
            theme_name: mapping.theme_info.name,
            theme_slug: this.slugify(mapping.theme_info.name),
            theme_description: mapping.theme_info.description,
            theme_author: mapping.theme_info.author,
            theme_version: mapping.theme_info.version,
            text_domain: mapping.theme_info.text_domain,
            function_prefix: this.slugify(mapping.theme_info.name).replace(/-/g, '_'),
            
            // Configurações
            theme_type: this.options.themeType,
            include_elementor: this.options.includeElementor,
            include_security: this.options.includeSecurity,
            include_performance: this.options.includePerformance,
            
            // Componentes e páginas
            components: mapping.components || {},
            pages: mapping.pages || {},
            custom_fields: mapping.custom_fields || {},
            
            // Assets
            assets: mapping.assets || { css: [], js: [], images: [], fonts: [] },
            
            // Dados da análise HTML
            html_analysis: analysis,
            
            // Metadados
            generated_at: new Date().toISOString(),
            generator_version: '1.0.0'
        };
        
        // Processar componentes para template parts
        this.processComponents();
        
        // Processar campos customizados
        this.processCustomFields();
    }

    /**
     * Processa componentes para geração de template parts
     */
    processComponents() {
        const processedComponents = {};
        
        Object.entries(this.themeData.components).forEach(([id, component]) => {
            processedComponents[id] = {
                ...component,
                template_file: `template-parts/${component.type || 'generic'}.php`,
                function_name: `${this.themeData.function_prefix}_render_${id}`,
                hook_name: `${this.themeData.text_domain}_${id}`,
                fields: this.getComponentFields(id)
            };
        });
        
        this.themeData.processed_components = processedComponents;
    }

    /**
     * Processa campos customizados
     */
    processCustomFields() {
        const fieldGroups = {};
        
        Object.entries(this.themeData.custom_fields).forEach(([fieldName, field]) => {
            const component = field.component || 'global';
            
            if (!fieldGroups[component]) {
                fieldGroups[component] = {
                    title: `Campos - ${component}`,
                    fields: []
                };
            }
            
            fieldGroups[component].fields.push({
                name: fieldName,
                ...field,
                acf_type: this.mapFieldTypeToACF(field.type)
            });
        });
        
        this.themeData.field_groups = fieldGroups;
    }

    /**
     * Mapeia tipos de campo para ACF
     * @param {string} type - Tipo do campo
     * @returns {string} Tipo ACF
     */
    mapFieldTypeToACF(type) {
        const mapping = {
            'text': 'text',
            'textarea': 'textarea',
            'image': 'image',
            'link': 'link',
            'number': 'number',
            'email': 'email',
            'url': 'url',
            'select': 'select',
            'checkbox': 'checkbox',
            'radio': 'radio',
            'date': 'date_picker',
            'color': 'color_picker'
        };
        
        return mapping[type] || 'text';
    }

    /**
     * Obtém campos de um componente
     * @param {string} componentId - ID do componente
     * @returns {Array} Lista de campos
     */
    getComponentFields(componentId) {
        return Object.entries(this.themeData.custom_fields)
            .filter(([_, field]) => field.component === componentId)
            .map(([name, field]) => ({ name, ...field }));
    }

    /**
     * Cria diretório do tema
     * @returns {string} Caminho do diretório
     */
    async createThemeDirectory() {
        const themeDir = path.join(this.options.outputDir, this.themeData.theme_slug);
        
        if (fs.existsSync(themeDir)) {
            console.log(`⚠️  Diretório já existe, será sobrescrito: ${themeDir}`);
            fs.rmSync(themeDir, { recursive: true, force: true });
        }
        
        fs.mkdirSync(themeDir, { recursive: true });
        
        // Criar subdiretórios
        const subdirs = [
            'template-parts',
            'inc',
            'assets/css',
            'assets/js',
            'assets/images',
            'languages'
        ];
        
        if (this.options.themeType === 'block') {
            subdirs.push('templates', 'parts', 'patterns');
        }
        
        subdirs.forEach(subdir => {
            fs.mkdirSync(path.join(themeDir, subdir), { recursive: true });
        });
        
        return themeDir;
    }

    /**
     * Gera arquivos principais do tema
     * @param {string} themeDir - Diretório do tema
     */
    async generateThemeFiles(themeDir) {
        console.log('📝 Gerando arquivos principais do tema...');
        
        const mainFiles = [
            'style.css',
            'functions.php',
            'index.php',
            'header.php',
            'footer.php'
        ];
        
        if (this.options.themeType === 'block') {
            mainFiles.push('theme.json');
        } else {
            mainFiles.push(
                'single.php',
                'page.php',
                'archive.php',
                'search.php',
                '404.php',
                'sidebar.php'
            );
        }
        
        for (const file of mainFiles) {
            if (this.templates.has(file)) {
                const template = this.templates.get(file);
                const content = template.compiled(this.themeData);
                
                fs.writeFileSync(path.join(themeDir, file), content);
                console.log(`  ✅ ${file}`);
            }
        }
    }

    /**
     * Gera template parts
     * @param {string} themeDir - Diretório do tema
     */
    async generateTemplateParts(themeDir) {
        console.log('🧩 Gerando template parts...');
        
        const templatePartsDir = path.join(themeDir, 'template-parts');
        
        // Gerar template parts para cada componente
        Object.entries(this.themeData.processed_components).forEach(([id, component]) => {
            const templateContent = this.generateComponentTemplate(component);
            const fileName = `${component.type || 'generic'}.php`;
            
            fs.writeFileSync(path.join(templatePartsDir, fileName), templateContent);
            console.log(`  ✅ template-parts/${fileName}`);
        });
        
        // Template parts padrão
        const defaultParts = ['content.php', 'content-single.php', 'content-page.php'];
        
        defaultParts.forEach(part => {
            if (this.templates.has(`template-parts/${part}`)) {
                const template = this.templates.get(`template-parts/${part}`);
                const content = template.compiled(this.themeData);
                
                fs.writeFileSync(path.join(templatePartsDir, part), content);
                console.log(`  ✅ template-parts/${part}`);
            }
        });
    }

    /**
     * Gera template para um componente específico
     * @param {Object} component - Dados do componente
     * @returns {string} Código PHP do template
     */
    generateComponentTemplate(component) {
        let template = `<?php
/**
 * Template Part: ${component.type}
 * 
 * @package ${this.themeData.theme_name}
 */

`;
        
        // Adicionar campos ACF
        if (component.fields && component.fields.length > 0) {
            template += `// Campos customizados\n`;
            component.fields.forEach(field => {
                template += `$${field.name} = get_field('${field.name}');\n`;
            });
            template += `\n`;
        }
        
        // Estrutura HTML baseada no componente original
        if (component.html_structure) {
            template += `// Estrutura HTML convertida\n`;
            template += this.convertHTMLtoPHP(component.html_structure, component.fields);
        } else {
            // Template genérico
            template += this.generateGenericTemplate(component);
        }
        
        return template;
    }

    /**
     * Converte HTML estático para PHP dinâmico
     * @param {string} html - HTML original
     * @param {Array} fields - Campos do componente
     * @returns {string} Código PHP
     */
    convertHTMLtoPHP(html, fields = []) {
        let phpCode = html;
        
        // Substituir textos por campos ACF
        fields.forEach(field => {
            if (field.type === 'text' || field.type === 'textarea') {
                const regex = new RegExp(this.escapeRegex(field.default_value || ''), 'gi');
                phpCode = phpCode.replace(regex, `<?php echo esc_html($${field.name}); ?>`);
            } else if (field.type === 'image') {
                const regex = new RegExp(`src=["']${this.escapeRegex(field.default_value || '')}["']`, 'gi');
                phpCode = phpCode.replace(regex, `src="<?php echo esc_url($${field.name}['url']); ?>" alt="<?php echo esc_attr($${field.name}['alt']); ?>"`);
            } else if (field.type === 'link') {
                const regex = new RegExp(`href=["']${this.escapeRegex(field.url || '#')}["']`, 'gi');
                phpCode = phpCode.replace(regex, `href="<?php echo esc_url($${field.name}['url']); ?>"`);
                
                if (field.text) {
                    const textRegex = new RegExp(this.escapeRegex(field.text), 'gi');
                    phpCode = phpCode.replace(textRegex, `<?php echo esc_html($${field.name}['title']); ?>`);
                }
            }
        });
        
        // Adicionar echo para o HTML
        return `echo '${phpCode.replace(/'/g, "\\'")}';\n`;
    }

    /**
     * Gera template genérico para componente
     * @param {Object} component - Dados do componente
     * @returns {string} Código PHP
     */
    generateGenericTemplate(component) {
        return `<section class="${component.type}-section">\n    <div class="container">\n        <!-- Conteúdo do ${component.type} -->\n    </div>\n</section>\n`;
    }

    /**
     * Gera assets do tema
     * @param {string} themeDir - Diretório do tema
     */
    async generateAssets(themeDir) {
        console.log('🎨 Gerando assets...');
        
        const assetsDir = path.join(themeDir, 'assets');
        
        // CSS customizado
        if (this.themeData.assets.css.length > 0) {
            let customCSS = `/* CSS customizado extraído do HTML */\n\n`;
            
            this.themeData.assets.css.forEach(css => {
                if (css.type === 'inline') {
                    customCSS += css.content + '\n\n';
                }
            });
            
            fs.writeFileSync(path.join(assetsDir, 'css', 'custom.css'), customCSS);
            console.log('  ✅ assets/css/custom.css');
        }
        
        // JavaScript customizado
        if (this.themeData.assets.js.length > 0) {
            let customJS = `/* JavaScript customizado extraído do HTML */\n\n`;
            
            this.themeData.assets.js.forEach(js => {
                if (js.type === 'inline') {
                    customJS += js.content + '\n\n';
                }
            });
            
            fs.writeFileSync(path.join(assetsDir, 'js', 'custom.js'), customJS);
            console.log('  ✅ assets/js/custom.js');
        }
        
        // Arquivo principal de estilos do tema
        const mainCSS = this.generateMainCSS();
        fs.writeFileSync(path.join(assetsDir, 'css', 'theme.css'), mainCSS);
        console.log('  ✅ assets/css/theme.css');
        
        // Arquivo principal de scripts do tema
        const mainJS = this.generateMainJS();
        fs.writeFileSync(path.join(assetsDir, 'js', 'theme.js'), mainJS);
        console.log('  ✅ assets/js/theme.js');
    }

    /**
     * Gera CSS principal do tema
     * @returns {string} Código CSS
     */
    generateMainCSS() {
        return `/* Estilos principais do tema ${this.themeData.theme_name} */\n\n/* Reset e base */\n* {\n    box-sizing: border-box;\n}\n\nbody {\n    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;\n    line-height: 1.6;\n    color: #333;\n}\n\n.container {\n    max-width: 1200px;\n    margin: 0 auto;\n    padding: 0 20px;\n}\n\n/* Responsividade */\n@media (max-width: 768px) {\n    .container {\n        padding: 0 15px;\n    }\n}\n`;
    }

    /**
     * Gera JavaScript principal do tema
     * @returns {string} Código JavaScript
     */
    generateMainJS() {
        return `/* Scripts principais do tema ${this.themeData.theme_name} */\n\n(function($) {\n    'use strict';\n    \n    $(document).ready(function() {\n        // Inicialização do tema\n        console.log('Tema ${this.themeData.theme_name} carregado');\n        \n        // Menu mobile\n        $('.menu-toggle').on('click', function() {\n            $('.main-navigation').toggleClass('active');\n        });\n        \n        // Smooth scroll\n        $('a[href^="#"]').on('click', function(e) {\n            e.preventDefault();\n            const target = $(this.getAttribute('href'));\n            if (target.length) {\n                $('html, body').animate({\n                    scrollTop: target.offset().top - 80\n                }, 500);\n            }\n        });\n    });\n    \n})(jQuery);\n`;
    }

    /**
     * Gera arquivos de configuração
     * @param {string} themeDir - Diretório do tema
     */
    async generateConfigFiles(themeDir) {
        console.log('⚙️  Gerando arquivos de configuração...');
        
        // README.md
        const readme = this.generateReadme();
        fs.writeFileSync(path.join(themeDir, 'README.md'), readme);
        console.log('  ✅ README.md');
        
        // .gitignore
        const gitignore = `node_modules/\n.DS_Store\nThumbs.db\n*.log\n.env\n`;
        fs.writeFileSync(path.join(themeDir, '.gitignore'), gitignore);
        console.log('  ✅ .gitignore');
        
        // package.json (se necessário)
        if (this.options.includeNodeModules) {
            const packageJson = this.generatePackageJson();
            fs.writeFileSync(path.join(themeDir, 'package.json'), JSON.stringify(packageJson, null, 2));
            console.log('  ✅ package.json');
        }
    }

    /**
     * Gera README.md
     * @returns {string} Conteúdo do README
     */
    generateReadme() {
        return `# ${this.themeData.theme_name}\n\n${this.themeData.theme_description}\n\n## Informações do Tema\n\n- **Autor:** ${this.themeData.theme_author}\n- **Versão:** ${this.themeData.theme_version}\n- **Tipo:** ${this.themeData.theme_type === 'block' ? 'Block Theme (FSE)' : 'Classic Theme'}\n- **Gerado em:** ${new Date().toLocaleDateString('pt-BR')}\n\n## Recursos\n\n- Responsivo\n- Otimizado para SEO\n- Compatível com Gutenberg\n${this.options.includeElementor ? '- Compatível com Elementor\n' : ''}${this.options.includeSecurity ? '- Recursos de segurança\n' : ''}${this.options.includePerformance ? '- Otimizado para performance\n' : ''}\n## Instalação\n\n1. Faça upload do tema para \`/wp-content/themes/\`\n2. Ative o tema no painel administrativo\n3. Configure as opções do tema no Customizer\n\n## Suporte\n\nEste tema foi gerado automaticamente pelo WordPress Creator Context Engineering.\n`;
    }

    /**
     * Gera package.json
     * @returns {Object} Configuração do package.json
     */
    generatePackageJson() {
        return {
            name: this.themeData.theme_slug,
            version: this.themeData.theme_version,
            description: this.themeData.theme_description,
            scripts: {
                "build": "webpack --mode=production",
                "dev": "webpack --mode=development --watch"
            },
            devDependencies: {
                "webpack": "^5.0.0",
                "webpack-cli": "^4.0.0",
                "css-loader": "^6.0.0",
                "sass-loader": "^12.0.0",
                "sass": "^1.0.0"
            }
        };
    }

    /**
     * Obtém todos os arquivos de um diretório recursivamente
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
     * Converte string em slug
     * @param {string} text - Texto para converter
     * @returns {string} Slug
     */
    slugify(text) {
        return text
            .toLowerCase()
            .normalize('NFD')
            .replace(/[\u0300-\u036f]/g, '')
            .replace(/[^a-z0-9\s-]/g, '')
            .replace(/\s+/g, '-')
            .replace(/-+/g, '-')
            .trim('-');
    }

    /**
     * Escapa string para regex
     * @param {string} string - String para escapar
     * @returns {string} String escapada
     */
    escapeRegex(string) {
        return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    }
}

// Exportar classe
module.exports = ThemeGenerator;

// CLI se executado diretamente
if (require.main === module) {
    const generator = new ThemeGenerator();
    
    const mappingPath = process.argv[2];
    const analysisPath = process.argv[3];
    
    if (!mappingPath) {
        console.log('❌ Uso: node theme-generator.js <mapping.yaml> [analysis.json]');
        process.exit(1);
    }
    
    if (!fs.existsSync(mappingPath)) {
        console.log(`❌ Arquivo de mapeamento não encontrado: ${mappingPath}`);
        process.exit(1);
    }
    
    try {
        // Carregar mapeamento
        const mappingContent = fs.readFileSync(mappingPath, 'utf8');
        const mapping = yaml.load(mappingContent);
        
        // Carregar análise (opcional)
        let analysis = null;
        if (analysisPath && fs.existsSync(analysisPath)) {
            const analysisContent = fs.readFileSync(analysisPath, 'utf8');
            analysis = JSON.parse(analysisContent);
        }
        
        // Gerar tema
        generator.generateTheme(mapping, analysis)
            .then(themeDir => {
                console.log(`\n🎉 Tema gerado com sucesso!`);
                console.log(`📁 Localização: ${themeDir}`);
                console.log(`\n📋 Próximos passos:`);
                console.log(`1. Faça upload do tema para seu WordPress`);
                console.log(`2. Ative o tema no painel administrativo`);
                console.log(`3. Configure as opções no Customizer`);
            })
            .catch(error => {
                console.error('❌ Erro na geração:', error.message);
                process.exit(1);
            });
            
    } catch (error) {
        console.error('❌ Erro ao processar arquivos:', error.message);
        process.exit(1);
    }
}