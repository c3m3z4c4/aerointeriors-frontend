import { useState } from 'react'
import { useSocialLinks, type SocialLink } from '../../hooks/useSocialLinks'
import { useOrganization } from '../../hooks/useOrganization'
import { useQueryClient, useMutation } from '@tanstack/react-query'
import api from '../../lib/api'
import { toast } from 'sonner'
import { Plus, Pencil, Trash2, Globe } from 'lucide-react'

const inp = { width: '100%', background: 'rgba(10,15,30,0.8)', border: '1px solid rgba(255,255,255,0.1)', color: 'white', borderRadius: '10px', padding: '10px 14px', fontSize: '13px', outline: 'none', boxSizing: 'border-box' as const }
const lbl = { fontSize: '11px', color: '#64748b', display: 'block', marginBottom: '4px' }

export default function SocialLinksManager(): React.ReactElement {
  const { data: links } = useSocialLinks(); const { data: org } = useOrganization(); const qc = useQueryClient()
  const [showForm, setShowForm] = useState(false); const [form, setForm] = useState<Partial<SocialLink>>({}); const [isEditing, setIsEditing] = useState(false)

  const save = useMutation({
    mutationFn: async (data: Partial<SocialLink>) => {
      if (data.id) return (await api.put(`/social-links/${data.id}`, data)).data
      return (await api.post('/social-links', { ...data, orgId: org?.id })).data
    },
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['social-links'] }); setShowForm(false); toast.success('Saved') },
  })

  const del = useMutation({
    mutationFn: async (id: string) => { await api.delete(`/social-links/${id}`) },
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['social-links'] }); toast.success('Deleted') },
  })

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px' }}>
        <h1 style={{ fontFamily: 'Orbitron, sans-serif', fontSize: '22px', fontWeight: 700, color: 'white', margin: 0 }}>Social Links</h1>
        <button onClick={() => { setForm({ order: 0 }); setIsEditing(false); setShowForm(true) }} style={{ display: 'flex', alignItems: 'center', gap: '6px', background: '#0ea5e9', color: 'white', border: 'none', padding: '8px 16px', borderRadius: '10px', fontSize: '13px', fontWeight: 600, cursor: 'pointer' }}><Plus style={{ width: '15px', height: '15px' }} /> Add</button>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
        {links?.map(l => (
          <div key={l.id} style={{ background: 'rgba(13,21,38,0.75)', border: '1px solid rgba(14,165,233,0.1)', borderRadius: '14px', padding: '16px', display: 'flex', alignItems: 'center', gap: '12px' }}>
            <Globe style={{ width: '18px', height: '18px', color: '#0ea5e9', flexShrink: 0 }} />
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ color: 'white', fontSize: '14px', fontWeight: 500 }}>{l.platform}</div>
              <div style={{ color: '#64748b', fontSize: '12px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{l.url}</div>
            </div>
            <div style={{ display: 'flex', gap: '4px' }}>
              <button onClick={() => { setForm(l); setIsEditing(true); setShowForm(true) }} style={{ width: '28px', height: '28px', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'none', border: 'none', color: '#64748b', cursor: 'pointer', borderRadius: '6px' }}><Pencil style={{ width: '13px', height: '13px' }} /></button>
              <button onClick={() => del.mutate(l.id)} style={{ width: '28px', height: '28px', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'none', border: 'none', color: '#64748b', cursor: 'pointer', borderRadius: '6px' }}><Trash2 style={{ width: '13px', height: '13px' }} /></button>
            </div>
          </div>
        ))}
      </div>

      {showForm && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '16px', background: 'rgba(0,0,0,0.75)', backdropFilter: 'blur(6px)' }} onClick={() => setShowForm(false)}>
          <div style={{ background: 'rgba(13,21,38,0.98)', border: '1px solid rgba(14,165,233,0.2)', borderRadius: '20px', width: '100%', maxWidth: '440px' }} onClick={e => e.stopPropagation()}>
            <div style={{ padding: '20px 24px', borderBottom: '1px solid rgba(255,255,255,0.05)', display: 'flex', justifyContent: 'space-between' }}>
              <h2 style={{ fontFamily: 'Orbitron, sans-serif', fontSize: '16px', color: 'white', margin: 0 }}>Social Link</h2>
              <button onClick={() => setShowForm(false)} style={{ background: 'none', border: 'none', color: '#64748b', cursor: 'pointer', fontSize: '20px' }}>✕</button>
            </div>
            <form onSubmit={e => { e.preventDefault(); save.mutate(form) }} style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div>
                <label style={lbl}>Platform</label>
                <select value={form.platform || ''} onChange={e => setForm(p => ({ ...p, platform: e.target.value }))} style={inp}>
                  <option value="">Select...</option>
                  {['LinkedIn', 'Instagram', 'Facebook', 'YouTube', 'Twitter', 'Custom'].map(p => <option key={p} value={p}>{p}</option>)}
                </select>
              </div>
              <div><label style={lbl}>URL</label><input type="url" value={form.url || ''} onChange={e => setForm(p => ({ ...p, url: e.target.value }))} style={inp} required /></div>
              <div style={{ display: 'flex', gap: '10px' }}>
                <button type="submit" style={{ flex: 1, background: '#0ea5e9', color: 'white', border: 'none', padding: '12px', borderRadius: '10px', fontWeight: 600, cursor: 'pointer' }}>Save</button>
                <button type="button" onClick={() => setShowForm(false)} style={{ padding: '12px 20px', background: 'rgba(255,255,255,0.05)', color: '#94a3b8', border: 'none', borderRadius: '10px', cursor: 'pointer' }}>Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
