import { Button } from '@/components/ui/button';
import GlassCard from '../../components/GlassCard';
import { ArrowLeft, Trophy, Clock, Target, Eye } from 'lucide-react';
import { useGetExamHistory } from '../../hooks/useExamQueries';
import { Badge } from '@/components/ui/badge';

interface ExamHistoryPanelProps {
    onBack: () => void;
    onViewAttempt: (attemptId: bigint) => void;
}

export default function ExamHistoryPanel({ onBack, onViewAttempt }: ExamHistoryPanelProps) {
    const { data: history, isLoading } = useGetExamHistory();

    return (
        <div className="space-y-6">
            <div className="flex items-center gap-4">
                <Button
                    variant="ghost"
                    onClick={onBack}
                    className="hover:bg-primary/10"
                >
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Back
                </Button>
                <h2 className="text-2xl font-bold">Exam History</h2>
            </div>

            {isLoading ? (
                <GlassCard className="p-8 text-center animate-fade-in">
                    <div className="w-12 h-12 border-4 border-primary/30 border-t-primary rounded-full animate-spin mx-auto mb-4" />
                    <p className="text-muted-foreground">Loading history...</p>
                </GlassCard>
            ) : !history || history.length === 0 ? (
                <GlassCard className="p-8 text-center animate-fade-in">
                    <Trophy className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                    <h3 className="text-xl font-semibold mb-2">No Exam History</h3>
                    <p className="text-muted-foreground">
                        You haven't taken any exams yet. Start your first exam to see your history here.
                    </p>
                </GlassCard>
            ) : (
                <div className="space-y-4">
                    {history.map((attempt) => {
                        const totalQuestions = attempt.questionReviews.length;
                        const correctAnswers = attempt.questionReviews.filter(q => q.userCorrect).length;
                        const accuracy = totalQuestions > 0 ? Math.round((correctAnswers / totalQuestions) * 100) : 0;
                        const timeUsedSeconds = Math.max(0, Number(attempt.timeRemaining));
                        const timeUsedMinutes = Math.floor(timeUsedSeconds / 60);
                        const timeUsedSecs = timeUsedSeconds % 60;

                        return (
                            <GlassCard 
                                key={attempt.attemptId.toString()} 
                                className="p-6 hover:shadow-glow cursor-pointer animate-fade-in"
                                onClick={() => onViewAttempt(attempt.attemptId)}
                            >
                                <div className="flex items-start justify-between gap-4">
                                    <div className="flex-1">
                                        <div className="flex items-center gap-3 mb-3">
                                            <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                                                attempt.passed ? 'gradient-orange' : 'bg-muted'
                                            }`}>
                                                <Trophy className={`h-6 w-6 ${
                                                    attempt.passed ? 'text-primary-foreground' : 'text-muted-foreground'
                                                }`} />
                                            </div>
                                            <div>
                                                <h3 className="font-semibold text-lg">{attempt.examType} Exam</h3>
                                                <p className="text-sm text-muted-foreground">
                                                    Attempt #{attempt.attemptId.toString()}
                                                </p>
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-3 gap-4 mb-3">
                                            <div className="flex items-center gap-2">
                                                <Target className="h-4 w-4 text-primary" />
                                                <div>
                                                    <div className="text-sm font-semibold">{Number(attempt.score)}%</div>
                                                    <div className="text-xs text-muted-foreground">Score</div>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <Trophy className="h-4 w-4 text-primary" />
                                                <div>
                                                    <div className="text-sm font-semibold">{accuracy}%</div>
                                                    <div className="text-xs text-muted-foreground">Accuracy</div>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <Clock className="h-4 w-4 text-primary" />
                                                <div>
                                                    <div className="text-sm font-semibold">
                                                        {timeUsedMinutes}:{timeUsedSecs.toString().padStart(2, '0')}
                                                    </div>
                                                    <div className="text-xs text-muted-foreground">Time Used</div>
                                                </div>
                                            </div>
                                        </div>

                                        <Badge variant={attempt.passed ? 'default' : 'secondary'}>
                                            {attempt.passed ? 'Passed' : 'Not Passed'}
                                        </Badge>
                                    </div>

                                    <Button variant="ghost" size="sm">
                                        <Eye className="h-4 w-4" />
                                    </Button>
                                </div>
                            </GlassCard>
                        );
                    })}
                </div>
            )}
        </div>
    );
}
