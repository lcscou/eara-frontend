import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    remotePatterns: [
      new URL('https://eara.x00.online/**'),
      new URL('http://eara.local/**'),
      new URL('http://raw.githubusercontent.com'),
    ],
  },
}

export default nextConfig
