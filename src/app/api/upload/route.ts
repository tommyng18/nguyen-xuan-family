import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { writeFile, mkdir } from 'fs/promises'
import { existsSync } from 'fs'
import path from 'path'
import { prisma } from '@/lib/prisma'

export async function POST(request: NextRequest) {
  const session = await getServerSession(authOptions)
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const formData = await request.formData()
    const files = formData.getAll('files') as File[]
    const albumId = formData.get('albumId') as string
    const type = formData.get('type') as string // 'photo' or 'profile'

    if (files.length === 0) {
      return NextResponse.json({ error: 'No files uploaded' }, { status: 400 })
    }

    const uploadDir = path.join(process.cwd(), 'public', 'uploads')

    // Create uploads directory if it doesn't exist
    if (!existsSync(uploadDir)) {
      await mkdir(uploadDir, { recursive: true })
    }

    const uploadedUrls: string[] = []

    for (const file of files) {
      const bytes = await file.arrayBuffer()
      const buffer = Buffer.from(bytes)

      // Generate unique filename
      const ext = path.extname(file.name)
      const filename = `${Date.now()}-${Math.random().toString(36).substring(7)}${ext}`
      const filepath = path.join(uploadDir, filename)

      await writeFile(filepath, buffer)
      const url = `/uploads/${filename}`
      uploadedUrls.push(url)

      // If uploading to an album, create photo records
      if (type === 'photo' && albumId) {
        const photoCount = await prisma.photo.count({ where: { albumId } })
        await prisma.photo.create({
          data: {
            albumId,
            url,
            order: photoCount,
          },
        })

        // Set as cover photo if it's the first photo
        if (photoCount === 0) {
          await prisma.album.update({
            where: { id: albumId },
            data: { coverPhotoUrl: url },
          })
        }
      }
    }

    return NextResponse.json({ urls: uploadedUrls })
  } catch (error) {
    console.error('Error uploading files:', error)
    return NextResponse.json({ error: 'Failed to upload files' }, { status: 500 })
  }
}
