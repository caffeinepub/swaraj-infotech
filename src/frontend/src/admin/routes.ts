export const ADMIN_ROUTES = {
  QUESTIONS: 'questions',
  BULK_UPLOAD: 'bulk-upload',
  CHAPTERS_CATEGORIES: 'chapters-categories',
  USERS: 'users',
  NOTIFICATIONS: 'notifications',
  ANALYTICS: 'analytics',
  FEEDBACK: 'feedback',
  BACKUP_RESTORE: 'backup-restore',
} as const;

export type AdminRoute = typeof ADMIN_ROUTES[keyof typeof ADMIN_ROUTES];

export const ADMIN_ROUTE_LABELS: Record<AdminRoute, string> = {
  [ADMIN_ROUTES.QUESTIONS]: 'Questions',
  [ADMIN_ROUTES.BULK_UPLOAD]: 'Bulk Upload',
  [ADMIN_ROUTES.CHAPTERS_CATEGORIES]: 'Chapters & Categories',
  [ADMIN_ROUTES.USERS]: 'Users & Results',
  [ADMIN_ROUTES.NOTIFICATIONS]: 'Notifications',
  [ADMIN_ROUTES.ANALYTICS]: 'Analytics',
  [ADMIN_ROUTES.FEEDBACK]: 'Feedback',
  [ADMIN_ROUTES.BACKUP_RESTORE]: 'Backup & Restore',
};
