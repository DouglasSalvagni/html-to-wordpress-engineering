# 📖 Manual de Uso - WordPress Creator Context Engineering

## 🎯 Como Transformar Site Estático em WordPress

Este manual explica como usar a engenharia de contexto para transformar um site estático (HTML/CSS/JS) em um tema WordPress completo usando XAMPP.

---

## 📋 **Pré-requisitos**

### ✅ Ambiente Necessário
- **XAMPP** instalado e funcionando
- **WordPress** instalado (sem tema ativo)
- **Node.js** (para scripts de automação)
- **Editor de código** com IA integrada (VS Code, Cursor, etc.)
- **Arquivos do site estático** (HTML, CSS, JS)

### ✅ Estrutura Inicial
```
xampp/htdocs/
├── seu-projeto-wordpress/
│   ├── wp-content/
│   │   └── themes/
│   │       └── (vazio - sem tema)
│   └── ...
└── wordpress-creator/
    └── context-engineering/
        └── (todos os arquivos deste sistema)
```

---

## 🚀 **Processo Completo - Passo a Passo**

### **Etapa 1: Preparação do Ambiente**

1. **Inicie o XAMPP**
   ```bash
   # Inicie Apache e MySQL
   # Acesse: http://localhost/seu-projeto-wordpress
   ```

2. **Verifique o WordPress**
   - Acesse o admin: `http://localhost/seu-projeto-wordpress/wp-admin`
   - Vá em **Aparência > Temas**
   - Confirme que não há tema ativo

3. **Organize os arquivos estáticos**
   ```
   arquivos-estaticos/
   ├── index.html
   ├── sobre.html
   ├── contato.html
   ├── css/
   │   └── style.css
   ├── js/
   │   └── script.js
   └── images/
       └── ...
   ```

### **Etapa 2: Análise Inicial com IA**

1. **Abra seu editor com IA**
2. **Carregue o contexto principal**
   ```
   Copie o conteúdo de: context-engineering/ai_context.json
   Cole no chat da IA como contexto inicial
   ```

3. **Inicie com o prompt bootstrap**
   ```
   Copie o conteúdo de: context-engineering/prompts/00-bootstrap.md
   Execute este prompt com a IA
   ```

### **Etapa 3: Análise dos Arquivos Estáticos**

1. **Use o script analisador**
   ```bash
   cd context-engineering/scripts
   node html-analyzer.js caminho/para/arquivos-estaticos
   ```

2. **Execute o prompt de análise**
   ```
   Use: context-engineering/prompts/10-ingest-static.md
   
   Forneça à IA:
   - Arquivos HTML do site estático
   - Arquivos CSS principais
   - Estrutura de navegação
   - Funcionalidades JavaScript
   ```

### **Etapa 4: Planejamento da Arquitetura**

1. **Execute o prompt de arquitetura**
   ```
   Use: context-engineering/prompts/20-architecture.md
   
   A IA irá definir:
   - Tipo de tema (clássico ou block)
   - Estrutura de páginas
   - Custom Post Types necessários
   - Taxonomias
   - Campos customizados
   ```

2. **Revise o mapeamento gerado**
   - Compare com: `context-engineering/examples/mapping.yaml`
   - Ajuste conforme necessário

### **Etapa 5: Criação da Estrutura do Tema**

1. **Execute o prompt de estrutura**
   ```
   Use: context-engineering/prompts/30-theme-skeleton.md
   
   A IA criará:
   - Estrutura de pastas do tema
   - Arquivos básicos (style.css, functions.php, etc.)
   - Templates principais
   ```

2. **Defina o diretório do tema**
   ```
   Local: xampp/htdocs/seu-projeto/wp-content/themes/seu-tema/
   ```

### **Etapa 6: Mapeamento e Regras**

1. **Execute o prompt de mapeamento**
   ```
   Use: context-engineering/prompts/40-mapping-rules.md
   
   Define:
   - Como HTML se torna templates PHP
   - Mapeamento de CSS para WordPress
   - Conversão de JavaScript
   - Estrutura de menus e widgets
   ```

### **Etapa 7: Custom Post Types e Taxonomias**

1. **Execute o prompt de CPTs**
   ```
   Use: context-engineering/prompts/50-cpts-taxonomies.md
   
   Cria:
   - Custom Post Types necessários
   - Taxonomias customizadas
   - Relacionamentos entre conteúdos
   ```

### **Etapa 8: Campos Customizados**

1. **Execute o prompt de campos**
   ```
   Use: context-engineering/prompts/60-fields-metabox.md
   
   Implementa:
   - Meta boxes
   - Campos ACF/Meta Box
   - Customizer options
   ```

2. **Use o exemplo de referência**
   - Consulte: `context-engineering/examples/fields.yaml`

### **Etapa 9: Compatibilidade com Elementor**

1. **Execute o prompt de compatibilidade**
   ```
   Use: context-engineering/prompts/70-elementor-compat.md
   
   Adiciona:
   - Suporte ao Elementor
   - Widgets customizados
   - Templates Elementor
   - Theme Builder compatibility
   ```

### **Etapa 10: Otimização e Performance**

1. **Execute o prompt de performance**
   ```
   Use: context-engineering/prompts/80-performance.md
   
   Otimiza:
   - Carregamento de assets
   - Lazy loading
   - Minificação
   - Cache
   - Core Web Vitals
   ```

### **Etapa 11: Testes e QA**

