'use client'

import { useState } from 'react'
import Image from 'next/image'

type FamilyMember = {
  id: string
  name: string
  birthDate: Date | null
  relationship: string | null
  parentId: string | null
  generation: number
  phone: string | null
  email: string | null
  address: string | null
  bio: string | null
  photoUrl: string | null
}

type Props = {
  members: FamilyMember[]
}

export default function FamilyTree({ members }: Props) {
  const [searchQuery, setSearchQuery] = useState('')
  const [expandedId, setExpandedId] = useState<string | null>(null)

  // Group members by generation
  const generations = members.reduce((acc, member) => {
    const gen = member.generation
    if (!acc[gen]) acc[gen] = []
    acc[gen].push(member)
    return acc
  }, {} as Record<number, FamilyMember[]>)

  const filteredGenerations = Object.entries(generations).reduce((acc, [gen, genMembers]) => {
    const filtered = genMembers.filter(member =>
      member.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      member.relationship?.toLowerCase().includes(searchQuery.toLowerCase())
    )
    if (filtered.length > 0) {
      acc[Number(gen)] = filtered
    }
    return acc
  }, {} as Record<number, FamilyMember[]>)

  const formatDate = (date: Date | null) => {
    if (!date) return null
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    })
  }

  return (
    <div>
      {/* Search */}
      <div className="mb-6">
        <input
          type="text"
          placeholder="Search by name or relationship..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full max-w-md px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
      </div>

      {/* Generations */}
      <div className="space-y-8">
        {Object.entries(filteredGenerations)
          .sort(([a], [b]) => Number(a) - Number(b))
          .map(([generation, genMembers]) => (
            <div key={generation}>
              <h2 className="text-lg font-semibold text-gray-700 dark:text-gray-300 mb-4 pb-2 border-b border-gray-200 dark:border-gray-700">
                Generation {Number(generation) + 1}
              </h2>
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {genMembers.map((member) => (
                  <div
                    key={member.id}
                    className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden"
                  >
                    <button
                      onClick={() => setExpandedId(expandedId === member.id ? null : member.id)}
                      className="w-full p-4 text-left hover:bg-gray-50 dark:hover:bg-gray-750 transition"
                    >
                      <div className="flex items-center gap-4">
                        {member.photoUrl ? (
                          <Image
                            src={member.photoUrl}
                            alt={member.name}
                            width={48}
                            height={48}
                            className="w-12 h-12 rounded-full object-cover"
                          />
                        ) : (
                          <div className="w-12 h-12 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center text-blue-600 dark:text-blue-300 font-semibold text-lg">
                            {member.name.charAt(0)}
                          </div>
                        )}
                        <div className="flex-1 min-w-0">
                          <h3 className="font-medium text-gray-900 dark:text-white truncate">
                            {member.name}
                          </h3>
                          {member.relationship && (
                            <p className="text-sm text-gray-500 dark:text-gray-400">
                              {member.relationship}
                            </p>
                          )}
                        </div>
                        <svg
                          className={`w-5 h-5 text-gray-400 transition-transform ${expandedId === member.id ? 'rotate-180' : ''}`}
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                      </div>
                    </button>

                    {expandedId === member.id && (
                      <div className="px-4 pb-4 pt-0 border-t border-gray-100 dark:border-gray-700">
                        <dl className="mt-4 space-y-2 text-sm">
                          {member.birthDate && (
                            <div>
                              <dt className="text-gray-500 dark:text-gray-400">Birthday</dt>
                              <dd className="text-gray-900 dark:text-white">{formatDate(member.birthDate)}</dd>
                            </div>
                          )}
                          {member.phone && (
                            <div>
                              <dt className="text-gray-500 dark:text-gray-400">Phone</dt>
                              <dd className="text-gray-900 dark:text-white">
                                <a href={`tel:${member.phone}`} className="text-blue-600 hover:underline">
                                  {member.phone}
                                </a>
                              </dd>
                            </div>
                          )}
                          {member.email && (
                            <div>
                              <dt className="text-gray-500 dark:text-gray-400">Email</dt>
                              <dd className="text-gray-900 dark:text-white">
                                <a href={`mailto:${member.email}`} className="text-blue-600 hover:underline">
                                  {member.email}
                                </a>
                              </dd>
                            </div>
                          )}
                          {member.address && (
                            <div>
                              <dt className="text-gray-500 dark:text-gray-400">Address</dt>
                              <dd className="text-gray-900 dark:text-white">{member.address}</dd>
                            </div>
                          )}
                          {member.bio && (
                            <div>
                              <dt className="text-gray-500 dark:text-gray-400">About</dt>
                              <dd className="text-gray-900 dark:text-white">{member.bio}</dd>
                            </div>
                          )}
                        </dl>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          ))}
      </div>

      {Object.keys(filteredGenerations).length === 0 && searchQuery && (
        <div className="text-center py-8">
          <p className="text-gray-500 dark:text-gray-400">
            No family members found matching &quot;{searchQuery}&quot;
          </p>
        </div>
      )}
    </div>
  )
}
