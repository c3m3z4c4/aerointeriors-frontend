import { useState } from 'react'
import { NavLink, useNavigate } from 'react-router-dom'
import { useAuthStore } from '../../stores/authStore'
import { useLanguageStore } from '../../stores/languageStore'
import { useThemeStore } from '../../stores/themeStore'
import { LayoutDashboard, FolderKanban, Settings2, Users, Award, MessageSquare, FileText, Share2, Bot, Settings, LogOut, Plane, Menu, X, Sun, Moon } from 'lucide-react'

const navItems = [
  { path: '/admin', label: 'Dashboard', icon: LayoutDashboard, end: true },
  { path: '/admin/projects', label: 'Projects', icon: FolderKanban },
  { path: '/admin/services', label: 'Services', icon: Settings2 },
  { path: '/admin/team', label: 'Team', icon: Users },
  { path: '/admin/certifications', label: 'Certifications', icon: Award },
  { path: '/admin/messages', label: 'Messages', icon: MessageSquare },
  { path: '/admin/brochure', label: 'Brochure', icon: FileText },
  { path: '/admin/social-links', label: 'Social Links', icon: Share2 },
  { path: '/admin/ai', label: 'AI Assistant', icon: Bot },
  { path: '/admin/settings', label: 'Site Settings', icon: Settings },
]

export default function AdminLayout({ children }: { children: React.ReactNode }): React.ReactElement {
  const [open, setOpen] = useState(false)
  const { user, logout } = useAuthStore()
  const { lang, setLang } = useLanguageStore()
  const { theme, toggleTheme } = useThemeStore()
  const navigate = useNavigate()

  const handleLogout = () => { logout(); navigate('/admin/login') }

  const sidebarStyle: React.CSSProperties = { width: '240px', background: 'rgba(13,21,38,0.95)', backdropFilter: 'blur(12px)', borderRight: '1px solid rgba(14,165,233,0.08)', display: 'flex', flexDirection: 'column', height: '100vh', position: 'fixed', top: 0, left: 0, zIndex: 40, transition: 'transform 0.3s' }

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: '#0a0f1e' }}>
      {/* Overlay */}
      {open && <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)', zIndex: 30 }} onClick={() => setOpen(false)} />}

      {/* Sidebar */}
      <aside style={{ ...sidebarStyle, transform: open ? 'translateX(0)' : undefined }} className={open ? '' : 'sidebar-hidden'}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '0 16px', height: '64px', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
          <div style={{ width: '34px', height: '34px', borderRadius: '10px', background: 'rgba(14,165,233,0.15)', border: '1px solid rgba(14,165,233,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
            <Plane style={{ width: '17px', height: '17px', color: '#0ea5e9' }} />
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontFamily: 'Orbitron, sans-serif', color: 'white', fontSize: '11px', fontWeight: 700, letterSpacing: '0.05em' }}>AIS <span style={{ color: '#0ea5e9' }}>ADMIN</span></div>
            <div style={{ color: '#475569', fontSize: '10px' }}>Control Panel</div>
          </div>
          <button onClick={() => setOpen(false)} style={{ background: 'none', border: 'none', color: '#475569', cursor: 'pointer' }} className="lg-hide"><X style={{ width: '18px', height: '18px' }} /></button>
        </div>

        <nav style={{ flex: 1, padding: '12px 8px', overflowY: 'auto' }}>
          {navItems.map(item => (
            <NavLink key={item.path} to={item.path} end={item.end} onClick={() => setOpen(false)}
              style={({ isActive }) => ({ display: 'flex', alignItems: 'center', gap: '10px', padding: '9px 12px', borderRadius: '10px', marginBottom: '2px', textDecoration: 'none', fontSize: '13px', fontWeight: 500, transition: 'all 0.2s', background: isActive ? 'rgba(14,165,233,0.12)' : 'transparent', color: isActive ? '#0ea5e9' : '#94a3b8', border: isActive ? '1px solid rgba(14,165,233,0.2)' : '1px solid transparent' })}>
              <item.icon style={{ width: '16px', height: '16px', flexShrink: 0 }} />
              {item.label}
            </NavLink>
          ))}
        </nav>

        <div style={{ padding: '8px', borderTop: '1px solid rgba(255,255,255,0.05)' }}>
          <div style={{ padding: '8px 12px', marginBottom: '4px' }}>
            <p style={{ color: 'white', fontSize: '13px', fontWeight: 500, margin: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{user?.name}</p>
            <p style={{ color: '#475569', fontSize: '11px', margin: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{user?.email}</p>
          </div>
          <button onClick={handleLogout} style={{ display: 'flex', alignItems: 'center', gap: '10px', width: '100%', padding: '9px 12px', borderRadius: '10px', background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer', fontSize: '13px', transition: 'all 0.2s' }}
            onMouseEnter={e => { (e.currentTarget as HTMLElement).style.color = '#f87171'; (e.currentTarget as HTMLElement).style.background = 'rgba(248,113,113,0.08)' }}
            onMouseLeave={e => { (e.currentTarget as HTMLElement).style.color = '#94a3b8'; (e.currentTarget as HTMLElement).style.background = 'transparent' }}>
            <LogOut style={{ width: '15px', height: '15px' }} /> Log out
          </button>
        </div>
      </aside>

      {/* Main */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', marginLeft: '240px', minWidth: 0 }} className="main-content">
        <header style={{ height: '64px', background: 'rgba(13,21,38,0.9)', backdropFilter: 'blur(12px)', borderBottom: '1px solid rgba(255,255,255,0.05)', display: 'flex', alignItems: 'center', padding: '0 20px', gap: '12px', position: 'sticky', top: 0, zIndex: 20 }}>
          <button onClick={() => setOpen(true)} style={{ background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer', display: 'none' }} className="menu-btn"><Menu style={{ width: '20px', height: '20px' }} /></button>
          <div style={{ flex: 1 }} />
          <button onClick={() => setLang(lang === 'en' ? 'es' : 'en')} style={{ fontSize: '12px', fontWeight: 600, color: '#94a3b8', background: 'rgba(255,255,255,0.05)', border: 'none', cursor: 'pointer', padding: '6px 10px', borderRadius: '8px' }}>
            {lang === 'en' ? 'ES' : 'EN'}
          </button>
          <button onClick={toggleTheme} style={{ width: '34px', height: '34px', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(255,255,255,0.05)', border: 'none', cursor: 'pointer', borderRadius: '8px', color: '#94a3b8' }}>
            {theme === 'dark' ? <Sun style={{ width: '16px', height: '16px' }} /> : <Moon style={{ width: '16px', height: '16px' }} />}
          </button>
        </header>
        <main style={{ flex: 1, padding: '24px', overflowY: 'auto' }}>{children}</main>
      </div>

      <style>{`
        @media (max-width: 1024px) {
          .sidebar-hidden { transform: translateX(-100%) !important; }
          .main-content { margin-left: 0 !important; }
          .menu-btn { display: flex !important; }
          .lg-hide { display: flex !important; }
        }
        @media (min-width: 1025px) {
          aside { transform: translateX(0) !important; }
          .lg-hide { display: none !important; }
        }
      `}</style>
    </div>
  )
}
