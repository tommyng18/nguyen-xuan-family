import { PrismaClient } from '@prisma/client'

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

let prismaInstance: PrismaClient | null = null

async function initPrisma(): Promise<PrismaClient> {
  if (prismaInstance) return prismaInstance

  // Use Turso in production
  if (process.env.TURSO_DATABASE_URL && process.env.TURSO_AUTH_TOKEN) {
    try {
      const libsqlModule = await import('@libsql/client')
      const adapterModule = await import('@prisma/adapter-libsql')

      // Handle different export names between versions
      const createClient = libsqlModule.createClient
      const AdapterClass = (adapterModule as any).PrismaLibSQL || (adapterModule as any).PrismaLibSql

      if (createClient && AdapterClass) {
        const libsql = createClient({
          url: process.env.TURSO_DATABASE_URL,
          authToken: process.env.TURSO_AUTH_TOKEN,
        })
        const adapter = new AdapterClass(libsql)
        prismaInstance = new PrismaClient({ adapter } as any)
        return prismaInstance
      }
    } catch (e) {
      console.warn('Failed to initialize Turso adapter, falling back to default:', e)
    }
  }

  prismaInstance = new PrismaClient()
  return prismaInstance
}

// Create a proxy that lazily initializes Prisma
const prismaProxy = new Proxy({} as PrismaClient, {
  get(target, prop) {
    if (!prismaInstance) {
      // For sync access, create basic client
      prismaInstance = globalForPrisma.prisma ?? new PrismaClient()
      // Then upgrade to Turso in background
      if (process.env.TURSO_DATABASE_URL) {
        initPrisma().then(client => {
          prismaInstance = client
          globalForPrisma.prisma = client
        })
      }
    }
    return (prismaInstance as any)[prop]
  }
})

export const prisma = globalForPrisma.prisma ?? prismaProxy

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma
}
