import { useEffect, useState } from 'react';
import { useOtpSession } from './hooks/useOtpSession';
import { useHashRoute } from './hooks/useHashRoute';
import { useRecordAppOpen } from './hooks/useAnalytics';
import { ROUTES } from './routes';
import SplashScreen from './components/SplashScreen';
import OtpAuthFlow from './components/auth/OtpAuthFlow';
import AuthenticatedShell from './components/layout/AuthenticatedShell';
import CourseDashboard from './screens/CourseDashboard';
import PracticeModeScreen from './screens/PracticeModeScreen';
import ChapterTestScreen from './screens/ChapterTestScreen';
import ExamModeScreen from './screens/ExamModeScreen';
import ProgressScreen from './screens/ProgressScreen';
import ShareAppScreen from './screens/ShareAppScreen';
import ProfileScreen from './screens/ProfileScreen';
import TestsScreen from './screens/TestsScreen';
import BookmarksScreen from './screens/BookmarksScreen';
import NotificationsScreen from './screens/NotificationsScreen';
import FeedbackScreen from './screens/FeedbackScreen';

export default function App() {
  const [showSplash, setShowSplash] = useState(true);
  const { isAuthenticated, logout } = useOtpSession();
  const { currentRoute } = useHashRoute();
  
  // Record app open event when user is authenticated
  useRecordAppOpen();

  useEffect(() => {
    const timer = setTimeout(() => setShowSplash(false), 2000);
    return () => clearTimeout(timer);
  }, []);

  if (showSplash) {
    return <SplashScreen />;
  }

  if (!isAuthenticated) {
    return <OtpAuthFlow />;
  }

  // Authenticated users go directly to dashboard (no profile gating)
  const renderScreen = () => {
    switch (currentRoute) {
      case ROUTES.DASHBOARD.path:
        return <CourseDashboard />;
      case ROUTES.PRACTICE_MODE.path:
        return <PracticeModeScreen />;
      case ROUTES.CHAPTER_TEST.path:
        return <ChapterTestScreen />;
      case ROUTES.EXAM_MODE.path:
        return <ExamModeScreen />;
      case ROUTES.PROGRESS.path:
        return <ProgressScreen />;
      case ROUTES.SHARE_APP.path:
        return <ShareAppScreen />;
      case ROUTES.PROFILE.path:
        return <ProfileScreen />;
      case ROUTES.TESTS.path:
        return <TestsScreen />;
      case ROUTES.BOOKMARKS.path:
        return <BookmarksScreen />;
      case ROUTES.NOTIFICATIONS.path:
        return <NotificationsScreen />;
      case ROUTES.FEEDBACK.path:
        return <FeedbackScreen />;
      default:
        return <CourseDashboard />;
    }
  };

  return (
    <AuthenticatedShell onLogout={logout}>
      {renderScreen()}
    </AuthenticatedShell>
  );
}
