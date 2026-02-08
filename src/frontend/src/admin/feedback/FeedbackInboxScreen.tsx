import { useGetFeedback } from '../../hooks/useFeedback';
import { exportFeedbackAsJSON, exportFeedbackAsCSV } from './feedbackExport';
import { ADMIN_TEXT } from '../components/EnglishText';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { MessageSquare, Download, FileJson, FileSpreadsheet } from 'lucide-react';
import { toast } from 'sonner';

export default function FeedbackInboxScreen() {
  const { data: feedback = [], isLoading } = useGetFeedback();

  const handleExportJSON = () => {
    try {
      exportFeedbackAsJSON(feedback);
      toast.success('Feedback exported as JSON');
    } catch (error) {
      toast.error('Failed to export feedback');
    }
  };

  const handleExportCSV = () => {
    try {
      exportFeedbackAsCSV(feedback);
      toast.success('Feedback exported as CSV');
    } catch (error) {
      toast.error('Failed to export feedback');
    }
  };

  const parseFeedbackMessage = (message: string) => {
    const lines = message.split('\n');
    const parsed: { subject?: string; message?: string; contact?: string } = {};
    
    lines.forEach(line => {
      if (line.startsWith('Subject: ')) {
        parsed.subject = line.replace('Subject: ', '');
      } else if (line.startsWith('Message: ')) {
        parsed.message = line.replace('Message: ', '');
      } else if (line.startsWith('Contact: ')) {
        parsed.contact = line.replace('Contact: ', '');
      }
    });
    
    return parsed;
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">{ADMIN_TEXT.FEEDBACK_INBOX}</h1>
          <p className="text-gray-400">{ADMIN_TEXT.FEEDBACK_SUBTITLE}</p>
        </div>
        <div className="flex gap-2">
          <Button
            onClick={handleExportJSON}
            variant="outline"
            className="border-gray-700 hover:bg-gray-800"
            disabled={feedback.length === 0}
          >
            <FileJson className="w-4 h-4 mr-2" />
            {ADMIN_TEXT.EXPORT_JSON}
          </Button>
          <Button
            onClick={handleExportCSV}
            variant="outline"
            className="border-gray-700 hover:bg-gray-800"
            disabled={feedback.length === 0}
          >
            <FileSpreadsheet className="w-4 h-4 mr-2" />
            {ADMIN_TEXT.EXPORT_CSV}
          </Button>
        </div>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center py-12">
          <div className="w-12 h-12 border-4 border-orange-500 border-t-transparent rounded-full animate-spin" />
        </div>
      ) : feedback.length === 0 ? (
        <Card className="bg-gray-900/50 border-gray-800">
          <CardContent className="p-12 text-center">
            <MessageSquare className="w-16 h-16 text-gray-600 mx-auto mb-4" />
            <p className="text-gray-400">{ADMIN_TEXT.NO_FEEDBACK}</p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {feedback.map((item) => {
            const parsed = parseFeedbackMessage(item.message);
            return (
              <Card key={item.id.toString()} className="bg-gray-900/50 border-gray-800 hover:border-orange-500/30 transition-colors">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <CardTitle className="text-white text-lg mb-2">
                        {parsed.subject || item.title.replace('[FEEDBACK] ', '')}
                      </CardTitle>
                      <div className="flex items-center gap-4 text-sm text-gray-400">
                        <span>
                          {ADMIN_TEXT.FEEDBACK_FROM}: {item.createdBy.toString().slice(0, 10)}...
                        </span>
                        <span>
                          {new Date(Number(item.createdAt) / 1000000).toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit',
                          })}
                        </span>
                      </div>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div>
                      <p className="text-sm text-gray-400 mb-1">{ADMIN_TEXT.FEEDBACK_MESSAGE}:</p>
                      <p className="text-gray-200">{parsed.message || item.message}</p>
                    </div>
                    {parsed.contact && (
                      <div>
                        <p className="text-sm text-gray-400 mb-1">{ADMIN_TEXT.FEEDBACK_CONTACT}:</p>
                        <p className="text-gray-200">{parsed.contact}</p>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
