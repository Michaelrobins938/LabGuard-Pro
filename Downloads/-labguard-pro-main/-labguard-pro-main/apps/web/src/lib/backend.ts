export async function backendFetch(path: string, init?: RequestInit) {
  const base = process.env.BACKEND_API_URL || 'http://localhost:4000'
  const url = path.startsWith('http') ? path : `${base}${path}`

  const res = await fetch(url, {
    ...init,
    headers: {
      'Content-Type': 'application/json',
      ...(init?.headers || {})
    },
    cache: 'no-store'
  })

  return res
}