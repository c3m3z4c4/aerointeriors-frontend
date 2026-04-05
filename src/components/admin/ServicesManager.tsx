import { useState } from 'react'
import { useServices, useCreateService, useUpdateService, useDeleteService, type Service } from '../../hooks/useServices'
import { useOrganization } from '../../hooks/useOrganization'
import { toast } from 'sonner'
import { Plus, Pencil, Trash2, Settings2 } from 'lucide-react'

const inp = { width: '100%', background: 'rgba(10,15,30,0.8)', border: '1px solid rgba(255,255,255,0.1)', color: 'white', borderRadius: '10px', padding: '10px 14px', fontSize: '13px', outline: 'none', boxSizing: 'border-box' as const }
const lbl = { fontSize: '11px', color: '#64748b', display: 'block', marginBottom: '4px' }

export default function ServicesManager(): React.ReactElement {
  const { data: services } = useServices()
  const { data: org } = useOrganization()
  const create = useCreateService(); const update = useUpdateService(); const del = useDeleteService()
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState<Partial<Service>>({})
  const [isEditing, setIsEditing] = useState(false)

  const f = (k: keyof Service, v: unknown) => setForm(p => ({ ...p, [k]: v }))
  const openCreate = () => { setForm({ orgId: org?.id, icon: 'Settings', visible: true, order: 0 }); setIsEditing(false); setShowForm(true) }
  const openEdit = (s: Service) => { setForm(s); setIsEditing(true); setShowForm(true) }
  const handleDelete = async (id: string) => { if (!confirm('Delete?')) return; try { await del.mutateAsync(id); toast.success('Deleted') } catch { toast.error('Failed') } }
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      if (isEditing && form.id) { await update.mutateAsync({ ...form, id: form.id } as Service); toast.success('Updated') }
      else { await create.mutateAsync(form); toast.success('Created') }
      setShowForm(false)
    } catch { toast.error('Save failed') }
  }

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px' }}>
        <h1 style={{ fontFamily: 'Orbitron, sans-serif', fontSize: '22px', fontWeight: 700, color: 'white', margin: 0 }}>Services</h1>
        <button onClick={openCreate} style={{ display: 'flex', alignItems: 'center', gap: '6px', background: '#0ea5e9', color: 'white', border: 'none', padding: '8px 16px', borderRadius: '10px', fontSize: '13px', fontWeight: 600, cursor: 'pointer' }}><Plus style={{ width: '15px', height: '15px' }} /> Add</button>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
        {services?.map(s => (
          <div key={s.id} style={{ background: 'rgba(13,21,38,0.75)', border: '1px solid rgba(14,165,233,0.1)', borderRadius: '14px', padding: '16px', display: 'flex', alignItems: 'center', gap: '14px' }}>
            <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: 'rgba(14,165,233,0.12)', border: '1px solid rgba(14,165,233,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}><Settings2 style={{ width: '18px', height: '18px', color: '#0ea5e9' }} /></div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ color: 'white', fontWeight: 500, fontSize: '14px' }}>{s.title_en}</div>
              <div style={{ color: '#64748b', fontSize: '12px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{s.description_en}</div>
            </div>
            <span style={{ fontSize: '11px', padding: '3px 10px', borderRadius: '999px', background: s.visible ? 'rgba(34,197,94,0.12)' : 'rgba(100,116,139,0.12)', color: s.visible ? '#4ade80' : '#64748b' }}>{s.visible ? 'Visible' : 'Hidden'}</span>
            <div style={{ display: 'flex', gap: '4px' }}>
              <button onClick={() => openEdit(s)} style={{ width: '28px', height: '28px', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'none', border: 'none', color: '#64748b', cursor: 'pointer', borderRadius: '6px' }}><Pencil style={{ width: '13px', height: '13px' }} /></button>
              <button onClick={() => handleDelete(s.id)} style={{ width: '28px', height: '28px', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'none', border: 'none', color: '#64748b', cursor: 'pointer', borderRadius: '6px' }}><Trash2 style={{ width: '13px', height: '13px' }} /></button>
            </div>
          </div>
        ))}
      </div>

      {showForm && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '16px', background: 'rgba(0,0,0,0.75)', backdropFilter: 'blur(6px)' }} onClick={() => setShowForm(false)}>
          <div style={{ background: 'rgba(13,21,38,0.98)', border: '1px solid rgba(14,165,233,0.2)', borderRadius: '20px', width: '100%', maxWidth: '560px', maxHeight: '90vh', overflowY: 'auto' }} onClick={e => e.stopPropagation()}>
            <div style={{ padding: '20px 24px', borderBottom: '1px solid rgba(255,255,255,0.05)', display: 'flex', justifyContent: 'space-between' }}>
              <h2 style={{ fontFamily: 'Orbitron, sans-serif', fontSize: '16px', color: 'white', margin: 0 }}>{isEditing ? 'Edit Service' : 'New Service'}</h2>
              <button onClick={() => setShowForm(false)} style={{ background: 'none', border: 'none', color: '#64748b', cursor: 'pointer', fontSize: '20px' }}>✕</button>
            </div>
            <form onSubmit={handleSubmit} style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div><label style={lbl}>Title (EN)</label><input value={form.title_en || ''} onChange={e => f('title_en', e.target.value)} style={inp} required /></div>
                <div><label style={lbl}>Title (ES)</label><input value={form.title_es || ''} onChange={e => f('title_es', e.target.value)} style={inp} /></div>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div><label style={lbl}>Description (EN)</label><textarea value={form.description_en || ''} onChange={e => f('description_en', e.target.value)} rows={3} style={{ ...inp, resize: 'none' }} /></div>
                <div><label style={lbl}>Description (ES)</label><textarea value={form.description_es || ''} onChange={e => f('description_es', e.target.value)} rows={3} style={{ ...inp, resize: 'none' }} /></div>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr auto', gap: '12px', alignItems: 'end' }}>
                <div><label style={lbl}>Icon (Lucide name)</label><input value={form.icon || ''} onChange={e => f('icon', e.target.value)} style={inp} placeholder="Crown, Wrench, Lightbulb..." /></div>
                <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', color: '#cbd5e1', fontSize: '13px', paddingBottom: '10px' }}>
                  <input type="checkbox" checked={!!form.visible} onChange={e => f('visible', e.target.checked)} /> Visible
                </label>
              </div>
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
