import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useOrganization } from '../../hooks/useOrganization'
import api from '../../lib/api'
import { toast } from 'sonner'
import { Mail, MailOpen, Trash2, ChevronDown, ChevronUp } from 'lucide-react'

interface Message { id: string; name: string; company?: string; email: string; phone?: string; aircraftModel?: string; serviceType?: string; message: string; isRead: boolean; createdAt: string }

export default function ContactMessages(): React.ReactElement {
  const { data: org } = useOrganization()
  const qc = useQueryClient()
  const [filter, setFilter] = useState<'all' | 'unread'>('all')
  const [expanded, setExpanded] = useState<string | null>(null)

  const { data: messages } = useQuery<Message[]>({
    queryKey: ['contact-messages', org?.id, filter],
    queryFn: async () => {
      const { data } = await api.get(`/contact?orgId=${org!.id}${filter === 'unread' ? '&unread=true' : ''}`)
      return data
    },
    enabled: !!org?.id,
  })

  const markRead = useMutation({
    mutationFn: async ({ id, isRead }: { id: string; isRead: boolean }) => { await api.patch(`/contact/${id}`, { isRead }) },
    onSuccess: () => qc.invalidateQueries({ queryKey: ['contact-messages'] }),
  })

  const deleteMsg = useMutation({
    mutationFn: async (id: string) => { await api.delete(`/contact/${id}`) },
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['contact-messages'] }); toast.success('Deleted') },
  })

  const btnStyle = (active: boolean): React.CSSProperties => ({ padding: '7px 16px', borderRadius: '10px', fontSize: '13px', fontWeight: 500, cursor: 'pointer', border: 'none', background: active ? '#0ea5e9' : 'rgba(255,255,255,0.05)', color: active ? 'white' : '#94a3b8', transition: 'all 0.2s' })

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px' }}>
        <h1 style={{ fontFamily: 'Orbitron, sans-serif', fontSize: '22px', fontWeight: 700, color: 'white', margin: 0 }}>Contact Messages</h1>
        <div style={{ display: 'flex', gap: '8px' }}>
          <button style={btnStyle(filter === 'all')} onClick={() => setFilter('all')}>All</button>
          <button style={btnStyle(filter === 'unread')} onClick={() => setFilter('unread')}>Unread</button>
        </div>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
        {messages?.map(m => (
          <div key={m.id} style={{ background: 'rgba(13,21,38,0.75)', border: `1px solid ${!m.isRead ? 'rgba(14,165,233,0.2)' : 'rgba(14,165,233,0.08)'}`, borderRadius: '14px', overflow: 'hidden' }}>
            <div style={{ padding: '16px', display: 'flex', alignItems: 'flex-start', gap: '12px', cursor: 'pointer' }} onClick={() => setExpanded(expanded === m.id ? null : m.id)}>
              <div style={{ width: '36px', height: '36px', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, background: m.isRead ? 'rgba(100,116,139,0.15)' : 'rgba(14,165,233,0.15)' }}>
                {m.isRead ? <MailOpen style={{ width: '16px', height: '16px', color: '#64748b' }} /> : <Mail style={{ width: '16px', height: '16px', color: '#0ea5e9' }} />}
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                  <span style={{ color: 'white', fontSize: '14px', fontWeight: 500 }}>{m.name}</span>
                  {m.company && <span style={{ color: '#64748b', fontSize: '12px' }}>· {m.company}</span>}
                  {!m.isRead && <span style={{ background: '#0ea5e9', color: 'white', fontSize: '10px', fontWeight: 700, padding: '2px 8px', borderRadius: '999px' }}>NEW</span>}
                </div>
                <div style={{ color: '#64748b', fontSize: '12px' }}>{m.email}</div>
                <p style={{ color: '#94a3b8', fontSize: '13px', marginTop: '4px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{m.message}</p>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexShrink: 0 }}>
                <span style={{ color: '#475569', fontSize: '11px' }}>{new Date(m.createdAt).toLocaleDateString()}</span>
                {expanded === m.id ? <ChevronUp style={{ width: '15px', height: '15px', color: '#64748b' }} /> : <ChevronDown style={{ width: '15px', height: '15px', color: '#64748b' }} />}
              </div>
            </div>
            {expanded === m.id && (
              <div style={{ padding: '0 16px 16px', borderTop: '1px solid rgba(255,255,255,0.05)', paddingTop: '16px' }}>
                <p style={{ color: '#cbd5e1', fontSize: '14px', lineHeight: 1.7, marginBottom: '16px' }}>{m.message}</p>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '16px', marginBottom: '16px', fontSize: '12px' }}>
                  {m.phone && <span style={{ color: '#94a3b8' }}>Phone: <b style={{ color: 'white' }}>{m.phone}</b></span>}
                  {m.aircraftModel && <span style={{ color: '#94a3b8' }}>Aircraft: <b style={{ color: 'white' }}>{m.aircraftModel}</b></span>}
                  {m.serviceType && <span style={{ color: '#94a3b8' }}>Service: <b style={{ color: 'white' }}>{m.serviceType}</b></span>}
                </div>
                <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                  <button onClick={() => markRead.mutate({ id: m.id, isRead: !m.isRead })} style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '7px 14px', background: 'rgba(255,255,255,0.05)', color: '#94a3b8', border: 'none', borderRadius: '8px', fontSize: '12px', cursor: 'pointer' }}>
                    {m.isRead ? <Mail style={{ width: '13px', height: '13px' }} /> : <MailOpen style={{ width: '13px', height: '13px' }} />}
                    {m.isRead ? 'Mark unread' : 'Mark read'}
                  </button>
                  <a href={`mailto:${m.email}`} style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '7px 14px', background: 'rgba(14,165,233,0.12)', color: '#0ea5e9', borderRadius: '8px', fontSize: '12px', textDecoration: 'none' }}>
                    <Mail style={{ width: '13px', height: '13px' }} /> Reply
                  </a>
                  <button onClick={() => deleteMsg.mutate(m.id)} style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '7px 14px', background: 'rgba(248,113,113,0.08)', color: '#f87171', border: 'none', borderRadius: '8px', fontSize: '12px', cursor: 'pointer' }}>
                    <Trash2 style={{ width: '13px', height: '13px' }} /> Delete
                  </button>
                </div>
              </div>
            )}
          </div>
        ))}
        {messages?.length === 0 && <div style={{ textAlign: 'center', color: '#475569', padding: '48px', fontSize: '14px' }}>No messages yet.</div>}
      </div>
    </div>
  )
}
