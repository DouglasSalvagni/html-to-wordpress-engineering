/**
 * HTML Analyzer - Ferramenta para análise e mapeamento de componentes HTML
 * 
 * Este script analisa arquivos HTML estáticos e identifica componentes reutilizáveis,
 * gerando mapeamentos para conversão em temas WordPress.
 * 
 * @author WordPress Creator Context Engineering
 * @version 1.0.0
 */

const fs = require('fs');
const path = require('path');
const { JSDOM } = require('jsdom');
const yaml = require('js-yaml');

class HTMLAnalyzer {
    constructor(options = {}) {
        this.options = {
            outputDir: options.outputDir || './output',
            includeCSS: options.includeCSS || true,
            includeJS: options.includeJS || true,
            minComponentSize: options.minComponentSize || 3, // Mínimo de elementos para ser considerado componente
            ...options
        };
        
        this.components = new Map();
        this.assets = {
            css: [],
            js: [],
            images: [],
            fonts: []
        };
        this.metadata = {
            title: '',
            description: '',
            keywords: [],
            author: '',
            viewport: '',
            charset: 'UTF-8'
        };
    }

    /**
     * Analisa um arquivo HTML
     * @param {string} filePath - Caminho para o arquivo HTML
     * @returns {Object} Resultado da análise
     */
    async analyzeFile(filePath) {
        try {
            console.log(`🔍 Analisando arquivo: ${filePath}`);
            
            const htmlContent = fs.readFileSync(filePath, 'utf8');
            const dom = new JSDOM(htmlContent);
            const document = dom.window.document;
            
            // Extrair metadados
            this.extractMetadata(document);
            
            // Identificar assets
            this.extractAssets(document);
            
            // Identificar componentes
            this.identifyComponents(document);
            
            // Gerar relatório
            const report = this.generateReport(filePath);
            
            console.log(`✅ Análise concluída: ${this.components.size} componentes identificados`);
            
            return report;
            
        } catch (error) {
            console.error(`❌ Erro ao analisar arquivo ${filePath}:`, error.message);
            throw error;
        }
    }

    /**
     * Extrai metadados do documento HTML
     * @param {Document} document - Documento DOM
     */
    extractMetadata(document) {
        // Título
        const titleElement = document.querySelector('title');
        this.metadata.title = titleElement ? titleElement.textContent.trim() : '';
        
        // Meta tags
        const metaTags = document.querySelectorAll('meta');
        metaTags.forEach(meta => {
            const name = meta.getAttribute('name') || meta.getAttribute('property');
            const content = meta.getAttribute('content');
            
            if (name && content) {
                switch (name.toLowerCase()) {
                    case 'description':
                    case 'og:description':
                        this.metadata.description = content;
                        break;
                    case 'keywords':
                        this.metadata.keywords = content.split(',').map(k => k.trim());
                        break;
                    case 'author':
                        this.metadata.author = content;
                        break;
                    case 'viewport':
                        this.metadata.viewport = content;
                        break;
                }
            }
            
            if (meta.getAttribute('charset')) {
                this.metadata.charset = meta.getAttribute('charset');
            }
        });
    }

    /**
     * Extrai assets (CSS, JS, imagens, fontes)
     * @param {Document} document - Documento DOM
     */
    extractAssets(document) {
        // CSS
        const cssLinks = document.querySelectorAll('link[rel="stylesheet"], style');
        cssLinks.forEach(link => {
            if (link.tagName === 'LINK') {
                this.assets.css.push({
                    type: 'external',
                    href: link.getAttribute('href'),
                    media: link.getAttribute('media') || 'all'
                });
            } else {
                this.assets.css.push({
                    type: 'inline',
                    content: link.textContent
                });
            }
        });
        
        // JavaScript
        const scripts = document.querySelectorAll('script');
        scripts.forEach(script => {
            if (script.getAttribute('src')) {
                this.assets.js.push({
                    type: 'external',
                    src: script.getAttribute('src'),
                    async: script.hasAttribute('async'),
                    defer: script.hasAttribute('defer')
                });
            } else if (script.textContent.trim()) {
                this.assets.js.push({
                    type: 'inline',
                    content: script.textContent
                });
            }
        });
        
        // Imagens
        const images = document.querySelectorAll('img, [style*="background-image"]');
        images.forEach(img => {
            if (img.tagName === 'IMG') {
                this.assets.images.push({
                    src: img.getAttribute('src'),
                    alt: img.getAttribute('alt') || '',
                    title: img.getAttribute('title') || '',
                    loading: img.getAttribute('loading') || 'eager'
                });
            } else {
                // Extrair background-image do style
                const style = img.getAttribute('style');
                const bgMatch = style.match(/background-image:\s*url\(['"]?([^'"\)]+)['"]?\)/);
                if (bgMatch) {
                    this.assets.images.push({
                        src: bgMatch[1],
                        type: 'background',
                        element: img.tagName.toLowerCase()
                    });
                }
            }
        });
        
        // Fontes
        const fontLinks = document.querySelectorAll('link[href*="font"], link[href*="googleapis.com/css"]');
        fontLinks.forEach(link => {
            this.assets.fonts.push({
                href: link.getAttribute('href'),
                family: this.extractFontFamily(link.getAttribute('href'))
            });
        });
    }

