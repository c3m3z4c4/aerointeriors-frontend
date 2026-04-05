import { useServices } from '../../hooks/useServices'
import { useLanguageStore, useTranslation } from '../../stores/languageStore'
import { useSiteSettings } from '../../hooks/useSiteSettings'
import { useInView } from 'react-intersection-observer'
import { Crown, Wrench, Layers, Scissors, Armchair, Lightbulb, Shield, ClipboardCheck, Settings, Hammer, Monitor, ChefHat } from 'lucide-react'

const iconMap: Record<string, React.ComponentType<{ style?: React.CSSProperties }>> = {
  Crown, Wrench, Layers, Scissors, Armchair, Lightbulb, Shield, ClipboardCheck, Settings, Hammer, Monitor, ChefHat,
}

interface CardProps { icon: string; title: string; description: string; index: number }

function ServiceCard({ icon, title, description, index }: CardProps): React.ReactElement {
  const { ref, inView } = useInView({ threshold: 0.1, triggerOnce: true })
  const Icon = iconMap[icon] || Settings
  return (
    <div ref={ref} className="animate-fade-up" style={{
      background: 'rgba(13,21,38,0.75)', backdropFilter: 'blur(12px)', border: '1px solid rgba(14,165,233,0.1)',
      borderRadius: '16px', padding: '24px', transition: 'all 0.3s', cursor: 'default',
      opacity: inView ? 1 : 0, animationDelay: `${index * 0.07}s`, animationFillMode: 'forwards',
    }}
      onMouseEnter={e => { (e.currentTarget as HTMLElement).style.borderColor = 'rgba(14,165,233,0.3)'; (e.currentTarget as HTMLElement).style.transform = 'translateY(-4px)' }}
      onMouseLeave={e => { (e.currentTarget as HTMLElement).style.borderColor = 'rgba(14,165,233,0.1)'; (e.currentTarget as HTMLElement).style.transform = 'translateY(0)' }}>
      <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: 'rgba(14,165,233,0.12)', border: '1px solid rgba(14,165,233,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '16px' }}>
        <Icon style={{ width: '22px', height: '22px', color: '#0ea5e9' }} />
      </div>
      <h3 style={{ fontFamily: 'Orbitron, sans-serif', fontSize: '14px', fontWeight: 600, color: 'white', marginBottom: '8px', marginTop: 0 }}>{title}</h3>
      <p style={{ color: '#94a3b8', fontSize: '13px', lineHeight: 1.6, margin: 0 }}>{description}</p>
    </div>
  )
}

export default function ServicesSection(): React.ReactElement {
  const { data: services } = useServices()
  const { data: settings } = useSiteSettings()
  const { lang } = useLanguageStore()
  const t = useTranslation()
  const visible = services?.filter(s => s.visible) ?? []
  const title = settings ? (lang === 'en' ? settings.servicesSectionTitle_en : settings.servicesSectionTitle_es) : 'Our Services'

  return (
    <section id="services" className="section-padding" style={{ background: 'rgba(13,21,38,0.3)' }}>
      <div style={{ maxWidth: '1280px', margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: '60px' }}>
          <span style={{ color: '#0ea5e9', fontSize: '12px', fontWeight: 600, letterSpacing: '0.15em', textTransform: 'uppercase' }}>{t.services.sectionLabel}</span>
          <h2 style={{ fontFamily: 'Orbitron, sans-serif', fontSize: 'clamp(1.8rem,4vw,2.8rem)', fontWeight: 700, color: 'white', marginTop: '8px', marginBottom: '16px' }}>{title}</h2>
          <div style={{ width: '56px', height: '3px', background: '#0ea5e9', margin: '0 auto', borderRadius: '2px' }} />
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '20px' }}>
          {visible.map((s, i) => (
            <ServiceCard key={s.id} icon={s.icon} title={lang === 'en' ? s.title_en : s.title_es} description={lang === 'en' ? s.description_en : s.description_es} index={i} />
          ))}
        </div>
      </div>
    </section>
  )
}
