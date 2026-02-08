import { useEffect, useState } from 'react';
import { useInternetIdentity } from '../hooks/useInternetIdentity';
import { useActor } from '../hooks/useActor';
import AdminLoginScreen from './auth/AdminLoginScreen';
import AdminShell from './components/AdminShell';
import { Toaster } from '@/components/ui/sonner';
import { ADMIN_ROUTES, type AdminRoute } from './routes';

export default function AdminApp() {
  const { identity, isInitializing } = useInternetIdentity();
  const { actor, isFetching } = useActor();
  const [currentRoute, setCurrentRoute] = useState<AdminRoute>(ADMIN_ROUTES.QUESTIONS);
  const [isAdmin, setIsAdmin] = useState<boolean>(false);
  const [checkingAuth, setCheckingAuth] = useState(true);

  useEffect(() => {
    async function checkAdminStatus() {
      if (!actor || isFetching || isInitializing) return;
      
      try {
        const adminStatus = await actor.isCallerAdmin();
        setIsAdmin(adminStatus);
      } catch (error) {
        console.error('Failed to check admin status:', error);
        setIsAdmin(false);
      } finally {
        setCheckingAuth(false);
      }
    }

    if (identity) {
      checkAdminStatus();
    } else {
      setCheckingAuth(false);
    }
  }, [actor, identity, isFetching, isInitializing]);

  if (isInitializing || checkingAuth) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-gray-950 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-orange-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-400">Loading Admin Panel...</p>
        </div>
      </div>
    );
  }

  if (!identity || !isAdmin) {
    return (
      <>
        <AdminLoginScreen />
        <Toaster />
      </>
    );
  }

  return (
    <>
      <AdminShell currentRoute={currentRoute} onNavigate={setCurrentRoute} />
      <Toaster />
    </>
  );
}
