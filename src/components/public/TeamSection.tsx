import { useTeam, type TeamMember } from '../../hooks/useTeam'
import { useLanguageStore, useTranslation } from '../../stores/languageStore'
import { useSiteSettings } from '../../hooks/useSiteSettings'
import { useInView } from 'react-intersection-observer'
import { Linkedin, User } from 'lucide-react'
import { getImageUrl } from '../../lib/api'

function MemberCard({ member, lang, index }: { member: TeamMember; lang: string; index: number }): React.ReactElement {
  const { ref, inView } = useInView({ threshold: 0.1, triggerOnce: true })
  const t = useTranslation()
  return (
    <div ref={ref} className="animate-fade-up"
      style={{ background: 'rgba(13,21,38,0.75)', backdropFilter: 'blur(12px)', border: '1px solid rgba(14,165,233,0.1)', borderRadius: '20px', padding: '28px', textAlign: 'center', opacity: inView ? 1 : 0, animationDelay: `${index * 0.1}s`, animationFillMode: 'forwards', transition: 'all 0.3s' }}
      onMouseEnter={e => { (e.currentTarget as HTMLElement).style.borderColor = 'rgba(14,165,233,0.3)'; (e.currentTarget as HTMLElement).style.transform = 'translateY(-4px)' }}
      onMouseLeave={e => { (e.currentTarget as HTMLElement).style.borderColor = 'rgba(14,165,233,0.1)'; (e.currentTarget as HTMLElement).style.transform = 'translateY(0)' }}>
      <div style={{ width: '80px', height: '80px', borderRadius: '16px', overflow: 'hidden', background: '#111b33', margin: '0 auto 16px', border: '2px solid rgba(14,165,233,0.15)' }}>
        {member.photo ? (
          <img src={getImageUrl(member.photo)} alt={member.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
        ) : (
          <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <User style={{ width: '32px', height: '32px', color: '#475569' }} />
          </div>
        )}
      </div>
      <h3 style={{ fontFamily: 'Orbitron, sans-serif', fontSize: '14px', fontWeight: 600, color: 'white', marginBottom: '4px', marginTop: 0 }}>{member.name}</h3>
      <p style={{ color: '#0ea5e9', fontSize: '13px', marginBottom: '12px' }}>{lang === 'en' ? member.role_en : member.role_es}</p>
      <p style={{ color: '#94a3b8', fontSize: '12px', lineHeight: 1.6, marginBottom: '16px' }}>{lang === 'en' ? member.bio_en : member.bio_es}</p>
      {member.linkedIn && (
        <a href={member.linkedIn} target="_blank" rel="noopener noreferrer"
          style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', color: '#64748b', fontSize: '12px', textDecoration: 'none', transition: 'color 0.2s' }}
          onMouseEnter={e => ((e.target as HTMLElement).style.color = '#0ea5e9')}
          onMouseLeave={e => ((e.target as HTMLElement).style.color = '#64748b')}
          aria-label={t.team.viewLinkedIn}>
          <Linkedin style={{ width: '14px', height: '14px' }} /> LinkedIn
        </a>
      )}
    </div>
  )
}

export default function TeamSection(): React.ReactElement {
  const { data: team } = useTeam()
  const { data: settings } = useSiteSettings()
  const { lang } = useLanguageStore()
  const t = useTranslation()
  const visible = team?.filter(m => m.visible) ?? []
  const title = settings ? (lang === 'en' ? settings.teamSectionTitle_en : settings.teamSectionTitle_es) : 'Our Team'

  return (
    <section id="team" className="section-padding">
      <div style={{ maxWidth: '1280px', margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: '48px' }}>
          <span style={{ color: '#0ea5e9', fontSize: '12px', fontWeight: 600, letterSpacing: '0.15em', textTransform: 'uppercase' }}>{t.team.sectionLabel}</span>
          <h2 style={{ fontFamily: 'Orbitron, sans-serif', fontSize: 'clamp(1.8rem,4vw,2.8rem)', fontWeight: 700, color: 'white', marginTop: '8px', marginBottom: '16px' }}>{title}</h2>
          <div style={{ width: '56px', height: '3px', background: '#0ea5e9', margin: '0 auto', borderRadius: '2px' }} />
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: '20px' }}>
          {visible.map((m, i) => <MemberCard key={m.id} member={m} lang={lang} index={i} />)}
        </div>
      </div>
    </section>
  )
}
