import { useState } from 'react'
import { useProjects, useCreateProject, useUpdateProject, useDeleteProject, type Project } from '../../hooks/useProjects'
import { useOrganization } from '../../hooks/useOrganization'
import { toast } from 'sonner'
import { Plus, Pencil, Trash2, Star, Plane } from 'lucide-react'
import { getImageUrl } from '../../lib/api'
import api from '../../lib/api'

const inp = { width: '100%', background: 'rgba(10,15,30,0.8)', border: '1px solid rgba(255,255,255,0.1)', color: 'white', borderRadius: '10px', padding: '10px 14px', fontSize: '13px', outline: 'none', boxSizing: 'border-box' as const }
const lbl = { fontSize: '11px', color: '#64748b', display: 'block', marginBottom: '4px' }

export default function ProjectsManager(): React.ReactElement {
  const { data: projects } = useProjects()
  const { data: org } = useOrganization()
  const create = useCreateProject()
  const update = useUpdateProject()
  const del = useDeleteProject()
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState<Partial<Project & { tagsStr: string }>>({})
  const [isEditing, setIsEditing] = useState(false)
  const [uploading, setUploading] = useState(false)

  const f = (k: keyof typeof form, v: unknown) => setForm(p => ({ ...p, [k]: v }))

  const openCreate = () => { setForm({ orgId: org?.id, visible: true, featured: false, category: 'completions', year: new Date().getFullYear(), images: [], tagsStr: '' }); setIsEditing(false); setShowForm(true) }
  const openEdit = (p: Project) => { setForm({ ...p, tagsStr: p.tags.join(', ') }); setIsEditing(true); setShowForm(true) }

  const handleUpload = async (files: FileList | null) => {
    if (!files) return; setUploading(true)
    const fd = new FormData(); Array.from(files).forEach(f => fd.append('files', f))
    try { const { data } = await api.post('/upload', fd, { headers: { 'Content-Type': 'multipart/form-data' } }); setForm(p => ({ ...p, images: [...(p.images ?? []), ...data.paths] })) }
    catch { toast.error('Upload failed') } finally { setUploading(false) }
  }

  const handleToggle = async (p: Project) => { try { await update.mutateAsync({ id: p.id, visible: !p.visible }); } catch { toast.error('Update failed') } }
  const handleDelete = async (id: string) => { if (!confirm('Delete?')) return; try { await del.mutateAsync(id); toast.success('Deleted') } catch { toast.error('Failed') } }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const payload = { ...form, orgId: org?.id, year: Number(form.year), tags: (form.tagsStr || '').split(',').map((s: string) => s.trim()).filter(Boolean) }
    try {
      if (isEditing && form.id) { await update.mutateAsync({ ...payload, id: form.id } as Project); toast.success('Updated') }
      else { await create.mutateAsync(payload as Partial<Project>); toast.success('Created') }
      setShowForm(false)
    } catch { toast.error('Save failed') }
  }

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px' }}>
        <h1 style={{ fontFamily: 'Orbitron, sans-serif', fontSize: '22px', fontWeight: 700, color: 'white', margin: 0 }}>Projects</h1>
        <button onClick={openCreate} style={{ display: 'flex', alignItems: 'center', gap: '6px', background: '#0ea5e9', color: 'white', border: 'none', padding: '8px 16px', borderRadius: '10px', fontSize: '13px', fontWeight: 600, cursor: 'pointer' }}>
          <Plus style={{ width: '15px', height: '15px' }} /> Add Project
        </button>
      </div>

      <div style={{ background: 'rgba(13,21,38,0.75)', border: '1px solid rgba(14,165,233,0.1)', borderRadius: '16px', overflow: 'hidden' }}>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                {['Project', 'Category', 'Aircraft', 'Year', 'Visibility', 'Actions'].map(h => (
                  <th key={h} style={{ padding: '12px 16px', textAlign: 'left', fontSize: '11px', color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: 600 }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {projects?.map(p => (
                <tr key={p.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
                  <td style={{ padding: '12px 16px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      {p.images[0] && <img src={getImageUrl(p.images[0])} alt="" style={{ width: '40px', height: '40px', borderRadius: '8px', objectFit: 'cover', background: '#111b33' }} />}
                      <div>
                        <div style={{ color: 'white', fontSize: '13px', fontWeight: 500, display: 'flex', alignItems: 'center', gap: '6px' }}>
                          {p.title_en}{p.featured && <Star style={{ width: '12px', height: '12px', color: '#f59e0b', fill: '#f59e0b' }} />}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td style={{ padding: '12px 16px' }}><span style={{ fontSize: '12px', color: '#64748b', textTransform: 'capitalize' }}>{p.category}</span></td>
                  <td style={{ padding: '12px 16px' }}><span style={{ fontSize: '12px', color: '#64748b', display: 'flex', alignItems: 'center', gap: '4px' }}><Plane style={{ width: '11px', height: '11px' }} />{p.aircraftType}</span></td>
                  <td style={{ padding: '12px 16px' }}><span style={{ fontSize: '12px', color: '#64748b' }}>{p.year}</span></td>
                  <td style={{ padding: '12px 16px' }}>
                    <button onClick={() => handleToggle(p)} style={{ fontSize: '11px', padding: '3px 10px', borderRadius: '999px', border: 'none', cursor: 'pointer', background: p.visible ? 'rgba(34,197,94,0.12)' : 'rgba(100,116,139,0.12)', color: p.visible ? '#4ade80' : '#64748b' }}>
                      {p.visible ? 'Visible' : 'Hidden'}
                    </button>
                  </td>
                  <td style={{ padding: '12px 16px' }}>
                    <div style={{ display: 'flex', gap: '4px' }}>
                      <button onClick={() => openEdit(p)} style={{ width: '28px', height: '28px', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'none', border: 'none', color: '#64748b', cursor: 'pointer', borderRadius: '6px' }} onMouseEnter={e => ((e.currentTarget as HTMLElement).style.color = 'white')} onMouseLeave={e => ((e.currentTarget as HTMLElement).style.color = '#64748b')}><Pencil style={{ width: '13px', height: '13px' }} /></button>
                      <button onClick={() => handleDelete(p.id)} style={{ width: '28px', height: '28px', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'none', border: 'none', color: '#64748b', cursor: 'pointer', borderRadius: '6px' }} onMouseEnter={e => ((e.currentTarget as HTMLElement).style.color = '#f87171')} onMouseLeave={e => ((e.currentTarget as HTMLElement).style.color = '#64748b')}><Trash2 style={{ width: '13px', height: '13px' }} /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {showForm && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '16px', background: 'rgba(0,0,0,0.75)', backdropFilter: 'blur(6px)' }} onClick={() => setShowForm(false)}>
          <div style={{ background: 'rgba(13,21,38,0.98)', border: '1px solid rgba(14,165,233,0.2)', borderRadius: '20px', width: '100%', maxWidth: '680px', maxHeight: '90vh', overflowY: 'auto' }} onClick={e => e.stopPropagation()}>
            <div style={{ padding: '20px 24px', borderBottom: '1px solid rgba(255,255,255,0.05)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h2 style={{ fontFamily: 'Orbitron, sans-serif', fontSize: '16px', fontWeight: 700, color: 'white', margin: 0 }}>{isEditing ? 'Edit Project' : 'New Project'}</h2>
              <button onClick={() => setShowForm(false)} style={{ background: 'none', border: 'none', color: '#64748b', cursor: 'pointer', fontSize: '20px' }}>✕</button>
            </div>
            <form onSubmit={handleSubmit} style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div><label style={lbl}>Title (EN)</label><input value={form.title_en || ''} onChange={e => f('title_en', e.target.value)} style={inp} required /></div>
                <div><label style={lbl}>Title (ES)</label><input value={form.title_es || ''} onChange={e => f('title_es', e.target.value)} style={inp} /></div>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div><label style={lbl}>Description (EN)</label><textarea value={form.description_en || ''} onChange={e => f('description_en', e.target.value)} rows={3} style={{ ...inp, resize: 'none' }} /></div>
                <div><label style={lbl}>Description (ES)</label><textarea value={form.description_es || ''} onChange={e => f('description_es', e.target.value)} rows={3} style={{ ...inp, resize: 'none' }} /></div>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '12px' }}>
                <div><label style={lbl}>Category</label>
                  <select value={form.category || 'completions'} onChange={e => f('category', e.target.value)} style={inp}>
                    {['completions', 'refurb', 'vip', 'military', 'cargo'].map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
                <div><label style={lbl}>Aircraft</label><input value={form.aircraftType || ''} onChange={e => f('aircraftType', e.target.value)} style={inp} /></div>
                <div><label style={lbl}>Year</label><input type="number" value={form.year || new Date().getFullYear()} onChange={e => f('year', +e.target.value)} style={inp} /></div>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div><label style={lbl}>Client</label><input value={form.client || ''} onChange={e => f('client', e.target.value)} style={inp} /></div>
                <div><label style={lbl}>Tags (comma-separated)</label><input value={form.tagsStr || ''} onChange={e => f('tagsStr', e.target.value)} style={inp} placeholder="Leather, LED, Certified..." /></div>
              </div>
              <div style={{ display: 'flex', gap: '20px' }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', color: '#cbd5e1', fontSize: '13px' }}>
                  <input type="checkbox" checked={!!form.visible} onChange={e => f('visible', e.target.checked)} /> Visible
                </label>
                <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', color: '#cbd5e1', fontSize: '13px' }}>
                  <input type="checkbox" checked={!!form.featured} onChange={e => f('featured', e.target.checked)} /> Featured
                </label>
              </div>
              <div>
                <label style={lbl}>Images (up to 10)</label>
                <input type="file" multiple accept="image/*" onChange={e => handleUpload(e.target.files)} style={{ color: '#94a3b8', fontSize: '13px' }} />
                {uploading && <p style={{ color: '#64748b', fontSize: '12px', marginTop: '4px' }}>Uploading...</p>}
                {(form.images ?? []).length > 0 && (
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginTop: '8px' }}>
                    {(form.images ?? []).map((img, i) => (
                      <div key={i} style={{ position: 'relative' }}>
                        <img src={getImageUrl(img)} alt="" style={{ width: '60px', height: '60px', borderRadius: '8px', objectFit: 'cover' }} />
                        <button type="button" onClick={() => setForm(p => ({ ...p, images: (p.images ?? []).filter((_, j) => j !== i) }))} style={{ position: 'absolute', top: '-4px', right: '-4px', background: '#ef4444', color: 'white', border: 'none', borderRadius: '50%', width: '16px', height: '16px', fontSize: '10px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>×</button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
              <div style={{ display: 'flex', gap: '10px' }}>
                <button type="submit" style={{ flex: 1, background: '#0ea5e9', color: 'white', border: 'none', padding: '12px', borderRadius: '10px', fontWeight: 600, fontSize: '14px', cursor: 'pointer' }}>
                  {isEditing ? 'Update' : 'Create'}
                </button>
                <button type="button" onClick={() => setShowForm(false)} style={{ padding: '12px 20px', background: 'rgba(255,255,255,0.05)', color: '#94a3b8', border: 'none', borderRadius: '10px', cursor: 'pointer' }}>
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
