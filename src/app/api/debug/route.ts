import { NextResponse } from 'next/server'

export async function GET() {
  return NextResponse.json({
    hasTursoUrl: !!process.env.TURSO_DATABASE_URL,
    hasTursoToken: !!process.env.TURSO_AUTH_TOKEN,
    tursoUrlStart: process.env.TURSO_DATABASE_URL?.substring(0, 20) + '...',
    nodeEnv: process.env.NODE_ENV,
  })
}
