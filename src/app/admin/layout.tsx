import { getServerSession } from 'next-auth'
import { redirect } from 'next/navigation'
import { authOptions } from '@/lib/auth'
import AdminNav from '@/components/AdminNav'

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const session = await getServerSession(authOptions)

  // Allow access to login page without auth
  // The actual page check is handled by middleware or the page itself

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {session && <AdminNav />}
      <div className="container-page py-8">
        {children}
      </div>
    </div>
  )
}
