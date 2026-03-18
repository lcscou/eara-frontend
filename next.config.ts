import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    remotePatterns: [
      new URL('https://eara.x00.online/**'),
      new URL('http://eara.local/**'),
      new URL('http://raw.githubusercontent.com'),
      new URL('https://mediumorchid-capybara-348184.hostingersite.com/**'),
    ],
  },
}

export default nextConfig
