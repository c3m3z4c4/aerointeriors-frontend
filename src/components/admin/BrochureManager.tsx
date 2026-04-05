import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useOrganization } from '../../hooks/useOrganization'
import api from '../../lib/api'
import { toast } from 'sonner'
import { Upload, Trash2, Download, FileText, CheckCircle } from 'lucide-react'

interface BrochureFile { id: string; filename: string; path: string; isCurrent: boolean; uploadedAt: string }

export default function BrochureManager(): React.ReactElement {
  const { data: org } = useOrganization()
  const qc = useQueryClient()
  const [uploading, setUploading] = useState(false)

  const { data } = useQuery<{ files: BrochureFile[]; totalDownloads: number }>({
    queryKey: ['brochures', org?.id],
    queryFn: async () => { const { data } = await api.get(`/brochure/files?orgId=${org!.id}`); return data },
    enabled: !!org?.id,
  })

  const setCurrent = useMutation({
    mutationFn: async (id: string) => { await api.post(`/brochure/set-current/${id}`) },
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['brochures'] }); toast.success('Current brochure updated') },
  })

  const deleteBrochure = useMutation({
    mutationFn: async (id: string) => { await api.delete(`/brochure/files/${id}`) },
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['brochures'] }); toast.success('Deleted') },
  })

  const handleUpload = async (files: FileList | null) => {
    if (!files?.[0]) return; setUploading(true)
    const fd = new FormData(); fd.append('file', files[0]); fd.append('orgId', org?.id ?? '')
    try { await api.post('/brochure/upload', fd, { headers: { 'Content-Type': 'multipart/form-data' } }); qc.invalidateQueries({ queryKey: ['brochures'] }); toast.success('Uploaded') }
    catch { toast.error('Upload failed') } finally { setUploading(false) }
  }

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px' }}>
        <h1 style={{ fontFamily: 'Orbitron, sans-serif', fontSize: '22px', fontWeight: 700, color: 'white', margin: 0 }}>Brochure Manager</h1>
        <label style={{ display: 'flex', alignItems: 'center', gap: '6px', background: '#0ea5e9', color: 'white', padding: '8px 16px', borderRadius: '10px', fontSize: '13px', fontWeight: 600, cursor: 'pointer' }}>
          <Upload style={{ width: '15px', height: '15px' }} />{uploading ? 'Uploading...' : 'Upload PDF'}
          <input type="file" accept=".pdf" className="hidden" style={{ display: 'none' }} onChange={e => handleUpload(e.target.files)} disabled={uploading} />
        </label>
      </div>

      <div style={{ background: 'rgba(13,21,38,0.75)', border: '1px solid rgba(14,165,233,0.1)', borderRadius: '14px', padding: '16px', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '10px' }}>
        <Download style={{ width: '16px', height: '16px', color: '#0ea5e9' }} />
        <span style={{ color: '#94a3b8', fontSize: '14px' }}>Total downloads: <strong style={{ color: 'white' }}>{data?.totalDownloads ?? 0}</strong></span>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
        {data?.files?.map(f => (
          <div key={f.id} style={{ background: 'rgba(13,21,38,0.75)', border: '1px solid rgba(14,165,233,0.1)', borderRadius: '14px', padding: '16px', display: 'flex', alignItems: 'center', gap: '14px' }}>
            <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: f.isCurrent ? 'rgba(14,165,233,0.15)' : 'rgba(100,116,139,0.12)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <FileText style={{ width: '18px', height: '18px', color: f.isCurrent ? '#0ea5e9' : '#64748b' }} />
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ color: 'white', fontSize: '14px', fontWeight: 500 }}>{f.filename}</span>
                {f.isCurrent && <span style={{ display: 'flex', alignItems: 'center', gap: '4px', background: 'rgba(34,197,94,0.12)', color: '#4ade80', fontSize: '11px', padding: '2px 8px', borderRadius: '999px' }}><CheckCircle style={{ width: '11px', height: '11px' }} />Current</span>}
              </div>
              <div style={{ color: '#475569', fontSize: '11px' }}>{new Date(f.uploadedAt).toLocaleDateString()}</div>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              {!f.isCurrent && <button onClick={() => setCurrent.mutate(f.id)} style={{ fontSize: '12px', padding: '6px 12px', background: 'rgba(14,165,233,0.12)', color: '#0ea5e9', border: 'none', borderRadius: '8px', cursor: 'pointer' }}>Set Current</button>}
              <a href={`/api/brochure/download/${f.path}`} target="_blank" rel="noreferrer" style={{ width: '28px', height: '28px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#64748b', textDecoration: 'none' }}><Download style={{ width: '14px', height: '14px' }} /></a>
              <button onClick={() => deleteBrochure.mutate(f.id)} style={{ width: '28px', height: '28px', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'none', border: 'none', color: '#64748b', cursor: 'pointer', borderRadius: '6px' }}><Trash2 style={{ width: '14px', height: '14px' }} /></button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
