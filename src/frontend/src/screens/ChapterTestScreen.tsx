import { useHashRoute } from '../hooks/useHashRoute';
import { ROUTES } from '../routes';
import GlassCard from '../components/GlassCard';
import { Button } from '@/components/ui/button';
import { ArrowLeft, FileCheck, Play } from 'lucide-react';

export default function ChapterTestScreen() {
    const { navigate } = useHashRoute();

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

            <GlassCard className="animate-fade-in">
                <div className="p-8 md:p-12 text-center">
                    <div className="w-20 h-20 mx-auto rounded-2xl gradient-orange flex items-center justify-center mb-6 shadow-glow">
                        <FileCheck className="h-10 w-10 text-primary-foreground" />
                    </div>
                    <h1 className="text-3xl md:text-4xl font-bold mb-4">Chapter Test</h1>
                    <p className="text-muted-foreground text-lg mb-8 max-w-2xl mx-auto">
                        Test your knowledge chapter by chapter. Track your progress and identify areas for improvement.
                    </p>
                    <Button size="lg" className="gradient-orange shadow-glow-orange hover:shadow-glow">
                        <Play className="mr-2 h-5 w-5" />
                        Start Chapter Test
                    </Button>
                </div>
            </GlassCard>
        </div>
    );
}
