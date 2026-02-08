import { Bell } from 'lucide-react';
import { useOtpSession } from '../hooks/useOtpSession';
import { useHashRoute } from '../hooks/useHashRoute';
import { ROUTES } from '../routes';
import { Button } from '@/components/ui/button';
import { useGetNotifications } from '../hooks/useNotifications';
import { BRAND_CONFIG } from '../config/brand';

export default function BrandHeader() {
  const { isAuthenticated, logout } = useOtpSession();
  const { navigate } = useHashRoute();
  const { data: notifications = [] } = useGetNotifications();

  const unreadCount = notifications.length;

  return (
    <header className="sticky top-0 z-50 glass-card border-b border-gray-800/50 backdrop-blur-xl">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <img
            src={BRAND_CONFIG.logo.square}
            alt={BRAND_CONFIG.altText}
            className="w-10 h-10 rounded-lg"
          />
          <div>
            <h1 className="text-xl font-display font-bold text-white">{BRAND_CONFIG.name}</h1>
            <p className="text-xs text-gray-400">{BRAND_CONFIG.shortTagline}</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {isAuthenticated && (
            <>
              <button
                onClick={() => navigate(ROUTES.NOTIFICATIONS.path)}
                className="relative p-2 rounded-lg hover:bg-gray-800 transition-colors"
              >
                <Bell className="w-5 h-5 text-gray-400" />
                {unreadCount > 0 && (
                  <span className="absolute -top-1 -right-1 w-5 h-5 bg-orange-500 text-white text-xs rounded-full flex items-center justify-center">
                    {unreadCount}
                  </span>
                )}
              </button>
              <Button
                onClick={logout}
                variant="outline"
                size="sm"
                className="border-gray-700 hover:bg-gray-800"
              >
                Logout
              </Button>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
