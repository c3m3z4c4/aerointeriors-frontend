import axios from 'axios'

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '/api',
  headers: { 'Content-Type': 'application/json' },
})

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token')
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})

api.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401) {
      localStorage.removeItem('token')
      if (window.location.pathname.startsWith('/admin') && !window.location.pathname.includes('login')) {
        window.location.href = '/admin/login'
      }
    }
    return Promise.reject(err)
  }
)

export default api

export function getImageUrl(path: string): string {
  if (!path) return ''
  if (path.startsWith('http')) return path
  const base = (import.meta.env.VITE_API_URL || '').replace('/api', '')
  return `${base}${path.startsWith('/') ? path : `/${path}`}`
}
