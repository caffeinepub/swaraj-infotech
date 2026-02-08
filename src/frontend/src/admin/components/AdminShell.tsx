import { LogOut, Database, Users, Bell, Upload, FolderTree, FileQuestion, BarChart3, MessageSquare } from 'lucide-react';
import { useInternetIdentity } from '../../hooks/useInternetIdentity';
import { useQueryClient } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { ADMIN_ROUTES, ADMIN_ROUTE_LABELS, type AdminRoute } from '../routes';
import { ADMIN_TEXT } from './EnglishText';
import { BRAND_CONFIG } from '../../config/brand';
import QuestionsScreen from '../questions/QuestionsScreen';
import BulkUploadQuestionsScreen from '../questions/BulkUploadQuestionsScreen';
import ChaptersCategoriesScreen from '../content/ChaptersCategoriesScreen';
import UsersScreen from '../users/UsersScreen';
import NotificationsScreen from '../notifications/NotificationsScreen';
import AnalyticsScreen from '../analytics/AnalyticsScreen';
import FeedbackInboxScreen from '../feedback/FeedbackInboxScreen';
import BackupRestoreScreen from '../backup/BackupRestoreScreen';

interface AdminShellProps {
  currentRoute: AdminRoute;
  onNavigate: (route: AdminRoute) => void;
}

export default function AdminShell({ currentRoute, onNavigate }: AdminShellProps) {
  const { clear } = useInternetIdentity();
  const queryClient = useQueryClient();

  const handleLogout = async () => {
    await clear();
    queryClient.clear();
  };

  const navItems = [
    { route: ADMIN_ROUTES.QUESTIONS, icon: FileQuestion, label: ADMIN_ROUTE_LABELS[ADMIN_ROUTES.QUESTIONS] },
    { route: ADMIN_ROUTES.BULK_UPLOAD, icon: Upload, label: ADMIN_ROUTE_LABELS[ADMIN_ROUTES.BULK_UPLOAD] },
    { route: ADMIN_ROUTES.CHAPTERS_CATEGORIES, icon: FolderTree, label: ADMIN_ROUTE_LABELS[ADMIN_ROUTES.CHAPTERS_CATEGORIES] },
    { route: ADMIN_ROUTES.USERS, icon: Users, label: ADMIN_ROUTE_LABELS[ADMIN_ROUTES.USERS] },
    { route: ADMIN_ROUTES.NOTIFICATIONS, icon: Bell, label: ADMIN_ROUTE_LABELS[ADMIN_ROUTES.NOTIFICATIONS] },
    { route: ADMIN_ROUTES.ANALYTICS, icon: BarChart3, label: ADMIN_ROUTE_LABELS[ADMIN_ROUTES.ANALYTICS] },
    { route: ADMIN_ROUTES.FEEDBACK, icon: MessageSquare, label: ADMIN_ROUTE_LABELS[ADMIN_ROUTES.FEEDBACK] },
    { route: ADMIN_ROUTES.BACKUP_RESTORE, icon: Database, label: ADMIN_ROUTE_LABELS[ADMIN_ROUTES.BACKUP_RESTORE] },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-gray-950">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-gray-800 bg-gray-900/80 backdrop-blur-xl">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img
              src={BRAND_CONFIG.logo.square}
              alt={BRAND_CONFIG.altText}
              className="w-10 h-10 rounded-lg"
            />
            <div>
              <h1 className="text-xl font-display font-bold text-white">Admin Panel</h1>
              <p className="text-xs text-gray-400">{BRAND_CONFIG.name}</p>
            </div>
          </div>
          <Button
            onClick={handleLogout}
            variant="outline"
            className="border-gray-700 hover:bg-gray-800"
          >
            <LogOut className="w-4 h-4 mr-2" />
            {ADMIN_TEXT.LOGOUT}
          </Button>
        </div>
      </header>

      <div className="flex">
        {/* Sidebar */}
        <aside className="w-64 min-h-[calc(100vh-73px)] border-r border-gray-800 bg-gray-900/50 p-4">
          <nav className="space-y-2">
            {navItems.map(({ route, icon: Icon, label }) => (
              <button
                key={route}
                onClick={() => onNavigate(route)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                  currentRoute === route
                    ? 'bg-orange-500/20 text-orange-400 border border-orange-500/30'
                    : 'text-gray-400 hover:bg-gray-800 hover:text-white'
                }`}
              >
                <Icon className="w-5 h-5 shrink-0" />
                <span className="font-medium">{label}</span>
              </button>
            ))}
          </nav>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-8">
          {currentRoute === ADMIN_ROUTES.QUESTIONS && <QuestionsScreen />}
          {currentRoute === ADMIN_ROUTES.BULK_UPLOAD && <BulkUploadQuestionsScreen />}
          {currentRoute === ADMIN_ROUTES.CHAPTERS_CATEGORIES && <ChaptersCategoriesScreen />}
          {currentRoute === ADMIN_ROUTES.USERS && <UsersScreen />}
          {currentRoute === ADMIN_ROUTES.NOTIFICATIONS && <NotificationsScreen />}
          {currentRoute === ADMIN_ROUTES.ANALYTICS && <AnalyticsScreen />}
          {currentRoute === ADMIN_ROUTES.FEEDBACK && <FeedbackInboxScreen />}
          {currentRoute === ADMIN_ROUTES.BACKUP_RESTORE && <BackupRestoreScreen />}
        </main>
      </div>
    </div>
  );
}
