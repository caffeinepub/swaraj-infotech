export const ADMIN_TEXT = {
  // Auth
  LOGIN_TITLE: 'Admin Panel Login',
  LOGIN_SUBTITLE: 'Sign in to access the admin dashboard',
  LOGOUT: 'Logout',
  UNAUTHORIZED: 'Unauthorized access',
  ACCESS_DENIED: 'Access denied. Admin privileges required.',
  
  // Common
  LOADING: 'Loading...',
  SAVE: 'Save',
  CANCEL: 'Cancel',
  DELETE: 'Delete',
  EDIT: 'Edit',
  CREATE: 'Create',
  SEARCH: 'Search',
  FILTER: 'Filter',
  EXPORT: 'Export',
  IMPORT: 'Import',
  DOWNLOAD: 'Download',
  UPLOAD: 'Upload',
  CONFIRM: 'Confirm',
  SUCCESS: 'Success',
  ERROR: 'Error',
  
  // Questions
  ADD_QUESTION: 'Add Question',
  EDIT_QUESTION: 'Edit Question',
  DELETE_QUESTION: 'Delete Question',
  DELETE_QUESTION_CONFIRM: 'Are you sure you want to delete this question? This action cannot be undone.',
  QUESTION_CREATED: 'Question created successfully',
  QUESTION_UPDATED: 'Question updated successfully',
  QUESTION_DELETED: 'Question deleted successfully',
  
  // Bulk Upload
  BULK_UPLOAD_TITLE: 'Bulk Upload Questions',
  DOWNLOAD_TEMPLATE: 'Download CSV Template',
  UPLOAD_CSV: 'Upload CSV File',
  PREVIEW_ROWS: 'Preview Rows',
  IMPORT_QUESTIONS: 'Import Questions',
  VALIDATION_ERRORS: 'Validation Errors',
  IMPORT_SUCCESS: 'Successfully imported {count} questions',
  
  // Chapters & Categories
  ADD_CHAPTER: 'Add Chapter',
  EDIT_CHAPTER: 'Edit Chapter',
  DELETE_CHAPTER: 'Delete Chapter',
  ADD_CATEGORY: 'Add Category',
  EDIT_CATEGORY: 'Edit Category',
  DELETE_CATEGORY: 'Delete Category',
  
  // Users
  USERS_LIST: 'Users List',
  USER_DETAILS: 'User Details',
  EXAM_HISTORY: 'Exam History',
  EXPORT_RESULTS: 'Export Results',
  
  // Notifications
  CREATE_NOTIFICATION: 'Create Notification',
  NOTIFICATION_TITLE: 'Notification Title',
  NOTIFICATION_MESSAGE: 'Message',
  TARGET_SEGMENT: 'Target Segment',
  NOTIFICATION_SENT: 'Notification created successfully',
  
  // Analytics
  ANALYTICS_TITLE: 'Analytics Dashboard',
  ANALYTICS_SUBTITLE: 'Track app usage and user engagement',
  DATE_RANGE: 'Date Range',
  FROM_DATE: 'From',
  TO_DATE: 'To',
  APPLY_FILTER: 'Apply Filter',
  TOTAL_USERS: 'Total Users',
  ACTIVE_USERS: 'Active Users',
  APP_OPENS: 'App Opens',
  RETENTION_RATE: 'Retention Rate',
  NO_DATA: 'No data available for the selected period',
  EVENTS_TABLE: 'Recent Events',
  EVENT_TYPE: 'Event Type',
  USER_ID: 'User ID',
  TIMESTAMP: 'Timestamp',
  DETAILS: 'Details',
  
  // Feedback
  FEEDBACK_INBOX: 'Feedback Inbox',
  FEEDBACK_SUBTITLE: 'View and manage user feedback',
  EXPORT_JSON: 'Export as JSON',
  EXPORT_CSV: 'Export as CSV',
  NO_FEEDBACK: 'No feedback submissions yet',
  FEEDBACK_FROM: 'From',
  FEEDBACK_SUBJECT: 'Subject',
  FEEDBACK_MESSAGE: 'Message',
  FEEDBACK_CONTACT: 'Contact',
  FEEDBACK_DATE: 'Date',
  
  // Backup & Restore
  BACKUP_DATA: 'Backup Data',
  RESTORE_DATA: 'Restore Data',
  BACKUP_WARNING: 'This will download all system data as JSON.',
  RESTORE_WARNING: 'WARNING: This will replace all existing data. This action cannot be undone.',
  BACKUP_SUCCESS: 'Backup downloaded successfully',
  RESTORE_SUCCESS: 'Data restored successfully',
  RESTORE_CONFIRM: 'Are you sure you want to restore from this backup? All current data will be replaced.',
} as const;