    /**
     * Identifica componentes reutilizáveis no HTML
     * @param {Document} document - Documento DOM
     */
    identifyComponents(document) {
        // Identificar seções principais
        const sections = document.querySelectorAll('section, .section, header, footer, nav, main, aside');
        
        sections.forEach((section, index) => {
            const component = this.analyzeElement(section, `component_${index + 1}`);
            if (component && this.isValidComponent(component)) {
                this.components.set(component.id, component);
            }
        });
        
        // Identificar componentes por classes comuns
        const commonComponents = [
            { selector: '.hero, .banner, .jumbotron', type: 'hero' },
            { selector: '.services, .features', type: 'services' },
            { selector: '.about, .about-us', type: 'about' },
            { selector: '.team, .staff', type: 'team' },
            { selector: '.testimonials, .reviews', type: 'testimonials' },
            { selector: '.contact, .contact-form', type: 'contact' },
            { selector: '.portfolio, .gallery, .projects', type: 'portfolio' },
            { selector: '.blog, .news, .articles', type: 'blog' },
            { selector: '.cta, .call-to-action', type: 'cta' },
            { selector: '.stats, .statistics, .counters', type: 'stats' }
        ];
        
        commonComponents.forEach(({ selector, type }) => {
            const elements = document.querySelectorAll(selector);
            elements.forEach((element, index) => {
                const id = `${type}_${index + 1}`;
                if (!this.components.has(id)) {
                    const component = this.analyzeElement(element, id, type);
                    if (component && this.isValidComponent(component)) {
                        this.components.set(id, component);
                    }
                }
            });
        });
    }

    /**
     * Analisa um elemento específico
     * @param {Element} element - Elemento DOM
     * @param {string} id - ID do componente
     * @param {string} type - Tipo do componente
     * @returns {Object} Dados do componente
     */
    analyzeElement(element, id, type = null) {
        const component = {
            id,
            type: type || this.detectComponentType(element),
            tagName: element.tagName.toLowerCase(),
            classes: Array.from(element.classList),
            attributes: this.getElementAttributes(element),
            children: [],
            fields: [],
            html: element.outerHTML,
            textContent: element.textContent.trim(),
            structure: this.analyzeStructure(element)
        };
        
        // Identificar campos editáveis
        component.fields = this.identifyFields(element);
        
        // Analisar elementos filhos importantes
        const importantChildren = element.querySelectorAll('h1, h2, h3, h4, h5, h6, p, img, a, button, input, textarea, select');
        importantChildren.forEach(child => {
            if (child.parentElement === element) {
                component.children.push({
                    tagName: child.tagName.toLowerCase(),
                    classes: Array.from(child.classList),
                    textContent: child.textContent.trim(),
                    attributes: this.getElementAttributes(child)
                });
            }
        });
        
        return component;
    }

    /**
     * Detecta o tipo do componente baseado em sua estrutura
     * @param {Element} element - Elemento DOM
     * @returns {string} Tipo do componente
     */
    detectComponentType(element) {
        const classes = element.className.toLowerCase();
        const id = element.id.toLowerCase();
        const content = element.textContent.toLowerCase();
        
        // Verificar por palavras-chave
        if (classes.includes('hero') || classes.includes('banner') || classes.includes('jumbotron')) {
            return 'hero';
        }
        if (classes.includes('service') || classes.includes('feature')) {
            return 'services';
        }
        if (classes.includes('about')) {
            return 'about';
        }
        if (classes.includes('team') || classes.includes('staff')) {
            return 'team';
        }
        if (classes.includes('testimonial') || classes.includes('review')) {
            return 'testimonials';
        }
        if (classes.includes('contact') || element.querySelector('form')) {
            return 'contact';
        }
        if (classes.includes('portfolio') || classes.includes('gallery')) {
            return 'portfolio';
        }
        if (classes.includes('cta') || classes.includes('call-to-action')) {
            return 'cta';
        }
        if (classes.includes('stat') || classes.includes('counter')) {
            return 'stats';
        }
        
        // Verificar por estrutura
        if (element.tagName === 'HEADER') return 'header';
        if (element.tagName === 'FOOTER') return 'footer';
        if (element.tagName === 'NAV') return 'navigation';
        if (element.tagName === 'ASIDE') return 'sidebar';
        
        return 'generic';
    }

