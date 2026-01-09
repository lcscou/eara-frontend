# Integração WPGraphQL Blocks - Guia Técnico

## Visão Geral

O WPGraphQL Blocks é um plugin que expõe os blocos do Gutenberg via GraphQL, permitindo que o frontend acesse a estrutura completa dos blocos com seus atributos.

## Estrutura de Dados do WPGraphQL Blocks

### Query GraphQL Típica

```graphql
query GetPageBlocks($id: ID!) {
  page(id: $id) {
    id
    title
    content
    # Blocos em formato estruturado (se disponível)
    blocks {
      __typename
      name
      clientId
      attributes
      innerBlocks {
        __typename
        name
        clientId
        attributes
      }
    }
  }
}
```

### Resposta Estruturada

```json
{
  "page": {
    "id": "cG9zdDoxMA==",
    "title": "Página de Exemplo",
    "blocks": [
      {
        "__typename": "CoreGroup",
        "name": "core/group",
        "clientId": "group-abc123",
        "attributes": {
          "tagName": "div",
          "layout": {
            "type": "flex",
            "orientation": "horizontal",
            "justifyContent": "center",
            "flexWrap": "wrap"
          },
          "cssClassName": "custom-class"
        },
        "innerBlocks": [
          {
            "__typename": "CoreParagraph",
            "name": "core/paragraph",
            "clientId": "para-def456",
            "attributes": {
              "content": "Conteúdo do parágrafo",
              "textAlign": "left"
            }
          }
        ]
      }
    ]
  }
}
```

---

## Atributos Específicos por Bloco

### core/group

**Atributos Obrigatórios:**

- `layout` (object): Configuração do tipo de layout

**Atributos Opcionais:**

- `tagName` (string): Elemento HTML (padrão: 'div')
- `cssClassName` (string): Classes CSS customizadas
- `templateLock` (string|boolean): Restrições de edição

**Objeto Layout:**

```typescript
interface LayoutConfig {
  type: 'default' | 'constrained' | 'flex' | 'grid'
  inherit?: boolean
  contentSize?: string // para constrained
  wideSize?: string // para constrained
  justifyContent?: string // flex alignment
  flexWrap?: 'wrap' | 'nowrap' // flex wrap
  orientation?: 'vertical' | 'horizontal' // flex direction
  columnCount?: number // grid columns
  rowCount?: number // grid rows (raro)
  minimumColumnWidth?: string // grid responsividade
}
```

### core/row

**Herda de core/group com valores padrão:**

```typescript
{
  layout: {
    type: 'flex',
    flexWrap: 'nowrap',
    orientation: 'horizontal'
  }
}
```

### core/stack

**Herda de core/group com valores padrão:**

```typescript
{
  layout: {
    type: 'flex',
    orientation: 'vertical'
  }
}
```

### core/grid

**Herda de core/group com valores padrão:**

```typescript
{
  layout: {
    type: 'grid',
    columnCount: 1 // padrão, deve ser customizado
  }
}
```

---

## Configuração do WPGraphQL Blocks

### 1. Instalação do Plugin

```bash
# No WordPress
wp plugin install wpgraphql-content-blocks
wp plugin activate wpgraphql-content-blocks
```

### 2. Configuração Recomendada (wp-config.php)

```php
// Habilitar exposição de todos os blocos core
define('WPGRAPHQL_BLOCKS_EXPOSE_ALL_CORE_BLOCKS', true);

// Blocos customizados específicos para expor
define('WPGRAPHQL_BLOCKS_CUSTOM_BLOCKS', array(
  'eara/container',
  'eara/button',
  'eara/group',
  'eara/card',
  // ... outros blocos customizados
));
```

### 3. Verificar Compatibilidade

```graphql
# Query para verificar blocos disponíveis
query {
  __schema {
    types {
      name
      kind
    }
  }
}
```

---

## Estrutura de Resposta Esperada

### Exemplo Completo: Landing Page

```json
{
  "page": {
    "id": "cG9zdDoxMQ==",
    "title": "Landing Page",
    "blocks": [
      {
        "name": "core/group",
        "attributes": {
          "layout": { "type": "default" },
          "tagName": "div"
        },
        "innerBlocks": [
          {
            "name": "core/heading",
            "attributes": {
              "content": "Bem-vindo",
              "level": 1
            }
          },
          {
            "name": "core/paragraph",
            "attributes": {
              "content": "Descrição principal"
            }
          },
          {
            "name": "core/row",
            "attributes": {
              "layout": {
                "type": "flex",
                "flexWrap": "nowrap",
                "justifyContent": "space-between"
              }
            },
            "innerBlocks": [
              {
                "name": "core/image",
                "attributes": {
                  "url": "https://example.com/image.jpg",
                  "alt": "Imagem Hero"
                }
              },
              {
                "name": "core/group",
                "attributes": {
                  "layout": {
                    "type": "flex",
                    "orientation": "vertical",
                    "justifyContent": "center"
                  }
                },
                "innerBlocks": [
                  {
                    "name": "core/heading",
                    "attributes": { "content": "Título", "level": 2 }
                  },
                  {
                    "name": "eara/button",
                    "attributes": { "label": "CTA" }
                  }
                ]
              }
            ]
          },
          {
            "name": "core/grid",
            "attributes": {
              "layout": {
                "type": "grid",
                "columnCount": 3
              }
            },
            "innerBlocks": [
              {
                "name": "eara/card",
                "attributes": { "title": "Card 1" }
              },
              {
                "name": "eara/card",
                "attributes": { "title": "Card 2" }
              },
              {
                "name": "eara/card",
                "attributes": { "title": "Card 3" }
              }
            ]
          }
        ]
      }
    ]
  }
}
```

