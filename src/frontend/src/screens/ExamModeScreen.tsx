import { useState, useEffect } from 'react';
import { useHashRoute } from '../hooks/useHashRoute';
import { ROUTES } from '../routes';
import { useGetCallerUserProfile } from '../hooks/useQueries';
import { useStartExam, useGetExamHistory, useSubmitExam } from '../hooks/useExamQueries';
import ExamStartPanel from './exam/ExamStartPanel';
import ExamAttemptPanel from './exam/ExamAttemptPanel';
import ExamResultsPanel from './exam/ExamResultsPanel';
import ExamHistoryPanel from './exam/ExamHistoryPanel';
import ExamReviewPanel from './exam/ExamReviewPanel';

type ExamView = 'start' | 'attempt' | 'submitting' | 'results' | 'history' | 'review';

interface ExamAttemptData {
  attemptId: bigint;
  questionIds: bigint[];
  startTime: number;
  totalTimeSeconds: number;
  currentIndex: number;
  answers: Map<string, string>;
  markedForReview: Set<string>;
}

export default function ExamModeScreen() {
  const { currentRoute } = useHashRoute();
  const { data: userProfile } = useGetCallerUserProfile();
  const { data: attempts = [] } = useGetExamHistory();
  const startExamMutation = useStartExam();
  const submitExamMutation = useSubmitExam();

  const [view, setView] = useState<ExamView>('start');
  const [attemptData, setAttemptData] = useState<ExamAttemptData | null>(null);
  const [reviewAttemptId, setReviewAttemptId] = useState<bigint | null>(null);
  const [lastResult, setLastResult] = useState<any>(null);

  useEffect(() => {
    const params = new URLSearchParams(window.location.hash.split('?')[1] || '');
    const mode = params.get('mode');
    const attemptId = params.get('attemptId');

    if (mode === 'history') {
      setView('history');
    } else if (mode === 'review' && attemptId) {
      setReviewAttemptId(BigInt(attemptId));
      setView('review');
    } else {
      setView('start');
    }
  }, [currentRoute]);

  const handleStartExam = async () => {
    if (!userProfile?.course) return;

    try {
      const attemptId = await startExamMutation.mutateAsync(userProfile.course);
      const questionCount = userProfile.course === 'MSCIT' ? 15 : 25;
      const timeLimit = userProfile.course === 'MSCIT' ? 15 * 60 : 25 * 60;
      
      // Generate mock question IDs (in real app, these would come from backend)
      const questionIds = Array.from({ length: questionCount }, (_, i) => BigInt(i + 1));
      
      setAttemptData({
        attemptId,
        questionIds,
        startTime: Date.now(),
        totalTimeSeconds: timeLimit,
        currentIndex: 0,
        answers: new Map(),
        markedForReview: new Set(),
      });
      setView('attempt');
    } catch (error) {
      console.error('Failed to start exam:', error);
    }
  };

  const handleSubmitExam = async () => {
    if (!attemptData) return;

    setView('submitting');
    try {
      const answers = attemptData.questionIds.map((qid, index) => ({
        id: BigInt(index),
        questionId: qid,
        selectedOption: attemptData.answers.get(qid.toString()) || '',
        correct: false,
        timestamp: BigInt(Date.now()),
      }));

      const result = await submitExamMutation.mutateAsync({
        attemptId: attemptData.attemptId,
        answers,
      });
      
      setLastResult(result);
      setAttemptData(null);
      setView('results');
    } catch (error) {
      console.error('Failed to submit exam:', error);
      setView('attempt');
    }
  };

  const handleViewHistory = () => {
    window.location.hash = `${ROUTES.EXAM_MODE.path}?mode=history`;
  };

  const handleViewReview = (id: bigint) => {
    window.location.hash = `${ROUTES.EXAM_MODE.path}?mode=review&attemptId=${id.toString()}`;
  };

  const handleBackToStart = () => {
    setAttemptData(null);
    setReviewAttemptId(null);
    setLastResult(null);
    window.location.hash = ROUTES.EXAM_MODE.path;
  };

  const handleStartNewExam = () => {
    setLastResult(null);
    window.location.hash = ROUTES.EXAM_MODE.path;
  };

  const handleBackToHistory = () => {
    window.location.hash = `${ROUTES.EXAM_MODE.path}?mode=history`;
  };

  if (view === 'start') {
    return (
      <ExamStartPanel
        course={userProfile?.course || ''}
        onStartExam={handleStartExam}
        onViewHistory={handleViewHistory}
        isStarting={startExamMutation.isPending}
      />
    );
  }

  if (view === 'attempt' && attemptData) {
    return (
      <ExamAttemptPanel
        attemptId={attemptData.attemptId}
        questionIds={attemptData.questionIds}
        currentIndex={attemptData.currentIndex}
        totalTimeSeconds={attemptData.totalTimeSeconds}
        startTime={attemptData.startTime}
        selectedAnswer={attemptData.answers.get(attemptData.questionIds[attemptData.currentIndex]?.toString()) || null}
        isMarkedForReview={attemptData.markedForReview.has(attemptData.questionIds[attemptData.currentIndex]?.toString())}
        onSelectAnswer={(option) => {
          const qid = attemptData.questionIds[attemptData.currentIndex];
          const newAnswers = new Map(attemptData.answers);
          newAnswers.set(qid.toString(), option);
          setAttemptData({ ...attemptData, answers: newAnswers });
        }}
        onToggleMarkForReview={() => {
          const qid = attemptData.questionIds[attemptData.currentIndex];
          const newMarked = new Set(attemptData.markedForReview);
          const qidStr = qid.toString();
          if (newMarked.has(qidStr)) {
            newMarked.delete(qidStr);
          } else {
            newMarked.add(qidStr);
          }
          setAttemptData({ ...attemptData, markedForReview: newMarked });
        }}
        onNext={() => {
          if (attemptData.currentIndex < attemptData.questionIds.length - 1) {
            setAttemptData({ ...attemptData, currentIndex: attemptData.currentIndex + 1 });
          }
        }}
        onPrevious={() => {
          if (attemptData.currentIndex > 0) {
            setAttemptData({ ...attemptData, currentIndex: attemptData.currentIndex - 1 });
          }
        }}
        onSubmit={handleSubmitExam}
      />
    );
  }

  if (view === 'submitting') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-gray-950 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-orange-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-white text-xl font-semibold">Submitting your exam...</p>
        </div>
      </div>
    );
  }

  if (view === 'results' && lastResult) {
    return (
      <ExamResultsPanel
        result={lastResult}
        onViewReview={() => handleViewReview(lastResult.attemptId)}
        onViewHistory={handleViewHistory}
        onStartNew={handleStartNewExam}
      />
    );
  }

  if (view === 'history') {
    return (
      <ExamHistoryPanel
        onBack={handleBackToStart}
        onViewAttempt={handleViewReview}
      />
    );
  }

  if (view === 'review' && reviewAttemptId) {
    return (
      <ExamReviewPanel
        attemptId={reviewAttemptId}
        onBack={handleBackToHistory}
      />
    );
  }

  return null;
}
