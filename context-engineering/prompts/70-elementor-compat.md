# 70 - Compatibilidade com Elementor

## Objetivo
Implementar compatibilidade completa com Elementor Pro, incluindo widgets customizados, templates e integração com CPTs.

## Instruções para a IA

### 1. Configuração Base do Elementor
- Verificar se o tema está configurado para Elementor
- Adicionar suporte a `add_theme_support('elementor')`
- Configurar `add_theme_support('elementor-pro')`
- Implementar hooks necessários em `functions.php`

### 2. Widgets Customizados
- Analisar componentes únicos do site estático
- Criar widgets Elementor para cada componente específico
- Implementar em `inc/elementor-widgets.php`
- Registrar widgets no Elementor

### 3. Templates Elementor
- Criar templates Elementor para páginas principais
- Configurar template conditions
- Implementar em `elementor-templates/`
- Mapear templates do site estático para Elementor

### 4. Integração com CPTs
- Configurar Elementor para trabalhar com CPTs criados
- Implementar templates específicos para CPTs
- Configurar archive e single templates
- Adicionar suporte a Dynamic Content

### 5. Customizações CSS/JS
- Migrar estilos específicos para Elementor
- Implementar scripts customizados
- Configurar responsive breakpoints
- Otimizar performance

### 6. Theme Builder Integration
- Configurar Header/Footer Builder
- Implementar Archive Builder
- Configurar Single Post Builder
- Mapear estruturas do site estático

## Saída Esperada

### Arquivos a serem criados/modificados:
```
inc/elementor-widgets.php
inc/elementor-compat.php
elementor-templates/
  ├── header.json
  ├── footer.json
  ├── archive.json
  └── single.json
assets/elementor/
  ├── widgets.css
  └── widgets.js
```

### Atualização no mapping.yaml:
```yaml
elementor:
  enabled: true
  widgets:
    - name: "Custom Widget Name"
      class: "Custom_Widget_Class"
      category: "theme-widgets"
  templates:
    - type: "header"
      file: "elementor-templates/header.json"
    - type: "footer"
      file: "elementor-templates/footer.json"
  theme_builder:
    header: true
    footer: true
    archive: true
    single: true
```

## Próximo Passo
Criar `80-performance.md` - Otimização de performance

## Validações
- [ ] Elementor carrega sem erros
- [ ] Widgets customizados aparecem no painel
- [ ] Templates são aplicados corretamente
- [ ] CPTs funcionam com Elementor
- [ ] Theme Builder funciona completamente
- [ ] Performance não foi comprometida