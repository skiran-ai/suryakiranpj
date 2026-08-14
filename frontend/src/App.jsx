import React, { lazy, Suspense } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AdminAuthProvider } from './context/AdminAuthContext';
import ProtectedRoute from './admin/ProtectedRoute';
import PublicPortfolio from './components/PublicPortfolio';

// Lazy load admin pages for fast initial bundle loading
const AdminLayout = lazy(() => import('./admin/AdminLayout'));
const AdminLogin = lazy(() => import('./admin/AdminLogin'));
const AdminDashboard = lazy(() => import('./admin/AdminDashboard'));
const AdminProjects = lazy(() => import('./admin/AdminProjects'));
const AdminProjectForm = lazy(() => import('./admin/AdminProjectForm'));
const AdminSkills = lazy(() => import('./admin/AdminSkills'));
const AdminServices = lazy(() => import('./admin/AdminServices'));
const AdminExperience = lazy(() => import('./admin/AdminExperience'));
const AdminEducation = lazy(() => import('./admin/AdminEducation'));
const AdminCertifications = lazy(() => import('./admin/AdminCertifications'));
const AdminAchievements = lazy(() => import('./admin/AdminAchievements'));
const AdminSocialLinks = lazy(() => import('./admin/AdminSocialLinks'));
const AdminProfile = lazy(() => import('./admin/AdminProfile'));
const AdminAIDocuments = lazy(() => import('./admin/AdminAIDocuments'));
const AdminMessages = lazy(() => import('./admin/AdminMessages'));
const AdminSettings = lazy(() => import('./admin/AdminSettings'));

function AdminLoadingFallback() {
  return (
    <div className="min-vh-100 d-flex flex-column align-items-center justify-content-center" style={{ background: '#070913' }}>
      <div className="spinner-border text-info" role="status" style={{ width: '2.5rem', height: '2.5rem' }}>
        <span className="visually-hidden">Loading Console...</span>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <AdminAuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Public Portfolio Route */}
          <Route path="/" element={<PublicPortfolio />} />

          {/* Admin Login Route */}
          <Route
            path="/admin/login"
            element={
              <Suspense fallback={<AdminLoadingFallback />}>
                <AdminLogin />
              </Suspense>
            }
          />

          {/* Protected Private Admin Routes */}
          <Route
            path="/admin"
            element={
              <ProtectedRoute>
                <Suspense fallback={<AdminLoadingFallback />}>
                  <AdminLayout />
                </Suspense>
              </ProtectedRoute>
            }
          >
            <Route index element={<AdminDashboard />} />
            <Route path="projects" element={<AdminProjects />} />
            <Route path="projects/new" element={<AdminProjectForm />} />
            <Route path="projects/:id/edit" element={<AdminProjectForm />} />
            <Route path="skills" element={<AdminSkills />} />
            <Route path="services" element={<AdminServices />} />
            <Route path="experience" element={<AdminExperience />} />
            <Route path="education" element={<AdminEducation />} />
            <Route path="certifications" element={<AdminCertifications />} />
            <Route path="achievements" element={<AdminAchievements />} />
            <Route path="social-links" element={<AdminSocialLinks />} />
            <Route path="profile" element={<AdminProfile />} />
            <Route path="ai-documents" element={<AdminAIDocuments />} />
            <Route path="messages" element={<AdminMessages />} />
            <Route path="settings" element={<AdminSettings />} />
          </Route>

          {/* Catch-all redirect to public portfolio */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </AdminAuthProvider>
  );
}
