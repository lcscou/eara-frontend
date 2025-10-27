import Link from 'next/link'

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
