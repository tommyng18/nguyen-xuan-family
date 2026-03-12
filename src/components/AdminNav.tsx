'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { signOut } from 'next-auth/react'

const adminLinks = [
  { href: '/admin', label: 'Dashboard' },
  { href: '/admin/members', label: 'Family Members' },
  { href: '/admin/albums', label: 'Albums' },
]

export default function AdminNav() {
  const pathname = usePathname()

  return (
    <nav className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700">
      <div className="container-page">
        <div className="flex justify-between items-center h-14">
          <div className="flex items-center gap-6">
            <Link href="/admin" className="font-semibold text-blue-600">
              Admin Panel
            </Link>
            <div className="hidden sm:flex items-center gap-4">
              {adminLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`text-sm transition ${
                    pathname === link.href
                      ? 'text-blue-600 font-medium'
                      : 'text-gray-600 dark:text-gray-400 hover:text-blue-600'
                  }`}
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </div>
          <div className="flex items-center gap-4">
            <Link
              href="/"
              className="text-sm text-gray-600 dark:text-gray-400 hover:text-blue-600"
            >
              View Site
            </Link>
            <button
              onClick={() => signOut({ callbackUrl: '/' })}
              className="text-sm text-red-600 hover:text-red-700"
            >
              Sign Out
            </button>
          </div>
        </div>
      </div>
    </nav>
  )
}
