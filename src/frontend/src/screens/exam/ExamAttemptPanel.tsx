import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import GlassCard from '../../components/GlassCard';
import { ChevronLeft, ChevronRight, Flag, Send } from 'lucide-react';
import ExamTimerRing from './ExamTimerRing';
import { useGetExamQuestion } from '../../hooks/useExamQueries';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';

interface ExamAttemptPanelProps {
    attemptId: bigint;
    questionIds: bigint[];
    currentIndex: number;
    totalTimeSeconds: number;
    startTime: number;
    selectedAnswer: string | null;
    isMarkedForReview: boolean;
    onSelectAnswer: (option: string) => void;
    onToggleMarkForReview: () => void;
    onNext: () => void;
    onPrevious: () => void;
    onSubmit: () => void;
}

export default function ExamAttemptPanel({
    attemptId,
    questionIds,
    currentIndex,
    totalTimeSeconds,
    startTime,
    selectedAnswer,
    isMarkedForReview,
    onSelectAnswer,
    onToggleMarkForReview,
    onNext,
    onPrevious,
    onSubmit,
}: ExamAttemptPanelProps) {
    const currentQuestionId = questionIds[currentIndex];
    const { data: questionReview, isLoading } = useGetExamQuestion(attemptId, currentQuestionId);
    const [remainingSeconds, setRemainingSeconds] = useState(totalTimeSeconds);
    const [showSubmitDialog, setShowSubmitDialog] = useState(false);

    useEffect(() => {
        const elapsed = Math.floor((Date.now() - startTime) / 1000);
        const remaining = Math.max(0, totalTimeSeconds - elapsed);
        setRemainingSeconds(remaining);
    }, [startTime, totalTimeSeconds]);

    const handleTimeUp = () => {
        onSubmit();
    };

    const handleSubmitClick = () => {
        setShowSubmitDialog(true);
    };

    const handleConfirmSubmit = () => {
        setShowSubmitDialog(false);
        onSubmit();
    };

    const isFirstQuestion = currentIndex === 0;
    const isLastQuestion = currentIndex === questionIds.length - 1;
    const totalQuestions = questionIds.length;

    const options = questionReview ? [
        { label: 'A', text: questionReview.question.optionA },
        { label: 'B', text: questionReview.question.optionB },
        { label: 'C', text: questionReview.question.optionC },
        { label: 'D', text: questionReview.question.optionD },
    ] : [];

    return (
        <div className="space-y-6">
            {/* Timer at top */}
            <div className="flex justify-center animate-fade-in">
                <ExamTimerRing 
                    totalSeconds={totalTimeSeconds}
                    remainingSeconds={remainingSeconds}
                    onTimeUp={handleTimeUp}
                />
            </div>

            {/* Question card */}
            <GlassCard className="p-6 md:p-8 animate-fade-in">
                {isLoading ? (
                    <div className="text-center py-12">
                        <div className="w-12 h-12 border-4 border-primary/30 border-t-primary rounded-full animate-spin mx-auto mb-4" />
                        <p className="text-muted-foreground">Loading question...</p>
                    </div>
                ) : questionReview ? (
                    <div className="space-y-6">
                        {/* Question header */}
                        <div className="flex items-start justify-between gap-4">
                            <div className="flex-1">
                                <div className="text-sm text-muted-foreground mb-2">
                                    Question {currentIndex + 1} of {totalQuestions}
                                </div>
                                <h3 className="text-xl font-semibold leading-relaxed">
                                    {questionReview.question.question}
                                </h3>
                            </div>
                            <Button
                                variant={isMarkedForReview ? 'default' : 'outline'}
                                size="sm"
                                onClick={onToggleMarkForReview}
                                className={isMarkedForReview ? 'gradient-orange' : ''}
                            >
                                <Flag className="h-4 w-4" />
                            </Button>
                        </div>

                        {/* Options */}
                        <div className="space-y-3">
                            {options.map((option) => {
                                const isSelected = selectedAnswer === option.label;
                                return (
                                    <button
                                        key={option.label}
                                        onClick={() => onSelectAnswer(option.label)}
                                        className={`w-full text-left p-4 rounded-2xl border-2 transition-all duration-300 ${
                                            isSelected
                                                ? 'border-primary bg-primary/10 shadow-glow-sm'
                                                : 'border-border/50 hover:border-primary/50 hover:bg-primary/5'
                                        }`}
                                    >
                                        <div className="flex items-start gap-3">
                                            <div className={`shrink-0 w-8 h-8 rounded-full flex items-center justify-center font-semibold ${
                                                isSelected
                                                    ? 'bg-primary text-primary-foreground'
                                                    : 'bg-muted text-muted-foreground'
                                            }`}>
                                                {option.label}
                                            </div>
                                            <div className="flex-1 pt-1">
                                                {option.text}
                                            </div>
                                        </div>
                                    </button>
                                );
                            })}
                        </div>
                    </div>
                ) : (
                    <div className="text-center py-12">
                        <p className="text-muted-foreground">Question not found</p>
                    </div>
                )}
            </GlassCard>

            {/* Bottom controls */}
            <GlassCard className="p-4 animate-fade-in">
                <div className="flex items-center justify-between gap-4">
                    <Button
                        variant="outline"
                        onClick={onPrevious}
                        disabled={isFirstQuestion}
                    >
                        <ChevronLeft className="h-4 w-4 mr-1" />
                        Previous
                    </Button>

                    <div className="text-center">
                        <div className="text-sm font-semibold text-primary">
                            {currentIndex + 1} / {totalQuestions}
                        </div>
                        <div className="text-xs text-muted-foreground">
                            {isMarkedForReview && <span className="text-accent">Marked for review</span>}
                        </div>
                    </div>

                    <div className="flex gap-2">
                        {isLastQuestion ? (
                            <Button
                                className="gradient-orange shadow-glow-orange"
                                onClick={handleSubmitClick}
                            >
                                <Send className="h-4 w-4 mr-1" />
                                Submit
                            </Button>
                        ) : (
                            <Button
                                onClick={onNext}
                            >
                                Next
                                <ChevronRight className="h-4 w-4 ml-1" />
                            </Button>
                        )}
                    </div>
                </div>
            </GlassCard>

            {/* Submit confirmation dialog */}
            <AlertDialog open={showSubmitDialog} onOpenChange={setShowSubmitDialog}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Submit Exam?</AlertDialogTitle>
                        <AlertDialogDescription>
                            Are you sure you want to submit your exam? You won't be able to change your answers after submission.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={handleConfirmSubmit} className="gradient-orange">
                            Submit Exam
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    );
}
