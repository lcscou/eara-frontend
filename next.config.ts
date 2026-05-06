import type { NextConfig } from 'next'
const hosts = [
  'eara.x00.online',
  'eara.local',
  'raw.githubusercontent.com',
  'lightskyblue-camel-505374.hostingersite.com',
  'backofficeadmin.eara.eu',
]

const protocols = ['http', 'https'] as const

const remotePatterns = hosts.flatMap((hostname) =>
  protocols.map((protocol) => ({
    protocol,
    hostname,
    pathname: '/**',
  }))
)
const nextConfig: NextConfig = {
  /* config options here */
  images: {
    remotePatterns,
  },
}

export default nextConfig
