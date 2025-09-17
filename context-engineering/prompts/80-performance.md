# 80 - Otimização de Performance

## Objetivo
Implementar otimizações de performance para garantir carregamento rápido e boa experiência do usuário.

## Instruções para a IA

### 1. Otimização de Assets
- Implementar minificação de CSS/JS
- Configurar concatenação de arquivos
- Implementar lazy loading para imagens
- Otimizar formato de imagens (WebP, AVIF)
- Configurar preload para recursos críticos

### 2. Caching e CDN
- Implementar cache de browser
- Configurar cache de objeto
- Preparar para CDN
- Implementar cache de página
- Configurar ETags e headers de cache

### 3. Database Optimization
- Otimizar queries customizadas
- Implementar cache de queries
- Reduzir número de queries
- Implementar paginação eficiente
- Otimizar meta queries

### 4. Critical CSS
- Extrair CSS crítico
- Implementar inline CSS crítico
- Defer CSS não crítico
- Otimizar above-the-fold content
- Implementar resource hints

### 5. JavaScript Optimization
- Implementar defer/async para scripts
- Minificar JavaScript
- Remover JavaScript não utilizado
- Implementar code splitting
- Otimizar event listeners

### 6. Image Optimization
- Implementar responsive images
- Configurar lazy loading
- Otimizar tamanhos de imagem
- Implementar WebP fallback
- Configurar image preloading

### 7. Performance Monitoring
- Implementar métricas Core Web Vitals
- Configurar performance budgets
- Implementar monitoring de performance
- Configurar alertas de performance

## Saída Esperada

### Arquivos a serem criados/modificados:
```
inc/performance.php
inc/image-optimization.php
inc/critical-css.php
assets/js/performance.js
assets/css/critical.css
performance/
  ├── critical-css-generator.php
  ├── image-optimizer.php
  └── cache-helper.php
```

### Atualização no mapping.yaml:
```yaml
performance:
  critical_css: true
  lazy_loading: true
  image_optimization:
    webp: true
    responsive: true
    lazy: true
  caching:
    browser_cache: true
    object_cache: true
  minification:
    css: true
    js: true
  resource_hints:
    preload: []
    prefetch: []
    preconnect: []
  core_web_vitals:
    lcp_target: "2.5s"
    fid_target: "100ms"
    cls_target: "0.1"
```

## Próximo Passo
Criar `90-qa-release.md` - QA final e preparação para release

## Validações
- [ ] PageSpeed Insights score > 90
- [ ] Core Web Vitals passando
- [ ] Imagens otimizadas e lazy loading funcionando
- [ ] CSS crítico implementado
- [ ] JavaScript otimizado
- [ ] Cache funcionando corretamente
- [ ] Performance budget respeitado