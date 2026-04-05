import { useState } from 'react'
import { useProjects, type Project } from '../../hooks/useProjects'
import { useLanguageStore, useTranslation } from '../../stores/languageStore'
import { useSiteSettings } from '../../hooks/useSiteSettings'
import { useInView } from 'react-intersection-observer'
import { X, ChevronLeft, ChevronRight, Star, Plane, User, Calendar, Tag } from 'lucide-react'
import { getImageUrl } from '../../lib/api'

const CATEGORIES = [
  { key: 'all',         en: 'All',           es: 'Todos' },
  { key: 'completions', en: 'Completions',   es: 'Completaciones' },
  { key: 'refurb',      en: 'Refurbishment', es: 'Renovación' },
  { key: 'vip',         en: 'VIP',           es: 'VIP' },
  { key: 'military',    en: 'Military',      es: 'Militar' },
  { key: 'cargo',       en: 'Cargo',         es: 'Carga' },
]

function ProjectCard({ project, lang, onOpen, index }: { project: Project; lang: string; onOpen: (p: Project) => void; index: number }): React.ReactElement {
  const { ref, inView } = useInView({ threshold: 0.1, triggerOnce: true })
  const img = project.images[0] ? getImageUrl(project.images[0]) : ''
  return (
    <div ref={ref} onClick={() => onOpen(project)} className="animate-fade-up"
      style={{ background: 'rgba(13,21,38,0.75)', backdropFilter: 'blur(12px)', border: '1px solid rgba(14,165,233,0.1)', borderRadius: '16px', overflow: 'hidden', cursor: 'pointer', transition: 'all 0.3s', opacity: inView ? 1 : 0, animationDelay: `${index * 0.07}s`, animationFillMode: 'forwards' }}
      onMouseEnter={e => { (e.currentTarget as HTMLElement).style.borderColor = 'rgba(14,165,233,0.3)'; (e.currentTarget as HTMLElement).style.transform = 'translateY(-4px)' }}
      onMouseLeave={e => { (e.currentTarget as HTMLElement).style.borderColor = 'rgba(14,165,233,0.1)'; (e.currentTarget as HTMLElement).style.transform = 'translateY(0)' }}>
      <div style={{ position: 'relative', height: '200px', overflow: 'hidden', background: '#111b33' }}>
        {img && <img src={img} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.5s' }} onMouseEnter={e => ((e.target as HTMLElement).style.transform = 'scale(1.06)')} onMouseLeave={e => ((e.target as HTMLElement).style.transform = 'scale(1)')} />}
        {project.featured && (
          <div style={{ position: 'absolute', top: '10px', left: '10px', display: 'flex', alignItems: 'center', gap: '4px', background: 'rgba(245,158,11,0.9)', color: 'black', fontSize: '11px', fontWeight: 700, padding: '3px 10px', borderRadius: '999px' }}>
            <Star style={{ width: '10px', height: '10px' }} /> Featured
          </div>
        )}
        <div style={{ position: 'absolute', top: '10px', right: '10px', background: 'rgba(0,0,0,0.6)', color: 'white', fontSize: '11px', padding: '3px 10px', borderRadius: '999px', textTransform: 'capitalize' }}>{project.category}</div>
      </div>
      <div style={{ padding: '16px' }}>
        <h3 style={{ fontFamily: 'Orbitron, sans-serif', fontSize: '13px', fontWeight: 600, color: 'white', marginBottom: '8px', marginTop: 0 }}>{lang === 'en' ? project.title_en : project.title_es}</h3>
        <div style={{ display: 'flex', gap: '16px', color: '#64748b', fontSize: '12px' }}>
          <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><Plane style={{ width: '12px', height: '12px' }} />{project.aircraftType}</span>
          <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><Calendar style={{ width: '12px', height: '12px' }} />{project.year}</span>
        </div>
      </div>
    </div>
  )
}

function ProjectModal({ project, lang, onClose }: { project: Project; lang: string; onClose: () => void }): React.ReactElement {
  const [imgIdx, setImgIdx] = useState(0)
  const t = useTranslation()
  const images = project.images.map(getImageUrl)
  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '16px' }} onClick={onClose}>
      <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(6px)' }} />
      <div style={{ position: 'relative', background: 'rgba(13,21,38,0.95)', border: '1px solid rgba(14,165,233,0.2)', borderRadius: '20px', width: '100%', maxWidth: '700px', maxHeight: '90vh', overflowY: 'auto' }} onClick={e => e.stopPropagation()}>
        {images.length > 0 && (
          <div style={{ position: 'relative', height: '300px', overflow: 'hidden', borderRadius: '20px 20px 0 0', background: '#111b33' }}>
            <img src={images[imgIdx]} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            {images.length > 1 && <>
              <button onClick={() => setImgIdx((imgIdx - 1 + images.length) % images.length)} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', background: 'rgba(0,0,0,0.5)', border: 'none', color: 'white', width: '36px', height: '36px', borderRadius: '50%', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><ChevronLeft style={{ width: '18px', height: '18px' }} /></button>
              <button onClick={() => setImgIdx((imgIdx + 1) % images.length)} style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', background: 'rgba(0,0,0,0.5)', border: 'none', color: 'white', width: '36px', height: '36px', borderRadius: '50%', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><ChevronRight style={{ width: '18px', height: '18px' }} /></button>
            </>}
            {project.featured && <div style={{ position: 'absolute', top: '12px', left: '12px', display: 'flex', alignItems: 'center', gap: '4px', background: '#f59e0b', color: 'black', fontSize: '11px', fontWeight: 700, padding: '4px 12px', borderRadius: '999px' }}><Star style={{ width: '10px', height: '10px' }} />{t.projects.featured}</div>}
          </div>
        )}
        <div style={{ padding: '24px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
            <h2 style={{ fontFamily: 'Orbitron, sans-serif', fontSize: '18px', fontWeight: 700, color: 'white', margin: 0 }}>{lang === 'en' ? project.title_en : project.title_es}</h2>
            <button onClick={onClose} style={{ background: 'none', border: 'none', color: '#64748b', cursor: 'pointer', padding: '4px' }}><X style={{ width: '20px', height: '20px' }} /></button>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(140px,1fr))', gap: '10px', marginBottom: '20px' }}>
            {[
              { label: t.projects.aircraft, val: project.aircraftType, icon: <Plane style={{ width: '13px', height: '13px', color: '#0ea5e9' }} /> },
              ...(project.client ? [{ label: t.projects.client, val: project.client, icon: <User style={{ width: '13px', height: '13px', color: '#0ea5e9' }} /> }] : []),
              { label: t.projects.year, val: String(project.year), icon: <Calendar style={{ width: '13px', height: '13px', color: '#0ea5e9' }} /> },
            ].map(item => (
              <div key={item.label} style={{ background: 'rgba(14,165,233,0.06)', border: '1px solid rgba(14,165,233,0.15)', borderRadius: '12px', padding: '10px 12px' }}>
                <div style={{ color: '#64748b', fontSize: '11px', marginBottom: '4px' }}>{item.label}</div>
                <div style={{ color: 'white', fontSize: '13px', fontWeight: 500, display: 'flex', alignItems: 'center', gap: '6px' }}>{item.icon}{item.val}</div>
              </div>
            ))}
          </div>
          <p style={{ color: '#cbd5e1', fontSize: '14px', lineHeight: 1.7, marginBottom: '20px' }}>{lang === 'en' ? project.description_en : project.description_es}</p>
          {project.tags.length > 0 && (
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#64748b', fontSize: '12px', marginBottom: '10px' }}><Tag style={{ width: '13px', height: '13px' }} />{t.projects.tags}</div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                {project.tags.map(tag => <span key={tag} style={{ fontSize: '12px', background: 'rgba(14,165,233,0.12)', border: '1px solid rgba(14,165,233,0.2)', color: '#0ea5e9', padding: '4px 12px', borderRadius: '999px' }}>{tag}</span>)}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default function ProjectsSection(): React.ReactElement {
  const [activeFilter, setActiveFilter] = useState('all')
  const [selected, setSelected] = useState<Project | null>(null)
  const { data: projects } = useProjects()
  const { data: settings } = useSiteSettings()
  const { lang } = useLanguageStore()
  const visible = projects?.filter(p => p.visible) ?? []
  const filtered = activeFilter === 'all' ? visible : visible.filter(p => p.category === activeFilter)
  const title = settings ? (lang === 'en' ? settings.projectsSectionTitle_en : settings.projectsSectionTitle_es) : 'Our Projects'

  return (
    <section id="projects" className="section-padding">
      <div style={{ maxWidth: '1280px', margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: '48px' }}>
          <span style={{ color: '#0ea5e9', fontSize: '12px', fontWeight: 600, letterSpacing: '0.15em', textTransform: 'uppercase' }}>Portfolio</span>
          <h2 style={{ fontFamily: 'Orbitron, sans-serif', fontSize: 'clamp(1.8rem,4vw,2.8rem)', fontWeight: 700, color: 'white', marginTop: '8px', marginBottom: '16px' }}>{title}</h2>
          <div style={{ width: '56px', height: '3px', background: '#0ea5e9', margin: '0 auto', borderRadius: '2px' }} />
        </div>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', justifyContent: 'center', marginBottom: '40px' }}>
          {CATEGORIES.map(cat => (
            <button key={cat.key} onClick={() => setActiveFilter(cat.key)} style={{ padding: '8px 18px', borderRadius: '999px', fontSize: '13px', fontWeight: 500, cursor: 'pointer', transition: 'all 0.2s', background: activeFilter === cat.key ? '#0ea5e9' : 'rgba(255,255,255,0.05)', color: activeFilter === cat.key ? 'white' : '#94a3b8', border: activeFilter === cat.key ? 'none' : '1px solid rgba(255,255,255,0.1)' }}>
              {lang === 'en' ? cat.en : cat.es}
            </button>
          ))}
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '20px' }}>
          {filtered.map((p, i) => <ProjectCard key={p.id} project={p} lang={lang} onOpen={setSelected} index={i} />)}
        </div>
      </div>
      {selected && <ProjectModal project={selected} lang={lang} onClose={() => setSelected(null)} />}
    </section>
  )
}
