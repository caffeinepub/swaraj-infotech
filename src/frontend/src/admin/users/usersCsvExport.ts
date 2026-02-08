import type { ExamResult, UserProfile } from '../../backend';

export function generateUserResultsCSV(
  userProfile: UserProfile,
  examHistory: ExamResult[]
): string {
  const headers = [
    'User ID',
    'Name',
    'Phone',
    'Course',
    'Attempt ID',
    'Exam Type',
    'Score',
    'Accuracy %',
    'Time Remaining (s)',
    'Passed',
    'Submitted',
    'Total Questions',
  ];

  const rows = examHistory.map((result) => {
    const totalQuestions = result.answers.length;
    const accuracy = totalQuestions > 0 ? (Number(result.score) / totalQuestions) * 100 : 0;

    return [
      userProfile.userId.toString(),
      userProfile.name,
      userProfile.phone,
      userProfile.course,
      result.attemptId.toString(),
      result.examType,
      result.score.toString(),
      accuracy.toFixed(2),
      result.timeRemaining.toString(),
      result.passed ? 'Yes' : 'No',
      result.submitted ? 'Yes' : 'No',
      totalQuestions.toString(),
    ];
  });

  const csvContent = [headers, ...rows]
    .map((row) => row.map((cell) => `"${cell}"`).join(','))
    .join('\n');

  return csvContent;
}

export function downloadCSV(filename: string, content: string) {
  const blob = new Blob([content], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  link.click();
  URL.revokeObjectURL(url);
}
