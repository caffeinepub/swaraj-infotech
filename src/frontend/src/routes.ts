export const ROUTES = {
  DASHBOARD: {
    path: '/',
    label: 'Dashboard',
    description: 'Main dashboard with course overview and quick actions',
  },
  PRACTICE_MODE: {
    path: '/practice',
    label: 'Practice Mode',
    description: 'Practice questions by chapter with hints and explanations',
  },
  CHAPTER_TEST: {
    path: '/chapter-test',
    label: 'Chapter Test',
    description: 'Take timed tests for specific chapters',
  },
  EXAM_MODE: {
    path: '/exam',
    label: 'Exam Mode',
    description: 'Full exam simulation with timer and scoring',
  },
  PROGRESS: {
    path: '/progress',
    label: 'Progress',
    description: 'Track your learning progress and performance',
  },
  SHARE_APP: {
    path: '/share',
    label: 'Share App',
    description: 'Share the app with friends and classmates',
  },
  PROFILE: {
    path: '/profile',
    label: 'Profile',
    description: 'View and manage your profile',
  },
  TESTS: {
    path: '/tests',
    label: 'Tests',
    description: 'View your test history and results',
  },
  BOOKMARKS: {
    path: '/bookmarks',
    label: 'Bookmarks',
    description: 'Access your saved questions',
  },
  NOTIFICATIONS: {
    path: '/notifications',
    label: 'Notifications',
    description: 'View announcements and updates',
  },
  FEEDBACK: {
    path: '/feedback',
    label: 'Feedback',
    description: 'Send feedback and suggestions',
  },
} as const;

// Legacy route aliases for backward compatibility
export const ROUTES_LEGACY = {
  PRACTICE: ROUTES.PRACTICE_MODE.path,
  EXAM: ROUTES.EXAM_MODE.path,
  SHARE: ROUTES.SHARE_APP.path,
};

export type RouteKey = typeof ROUTES[keyof typeof ROUTES]['path'];
