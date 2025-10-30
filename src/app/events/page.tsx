import ArchiveEventsTemplate from '@/components/templates/Events/ArchiveEvents'
import PageTitleBar from '@/components/ui/PageTitleBar/PageTitleBar'
import { GetAllEventsDocument } from '@/graphql/generated/graphql'
import { query } from '@/lib/apollo-client'
export default async function ArchiveEvents({
  searchParams,
}: {
  searchParams: { page?: string; category?: string; organizer?: string }
}) {
  const pageNumber = await searchParams
  // const { page } = pageNumber
  const page = pageNumber.page ? parseInt(pageNumber.page) : 10
  console.log('Page number:', page)
  const { data } = await query({
    query: GetAllEventsDocument,
    variables: {
      first: page,
      category: searchParams.category || null,
      organizer: searchParams.organizer || null,
    },
  })

  console.log('Events data:', data)

  return (
    <>
      <PageTitleBar title="EARA Events" subtitle="events" />
      <ArchiveEventsTemplate data={data} />
    </>
  )
}
