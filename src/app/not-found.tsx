import { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'EARA | Not Found',
  description: 'The requested resource could not be found.',
}

export default function NotFound() {
  return (
    <div className="pt-[220px] pb-[110px]">
      <div className="my-auto flex flex-col items-center justify-center gap-4">
        <h2 className="text-4xl font-bold">Not Found</h2>
        <p>Could not find requested resource</p>
        <Link href="/">Return Home</Link>
      </div>
    </div>
  )
}
