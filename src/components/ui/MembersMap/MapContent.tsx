import { GoogleMap, InfoWindow, Marker, useJsApiLoader } from '@react-google-maps/api'
import Image from 'next/image'
import { useEffect, useMemo, useState } from 'react'
import styles from './MembersMap.module.css'
import { MapContentProps } from './types'

const containerStyle = {
  width: '100%',
  height: '500px',
}

const DEFAULT_ZOOM = 3

export default function MapContent({ markers, selectedMarker, onSelectMarker }: MapContentProps) {
  const [mapInstance, setMapInstance] = useState<google.maps.Map | null>(null)

  const { isLoaded } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY ?? '',
  })

  const defaultCenter = useMemo(() => {
    if (markers.length === 0) return { lat: 0, lng: 0 }
    return { lat: markers[0].latitude, lng: markers[0].longitude }
  }, [markers])

  useEffect(() => {
    if (!mapInstance || markers.length === 0) return

    const bounds = new google.maps.LatLngBounds()
    markers.forEach((m) => bounds.extend({ lat: m.latitude, lng: m.longitude }))
    mapInstance.fitBounds(bounds, 50)
  }, [mapInstance, markers])

  useEffect(() => {
    if (!mapInstance || !selectedMarker) return
    const marker = markers.find((m) => m.id === selectedMarker)
    if (marker) {
      mapInstance.panTo({ lat: marker.latitude, lng: marker.longitude })
      mapInstance.setZoom(Math.max(mapInstance.getZoom() ?? DEFAULT_ZOOM, 8))
    }
  }, [mapInstance, markers, selectedMarker])

  if (!isLoaded) {
    return <div className={styles.loading}>Carregando mapa...</div>
  }

  return (
    <GoogleMap
      mapContainerStyle={containerStyle}
      center={defaultCenter}
      zoom={DEFAULT_ZOOM}
      options={{
        streetViewControl: false,
        mapTypeControl: false,
        fullscreenControl: false,
        zoomControl: false,
      }}
      onLoad={(map) => setMapInstance(map)}
    >
      {markers.map((marker) => (
        <Marker
          key={marker.id}
          position={{ lat: marker.latitude, lng: marker.longitude }}
          onMouseOver={() => onSelectMarker(marker.id)}
          onMouseOut={() => onSelectMarker(null)}
          onClick={() => onSelectMarker(marker.id)}
          icon={
            selectedMarker === marker.id
              ? {
                  url: '/favicon.ico',
                  scaledSize: new google.maps.Size(32, 32),
                }
              : undefined
          }
        >
          {selectedMarker === marker.id && (
            <InfoWindow onCloseClick={() => onSelectMarker(null)}>
              <div className={styles.infoContent}>
                {marker.featuredImage && (
                  <Image
                    src={marker.featuredImage}
                    alt={marker.title}
                    className={styles.infoImage}
                    width={280}
                    height={180}
                  />
                )}
                <h3 className={styles.infoTitle}>{marker.title}</h3>
                {marker.website && (
                  <a
                    href={marker.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={styles.infoLink}
                  >
                    Visitar website →
                  </a>
                )}
              </div>
            </InfoWindow>
          )}
        </Marker>
      ))}
    </GoogleMap>
  )
}
