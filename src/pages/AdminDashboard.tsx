import { Routes, Route, Navigate } from 'react-router-dom'
import AdminLayout from '../components/admin/AdminLayout'
import Dashboard from '../components/admin/Dashboard'
import ProjectsManager from '../components/admin/ProjectsManager'
import ServicesManager from '../components/admin/ServicesManager'
import TeamManager from '../components/admin/TeamManager'
import CertificationsManager from '../components/admin/CertificationsManager'
import ContactMessages from '../components/admin/ContactMessages'
import BrochureManager from '../components/admin/BrochureManager'
import SocialLinksManager from '../components/admin/SocialLinksManager'
import AIAssistant from '../components/admin/AIAssistant'
import SiteSettingsManager from '../components/admin/SiteSettingsManager'

export default function AdminDashboard(): React.ReactElement {
  return (
    <AdminLayout>
      <Routes>
        <Route index element={<Dashboard />} />
        <Route path="projects" element={<ProjectsManager />} />
        <Route path="services" element={<ServicesManager />} />
        <Route path="team" element={<TeamManager />} />
        <Route path="certifications" element={<CertificationsManager />} />
        <Route path="messages" element={<ContactMessages />} />
        <Route path="brochure" element={<BrochureManager />} />
        <Route path="social-links" element={<SocialLinksManager />} />
        <Route path="ai" element={<AIAssistant />} />
        <Route path="settings" element={<SiteSettingsManager />} />
        <Route path="*" element={<Navigate to="/admin" replace />} />
      </Routes>
    </AdminLayout>
  )
}
