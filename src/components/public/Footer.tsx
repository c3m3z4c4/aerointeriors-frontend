import { Plane, Linkedin, Instagram, Facebook, Youtube, Globe } from 'lucide-react'
import { useSiteSettings } from '../../hooks/useSiteSettings'
import { useSocialLinks } from '../../hooks/useSocialLinks'
import { useLanguageStore, useTranslation } from '../../stores/languageStore'

const socialIcons: Record<string, React.ComponentType<{ style?: React.CSSProperties }>> = {
  LinkedIn: Linkedin, Instagram, Facebook, YouTube: Youtube,
}

export default function Footer(): React.ReactElement {
  const { data: settings } = useSiteSettings()
  const { data: socialLinks } = useSocialLinks()
  const { lang } = useLanguageStore()
  const t = useTranslation()
  const year = new Date().getFullYear()
  const footerText = settings ? (lang === 'en' ? settings.footerText_en : settings.footerText_es) : ''

  return (
    <footer style={{ background: '#070c18', borderTop: '1px solid rgba(255,255,255,0.05)' }}>
      <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '60px 24px 32px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '40px', marginBottom: '48px' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '12px' }}>
              <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: 'rgba(14,165,233,0.15)', border: '1px solid rgba(14,165,233,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Plane style={{ width: '18px', height: '18px', color: '#0ea5e9' }} />
              </div>
              <span style={{ fontFamily: 'Orbitron, sans-serif', color: 'white', fontWeight: 700, fontSize: '12px', letterSpacing: '0.1em' }}>
                <span style={{ color: '#0ea5e9' }}>AIRCRAFT</span> INTERIORS
              </span>
            </div>
            <p style={{ color: '#64748b', fontSize: '13px', lineHeight: 1.6 }}>{footerText}</p>
          </div>

          <div>
            <h4 style={{ fontFamily: 'Orbitron, sans-serif', fontWeight: 600, color: 'white', fontSize: '12px', marginBottom: '16px', marginTop: 0, letterSpacing: '0.05em' }}>{t.footer.quickLinks}</h4>
            {['#services', '#projects', '#certifications', '#team', '#contact'].map(href => (
              <a key={href} href={href} style={{ display: 'block', color: '#64748b', textDecoration: 'none', fontSize: '13px', marginBottom: '8px', transition: 'color 0.2s', textTransform: 'capitalize' }}
                onMouseEnter={e => ((e.target as HTMLElement).style.color = '#0ea5e9')}
                onMouseLeave={e => ((e.target as HTMLElement).style.color = '#64748b')}>
                {href.replace('#', '')}
              </a>
            ))}
          </div>

          <div>
            <h4 style={{ fontFamily: 'Orbitron, sans-serif', fontWeight: 600, color: 'white', fontSize: '12px', marginBottom: '16px', marginTop: 0, letterSpacing: '0.05em' }}>{t.footer.followUs}</h4>
            {socialLinks?.map(link => { const Icon = socialIcons[link.platform] || Globe; return (
              <a key={link.id} href={link.url} target="_blank" rel="noopener noreferrer"
                style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#64748b', textDecoration: 'none', fontSize: '13px', marginBottom: '10px', transition: 'color 0.2s' }}
                onMouseEnter={e => ((e.currentTarget as HTMLElement).style.color = '#0ea5e9')}
                onMouseLeave={e => ((e.currentTarget as HTMLElement).style.color = '#64748b')}>
                <Icon style={{ width: '15px', height: '15px' }} />{link.platform}
              </a>
            )})}
          </div>
        </div>

        <div style={{ borderTop: '1px solid rgba(255,255,255,0.05)', paddingTop: '24px', textAlign: 'center' }}>
          <p style={{ color: '#334155', fontSize: '12px' }}>
            © {year} {settings?.companyName || 'Aircraft Interiors Solutions'}. {t.footer.allRights}
          </p>
        </div>
      </div>
    </footer>
  )
}
