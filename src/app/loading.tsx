import { LogoLoader } from '@/components/ui/LogoLoader/LogoLoader'

export default function Loading() {
  return (
    <div className="fixed top-0 left-0 z-99999999 flex h-screen w-full items-center justify-center bg-white">
      <LogoLoader />
    </div>
  )
}
