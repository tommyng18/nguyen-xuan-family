'use client'

import { useEffect, useState } from 'react'
import dynamic from 'next/dynamic'

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

// Dynamically import map component to avoid SSR issues with Leaflet
const MapComponent = dynamic(() => import('./MapComponent'), {
  ssr: false,
  loading: () => (
    <div className="aspect-[4/3] bg-gray-100 dark:bg-gray-800 rounded-lg flex items-center justify-center">
      <p className="text-gray-500">Loading map...</p>
    </div>
  ),
})

export default function AddressMap({ members }: Props) {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return (
      <div className="aspect-[4/3] bg-gray-100 dark:bg-gray-800 rounded-lg flex items-center justify-center">
        <p className="text-gray-500">Loading map...</p>
      </div>
    )
  }

  return <MapComponent members={members} />
}
