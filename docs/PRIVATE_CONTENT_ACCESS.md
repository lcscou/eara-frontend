# Acesso a Conteúdos Privados do WordPress

Este documento explica como acessar conteúdos marcados como privados no WordPress através do frontend Next.js.

## Como Funciona

O sistema detecta automaticamente conteúdos privados de três formas:

1. **Campo `status`**: Todas as queries incluem o campo `status` do WordPress. Se retornar `PRIVATE`, o sistema sabe que precisa de autenticação.

2. **Erros GraphQL**: Códigos como `FORBIDDEN`, `UNAUTHENTICATED` ou mensagens com "not authorized", "private", etc.

3. **Data null com usuário logado**: Se a query retornar `null` mas o usuário está autenticado, tenta novamente com credenciais (pode ser conteúdo privado ou inexistente).

**Fluxo automático:**

- **Usuário deslogado + conteúdo público**: Exibe normalmente
- **Usuário deslogado + conteúdo privado**: Redireciona para `/login?redirect=...`
- **Usuário logado + conteúdo privado**: Exibe com credenciais automaticamente
- **Conteúdo inexistente**: 404 (mesmo logado)

## Uso Básico

**Você não precisa fazer nada especial!** O sistema detecta automaticamente conteúdo privado.

### Rotas que suportam conteúdo privado automaticamente:

Todas as rotas de conteúdo já estão preparadas:

- Pages: `/[...uri]` e `/` (home)
- News: `/news/[...uri]`
- Events: `/events/[...uri]`
- Diseases: `/diseases/[...uri]`
- Animals: `/animals/[...uri]`
- Team: `/team/[...uri]`
- Press Releases: `/press-releases/[...uri]`
- Case Studies: `/case-studies/[...uri]`
- Members: `/members/[...uri]`

Basta marcar o conteúdo como "Privado" no WordPress e o sistema:

1. Redireciona usuários deslogados para `/login`
2. Exibe o conteúdo automaticamente para usuários logados

### Para criar novas rotas com conteúdo privado:

```tsx
import { queryWithAuthFallback } from '@/lib/queryWithAuthFallback'
import { redirect } from 'next/navigation'

const getData = cache(async (id: string) => {
  const result = await queryWithAuthFallback({
    query: YOUR_QUERY,
    variables: { id },
  })

  // Redireciona para login se necessário
  if (result.authRequired) {
    redirect(`/login?redirect=/your-path/${id}`)
  }

  if (!result.data) notFound()
  return result.data
})
```

## Exemplo: Página de Membros Privada

```tsx
// src/app/membership/members-area/private-resources/page.tsx
import { getAuthenticatedClient } from '@/lib/apollo-client'
import { gql } from '@apollo/client'

const PRIVATE_RESOURCES_QUERY = gql`
  query GetPrivateResources {
    posts(where: { status: PRIVATE }) {
      nodes {
        id
        title
        content
        date
      }
    }
  }
`

export default async function PrivateResourcesPage() {
  const client = await getAuthenticatedClient()

  const { data } = await client.query({
    query: PRIVATE_RESOURCES_QUERY,
  })

  return (
    <div>
      <h1>Recursos Privados</h1>
      {data?.posts?.nodes?.map((post) => (
        <article key={post.id}>
          <h2>{post.title}</h2>
          <div dangerouslySetInnerHTML={{ __html: post.content }} />
        </article>
      ))}
    </div>
  )
}
```

## Exemplo: Custom Post Type Privado

```tsx
import { getAuthenticatedClient } from '@/lib/apollo-client'
import { gql } from '@apollo/client'

const PRIVATE_DOCUMENTS_QUERY = gql`
  query GetPrivateDocuments {
    documents(where: { status: PRIVATE }) {
      nodes {
        id
        title
        documentFields {
          fileUrl
          description
        }
      }
    }
  }
`

export default async function PrivateDocumentsPage() {
  const client = await getAuthenticatedClient()

  const { data } = await client.query({
    query: PRIVATE_DOCUMENTS_QUERY,
  })

  return (
    <div>
      <h1>Documentos Privados</h1>
      <ul>
        {data?.documents?.nodes?.map((doc) => (
          <li key={doc.id}>
            <h3>{doc.title}</h3>
            <a href={doc.documentFields?.fileUrl} download>
              Baixar Documento
            </a>
          </li>
        ))}
      </ul>
    </div>
  )
}
```

## Proteção de Rotas

As rotas que contêm conteúdo privado já estão protegidas pelo middleware. Se um usuário não autenticado tentar acessar, será redirecionado para a página de login:

```typescript
// middleware.ts
export const config = {
  matcher: ['/membership/members-area/:path*'],
}
```

Para adicionar mais rotas protegidas, atualize o `matcher` no [middleware.ts](/home/lcscou/eara-frontend/middleware.ts).

## Diferença entre getClient() e getAuthenticatedClient()

| Função                     | Uso                         | Cache        | Quando usar                               |
| -------------------------- | --------------------------- | ------------ | ----------------------------------------- |
| `queryWithAuthFallback()`  | Conteúdo público ou privado | Automático   | **Recomendado** - Detecta automaticamente |
| `getClient()`              | Conteúdo público            | Sim (1 hora) | Quando tem certeza que é público          |
| `getAuthenticatedClient()` | Conteúdo privado            | Não          | Quando tem certeza que precisa de auth    |

