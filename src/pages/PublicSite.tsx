import Navbar from '../components/public/Navbar'
import HeroSection from '../components/public/HeroSection'
import ServicesSection from '../components/public/ServicesSection'
import ProjectsSection from '../components/public/ProjectsSection'
import CertificationsSection from '../components/public/CertificationsSection'
import TeamSection from '../components/public/TeamSection'
import ContactSection from '../components/public/ContactSection'
import Footer from '../components/public/Footer'

export default function PublicSite(): React.ReactElement {
  return (
    <div className="min-h-screen" style={{ background: '#0a0f1e', color: '#e2e8f0' }}>
      <Navbar />
      <main>
        <HeroSection />
        <ServicesSection />
        <ProjectsSection />
        <CertificationsSection />
        <TeamSection />
        <ContactSection />
      </main>
      <Footer />
    </div>
  )
}
