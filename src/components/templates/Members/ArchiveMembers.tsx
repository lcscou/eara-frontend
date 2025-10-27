// import s from './ArchiveMembers.module.css';
import { GetAllMembersQuery } from '@/graphql/generated/graphql'

interface ArchiveMembersProps {
  data: GetAllMembersQuery
}

export default function ArchiveMembers({ data }: ArchiveMembersProps) {
  return <code>{JSON.stringify(data.members?.nodes, null, 2)}</code>
}
