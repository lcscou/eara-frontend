import { GetAllDiseasesQuery } from '@/graphql/generated/graphql'

interface ArchiveDiseasesProps {
  data: GetAllDiseasesQuery
}

export default function ArchiveDiseases({ data }: ArchiveDiseasesProps) {
  return <div>{JSON.stringify(data, null, 2)}</div>
}
