// prisma/seed.ts
import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

const colleges = [
  {
    name: 'Indian Institute of Technology Bombay',
    slug: 'iit-bombay',
    location: 'Mumbai, Maharashtra',
    city: 'Mumbai',
    state: 'Maharashtra',
    type: 'Government',
    established: 1958,
    ranking: 1,
    rating: 4.8,
    reviewCount: 1200,
    totalFees: 250000,
    description: 'IIT Bombay is one of the premier engineering institutions in India, known for its rigorous curriculum and excellent research output. Located in Powai, Mumbai, it offers undergraduate, postgraduate, and doctoral programs across various disciplines.',
    imageUrl: 'https://images.unsplash.com/photo-1562774053-701939374585?w=800',
    website: 'https://www.iitb.ac.in',
    accreditation: 'NAAC A++',
    courses: [
      { name: 'B.Tech Computer Science', duration: '4 Years', degree: 'B.Tech', fees: 250000, seats: 120, eligibility: 'JEE Advanced rank < 500' },
      { name: 'B.Tech Electrical Engineering', duration: '4 Years', degree: 'B.Tech', fees: 250000, seats: 80, eligibility: 'JEE Advanced rank < 1000' },
      { name: 'M.Tech Computer Science', duration: '2 Years', degree: 'M.Tech', fees: 25000, seats: 60, eligibility: 'GATE score > 700' },
      { name: 'MBA', duration: '2 Years', degree: 'MBA', fees: 800000, seats: 120, eligibility: 'CAT 99+ percentile' },
    ],
    placement: { year: 2023, avgPackage: 2200000, highestPackage: 25000000, placementRate: 97, topRecruiters: 'Google,Microsoft,Goldman Sachs,McKinsey,Amazon' },
  },
  {
    name: 'Indian Institute of Technology Delhi',
    slug: 'iit-delhi',
    location: 'New Delhi, Delhi',
    city: 'New Delhi',
    state: 'Delhi',
    type: 'Government',
    established: 1961,
    ranking: 2,
    rating: 4.7,
    reviewCount: 980,
    totalFees: 240000,
    description: 'IIT Delhi is a public technical and research university located in New Delhi. It is recognized as an Institute of National Importance by the Government of India and is known for producing world-class engineers and researchers.',
    imageUrl: 'https://images.unsplash.com/photo-1607237138185-eedd9c632b0b?w=800',
    website: 'https://home.iitd.ac.in',
    accreditation: 'NAAC A++',
    courses: [
      { name: 'B.Tech Computer Science', duration: '4 Years', degree: 'B.Tech', fees: 240000, seats: 110, eligibility: 'JEE Advanced rank < 600' },
      { name: 'B.Tech Mechanical Engineering', duration: '4 Years', degree: 'B.Tech', fees: 240000, seats: 90, eligibility: 'JEE Advanced rank < 2000' },
      { name: 'M.Tech AI', duration: '2 Years', degree: 'M.Tech', fees: 28000, seats: 40, eligibility: 'GATE score > 680' },
    ],
    placement: { year: 2023, avgPackage: 2100000, highestPackage: 22000000, placementRate: 96, topRecruiters: 'Adobe,Apple,Flipkart,Uber,Salesforce' },
  },
  {
    name: 'BITS Pilani',
    slug: 'bits-pilani',
    location: 'Pilani, Rajasthan',
    city: 'Pilani',
    state: 'Rajasthan',
    type: 'Deemed',
    established: 1964,
    ranking: 5,
    rating: 4.5,
    reviewCount: 750,
    totalFees: 550000,
    description: 'BITS Pilani is a leading private technical university in India. Known for its unique dual degree programs and practice school initiative, it has a strong alumni network in the tech industry globally.',
    imageUrl: 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=800',
    website: 'https://www.bits-pilani.ac.in',
    accreditation: 'NAAC A',
    courses: [
      { name: 'B.E. Computer Science', duration: '4 Years', degree: 'B.E.', fees: 550000, seats: 180, eligibility: 'BITSAT score > 350' },
      { name: 'B.E. Electronics', duration: '4 Years', degree: 'B.E.', fees: 550000, seats: 120, eligibility: 'BITSAT score > 330' },
      { name: 'M.Sc. Mathematics', duration: '2 Years', degree: 'M.Sc.', fees: 200000, seats: 60, eligibility: 'BITSAT score > 280' },
    ],
    placement: { year: 2023, avgPackage: 1800000, highestPackage: 18000000, placementRate: 93, topRecruiters: 'Qualcomm,Texas Instruments,Morgan Stanley,Schlumberger' },
  },
  {
    name: 'National Institute of Technology Trichy',
    slug: 'nit-trichy',
    location: 'Tiruchirappalli, Tamil Nadu',
    city: 'Tiruchirappalli',
    state: 'Tamil Nadu',
    type: 'Government',
    established: 1964,
    ranking: 8,
    rating: 4.4,
    reviewCount: 620,
    totalFees: 150000,
    description: 'NIT Trichy is consistently ranked among the top NITs in India. It is known for its strong engineering programs and excellent placement record, particularly in core and IT sectors.',
    imageUrl: 'https://images.unsplash.com/photo-1541339907198-e08756dedf3f?w=800',
    website: 'https://www.nitt.edu',
    accreditation: 'NAAC A++',
    courses: [
      { name: 'B.Tech Computer Science', duration: '4 Years', degree: 'B.Tech', fees: 150000, seats: 100, eligibility: 'JEE Mains rank < 5000' },
      { name: 'B.Tech Civil Engineering', duration: '4 Years', degree: 'B.Tech', fees: 150000, seats: 80, eligibility: 'JEE Mains rank < 15000' },
      { name: 'M.Tech VLSI', duration: '2 Years', degree: 'M.Tech', fees: 18000, seats: 30, eligibility: 'GATE score > 600' },
    ],
    placement: { year: 2023, avgPackage: 1400000, highestPackage: 12000000, placementRate: 91, topRecruiters: 'TCS,Infosys,Wipro,Zoho,L&T' },
  },
  {
    name: 'Vellore Institute of Technology',
    slug: 'vit-vellore',
    location: 'Vellore, Tamil Nadu',
    city: 'Vellore',
    state: 'Tamil Nadu',
    type: 'Deemed',
    established: 1984,
    ranking: 15,
    rating: 4.1,
    reviewCount: 1800,
    totalFees: 380000,
    description: 'VIT Vellore is one of the largest private universities in India. It offers a wide range of engineering, science, and management programs and is well-known for its strong industry connections and placement opportunities.',
    imageUrl: 'https://images.unsplash.com/photo-1580582932707-520aed937b7b?w=800',
    website: 'https://vit.ac.in',
    accreditation: 'NAAC A++',
    courses: [
      { name: 'B.Tech Computer Science', duration: '4 Years', degree: 'B.Tech', fees: 380000, seats: 600, eligibility: 'VITEEE score > 80' },
      { name: 'B.Tech Biomedical', duration: '4 Years', degree: 'B.Tech', fees: 380000, seats: 120, eligibility: 'VITEEE score > 60' },
      { name: 'MBA', duration: '2 Years', degree: 'MBA', fees: 450000, seats: 240, eligibility: 'CAT/MAT/XAT score' },
    ],
    placement: { year: 2023, avgPackage: 800000, highestPackage: 8000000, placementRate: 85, topRecruiters: 'TCS,Cognizant,Capgemini,Accenture,HCL' },
  },
  {
    name: 'Manipal Institute of Technology',
    slug: 'manipal-institute-of-technology',
    location: 'Manipal, Karnataka',
    city: 'Manipal',
    state: 'Karnataka',
    type: 'Deemed',
    established: 1957,
    ranking: 18,
    rating: 4.0,
    reviewCount: 950,
    totalFees: 420000,
    description: 'MIT Manipal is one of India\'s oldest and most reputed private engineering institutions. Part of Manipal Academy of Higher Education, it offers diverse programs with a focus on practical learning.',
    imageUrl: 'https://images.unsplash.com/photo-1498243691581-b145c3f54a5a?w=800',
    website: 'https://manipal.edu/mit.html',
    accreditation: 'NAAC A+',
    courses: [
      { name: 'B.Tech Computer Science', duration: '4 Years', degree: 'B.Tech', fees: 420000, seats: 240, eligibility: 'MET score or JEE score' },
      { name: 'B.Tech Mechatronics', duration: '4 Years', degree: 'B.Tech', fees: 420000, seats: 60, eligibility: 'MET score or JEE score' },
    ],
    placement: { year: 2023, avgPackage: 900000, highestPackage: 9000000, placementRate: 82, topRecruiters: 'Infosys,TCS,Amazon,Bosch,ABB' },
  },
]

async function main() {
  console.log('🌱 Seeding database...')

  // Create demo user
  const hashedPassword = await bcrypt.hash('demo1234', 10)
  await prisma.user.upsert({
    where: { email: 'demo@example.com' },
    update: {},
    create: {
      email: 'demo@example.com',
      name: 'Demo User',
      password: hashedPassword,
    },
  })

  for (const data of colleges) {
    const { courses, placement, ...collegeData } = data

    const college = await prisma.college.upsert({
      where: { slug: collegeData.slug },
      update: collegeData,
      create: collegeData,
    })

    // Keep seed idempotent: clear child records before re-inserting.
    await prisma.course.deleteMany({ where: { collegeId: college.id } })
    await prisma.placement.deleteMany({ where: { collegeId: college.id } })

    // Create courses
    for (const course of courses) {
      await prisma.course.create({
        data: { ...course, collegeId: college.id },
      })
    }

    // Create placement
    await prisma.placement.create({
      data: { ...placement, collegeId: college.id },
    })

    console.log(`✅ Seeded: ${college.name}`)
  }

  console.log('✅ Database seeded successfully!')
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect())
