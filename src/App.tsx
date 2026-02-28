import { useEffect, useState } from 'react';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { OrganizationProvider } from './contexts/OrganizationContext';
import { useOrganization } from './hooks/useOrganization';
import Auth from './components/Auth';
import OrganizationSetup from './components/OrganizationSetup';
import Dashboard from './components/Dashboard';
import CertificateView from './components/CertificateView';

function AppContent() {
  const { user, loading: authLoading, isAdmin } = useAuth();
  const { organization, loading: orgLoading } = useOrganization();

  const [certificateId, setCertificateId] = useState<string | null>(null);
  const [isAdminPath, setIsAdminPath] = useState(false);

  useEffect(() => {
    const path = window.location.pathname;

    // PUBLIC VERIFY ROUTE
    const verifyMatch = path.match(/^\/verify\/([a-zA-Z0-9]+)$/);
    if (verifyMatch) {
      setCertificateId(verifyMatch[1]);
      return;
    }

    // PUBLIC VERYLINK ROUTE
    const verylinkMatch = path.match(/^\/verylink\/([a-zA-Z0-9]+)$/);
    if (verylinkMatch) {
      setCertificateId(verylinkMatch[1]);
      return;
    }

    // SECRET ADMIN PATH
    if (path === '/admin/61b8bfaf1c954b6c816ebbb3b7c704264') {
      setIsAdminPath(true);
    }

  }, []);

  // PUBLIC CERTIFICATE VIEW
  if (certificateId) {
    return <CertificateView certificateId={certificateId} />;
  }

  // LOADING STATE
  if (authLoading || orgLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  // NOT LOGGED IN
  if (!user) {
    if (isAdminPath) {
      return <Auth />;
    }

    return (
      <div className="min-h-screen bg-white flex items-center justify-center p-4">
        <div className="text-center">
          <h1 className="text-6xl font-bold text-gray-200 mb-4">404</h1>
          <p className="text-xl text-gray-500">Page not found</p>
        </div>
      </div>
    );
  }

  // ADMIN WITHOUT ORG
  if (!organization && isAdmin) {
    return <OrganizationSetup />;
  }

  return <Dashboard />;
}

function App() {
  return (
    <AuthProvider>
      <OrganizationProvider>
        <AppContent />
      </OrganizationProvider>
    </AuthProvider>
  );
}

export default App;
