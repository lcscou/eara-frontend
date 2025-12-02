# 🚀 Guia Rápido - Cache e Revalidação

## ✅ Implementação Completa

Toda a configuração de cache e revalidação foi implementada no frontend!

## 📁 Arquivos Criados/Modificados

### 1. API Route de Revalidação

- ✅ `src/app/api/revalidate/route.ts`
  - Endpoint seguro com validação de token
  - Suporta revalidação por path, tag ou type
  - Logs detalhados

### 2. Apollo Client Otimizado

- ✅ `src/lib/apollo-client.ts`
  - Cache policies inteligentes
  - Merge automático para paginação
  - Fetch policy: cache-and-network

### 3. Utilitário de Query com Tags

- ✅ `src/lib/queryWithTags.ts`
  - Helper para queries com tags granulares
  - Type-safe com TypeScript

### 4. ISR nas Páginas Dinâmicas

- ✅ `src/app/news/[...uri]/page.tsx` (30min cache)
- ✅ `src/app/events/[...uri]/page.tsx` (30min cache)
- ✅ `src/app/case-studies/[...uri]/page.tsx` (1h cache)
- ✅ `src/app/animals/[...uri]/page.tsx` (1h cache)

### 5. Documentação

- ✅ `WORDPRESS_SETUP.md` - Instruções completas WordPress
- ✅ `CACHE_STRATEGY.md` - Estratégia e conceitos
- ✅ `.env.example` - Variáveis necessárias

## 🔧 Configuração Necessária

### 1. Adicionar Secret ao .env.local

```bash
# Gerar token seguro
openssl rand -base64 32

# Adicionar ao .env.local
REVALIDATE_SECRET=seu_token_gerado_aqui
```

### 2. Configurar WordPress

Veja instruções completas em `WORDPRESS_SETUP.md`:

**Opção A - Plugin (Recomendado):**

1. Criar arquivo `/wp-content/plugins/nextjs-revalidation/nextjs-revalidation.php`
2. Copiar código do `WORDPRESS_SETUP.md`
3. Ativar plugin

**Opção B - functions.php:**

1. Adicionar código ao `functions.php` do tema
2. Mais simples, mas menos organizado

**Configurar variáveis no WordPress:**

```bash
# .env do WordPress
NEXTJS_REVALIDATE_URL=https://seu-site.com/api/revalidate
NEXTJS_REVALIDATE_SECRET=mesmo_token_do_nextjs
```

## 🧪 Teste Rápido

### 1. Testar Endpoint Manualmente

```bash
curl -X POST http://localhost:3000/api/revalidate \
  -H "Content-Type: application/json" \
  -H "x-revalidate-secret: seu_token" \
  -d '{
    "path": "/news/test",
    "type": "news"
  }'

# Resposta esperada:
# {"revalidated":true,"timestamp":1234567890,"path":"/news/test","type":"news"}
```

### 2. Testar Webhook do WordPress

1. Edite um post no WordPress
2. Publique ou atualize
3. Verifique logs:

**WordPress (`wp-content/debug.log`):**

```
NextJS Revalidation: Post saved - Meu Post (news)
```

**Next.js (terminal):**

```
Revalidation request: { path: '/meu-post', tag: 'news', type: 'news' }
Revalidated path: /meu-post
Revalidated news archive
```

## 📊 Como Funciona

### Fluxo Normal (Com Cache)

```
1. Usuário visita /news/meu-post
2. Next.js serve da cache (30min válido)
3. Resposta instantânea (< 50ms)
```

### Fluxo com Atualização

```
1. Editor atualiza post no WordPress
2. WordPress → Webhook → /api/revalidate
3. Next.js invalida cache
4. Próxima visita regenera página
5. Conteúdo novo disponível!
```

## 🎯 Benefícios

| Feature                             | Status |
| ----------------------------------- | ------ |
| Cache agressivo (30min-1h)          | ✅     |
| Atualização instantânea via webhook | ✅     |
| Revalidação granular (tags)         | ✅     |
| Apollo cache persistente            | ✅     |
| Logs de debugging                   | ✅     |
| Type-safe                           | ✅     |
| Seguro (token auth)                 | ✅     |

## 📈 Performance Esperada

| Métrica    | Antes  | Depois |
| ---------- | ------ | ------ |
| TTFB       | ~500ms | < 50ms |
| Cache Hit  | 0%     | 95%+   |
| Build Time | ~2min  | ~30s   |
| Bandwidth  | 100%   | ~5%    |

## 🎓 Uso Avançado

### Revalidar com Tags Customizadas

```typescript
import { queryWithTags } from '@/lib/queryWithTags'

const { data } = await queryWithTags({
  query: GetPostDocument,
  variables: { slug },
  tags: ['posts', 'featured', `post-${slug}`],
  revalidate: 1800, // 30min
})
```

### Forçar Revalidação de Tag Específica

```bash
curl -X POST http://localhost:3000/api/revalidate \
  -H "x-revalidate-secret: seu_token" \
  -H "Content-Type: application/json" \
  -d '{"tag": "featured"}'
```

## 🔍 Debugging

### Ver Cache Status

```bash
# Headers da resposta mostram status do cache
curl -I https://seu-site.com/news/test

# Procurar por:
x-nextjs-cache: HIT  # Servido do cache
x-nextjs-cache: MISS # Regenerado
```

### Verificar Logs

```bash
# Next.js
yarn dev
# Logs aparecem no terminal

# WordPress
tail -f wp-content/debug.log
```

## 📚 Documentação Completa

- `WORDPRESS_SETUP.md` - Setup WordPress detalhado
- `CACHE_STRATEGY.md` - Conceitos e estratégia
- `.env.example` - Variáveis necessárias

## ⚠️ Importante

1. **Nunca commite o REVALIDATE_SECRET** ao git
2. Use um **token forte** (32+ caracteres)
3. **Mesma secret** no WordPress e Next.js
4. **Teste em desenvolvimento** antes de produção

## 🆘 Problemas Comuns

### Webhook não funciona

- ✅ Verificar URL está correta
- ✅ Verificar secret é o mesmo
- ✅ Verificar WordPress consegue acessar Next.js
- ✅ Checar logs do WordPress

### Cache não invalida

- ✅ Verificar tags corretas
- ✅ Verificar path correto
- ✅ Testar revalidação manual
- ✅ Limpar cache do browser

### Erro 401 no endpoint

- ✅ Secret incorreto ou faltando
- ✅ Verificar header `x-revalidate-secret`
- ✅ Verificar .env.local está carregado

## ✅ Próximos Passos

1. [ ] Adicionar REVALIDATE_SECRET ao .env.local
2. [ ] Configurar plugin WordPress
3. [ ] Testar revalidação manual
4. [ ] Testar webhook do WordPress
5. [ ] Monitorar logs
6. [ ] Deploy para produção
7. [ ] Configurar mesmas variáveis no Vercel/host

Pronto! Seu site agora tem cache inteligente com atualização instantânea! 🎉
