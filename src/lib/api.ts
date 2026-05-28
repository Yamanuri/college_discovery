// src/lib/api.ts
export async function fetchColleges(params: Record<string, string | number | undefined>) {
  const query = new URLSearchParams()
  Object.entries(params).forEach(([k, v]) => {
    if (v !== undefined) query.set(k, String(v))
  })
  const res = await fetch(`/api/colleges?${query}`)
  if (!res.ok) throw new Error('Failed to fetch colleges')
  return res.json()
}

export async function fetchCollege(slug: string) {
  const res = await fetch(`/api/colleges/${slug}`)
  if (!res.ok) throw new Error('College not found')
  return res.json()
}

export async function saveCollege(collegeId: string) {
  const res = await fetch('/api/saved', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ collegeId }),
  })
  return res.json()
}

export async function unsaveCollege(collegeId: string) {
  const res = await fetch(`/api/saved/${collegeId}`, { method: 'DELETE' })
  return res.json()
}

export async function login(email: string, password: string) {
  const res = await fetch('/api/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  })
  return { ok: res.ok, data: await res.json() }
}

export async function register(name: string, email: string, password: string) {
  const res = await fetch('/api/auth/register', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name, email, password }),
  })
  return { ok: res.ok, data: await res.json() }
}

export async function logout() {
  await fetch('/api/auth/logout', { method: 'POST' })
}
