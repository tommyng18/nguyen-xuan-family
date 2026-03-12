'use client'

import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'

// Fix default marker icon issue with Next.js
const icon = L.icon({
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
})

type Member = {
  id: string
  name: string
  relationship: string | null
  address: string | null
  latitude: number | null
  longitude: number | null
}

type Props = {
  members: Member[]
}

export default function MapComponent({ members }: Props) {
  // Calculate center from members or default to a central location
  const validMembers = members.filter(m => m.latitude && m.longitude)

  const center: [number, number] = validMembers.length > 0
    ? [
        validMembers.reduce((sum, m) => sum + (m.latitude || 0), 0) / validMembers.length,
        validMembers.reduce((sum, m) => sum + (m.longitude || 0), 0) / validMembers.length,
      ]
    : [21.0285, 105.8542] // Default to Hanoi, Vietnam

  return (
    <MapContainer
      center={center}
      zoom={5}
      className="aspect-[4/3] rounded-lg z-0"
      scrollWheelZoom={true}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      {validMembers.map((member) => (
        <Marker
          key={member.id}
          position={[member.latitude!, member.longitude!]}
          icon={icon}
        >
          <Popup>
            <div className="text-sm">
              <strong>{member.name}</strong>
              {member.relationship && (
                <div className="text-gray-500">{member.relationship}</div>
              )}
              {member.address && (
                <div className="mt-1">{member.address}</div>
              )}
            </div>
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  )
}
