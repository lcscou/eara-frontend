export const PRIVATE_UPLOADS_PATH = '/wp-content/private-uploads/'

export function isPrivateUploadsUrl(url: string): boolean {
  return typeof url === 'string' && url.includes(PRIVATE_UPLOADS_PATH)
}
