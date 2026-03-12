'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'

type FamilyMember = {
  id: string
  name: string
  birthDate: string | null
  relationship: string | null
  parentId: string | null
  generation: number
  phone: string | null
  email: string | null
  address: string | null
  latitude: number | null
  longitude: number | null
  bio: string | null
  photoUrl: string | null
  order: number
}

const emptyMember: Omit<FamilyMember, 'id'> = {
  name: '',
  birthDate: null,
  relationship: null,
  parentId: null,
  generation: 0,
  phone: null,
  email: null,
  address: null,
  latitude: null,
  longitude: null,
  bio: null,
  photoUrl: null,
  order: 0,
}

export default function MembersAdminPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [members, setMembers] = useState<FamilyMember[]>([])
  const [loading, setLoading] = useState(true)
  const [editing, setEditing] = useState<FamilyMember | null>(null)
  const [isNew, setIsNew] = useState(false)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/admin/login')
    }
  }, [status, router])

  useEffect(() => {
    fetchMembers()
  }, [])

  const fetchMembers = async () => {
    try {
      const res = await fetch('/api/members')
      const data = await res.json()
      setMembers(data)
    } catch (error) {
      console.error('Error fetching members:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleNew = () => {
    setEditing({ id: '', ...emptyMember })
    setIsNew(true)
  }

  const handleEdit = (member: FamilyMember) => {
    setEditing(member)
    setIsNew(false)
  }

  const handleSave = async () => {
    if (!editing) return
    setSaving(true)

    try {
      const method = isNew ? 'POST' : 'PUT'
      const res = await fetch('/api/members', {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editing),
      })

      if (res.ok) {
        await fetchMembers()
        setEditing(null)
        setIsNew(false)
      }
    } catch (error) {
      console.error('Error saving member:', error)
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this member?')) return

    try {
      const res = await fetch(`/api/members?id=${id}`, { method: 'DELETE' })
      if (res.ok) {
        await fetchMembers()
      }
    } catch (error) {
      console.error('Error deleting member:', error)
    }
  }

  if (status === 'loading' || loading) {
    return <div className="text-center py-8">Loading...</div>
  }

  if (!session) {
    return null
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          Family Members
        </h1>
        <button
          onClick={handleNew}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
        >
          Add Member
        </button>
      </div>

      {/* Member List */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50 dark:bg-gray-900/50">
            <tr>
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-500 dark:text-gray-400">Name</th>
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-500 dark:text-gray-400 hidden sm:table-cell">Relationship</th>
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-500 dark:text-gray-400 hidden md:table-cell">Generation</th>
              <th className="px-4 py-3 text-right text-sm font-medium text-gray-500 dark:text-gray-400">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
            {members.map((member) => (
              <tr key={member.id} className="hover:bg-gray-50 dark:hover:bg-gray-900/30">
                <td className="px-4 py-3 text-gray-900 dark:text-white">{member.name}</td>
                <td className="px-4 py-3 text-gray-600 dark:text-gray-400 hidden sm:table-cell">{member.relationship || '-'}</td>
                <td className="px-4 py-3 text-gray-600 dark:text-gray-400 hidden md:table-cell">{member.generation + 1}</td>
                <td className="px-4 py-3 text-right">
                  <button
                    onClick={() => handleEdit(member)}
                    className="text-blue-600 hover:text-blue-700 mr-3"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(member.id)}
                    className="text-red-600 hover:text-red-700"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
            {members.length === 0 && (
              <tr>
                <td colSpan={4} className="px-4 py-8 text-center text-gray-500 dark:text-gray-400">
                  No family members added yet.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Edit Modal */}
      {editing && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6">
                {isNew ? 'Add Family Member' : 'Edit Family Member'}
              </h2>

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="sm:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Name *
                  </label>
                  <input
                    type="text"
                    value={editing.name}
                    onChange={(e) => setEditing({ ...editing, name: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Relationship
                  </label>
                  <input
                    type="text"
                    value={editing.relationship || ''}
                    onChange={(e) => setEditing({ ...editing, relationship: e.target.value || null })}
                    placeholder="e.g., Father, Mother, Son"
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Generation (0 = oldest)
                  </label>
                  <input
                    type="number"
                    value={editing.generation}
                    onChange={(e) => setEditing({ ...editing, generation: parseInt(e.target.value) || 0 })}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Birth Date
                  </label>
                  <input
                    type="date"
                    value={editing.birthDate?.split('T')[0] || ''}
                    onChange={(e) => setEditing({ ...editing, birthDate: e.target.value || null })}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Phone
                  </label>
                  <input
                    type="tel"
                    value={editing.phone || ''}
                    onChange={(e) => setEditing({ ...editing, phone: e.target.value || null })}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Email
                  </label>
                  <input
                    type="email"
                    value={editing.email || ''}
                    onChange={(e) => setEditing({ ...editing, email: e.target.value || null })}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Address
                  </label>
                  <input
                    type="text"
                    value={editing.address || ''}
                    onChange={(e) => setEditing({ ...editing, address: e.target.value || null })}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Latitude
                  </label>
                  <input
                    type="number"
                    step="any"
                    value={editing.latitude || ''}
                    onChange={(e) => setEditing({ ...editing, latitude: e.target.value ? parseFloat(e.target.value) : null })}
                    placeholder="e.g., 21.0285"
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Longitude
                  </label>
                  <input
                    type="number"
                    step="any"
                    value={editing.longitude || ''}
                    onChange={(e) => setEditing({ ...editing, longitude: e.target.value ? parseFloat(e.target.value) : null })}
                    placeholder="e.g., 105.8542"
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Bio
                  </label>
                  <textarea
                    value={editing.bio || ''}
                    onChange={(e) => setEditing({ ...editing, bio: e.target.value || null })}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-3 mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
                <button
                  onClick={() => { setEditing(null); setIsNew(false) }}
                  className="px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSave}
                  disabled={saving || !editing.name}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition disabled:opacity-50"
                >
                  {saving ? 'Saving...' : 'Save'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