    /**
     * Identifica campos editáveis no componente
     * @param {Element} element - Elemento DOM
     * @returns {Array} Lista de campos
     */
    identifyFields(element) {
        const fields = [];
        
        // Títulos
        const headings = element.querySelectorAll('h1, h2, h3, h4, h5, h6');
        headings.forEach((heading, index) => {
            fields.push({
                name: `${heading.tagName.toLowerCase()}_${index + 1}`,
                type: 'text',
                label: `Título ${heading.tagName.slice(1)}`,
                value: heading.textContent.trim(),
                selector: this.generateSelector(heading)
            });
        });
        
        // Parágrafos
        const paragraphs = element.querySelectorAll('p');
        paragraphs.forEach((p, index) => {
            if (p.textContent.trim().length > 10) {
                fields.push({
                    name: `paragraph_${index + 1}`,
                    type: 'textarea',
                    label: `Parágrafo ${index + 1}`,
                    value: p.textContent.trim(),
                    selector: this.generateSelector(p)
                });
            }
        });
        
        // Imagens
        const images = element.querySelectorAll('img');
        images.forEach((img, index) => {
            fields.push({
                name: `image_${index + 1}`,
                type: 'image',
                label: `Imagem ${index + 1}`,
                value: img.getAttribute('src'),
                alt: img.getAttribute('alt') || '',
                selector: this.generateSelector(img)
            });
        });
        
        // Links/Botões
        const links = element.querySelectorAll('a, button');
        links.forEach((link, index) => {
            fields.push({
                name: `link_${index + 1}`,
                type: 'link',
                label: `Link ${index + 1}`,
                text: link.textContent.trim(),
                url: link.getAttribute('href') || '#',
                selector: this.generateSelector(link)
            });
        });
        
        return fields;
    }

    /**
     * Gera um seletor CSS único para um elemento
     * @param {Element} element - Elemento DOM
     * @returns {string} Seletor CSS
     */
    generateSelector(element) {
        if (element.id) {
            return `#${element.id}`;
        }
        
        if (element.className) {
            const classes = Array.from(element.classList).join('.');
            return `.${classes}`;
        }
        
        // Gerar seletor baseado na posição
        const parent = element.parentElement;
        if (parent) {
            const siblings = Array.from(parent.children).filter(child => child.tagName === element.tagName);
            const index = siblings.indexOf(element) + 1;
            return `${element.tagName.toLowerCase()}:nth-of-type(${index})`;
        }
        
        return element.tagName.toLowerCase();
    }

    /**
     * Analisa a estrutura do elemento
     * @param {Element} element - Elemento DOM
     * @returns {Object} Dados da estrutura
     */
    analyzeStructure(element) {
        return {
            depth: this.getElementDepth(element),
            childCount: element.children.length,
            textNodes: this.getTextNodes(element).length,
            hasForm: !!element.querySelector('form'),
            hasImages: !!element.querySelector('img'),
            hasLinks: !!element.querySelector('a'),
            hasLists: !!element.querySelector('ul, ol'),
            hasTable: !!element.querySelector('table')
        };
    }

    /**
     * Obtém a profundidade do elemento na árvore DOM
     * @param {Element} element - Elemento DOM
     * @returns {number} Profundidade
     */
    getElementDepth(element) {
        let depth = 0;
        let parent = element.parentElement;
        while (parent) {
            depth++;
            parent = parent.parentElement;
        }
        return depth;
    }

    /**
     * Obtém nós de texto do elemento
     * @param {Element} element - Elemento DOM
     * @returns {Array} Nós de texto
     */
    getTextNodes(element) {
        const textNodes = [];
        const walker = element.ownerDocument.createTreeWalker(
            element,
            element.ownerDocument.defaultView.NodeFilter.SHOW_TEXT,
            null,
            false
        );
        
        let node;
        while (node = walker.nextNode()) {
            if (node.textContent.trim()) {
                textNodes.push(node);
            }
        }
        
        return textNodes;
    }

    /**
     * Obtém atributos do elemento
     * @param {Element} element - Elemento DOM
     * @returns {Object} Atributos
     */
    getElementAttributes(element) {
        const attributes = {};
        for (let attr of element.attributes) {
            attributes[attr.name] = attr.value;
        }
        return attributes;
    }

    /**
     * Verifica se um componente é válido
     * @param {Object} component - Dados do componente
     * @returns {boolean} Se é válido
     */
    isValidComponent(component) {
        return component.children.length >= this.options.minComponentSize ||
               component.fields.length > 0 ||
               component.textContent.length > 50;
    }

