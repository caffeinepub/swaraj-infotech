import type { Notification } from '../../backend';

export function exportFeedbackAsJSON(feedback: Notification[]) {
  const data = feedback.map(f => ({
    id: f.id.toString(),
    subject: f.title.replace('[FEEDBACK] ', ''),
    message: f.message,
    createdAt: new Date(Number(f.createdAt) / 1000000).toISOString(),
    createdBy: f.createdBy.toString(),
  }));

  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `feedback-export-${new Date().toISOString().split('T')[0]}.json`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

export function exportFeedbackAsCSV(feedback: Notification[]) {
  const headers = ['ID', 'Subject', 'Message', 'Date', 'User'];
  const rows = feedback.map(f => [
    f.id.toString(),
    `"${f.title.replace('[FEEDBACK] ', '').replace(/"/g, '""')}"`,
    `"${f.message.replace(/"/g, '""')}"`,
    new Date(Number(f.createdAt) / 1000000).toISOString(),
    f.createdBy.toString(),
  ]);

  const csv = [
    headers.join(','),
    ...rows.map(row => row.join(',')),
  ].join('\n');

  const blob = new Blob([csv], { type: 'text/csv' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `feedback-export-${new Date().toISOString().split('T')[0]}.csv`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
