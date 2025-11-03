// import s from './ArchiveAnimals.module.css';
import AnimalsCard from '@/components/ui/AnimalsCard/AnimalsCard'
import { GetAllAnimalsQuery } from '@/graphql/generated/graphql'

interface ArchiveAnimalsProps {
  data: GetAllAnimalsQuery
}

export default function ArchiveAnimals({ data }: ArchiveAnimalsProps) {
  return (
    <>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        {data.animals?.nodes?.map((animal) => (
          <div key={animal?.id} className="card">
            <AnimalsCard
              id={animal?.id}
              title={animal?.title}
              uri={animal.uri}
              featuredImage={animal.featuredImage?.node.guid}
            />
          </div>
        ))}
      </div>
    </>
  )
}
