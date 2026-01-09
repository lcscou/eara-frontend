# Exemplos Práticos de Uso dos Blocos Core do Gutenberg

## Tabela de Comparação: Componentes Mantine vs Blocos Gutenberg

| Caso de Uso        | Bloco Gutenberg        | Componente Mantine | Resultado                 |
| ------------------ | ---------------------- | ------------------ | ------------------------- |
| Container genérico | `core/group` (default) | `Box`              | Block, sem flexbox        |
| Linha horizontal   | `core/row`             | `Group`            | Flex horizontal, sem wrap |
| Coluna vertical    | `core/stack`           | `Stack`            | Flex vertical             |
| Grid responsivo    | `core/grid`            | `SimpleGrid`       | CSS Grid com colunas      |
| Layout combinado   | `core/group` (flex)    | `Group` ou `Stack` | Flexbox com controle      |

---

## Exemplo 1: Hero com Imagem e Texto (Row)

**WordPress Block:**

```html
<!-- wp:row {"layout":{"type":"flex","justifyContent":"space-between"}} -->
<!-- wp:image {"width":300,"height":300} -->
<figure class="wp-block-image">
  <img src="/hero-image.jpg" alt="Hero" width="300" height="300" />
</figure>
<!-- /wp:image -->

<!-- wp:group {"layout":{"type":"flex","orientation":"vertical","justifyContent":"center"}} -->
<!-- wp:heading {"level":1} -->
<h1>Bem-vindo ao nosso site</h1>
<!-- /wp:heading -->

<!-- wp:paragraph -->
<p>Conheça nossas soluções inovadoras</p>
<!-- /wp:paragraph -->

<!-- wp:button -->
<a class="wp-block-button__link">Saiba Mais</a>
<!-- /wp:button -->
<!-- /wp:group -->
<!-- /wp:row -->
```

**Renderização no React:**

```tsx
<Group justify="space-between" wrap="nowrap" style={{ width: '100%' }}>
  <Image src="/hero-image.jpg" alt="Hero" width={300} height={300} />

  <Stack justify="center" style={{ width: '100%' }}>
    <Title order={1}>Bem-vindo ao nosso site</Title>
    <Box>Conheça nossas soluções inovadoras</Box>
    <ButtonEara label="Saiba Mais" />
  </Stack>
</Group>
```

---

## Exemplo 2: Grid de Produtos (3 Colunas)

**WordPress Block:**

```html
<!-- wp:grid {"layout":{"type":"grid","columnCount":3}} -->
<!-- wp:image -->
<figure>
  <img src="/product-1.jpg" alt="Produto 1" />
</figure>
<!-- /wp:image -->

<!-- wp:group -->
<!-- wp:heading {"level":3} -->
<h3>Produto 1</h3>
<!-- /wp:heading -->

<!-- wp:paragraph -->
<p>Descrição do produto</p>
<!-- /wp:paragraph -->
<!-- /wp:group -->

<!-- Repetir para mais produtos... -->
<!-- /wp:grid -->
```

**Renderização no React:**

```tsx
<SimpleGrid cols={3} style={{ width: '100%' }}>
  <Box>
    <Image src="/product-1.jpg" alt="Produto 1" />
    <Title order={3}>Produto 1</Title>
    <Box>Descrição do produto</Box>
  </Box>

  {/* Mais itens... */}
</SimpleGrid>
```

---

## Exemplo 3: Seção com Stack e Cards

**WordPress Block:**

```html
<!-- wp:group {"layout":{"type":"default"}} -->
<!-- wp:heading -->
<h2>Nossos Serviços</h2>
<!-- /wp:heading -->

<!-- wp:stack {"layout":{"type":"flex","orientation":"vertical"}} -->
<!-- wp:group {"layout":{"type":"flex","justifyContent":"center"}} -->
<!-- wp:eara/card {"title":"Serviço 1"} -->
<!-- wp:eara/card -->
<!-- wp:eara/card {"title":"Serviço 3"} -->
<!-- /wp:group -->
<!-- /wp:stack -->
<!-- /wp:group -->
```

**Renderização no React:**

```tsx
<Box component="div">
  <Title order={2}>Nossos Serviços</Title>

  <Stack justify="flex-start" style={{ width: '100%' }}>
    <Group justify="center" wrap="wrap" style={{ width: '100%' }}>
      <Card title="Serviço 1" />
      <Card title="Serviço 2" />
      <Card title="Serviço 3" />
    </Group>
  </Stack>
</Box>
```

---

## Exemplo 4: Layout Responsivo com Média Query CSS

**WordPress Block:**

