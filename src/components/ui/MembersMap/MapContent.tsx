import {
  GoogleMap,
  InfoWindow,
  Marker,
  MarkerClusterer,
  useJsApiLoader,
} from '@react-google-maps/api'
import Image from 'next/image'
import { useEffect, useMemo, useState } from 'react'
import styles from './MembersMap.module.css'
import { MapContentProps } from './types'

const containerStyle = {
  width: '100%',
  height: '500px',
  borderRadius: '15px',
}

const DEFAULT_ZOOM = 3

// Cria um ícone SVG personalizado para o marcador
const createMarkerIcon = (color: string = '#c91919', size: number = 32) => {
  const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 24 24" fill="${color}" stroke="none">
      <path d="M18.364 4.636a9 9 0 0 1 .203 12.519l-.203 .21l-4.243 4.242a3 3 0 0 1 -4.097 .135l-.144 -.135l-4.244 -4.243a9 9 0 0 1 12.728 -12.728zm-6.364 3.364a3 3 0 1 0 0 6a3 3 0 0 0 0 -6z" />
    </svg>
  `.trim()
  return `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(svg)}`
}

// Ícone SVG customizado para o cluster
const clusterIcon = (count: number) => {
  const svg = `
    <svg fill="#8FBF29" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 240 240">
      <circle cx="120" cy="120" opacity="1" r="70" />
      <circle cx="120" cy="120" opacity=".3" r="90" />
      <circle cx="120" cy="120" opacity=".2" r="110" />
      <text x="50%" y="50%" text-anchor="middle" fill="#8FBF29" font-size="65px" font-weight="bold" dy=".3em">${count}</text>
    </svg>
  `
  return `data:image/svg+xml;base64,${btoa(svg)}`
}

// Opções customizadas para o cluster
const clusterStyles = [
  {
    textColor: 'black',
    url: clusterIcon(0),
    height: 60,
    width: 60,
  },
]

const clusterOptions = {
  styles: clusterStyles,
}

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
      // mapInstance.setZoom(Math.max(mapInstance.getZoom() ?? DEFAULT_ZOOM, 1))
    }
  }, [mapInstance, markers, selectedMarker])

  if (!isLoaded) {
    return <div className={styles.loading}>Loading map...</div>
  }

  return (
    <GoogleMap
      mapContainerStyle={containerStyle}
      center={defaultCenter}
      zoom={DEFAULT_ZOOM}
      options={{
        streetViewControl: false,
        mapTypeControl: false,
        // minZoom: 80,
        minZoom: 2.3,
        gestureHandling: 'greedy',
        fullscreenControl: false,
        zoomControl: false,
      }}
      onLoad={(map) => setMapInstance(map)}
    >
      <MarkerClusterer
        averageCenter
        enableRetinaIcons
        gridSize={80}
        minimumClusterSize={2}
        options={clusterOptions}
      >
        {(clusterer) => (
          <>
            {markers.map((marker) => (
              <Marker
                key={marker.id}
                clusterer={clusterer}
                position={{ lat: marker.latitude, lng: marker.longitude }}
                // onMouseOver={() => onSelectMarker(marker.id)}
                // onMouseOut={() => onSelectMarker(null)}
                onClick={() => onSelectMarker(marker.id)}
                icon={{
                  url: createMarkerIcon(selectedMarker === marker.id ? '#3E4ABB' : '#3E4ABB'),
                  scaledSize: new google.maps.Size(32, 32),
                  anchor: new google.maps.Point(16, 32), // ancora o ícone na base do pin
                }}
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
                          Visit website →
                        </a>
                      )}
                    </div>
                  </InfoWindow>
                )}
              </Marker>
            ))}
          </>
        )}
      </MarkerClusterer>
    </GoogleMap>
  )
}
