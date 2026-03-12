import { prisma } from '@/lib/prisma'
import FamilyTree from '@/components/FamilyTree'

export const dynamic = 'force-dynamic'

export default async function FamilyTreePage() {
  const members = await prisma.familyMember.findMany({
    orderBy: [
      { generation: 'asc' },
      { order: 'asc' },
      { name: 'asc' },
    ],
  })

  return (
    <div className="container-page py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
          Family Tree
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Explore our family connections across generations.
        </p>
      </div>

      {members.length === 0 ? (
        <div className="text-center py-16 bg-gray-50 dark:bg-gray-800 rounded-lg">
          <p className="text-gray-500 dark:text-gray-400">
            No family members added yet.
          </p>
        </div>
      ) : (
        <FamilyTree members={members} />
      )}
    </div>
  )
}
