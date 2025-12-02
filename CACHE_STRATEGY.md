# 🚀 Estratégia de Cache e Revalidação

Este projeto usa uma estratégia híbrida de cache para maximizar performance enquanto mantém o conteúdo sempre atualizado.

## 📊 Visão Geral

```
WordPress CMS → GraphQL API → Next.js (ISR + Cache) → CDN → Usuário
     ↓                                    ↑
   Webhook ──────────────────────────────┘
  (On-Demand Revalidation)
```

## 🎯 Estratégias Implementadas

### 1. **ISR (Incremental Static Regeneration)**

Páginas são geradas estaticamente no build e revalidadas automaticamente após um período:

| Tipo de Página | Cache TTL | Tags                                |
| -------------- | --------- | ----------------------------------- |
| News           | 30 min    | `news`, `news-{slug}`               |
| Events         | 30 min    | `events`, `event-{slug}`            |
| Case Studies   | 1 hora    | `case-studies`, `case-study-{slug}` |
| Animals        | 1 hora    | `animals`, `animal-{slug}`          |
| Pages          | 1 hora    | `pages`, `page-{slug}`              |

### 2. **On-Demand Revalidation**

Quando conteúdo é atualizado no WordPress, um webhook dispara revalidação imediata:

```
Editor publica post → WordPress webhook → /api/revalidate → Regenera página
```

### 3. **Apollo Client Cache**

- **Cache-first**: Mostra dados do cache imediatamente
- **Cache-and-network**: Busca atualização em background
- **Merge policies**: Paginação funciona corretamente
- **Type policies**: Cache inteligente por tipo de conteúdo

## 🔄 Fluxo de Atualização

### Cenário 1: Primeira Visita

```
1. Usuário acessa /news/meu-post
2. Next.js verifica cache (miss)
3. Gera página (SSG)
4. Cacheia por 30 minutos
5. Serve para o usuário
```

### Cenário 2: Visita com Cache Válido

```
1. Usuário acessa /news/meu-post
2. Cache válido (< 30min)
3. Serve página cacheada instantaneamente
```

### Cenário 3: Atualização no WordPress

```
1. Editor atualiza post no WordPress
2. WordPress envia webhook para /api/revalidate
3. Next.js invalida cache específico (tag: news-meu-post)
4. Próxima visita regenera a página
5. Nova versão disponível imediatamente
```

## 📁 Arquivos Principais

### Frontend (Next.js)

```
src/
├── app/
│   ├── api/
│   │   └── revalidate/
│   │       └── route.ts          # Endpoint de revalidação
│   ├── news/[...uri]/page.tsx    # ISR configurado
│   ├── events/[...uri]/page.tsx  # ISR configurado
│   └── ...
├── lib/
│   ├── apollo-client.ts          # Apollo com cache policies
│   └── queryWithTags.ts          # Helper para queries com tags
└── ...
```

### WordPress

```
wp-content/
├── plugins/
│   └── nextjs-revalidation/      # Plugin de webhook
│       └── nextjs-revalidation.php
└── ...
```

## 🔐 Segurança

### Token de Revalidação

O endpoint `/api/revalidate` é protegido por um secret token:

```typescript
// Valida token
if (secret !== process.env.REVALIDATE_SECRET) {
  return NextResponse.json({ error: 'Invalid secret' }, { status: 401 })
}
```

**Importante:**

- Use um token forte (32+ caracteres)
- Nunca exponha o token no frontend
- Mesma chave no WordPress e Next.js

## 📈 Performance

### Métricas Esperadas

| Métrica            | Valor Alvo |
| ------------------ | ---------- |
| TTFB (First Visit) | < 200ms    |
| TTFB (Cached)      | < 50ms     |
| FCP                | < 1.5s     |
| LCP                | < 2.5s     |
| CLS                | < 0.1      |

### Otimizações Implementadas

- ✅ Static Generation (SSG)
- ✅ Incremental Static Regeneration (ISR)
- ✅ Apollo Client Cache
- ✅ Next.js Image Optimization
- ✅ Cache granular com tags
- ✅ CDN-ready headers

## 🛠️ Configuração

### 1. Frontend (Next.js)

```bash
# .env.local
NEXT_PUBLIC_WORDPRESS_GRAPHQL_ENDPOINT=https://wordpress.com/graphql
REVALIDATE_SECRET=seu_token_secreto
```

### 2. WordPress

```php
// .env ou wp-config.php
NEXTJS_REVALIDATE_URL=https://seu-site.com/api/revalidate
NEXTJS_REVALIDATE_SECRET=seu_token_secreto
```

Ver [WORDPRESS_SETUP.md](./WORDPRESS_SETUP.md) para instruções completas.

## 🧪 Testes

### Testar Revalidação Manual

```bash
curl -X POST https://seu-site.com/api/revalidate \
  -H "Content-Type: application/json" \
  -H "x-revalidate-secret: seu_token" \
  -d '{
    "path": "/news/meu-post",
    "type": "news",
    "tag": "news"
  }'
```

### Verificar Cache Headers

```bash
curl -I https://seu-site.com/news/meu-post

# Resposta esperada:
# x-nextjs-cache: HIT (página em cache)
# cache-control: s-maxage=1800, stale-while-revalidate
```

## 📊 Monitoramento

### Logs de Revalidação

```typescript
// Aparecem no console do Next.js
console.log('Revalidation request:', { path, tag, type })
console.log(`Revalidated path: ${path}`)
console.log(`Revalidated tag: ${tag}`)
```

### Logs do WordPress

```php
// Em wp-content/debug.log
NextJS Revalidation: Post saved - Meu Post (news)
NextJS Revalidation Error: Connection timeout
```

## 🎓 Conceitos Importantes

### ISR vs SSR vs CSR

- **SSG (Static)**: Gera no build, nunca muda (páginas fixas)
- **ISR (Incremental)**: Gera no build, revalida periodicamente ✅ **USADO**
- **SSR (Server)**: Gera a cada request (não cacheia)
- **CSR (Client)**: Renderiza no browser

### Cache Layers

```
1. Browser Cache (curto, controlado por headers)
2. CDN Cache (médio, purge via webhook)
3. Next.js Cache (longo, ISR + on-demand)
4. Apollo Cache (cliente, persistente)
```

## 🔗 Recursos

- [Next.js ISR Docs](https://nextjs.org/docs/app/building-your-application/data-fetching/incremental-static-regeneration)
- [On-Demand Revalidation](https://nextjs.org/docs/app/building-your-application/data-fetching/incremental-static-regeneration#on-demand-revalidation)
- [Apollo Cache Config](https://www.apollographql.com/docs/react/caching/cache-configuration/)

## ✅ Checklist de Deploy

- [ ] Variáveis de ambiente configuradas (.env.local)
- [ ] Plugin WordPress instalado e ativo
- [ ] Webhook WordPress configurado
- [ ] Token de revalidação seguro gerado
- [ ] Teste de revalidação manual executado
- [ ] Cache headers verificados
- [ ] Logs monitorados (WordPress + Next.js)
- [ ] Performance medida (Lighthouse)

## 🆘 Troubleshooting

### Conteúdo não atualiza

1. Verificar logs do WordPress (`debug.log`)
2. Testar webhook manualmente
3. Verificar token de revalidação
4. Checar conectividade WordPress → Next.js

### Cache muito longo

1. Reduzir `revalidate` nas páginas
2. Forçar purge manual via API
3. Verificar CDN settings

### Performance ruim

1. Aumentar TTL de cache
2. Verificar tamanho das imagens
3. Habilitar CDN
4. Otimizar queries GraphQL
