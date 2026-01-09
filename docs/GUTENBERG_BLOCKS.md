# Suporte a Blocos Core do Gutenberg

Este documento descreve como os blocos core do Gutenberg (`core/group`, `core/row`, `core/stack`, `core/grid`) são renderizados no frontend.

## Blocos Suportados

### 1. **core/group**

Bloco container flexível que suporta múltiplos tipos de layout.

**Tipos de Layout:**

- `default`: Renderiza como um `Box` padrão (display: block)
- `constrained`: Renderiza como um `Box` com tamanho máximo (display: block)
- `flex`: Renderiza como um `Group` (flexbox horizontal ou vertical)
- `grid`: Renderiza como um `SimpleGrid` (grid layout)

**Atributos:**

```typescript
{
  tagName?: string              // Elemento HTML: 'div' | 'section' | 'article' | 'aside' | 'header' | 'main' | 'footer'
  layout?: {
    type: 'default' | 'constrained' | 'flex' | 'grid'
    justifyContent?: string     // 'center' | 'flex-start' | 'flex-end' | 'space-between' | etc
    orientation?: string        // 'vertical' | 'horizontal' (para flex)
    columnCount?: number        // Número de colunas (para grid)
    flexWrap?: string          // 'wrap' | 'nowrap'
  }
  cssClassName?: string         // Classes CSS customizadas
  templateLock?: boolean|string // Restrições de edição
}
```

**Exemplo no WordPress:**

```html
<!-- wp:group {"layout":{"type":"flex","justifyContent":"center","orientation":"horizontal"}} -->
<div class="wp-block-group"><!-- Conteúdo --></div>
<!-- /wp:group -->
```

**Resultado renderizado:**

```tsx
<Group justify="center" wrap="wrap" style={{ width: '100%' }}>
  {/* Blocos filhos */}
</Group>
```

---

### 2. **core/row**

Variação do `core/group` com layout flex horizontal (sem wrap por padrão).

**Atributos:**

```typescript
{
  tagName?: string              // Elemento HTML
  layout?: {
    type: 'flex'
    flexWrap: 'nowrap'         // Horizontal sem quebra de linha
    justifyContent?: string
  }
  cssClassName?: string
}
```

**Exemplo no WordPress:**

```html
<!-- wp:row -->
<div class="wp-block-row"><!-- Conteúdo em linha --></div>
<!-- /wp:row -->
```

**Resultado renderizado:**

```tsx
<Group component="div" justify={justifyContent} wrap="nowrap" style={{ width: '100%' }}>
  {/* Blocos filhos em linha */}
</Group>
```

---

### 3. **core/stack**

Variação do `core/group` com layout flex vertical.

**Atributos:**

```typescript
{
  tagName?: string              // Elemento HTML
  layout?: {
    type: 'flex'
    orientation: 'vertical'    // Sempre vertical
    justifyContent?: string
  }
  cssClassName?: string
}
```

**Exemplo no WordPress:**

```html
<!-- wp:stack -->
<div class="wp-block-stack"><!-- Conteúdo empilhado --></div>
<!-- /wp:stack -->
```

**Resultado renderizado:**

```tsx
<Stack component="div" justify={justifyContent} style={{ width: '100%' }}>
  {/* Blocos filhos em coluna */}
</Stack>
```

---

### 4. **core/grid**

Variação do `core/group` com layout grid responsivo.

**Atributos:**

```typescript
{
  tagName?: string              // Elemento HTML
  layout?: {
    type: 'grid'
    columnCount: number        // 1-6 colunas
  }
  cssClassName?: string
}
```

**Exemplo no WordPress:**

```html
<!-- wp:grid {"layout":{"type":"grid","columnCount":3}} -->
<div class="wp-block-grid"><!-- Conteúdo em grid 3 colunas --></div>
<!-- /wp:grid -->
```

**Resultado renderizado:**

```tsx
<SimpleGrid component="div" cols={3} style={{ width: '100%' }}>
  {/* Blocos filhos em grid */}
</SimpleGrid>
```

---

## Componentes Mantine Utilizados

| Bloco                          | Componente   | Razão                            |
| ------------------------------ | ------------ | -------------------------------- |
| `core/group` (default)         | `Box`        | Display block simples            |
| `core/group` (constrained)     | `Box`        | Display block com tamanho máximo |
| `core/group` (flex horizontal) | `Group`      | Flexbox com justificação e wrap  |
| `core/group` (flex vertical)   | `Stack`      | Flexbox vertical                 |
| `core/group` (grid)            | `SimpleGrid` | CSS Grid responsivo              |
| `core/row`                     | `Group`      | Flex horizontal (wrap: nowrap)   |
| `core/stack`                   | `Stack`      | Flex vertical                    |
| `core/grid`                    | `SimpleGrid` | Grid com número de colunas       |

---

## Mapeamentos de Propriedades

### Justify-Content

Mapeia valores de `layout.justifyContent` do Gutenberg para CSS flex:

