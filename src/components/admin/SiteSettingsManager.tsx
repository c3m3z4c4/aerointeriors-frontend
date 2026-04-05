import { useState, useEffect } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useOrganization } from '../../hooks/useOrganization'
import api from '../../lib/api'
import { toast } from 'sonner'
import { Save, Globe, FileText, Phone, Bot, User } from 'lucide-react'

interface SiteSettings {
  id: string; orgId: string
  metaTitle?: string; metaDescription?: string; metaKeywords?: string
  heroTitle_en?: string; heroTitle_es?: string; heroSubtitle_en?: string; heroSubtitle_es?: string
  aboutText_en?: string; aboutText_es?: string; footerText?: string
  contactEmail?: string; contactPhone?: string; contactAddress?: string
  openaiApiKey?: string; anthropicApiKey?: string; geminiApiKey?: string
  defaultAiProvider?: string; defaultAiModel?: string
}

const inp: React.CSSProperties = { width: '100%', background: 'rgba(10,15,30,0.8)', border: '1px solid rgba(255,255,255,0.1)', color: 'white', borderRadius: '10px', padding: '10px 14px', fontSize: '13px', outline: 'none', boxSizing: 'border-box' }
const ta: React.CSSProperties = { ...inp, resize: 'vertical' as const }
const lbl: React.CSSProperties = { fontSize: '11px', color: '#64748b', display: 'block', marginBottom: '4px' }
const section: React.CSSProperties = { background: 'rgba(13,21,38,0.75)', border: '1px solid rgba(14,165,233,0.08)', borderRadius: '14px', padding: '20px', display: 'flex', flexDirection: 'column', gap: '14px' }
const sectionTitle: React.CSSProperties = { color: '#94a3b8', fontSize: '11px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '2px' }

type Tab = 'brand' | 'content' | 'contact' | 'ai'

const TABS: { id: Tab; label: string; icon: React.ReactNode }[] = [
  { id: 'brand', label: 'Brand & SEO', icon: <Globe style={{ width: '14px', height: '14px' }} /> },
  { id: 'content', label: 'Content', icon: <FileText style={{ width: '14px', height: '14px' }} /> },
  { id: 'contact', label: 'Contact', icon: <Phone style={{ width: '14px', height: '14px' }} /> },
  { id: 'ai', label: 'AI Config', icon: <Bot style={{ width: '14px', height: '14px' }} /> },
]

export default function SiteSettingsManager(): React.ReactElement {
  const { data: org } = useOrganization()
  const qc = useQueryClient()
  const [tab, setTab] = useState<Tab>('brand')
  const [form, setForm] = useState<Partial<SiteSettings>>({})
  const [dirty, setDirty] = useState(false)

  const { data: settings, isLoading } = useQuery<SiteSettings>({
    queryKey: ['site-settings-admin', org?.id],
    queryFn: async () => (await api.get(`/site-settings/admin?orgId=${org!.id}`)).data,
    enabled: !!org?.id,
  })

  useEffect(() => {
    if (settings) { setForm(settings); setDirty(false) }
  }, [settings])

  const f = (k: keyof SiteSettings, v: string) => { setForm(p => ({ ...p, [k]: v })); setDirty(true) }

  const save = useMutation({
    mutationFn: async () => (await api.put('/site-settings', { ...form, orgId: org?.id })).data,
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['site-settings-admin'] }); qc.invalidateQueries({ queryKey: ['site-settings'] }); toast.success('Settings saved'); setDirty(false) },
    onError: () => toast.error('Failed to save'),
  })

  if (isLoading) return <div style={{ color: '#475569', fontSize: '14px' }}>Loading…</div>

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px' }}>
        <h1 style={{ fontFamily: 'Orbitron, sans-serif', fontSize: '22px', fontWeight: 700, color: 'white', margin: 0 }}>Site Settings</h1>
        <button onClick={() => save.mutate()} disabled={!dirty || save.isPending} style={{ display: 'flex', alignItems: 'center', gap: '6px', background: dirty ? '#0ea5e9' : 'rgba(14,165,233,0.3)', color: 'white', border: 'none', padding: '8px 16px', borderRadius: '10px', fontSize: '13px', fontWeight: 600, cursor: dirty ? 'pointer' : 'default', transition: 'all 0.2s' }}>
          <Save style={{ width: '14px', height: '14px' }} />{save.isPending ? 'Saving…' : 'Save Changes'}
        </button>
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: '6px', marginBottom: '20px', background: 'rgba(10,15,30,0.5)', padding: '6px', borderRadius: '12px', width: 'fit-content' }}>
        {TABS.map(t => (
          <button key={t.id} onClick={() => setTab(t.id)} style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '8px 16px', borderRadius: '8px', border: 'none', fontSize: '13px', fontWeight: 500, cursor: 'pointer', background: tab === t.id ? 'rgba(14,165,233,0.2)' : 'transparent', color: tab === t.id ? '#0ea5e9' : '#64748b', transition: 'all 0.2s' }}>
            {t.icon}{t.label}
          </button>
        ))}
      </div>

      {tab === 'brand' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div style={section}>
            <div style={sectionTitle}>SEO Metadata</div>
            <div><label style={lbl}>Meta Title</label><input value={form.metaTitle || ''} onChange={e => f('metaTitle', e.target.value)} style={inp} placeholder="AeroInteriors Studio" /></div>
            <div><label style={lbl}>Meta Description</label><textarea value={form.metaDescription || ''} onChange={e => f('metaDescription', e.target.value)} rows={3} style={ta} placeholder="Aircraft interior design specialists…" /></div>
            <div><label style={lbl}>Meta Keywords</label><input value={form.metaKeywords || ''} onChange={e => f('metaKeywords', e.target.value)} style={inp} placeholder="aircraft interior, aviation design, FAA, EASA" /></div>
          </div>
          <div style={section}>
            <div style={sectionTitle}>Footer</div>
            <div><label style={lbl}>Footer Text</label><input value={form.footerText || ''} onChange={e => f('footerText', e.target.value)} style={inp} placeholder="© 2025 AeroInteriors Studio" /></div>
          </div>
        </div>
      )}

      {tab === 'content' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div style={section}>
            <div style={sectionTitle}>Hero Section</div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
              <div><label style={lbl}>Title (EN)</label><input value={form.heroTitle_en || ''} onChange={e => f('heroTitle_en', e.target.value)} style={inp} /></div>
              <div><label style={lbl}>Title (ES)</label><input value={form.heroTitle_es || ''} onChange={e => f('heroTitle_es', e.target.value)} style={inp} /></div>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
              <div><label style={lbl}>Subtitle (EN)</label><textarea value={form.heroSubtitle_en || ''} onChange={e => f('heroSubtitle_en', e.target.value)} rows={3} style={ta} /></div>
              <div><label style={lbl}>Subtitle (ES)</label><textarea value={form.heroSubtitle_es || ''} onChange={e => f('heroSubtitle_es', e.target.value)} rows={3} style={ta} /></div>
            </div>
          </div>
          <div style={section}>
            <div style={sectionTitle}>About / Overview Text</div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
              <div><label style={lbl}>About Text (EN)</label><textarea value={form.aboutText_en || ''} onChange={e => f('aboutText_en', e.target.value)} rows={5} style={ta} /></div>
              <div><label style={lbl}>About Text (ES)</label><textarea value={form.aboutText_es || ''} onChange={e => f('aboutText_es', e.target.value)} rows={5} style={ta} /></div>
            </div>
          </div>
        </div>
      )}

      {tab === 'contact' && (
        <div style={section}>
          <div style={sectionTitle}>Contact Information</div>
          <div><label style={lbl}>Email</label><input type="email" value={form.contactEmail || ''} onChange={e => f('contactEmail', e.target.value)} style={inp} placeholder="info@air-interiors.com" /></div>
          <div><label style={lbl}>Phone</label><input value={form.contactPhone || ''} onChange={e => f('contactPhone', e.target.value)} style={inp} placeholder="+1 (555) 000-0000" /></div>
          <div><label style={lbl}>Address</label><textarea value={form.contactAddress || ''} onChange={e => f('contactAddress', e.target.value)} rows={3} style={ta} placeholder="123 Aviation Blvd, Miami, FL" /></div>
        </div>
      )}

      {tab === 'ai' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div style={{ background: 'rgba(234,179,8,0.06)', border: '1px solid rgba(234,179,8,0.15)', borderRadius: '12px', padding: '12px 16px', display: 'flex', gap: '10px', alignItems: 'flex-start' }}>
            <Bot style={{ width: '16px', height: '16px', color: '#eab308', flexShrink: 0, marginTop: '1px' }} />
            <p style={{ color: '#fbbf24', fontSize: '12px', margin: 0, lineHeight: 1.5 }}>API keys are stored encrypted and never exposed publicly. At least one provider must be configured for the AI Assistant to work.</p>
          </div>
          <div style={section}>
            <div style={sectionTitle}>API Keys</div>
            <div>
              <label style={lbl}>OpenAI API Key</label>
              <input type="password" value={form.openaiApiKey || ''} onChange={e => f('openaiApiKey', e.target.value)} style={inp} placeholder="sk-…" autoComplete="new-password" />
            </div>
            <div>
              <label style={lbl}>Anthropic API Key</label>
              <input type="password" value={form.anthropicApiKey || ''} onChange={e => f('anthropicApiKey', e.target.value)} style={inp} placeholder="sk-ant-…" autoComplete="new-password" />
            </div>
            <div>
              <label style={lbl}>Google Gemini API Key</label>
              <input type="password" value={form.geminiApiKey || ''} onChange={e => f('geminiApiKey', e.target.value)} style={inp} placeholder="AIza…" autoComplete="new-password" />
            </div>
          </div>
          <div style={section}>
            <div style={sectionTitle}>Defaults</div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
              <div>
                <label style={lbl}>Default Provider</label>
                <select value={form.defaultAiProvider || 'anthropic'} onChange={e => f('defaultAiProvider', e.target.value)} style={inp}>
                  <option value="openai">OpenAI</option>
                  <option value="anthropic">Anthropic</option>
                  <option value="gemini">Gemini</option>
                </select>
              </div>
              <div><label style={lbl}>Default Model</label><input value={form.defaultAiModel || ''} onChange={e => f('defaultAiModel', e.target.value)} style={inp} placeholder="claude-sonnet-4-6" /></div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
