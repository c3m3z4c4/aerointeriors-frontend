import { useProjects } from '../../hooks/useProjects'
import { useServices } from '../../hooks/useServices'
import { useTeam } from '../../hooks/useTeam'
import { useQuery } from '@tanstack/react-query'
import { useOrganization } from '../../hooks/useOrganization'
import api from '../../lib/api'
import { FolderKanban, MessageSquare, Download, Settings2, Users } from 'lucide-react'

function KPICard({ label, value, sub, icon: Icon, color }: { label: string; value: number | string; sub?: string; icon: React.ComponentType<{ style?: React.CSSProperties }>; color: string }): React.ReactElement {
  return (
    <div style={{ background: 'rgba(13,21,38,0.75)', backdropFilter: 'blur(12px)', border: '1px solid rgba(14,165,233,0.1)', borderRadius: '16px', padding: '24px', transition: 'border-color 0.2s' }}
      onMouseEnter={e => ((e.currentTarget as HTMLElement).style.borderColor = 'rgba(14,165,233,0.25)')}
      onMouseLeave={e => ((e.currentTarget as HTMLElement).style.borderColor = 'rgba(14,165,233,0.1)')}>
      <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: color, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '16px' }}>
        <Icon style={{ width: '20px', height: '20px' }} />
      </div>
      <div style={{ fontFamily: 'Orbitron, sans-serif', fontSize: '2rem', fontWeight: 800, color: 'white', marginBottom: '4px' }}>{value}</div>
      <div style={{ color: '#94a3b8', fontSize: '13px' }}>{label}</div>
      {sub && <div style={{ color: '#475569', fontSize: '11px', marginTop: '4px' }}>{sub}</div>}
    </div>
  )
}

export default function Dashboard(): React.ReactElement {
  const { data: org } = useOrganization()
  const { data: projects } = useProjects()
  const { data: services } = useServices()
  const { data: team } = useTeam()

  const { data: messages } = useQuery({
    queryKey: ['messages-admin', org?.id],
    queryFn: async () => { const { data } = await api.get(`/contact?orgId=${org!.id}`); return data },
    enabled: !!org?.id,
  })

  const { data: brochureData } = useQuery({
    queryKey: ['brochure-metrics', org?.id],
    queryFn: async () => { const { data } = await api.get(`/brochure/metrics?orgId=${org!.id}`); return data },
    enabled: !!org?.id,
  })

  const unread = messages?.filter((m: { isRead: boolean }) => !m.isRead).length ?? 0

  return (
    <div>
      <h1 style={{ fontFamily: 'Orbitron, sans-serif', fontSize: '22px', fontWeight: 700, color: 'white', marginBottom: '24px', marginTop: 0 }}>Dashboard</h1>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: '16px' }}>
        <KPICard label="Total Projects" value={projects?.length ?? 0} sub={`${projects?.filter(p => p.featured).length ?? 0} featured`} icon={FolderKanban} color="rgba(14,165,233,0.15)" />
        <KPICard label="Unread Messages" value={unread} sub={`${messages?.length ?? 0} total`} icon={MessageSquare} color="rgba(245,158,11,0.15)" />
        <KPICard label="Brochure Downloads" value={brochureData?.totalDownloads ?? 0} icon={Download} color="rgba(34,197,94,0.15)" />
        <KPICard label="Active Services" value={services?.filter(s => s.visible).length ?? 0} icon={Settings2} color="rgba(168,85,247,0.15)" />
        <KPICard label="Team Members" value={team?.filter(m => m.visible).length ?? 0} icon={Users} color="rgba(236,72,153,0.15)" />
      </div>
    </div>
  )
}
