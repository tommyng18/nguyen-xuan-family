import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function GET() {
  const members = await prisma.familyMember.findMany({
    orderBy: [{ generation: 'asc' }, { order: 'asc' }, { name: 'asc' }],
  })
  return NextResponse.json(members)
}

export async function POST(request: NextRequest) {
  const session = await getServerSession(authOptions)
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const data = await request.json()
    const member = await prisma.familyMember.create({
      data: {
        name: data.name,
        birthDate: data.birthDate ? new Date(data.birthDate) : null,
        relationship: data.relationship || null,
        parentId: data.parentId || null,
        generation: data.generation ?? 0,
        phone: data.phone || null,
        email: data.email || null,
        address: data.address || null,
        latitude: data.latitude ? parseFloat(data.latitude) : null,
        longitude: data.longitude ? parseFloat(data.longitude) : null,
        bio: data.bio || null,
        photoUrl: data.photoUrl || null,
        order: data.order ?? 0,
      },
    })
    return NextResponse.json(member)
  } catch (error) {
    console.error('Error creating member:', error)
    return NextResponse.json({ error: 'Failed to create member' }, { status: 500 })
  }
}

export async function PUT(request: NextRequest) {
  const session = await getServerSession(authOptions)
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const data = await request.json()
    const member = await prisma.familyMember.update({
      where: { id: data.id },
      data: {
        name: data.name,
        birthDate: data.birthDate ? new Date(data.birthDate) : null,
        relationship: data.relationship || null,
        parentId: data.parentId || null,
        generation: data.generation ?? 0,
        phone: data.phone || null,
        email: data.email || null,
        address: data.address || null,
        latitude: data.latitude ? parseFloat(data.latitude) : null,
        longitude: data.longitude ? parseFloat(data.longitude) : null,
        bio: data.bio || null,
        photoUrl: data.photoUrl || null,
        order: data.order ?? 0,
      },
    })
    return NextResponse.json(member)
  } catch (error) {
    console.error('Error updating member:', error)
    return NextResponse.json({ error: 'Failed to update member' }, { status: 500 })
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
      return NextResponse.json({ error: 'Member ID required' }, { status: 400 })
    }

    await prisma.familyMember.delete({ where: { id } })
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting member:', error)
    return NextResponse.json({ error: 'Failed to delete member' }, { status: 500 })
  }
}
