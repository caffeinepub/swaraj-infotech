import { Button } from '@/components/ui/button';
import GlassCard from '../../components/GlassCard';
import { Play, History, Clock, FileText, AlertCircle } from 'lucide-react';

interface ExamStartPanelProps {
    course: string;
    onStartExam: () => void;
    onViewHistory: () => void;
    isStarting: boolean;
}

export default function ExamStartPanel({ course, onStartExam, onViewHistory, isStarting }: ExamStartPanelProps) {
    const examConfig = course === 'MSCIT' 
        ? { questions: 15, minutes: 15 }
        : { questions: 25, minutes: 25 };

    return (
        <div className="space-y-6">
            <GlassCard className="p-8 animate-fade-in">
                <div className="text-center mb-8">
                    <div className="w-20 h-20 mx-auto rounded-2xl gradient-orange flex items-center justify-center mb-4 shadow-glow">
                        <FileText className="h-10 w-10 text-primary-foreground" />
                    </div>
                    <h2 className="text-3xl font-bold mb-2">{course} Exam Mode</h2>
                    <p className="text-muted-foreground">Real exam simulation with strict timing</p>
                </div>

                <div className="grid md:grid-cols-3 gap-4 mb-8">
                    <div className="glass-strong rounded-2xl p-4 text-center border border-primary/20">
                        <FileText className="h-8 w-8 mx-auto mb-2 text-primary" />
                        <div className="text-2xl font-bold text-primary">{examConfig.questions}</div>
                        <div className="text-sm text-muted-foreground">Questions</div>
                    </div>
                    <div className="glass-strong rounded-2xl p-4 text-center border border-primary/20">
                        <Clock className="h-8 w-8 mx-auto mb-2 text-primary" />
                        <div className="text-2xl font-bold text-primary">{examConfig.minutes}</div>
                        <div className="text-sm text-muted-foreground">Minutes</div>
                    </div>
                    <div className="glass-strong rounded-2xl p-4 text-center border border-primary/20">
                        <AlertCircle className="h-8 w-8 mx-auto mb-2 text-primary" />
                        <div className="text-2xl font-bold text-primary">1:1</div>
                        <div className="text-sm text-muted-foreground">Min/Question</div>
                    </div>
                </div>

                <div className="glass-strong rounded-2xl p-6 mb-8 border border-primary/20">
                    <h3 className="font-semibold mb-3 flex items-center gap-2">
                        <AlertCircle className="h-5 w-5 text-primary" />
                        Exam Rules
                    </h3>
                    <ul className="space-y-2 text-sm text-muted-foreground">
                        <li className="flex items-start gap-2">
                            <span className="text-primary mt-0.5">•</span>
                            <span>Exactly {examConfig.questions} multiple choice questions</span>
                        </li>
                        <li className="flex items-start gap-2">
                            <span className="text-primary mt-0.5">•</span>
                            <span>Total time: {examConfig.minutes} minutes (1 minute per question)</span>
                        </li>
                        <li className="flex items-start gap-2">
                            <span className="text-primary mt-0.5">•</span>
                            <span>Questions are randomly selected from all chapters</span>
                        </li>
                        <li className="flex items-start gap-2">
                            <span className="text-primary mt-0.5">•</span>
                            <span>No question repeats within the same exam</span>
                        </li>
                        <li className="flex items-start gap-2">
                            <span className="text-primary mt-0.5">•</span>
                            <span>You can navigate between questions and mark for review</span>
                        </li>
                        <li className="flex items-start gap-2">
                            <span className="text-primary mt-0.5">•</span>
                            <span>Exam auto-submits when timer reaches zero</span>
                        </li>
                        <li className="flex items-start gap-2">
                            <span className="text-primary mt-0.5">•</span>
                            <span>Once submitted, you can review your answers with explanations</span>
                        </li>
                    </ul>
                </div>

                <div className="flex flex-col sm:flex-row gap-4">
                    <Button 
                        size="lg" 
                        className="flex-1 gradient-orange shadow-glow-orange hover:shadow-glow"
                        onClick={onStartExam}
                        disabled={isStarting}
                    >
                        {isStarting ? (
                            <>
                                <div className="w-4 h-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin mr-2" />
                                Starting Exam...
                            </>
                        ) : (
                            <>
                                <Play className="mr-2 h-5 w-5" />
                                Start Exam
                            </>
                        )}
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
            </GlassCard>
        </div>
    );
}
