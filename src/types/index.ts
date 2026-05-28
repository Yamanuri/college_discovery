// src/types/index.ts

export interface College {
  id: string
  name: string
  slug: string
  location: string
  city: string
  state: string
  type: string
  established: number
  ranking: number | null
  rating: number
  reviewCount: number
  totalFees: number
  description: string
  imageUrl: string | null
  website: string | null
  phone: string | null
  email: string | null
  accreditation: string | null
  courses: Course[]
  placements: Placement[]
  reviews?: Review[]
}

export interface Course {
  id: string
  collegeId: string
  name: string
  duration: string
  degree: string
  fees: number
  seats: number
  eligibility: string
}

export interface Placement {
  id: string
  collegeId: string
  year: number
  avgPackage: number
  highestPackage: number
  placementRate: number
  topRecruiters: string
}

export interface Review {
  id: string
  collegeId: string
  userId: string
  rating: number
  title: string
  body: string
  pros: string | null
  cons: string | null
  createdAt: string
  user: {
    name: string
  }
}

export interface User {
  id: string
  email: string
  name: string
}

export interface SavedCollege {
  id: string
  userId: string
  collegeId: string
  college: College
}

export interface CollegeFilters {
  search?: string
  state?: string
  type?: string
  minFees?: number
  maxFees?: number
  minRating?: number
  sortBy?: 'ranking' | 'rating' | 'fees_asc' | 'fees_desc' | 'name'
  page?: number
  limit?: number
}

export interface PaginatedResponse<T> {
  data: T[]
  total: number
  page: number
  limit: number
  totalPages: number
}

export interface ApiError {
  error: string
  details?: string
}
