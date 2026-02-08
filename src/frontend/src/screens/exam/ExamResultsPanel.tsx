import { Button } from '@/components/ui/button';
import GlassCard from '../../components/GlassCard';
import { Trophy, Clock, Target, TrendingDown, Eye, History } from 'lucide-react';
import type { ExamResult } from '../../backend';

interface ExamResultsPanelProps {
    result: ExamResult;
    onViewReview: () => void;
    onViewHistory: () => void;
    onStartNew: () => void;
}

export default function ExamResultsPanel({ result, onViewReview, onViewHistory, onStartNew }: ExamResultsPanelProps) {
    const totalQuestions = result.questionReviews.length;
    const correctAnswers = result.questionReviews.filter(q => q.userCorrect).length;
    const accuracy = totalQuestions > 0 ? Math.round((correctAnswers / totalQuestions) * 100) : 0;
    const timeUsedSeconds = Math.max(0, Number(result.timeRemaining));
    const timeUsedMinutes = Math.floor(timeUsedSeconds / 60);
    const timeUsedSecs = timeUsedSeconds % 60;

    // Calculate weak chapters
    const chapterStats = new Map<string, { correct: number; total: number }>();
    result.questionReviews.forEach(review => {
        const chapter = review.question.chapter;
        const stats = chapterStats.get(chapter) || { correct: 0, total: 0 };
        stats.total += 1;
        if (review.userCorrect) stats.correct += 1;
        chapterStats.set(chapter, stats);
    });

    const weakChapters = Array.from(chapterStats.entries())
        .filter(([_, stats]) => stats.total > 0 && (stats.correct / stats.total) < 0.6)
        .map(([chapter, _]) => chapter)
        .slice(0, 3);

    return (
        <div className="space-y-6">
            <GlassCard className="p-8 text-center animate-fade-in">
                <div className={`w-24 h-24 mx-auto rounded-full flex items-center justify-center mb-6 ${
                    result.passed ? 'gradient-orange shadow-glow' : 'bg-muted'
                }`}>
                    <Trophy className={`h-12 w-12 ${result.passed ? 'text-primary-foreground' : 'text-muted-foreground'}`} />
                </div>
                <h2 className="text-3xl font-bold mb-2">
                    {result.passed ? 'Congratulations!' : 'Keep Practicing!'}
                </h2>
                <p className="text-muted-foreground mb-6">
                    {result.passed 
                        ? 'You passed the exam with flying colors!'
                        : 'Don\'t worry, practice makes perfect!'}
                </p>

                <div className="grid md:grid-cols-3 gap-4 mb-8">
                    <div className="glass-strong rounded-2xl p-6 border border-primary/20">
                        <Target className="h-8 w-8 mx-auto mb-2 text-primary" />
                        <div className="text-3xl font-bold text-primary mb-1">{Number(result.score)}%</div>
                        <div className="text-sm text-muted-foreground">Score</div>
                    </div>
                    <div className="glass-strong rounded-2xl p-6 border border-primary/20">
                        <Trophy className="h-8 w-8 mx-auto mb-2 text-primary" />
                        <div className="text-3xl font-bold text-primary mb-1">{accuracy}%</div>
                        <div className="text-sm text-muted-foreground">Accuracy</div>
                    </div>
                    <div className="glass-strong rounded-2xl p-6 border border-primary/20">
                        <Clock className="h-8 w-8 mx-auto mb-2 text-primary" />
                        <div className="text-3xl font-bold text-primary mb-1">
                            {timeUsedMinutes}:{timeUsedSecs.toString().padStart(2, '0')}
                        </div>
                        <div className="text-sm text-muted-foreground">Time Used</div>
                    </div>
                </div>

                <div className="glass-strong rounded-2xl p-6 mb-6 border border-primary/20 text-left">
                    <h3 className="font-semibold mb-3 flex items-center gap-2">
                        <Target className="h-5 w-5 text-primary" />
                        Performance Summary
                    </h3>
                    <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                            <span className="text-muted-foreground">Total Questions:</span>
                            <span className="font-semibold">{totalQuestions}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-muted-foreground">Correct Answers:</span>
                            <span className="font-semibold text-primary">{correctAnswers}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-muted-foreground">Wrong Answers:</span>
                            <span className="font-semibold text-destructive">{totalQuestions - correctAnswers}</span>
                        </div>
                    </div>
                </div>

                {weakChapters.length > 0 && (
                    <div className="glass-strong rounded-2xl p-6 mb-6 border border-accent/20 text-left">
                        <h3 className="font-semibold mb-3 flex items-center gap-2">
                            <TrendingDown className="h-5 w-5 text-accent" />
                            Weak Chapters
                        </h3>
                        <div className="flex flex-wrap gap-2">
                            {weakChapters.map((chapter, index) => (
                                <span 
                                    key={index}
                                    className="px-3 py-1 rounded-full bg-accent/10 text-accent text-sm border border-accent/20"
                                >
                                    {chapter}
                                </span>
                            ))}
                        </div>
                        <p className="text-xs text-muted-foreground mt-3">
                            Focus on these chapters to improve your performance
                        </p>
                    </div>
                )}

                <div className="flex flex-col sm:flex-row gap-4">
                    <Button 
                        size="lg" 
                        className="flex-1 gradient-orange shadow-glow-orange hover:shadow-glow"
                        onClick={onViewReview}
                    >
                        <Eye className="mr-2 h-5 w-5" />
                        View Detailed Review
                    </Button>
                    <Button 
                        size="lg" 
                        variant="outline"
                        className="flex-1"
                        onClick={onViewHistory}
                    >
                        <History className="mr-2 h-5 w-5" />
                        View History
                    </Button>
                </div>
                <Button 
                    size="lg" 
                    variant="ghost"
                    className="w-full mt-2"
                    onClick={onStartNew}
                >
                    Start New Exam
                </Button>
            </GlassCard>
        </div>
    );
}
