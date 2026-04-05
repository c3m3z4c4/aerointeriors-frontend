import { useState, useRef, useEffect } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import api from '../../lib/api'
import { toast } from 'sonner'
import { Send, Plus, Trash2, Bot, User, ChevronDown } from 'lucide-react'

interface Message { id: string; role: 'user' | 'assistant'; content: string; createdAt: string }
interface Conversation { id: string; title: string; provider: string; model: string; createdAt: string; messages?: Message[] }
interface AIStatus { providers: { openai: boolean; anthropic: boolean; gemini: boolean } }

const inp: React.CSSProperties = { width: '100%', background: 'rgba(10,15,30,0.8)', border: '1px solid rgba(255,255,255,0.1)', color: 'white', borderRadius: '10px', padding: '10px 14px', fontSize: '13px', outline: 'none', boxSizing: 'border-box' }
const lbl: React.CSSProperties = { fontSize: '11px', color: '#64748b', display: 'block', marginBottom: '4px' }

const PROVIDERS = [
  { value: 'openai', label: 'OpenAI', models: ['gpt-4o', 'gpt-4o-mini', 'gpt-4-turbo', 'gpt-3.5-turbo'] },
  { value: 'anthropic', label: 'Anthropic', models: ['claude-opus-4-6', 'claude-sonnet-4-6', 'claude-haiku-4-5-20251001'] },
  { value: 'gemini', label: 'Gemini', models: ['gemini-2.0-flash', 'gemini-1.5-pro', 'gemini-1.5-flash'] },
]

