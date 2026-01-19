'use client'

import { GetAllMembersQuery } from '@/graphql/generated/graphql'
import { Container } from '@mantine/core'
import dynamic from 'next/dynamic'
import { useMemo, useState } from 'react'
import MapContent from './MapContent'
import styles from './MembersMap.module.css'
import { MapContentProps, MapMarker } from './types'

const DynamicMap = dynamic<MapContentProps>(() => Promise.resolve(MapContent), {
  loading: () => <div className={styles.loading}>Carregando mapa...</div>,
  ssr: false,
})

interface MembersMapProps {
  members: Array<
    NonNullable<NonNullable<GetAllMembersQuery['members']>['nodes']>[number] | null | undefined
  >
}

export default function MembersMap({ members }: MembersMapProps) {
  const [selectedMarker, setSelectedMarker] = useState<string | null>(null)

  const markers: MapMarker[] = useMemo(() => {
    return members
      .filter((member): member is NonNullable<MembersMapProps['members'][number]> => {
        if (!member) return false
        const lat = parseFloat(member.acfMembers?.geolocation?.latitude ?? '')
        const lon = parseFloat(member.acfMembers?.geolocation?.longitude ?? '')
        return !Number.isNaN(lat) && !Number.isNaN(lon)
      })
      .map((member) => ({
        id: member.id,
        title: member.title || 'Sem título',
        latitude: parseFloat(member.acfMembers?.geolocation?.latitude ?? '0'),
        longitude: parseFloat(member.acfMembers?.geolocation?.longitude ?? '0'),
        featuredImage: member.featuredImage?.node?.guid || undefined,
        website: member.acfMembers?.website || undefined,
      }))
  }, [members])

  if (markers.length === 0) {
    return null
  }

  return (
    <Container size="xl" my={100}>
      <div className={styles.mapContainer}>
        <DynamicMap
          markers={markers}
          selectedMarker={selectedMarker}
          onSelectMarker={setSelectedMarker}
        />
      </div>
    </Container>
  )
}
