import { useState } from 'react'
import { useTeam, useCreateTeamMember, useUpdateTeamMember, useDeleteTeamMember, type TeamMember } from '../../hooks/useTeam'
import { useOrganization } from '../../hooks/useOrganization'
import { toast } from 'sonner'
import { Plus, Pencil, Trash2, User } from 'lucide-react'
import { getImageUrl } from '../../lib/api'
import api from '../../lib/api'

const inp = { width: '100%', background: 'rgba(10,15,30,0.8)', border: '1px solid rgba(255,255,255,0.1)', color: 'white', borderRadius: '10px', padding: '10px 14px', fontSize: '13px', outline: 'none', boxSizing: 'border-box' as const }
const lbl = { fontSize: '11px', color: '#64748b', display: 'block', marginBottom: '4px' }

export default function TeamManager(): React.ReactElement {
  const { data: team } = useTeam(); const { data: org } = useOrganization()
  const create = useCreateTeamMember(); const update = useUpdateTeamMember(); const del = useDeleteTeamMember()
  const [showForm, setShowForm] = useState(false); const [form, setForm] = useState<Partial<TeamMember>>({}); const [isEditing, setIsEditing] = useState(false); const [uploading, setUploading] = useState(false)
  const f = (k: keyof TeamMember, v: unknown) => setForm(p => ({ ...p, [k]: v }))
  const openCreate = () => { setForm({ orgId: org?.id, visible: true, order: 0 }); setIsEditing(false); setShowForm(true) }
  const openEdit = (m: TeamMember) => { setForm(m); setIsEditing(true); setShowForm(true) }
  const handleDelete = async (id: string) => { if (!confirm('Delete?')) return; try { await del.mutateAsync(id); toast.success('Deleted') } catch { toast.error('Failed') } }
  const handlePhoto = async (files: FileList | null) => {
    if (!files?.[0]) return; setUploading(true)
    const fd = new FormData(); fd.append('files', files[0])
    try { const { data } = await api.post('/upload', fd, { headers: { 'Content-Type': 'multipart/form-data' } }); f('photo', data.paths[0]) }
    catch { toast.error('Upload failed') } finally { setUploading(false) }
  }
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      if (isEditing && form.id) { await update.mutateAsync({ ...form, id: form.id } as TeamMember); toast.success('Updated') }
      else { await create.mutateAsync(form); toast.success('Created') }
      setShowForm(false)
    } catch { toast.error('Failed') }
  }

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px' }}>
        <h1 style={{ fontFamily: 'Orbitron, sans-serif', fontSize: '22px', fontWeight: 700, color: 'white', margin: 0 }}>Team</h1>
        <button onClick={openCreate} style={{ display: 'flex', alignItems: 'center', gap: '6px', background: '#0ea5e9', color: 'white', border: 'none', padding: '8px 16px', borderRadius: '10px', fontSize: '13px', fontWeight: 600, cursor: 'pointer' }}><Plus style={{ width: '15px', height: '15px' }} /> Add Member</button>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: '16px' }}>
        {team?.map(m => (
          <div key={m.id} style={{ background: 'rgba(13,21,38,0.75)', border: '1px solid rgba(14,165,233,0.1)', borderRadius: '16px', padding: '20px' }}>
            <div style={{ display: 'flex', gap: '12px', marginBottom: '12px' }}>
              <div style={{ width: '48px', height: '48px', borderRadius: '12px', overflow: 'hidden', background: '#111b33', flexShrink: 0 }}>
                {m.photo ? <img src={getImageUrl(m.photo)} alt={m.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><User style={{ width: '22px', height: '22px', color: '#475569' }} /></div>}
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ color: 'white', fontWeight: 500, fontSize: '14px' }}>{m.name}</div>
                <div style={{ color: '#0ea5e9', fontSize: '12px' }}>{m.role_en}</div>
              </div>
            </div>
            <p style={{ color: '#94a3b8', fontSize: '12px', lineHeight: 1.5, marginBottom: '12px', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>{m.bio_en}</p>
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '4px' }}>
              <button onClick={() => openEdit(m)} style={{ width: '28px', height: '28px', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'none', border: 'none', color: '#64748b', cursor: 'pointer', borderRadius: '6px' }}><Pencil style={{ width: '13px', height: '13px' }} /></button>
              <button onClick={() => handleDelete(m.id)} style={{ width: '28px', height: '28px', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'none', border: 'none', color: '#64748b', cursor: 'pointer', borderRadius: '6px' }}><Trash2 style={{ width: '13px', height: '13px' }} /></button>
            </div>
          </div>
        ))}
      </div>

      {showForm && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '16px', background: 'rgba(0,0,0,0.75)', backdropFilter: 'blur(6px)' }} onClick={() => setShowForm(false)}>
          <div style={{ background: 'rgba(13,21,38,0.98)', border: '1px solid rgba(14,165,233,0.2)', borderRadius: '20px', width: '100%', maxWidth: '560px', maxHeight: '90vh', overflowY: 'auto' }} onClick={e => e.stopPropagation()}>
            <div style={{ padding: '20px 24px', borderBottom: '1px solid rgba(255,255,255,0.05)', display: 'flex', justifyContent: 'space-between' }}>
              <h2 style={{ fontFamily: 'Orbitron, sans-serif', fontSize: '16px', color: 'white', margin: 0 }}>{isEditing ? 'Edit Member' : 'New Member'}</h2>
              <button onClick={() => setShowForm(false)} style={{ background: 'none', border: 'none', color: '#64748b', cursor: 'pointer', fontSize: '20px' }}>✕</button>
            </div>
            <form onSubmit={handleSubmit} style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div><label style={lbl}>Name</label><input value={form.name || ''} onChange={e => f('name', e.target.value)} style={inp} required /></div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div><label style={lbl}>Role (EN)</label><input value={form.role_en || ''} onChange={e => f('role_en', e.target.value)} style={inp} /></div>
                <div><label style={lbl}>Role (ES)</label><input value={form.role_es || ''} onChange={e => f('role_es', e.target.value)} style={inp} /></div>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div><label style={lbl}>Bio (EN)</label><textarea value={form.bio_en || ''} onChange={e => f('bio_en', e.target.value)} rows={3} style={{ ...inp, resize: 'none' }} /></div>
                <div><label style={lbl}>Bio (ES)</label><textarea value={form.bio_es || ''} onChange={e => f('bio_es', e.target.value)} rows={3} style={{ ...inp, resize: 'none' }} /></div>
              </div>
              <div><label style={lbl}>LinkedIn URL</label><input type="url" value={form.linkedIn || ''} onChange={e => f('linkedIn', e.target.value)} style={inp} /></div>
              <div>
                <label style={lbl}>Photo</label>
                <input type="file" accept="image/*" onChange={e => handlePhoto(e.target.files)} style={{ color: '#94a3b8', fontSize: '13px' }} />
                {uploading && <p style={{ color: '#64748b', fontSize: '12px', margin: '4px 0 0' }}>Uploading...</p>}
                {form.photo && <img src={getImageUrl(form.photo)} alt="" style={{ width: '56px', height: '56px', borderRadius: '10px', objectFit: 'cover', marginTop: '8px' }} />}
              </div>
              <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', color: '#cbd5e1', fontSize: '13px' }}>
                <input type="checkbox" checked={!!form.visible} onChange={e => f('visible', e.target.checked)} /> Visible
              </label>
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
