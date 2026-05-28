// src/app/page.tsx
import Link from 'next/link'
import { prisma } from '@/lib/prisma'
import { CollegeCard } from '@/components/college/CollegeCard'

async function getTopColleges() {
  try {
    return await prisma.college.findMany({
      take: 6,
      orderBy: { ranking: 'asc' },
      include: { placements: { take: 1, orderBy: { year: 'desc' } } },
    })
  } catch (e) {
    console.error('getTopColleges warning: database not available during build', e)
    return []
  }
}

export default async function HomePage() {
  const colleges = await getTopColleges()

  return (
    <div className="page-enter">
      {/* Hero */}
      <section className="bg-gradient-to-br from-primary-700 via-primary-600 to-primary-800 text-white py-24 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <span className="inline-block bg-white/20 text-white text-xs font-semibold px-3 py-1 rounded-full mb-6 uppercase tracking-widest">
            India's College Discovery Platform
          </span>
          <h1 className="text-5xl md:text-6xl font-bold mb-6 leading-tight">
            Find Your Perfect
            <span className="block text-accent-300">College Match</span>
          </h1>
          <p className="text-xl text-primary-100 mb-10 max-w-2xl mx-auto">
            Compare colleges, explore placements, read real reviews, and make the most informed decision of your life.
          </p>

          {/* Search bar */}
          <form action="/colleges" method="GET" className="max-w-2xl mx-auto">
            <div className="flex gap-2 bg-white rounded-2xl p-2 shadow-xl">
              <input
                name="search"
                type="text"
                placeholder="Search colleges, courses, locations..."
                className="flex-1 px-4 py-3 text-gray-900 text-base focus:outline-none rounded-xl"
              />
              <button
                type="submit"
                className="bg-primary-600 hover:bg-primary-700 text-white font-semibold px-8 py-3 rounded-xl transition-colors"
              >
                Search
              </button>
            </div>
          </form>

          {/* Quick filters */}
          <div className="flex flex-wrap justify-center gap-3 mt-6">
            {['IIT', 'NIT', 'Deemed', 'MBA', 'B.Tech'].map(tag => (
              <Link
                key={tag}
                href={`/colleges?search=${tag}`}
                className="bg-white/15 hover:bg-white/25 text-white text-sm px-4 py-1.5 rounded-full transition-colors"
              >
                {tag}
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="bg-white border-b py-8">
        <div className="max-w-5xl mx-auto px-4 grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          {[
            { value: '500+', label: 'Colleges Listed' },
            { value: '10K+', label: 'Student Reviews' },
            { value: '100%', label: 'Verified Data' },
            { value: 'Free', label: 'Always Free' },
          ].map(stat => (
            <div key={stat.label}>
              <div className="text-3xl font-bold text-primary-600">{stat.value}</div>
              <div className="text-sm text-gray-500 mt-1">{stat.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Top Colleges */}
      <section className="max-w-7xl mx-auto px-4 py-16">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="section-title">Top Ranked Colleges</h2>
            <p className="text-gray-500 mt-1">Based on NIRF rankings and placement data</p>
          </div>
          <Link href="/colleges" className="btn-outline hidden md:block">
            View All →
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {colleges.map(college => (
            <CollegeCard key={college.id} college={college as never} />
          ))}
        </div>

        <div className="text-center mt-10 md:hidden">
          <Link href="/colleges" className="btn-primary">View All Colleges</Link>
        </div>
      </section>

      {/* Features */}
      <section className="bg-gray-900 text-white py-20 px-4">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">Everything you need to decide</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                icon: '🔍',
                title: 'Smart Search & Filters',
                desc: 'Filter by state, type, fees, rating. Find exactly what you\'re looking for.',
              },
              {
                icon: '⚖️',
                title: 'Side-by-Side Compare',
                desc: 'Compare up to 3 colleges on fees, placements, ratings, and more.',
              },
              {
                icon: '🎯',
                title: 'Rank Predictor',
                desc: 'Enter your JEE/BITSAT rank and instantly see which colleges you can get.',
              },
            ].map(f => (
              <div key={f.title} className="bg-gray-800 rounded-2xl p-6">
                <div className="text-4xl mb-4">{f.icon}</div>
                <h3 className="text-xl font-semibold mb-2">{f.title}</h3>
                <p className="text-gray-400">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}
