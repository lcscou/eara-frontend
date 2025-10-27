// import s from './ArchiveNews.module.css';
import { GetAllNewsQuery } from '@/graphql/generated/graphql'

interface ArchiveNewsProps {
  data: GetAllNewsQuery
}

export default function ArchiveNews({ data }: ArchiveNewsProps) {
  return <code>{JSON.stringify(data.allNews?.nodes, null, 2)}</code>
}
