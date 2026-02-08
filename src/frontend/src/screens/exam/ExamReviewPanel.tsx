import { Button } from '@/components/ui/button';
import GlassCard from '../../components/GlassCard';
import { ArrowLeft, CheckCircle2, XCircle, Lightbulb } from 'lucide-react';
import { useGetExamReview } from '../../hooks/useExamQueries';
import { ScrollArea } from '@/components/ui/scroll-area';

interface ExamReviewPanelProps {
    attemptId: bigint;
    onBack: () => void;
}

export default function ExamReviewPanel({ attemptId, onBack }: ExamReviewPanelProps) {
    const { data: attempt, isLoading } = useGetExamReview(attemptId);

    if (isLoading) {
        return (
            <GlassCard className="p-8 text-center animate-fade-in">
                <div className="w-12 h-12 border-4 border-primary/30 border-t-primary rounded-full animate-spin mx-auto mb-4" />
                <p className="text-muted-foreground">Loading review...</p>
            </GlassCard>
        );
    }

    if (!attempt) {
        return (
            <GlassCard className="p-8 text-center animate-fade-in">
                <p className="text-muted-foreground">Attempt not found</p>
                <Button onClick={onBack} className="mt-4">Go Back</Button>
            </GlassCard>
        );
    }

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
                <div>
                    <h2 className="text-2xl font-bold">Exam Review</h2>
                    <p className="text-sm text-muted-foreground">
                        {attempt.examType} Exam - Attempt #{attemptId.toString()}
                    </p>
                </div>
            </div>

            <ScrollArea className="h-[calc(100vh-200px)]">
                <div className="space-y-4 pr-4">
                    {attempt.questionReviews.map((review, index) => {
                        const options = [
                            { label: 'A', text: review.question.optionA },
                            { label: 'B', text: review.question.optionB },
                            { label: 'C', text: review.question.optionC },
                            { label: 'D', text: review.question.optionD },
                        ];

                        return (
                            <GlassCard key={index} className="p-6 animate-fade-in">
                                <div className="flex items-start gap-4 mb-4">
                                    <div className={`shrink-0 w-10 h-10 rounded-full flex items-center justify-center ${
                                        review.userCorrect ? 'bg-primary/20' : 'bg-destructive/20'
                                    }`}>
                                        {review.userCorrect ? (
                                            <CheckCircle2 className="h-5 w-5 text-primary" />
                                        ) : (
                                            <XCircle className="h-5 w-5 text-destructive" />
                                        )}
                                    </div>
                                    <div className="flex-1">
                                        <div className="text-sm text-muted-foreground mb-2">
                                            Question {index + 1} of {attempt.questionReviews.length}
                                        </div>
                                        <h3 className="text-lg font-semibold leading-relaxed mb-4">
                                            {review.question.question}
                                        </h3>

                                        <div className="space-y-2 mb-4">
                                            {options.map((option) => {
                                                const isCorrect = option.label === review.question.answer;
                                                const isSelected = option.label === review.selectedOption;

                                                return (
                                                    <div
                                                        key={option.label}
                                                        className={`p-3 rounded-xl border-2 ${
                                                            isCorrect
                                                                ? 'border-primary bg-primary/10'
                                                                : isSelected
                                                                ? 'border-destructive bg-destructive/10'
                                                                : 'border-border/50'
                                                        }`}
                                                    >
                                                        <div className="flex items-start gap-3">
                                                            <div className={`shrink-0 w-7 h-7 rounded-full flex items-center justify-center text-sm font-semibold ${
                                                                isCorrect
                                                                    ? 'bg-primary text-primary-foreground'
                                                                    : isSelected
                                                                    ? 'bg-destructive text-destructive-foreground'
                                                                    : 'bg-muted text-muted-foreground'
                                                            }`}>
                                                                {option.label}
                                                            </div>
                                                            <div className="flex-1">
                                                                <div className="flex items-center gap-2">
                                                                    <span>{option.text}</span>
                                                                    {isCorrect && (
                                                                        <CheckCircle2 className="h-4 w-4 text-primary shrink-0" />
                                                                    )}
                                                                    {isSelected && !isCorrect && (
                                                                        <XCircle className="h-4 w-4 text-destructive shrink-0" />
                                                                    )}
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                );
                                            })}
                                        </div>

                                        {review.question.explanation && (
                                            <div className="glass-strong rounded-xl p-4 border border-primary/20">
                                                <div className="flex items-start gap-2 mb-2">
                                                    <Lightbulb className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                                                    <h4 className="font-semibold text-primary">Explanation</h4>
                                                </div>
                                                <p className="text-sm text-muted-foreground leading-relaxed">
                                                    {review.question.explanation}
                                                </p>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </GlassCard>
                        );
                    })}
                </div>
            </ScrollArea>
        </div>
    );
}
