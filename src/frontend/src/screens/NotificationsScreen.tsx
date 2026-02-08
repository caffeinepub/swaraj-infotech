import { Bell, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useGetNotifications } from '../hooks/useNotifications';
import { useHashRoute } from '../hooks/useHashRoute';
import { ROUTES } from '../routes';

export default function NotificationsScreen() {
  const { data: notifications = [], isLoading } = useGetNotifications();
  const { navigate } = useHashRoute();

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-gray-950 pb-24">
      <div className="container mx-auto px-4 py-6">
        <div className="flex items-center gap-4 mb-6">
          <Button
            onClick={() => navigate(ROUTES.DASHBOARD.path)}
            variant="outline"
            size="icon"
            className="border-gray-700 hover:bg-gray-800"
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div>
            <h1 className="text-2xl font-display font-bold text-white">Notifications</h1>
            <p className="text-gray-400 text-sm">Stay updated with latest announcements</p>
          </div>
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <div className="w-12 h-12 border-4 border-orange-500 border-t-transparent rounded-full animate-spin" />
          </div>
        ) : notifications.length === 0 ? (
          <div className="glass-card p-12 rounded-2xl border border-gray-800 text-center">
            <Bell className="w-16 h-16 text-gray-600 mx-auto mb-4" />
            <p className="text-gray-400">No notifications yet</p>
          </div>
        ) : (
          <div className="space-y-4">
            {notifications.map((notification) => (
              <div
                key={notification.id.toString()}
                className="glass-card p-6 rounded-xl border border-gray-800 hover:border-orange-500/30 transition-colors"
              >
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-full bg-orange-500/20 flex items-center justify-center shrink-0">
                    <Bell className="w-5 h-5 text-orange-400" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-white mb-2">
                      {notification.title}
                    </h3>
                    <p className="text-gray-300 mb-3">{notification.message}</p>
                    <span className="text-xs text-gray-500">
                      {new Date(Number(notification.createdAt) / 1000000).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                      })}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
