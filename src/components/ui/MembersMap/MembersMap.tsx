'use client'
import dynamic from 'next/dynamic'
import { useEffect, useState } from 'react'
import MapContent from './MapContent'
import styles from './MembersMap.module.css'
import { MapContentProps, MapMarker } from './types'

type MembersMapApiResponse = {
  markers?: MapMarker[]
}

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
  const [markers, setMarkers] = useState<MapMarker[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const controller = new AbortController()

    const loadMarkers = async () => {
      setIsLoading(true)

      try {
        const response = await fetch('/api/members-map-markers', {
          method: 'GET',
          signal: controller.signal,
        })

        if (!response.ok) {
          throw new Error(`Members map API failed with status ${response.status}`)
        }

        const data = (await response.json()) as MembersMapApiResponse
        setMarkers(data.markers ?? [])
        console.log(`[MembersMap] Markers loaded: ${data.markers?.length ?? 0}`)
      } catch (error) {
        if ((error as Error).name !== 'AbortError') {
          setMarkers([])
        }
      } finally {
        setIsLoading(false)
      }
    }

    void loadMarkers()

    return () => {
      controller.abort()
    }
  }, [])

  if (isLoading) {
    return <div className={styles.loading}>Loading map...</div>
  }

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
