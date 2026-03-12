import Link from 'next/link'

export default function Home() {
  return (
    <div className="container-page py-12">
      {/* Hero Section */}
      <section className="text-center py-16 md:py-24">
        <h1 className="text-4xl md:text-6xl font-bold text-gray-900 dark:text-white mb-6">
          Welcome to the<br />
          <span className="text-blue-600">Nguyen Xuan Family</span>
        </h1>
        <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto mb-8">
          Connecting our family across generations. Explore our family tree,
          browse photo albums from family events, and stay connected.
        </p>
        <div className="flex flex-wrap justify-center gap-4">
          <Link
            href="/family-tree"
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-medium"
          >
            View Family Tree
          </Link>
          <Link
            href="/albums"
            className="px-6 py-3 bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition font-medium"
          >
            Browse Albums
          </Link>
        </div>
      </section>

      {/* Quick Links */}
      <section className="py-12">
        <div className="grid md:grid-cols-3 gap-8">
          <Link href="/family-tree" className="group p-6 bg-white dark:bg-gray-800 rounded-xl shadow-sm hover:shadow-md transition border border-gray-200 dark:border-gray-700">
            <div className="text-3xl mb-4">&#128106;</div>
            <h2 className="text-xl font-semibold mb-2 group-hover:text-blue-600 transition">Family Tree</h2>
            <p className="text-gray-600 dark:text-gray-400">
              Explore our family connections across generations.
            </p>
          </Link>

          <Link href="/albums" className="group p-6 bg-white dark:bg-gray-800 rounded-xl shadow-sm hover:shadow-md transition border border-gray-200 dark:border-gray-700">
            <div className="text-3xl mb-4">&#128247;</div>
            <h2 className="text-xl font-semibold mb-2 group-hover:text-blue-600 transition">Photo Albums</h2>
            <p className="text-gray-600 dark:text-gray-400">
              Browse photos from family gatherings and events.
            </p>
          </Link>

          <Link href="/directory" className="group p-6 bg-white dark:bg-gray-800 rounded-xl shadow-sm hover:shadow-md transition border border-gray-200 dark:border-gray-700">
            <div className="text-3xl mb-4">&#128205;</div>
            <h2 className="text-xl font-semibold mb-2 group-hover:text-blue-600 transition">Directory</h2>
            <p className="text-gray-600 dark:text-gray-400">
              Find family members and see where everyone lives.
            </p>
          </Link>
        </div>
      </section>
    </div>
  )
}
