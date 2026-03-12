import { prisma } from '@/lib/prisma'
import Link from 'next/link'
import Image from 'next/image'

export const dynamic = 'force-dynamic'

export default async function AlbumsPage() {
  const albums = await prisma.album.findMany({
    orderBy: { eventDate: 'desc' },
    include: {
      _count: {
        select: { photos: true }
      }
    }
  })

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    })
  }

  return (
    <div className="container-page py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
          Photo Albums
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Browse photos from family gatherings and events.
        </p>
      </div>

      {albums.length === 0 ? (
        <div className="text-center py-16 bg-gray-50 dark:bg-gray-800 rounded-lg">
          <p className="text-gray-500 dark:text-gray-400">
            No albums created yet.
          </p>
        </div>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {albums.map((album) => (
            <Link
              key={album.id}
              href={`/albums/${album.id}`}
              className="group bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden hover:shadow-md transition"
            >
              <div className="aspect-[4/3] bg-gray-100 dark:bg-gray-700 relative">
                {album.coverPhotoUrl ? (
                  <Image
                    src={album.coverPhotoUrl}
                    alt={album.title}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center text-gray-400">
                    <svg className="w-16 h-16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  </div>
                )}
              </div>
              <div className="p-4">
                <h2 className="font-semibold text-gray-900 dark:text-white group-hover:text-blue-600 transition">
                  {album.title}
                </h2>
                <div className="mt-1 flex items-center gap-3 text-sm text-gray-500 dark:text-gray-400">
                  <span>{formatDate(album.eventDate)}</span>
                  <span>&bull;</span>
                  <span>{album._count.photos} photos</span>
                </div>
                {album.description && (
                  <p className="mt-2 text-sm text-gray-600 dark:text-gray-400 line-clamp-2">
                    {album.description}
                  </p>
                )}
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}
