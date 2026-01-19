export interface MapMarker {
  id: string
  title: string
  latitude: number
  longitude: number
  featuredImage?: string
  website?: string
}

export interface MapContentProps {
  markers: MapMarker[]
  selectedMarker: string | null
  onSelectMarker: (id: string | null) => void
}
