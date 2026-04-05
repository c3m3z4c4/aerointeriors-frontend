import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { toast } from 'sonner'
import api from '../lib/api'
import { useAuthStore } from '../stores/authStore'
import { Plane, Eye, EyeOff, Lock } from 'lucide-react'

const schema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
})
type FormData = z.infer<typeof schema>

export default function AdminLogin(): React.ReactElement {
  const [showPass, setShowPass] = useState(false)
  const { setAuth } = useAuthStore()
  const navigate = useNavigate()
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<FormData>({ resolver: zodResolver(schema) })

  const onSubmit = async (data: FormData) => {
    try {
      const res = await api.post('/auth/login', data)
      setAuth(res.data.token, res.data.user)
      navigate('/admin')
    } catch {
      toast.error('Invalid credentials')
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4" style={{ background: '#0a0f1e' }}>
      <div
        className="fixed inset-0 pointer-events-none"
        style={{
          backgroundImage: 'linear-gradient(rgba(14,165,233,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(14,165,233,0.04) 1px, transparent 1px)',
          backgroundSize: '50px 50px',
        }}
      />
      <div className="relative w-full max-w-md">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl mb-4" style={{ background: 'rgba(14,165,233,0.15)', border: '1px solid rgba(14,165,233,0.3)' }}>
            <Plane className="w-8 h-8" style={{ color: '#0ea5e9' }} />
          </div>
          <h1 className="font-display text-2xl font-bold text-white" style={{ fontFamily: 'Orbitron, sans-serif' }}>
            AIRCRAFT <span style={{ color: '#0ea5e9' }}>INTERIORS</span>
          </h1>
          <p className="text-slate-400 mt-1 text-sm">Admin Panel</p>
        </div>

        <div className="glass rounded-2xl p-8">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
              <label className="block text-sm text-slate-300 mb-1.5">Email</label>
              <input
                {...register('email')} type="email" autoComplete="email"
                className="w-full rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none transition-colors"
                style={{ background: 'rgba(10,15,30,0.8)', border: '1px solid rgba(255,255,255,0.1)' }}
                placeholder="admin@air-interiors.com"
                onFocus={e => (e.target.style.borderColor = '#0ea5e9')}
                onBlur={e => (e.target.style.borderColor = 'rgba(255,255,255,0.1)')}
              />
              {errors.email && <p className="text-red-400 text-xs mt-1">{errors.email.message}</p>}
            </div>
            <div>
              <label className="block text-sm text-slate-300 mb-1.5">Password</label>
              <div className="relative">
                <input
                  {...register('password')} type={showPass ? 'text' : 'password'} autoComplete="current-password"
                  className="w-full rounded-xl px-4 py-2.5 pr-10 text-white text-sm focus:outline-none transition-colors"
                  style={{ background: 'rgba(10,15,30,0.8)', border: '1px solid rgba(255,255,255,0.1)' }}
                  placeholder="••••••••"
                  onFocus={e => (e.target.style.borderColor = '#0ea5e9')}
                  onBlur={e => (e.target.style.borderColor = 'rgba(255,255,255,0.1)')}
                />
                <button type="button" onClick={() => setShowPass(!showPass)} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white transition-colors">
                  {showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              {errors.password && <p className="text-red-400 text-xs mt-1">{errors.password.message}</p>}
            </div>
            <button
              type="submit" disabled={isSubmitting}
              className="w-full text-white font-semibold py-2.5 rounded-xl transition-all flex items-center justify-center gap-2 disabled:opacity-60"
              style={{ background: isSubmitting ? 'rgba(14,165,233,0.6)' : '#0ea5e9' }}
            >
              <Lock className="w-4 h-4" />
              {isSubmitting ? 'Signing in...' : 'Sign In'}
            </button>
          </form>
        </div>
        <p className="text-center text-slate-600 text-xs mt-6">© {new Date().getFullYear()} Aircraft Interiors Solutions</p>
      </div>
    </div>
  )
}
