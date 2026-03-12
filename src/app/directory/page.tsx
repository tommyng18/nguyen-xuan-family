import { prisma } from '@/lib/prisma'
import AddressMap from '@/components/AddressMap'

export const dynamic = 'force-dynamic'

export default async function DirectoryPage() {
  const members = await prisma.familyMember.findMany({
    where: {
      address: { not: null }
    },
    orderBy: { name: 'asc' },
    select: {
      id: true,
      name: true,
      relationship: true,
      address: true,
      latitude: true,
      longitude: true,
      phone: true,
      email: true,
      photoUrl: true,
    }
  })

  // Filter members with valid coordinates for the map
  const membersWithCoords = members.filter(m => m.latitude && m.longitude)

  return (
    <div className="container-page py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
          Family Directory
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Find family members and see where everyone lives.
        </p>
      </div>

      {members.length === 0 ? (
        <div className="text-center py-16 bg-gray-50 dark:bg-gray-800 rounded-lg">
          <p className="text-gray-500 dark:text-gray-400">
            No addresses added yet.
          </p>
        </div>
      ) : (
        <div className="grid lg:grid-cols-2 gap-8">
          {/* Map */}
          <div className="order-2 lg:order-1">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Family Map
            </h2>
            {membersWithCoords.length > 0 ? (
              <AddressMap members={membersWithCoords} />
            ) : (
              <div className="aspect-[4/3] bg-gray-100 dark:bg-gray-800 rounded-lg flex items-center justify-center">
                <p className="text-gray-500 dark:text-gray-400 text-center p-4">
                  No locations with coordinates yet.<br />
                  Add latitude/longitude to family members to show them on the map.
                </p>
              </div>
            )}
          </div>

          {/* Address List */}
          <div className="order-1 lg:order-2">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Addresses ({members.length})
            </h2>
            <div className="space-y-4 max-h-[600px] overflow-y-auto pr-2">
              {members.map((member) => (
                <div
                  key={member.id}
                  className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-sm border border-gray-200 dark:border-gray-700"
                >
                  <h3 className="font-medium text-gray-900 dark:text-white">
                    {member.name}
                  </h3>
                  {member.relationship && (
                    <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">
                      {member.relationship}
                    </p>
                  )}
                  <p className="text-sm text-gray-600 dark:text-gray-300">
                    {member.address}
                  </p>
                  <div className="mt-2 flex flex-wrap gap-3 text-sm">
                    {member.phone && (
                      <a
                        href={`tel:${member.phone}`}
                        className="text-blue-600 hover:underline"
                      >
                        {member.phone}
                      </a>
                    )}
                    {member.email && (
                      <a
                        href={`mailto:${member.email}`}
                        className="text-blue-600 hover:underline"
                      >
                        {member.email}
                      </a>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
