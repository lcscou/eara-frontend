# Configuração WordPress para Revalidação Automática

Este documento explica como configurar o WordPress para enviar webhooks de revalidação ao Next.js sempre que o conteúdo for atualizado.

## 📋 Pré-requisitos

- Acesso ao WordPress (admin)
- Acesso ao servidor (para adicionar variáveis de ambiente)
- Plugin habilitado ou acesso ao `functions.php` do tema

## 🔧 Opção 1: Plugin Personalizado (Recomendado)

### Passo 1: Criar o Plugin

Crie um arquivo em `/wp-content/plugins/nextjs-revalidation/nextjs-revalidation.php`:

```php
<?php
/**
 * Plugin Name: Next.js Revalidation
 * Description: Envia webhooks para revalidar o cache do Next.js quando conteúdo é atualizado
 * Version: 1.0.0
 * Author: EARA
 */

if (!defined('ABSPATH')) {
    exit;
}

class NextJS_Revalidation {

    private $nextjs_url;
    private $secret;

    public function __construct() {
        $this->nextjs_url = getenv('NEXTJS_REVALIDATE_URL') ?: 'https://seu-site.com/api/revalidate';
        $this->secret = getenv('NEXTJS_REVALIDATE_SECRET') ?: '';

        // Hooks para quando posts são salvos
        add_action('save_post', [$this, 'on_save_post'], 10, 3);
        add_action('delete_post', [$this, 'on_delete_post'], 10, 1);

        // Hooks para quando termos são atualizados
        add_action('edited_term', [$this, 'on_edit_term'], 10, 3);
        add_action('delete_term', [$this, 'on_delete_term'], 10, 4);

        // Hook para quando media é atualizada
        add_action('attachment_updated', [$this, 'on_media_update'], 10, 3);
    }

    /**
     * Quando um post é salvo ou atualizado
     */
    public function on_save_post($post_id, $post, $update) {
        // Ignorar revisões e rascunhos
        if (wp_is_post_revision($post_id) || $post->post_status !== 'publish') {
            return;
        }

        // Ignorar auto-saves
        if (defined('DOING_AUTOSAVE') && DOING_AUTOSAVE) {
            return;
        }

        $path = '/' . $post->post_name;
        $type = $post->post_type;

        // Mapear custom post types para rotas corretas
        $type_map = [
            'post' => 'news',
            'news' => 'news',
            'events' => 'events',
            'case-studies' => 'case-studies',
            'animal' => 'animals',
            'member' => 'members',
            'page' => 'page'
        ];

        $mapped_type = $type_map[$type] ?? $type;

        $this->trigger_revalidation($path, $mapped_type);

        // Log para debug
        error_log("NextJS Revalidation: Post saved - {$post->post_title} ({$type})");
    }

    /**
     * Quando um post é deletado
     */
    public function on_delete_post($post_id) {
        $post = get_post($post_id);
        if (!$post) return;

        $path = '/' . $post->post_name;
        $type = $post->post_type;

        $this->trigger_revalidation($path, $type);

        error_log("NextJS Revalidation: Post deleted - {$post->post_title}");
    }

    /**
     * Quando um termo (categoria/tag) é editado
     */
    public function on_edit_term($term_id, $tt_id, $taxonomy) {
        $term = get_term($term_id);
        if (!$term) return;

        // Revalidar todas as páginas que podem usar esta categoria
        $this->trigger_revalidation('', $taxonomy);

        error_log("NextJS Revalidation: Term edited - {$term->name} ({$taxonomy})");
    }

    /**
     * Quando um termo é deletado
     */
    public function on_delete_term($term_id, $tt_id, $taxonomy, $deleted_term) {
        $this->trigger_revalidation('', $taxonomy);

        error_log("NextJS Revalidation: Term deleted ({$taxonomy})");
    }

    /**
     * Quando media é atualizada
     */
    public function on_media_update($post_id, $post_after, $post_before) {
        $this->trigger_revalidation('', 'media');

        error_log("NextJS Revalidation: Media updated");
    }

    /**
     * Envia o webhook para o Next.js
     */
    private function trigger_revalidation($path, $type) {
        if (empty($this->secret)) {
            error_log('NextJS Revalidation: Secret not configured!');
            return;
        }

        $body = [
            'path' => $path,
            'type' => $type,
            'tag' => $type,
            'timestamp' => current_time('timestamp')
        ];

        $response = wp_remote_post($this->nextjs_url, [
            'headers' => [
                'Content-Type' => 'application/json',
                'x-revalidate-secret' => $this->secret
            ],
            'body' => json_encode($body),
            'timeout' => 10,
            'blocking' => false // Não bloquear o WordPress
        ]);

        if (is_wp_error($response)) {
            error_log('NextJS Revalidation Error: ' . $response->get_error_message());
        }
    }
}

// Inicializar o plugin
new NextJS_Revalidation();
```

