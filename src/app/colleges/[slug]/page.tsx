// src/app/colleges/[slug]/page.tsx
import { notFound } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import { getUser } from '@/lib/auth'
import { formatFees } from '@/lib/utils'
import Link from 'next/link'
import { CollegeActions } from '@/components/college/CollegeActions'

async function getCollege(slug: string) {
  return prisma.college.findUnique({
    where: { slug },
    include: {
      courses: true,
      placements: { orderBy: { year: 'desc' } },
      reviews: {
        include: { user: { select: { name: true } } },
        orderBy: { createdAt: 'desc' },
        take: 10,
      },
    },
  })
}

export async function generateStaticParams() {
  try {
    const colleges = await prisma.college.findMany({ select: { slug: true } })
    return colleges.map(c => ({ slug: c.slug }))
  } catch (e) {
    console.error('generateStaticParams warning: database connection not available during build', e)
    return []
  }
}

export default async function CollegeDetailPage({ params }: { params: { slug: string } }) {
  const [college, user] = await Promise.all([
    getCollege(params.slug),
    getUser(),
  ])

  if (!college) notFound()

  const placement = college.placements[0]

  let isSaved = false
  if (user) {
    const saved = await prisma.savedCollege.findUnique({
      where: { userId_collegeId: { userId: user.userId, collegeId: college.id } },
    })
    isSaved = !!saved
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 page-enter">
      {/* Breadcrumb */}
      <nav className="text-sm text-gray-500 mb-6 flex items-center gap-2">
        <Link href="/" className="hover:text-primary-600">Home</Link>
        <span>/</span>
        <Link href="/colleges" className="hover:text-primary-600">Colleges</Link>
        <span>/</span>
        <span className="text-gray-900 font-medium">{college.name}</span>
      </nav>

      {/* Header */}
      <div className="card mb-8 overflow-hidden">
        {college.imageUrl && (
          <div className="h-64 overflow-hidden">
            <img src={college.imageUrl} alt={college.name} className="w-full h-full object-cover" />
          </div>
        )}
        <div className="p-6">
          <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
            <div className="flex-1">
              <div className="flex flex-wrap items-center gap-2 mb-2">
                <span className={`badge text-xs ${
                  college.type === 'Government' ? 'bg-green-100 text-green-700' :
                  college.type === 'Deemed' ? 'bg-purple-100 text-purple-700' :
                  'bg-blue-100 text-blue-700'
                }`}>{college.type}</span>
                {college.accreditation && (
                  <span className="badge bg-yellow-100 text-yellow-700 text-xs">{college.accreditation}</span>
                )}
                {college.ranking && (
                  <span className="badge bg-primary-100 text-primary-700 text-xs">#{college.ranking} India Rank</span>
                )}
              </div>
              <h1 className="text-3xl font-bold text-gray-900 mb-1">{college.name}</h1>
              <p className="text-gray-500 flex items-center gap-1">📍 {college.location} • Est. {college.established}</p>
              <div className="flex items-center gap-2 mt-2">
                <span className="text-yellow-400">★★★★★</span>
                <span className="font-semibold">{college.rating.toFixed(1)}</span>
                <span className="text-gray-400 text-sm">({college.reviewCount.toLocaleString()} reviews)</span>
              </div>
            </div>
            <CollegeActions
              collegeId={college.id}
              collegeSlug={college.slug}
              isLoggedIn={!!user}
              isSaved={isSaved}
            />
          </div>
        </div>
      </div>

      {/* Quick stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        {[
          { label: 'Annual Fees', value: formatFees(college.totalFees), icon: '💰', color: 'text-primary-600' },
          placement && { label: 'Avg Package', value: `₹${(placement.avgPackage / 100000).toFixed(1)}L`, icon: '💼', color: 'text-green-600' },
          placement && { label: 'Placement Rate', value: `${placement.placementRate}%`, icon: '🎯', color: 'text-blue-600' },
          placement && { label: 'Highest Package', value: `₹${(placement.highestPackage / 100000).toFixed(0)}L`, icon: '🏆', color: 'text-amber-600' },
        ].filter(Boolean).map((stat: any) => (
          <div key={stat.label} className="card p-4 text-center">
            <div className="text-2xl mb-1">{stat.icon}</div>
            <div className={`text-xl font-bold ${stat.color}`}>{stat.value}</div>
            <div className="text-xs text-gray-500 mt-0.5">{stat.label}</div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          {/* About */}
          <div className="card p-6">
            <h2 className="section-title mb-4">About</h2>
            <p className="text-gray-600 leading-relaxed">{college.description}</p>
            {college.website && (
              <a href={college.website} target="_blank" rel="noopener noreferrer"
                className="inline-flex items-center gap-1 text-primary-600 hover:underline mt-3 text-sm font-medium">
                🌐 Visit Official Website →
              </a>
            )}
          </div>

          {/* Courses */}
          <div className="card p-6">
            <h2 className="section-title mb-4">Courses Offered</h2>
            <div className="space-y-3">
              {college.courses.map(course => (
                <div key={course.id} className="border border-gray-100 rounded-xl p-4 hover:border-primary-200 transition-colors">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-semibold text-gray-900">{course.name}</h3>
                      <p className="text-sm text-gray-500 mt-0.5">{course.duration} • {course.seats} seats</p>
                      <p className="text-xs text-gray-400 mt-1">{course.eligibility}</p>
                    </div>
                    <div className="text-right">
                      <div className="font-bold text-primary-600">{formatFees(course.fees)}</div>
                      <div className="text-xs text-gray-400">per year</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Placements */}
          {placement && (
            <div className="card p-6">
              <h2 className="section-title mb-4">Placement Report {placement.year}</h2>
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="bg-green-50 rounded-xl p-4">
                  <div className="text-2xl font-bold text-green-600">₹{(placement.avgPackage / 100000).toFixed(1)} LPA</div>
                  <div className="text-sm text-green-700">Average Package</div>
                </div>
                <div className="bg-blue-50 rounded-xl p-4">
                  <div className="text-2xl font-bold text-blue-600">₹{(placement.highestPackage / 100000).toFixed(0)} LPA</div>
                  <div className="text-sm text-blue-700">Highest Package</div>
                </div>
              </div>
              <div className="mb-4">
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-gray-600">Placement Rate</span>
                  <span className="font-semibold">{placement.placementRate}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2.5">
                  <div
                    className="bg-green-500 h-2.5 rounded-full"
                    style={{ width: `${placement.placementRate}%` }}
                  />
                </div>
              </div>
              <div>
                <h4 className="text-sm font-medium text-gray-700 mb-2">Top Recruiters</h4>
                <div className="flex flex-wrap gap-2">
                  {placement.topRecruiters.split(',').map(r => (
                    <span key={r} className="badge bg-gray-100 text-gray-700 text-xs">{r.trim()}</span>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Reviews */}
          <div className="card p-6">
            <h2 className="section-title mb-4">Student Reviews</h2>
            {college.reviews.length === 0 ? (
              <p className="text-gray-500 text-sm">No reviews yet. Be the first to review!</p>
            ) : (
              <div className="space-y-4">
                {college.reviews.map(review => (
                  <div key={review.id} className="border-b border-gray-100 pb-4 last:border-0">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <div className="font-semibold text-gray-900">{review.user.name}</div>
                        <div className="text-yellow-400 text-sm">{'★'.repeat(Math.round(review.rating))}</div>
                      </div>
                      <div className="text-xs text-gray-400">
                        {new Date(review.createdAt).toLocaleDateString('en-IN', { year: 'numeric', month: 'short', day: 'numeric' })}
                      </div>
                    </div>
                    <h4 className="font-medium text-gray-800 mb-1">{review.title}</h4>
                    <p className="text-gray-600 text-sm">{review.body}</p>
                    {review.pros && (
                      <p className="text-green-600 text-xs mt-1">✅ {review.pros}</p>
                    )}
                    {review.cons && (
                      <p className="text-red-500 text-xs mt-1">⚠️ {review.cons}</p>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-4">
          <div className="card p-5">
            <h3 className="font-semibold mb-3">Quick Info</h3>
            <dl className="space-y-3 text-sm">
              <div className="flex justify-between"><dt className="text-gray-500">Established</dt><dd className="font-medium">{college.established}</dd></div>
              <div className="flex justify-between"><dt className="text-gray-500">Type</dt><dd className="font-medium">{college.type}</dd></div>
              <div className="flex justify-between"><dt className="text-gray-500">Location</dt><dd className="font-medium">{college.city}</dd></div>
              {college.accreditation && <div className="flex justify-between"><dt className="text-gray-500">Accreditation</dt><dd className="font-medium">{college.accreditation}</dd></div>}
            </dl>
          </div>
          <Link
            href={`/compare?colleges=${college.slug}`}
            className="block w-full text-center btn-outline"
          >
            ⚖️ Add to Compare
          </Link>
          <Link href="/predictor" className="block w-full text-center bg-accent-500 hover:bg-accent-600 text-white font-semibold py-2.5 rounded-lg transition-colors text-center">
            🎯 Check Eligibility
          </Link>
        </div>
      </div>
    </div>
  )
}
