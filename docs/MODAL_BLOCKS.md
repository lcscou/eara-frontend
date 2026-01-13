# Blocos de Modal - eara/modal-trigger e eara/modal-content

## Visão Geral

O sistema de modais permite criar e gerenciar múltiplos modais em uma página usando dois blocos do Gutenberg:

- **`eara/modal-trigger`**: Torna seus blocos filhos clicáveis para abrir um modal
- **`eara/modal-content`**: Define o conteúdo e configurações de um modal

Ambos os blocos são conectados através de um `triggerId` único.

## Arquitetura

### Componentes Principais

1. **ModalsContext** (`src/contexts/ModalsContext.tsx`)
   - Gerencia o estado global de todos os modais
   - Usa `useModalsStack` do Mantine para controlar a pilha de modais
   - Registra e desregistra modais dinamicamente

2. **ModalTrigger** (`src/components/ui/ModalTrigger/ModalTrigger.tsx`)
   - Torna elementos clicáveis
   - Não modifica estilos dos filhos, apenas adiciona `onClick`
   - Abre o modal correspondente ao `triggerId`

3. **ModalContent** (`src/components/ui/ModalContent/ModalContent.tsx`)
   - Registra o modal no contexto quando montado
   - Não renderiza nada visualmente na página
   - Define todas as configurações do modal

## Uso no Gutenberg

### 1. Adicionar Conteúdo do Modal

Adicione um bloco `eara/modal-content` na sua página:

```json
{
  "name": "eara/modal-content",
  "attributes": {
    "triggerId": "meu-modal",
    "title": "Título do Modal",
    "centered": true,
    "size": "md",
    "withCloseButton": true,
    "fullScreen": false
  },
  "innerBlocks": [
    // Coloque aqui o conteúdo do modal
    // Qualquer bloco do Gutenberg (parágrafos, imagens, etc.)
  ]
}
```

### 2. Adicionar Trigger

Adicione um bloco `eara/modal-trigger` onde deseja ter o elemento clicável:

```json
{
  "name": "eara/modal-trigger",
  "attributes": {
    "triggerId": "meu-modal"
  },
  "innerBlocks": [
    // Coloque aqui os blocos que serão clicáveis
    // Ex: botões, cards, imagens, etc.
  ]
}
```

## Atributos

### eara/modal-trigger

| Atributo    | Tipo   | Padrão | Descrição                       |
| ----------- | ------ | ------ | ------------------------------- |
| `triggerId` | string | ""     | ID único para conectar ao modal |
| `className` | string | ""     | Classes CSS adicionais          |
| `metadata`  | object | {}     | Metadados do bloco              |

### eara/modal-content

| Atributo          | Tipo    | Padrão | Descrição                         |
| ----------------- | ------- | ------ | --------------------------------- |
| `triggerId`       | string  | ""     | ID único para conectar ao trigger |
| `title`           | string  | ""     | Título do modal                   |
| `centered`        | boolean | false  | Centraliza o modal na tela        |
| `size`            | string  | "md"   | Tamanho do modal (sm, md, lg, xl) |
| `withCloseButton` | boolean | true   | Mostra botão de fechar            |
| `fullScreen`      | boolean | false  | Modal em tela cheia               |
| `lock`            | object  | {}     | Configurações de bloqueio         |
| `className`       | string  | ""     | Classes CSS adicionais            |
| `metadata`        | object  | {}     | Metadados do bloco                |

## Exemplos

### Modal Simples

```jsx
// Modal Content
<ModalContent triggerId="welcome" title="Bem-vindo!" centered size="md">
  <p>Olá! Este é um modal simples.</p>
</ModalContent>

// Trigger
<ModalTrigger triggerId="welcome">
  <Button>Abrir Modal</Button>
</ModalTrigger>
```

### Modal com Conteúdo Complexo

```jsx
// Modal Content
<ModalContent triggerId="gallery" title="Galeria" size="xl">
  <div>
    <h2>Galeria de Imagens</h2>
    <Grid>
      <Image src="..." />
      <Image src="..." />
      <Image src="..." />
    </Grid>
  </div>
</ModalContent>

// Trigger pode ser um card inteiro
<ModalTrigger triggerId="gallery">
  <Card>
    <img src="thumbnail.jpg" />
    <h3>Clique para ver galeria</h3>
  </Card>
</ModalTrigger>
```

### Modal Fullscreen

```jsx
<ModalContent
  triggerId="form"
  title="Formulário de Contato"
  fullScreen
>
  <form>
    <input type="text" placeholder="Nome" />
    <input type="email" placeholder="Email" />
    <textarea placeholder="Mensagem"></textarea>
    <button>Enviar</button>
  </form>
</ModalContent>

<ModalTrigger triggerId="form">
  <Button>Preencher Formulário</Button>
</ModalTrigger>
```

### Múltiplos Modais na Mesma Página

```jsx
// Defina múltiplos modais com triggerId diferentes
<ModalContent triggerId="modal-1" title="Modal 1">...</ModalContent>
<ModalContent triggerId="modal-2" title="Modal 2">...</ModalContent>
<ModalContent triggerId="modal-3" title="Modal 3">...</ModalContent>

// Cada trigger abre seu modal correspondente
<ModalTrigger triggerId="modal-1"><Button>Modal 1</Button></ModalTrigger>
<ModalTrigger triggerId="modal-2"><Button>Modal 2</Button></ModalTrigger>
<ModalTrigger triggerId="modal-3"><Button>Modal 3</Button></ModalTrigger>
```

## Como Funciona

1. **Registro**: Quando `eara/modal-content` é renderizado, ele se registra no `ModalsContext`
2. **Renderização**: O contexto renderiza todos os modais registrados usando `Modal.Stack` do Mantine
3. **Trigger**: Quando o usuário clica em um `eara/modal-trigger`, ele chama `openModal(triggerId)`
4. **Abertura**: O contexto usa `useModalsStack` para abrir o modal correspondente
5. **Limpeza**: Quando o componente é desmontado, o modal é desregistrado automaticamente

## Vantagens

- ✅ **Simples**: Apenas dois blocos para criar modais completos
- ✅ **Flexível**: Qualquer conteúdo pode ir dentro do modal
- ✅ **Múltiplos Modais**: Suporta vários modais na mesma página
- ✅ **Não-intrusivo**: O trigger não modifica estilos dos filhos
- ✅ **Gerenciamento Global**: Estado centralizado para todos os modais
- ✅ **Stack de Modais**: Suporta modais empilhados usando Mantine

## Estrutura de Arquivos

```
src/
├── contexts/
│   └── ModalsContext.tsx          # Contexto global de modais
├── components/
│   └── ui/
│       ├── ModalTrigger/
│       │   └── ModalTrigger.tsx   # Componente trigger
│       └── ModalContent/
│           └── ModalContent.tsx   # Componente content
└── lib/
    └── blockRenderer.tsx          # Integração com renderizador
```

## Página de Teste

Acesse `/teste` para ver exemplos funcionais dos modais.