**Na maioria dos casos, use `queryWithAuthFallback()`** - ela escolhe automaticamente o client correto.

## Verificar Status de Autenticação

Para verificar se o usuário está autenticado:

```tsx
import { isAuthenticated, getCurrentUser } from '@/lib/auth/helpers'
import { redirect } from 'next/navigation'

export default async function MemberPage() {
  // Opção 1: Verificar apenas se está autenticado
  if (!(await isAuthenticated())) {
    redirect('/login')
  }

  // Opção 2: Obter informações do usuário
  const user = await getCurrentUser()

  if (!user) {
    return <div>Você precisa estar logado para ver este conteúdo.</div>
  }

  return (
    <div>
      <h1>Bem-vindo, {user.email}!</h1>
      {/* Conteúdo autenticado */}
    </div>
  )
}
```

**Função helper para escolher o client correto:**

```tsx
import { requiresAuth } from '@/lib/auth/helpers'
import { getClient, getAuthenticatedClient } from '@/lib/apollo-client'

async function fetchContent(status: 'PUBLISH' | 'PRIVATE') {
  // Automaticamente escolhe o client correto baseado no status
  const client = requiresAuth(status) ? await getAuthenticatedClient() : getClient()

  return client.query({ query: YOUR_QUERY })
}
```

## Troubleshooting

### Erro 401 ao acessar conteúdo privado

- Verifique se o usuário está logado
- Confirme que o token JWT está sendo armazenado no cookie
- Verifique se o plugin "Headless Login Settings" está configurado corretamente no WordPress
- Certifique-se de que o provider "password" está habilitado

### Conteúdo privado não aparece

- Confirme que o conteúdo está marcado como "Private" no WordPress
- Verifique se o usuário tem permissão para ver o conteúdo
- Use `getAuthenticatedClient()` em vez de `getClient()` para essas queries

### Token expirado

O token JWT expira após 1 dia. O sistema armazena automaticamente um refresh token que dura 7 dias. Para renovar o token automaticamente:

```tsx
// Exemplo de uso do endpoint de refresh
async function refreshAuthToken() {
  const response = await fetch('/api/auth/refresh', {
    method: 'POST',
  })

  if (!response.ok) {
    // Token de refresh expirado ou inválido - redirecionar para login
    window.location.href = '/login'
    return
  }

  // Token renovado com sucesso, pode continuar fazendo requisições
  return await response.json()
}
```

**Implementação automática de refresh:**

Você pode criar um interceptor no Apollo Client para renovar o token automaticamente quando ele expirar:

```tsx
import { onError } from '@apollo/client/link/error'

const errorLink = onError(({ graphQLErrors, operation, forward }) => {
  if (graphQLErrors) {
    for (const err of graphQLErrors) {
      if (err.extensions?.code === 'UNAUTHENTICATED') {
        // Token expirado, tentar renovar
        return fromPromise(
          fetch('/api/auth/refresh', { method: 'POST' })
            .then((res) => res.json())
            .catch(() => {
              // Refresh falhou, redirecionar para login
              window.location.href = '/login'
            })
        ).flatMap(() => forward(operation))
      }
    }
  }
})
```

## Configuração do WordPress

Certifique-se de que o WordPress está configurado corretamente:

1. **Plugin Headless Login Settings**
   - Provider: Password ✅
   - WordPress authentication cookie ✅

2. **WPGraphQL**
   - Instalado e ativado
   - Endpoint: configurado em `.env`

3. **Permissões de Usuário**
   - Usuários devem ter as permissões apropriadas para ver conteúdo privado

## Cookies de Autenticação

O sistema utiliza dois cookies para gerenciar a autenticação:

| Cookie               | Duração | Propósito                                           |
| -------------------- | ------- | --------------------------------------------------- |
| `eara_auth_token`    | 1 dia   | Token JWT para autenticação nas requisições GraphQL |
| `eara_refresh_token` | 7 dias  | Token para renovar o auth token quando expirar      |

Ambos os cookies são:

- **httpOnly**: Não acessíveis via JavaScript (maior segurança)
- **sameSite**: `lax` (proteção contra CSRF)
- **secure**: `true` em produção (apenas HTTPS)

## API Endpoints

### POST /api/auth/login

Autentica o usuário e cria os cookies de sessão.

**Request:**

```json
{
  "email": "usuario@example.com",
  "password": "senha123"
}
```

**Response:**

```json
{
  "user": {
    "id": "123",
    "name": "Nome do Usuário",
    "email": "usuario@example.com"
  },
  "authTokenExpiration": 1234567890
}
```

### POST /api/auth/refresh

Renova o auth token usando o refresh token.

**Response:**

```json
{
  "success": true,
  "authTokenExpiration": 1234567890
}
```

### POST /api/auth/logout

Remove os cookies de autenticação e encerra a sessão.

**Response:**

```json
{
  "ok": true
}
```

## Variáveis de Ambiente

```env
WORDPRESS_GRAPHQL_ENDPOINT=https://seu-site.com/graphql
NEXT_PUBLIC_WORDPRESS_GRAPHQL_ENDPOINT=https://seu-site.com/graphql
```
