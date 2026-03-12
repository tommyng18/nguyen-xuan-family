import { prisma } from '@/lib/prisma'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import PhotoGallery from '@/components/PhotoGallery'

export const dynamic = 'force-dynamic'

type Props = {
  params: Promise<{ id: string }>
}

export default async function AlbumPage({ params }: Props) {
  const { id } = await params

  const album = await prisma.album.findUnique({
    where: { id },
    include: {
      photos: {
        orderBy: { order: 'asc' }
      }
    }
  })

  if (!album) {
    notFound()
  }

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    })
  }

  return (
    <div className="container-page py-8">
      {/* Back link */}
      <Link
        href="/albums"
        className="inline-flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-blue-600 mb-6"
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
        Back to Albums
      </Link>

      {/* Album header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
          {album.title}
        </h1>
        <p className="text-gray-500 dark:text-gray-400">
          {formatDate(album.eventDate)} &bull; {album.photos.length} photos
        </p>
        {album.description && (
          <p className="mt-4 text-gray-600 dark:text-gray-300">
            {album.description}
          </p>
        )}
      </div>

      {/* Photos */}
      {album.photos.length === 0 ? (
        <div className="text-center py-16 bg-gray-50 dark:bg-gray-800 rounded-lg">
          <p className="text-gray-500 dark:text-gray-400">
            No photos in this album yet.
          </p>
        </div>
      ) : (
        <PhotoGallery photos={album.photos} />
      )}
    </div>
  )
}
