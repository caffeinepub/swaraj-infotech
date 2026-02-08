import type { BackupData } from '../../backend';

export function validateBackupData(data: any): { valid: boolean; errors: string[] } {
  const errors: string[] = [];

  if (!data || typeof data !== 'object') {
    errors.push('Invalid backup data format');
    return { valid: false, errors };
  }

  const requiredFields = [
    'questions',
    'chapters',
    'categories',
    'profiles',
    'userAnswers',
    'userBookmarks',
    'userExamResults',
    'notifications',
    'phoneToUserId',
    'callerToUserId',
    'nextUserId',
    'nextAttemptId',
    'nextChapterId',
    'nextCategoryId',
    'nextNotificationId',
  ];

  for (const field of requiredFields) {
    if (!(field in data)) {
      errors.push(`Missing required field: ${field}`);
    }
  }

  if (!Array.isArray(data.questions)) {
    errors.push('Questions must be an array');
  }

  if (!Array.isArray(data.chapters)) {
    errors.push('Chapters must be an array');
  }

  if (!Array.isArray(data.categories)) {
    errors.push('Categories must be an array');
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}
