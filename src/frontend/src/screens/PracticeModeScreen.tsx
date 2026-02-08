import { useState, useEffect } from 'react';
import { useHashRoute } from '../hooks/useHashRoute';
import { ROUTES } from '../routes';
import GlassCard from '../components/GlassCard';
import { Button } from '@/components/ui/button';
import { ArrowLeft, BookOpen, Play, ChevronLeft, ChevronRight, Lightbulb, Eye, EyeOff, Bookmark, BookmarkCheck, Loader2 } from 'lucide-react';
import { useGetQuestions, useSubmitAnswer, useToggleBookmark, useGetPracticeProgress } from '../hooks/usePracticeQueries';
import { useGetCallerUserProfile } from '../hooks/useQueries';
import { useOfflinePracticeSync } from '../hooks/useOfflinePracticeSync';
import type { Question } from '../backend';
import { Badge } from '@/components/ui/badge';
import { getOutbox } from '../utils/practiceCache';

type Step = 'chapter-select' | 'question-list' | 'question-view';

const CHAPTERS = [
    'Introduction to Programming',
    'Data Types and Variables',
    'Control Flow',
    'Functions',
    'Arrays and Objects',
    'DOM Manipulation',
    'Events',
    'Async Programming',
];

export default function PracticeModeScreen() {
    const { navigate } = useHashRoute();
    const { data: userProfile } = useGetCallerUserProfile();
    const [step, setStep] = useState<Step>('chapter-select');
    const [selectedChapter, setSelectedChapter] = useState<string | null>(null);
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [showHint, setShowHint] = useState(false);
    const [showAnswer, setShowAnswer] = useState(false);
    const [selectedOption, setSelectedOption] = useState<string | null>(null);
    const [bookmarkedIds, setBookmarkedIds] = useState<Set<number>>(new Set());

    // Sync offline actions
    useOfflinePracticeSync();

    // Get URL params for deep linking
    useEffect(() => {
        const params = new URLSearchParams(window.location.search);
        const chapter = params.get('chapter');
        const questionId = params.get('questionId');
        
        if (chapter) {
            setSelectedChapter(chapter);
            setStep('question-list');
            
            if (questionId) {
                // Will be handled after questions load
            }
        }
    }, []);

    const course = userProfile?.course || 'MSCIT';
    
    const { data: questions = [], isLoading: questionsLoading, error: questionsError } = useGetQuestions(
        course,
        selectedChapter,
        undefined,
        undefined
    );

    const { data: progress } = useGetPracticeProgress(
        course,
        selectedChapter || ''
    );

    const submitAnswerMutation = useSubmitAnswer();
    const toggleBookmarkMutation = useToggleBookmark();

    const currentQuestion = questions[currentQuestionIndex];
    const isOffline = !navigator.onLine;
    const outboxCount = getOutbox().length;

    useEffect(() => {
        if (currentQuestion) {
            setShowHint(false);
            setShowAnswer(false);
            setSelectedOption(null);
        }
    }, [currentQuestion?.id]);

    const handleChapterSelect = (chapter: string) => {
        setSelectedChapter(chapter);
        setStep('question-list');
        setCurrentQuestionIndex(0);
    };

    const handleStartPractice = () => {
        if (questions.length > 0) {
            setStep('question-view');
        }
    };

    const handleOptionSelect = (option: string) => {
        setSelectedOption(option);
        if (currentQuestion) {
            submitAnswerMutation.mutate({
                questionId: currentQuestion.id,
                selectedOption: option,
            });
        }
    };

    const handleToggleBookmark = () => {
        if (!currentQuestion) return;
        
        const questionId = Number(currentQuestion.id);
        const newBookmarked = new Set(bookmarkedIds);
        
        if (newBookmarked.has(questionId)) {
            newBookmarked.delete(questionId);
        } else {
            newBookmarked.add(questionId);
        }
        
        setBookmarkedIds(newBookmarked);
        toggleBookmarkMutation.mutate(currentQuestion.id);
    };

    const handlePrevious = () => {
        if (currentQuestionIndex > 0) {
            setCurrentQuestionIndex(currentQuestionIndex - 1);
        }
    };

    const handleNext = () => {
        if (currentQuestionIndex < questions.length - 1) {
            setCurrentQuestionIndex(currentQuestionIndex + 1);
        }
    };

    const getDifficultyColor = (difficulty: string) => {
        switch (difficulty) {
            case 'easy': return 'bg-green-500/20 text-green-400 border-green-500/30';
            case 'medium': return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
            case 'hard': return 'bg-red-500/20 text-red-400 border-red-500/30';
            default: return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
        }
    };

    // Chapter Selection Step
    if (step === 'chapter-select') {
        return (
            <div className="container mx-auto px-4 py-6 md:py-8">
                <Button
                    variant="ghost"
                    onClick={() => navigate(ROUTES.DASHBOARD.path)}
                    className="mb-6 hover:bg-primary/10"
                >
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Back to Dashboard
                </Button>

                {isOffline && (
                    <div className="mb-4 p-3 rounded-lg bg-yellow-500/10 border border-yellow-500/30 text-yellow-400 text-sm">
                        You're offline. Showing cached data. {outboxCount > 0 && `${outboxCount} action(s) queued for sync.`}
                    </div>
                )}

                <div className="mb-6">
                    <h1 className="text-3xl md:text-4xl font-bold mb-2 flex items-center gap-3">
                        <BookOpen className="h-8 w-8 text-primary" />
                        Practice Mode
                    </h1>
                    <p className="text-muted-foreground">Select a chapter to start practicing</p>
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                    {CHAPTERS.map((chapter) => (
                        <GlassCard
                            key={chapter}
                            className="animate-fade-in hover:shadow-glow-sm cursor-pointer transition-all"
                            onClick={() => handleChapterSelect(chapter)}
                        >
                            <div className="p-6">
                                <h3 className="text-lg font-semibold mb-3">{chapter}</h3>
                                <div className="flex gap-4 text-sm text-muted-foreground">
                                    <span>Answered: 0</span>
                                    <span>Bookmarked: 0</span>
                                    <span>Wrong: 0</span>
                                </div>
                            </div>
                        </GlassCard>
                    ))}
                </div>
            </div>
        );
    }

    // Question List Step
    if (step === 'question-list') {
        return (
            <div className="container mx-auto px-4 py-6 md:py-8">
                <Button
                    variant="ghost"
                    onClick={() => setStep('chapter-select')}
                    className="mb-6 hover:bg-primary/10"
                >
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Back to Chapters
                </Button>

                {isOffline && (
                    <div className="mb-4 p-3 rounded-lg bg-yellow-500/10 border border-yellow-500/30 text-yellow-400 text-sm">
                        You're offline. Showing cached questions. {outboxCount > 0 && `${outboxCount} action(s) queued for sync.`}
                    </div>
                )}

                <div className="mb-6">
                    <h1 className="text-2xl md:text-3xl font-bold mb-2">{selectedChapter}</h1>
                    <p className="text-muted-foreground">
                        {questions.length} question{questions.length !== 1 ? 's' : ''} available
                    </p>
                    {progress && (
                        <div className="flex gap-4 mt-2 text-sm">
                            <span className="text-green-400">Answered: {Number(progress.totalAnswered)}</span>
                            <span className="text-yellow-400">Bookmarked: {Number(progress.totalBookmarked)}</span>
                            <span className="text-red-400">Wrong: {Number(progress.totalWrong)}</span>
                        </div>
                    )}
                </div>

                {questionsLoading ? (
                    <div className="text-center py-12">
                        <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-primary" />
                        <p className="text-muted-foreground">Loading questions...</p>
                    </div>
                ) : questionsError ? (
                    <GlassCard className="p-8 text-center">
                        <p className="text-red-400 mb-4">Failed to load questions</p>
                        <p className="text-sm text-muted-foreground">{(questionsError as Error).message}</p>
                    </GlassCard>
                ) : questions.length === 0 ? (
                    <GlassCard className="p-12 text-center">
                        <BookOpen className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
                        <h3 className="text-xl font-semibold mb-2">No questions available</h3>
                        <p className="text-muted-foreground">Questions for this chapter will be added soon</p>
                    </GlassCard>
                ) : (
                    <>
                        <Button
                            size="lg"
                            onClick={handleStartPractice}
                            className="mb-6 gradient-orange shadow-glow-orange hover:shadow-glow"
                        >
                            <Play className="mr-2 h-5 w-5" />
                            Start Practice
                        </Button>

                        <div className="space-y-3">
                            {questions.map((question, index) => (
                                <GlassCard
                                    key={question.id.toString()}
                                    className="animate-fade-in hover:shadow-glow-sm cursor-pointer"
                                    onClick={() => {
                                        setCurrentQuestionIndex(index);
                                        setStep('question-view');
                                    }}
                                >
                                    <div className="p-4">
                                        <div className="flex items-start gap-3">
                                            <div className="w-8 h-8 rounded-lg glass-strong flex items-center justify-center flex-shrink-0 text-sm font-semibold">
                                                {index + 1}
                                            </div>
                                            <div className="flex-1">
                                                <p className="font-medium mb-2">{question.question}</p>
                                                <Badge className={getDifficultyColor(question.difficulty)}>
                                                    {question.difficulty}
                                                </Badge>
                                            </div>
                                        </div>
                                    </div>
                                </GlassCard>
                            ))}
                        </div>
                    </>
                )}
            </div>
        );
    }

    // Question View Step
    if (!currentQuestion) {
        return (
            <div className="container mx-auto px-4 py-6 md:py-8">
                <Button
                    variant="ghost"
                    onClick={() => setStep('question-list')}
                    className="mb-6 hover:bg-primary/10"
                >
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Back to Questions
                </Button>
                <GlassCard className="p-12 text-center">
                    <p className="text-muted-foreground">No question selected</p>
                </GlassCard>
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 py-6 md:py-8 pb-24">
            <Button
                variant="ghost"
                onClick={() => setStep('question-list')}
                className="mb-6 hover:bg-primary/10"
            >
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Questions
            </Button>

            {isOffline && (
                <div className="mb-4 p-3 rounded-lg bg-yellow-500/10 border border-yellow-500/30 text-yellow-400 text-sm">
                    You're offline. Your answers will sync when you're back online. {outboxCount > 0 && `${outboxCount} action(s) queued.`}
                </div>
            )}

            <GlassCard className="animate-fade-in mb-6">
                <div className="p-6 md:p-8">
                    {/* Header */}
                    <div className="flex items-center justify-between mb-6">
                        <div className="flex items-center gap-3">
                            <Badge className={getDifficultyColor(currentQuestion.difficulty)}>
                                {currentQuestion.difficulty}
                            </Badge>
                            <span className="text-sm text-muted-foreground">
                                Question {currentQuestionIndex + 1} of {questions.length}
                            </span>
                        </div>
                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={handleToggleBookmark}
                            disabled={toggleBookmarkMutation.isPending}
                            className="hover:bg-primary/10"
                        >
                            {bookmarkedIds.has(Number(currentQuestion.id)) ? (
                                <BookmarkCheck className="h-5 w-5 text-primary" />
                            ) : (
                                <Bookmark className="h-5 w-5" />
                            )}
                        </Button>
                    </div>

                    {/* Question */}
                    <h2 className="text-xl md:text-2xl font-semibold mb-6">
                        {currentQuestion.question}
                    </h2>

                    {/* Options */}
                    <div className="space-y-3 mb-6">
                        {[
                            { key: 'A', text: currentQuestion.optionA },
                            { key: 'B', text: currentQuestion.optionB },
                            { key: 'C', text: currentQuestion.optionC },
                            { key: 'D', text: currentQuestion.optionD },
                        ].map((option) => {
                            const isSelected = selectedOption === option.key;
                            const isCorrect = showAnswer && option.key === currentQuestion.answer;
                            const isWrong = showAnswer && isSelected && option.key !== currentQuestion.answer;

                            return (
                                <button
                                    key={option.key}
                                    onClick={() => handleOptionSelect(option.key)}
                                    disabled={submitAnswerMutation.isPending}
                                    className={`w-full p-4 rounded-xl text-left transition-all border ${
                                        isCorrect
                                            ? 'bg-green-500/20 border-green-500/50 text-green-400'
                                            : isWrong
                                            ? 'bg-red-500/20 border-red-500/50 text-red-400'
                                            : isSelected
                                            ? 'glass-strong border-primary/50 shadow-glow-sm'
                                            : 'glass border-primary/20 hover:border-primary/40 hover:shadow-glow-sm'
                                    }`}
                                >
                                    <div className="flex items-start gap-3">
                                        <div className={`shrink-0 w-8 h-8 rounded-full flex items-center justify-center font-semibold ${
                                            isCorrect
                                                ? 'bg-green-500 text-white'
                                                : isWrong
                                                ? 'bg-red-500 text-white'
                                                : isSelected
                                                ? 'bg-primary text-primary-foreground'
                                                : 'bg-muted text-muted-foreground'
                                        }`}>
                                            {option.key}
                                        </div>
                                        <span className="flex-1">{option.text}</span>
                                    </div>
                                </button>
                            );
                        })}
                    </div>

                    {/* Hint */}
                    {currentQuestion.hint && (
                        <div className="mb-6">
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => setShowHint(!showHint)}
                                className="mb-3"
                            >
                                <Lightbulb className="mr-2 h-4 w-4" />
                                {showHint ? 'Hide Hint' : 'Show Hint'}
                            </Button>
                            {showHint && (
                                <div className="glass-strong rounded-xl p-4 border border-primary/20">
                                    <p className="text-sm text-muted-foreground">{currentQuestion.hint}</p>
                                </div>
                            )}
                        </div>
                    )}

                    {/* Answer & Explanation */}
                    <div className="mb-6">
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setShowAnswer(!showAnswer)}
                            className="mb-3"
                        >
                            {showAnswer ? <EyeOff className="mr-2 h-4 w-4" /> : <Eye className="mr-2 h-4 w-4" />}
                            {showAnswer ? 'Hide Answer' : 'Show Answer'}
                        </Button>
                        {showAnswer && (
                            <div className="glass-strong rounded-xl p-4 border border-primary/20 space-y-3">
                                <div>
                                    <span className="text-sm text-muted-foreground">Correct Answer: </span>
                                    <span className="font-semibold text-green-400">{currentQuestion.answer}</span>
                                </div>
                                {currentQuestion.explanation && (
                                    <div>
                                        <span className="text-sm text-muted-foreground block mb-1">Explanation:</span>
                                        <p className="text-sm">{currentQuestion.explanation}</p>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>

                    {/* Navigation */}
                    <div className="flex items-center justify-between">
                        <Button
                            variant="outline"
                            onClick={handlePrevious}
                            disabled={currentQuestionIndex === 0}
                        >
                            <ChevronLeft className="mr-2 h-4 w-4" />
                            Previous
                        </Button>
                        <Button
                            variant="outline"
                            onClick={handleNext}
                            disabled={currentQuestionIndex === questions.length - 1}
                        >
                            Next
                            <ChevronRight className="ml-2 h-4 w-4" />
                        </Button>
                    </div>
                </div>
            </GlassCard>
        </div>
    );
}
