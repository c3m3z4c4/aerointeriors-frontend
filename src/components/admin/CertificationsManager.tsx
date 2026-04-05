import { useState } from 'react'
import { useCertifications, useCreateCertification, useUpdateCertification, useDeleteCertification, type Certification } from '../../hooks/useCertifications'
import { useOrganization } from '../../hooks/useOrganization'
import { toast } from 'sonner'
import { Plus, Pencil, Trash2, Award } from 'lucide-react'

const inp = { width: '100%', background: 'rgba(10,15,30,0.8)', border: '1px solid rgba(255,255,255,0.1)', color: 'white', borderRadius: '10px', padding: '10px 14px', fontSize: '13px', outline: 'none', boxSizing: 'border-box' as const }
const lbl = { fontSize: '11px', color: '#64748b', display: 'block', marginBottom: '4px' }

export default function CertificationsManager(): React.ReactElement {
  const { data: certs } = useCertifications(); const { data: org } = useOrganization()
  const create = useCreateCertification(); const update = useUpdateCertification(); const del = useDeleteCertification()
  const [showForm, setShowForm] = useState(false); const [form, setForm] = useState<Partial<Certification>>({}); const [isEditing, setIsEditing] = useState(false)
  const f = (k: keyof Certification, v: unknown) => setForm(p => ({ ...p, [k]: v }))
  const openCreate = () => { setForm({ orgId: org?.id, visible: true, order: 0 }); setIsEditing(false); setShowForm(true) }
  const openEdit = (c: Certification) => { setForm(c); setIsEditing(true); setShowForm(true) }
  const handleDelete = async (id: string) => { if (!confirm('Delete?')) return; try { await del.mutateAsync(id); toast.success('Deleted') } catch { toast.error('Failed') } }
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      if (isEditing && form.id) { await update.mutateAsync({ ...form, id: form.id } as Certification); toast.success('Updated') }
      else { await create.mutateAsync(form); toast.success('Created') }
      setShowForm(false)
    } catch { toast.error('Failed') }
  }

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px' }}>
        <h1 style={{ fontFamily: 'Orbitron, sans-serif', fontSize: '22px', fontWeight: 700, color: 'white', margin: 0 }}>Certifications</h1>
        <button onClick={openCreate} style={{ display: 'flex', alignItems: 'center', gap: '6px', background: '#0ea5e9', color: 'white', border: 'none', padding: '8px 16px', borderRadius: '10px', fontSize: '13px', fontWeight: 600, cursor: 'pointer' }}><Plus style={{ width: '15px', height: '15px' }} /> Add</button>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
        {certs?.map(c => (
          <div key={c.id} style={{ background: 'rgba(13,21,38,0.75)', border: '1px solid rgba(14,165,233,0.1)', borderRadius: '14px', padding: '16px', display: 'flex', alignItems: 'center', gap: '14px' }}>
            <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: 'rgba(14,165,233,0.12)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}><Award style={{ width: '18px', height: '18px', color: '#0ea5e9' }} /></div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ color: 'white', fontSize: '14px', fontWeight: 500 }}>{c.title_en}</div>
              <div style={{ color: '#64748b', fontSize: '12px' }}>{c.issuer} · {c.issueDate}</div>
            </div>
            <div style={{ display: 'flex', gap: '4px' }}>
              <button onClick={() => openEdit(c)} style={{ width: '28px', height: '28px', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'none', border: 'none', color: '#64748b', cursor: 'pointer', borderRadius: '6px' }}><Pencil style={{ width: '13px', height: '13px' }} /></button>
              <button onClick={() => handleDelete(c.id)} style={{ width: '28px', height: '28px', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'none', border: 'none', color: '#64748b', cursor: 'pointer', borderRadius: '6px' }}><Trash2 style={{ width: '13px', height: '13px' }} /></button>
            </div>
          </div>
        ))}
      </div>

      {showForm && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '16px', background: 'rgba(0,0,0,0.75)', backdropFilter: 'blur(6px)' }} onClick={() => setShowForm(false)}>
          <div style={{ background: 'rgba(13,21,38,0.98)', border: '1px solid rgba(14,165,233,0.2)', borderRadius: '20px', width: '100%', maxWidth: '520px' }} onClick={e => e.stopPropagation()}>
            <div style={{ padding: '20px 24px', borderBottom: '1px solid rgba(255,255,255,0.05)', display: 'flex', justifyContent: 'space-between' }}>
              <h2 style={{ fontFamily: 'Orbitron, sans-serif', fontSize: '16px', color: 'white', margin: 0 }}>{isEditing ? 'Edit Cert' : 'New Cert'}</h2>
              <button onClick={() => setShowForm(false)} style={{ background: 'none', border: 'none', color: '#64748b', cursor: 'pointer', fontSize: '20px' }}>✕</button>
            </div>
            <form onSubmit={handleSubmit} style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div><label style={lbl}>Title (EN)</label><input value={form.title_en || ''} onChange={e => f('title_en', e.target.value)} style={inp} required /></div>
                <div><label style={lbl}>Title (ES)</label><input value={form.title_es || ''} onChange={e => f('title_es', e.target.value)} style={inp} /></div>
              </div>
              <div><label style={lbl}>Issuer</label><input value={form.issuer || ''} onChange={e => f('issuer', e.target.value)} style={inp} /></div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div><label style={lbl}>Issue Date</label><input type="date" value={form.issueDate || ''} onChange={e => f('issueDate', e.target.value)} style={inp} /></div>
                <div><label style={lbl}>Credential URL</label><input type="url" value={form.credUrl || ''} onChange={e => f('credUrl', e.target.value)} style={inp} /></div>
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
