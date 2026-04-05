import { useEffect, useRef } from 'react'
import { ChevronDown } from 'lucide-react'
import { useSiteSettings } from '../../hooks/useSiteSettings'
import { useLanguageStore } from '../../stores/languageStore'
import * as THREE from 'three'

export default function HeroSection(): React.ReactElement {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const { data: settings } = useSiteSettings()
  const { lang } = useLanguageStore()

  useEffect(() => {
    if (!canvasRef.current) return
    const canvas = canvasRef.current
    const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true })
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    renderer.setSize(window.innerWidth, window.innerHeight)

    const scene = new THREE.Scene()
    const camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 1000)
    camera.position.z = 30

    // Particle field
    const count = 1000
    const positions = new Float32Array(count * 3)
    for (let i = 0; i < count; i++) {
      positions[i * 3]     = (Math.random() - 0.5) * 100
      positions[i * 3 + 1] = (Math.random() - 0.5) * 60
      positions[i * 3 + 2] = (Math.random() - 0.5) * 40
    }
    const geo = new THREE.BufferGeometry()
    geo.setAttribute('position', new THREE.BufferAttribute(positions, 3))
    const mat = new THREE.PointsMaterial({ color: 0x0ea5e9, size: 0.12, transparent: true, opacity: 0.5 })
    const particles = new THREE.Points(geo, mat)
    scene.add(particles)

    // Grid lines
    const gridHelper = new THREE.GridHelper(120, 30, 0x0ea5e9, 0x0ea5e9)
    const gMat = gridHelper.material as THREE.Material
    gMat.opacity = 0.05
    gMat.transparent = true
    gridHelper.position.y = -18
    scene.add(gridHelper)

    // Wireframe circle (aircraft ring)
    const ringGeo = new THREE.TorusGeometry(12, 0.05, 8, 60)
    const ringMat = new THREE.MeshBasicMaterial({ color: 0x0ea5e9, transparent: true, opacity: 0.12 })
    const ring = new THREE.Mesh(ringGeo, ringMat)
    ring.rotation.x = Math.PI / 4
    scene.add(ring)

    let frameId: number
    const clock = new THREE.Clock()
    const animate = () => {
      frameId = requestAnimationFrame(animate)
      const t = clock.getElapsedTime()
      particles.rotation.y = t * 0.025
      particles.rotation.x = Math.sin(t * 0.015) * 0.08
      ring.rotation.z = t * 0.04
      renderer.render(scene, camera)
    }
    animate()

    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight
      camera.updateProjectionMatrix()
      renderer.setSize(window.innerWidth, window.innerHeight)
    }
    window.addEventListener('resize', handleResize)
    return () => {
      cancelAnimationFrame(frameId)
      window.removeEventListener('resize', handleResize)
      renderer.dispose(); geo.dispose(); mat.dispose(); ringGeo.dispose(); ringMat.dispose()
    }
  }, [])

  const title     = settings ? (lang === 'en' ? settings.heroTitle_en     : settings.heroTitle_es)     : 'Aircraft Interior'
  const tagline   = settings ? (lang === 'en' ? settings.heroTagline_en   : settings.heroTagline_es)   : 'We Do The Best For Interiors'
  const highlight = settings?.heroTitleHighlight || 'Solutions'
  const cta1      = settings ? (lang === 'en' ? settings.heroCta1_en      : settings.heroCta1_es)      : 'Explore Our Work'
  const cta2      = settings ? (lang === 'en' ? settings.heroCta2_en      : settings.heroCta2_es)      : 'Request a Quote'

  return (
    <section id="hero" style={{ position: 'relative', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden', background: '#0a0f1e' }}>
      <canvas ref={canvasRef} style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }} />
      <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(ellipse at center, rgba(14,165,233,0.07) 0%, transparent 70%)' }} />

      <div style={{ position: 'relative', zIndex: 10, textAlign: 'center', padding: '0 1.5rem', maxWidth: '900px', margin: '0 auto' }}>
        {/* Tagline pill */}
        <div className="animate-fade-in" style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '6px 16px', borderRadius: '999px', background: 'rgba(14,165,233,0.1)', border: '1px solid rgba(14,165,233,0.2)', color: '#0ea5e9', fontSize: '13px', fontWeight: 500, marginBottom: '24px' }}>
          <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#0ea5e9', animation: 'pulse 2s infinite' }} />
          {tagline}
        </div>

        {/* Title */}
        <h1 className="animate-fade-up" style={{ fontFamily: 'Orbitron, sans-serif', fontSize: 'clamp(2.5rem, 8vw, 5rem)', fontWeight: 900, color: 'white', lineHeight: 1.1, marginBottom: '12px', marginTop: 0 }}>
          {title}
          <br />
          <span className="text-gradient">{highlight}</span>
        </h1>

        <p className="animate-fade-up" style={{ color: '#94a3b8', fontSize: 'clamp(1rem, 2vw, 1.2rem)', maxWidth: '600px', margin: '0 auto 40px', lineHeight: 1.6, animationDelay: '0.1s' }}>
          {lang === 'en'
            ? 'Premium aircraft interior design, refurbishment, and custom solutions for VIP, corporate, and commercial aviation clients.'
            : 'Diseño de interiores de aeronaves premium, renovación y soluciones personalizadas para clientes VIP, corporativos y de aviación comercial.'}
        </p>

        <div className="animate-fade-up" style={{ display: 'flex', flexWrap: 'wrap', gap: '16px', justifyContent: 'center', animationDelay: '0.2s' }}>
          <a href="#projects"
            style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', background: '#0ea5e9', color: 'white', fontWeight: 600, fontSize: '15px', padding: '14px 32px', borderRadius: '12px', textDecoration: 'none', transition: 'all 0.2s' }}
            onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = '#0284c7'; (e.currentTarget as HTMLElement).style.transform = 'scale(1.03)' }}
            onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = '#0ea5e9'; (e.currentTarget as HTMLElement).style.transform = 'scale(1)' }}>
            {cta1}
          </a>
          <a href="#contact"
            style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', background: 'rgba(255,255,255,0.05)', color: 'white', fontWeight: 600, fontSize: '15px', padding: '14px 32px', borderRadius: '12px', textDecoration: 'none', border: '1px solid rgba(255,255,255,0.1)', transition: 'all 0.2s' }}
            onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.1)'; (e.currentTarget as HTMLElement).style.transform = 'scale(1.03)' }}
            onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.05)'; (e.currentTarget as HTMLElement).style.transform = 'scale(1)' }}>
            {cta2}
          </a>
        </div>
      </div>

      {/* Scroll indicator */}
      <div style={{ position: 'absolute', bottom: '32px', left: '50%', transform: 'translateX(-50%)', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px', color: '#475569', animation: 'bounce 2s infinite' }}>
        <span style={{ fontSize: '10px', letterSpacing: '0.15em', textTransform: 'uppercase' }}>Scroll</span>
        <ChevronDown style={{ width: '16px', height: '16px' }} />
      </div>

      <style>{`
        @keyframes pulse { 0%,100% { opacity:1 } 50% { opacity:0.4 } }
        @keyframes bounce { 0%,100% { transform: translateX(-50%) translateY(0) } 50% { transform: translateX(-50%) translateY(-6px) } }
      `}</style>
    </section>
  )
}
