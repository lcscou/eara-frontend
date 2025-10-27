import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    remotePatterns: [new URL('http://eara.local/**'), new URL('http://raw.githubusercontent.com')],
  },
}

export default nextConfig