```html
<!-- wp:group {
  "layout":{"type":"flex","orientation":"vertical"},
  "cssClassName":"responsive-section"
} -->
<!-- wp:row {"layout":{"type":"flex","justifyContent":"space-around"}} -->
<!-- wp:image -->
<img src="/image-1.jpg" alt="Imagem 1" />
<!-- /wp:image -->

<!-- wp:image -->
<img src="/image-2.jpg" alt="Imagem 2" />
<!-- /wp:image -->
<!-- /wp:row -->
<!-- /wp:group -->
```

**CSS Customizado (necessário adicionar):**

```css
.responsive-section {
  padding: 2rem;
}

/* Mobile */
@media (max-width: 768px) {
  .responsive-section .wp-block-row {
    flex-direction: column;
    gap: 1rem;
  }

  .responsive-section img {
    max-width: 100%;
  }
}
```

**Renderização no React:**

```tsx
<Stack className="responsive-section" justify="flex-start" style={{ width: '100%' }}>
  <Group justify="space-around" wrap="nowrap" style={{ width: '100%' }}>
    <Image src="/image-1.jpg" alt="Imagem 1" />
    <Image src="/image-2.jpg" alt="Imagem 2" />
  </Group>
</Stack>
```

---

## Exemplo 5: Nested Layouts (Grupos dentro de Grupos)

**WordPress Block:**

```html
<!-- wp:group {"layout":{"type":"flex","orientation":"vertical"}} -->
<!-- wp:heading -->
<h2>Estrutura Aninhada</h2>
<!-- /wp:heading -->

<!-- wp:grid {"layout":{"type":"grid","columnCount":2}} -->
<!-- wp:group {"layout":{"type":"flex","orientation":"vertical"}} -->
<!-- wp:heading {"level":3} -->
<h3>Coluna 1</h3>
<!-- /wp:heading -->

<!-- wp:paragraph -->
<p>Conteúdo da coluna 1</p>
<!-- /wp:paragraph -->
<!-- /wp:group -->

<!-- wp:group {"layout":{"type":"flex","orientation":"vertical"}} -->
<!-- wp:heading {"level":3} -->
<h3>Coluna 2</h3>
<!-- /wp:heading -->

<!-- wp:paragraph -->
<p>Conteúdo da coluna 2</p>
<!-- /wp:paragraph -->
<!-- /wp:group -->
<!-- /wp:grid -->
<!-- /wp:group -->
```

**Renderização no React:**

```tsx
<Stack justify="flex-start" style={{ width: '100%' }}>
  <Title order={2}>Estrutura Aninhada</Title>

  <SimpleGrid cols={2} style={{ width: '100%' }}>
    <Stack justify="flex-start" style={{ width: '100%' }}>
      <Title order={3}>Coluna 1</Title>
      <Box>Conteúdo da coluna 1</Box>
    </Stack>

    <Stack justify="flex-start" style={{ width: '100%' }}>
      <Title order={3}>Coluna 2</Title>
      <Box>Conteúdo da coluna 2</Box>
    </Stack>
  </SimpleGrid>
</Stack>
```

---

## Checklist para Implementação

- [ ] Verificar que WPGraphQL Blocks está enviando os atributos corretamente
- [ ] Testar renderização de cada tipo de bloco em desktop
- [ ] Testar responsividade em mobile/tablet
- [ ] Validar que innerBlocks estão sendo renderizados recursivamente
- [ ] Adicionar CSS customizado para casos especiais (`cssClassName`)
- [ ] Testar combinações de layouts aninhados
- [ ] Validar acessibilidade (tagName semântico)
- [ ] Testar com diferentes quantidades de conteúdo

---

## Debug Tips

### 1. Verificar estrutura dos blocos recebidos

```tsx
// Em blockRenderer.tsx, no início da função renderBlock
console.log('Block received:', {
  name: block.name,
  attributes: block.attributes,
  innerBlocksCount: block.innerBlocks?.length,
})
```

### 2. Verificar se atributos estão chegando

```tsx
// Dentro de renderCoreGroup
console.log('Core Group Attributes:', {
  layout: attributes?.layout,
  tagName: attributes?.tagName,
  cssClassName: attributes?.cssClassName,
})
```

### 3. Validar tipo de layout detectado

```tsx
// Após extractLayoutConfig
console.log('Extracted Layout:', {
  layoutType,
  justifyContent,
  orientation,
  columnCount,
})
```

---

## Próximos Passos

1. **Adicionar suporte a `core/columns`**: Similar ao `core/grid` mas com widthPersonalizada por coluna
2. **Adicionar suporte a `core/spacer`**: Para espaçamento entre elementos
3. **Melhorar responsividade**: Usar breakpoints do Mantine para SimpleGrid em mobile
4. **Adicionar validação**: Validar atributos recebidos do WordPress
5. **Performance**: Considerar memoização para componentes pesados
