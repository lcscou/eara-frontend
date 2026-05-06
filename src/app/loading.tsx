import { LogoLoader } from '@/components/ui/LogoLoader/LogoLoader'

export default function Loading() {
  return (
    <div className="flex h-screen w-full items-center justify-center">
      <LogoLoader />
    </div>
  )
}