1. **Execute o prompt de testes**
   ```
   Use: context-engineering/prompts/90-qa-release.md
   ```

2. **Use o validador automático**
   ```bash
   cd context-engineering/scripts
   node theme-validator.js caminho/para/seu-tema
   ```

3. **Siga o checklist de QA**
   - Use: `context-engineering/qa/checklist.md`
   - Marque cada item verificado

---

## 🔧 **Comandos Úteis**

### **Análise de HTML**
```bash
# Analisar arquivos estáticos
node scripts/html-analyzer.js /caminho/para/site-estatico

# Gerar relatório de componentes
node scripts/html-analyzer.js /caminho/para/site-estatico --output=components.json
```

### **Geração de Tema**
```bash
# Gerar tema clássico
node scripts/theme-generator.js --type=classic --input=mapping.yaml --output=/caminho/tema

# Gerar tema block
node scripts/theme-generator.js --type=block --input=mapping.yaml --output=/caminho/tema
```

### **Validação de Tema**
```bash
# Validação completa
node scripts/theme-validator.js /caminho/para/tema

# Validação com relatório HTML
node scripts/theme-validator.js /caminho/para/tema --format=html
```

---

## 📁 **Estrutura Final do Tema**

### **Tema Clássico**
```
seu-tema/
├── style.css              # Cabeçalho e estilos principais
├── index.php              # Template principal
├── functions.php          # Funcionalidades do tema
├── header.php             # Cabeçalho
├── footer.php             # Rodapé
├── single.php             # Posts individuais
├── page.php               # Páginas
├── archive.php            # Listagens
├── search.php             # Resultados de busca
├── 404.php                # Página de erro
├── assets/
│   ├── css/
│   ├── js/
│   └── images/
├── inc/
│   ├── customizer.php
│   ├── custom-post-types.php
│   └── meta-boxes.php
└── template-parts/
    ├── header/
    ├── footer/
    └── content/
```

### **Tema Block (FSE)**
```
seu-tema/
├── style.css              # Estilos do tema
├── theme.json             # Configurações FSE
├── index.php              # Fallback
├── functions.php          # Funcionalidades
├── templates/
│   ├── index.html
│   ├── single.html
│   ├── page.html
│   └── archive.html
├── parts/
│   ├── header.html
│   ├── footer.html
│   └── navigation.html
├── patterns/
│   └── hero-section.php
└── assets/
    ├── css/
    ├── js/
    └── images/
```

---

## ⚡ **Fluxo Rápido (Resumido)**

1. **Prepare o ambiente** (XAMPP + WordPress)
2. **Carregue o contexto IA** (`ai_context.json`)
3. **Execute prompts sequenciais** (00 → 90)
4. **Use scripts de automação** quando necessário
5. **Valide com checklist** (`qa/checklist.md`)
6. **Ative o tema** no WordPress

---

## 🎯 **Exemplo Prático**

### **Cenário: Site de Empresa**

**Site estático tem:**
- Homepage com hero section
- Página sobre
- Página de serviços
- Blog
- Contato

**Resultado WordPress:**
- **Homepage**: Template customizado
- **Sobre**: Página estática
- **Serviços**: CPT "Serviços" + archive
- **Blog**: Posts nativos do WordPress
- **Contato**: Página com formulário

**Campos customizados:**
- Hero section (título, subtítulo, imagem)
- Serviços (descrição, ícone, preço)
- Depoimentos (nome, cargo, texto)

---

## 🔍 **Troubleshooting**

### **Problemas Comuns**

**❌ Tema não aparece no WordPress**
- Verifique se `style.css` tem cabeçalho correto
- Confirme que `index.php` existe
- Verifique permissões de pasta

**❌ Estilos não carregam**
- Verifique `wp_enqueue_style()` no `functions.php`
- Confirme caminhos dos arquivos CSS
- Teste com `wp_head()` no `header.php`

**❌ JavaScript não funciona**
- Verifique `wp_enqueue_script()` no `functions.php`
- Confirme dependências (jQuery, etc.)
- Teste com `wp_footer()` no `footer.php`

**❌ Custom Post Types não aparecem**
- Verifique registro no `functions.php`
- Confirme `public => true`
- Flush rewrite rules (Configurações > Links permanentes)

### **Logs e Debug**

```php
// Ativar debug no wp-config.php
define('WP_DEBUG', true);
define('WP_DEBUG_LOG', true);
define('WP_DEBUG_DISPLAY', false);

// Ver logs em: wp-content/debug.log
```

---

## 📞 **Suporte e Recursos**

### **Documentação de Referência**
- [WordPress Theme Development](https://developer.wordpress.org/themes/)
- [Block Theme Development](https://developer.wordpress.org/block-editor/how-to-guides/themes/)
- [Elementor Developers](https://developers.elementor.com/)

### **Ferramentas Úteis**
- **Theme Check Plugin**: Validação automática
- **Query Monitor**: Debug de queries
- **Debug Bar**: Informações de debug
- **Theme Unit Test**: Dados de teste

### **Checklist Final**
- [ ] Tema ativa sem erros
- [ ] Todas as páginas renderizam
- [ ] Menus funcionam
- [ ] Responsivo em mobile
- [ ] Performance adequada
- [ ] SEO básico implementado
- [ ] Compatibilidade com plugins testada

---

**🎉 Parabéns! Seu site estático agora é um tema WordPress completo!**

> **Dica**: Mantenha backups regulares e teste sempre em ambiente de desenvolvimento antes de aplicar em produção.