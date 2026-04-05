import { useState, useRef, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { Menu, X, Sun, Moon, Plane } from 'lucide-react'
import { useLanguageStore, useTranslation } from '../../stores/languageStore'
import { useThemeStore } from '../../stores/themeStore'

export default function Navbar(): React.ReactElement {
  const [menuOpen, setMenuOpen] = useState(false)
  const { lang, setLang } = useLanguageStore()
  const { theme, toggleTheme } = useThemeStore()
  const t = useTranslation()
  const navigate = useNavigate()

  // Easter egg: 5 clicks in < 2 seconds → /admin/login
  const clickTimes = useRef<number[]>([])
  const handleLogoClick = useCallback(() => {
    const now = Date.now()
    clickTimes.current = [...clickTimes.current.filter(t => now - t < 2000), now]
    if (clickTimes.current.length >= 5) {
      clickTimes.current = []
      navigate('/admin/login')
    }
  }, [navigate])

  const navLinks = [
    { href: '#services', label: t.nav.services },
    { href: '#projects', label: t.nav.projects },
    { href: '#certifications', label: t.nav.certifications },
    { href: '#team', label: t.nav.team },
    { href: '#contact', label: t.nav.contact },
  ]

  return (
    <nav className="fixed top-0 inset-x-0 z-50" style={{ background: 'rgba(10,15,30,0.85)', backdropFilter: 'blur(12px)', borderBottom: '1px solid rgba(14,165,233,0.1)' }}>
      <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '0 1.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: '64px' }}>
          {/* Logo */}
          <button onClick={handleLogoClick} style={{ display: 'flex', alignItems: 'center', gap: '10px', background: 'none', border: 'none', cursor: 'pointer' }} aria-label="Aircraft Interiors Solutions">
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '36px', height: '36px', borderRadius: '10px', background: 'rgba(14,165,233,0.15)', border: '1px solid rgba(14,165,233,0.3)' }}>
              <Plane style={{ width: '18px', height: '18px', color: '#0ea5e9' }} />
            </div>
            <span className="font-display" style={{ fontFamily: 'Orbitron, sans-serif', color: 'white', fontWeight: 700, fontSize: '13px', letterSpacing: '0.1em', display: 'none' }}>
              AIS <span style={{ color: '#0ea5e9' }}>STUDIO</span>
            </span>
            <span style={{ fontFamily: 'Orbitron, sans-serif', color: 'white', fontWeight: 700, fontSize: '13px', letterSpacing: '0.1em' }}>
              <span style={{ color: '#0ea5e9' }}>AIRCRAFT</span> INTERIORS
            </span>
          </button>

          {/* Desktop nav */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '24px' }} className="hidden-mobile">
            {navLinks.map(link => (
              <a key={link.href} href={link.href} style={{ fontSize: '14px', color: '#94a3b8', textDecoration: 'none', transition: 'color 0.2s' }}
                onMouseEnter={e => ((e.target as HTMLElement).style.color = 'white')}
                onMouseLeave={e => ((e.target as HTMLElement).style.color = '#94a3b8')}>
                {link.label}
              </a>
            ))}
          </div>

          {/* Controls */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <button onClick={() => setLang(lang === 'en' ? 'es' : 'en')}
              style={{ fontSize: '12px', fontWeight: 600, color: '#94a3b8', background: 'rgba(255,255,255,0.05)', border: 'none', cursor: 'pointer', padding: '6px 10px', borderRadius: '8px', transition: 'all 0.2s' }}>
              {lang === 'en' ? 'ES' : 'EN'}
            </button>
            <button onClick={toggleTheme}
              style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '34px', height: '34px', background: 'rgba(255,255,255,0.05)', border: 'none', cursor: 'pointer', borderRadius: '8px', color: '#94a3b8', transition: 'all 0.2s' }}>
              {theme === 'dark' ? <Sun style={{ width: '16px', height: '16px' }} /> : <Moon style={{ width: '16px', height: '16px' }} />}
            </button>
            <a href="#contact"
              style={{ display: 'inline-flex', alignItems: 'center', background: '#0ea5e9', color: 'white', fontWeight: 600, fontSize: '13px', padding: '8px 16px', borderRadius: '10px', textDecoration: 'none', transition: 'background 0.2s' }}
              onMouseEnter={e => ((e.target as HTMLElement).style.background = '#0284c7')}
              onMouseLeave={e => ((e.target as HTMLElement).style.background = '#0ea5e9')}>
              {t.nav.requestQuote}
            </a>
            <button onClick={() => setMenuOpen(!menuOpen)}
              style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '34px', height: '34px', background: 'none', border: 'none', cursor: 'pointer', color: '#94a3b8' }}
              className="show-mobile" aria-label="Menu">
              {menuOpen ? <X style={{ width: '20px', height: '20px' }} /> : <Menu style={{ width: '20px', height: '20px' }} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile drawer */}
      {menuOpen && (
        <div style={{ borderTop: '1px solid rgba(255,255,255,0.05)', padding: '12px 16px 16px' }}>
          {navLinks.map(link => (
            <a key={link.href} href={link.href} onClick={() => setMenuOpen(false)}
              style={{ display: 'block', padding: '10px 16px', color: '#cbd5e1', textDecoration: 'none', fontSize: '15px', borderRadius: '10px', marginBottom: '2px' }}>
              {link.label}
            </a>
          ))}
          <a href="#contact" onClick={() => setMenuOpen(false)}
            style={{ display: 'block', textAlign: 'center', background: '#0ea5e9', color: 'white', fontWeight: 600, padding: '10px', borderRadius: '10px', textDecoration: 'none', marginTop: '8px' }}>
            {t.nav.requestQuote}
          </a>
        </div>
      )}

      <style>{`
        @media (min-width: 768px) { .show-mobile { display: none !important; } }
        @media (max-width: 767px) { .hidden-mobile { display: none !important; } }
      `}</style>
    </nav>
  )
}