```typescript
'flex-start' → 'flex-start'
'start' → 'flex-start'
'flex-end' → 'flex-end'
'end' → 'flex-end'
'center' → 'center'
'space-between' → 'space-between'
'space-around' → 'space-around'
'space-evenly' → 'space-evenly'
'stretch' → 'stretch'
```

### Align-Items

Mapeia valores de `layout.alignItems` do Gutenberg para CSS flex:

```typescript
'flex-start' → 'flex-start'
'center' → 'center'
'flex-end' → 'flex-end'
'stretch' → 'stretch'
'baseline' → 'baseline'
```

---

## Exemplos de Uso

### Exemplo 1: Grid com 3 colunas

**WordPress:**

```html
<!-- wp:grid {"layout":{"type":"grid","columnCount":3}} -->
<!-- wp:paragraph -->
<p>Item 1</p>
<!-- /wp:paragraph -->

<!-- wp:paragraph -->
<p>Item 2</p>
<!-- /wp:paragraph -->

<!-- wp:paragraph -->
<p>Item 3</p>
<!-- /wp:paragraph -->
<!-- /wp:grid -->
```

**Resultado no Frontend:**

```tsx
<SimpleGrid cols={3} style={{ width: '100%' }}>
  <Box>Item 1</Box>
  <Box>Item 2</Box>
  <Box>Item 3</Box>
</SimpleGrid>
```

---

### Exemplo 2: Stack (coluna vertical)

**WordPress:**

```html
<!-- wp:stack {"layout":{"type":"flex","orientation":"vertical"}} -->
<!-- wp:heading -->
<h2>Título</h2>
<!-- /wp:heading -->

<!-- wp:paragraph -->
<p>Descrição</p>
<!-- /wp:paragraph -->

<!-- wp:button -->
<a class="wp-block-button__link">Botão</a>
<!-- /wp:button -->
<!-- /wp:stack -->
```

**Resultado no Frontend:**

```tsx
<Stack justify="flex-start" style={{ width: '100%' }}>
  <Title order={2}>Título</Title>
  <Box>Descrição</Box>
  <Button>Botão</Button>
</Stack>
```

---

### Exemplo 3: Row (linha horizontal)

**WordPress:**

```html
<!-- wp:row {"layout":{"type":"flex","justifyContent":"center"}} -->
<!-- wp:image -->
<img src="..." />
<!-- /wp:image -->

<!-- wp:paragraph -->
<p>Texto ao lado da imagem</p>
<!-- /wp:paragraph -->
<!-- /wp:row -->
```

**Resultado no Frontend:**

```tsx
<Group justify="center" wrap="nowrap" style={{ width: '100%' }}>
  <Image src="..." />
  <Box>Texto ao lado da imagem</Box>
</Group>
```

---

## Adicionando Suporte a Novos Blocos Core

Se precisar adicionar suporte a outro bloco core do Gutenberg, siga este padrão:

1. **Adicione uma interface TypeScript** em `blockRenderer.tsx`:

```typescript
export interface CoreNovoBlockAttributes extends BlockAttribute {
  // Propriedades específicas
}
```

2. **Crie uma função renderizadora**:

```typescript
function renderCoreNovoBlock(block: Block, index: number): ReactNode {
  const attributes = block.attributes as CoreNovoBlockAttributes | undefined
  // Lógica de renderização
  return (
    <MantineComponent>
      {block.innerBlocks?.map((innerBlock, idx) => renderBlock(innerBlock, idx))}
    </MantineComponent>
  )
}
```

3. **Adicione o caso no switch** da função `renderBlock`:

```typescript
case 'core/novo-block': {
  return renderCoreNovoBlock(block, index)
}
```

---

## Troubleshooting

### Grid não responde corretamente em mobile

- O `SimpleGrid` do Mantine é responsivo por padrão
- Use `breakpoints` se precisar de comportamento customizado

### Flex items não têm width correto

- Todos os containers têm `style={{ width: '100%' }}` para garantir resposta
- Se precisar de width específica, use `cssClassName` com CSS customizado

### Componentes com tagName customizado não funcionam

- A Prop `component` do Mantine deve ser `as any` para evitar erros TypeScript
- Verifique se o tagName é válido: `div`, `section`, `article`, `aside`, `header`, `main`, `footer`

---

## Propriedades Futuras

Se o WPGraphQL Blocks adicionar novas propriedades, atualize:

1. As interfaces TypeScript
2. A função `extractLayoutConfig()` se necessário
3. Os mapeamentos (`justifyContentMap`, `alignItemsMap`, etc)
4. Este documento com exemplos

---

## Referências

- [Documentação de Blocos Core do Gutenberg](https://developer.wordpress.org/block-editor/reference-guides/core-blocks/)
- [Mantine Components](https://mantine.dev/components/)
- [WPGraphQL Blocks Plugin](https://github.com/wpengine/wpgraphql-content-blocks)
