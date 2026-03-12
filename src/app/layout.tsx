import type { Metadata } from 'next'
import './globals.css'
import Navbar from '@/components/Navbar'
import Providers from '@/components/Providers'

export const metadata: Metadata = {
  title: process.env.SITE_TITLE || 'Nguyen Xuan Family',
  description: 'Our family website - connecting generations',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className="min-h-screen flex flex-col">
        <Providers>
          <Navbar />
          <main className="flex-1">
            {children}
          </main>
          <footer className="bg-gray-100 dark:bg-gray-900 py-6 mt-auto">
            <div className="container-page text-center text-gray-600 dark:text-gray-400">
              <p>&copy; {new Date().getFullYear()} Nguyen Xuan Family. All rights reserved.</p>
            </div>
          </footer>
        </Providers>
      </body>
    </html>
  )
}
