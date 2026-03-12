'use client'

import { useState, useEffect, useRef } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'

type Photo = {
  id: string
  url: string
  caption: string | null
  order: number
}

type Album = {
  id: string
  title: string
  description: string | null
  eventDate: string
  coverPhotoUrl: string | null
  photos: Photo[]
  _count: { photos: number }
}

const emptyAlbum = {
  title: '',
  description: null as string | null,
  eventDate: new Date().toISOString().split('T')[0],
  coverPhotoUrl: null as string | null,
}

export default function AlbumsAdminPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [albums, setAlbums] = useState<Album[]>([])
  const [loading, setLoading] = useState(true)
  const [editing, setEditing] = useState<Album | null>(null)
  const [isNew, setIsNew] = useState(false)
  const [saving, setSaving] = useState(false)
  const [uploadingTo, setUploadingTo] = useState<string | null>(null)
  const [uploading, setUploading] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/admin/login')
    }
  }, [status, router])

  useEffect(() => {
    fetchAlbums()
  }, [])

  const fetchAlbums = async () => {
    try {
      const res = await fetch('/api/albums')
      const data = await res.json()
      setAlbums(data)
    } catch (error) {
      console.error('Error fetching albums:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleNew = () => {
    setEditing({ id: '', ...emptyAlbum, photos: [], _count: { photos: 0 } })
    setIsNew(true)
  }

  const handleEdit = (album: Album) => {
    setEditing(album)
    setIsNew(false)
  }

  const handleSave = async () => {
    if (!editing) return
    setSaving(true)

    try {
      const method = isNew ? 'POST' : 'PUT'
      const res = await fetch('/api/albums', {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: editing.id,
          title: editing.title,
          description: editing.description,
          eventDate: editing.eventDate,
          coverPhotoUrl: editing.coverPhotoUrl,
        }),
      })

      if (res.ok) {
        await fetchAlbums()
        setEditing(null)
        setIsNew(false)
      }
    } catch (error) {
      console.error('Error saving album:', error)
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this album and all its photos?')) return

    try {
      const res = await fetch(`/api/albums?id=${id}`, { method: 'DELETE' })
      if (res.ok) {
        await fetchAlbums()
      }
    } catch (error) {
      console.error('Error deleting album:', error)
    }
  }

  const handleUploadClick = (albumId: string) => {
    setUploadingTo(albumId)
    fileInputRef.current?.click()
  }

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (!files || files.length === 0 || !uploadingTo) return

    setUploading(true)
    const formData = new FormData()
    Array.from(files).forEach(file => formData.append('files', file))
    formData.append('albumId', uploadingTo)
    formData.append('type', 'photo')

    try {
      const res = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      })

      if (res.ok) {
        await fetchAlbums()
      }
    } catch (error) {
      console.error('Error uploading files:', error)
    } finally {
      setUploading(false)
      setUploadingTo(null)
      if (fileInputRef.current) {
        fileInputRef.current.value = ''
      }
    }
  }

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    })
  }

  if (status === 'loading' || loading) {
    return <div className="text-center py-8">Loading...</div>
  }

  if (!session) {
    return null
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          Photo Albums
        </h1>
        <button
          onClick={handleNew}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
        >
          Create Album
        </button>
      </div>

      {/* Hidden file input */}
      <input
        ref={fileInputRef}
        type="file"
        multiple
        accept="image/*"
        className="hidden"
        onChange={handleFileChange}
      />

      {/* Albums Grid */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {albums.map((album) => (
          <div
            key={album.id}
            className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden"
          >
            <div className="aspect-video bg-gray-100 dark:bg-gray-700 relative">
              {album.coverPhotoUrl ? (
                <Image
                  src={album.coverPhotoUrl}
                  alt={album.title}
                  fill
                  className="object-cover"
                />
              ) : (
                <div className="absolute inset-0 flex items-center justify-center text-gray-400">
                  <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
              )}
            </div>
            <div className="p-4">
              <h3 className="font-semibold text-gray-900 dark:text-white">{album.title}</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                {formatDate(album.eventDate)} &bull; {album._count.photos} photos
              </p>
              <div className="flex gap-2 mt-4">
                <button
                  onClick={() => handleUploadClick(album.id)}
                  disabled={uploading && uploadingTo === album.id}
                  className="flex-1 px-3 py-1.5 text-sm bg-green-600 text-white rounded hover:bg-green-700 transition disabled:opacity-50"
                >
                  {uploading && uploadingTo === album.id ? 'Uploading...' : 'Upload Photos'}
                </button>
                <button
                  onClick={() => handleEdit(album)}
                  className="px-3 py-1.5 text-sm text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded transition"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(album.id)}
                  className="px-3 py-1.5 text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded transition"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        ))}

        {albums.length === 0 && (
          <div className="col-span-full text-center py-12 bg-gray-50 dark:bg-gray-800 rounded-lg">
            <p className="text-gray-500 dark:text-gray-400">
              No albums created yet.
            </p>
          </div>
        )}
      </div>

      {/* Edit Modal */}
      {editing && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-xl max-w-lg w-full">
            <div className="p-6">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6">
                {isNew ? 'Create Album' : 'Edit Album'}
              </h2>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Title *
                  </label>
                  <input
                    type="text"
                    value={editing.title}
                    onChange={(e) => setEditing({ ...editing, title: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Event Date *
                  </label>
                  <input
                    type="date"
                    value={editing.eventDate.split('T')[0]}
                    onChange={(e) => setEditing({ ...editing, eventDate: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Description
                  </label>
                  <textarea
                    value={editing.description || ''}
                    onChange={(e) => setEditing({ ...editing, description: e.target.value || null })}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-3 mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
                <button
                  onClick={() => { setEditing(null); setIsNew(false) }}
                  className="px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSave}
                  disabled={saving || !editing.title || !editing.eventDate}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition disabled:opacity-50"
                >
                  {saving ? 'Saving...' : 'Save'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
