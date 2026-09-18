export const AUTH_COOKIE_NAME = 'eara_auth_token'
export const REFRESH_TOKEN_COOKIE_NAME = 'eara_refresh_token'

export function getAuthCookieName(siteKey: string): string {
  return `${AUTH_COOKIE_NAME}_${siteKey}`
}

export function getRefreshTokenCookieName(siteKey: string): string {
  return `${REFRESH_TOKEN_COOKIE_NAME}_${siteKey}`
}
