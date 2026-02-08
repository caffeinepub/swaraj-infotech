# Admin API Documentation

## Overview
This document describes the admin-specific API endpoints and functionality for the Swaraj Infotech Learning App admin panel.

## Deployment Troubleshooting
For deployment issues including "no draft" errors, see the dedicated troubleshooting guide:
- [Deployment Troubleshooting Guide](./deployment-troubleshooting.md)

## Admin Authentication
Admin access requires Internet Identity authentication with admin role assignment. The first authenticated user is automatically assigned admin privileges.

## API Endpoints

### Questions Management
- `addQuestion()` - Create new question
- `updateQuestion()` - Update existing question
- `deleteQuestion()` - Remove question
- `searchQuestions()` - Search/filter questions with pagination
- `bulkUploadQuestions()` - Import multiple questions

### Content Management
- `createChapter()` - Add new chapter
- `updateChapter()` - Modify chapter details
- `deleteChapter()` - Remove chapter
- `listChapters()` - Get all chapters
- `createCategory()` - Add category
- `updateCategory()` - Modify category
- `deleteCategory()` - Remove category
- `listCategories()` - Get all categories

### User Management
- `listUsers()` - Get all registered users
- `getUserExamHistory()` - View user's exam attempts
- `exportUserResults()` - Export all user results

### Notifications
- `createNotification()` - Send notification to users
- `listNotifications()` - View all notifications

### Analytics (New)
- `getAnalyticsEvents()` - Retrieve all analytics events
- Analytics events include: app opens, user activity, retention metrics
- Date-range filtering available in UI

### Feedback (New)
- Feedback submissions stored as notifications with `admin_feedback` target segment
- `listNotifications()` - Filter for feedback entries
- Export functionality: JSON and CSV formats

### Backup & Restore
- `backupData()` - Export complete system state
- `restoreData()` - Import system state from backup

## Authorization
All admin endpoints require:
1. Valid Internet Identity authentication
2. Admin role assignment
3. Proper session management

## Rate Limiting
Admin endpoints are not rate-limited but should be used responsibly.

## Error Handling
All endpoints return standard error responses:
- Unauthorized access: "Unauthorized: Only admins can..."
- Not found: "... not found"
- Validation errors: Specific field validation messages

## Related Documentation
- [Deployment Troubleshooting](./deployment-troubleshooting.md)
- [PostgreSQL DDL](./postgres-ddl.md)
- [Learner Tests API](./learner-tests-api.md)
