import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function GET() {
  const albums = await prisma.album.findMany({
    orderBy: { eventDate: 'desc' },
    include: {
      photos: {
        orderBy: { order: 'asc' },
      },
      _count: {
        select: { photos: true },
      },
    },
  })
  return NextResponse.json(albums)
}

export async function POST(request: NextRequest) {
  const session = await getServerSession(authOptions)
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const data = await request.json()
    const album = await prisma.album.create({
      data: {
        title: data.title,
        description: data.description || null,
        eventDate: new Date(data.eventDate),
        coverPhotoUrl: data.coverPhotoUrl || null,
      },
    })
    return NextResponse.json(album)
  } catch (error) {
    console.error('Error creating album:', error)
    return NextResponse.json({ error: 'Failed to create album' }, { status: 500 })
  }
}

export async function PUT(request: NextRequest) {
  const session = await getServerSession(authOptions)
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const data = await request.json()
    const album = await prisma.album.update({
      where: { id: data.id },
      data: {
        title: data.title,
        description: data.description || null,
        eventDate: new Date(data.eventDate),
        coverPhotoUrl: data.coverPhotoUrl || null,
      },
    })
    return NextResponse.json(album)
  } catch (error) {
    console.error('Error updating album:', error)
    return NextResponse.json({ error: 'Failed to update album' }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest) {
  const session = await getServerSession(authOptions)
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')

    if (!id) {
      return NextResponse.json({ error: 'Album ID required' }, { status: 400 })
    }

    await prisma.album.delete({ where: { id } })
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting album:', error)
    return NextResponse.json({ error: 'Failed to delete album' }, { status: 500 })
  }
}