### Passo 2: Ativar o Plugin

1. Vá em **Plugins** → **Plugins Instalados**
2. Encontre "Next.js Revalidation"
3. Clique em **Ativar**

## 🔧 Opção 2: functions.php do Tema

Se preferir não criar um plugin, adicione este código ao `functions.php` do seu tema:

```php
<?php
// Adicionar no final do functions.php

add_action('save_post', 'nextjs_revalidate_on_save', 10, 3);
add_action('delete_post', 'nextjs_revalidate_on_delete');

function nextjs_revalidate_on_save($post_id, $post, $update) {
    if (wp_is_post_revision($post_id) || $post->post_status !== 'publish') {
        return;
    }

    $path = '/' . $post->post_name;
    $type = $post->post_type;

    nextjs_trigger_revalidation($path, $type);
}

function nextjs_revalidate_on_delete($post_id) {
    $post = get_post($post_id);
    if (!$post) return;

    $path = '/' . $post->post_name;
    nextjs_trigger_revalidation($path, $post->post_type);
}

function nextjs_trigger_revalidation($path, $type) {
    $url = getenv('NEXTJS_REVALIDATE_URL') ?: 'https://seu-site.com/api/revalidate';
    $secret = getenv('NEXTJS_REVALIDATE_SECRET');

    if (empty($secret)) {
        error_log('NextJS: Secret not configured!');
        return;
    }

    wp_remote_post($url, [
        'headers' => [
            'Content-Type' => 'application/json',
            'x-revalidate-secret' => $secret
        ],
        'body' => json_encode([
            'path' => $path,
            'type' => $type,
            'tag' => $type
        ]),
        'timeout' => 10,
        'blocking' => false
    ]);
}
```

## 🔐 Configurar Variáveis de Ambiente

### No servidor WordPress, adicione ao `.env` ou `wp-config.php`:

**Opção A: Arquivo .env (recomendado)**

```bash
NEXTJS_REVALIDATE_URL=https://seu-site-nextjs.com/api/revalidate
NEXTJS_REVALIDATE_SECRET=seu_token_super_secreto_aqui_123
```

**Opção B: wp-config.php**

```php
// Adicionar antes de "That's all, stop editing!"
putenv('NEXTJS_REVALIDATE_URL=https://seu-site-nextjs.com/api/revalidate');
putenv('NEXTJS_REVALIDATE_SECRET=seu_token_super_secreto_aqui_123');
```

## ✅ Testar a Configuração

1. **Edite um post** no WordPress
2. **Publique ou atualize** o post
3. **Verifique os logs** do WordPress em `wp-content/debug.log`:
   ```
   NextJS Revalidation: Post saved - Meu Post (news)
   ```
4. **Verifique no Next.js** se a página foi revalidada (pode demorar alguns segundos)

## 🐛 Debugging

### Habilitar logs no WordPress:

Adicione ao `wp-config.php`:

```php
define('WP_DEBUG', true);
define('WP_DEBUG_LOG', true);
define('WP_DEBUG_DISPLAY', false);
```

Os logs ficarão em `wp-content/debug.log`

### Verificar se o webhook está sendo enviado:

```php
// Adicionar temporariamente no plugin
error_log('Revalidation URL: ' . $this->nextjs_url);
error_log('Has secret: ' . (!empty($this->secret) ? 'yes' : 'no'));
```

## 🚀 Plugins WordPress Alternativos

Se preferir usar plugins existentes:

1. **WPGraphQL Smart Cache** - https://github.com/wp-graphql/wpgraphql-smart-cache
   - Cache inteligente para WPGraphQL
   - Purge automático no Next.js

2. **Webhooks** - Plugin nativo do WordPress
   - Configure webhooks manuais
   - Mais configurável, mas requer setup manual

## 📝 Notas Importantes

- O webhook é **não-bloqueante** (`blocking: false`) para não afetar performance do WordPress
- Funciona com **qualquer custom post type**
- Suporta **categorias e tags**
- Logs ajudam no debugging em produção
- O secret deve ser o **mesmo** no WordPress e Next.js

## 🔗 Referências

- [Next.js On-Demand Revalidation](https://nextjs.org/docs/app/building-your-application/data-fetching/incremental-static-regeneration)
- [WordPress Action Hooks](https://developer.wordpress.org/reference/hooks/)
