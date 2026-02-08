import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useGetBookmarkedQuestions } from '../hooks/usePracticeQueries';
import { useHashRoute } from '../hooks/useHashRoute';
import { ROUTES } from '../routes';

export default function BookmarksScreen() {
  const { data: bookmarks = [], isLoading } = useGetBookmarkedQuestions();
  const { navigate } = useHashRoute();

  const handleQuestionClick = (questionId: bigint, chapter: string) => {
    const params = new URLSearchParams({
      chapter,
      questionId: questionId.toString(),
    });
    window.location.hash = `#${ROUTES.PRACTICE_MODE.path}?${params.toString()}`;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-gray-950 pb-24">
      <div className="container mx-auto px-4 py-6">
        <div className="flex items-center gap-4 mb-6">
          <Button
            onClick={() => navigate(ROUTES.DASHBOARD.path)}
            variant="outline"
            size="icon"
            className="border-gray-700 hover:bg-gray-800"
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div>
            <h1 className="text-2xl font-display font-bold text-white">Bookmarks</h1>
            <p className="text-gray-400 text-sm">Your saved questions</p>
          </div>
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <div className="w-12 h-12 border-4 border-orange-500 border-t-transparent rounded-full animate-spin" />
          </div>
        ) : bookmarks.length === 0 ? (
          <div className="glass-card p-12 rounded-2xl border border-gray-800 text-center">
            <p className="text-gray-400">No bookmarked questions yet</p>
          </div>
        ) : (
          <div className="space-y-4">
            {bookmarks.map((question) => (
              <div
                key={question.id.toString()}
                onClick={() => handleQuestionClick(question.id, question.chapter)}
                className="glass-card p-6 rounded-xl border border-gray-800 hover:border-orange-500/30 cursor-pointer transition-colors"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-xs px-2 py-1 rounded bg-blue-500/20 text-blue-400 border border-blue-500/30">
                        {question.course}
                      </span>
                      <span className="text-xs px-2 py-1 rounded bg-purple-500/20 text-purple-400 border border-purple-500/30">
                        {question.chapter}
                      </span>
                    </div>
                    <p className="text-white font-medium">{question.question}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
