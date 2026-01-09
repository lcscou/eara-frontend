# Documentação - Blocos Gutenberg e Block Renderer

## 📚 Índice de Documentação

Este diretório contém documentação completa sobre como renderizar blocos do Gutenberg no frontend usando a arquitetura existente.

### Arquivos de Documentação

1. **[GUTENBERG_BLOCKS.md](./GUTENBERG_BLOCKS.md)** - Documentação Técnica Principal
   - Visão geral de todos os blocos suportados
   - Estrutura de atributos de cada bloco
   - Mapeamentos de componentes Mantine
   - Como adicionar novos blocos

2. **[GUTENBERG_BLOCKS_EXAMPLES.md](./GUTENBERG_BLOCKS_EXAMPLES.md)** - Exemplos Práticos
   - 5 exemplos completos de uso
   - Tabelas comparativas
   - Código antes/depois
   - Dicas de debug
   - Checklist de implementação

3. **[WPGRAPHQL_BLOCKS_INTEGRATION.md](./WPGRAPHQL_BLOCKS_INTEGRATION.md)** - Integração com WPGraphQL
   - Estrutura de dados do WPGraphQL Blocks
   - Query GraphQL recomendada
   - Configuração do plugin
   - Troubleshooting
   - Performance e otimização

---

## 🚀 Quick Start

### Adicionar Renderização de um Novo Bloco

1. **Adicione a interface TypeScript** em `src/lib/blockRenderer.tsx`:

```typescript
export interface CoreMeuBlocoAttributes extends BlockAttribute {
  propriedade1?: string
  propriedade2?: number
}
```

2. **Crie a função renderizadora**:

```typescript
function renderCoreMeuBloco(block: Block, index: number): ReactNode {
  const attributes = block.attributes as CoreMeuBlocoAttributes
  // Lógica de renderização
  return <MantineComponent>{/* Conteúdo */}</MantineComponent>
}
```

3. **Adicione o caso no switch**:

```typescript
case 'core/meu-bloco': {
  return renderCoreMeuBloco(block, index)
}
```

---

## 📋 Blocos Suportados Atualmente

| Bloco            | Componente Mantine               | Status          |
| ---------------- | -------------------------------- | --------------- |
| `core/group`     | Box / Group / Stack / SimpleGrid | ✅ Implementado |
| `core/row`       | Group                            | ✅ Implementado |
| `core/stack`     | Stack                            | ✅ Implementado |
| `core/grid`      | SimpleGrid                       | ✅ Implementado |
| `core/heading`   | Title                            | ✅ Implementado |
| `core/paragraph` | Box                              | ✅ Implementado |
| `core/image`     | Image                            | ✅ Implementado |
| `core/list`      | HTML `<ul>` / `<ol>`             | ✅ Implementado |
| `eara/container` | Container                        | ✅ Customizado  |
| `eara/button`    | ButtonEara                       | ✅ Customizado  |
| `eara/group`     | Group                            | ✅ Customizado  |
| `eara/card`      | Card                             | ✅ Customizado  |

---

## 🔧 Arquitetura

### Fluxo de Renderização

```
WordPress (Gutenberg)
         ↓
WPGraphQL Blocks Plugin
         ↓
GraphQL API → JSON com estrutura de blocos
         ↓
Frontend (Next.js)
         ↓
blockRenderer.tsx → renderBlocks() → renderBlock()
         ↓
Componentes React/Mantine
         ↓
HTML Renderizado
```

### Estrutura de Dados

```typescript
interface Block {
  name: string // Ex: "core/group"
  attributes?: BlockAttribute // Propriedades do bloco
  innerBlocks?: Block[] // Blocos filhos (recursivo)
}

interface BlockAttribute {
  [key: string]: unknown // Qualquer propriedade específica
}
```

---

## 🎨 Componentes Mantine Utilizados

