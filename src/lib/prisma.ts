import { PrismaClient } from '@prisma/client'

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

function createPrismaClient(): PrismaClient {
  // Use Turso in production
  if (process.env.TURSO_DATABASE_URL && process.env.TURSO_AUTH_TOKEN) {
    try {
      // eslint-disable-next-line @typescript-eslint/no-require-imports
      const { createClient } = require('@libsql/client')
      // eslint-disable-next-line @typescript-eslint/no-require-imports
      const adapterModule = require('@prisma/adapter-libsql')

      const AdapterClass = adapterModule.PrismaLibSQL || adapterModule.PrismaLibSql

      if (AdapterClass) {
        const libsql = createClient({
          url: process.env.TURSO_DATABASE_URL,
          authToken: process.env.TURSO_AUTH_TOKEN,
        })
        const adapter = new AdapterClass(libsql)
        return new PrismaClient({ adapter } as any)
      }
    } catch (e) {
      console.error('Failed to initialize Turso adapter:', e)
    }
  }

  return new PrismaClient()
}

export const prisma = globalForPrisma.prisma ?? createPrismaClient()

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma
}
