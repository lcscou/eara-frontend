# Reset password link adjustment (WordPress)

To ensure the reset email sends users to the application, add the snippet below to the active theme (functions.php) or a custom plugin.

> Replace `https://your-domain.com` with your frontend domain.

```php
add_filter('retrieve_password_message', function ($message, $key, $user_login, $user_data) {
  $frontend_url = 'https://your-domain.com/reset-password';
  $reset_link = add_query_arg(
    [
      'key' => $key,
      'login' => rawurlencode($user_login),
    ],
    $frontend_url
  );

  $message = "Someone requested a password reset for your account.\r\n\r\n";
  $message .= "If it wasn't you, ignore this email.\r\n\r\n";
  $message .= "To reset your password, visit the link below:\r\n\r\n";
  $message .= $reset_link . "\r\n";

  return $message;
}, 10, 4);
```
