import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { toast } from 'sonner'
import { useServices } from '../../hooks/useServices'
import { useSocialLinks } from '../../hooks/useSocialLinks'
import { useSiteSettings } from '../../hooks/useSiteSettings'
import { useOrganization } from '../../hooks/useOrganization'
import { useLanguageStore, useTranslation } from '../../stores/languageStore'
import api from '../../lib/api'
import { Phone, Mail, MapPin, Send, Globe } from 'lucide-react'

const schema = z.object({
  name: z.string().min(1), company: z.string().optional(),
  email: z.string().email(), phone: z.string().optional(),
  aircraftModel: z.string().optional(), serviceType: z.string().optional(),
  message: z.string().min(1),
})
type FormData = z.infer<typeof schema>

const inputStyle: React.CSSProperties = { width: '100%', background: 'rgba(10,15,30,0.8)', border: '1px solid rgba(255,255,255,0.1)', color: 'white', borderRadius: '12px', padding: '12px 16px', fontSize: '14px', outline: 'none', transition: 'border-color 0.2s', boxSizing: 'border-box' }

export default function ContactSection(): React.ReactElement {
  const { data: services } = useServices()
  const { data: socialLinks } = useSocialLinks()
  const { data: settings } = useSiteSettings()
  const { data: org } = useOrganization()
  const { lang } = useLanguageStore()
  const t = useTranslation()
  const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm<FormData>({ resolver: zodResolver(schema) })

  const onSubmit = async (data: FormData) => {
    try {
      await api.post('/contact', { ...data, orgId: org?.id })
      toast.success(t.contact.successTitle, { description: t.contact.successMsg })
      reset()
    } catch { toast.error(t.contact.errorMsg) }
  }

  const title = settings ? (lang === 'en' ? settings.contactSectionTitle_en : settings.contactSectionTitle_es) : 'Contact Us'

  const focusHandler = (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => { e.target.style.borderColor = '#0ea5e9' }
  const blurHandler  = (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => { e.target.style.borderColor = 'rgba(255,255,255,0.1)' }

  return (
    <section id="contact" className="section-padding" style={{ background: 'rgba(13,21,38,0.3)' }}>
      <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: '48px' }}>
          <span style={{ color: '#0ea5e9', fontSize: '12px', fontWeight: 600, letterSpacing: '0.15em', textTransform: 'uppercase' }}>{t.contact.sectionLabel}</span>
          <h2 style={{ fontFamily: 'Orbitron, sans-serif', fontSize: 'clamp(1.8rem,4vw,2.8rem)', fontWeight: 700, color: 'white', marginTop: '8px', marginBottom: '16px' }}>{title}</h2>
          <div style={{ width: '56px', height: '3px', background: '#0ea5e9', margin: '0 auto', borderRadius: '2px' }} />
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(min(100%, 300px), 1fr))', gap: '32px' }}>
          {/* Info */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div style={{ background: 'rgba(13,21,38,0.75)', backdropFilter: 'blur(12px)', border: '1px solid rgba(14,165,233,0.1)', borderRadius: '16px', padding: '24px' }}>
              <h3 style={{ fontFamily: 'Orbitron, sans-serif', fontSize: '14px', fontWeight: 600, color: 'white', marginBottom: '16px', marginTop: 0 }}>Contact Info</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {settings?.phone && <a href={`tel:${settings.phone}`} style={{ display: 'flex', alignItems: 'flex-start', gap: '10px', color: '#94a3b8', textDecoration: 'none', fontSize: '14px', transition: 'color 0.2s' }} onMouseEnter={e => ((e.currentTarget as HTMLElement).style.color = '#0ea5e9')} onMouseLeave={e => ((e.currentTarget as HTMLElement).style.color = '#94a3b8')}><Phone style={{ width: '16px', height: '16px', color: '#0ea5e9', flexShrink: 0, marginTop: '2px' }} />{settings.phone}</a>}
                {settings?.email && <a href={`mailto:${settings.email}`} style={{ display: 'flex', alignItems: 'flex-start', gap: '10px', color: '#94a3b8', textDecoration: 'none', fontSize: '14px', transition: 'color 0.2s' }} onMouseEnter={e => ((e.currentTarget as HTMLElement).style.color = '#0ea5e9')} onMouseLeave={e => ((e.currentTarget as HTMLElement).style.color = '#94a3b8')}><Mail style={{ width: '16px', height: '16px', color: '#0ea5e9', flexShrink: 0, marginTop: '2px' }} />{settings.email}</a>}
                {settings?.address && <div style={{ display: 'flex', alignItems: 'flex-start', gap: '10px', color: '#94a3b8', fontSize: '14px' }}><MapPin style={{ width: '16px', height: '16px', color: '#0ea5e9', flexShrink: 0, marginTop: '2px' }} />{settings.address}</div>}
              </div>
            </div>
            {socialLinks && socialLinks.length > 0 && (
              <div style={{ background: 'rgba(13,21,38,0.75)', backdropFilter: 'blur(12px)', border: '1px solid rgba(14,165,233,0.1)', borderRadius: '16px', padding: '24px' }}>
                <h3 style={{ fontFamily: 'Orbitron, sans-serif', fontSize: '14px', fontWeight: 600, color: 'white', marginBottom: '16px', marginTop: 0 }}>Follow Us</h3>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px' }}>
                  {socialLinks.map(link => { const Icon = Globe; return <a key={link.id} href={link.url} target="_blank" rel="noopener noreferrer" style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#64748b', fontSize: '13px', textDecoration: 'none', transition: 'color 0.2s' }} onMouseEnter={e => ((e.currentTarget as HTMLElement).style.color = '#0ea5e9')} onMouseLeave={e => ((e.currentTarget as HTMLElement).style.color = '#64748b')}><Icon style={{ width: '16px', height: '16px' }} />{link.platform}</a> })}
                </div>
              </div>
            )}
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit(onSubmit)} style={{ background: 'rgba(13,21,38,0.75)', backdropFilter: 'blur(12px)', border: '1px solid rgba(14,165,233,0.1)', borderRadius: '16px', padding: '28px', display: 'flex', flexDirection: 'column', gap: '14px' }} noValidate>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
              <div><input {...register('name')} placeholder={t.contact.namePlaceholder} style={inputStyle} onFocus={focusHandler} onBlur={blurHandler} />{errors.name && <p style={{ color: '#f87171', fontSize: '11px', marginTop: '4px' }}>{t.contact.required}</p>}</div>
              <input {...register('company')} placeholder={t.contact.companyPlaceholder} style={inputStyle} onFocus={focusHandler} onBlur={blurHandler} />
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
              <div><input {...register('email')} type="email" placeholder={t.contact.emailPlaceholder} style={inputStyle} onFocus={focusHandler} onBlur={blurHandler} />{errors.email && <p style={{ color: '#f87171', fontSize: '11px', marginTop: '4px' }}>{t.contact.invalidEmail}</p>}</div>
              <input {...register('phone')} type="tel" placeholder={t.contact.phonePlaceholder} style={inputStyle} onFocus={focusHandler} onBlur={blurHandler} />
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
              <input {...register('aircraftModel')} placeholder={t.contact.aircraftPlaceholder} style={inputStyle} onFocus={focusHandler} onBlur={blurHandler} />
              <select {...register('serviceType')} style={{ ...inputStyle }} onFocus={focusHandler} onBlur={blurHandler}>
                <option value="">{t.contact.selectService}</option>
                {services?.filter(s => s.visible).map(s => <option key={s.id} value={s.id}>{lang === 'en' ? s.title_en : s.title_es}</option>)}
              </select>
            </div>
            <div><textarea {...register('message')} rows={4} placeholder={t.contact.messagePlaceholder} style={{ ...inputStyle, resize: 'none' }} onFocus={focusHandler} onBlur={blurHandler} />{errors.message && <p style={{ color: '#f87171', fontSize: '11px', marginTop: '4px' }}>{t.contact.required}</p>}</div>
            <button type="submit" disabled={isSubmitting} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', background: '#0ea5e9', color: 'white', fontWeight: 600, fontSize: '15px', padding: '14px', borderRadius: '12px', border: 'none', cursor: isSubmitting ? 'not-allowed' : 'pointer', opacity: isSubmitting ? 0.6 : 1, transition: 'all 0.2s' }} onMouseEnter={e => !isSubmitting && ((e.currentTarget as HTMLElement).style.background = '#0284c7')} onMouseLeave={e => ((e.currentTarget as HTMLElement).style.background = '#0ea5e9')}>
              <Send style={{ width: '16px', height: '16px' }} />
              {isSubmitting ? t.contact.sending : t.contact.submit}
            </button>
          </form>
        </div>
      </div>
    </section>
  )
}
