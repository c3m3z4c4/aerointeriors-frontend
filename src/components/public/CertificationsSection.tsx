import { useState } from 'react'
import { useCertifications } from '../../hooks/useCertifications'
import { useLanguageStore, useTranslation } from '../../stores/languageStore'
import { useSiteSettings } from '../../hooks/useSiteSettings'
import { Award, ExternalLink, ChevronDown, ChevronUp } from 'lucide-react'
import { formatDate } from '../../lib/utils'

export default function CertificationsSection(): React.ReactElement {
  const [showAll, setShowAll] = useState(false)
  const { data: certs } = useCertifications()
  const { data: settings } = useSiteSettings()
  const { lang } = useLanguageStore()
  const t = useTranslation()
  const visible = certs?.filter(c => c.visible) ?? []
  const displayed = showAll ? visible : visible.slice(0, 4)
  const title = settings ? (lang === 'en' ? settings.certSectionTitle_en : settings.certSectionTitle_es) : 'Certifications'

  return (
    <section id="certifications" className="section-padding" style={{ background: 'rgba(13,21,38,0.3)' }}>
      <div style={{ maxWidth: '960px', margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: '48px' }}>
          <span style={{ color: '#0ea5e9', fontSize: '12px', fontWeight: 600, letterSpacing: '0.15em', textTransform: 'uppercase' }}>{t.certifications.sectionLabel}</span>
          <h2 style={{ fontFamily: 'Orbitron, sans-serif', fontSize: 'clamp(1.8rem,4vw,2.8rem)', fontWeight: 700, color: 'white', marginTop: '8px', marginBottom: '16px' }}>{title}</h2>
          <div style={{ width: '56px', height: '3px', background: '#0ea5e9', margin: '0 auto', borderRadius: '2px' }} />
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '16px' }}>
          {displayed.map((cert, i) => (
            <div key={cert.id} className="animate-fade-up" style={{ background: 'rgba(13,21,38,0.75)', backdropFilter: 'blur(12px)', border: '1px solid rgba(14,165,233,0.1)', borderRadius: '16px', padding: '20px', display: 'flex', gap: '16px', animationDelay: `${i * 0.07}s`, animationFillMode: 'forwards', transition: 'border-color 0.2s' }}
              onMouseEnter={e => ((e.currentTarget as HTMLElement).style.borderColor = 'rgba(14,165,233,0.3)')}
              onMouseLeave={e => ((e.currentTarget as HTMLElement).style.borderColor = 'rgba(14,165,233,0.1)')}>
              <div style={{ width: '44px', height: '44px', borderRadius: '10px', background: 'rgba(14,165,233,0.12)', border: '1px solid rgba(14,165,233,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <Award style={{ width: '22px', height: '22px', color: '#0ea5e9' }} />
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <h3 style={{ fontWeight: 600, color: 'white', fontSize: '14px', marginBottom: '4px', marginTop: 0 }}>{lang === 'en' ? cert.title_en : cert.title_es}</h3>
                <p style={{ color: '#64748b', fontSize: '12px', marginBottom: '4px' }}>{cert.issuer}</p>
                <p style={{ color: '#475569', fontSize: '11px' }}>{t.certifications.issued}: {formatDate(cert.issueDate)}</p>
                {cert.credUrl && (
                  <a href={cert.credUrl} target="_blank" rel="noopener noreferrer" style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', color: '#0ea5e9', fontSize: '12px', marginTop: '8px', textDecoration: 'none' }}>
                    {t.certifications.viewCredential} <ExternalLink style={{ width: '11px', height: '11px' }} />
                  </a>
                )}
              </div>
            </div>
          ))}
        </div>
        {visible.length > 4 && (
          <div style={{ textAlign: 'center', marginTop: '32px' }}>
            <button onClick={() => setShowAll(!showAll)} style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', color: '#0ea5e9', background: 'none', border: 'none', cursor: 'pointer', fontSize: '14px', fontWeight: 500 }}>
              {showAll ? t.certifications.showLess : t.certifications.showMore}
              {showAll ? <ChevronUp style={{ width: '16px', height: '16px' }} /> : <ChevronDown style={{ width: '16px', height: '16px' }} />}
            </button>
          </div>
        )}
      </div>
    </section>
  )
}
