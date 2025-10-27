// import s from './ArchiveAnimals.module.css';
import { GetAllAnimalsQuery } from '@/graphql/generated/graphql'

interface ArchiveAnimalsProps {
  data: GetAllAnimalsQuery
}

export default function ArchiveAnimals({ data }: ArchiveAnimalsProps) {
  return <code>{JSON.stringify(data.animals?.nodes, null, 2)}</code>
}
