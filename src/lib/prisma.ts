import { PrismaClient } from '@prisma/client'

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

function createPrismaClient(): PrismaClient {
  const tursoUrl = process.env.TURSO_DATABASE_URL
  const tursoToken = process.env.TURSO_AUTH_TOKEN

  // Must use Turso in production
  if (tursoUrl && tursoToken) {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const { createClient } = require('@libsql/client')
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const adapterModule = require('@prisma/adapter-libsql')

    const AdapterClass = adapterModule.PrismaLibSQL || adapterModule.PrismaLibSql

    if (!AdapterClass) {
      throw new Error('PrismaLibSQL adapter not found in @prisma/adapter-libsql')
    }

    const libsql = createClient({
      url: tursoUrl,
      authToken: tursoToken,
    })
    const adapter = new AdapterClass(libsql)

    console.log('Prisma initialized with Turso adapter')
    return new PrismaClient({ adapter } as any)
  }

  // Local development fallback
  if (process.env.NODE_ENV === 'development') {
    console.log('Prisma initialized with local SQLite')
    return new PrismaClient()
  }

  throw new Error('TURSO_DATABASE_URL and TURSO_AUTH_TOKEN must be set in production')
}

export const prisma = globalForPrisma.prisma ?? createPrismaClient()

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma
}
