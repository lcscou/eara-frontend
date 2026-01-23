'use client'
import { GetAllMembersDocument } from '@/graphql/generated/graphql'
import { useSuspenseQuery } from '@apollo/client/react'
import dynamic from 'next/dynamic'
import { useMemo, useState } from 'react'
import MapContent from './MapContent'
import styles from './MembersMap.module.css'
import { MapContentProps, MapMarker } from './types'
const DynamicMap = dynamic<MapContentProps>(() => Promise.resolve(MapContent), {
  loading: () => <div className={styles.loading}>Loading map...</div>,
  ssr: false,
})
interface MembersMapProps {
  width?: string | number
  height?: string | number
}
export default function MembersMap({ width = '100%', height = '600px' }: MembersMapProps) {
  const [selectedMarker, setSelectedMarker] = useState<string | null>(null)
  // Buscar todos os membros com todos os campos necessários
  const { data: membersData } = useSuspenseQuery(GetAllMembersDocument, {
    variables: { first: 1000 },
  })
  const markers: MapMarker[] = useMemo(() => {
    const members = membersData?.members?.nodes ?? []
    return members
      .filter((member): member is NonNullable<(typeof members)[number]> => {
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
  }, [membersData])
  if (markers.length === 0) {
    return null
  }
  return (
    <div className={styles.mapContainer} style={{ width, height }}>
      <DynamicMap
        markers={markers}
        selectedMarker={selectedMarker}
        onSelectMarker={setSelectedMarker}
      />
    </div>
  )
}
