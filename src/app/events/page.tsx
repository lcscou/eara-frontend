import ArchiveEventsTemplate from '@/components/templates/Events/ArchiveEvents'
import PageTitleBar from '@/components/ui/PageTitleBar/PageTitleBar'
import { GetAllEventsDocument } from '@/graphql/generated/graphql'
import { query } from '@/lib/apollo-client'
export default async function ArchiveEvents() {
  const { data } = await query({
    query: GetAllEventsDocument,
    variables: { first: 10 },
  })

  console.log('Events data:', data)

  return (
    <>
      <PageTitleBar title="Events" />
      <ArchiveEventsTemplate data={data} />
    </>
  )
}
