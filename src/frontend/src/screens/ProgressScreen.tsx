import { useHashRoute } from '../hooks/useHashRoute';
import { ROUTES } from '../routes';
import GlassCard from '../components/GlassCard';
import { Button } from '@/components/ui/button';
import { ArrowLeft, TrendingUp } from 'lucide-react';
import AnimatedProgressBar from '../components/progress/AnimatedProgressBar';

export default function ProgressScreen() {
    const { navigate } = useHashRoute();

    const chapters = [
        { name: 'Introduction to Programming', progress: 75 },
        { name: 'Data Types and Variables', progress: 60 },
        { name: 'Control Flow', progress: 45 },
        { name: 'Functions', progress: 30 },
        { name: 'Arrays and Objects', progress: 15 },
        { name: 'DOM Manipulation', progress: 0 },
    ];

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

            <div className="mb-6">
                <h1 className="text-3xl md:text-4xl font-bold mb-2 flex items-center gap-3">
                    <TrendingUp className="h-8 w-8 text-primary" />
                    Your Progress
                </h1>
                <p className="text-muted-foreground">Track your learning journey across all chapters</p>
            </div>

            <div className="space-y-4">
                {chapters.map((chapter, index) => (
                    <GlassCard
                        key={chapter.name}
                        className="animate-slide-up"
                        style={{ animationDelay: `${index * 0.1}s` }}
                    >
                        <div className="p-6">
                            <div className="flex items-center justify-between mb-3">
                                <h3 className="font-semibold">{chapter.name}</h3>
                                <span className="text-sm font-bold text-primary">{chapter.progress}%</span>
                            </div>
                            <AnimatedProgressBar value={chapter.progress} />
                        </div>
                    </GlassCard>
                ))}
            </div>
        </div>
    );
}