    /**
     * Extrai família de fonte de uma URL
     * @param {string} url - URL da fonte
     * @returns {string} Nome da família
     */
    extractFontFamily(url) {
        const match = url.match(/family=([^&:]+)/);
        return match ? decodeURIComponent(match[1].replace(/\+/g, ' ')) : 'Unknown';
    }

    /**
     * Gera relatório da análise
     * @param {string} filePath - Caminho do arquivo analisado
     * @returns {Object} Relatório
     */
    generateReport(filePath) {
        const report = {
            file: path.basename(filePath),
            analyzedAt: new Date().toISOString(),
            metadata: this.metadata,
            assets: this.assets,
            components: Array.from(this.components.values()),
            summary: {
                totalComponents: this.components.size,
                componentTypes: this.getComponentTypesSummary(),
                totalAssets: {
                    css: this.assets.css.length,
                    js: this.assets.js.length,
                    images: this.assets.images.length,
                    fonts: this.assets.fonts.length
                }
            }
        };
        
        return report;
    }

    /**
     * Obtém resumo dos tipos de componentes
     * @returns {Object} Resumo dos tipos
     */
    getComponentTypesSummary() {
        const types = {};
        this.components.forEach(component => {
            types[component.type] = (types[component.type] || 0) + 1;
        });
        return types;
    }

    /**
     * Salva o relatório em arquivo
     * @param {Object} report - Relatório da análise
     * @param {string} outputPath - Caminho de saída
     */
    async saveReport(report, outputPath) {
        try {
            // Criar diretório se não existir
            const dir = path.dirname(outputPath);
            if (!fs.existsSync(dir)) {
                fs.mkdirSync(dir, { recursive: true });
            }
            
            // Salvar como JSON
            const jsonPath = outputPath.replace(/\.[^.]+$/, '.json');
            fs.writeFileSync(jsonPath, JSON.stringify(report, null, 2));
            
            // Salvar como YAML
            const yamlPath = outputPath.replace(/\.[^.]+$/, '.yaml');
            fs.writeFileSync(yamlPath, yaml.dump(report, { indent: 2 }));
            
            console.log(`📄 Relatório salvo em: ${jsonPath}`);
            console.log(`📄 Relatório salvo em: ${yamlPath}`);
            
        } catch (error) {
            console.error('❌ Erro ao salvar relatório:', error.message);
            throw error;
        }
    }

    /**
     * Gera mapeamento WordPress
     * @param {Object} report - Relatório da análise
     * @returns {Object} Mapeamento WordPress
     */
    generateWordPressMapping(report) {
        const mapping = {
            theme_info: {
                name: report.metadata.title || 'Tema Convertido',
                description: report.metadata.description || 'Tema convertido automaticamente',
                author: report.metadata.author || 'WordPress Creator',
                version: '1.0.0',
                text_domain: this.slugify(report.metadata.title || 'converted-theme')
            },
            pages: {
                home: {
                    template: 'front-page.php',
                    components: report.components.map(comp => comp.id)
                }
            },
            components: {},
            custom_fields: {},
            assets: {
                css: report.assets.css,
                js: report.assets.js,
                images: report.assets.images,
                fonts: report.assets.fonts
            }
        };
        
        // Mapear componentes
        report.components.forEach(component => {
            mapping.components[component.id] = {
                type: component.type,
                template_part: `template-parts/${component.type}.php`,
                fields: component.fields.map(field => field.name),
                html_structure: component.html
            };
            
            // Mapear campos customizados
            component.fields.forEach(field => {
                mapping.custom_fields[field.name] = {
                    type: field.type,
                    label: field.label,
                    default_value: field.value || field.text || field.url || '',
                    component: component.id
                };
            });
        });
        
        return mapping;
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
}

// Exportar classe
module.exports = HTMLAnalyzer;

// CLI se executado diretamente
if (require.main === module) {
    const analyzer = new HTMLAnalyzer();
    
    const filePath = process.argv[2];
    if (!filePath) {
        console.log('❌ Uso: node html-analyzer.js <caminho-do-arquivo.html>');
        process.exit(1);
    }
    
    if (!fs.existsSync(filePath)) {
        console.log(`❌ Arquivo não encontrado: ${filePath}`);
        process.exit(1);
    }
    
    analyzer.analyzeFile(filePath)
        .then(report => {
            const outputPath = path.join('./output', `${path.basename(filePath, '.html')}-analysis`);
            return analyzer.saveReport(report, outputPath);
        })
        .then(() => {
            console.log('✅ Análise concluída com sucesso!');
        })
        .catch(error => {
            console.error('❌ Erro na análise:', error.message);
            process.exit(1);
        });
}