- **Box**: Container genérico
- **Container**: Container com tamanho máximo
- **Group**: Flexbox horizontal
- **Stack**: Flexbox vertical
- **SimpleGrid**: CSS Grid responsivo
- **Title**: Headings
- **Image**: Imagens otimizadas
- **Button**: Botões
- **Accordion**: Acordeões

---

## 📝 Convenções de Código

### Nomeação de Funções

- Renderizadores: `renderCoreNomeBloco()`
- Exemplo: `renderCoreGroup()`, `renderCoreImage()`

### Nomeação de Interfaces

- Atributos: `CoreNomeBlocoAttributes`
- Exemplo: `CoreGroupAttributes`, `CoreStackAttributes`

### Comentários

- Todos os renderizadores devem ter comentário JSDoc
- Explicar o tipo de layout que renderiza

---

## ⚙️ Configuração Necessária

### 1. WPGraphQL Blocks Plugin (WordPress)

```bash
# Instalar plugin
wp plugin install wpgraphql-content-blocks
wp plugin activate wpgraphql-content-blocks
```

### 2. Variáveis de Ambiente (.env.local)

```env
NEXT_PUBLIC_WORDPRESS_API_URL=https://seu-site.com/graphql
```

### 3. Query GraphQL

Veja `WPGRAPHQL_BLOCKS_INTEGRATION.md` para query recomendada.

---

## 🐛 Debugging

### Logs Úteis

1. **Ver blocos recebidos:**

```tsx
console.log('Block received:', block.name, block.attributes)
```

2. **Ver tipo de layout:**

```tsx
console.log('Layout type:', layout?.type, 'orientation:', layout?.orientation)
```

3. **Ver innerBlocks:**

```tsx
console.log('Inner blocks:', block.innerBlocks?.length)
```

### Ferramentas

- Apollo DevTools (GraphQL debugging)
- React DevTools (Component hierarchy)
- Chrome DevTools (CSS/Layout debugging)

---

## 📊 Propriedades Principais por Tipo de Layout

### Flex Layout

```typescript
{
  type: 'flex'
  orientation?: 'vertical' | 'horizontal'
  justifyContent?: string
  flexWrap?: 'wrap' | 'nowrap'
}
```

### Grid Layout

```typescript
{
  type: 'grid'
  columnCount: number        // 1-6
  minimumColumnWidth?: string
}
```

### Default/Constrained

```typescript
{
  type: 'default' | 'constrained'
  contentSize?: string
  wideSize?: string
}
```

---

## 🔗 Links Úteis

- [Documentação Next.js](https://nextjs.org/docs)
- [Mantine UI](https://mantine.dev)
- [WPGraphQL](https://www.wpgraphql.com)
- [Gutenberg Blocks](https://developer.wordpress.org/block-editor/reference-guides/core-blocks/)
- [Apollo Client](https://www.apollographql.com/docs/react/)

---

## 📈 Próximas Melhorias

- [ ] Adicionar suporte a `core/columns`
- [ ] Adicionar suporte a `core/spacer`
- [ ] Adicionar responsividade automática com breakpoints
- [ ] Adicionar suporte a `core/buttons`
- [ ] Adicionar cache de blocos
- [ ] Adicionar validação de atributos
- [ ] Adicionar testes unitários
- [ ] Adicionar Storybook stories

---

## 👥 Contribuindo

Ao adicionar novo suporte a blocos:

1. Criar a interface TypeScript
2. Criar a função renderizadora com JSDoc
3. Adicionar o case ao switch
4. Adicionar exemplo em `GUTENBERG_BLOCKS_EXAMPLES.md`
5. Adicionar troubleshooting se necessário
6. Testar renderização completa

---

## 📞 Suporte

Para dúvidas ou problemas:

1. Consulte os arquivos de documentação acima
2. Verifique exemplos em `GUTENBERG_BLOCKS_EXAMPLES.md`
3. Consulte `WPGRAPHQL_BLOCKS_INTEGRATION.md` para problemas de integração
4. Abra uma issue no repositório

---

**Última atualização:** Janeiro de 2026
**Versão:** 1.0.0