---

## Query GraphQL Recomendada

```graphql
query GetPageWithBlocks($id: ID!) {
  page(id: $id, idType: URI) {
    id
    title
    excerpt
    content

    # Blocos estruturados
    blocks {
      __typename
      ... on Block {
        name
        clientId
        attributes
        innerBlocks {
          __typename
          name
          clientId
          attributes
          innerBlocks {
            __typename
            name
            clientId
            attributes
            innerBlocks {
              __typename
              name
              clientId
              attributes
            }
          }
        }
      }
    }

    # Metadados úteis
    seo {
      title
      description
    }
  }
}
```

---

## Tratamento de Erros

### Cenários Comuns

1. **Blocos não reconhecidos:**

   ```tsx
   // O renderBlock vai logar um warning
   console.warn(`Block type "novo/bloco" not implemented yet`)
   // E renderizar apenas innerBlocks se existirem
   ```

2. **Atributos malformados:**

   ```tsx
   // Sempre usar valores padrão como fallback
   const layout = attributes?.layout || { type: 'default' }
   const columnCount = attributes?.layout?.columnCount || 1
   ```

3. **Blocos recursivos muito profundos:**
   ```tsx
   // Implementar limite de profundidade (opcional)
   const MAX_DEPTH = 10
   if (depth > MAX_DEPTH) {
     console.warn('Max block nesting depth reached')
     return null
   }
   ```

---

## Performance e Otimização

### 1. Fragmentos GraphQL

```graphql
fragment BlockFields on Block {
  __typename
  name
  clientId
  attributes
}

fragment BlockWithChildren on Block {
  ...BlockFields
  innerBlocks {
    ...BlockFields
  }
}
```

### 2. Lazy Loading de Blocos

```tsx
// Renderizar apenas blocos visíveis
const visibleBlocks = blocks.slice(0, 5)
const [offset, setOffset] = useState(5)

// Em intersectionObserver
const loadMore = () => {
  setOffset((prev) => prev + 5)
}
```

### 3. Memoização

```tsx
import { memo } from 'react'

const BlockRenderer = memo(
  ({ block }: { block: Block }) => {
    return renderBlock(block, 0)
  },
  (prev, next) => JSON.stringify(prev) === JSON.stringify(next)
)
```

---

## Problemas Conhecidos e Soluções

| Problema            | Causa                        | Solução                                     |
| ------------------- | ---------------------------- | ------------------------------------------- |
| Atributos vazios    | WPGraphQL não retornou dados | Usar `??` ou `\|\|` com valores padrão      |
| Layout não aplicado | `layout.type` não setado     | Padrão é 'default' ou 'constrained'         |
| Grid sem colunas    | `columnCount` undefined      | Usar `columnCount \|\| 1`                   |
| Spacing incorreto   | Presets não mapeados         | Adicionar novos presets em `spacingPresets` |

---

## Extensões Futuras

### 1. Adicionar suporte a `core/columns`

```typescript
case 'core/columns': {
  const columns = attributes?.columns || 3
  return (
    <SimpleGrid cols={columns}>
      {block.innerBlocks?.map((col, idx) => (
        <Box key={idx}>
          {col.innerBlocks?.map((innerBlock, idxInner) =>
            renderBlock(innerBlock, idxInner)
          )}
        </Box>
      ))}
    </SimpleGrid>
  )
}
```

### 2. Suporte a `core/spacer`

```typescript
case 'core/spacer': {
  const height = attributes?.height as string || '1rem'
  return <div key={index} style={{ height }} />
}
```

### 3. Suporte a Media Queries Responsivas

```typescript
// SimpleGrid com breakpoints
<SimpleGrid
  cols={{ base: 1, md: 2, lg: 3 }}
  spacing={layout?.gap}
>
  {/* Conteúdo */}
</SimpleGrid>
```

---

## Debugging

### Logger Customizado

```tsx
const logger = {
  debug: (msg: string, data?: any) => {
    if (process.env.NODE_ENV === 'development') {
      console.log(`[BlockRenderer] ${msg}`, data)
    }
  },
  warn: (msg: string, data?: any) => {
    console.warn(`[BlockRenderer] ${msg}`, data)
  },
  error: (msg: string, error?: Error) => {
    console.error(`[BlockRenderer] ${msg}`, error)
  },
}
```

### Validação de Blocos

```tsx
function validateBlock(block: Block): boolean {
  if (!block.name) {
    logger.error('Block without name', block)
    return false
  }

  if (!block.attributes) {
    logger.warn(`Block ${block.name} has no attributes`)
    // Isso é ok, continua
  }

  return true
}
```

---

## Referências

- [WPGraphQL Blocks GitHub](https://github.com/wpengine/wpgraphql-content-blocks)
- [WPGraphQL Documentation](https://www.wpgraphql.com/)
- [Gutenberg Blocks Documentation](https://developer.wordpress.org/block-editor/reference-guides/core-blocks/)
- [Mantine Components](https://mantine.dev/components/)