export default function AIAssistant(): React.ReactElement {
  const qc = useQueryClient()
  const [activeConv, setActiveConv] = useState<string | null>(null)
  const [input, setInput] = useState('')
  const [provider, setProvider] = useState('anthropic')
  const [model, setModel] = useState('claude-sonnet-4-6')
  const [showNew, setShowNew] = useState(false)
  const [newTitle, setNewTitle] = useState('')
  const [systemPrompt, setSystemPrompt] = useState('You are an expert assistant for AeroInteriors Studio, an aircraft interior design company.')
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const { data: status } = useQuery<AIStatus>({
    queryKey: ['ai-status'],
    queryFn: async () => (await api.get('/ai/status')).data,
  })

  const { data: conversations } = useQuery<Conversation[]>({
    queryKey: ['ai-conversations'],
    queryFn: async () => (await api.get('/ai/conversations')).data,
  })

  const { data: activeData } = useQuery<Conversation>({
    queryKey: ['ai-conversation', activeConv],
    queryFn: async () => (await api.get(`/ai/conversations/${activeConv}`)).data,
    enabled: !!activeConv,
  })

  const createConv = useMutation({
    mutationFn: async () => (await api.post('/ai/conversations', { title: newTitle || 'New Conversation', provider, model, systemPrompt })).data,
    onSuccess: (data) => { qc.invalidateQueries({ queryKey: ['ai-conversations'] }); setActiveConv(data.id); setShowNew(false); setNewTitle('') },
    onError: () => toast.error('Failed to create conversation'),
  })

  const sendMessage = useMutation({
    mutationFn: async (content: string) => (await api.post(`/ai/conversations/${activeConv}/messages`, { content })).data,
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['ai-conversation', activeConv] }); setInput('') },
    onError: () => toast.error('Failed to send message'),
  })

  const deleteConv = useMutation({
    mutationFn: async (id: string) => { await api.delete(`/ai/conversations/${id}`) },
    onSuccess: (_, id) => {
      qc.invalidateQueries({ queryKey: ['ai-conversations'] })
      if (activeConv === id) setActiveConv(null)
    },
  })

  useEffect(() => { messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' }) }, [activeData?.messages])

  const selectedProvider = PROVIDERS.find(p => p.value === provider)

  const handleSend = () => {
    if (!input.trim() || !activeConv || sendMessage.isPending) return
    sendMessage.mutate(input.trim())
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSend() }
  }

  return (
    <div style={{ display: 'flex', gap: '16px', height: 'calc(100vh - 120px)', minHeight: '500px' }}>
      {/* Sidebar */}
      <div style={{ width: '240px', flexShrink: 0, display: 'flex', flexDirection: 'column', gap: '10px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <h1 style={{ fontFamily: 'Orbitron, sans-serif', fontSize: '18px', fontWeight: 700, color: 'white', margin: 0 }}>AI Chat</h1>
          <button onClick={() => setShowNew(true)} style={{ width: '30px', height: '30px', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#0ea5e9', border: 'none', borderRadius: '8px', color: 'white', cursor: 'pointer' }}><Plus style={{ width: '15px', height: '15px' }} /></button>
        </div>

        {/* Provider status */}
        <div style={{ background: 'rgba(13,21,38,0.75)', border: '1px solid rgba(14,165,233,0.1)', borderRadius: '12px', padding: '12px' }}>
          <div style={{ fontSize: '10px', color: '#475569', marginBottom: '8px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Providers</div>
          {PROVIDERS.map(p => (
            <div key={p.value} style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '4px' }}>
              <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: status?.providers[p.value as keyof typeof status.providers] ? '#4ade80' : '#ef4444' }} />
              <span style={{ color: '#94a3b8', fontSize: '12px' }}>{p.label}</span>
            </div>
          ))}
        </div>

        {/* Conversations */}
        <div style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '6px' }}>
          {conversations?.map(c => (
            <div key={c.id} onClick={() => setActiveConv(c.id)} style={{ padding: '10px 12px', borderRadius: '10px', cursor: 'pointer', background: activeConv === c.id ? 'rgba(14,165,233,0.15)' : 'rgba(13,21,38,0.75)', border: `1px solid ${activeConv === c.id ? 'rgba(14,165,233,0.3)' : 'rgba(14,165,233,0.08)'}`, display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Bot style={{ width: '14px', height: '14px', color: '#0ea5e9', flexShrink: 0 }} />
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ color: 'white', fontSize: '12px', fontWeight: 500, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{c.title}</div>
                <div style={{ color: '#475569', fontSize: '10px' }}>{c.provider} · {c.model.split('-').slice(0, 2).join('-')}</div>
              </div>
              <button onClick={e => { e.stopPropagation(); deleteConv.mutate(c.id) }} style={{ width: '22px', height: '22px', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'none', border: 'none', color: '#475569', cursor: 'pointer', borderRadius: '4px', flexShrink: 0 }}><Trash2 style={{ width: '11px', height: '11px' }} /></button>
            </div>
          ))}
          {(!conversations || conversations.length === 0) && (
            <div style={{ color: '#475569', fontSize: '12px', textAlign: 'center', padding: '24px 0' }}>No conversations yet</div>
          )}
        </div>
      </div>

      {/* Chat area */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', background: 'rgba(13,21,38,0.75)', border: '1px solid rgba(14,165,233,0.1)', borderRadius: '16px', overflow: 'hidden' }}>
        {activeConv && activeData ? (
          <>
            <div style={{ padding: '14px 20px', borderBottom: '1px solid rgba(255,255,255,0.05)', display: 'flex', alignItems: 'center', gap: '10px' }}>
              <Bot style={{ width: '18px', height: '18px', color: '#0ea5e9' }} />
              <span style={{ color: 'white', fontWeight: 500, fontSize: '14px' }}>{activeData.title}</span>
              <span style={{ color: '#475569', fontSize: '12px', marginLeft: 'auto' }}>{activeData.provider} · {activeData.model}</span>
            </div>
            <div style={{ flex: 1, overflowY: 'auto', padding: '20px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {activeData.messages?.map(m => (
                <div key={m.id} style={{ display: 'flex', gap: '10px', flexDirection: m.role === 'user' ? 'row-reverse' : 'row' }}>
                  <div style={{ width: '30px', height: '30px', borderRadius: '8px', background: m.role === 'user' ? 'rgba(14,165,233,0.2)' : 'rgba(100,116,139,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    {m.role === 'user' ? <User style={{ width: '14px', height: '14px', color: '#0ea5e9' }} /> : <Bot style={{ width: '14px', height: '14px', color: '#64748b' }} />}
                  </div>
                  <div style={{ maxWidth: '70%', padding: '10px 14px', borderRadius: m.role === 'user' ? '14px 4px 14px 14px' : '4px 14px 14px 14px', background: m.role === 'user' ? 'rgba(14,165,233,0.15)' : 'rgba(30,41,59,0.8)', border: `1px solid ${m.role === 'user' ? 'rgba(14,165,233,0.2)' : 'rgba(255,255,255,0.05)'}` }}>
                    <p style={{ color: '#e2e8f0', fontSize: '13px', lineHeight: 1.6, margin: 0, whiteSpace: 'pre-wrap' }}>{m.content}</p>
                  </div>
                </div>
              ))}
              {sendMessage.isPending && (
                <div style={{ display: 'flex', gap: '10px' }}>
                  <div style={{ width: '30px', height: '30px', borderRadius: '8px', background: 'rgba(100,116,139,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Bot style={{ width: '14px', height: '14px', color: '#64748b' }} /></div>
                  <div style={{ padding: '10px 14px', borderRadius: '4px 14px 14px 14px', background: 'rgba(30,41,59,0.8)', border: '1px solid rgba(255,255,255,0.05)' }}>
                    <div style={{ display: 'flex', gap: '4px', alignItems: 'center' }}>
                      {[0,1,2].map(i => <div key={i} style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#475569', animation: `pulse 1.4s ease-in-out ${i * 0.2}s infinite` }} />)}
                    </div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>
            <div style={{ padding: '14px 20px', borderTop: '1px solid rgba(255,255,255,0.05)', display: 'flex', gap: '10px', alignItems: 'flex-end' }}>
              <textarea value={input} onChange={e => setInput(e.target.value)} onKeyDown={handleKeyDown} placeholder="Type a message… (Enter to send)" rows={2} style={{ flex: 1, background: 'rgba(10,15,30,0.8)', border: '1px solid rgba(255,255,255,0.1)', color: 'white', borderRadius: '10px', padding: '10px 14px', fontSize: '13px', outline: 'none', resize: 'none', fontFamily: 'inherit' }} />
              <button onClick={handleSend} disabled={!input.trim() || sendMessage.isPending} style={{ width: '40px', height: '40px', display: 'flex', alignItems: 'center', justifyContent: 'center', background: input.trim() ? '#0ea5e9' : 'rgba(14,165,233,0.2)', border: 'none', borderRadius: '10px', color: 'white', cursor: input.trim() ? 'pointer' : 'default', flexShrink: 0 }}>
                <Send style={{ width: '16px', height: '16px' }} />
              </button>
            </div>
          </>
        ) : (
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '16px' }}>
            <div style={{ width: '64px', height: '64px', borderRadius: '16px', background: 'rgba(14,165,233,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Bot style={{ width: '28px', height: '28px', color: '#0ea5e9' }} /></div>
            <p style={{ color: '#475569', fontSize: '14px', textAlign: 'center' }}>Select a conversation or create a new one</p>
            <button onClick={() => setShowNew(true)} style={{ display: 'flex', alignItems: 'center', gap: '6px', background: '#0ea5e9', color: 'white', border: 'none', padding: '10px 20px', borderRadius: '10px', fontSize: '13px', fontWeight: 600, cursor: 'pointer' }}><Plus style={{ width: '15px', height: '15px' }} /> New Conversation</button>
          </div>
        )}
      </div>

      {/* New Conversation Modal */}
      {showNew && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '16px', background: 'rgba(0,0,0,0.75)', backdropFilter: 'blur(6px)' }} onClick={() => setShowNew(false)}>
          <div style={{ background: 'rgba(13,21,38,0.98)', border: '1px solid rgba(14,165,233,0.2)', borderRadius: '20px', width: '100%', maxWidth: '480px' }} onClick={e => e.stopPropagation()}>
            <div style={{ padding: '20px 24px', borderBottom: '1px solid rgba(255,255,255,0.05)', display: 'flex', justifyContent: 'space-between' }}>
              <h2 style={{ fontFamily: 'Orbitron, sans-serif', fontSize: '16px', color: 'white', margin: 0 }}>New Conversation</h2>
              <button onClick={() => setShowNew(false)} style={{ background: 'none', border: 'none', color: '#64748b', cursor: 'pointer', fontSize: '20px' }}>✕</button>
            </div>
            <div style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div><label style={lbl}>Title</label><input value={newTitle} onChange={e => setNewTitle(e.target.value)} placeholder="New Conversation" style={inp} /></div>
              <div>
                <label style={lbl}>Provider</label>
                <div style={{ position: 'relative' }}>
                  <select value={provider} onChange={e => { setProvider(e.target.value); setModel(PROVIDERS.find(p => p.value === e.target.value)?.models[0] || '') }} style={{ ...inp, appearance: 'none', paddingRight: '32px' }}>
                    {PROVIDERS.map(p => <option key={p.value} value={p.value} disabled={!status?.providers[p.value as keyof typeof status.providers]}>{p.label}{!status?.providers[p.value as keyof typeof status.providers] ? ' (not configured)' : ''}</option>)}
                  </select>
                  <ChevronDown style={{ position: 'absolute', right: '10px', top: '50%', transform: 'translateY(-50%)', width: '14px', height: '14px', color: '#64748b', pointerEvents: 'none' }} />
                </div>
              </div>
              <div>
                <label style={lbl}>Model</label>
                <div style={{ position: 'relative' }}>
                  <select value={model} onChange={e => setModel(e.target.value)} style={{ ...inp, appearance: 'none', paddingRight: '32px' }}>
                    {selectedProvider?.models.map(m => <option key={m} value={m}>{m}</option>)}
                  </select>
                  <ChevronDown style={{ position: 'absolute', right: '10px', top: '50%', transform: 'translateY(-50%)', width: '14px', height: '14px', color: '#64748b', pointerEvents: 'none' }} />
                </div>
              </div>
              <div><label style={lbl}>System Prompt</label><textarea value={systemPrompt} onChange={e => setSystemPrompt(e.target.value)} rows={3} style={{ ...inp, resize: 'none' as const }} /></div>
              <div style={{ display: 'flex', gap: '10px' }}>
                <button onClick={() => createConv.mutate()} disabled={createConv.isPending} style={{ flex: 1, background: '#0ea5e9', color: 'white', border: 'none', padding: '12px', borderRadius: '10px', fontWeight: 600, cursor: 'pointer' }}>Create</button>
                <button onClick={() => setShowNew(false)} style={{ padding: '12px 20px', background: 'rgba(255,255,255,0.05)', color: '#94a3b8', border: 'none', borderRadius: '10px', cursor: 'pointer' }}>Cancel</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
