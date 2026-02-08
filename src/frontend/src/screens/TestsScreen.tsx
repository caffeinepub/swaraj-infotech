import { useHashRoute } from '../hooks/useHashRoute';
import { ROUTES } from '../routes';
import GlassCard from '../components/GlassCard';
import { Button } from '@/components/ui/button';
import { ArrowLeft, FileText } from 'lucide-react';

export default function TestsScreen() {
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

            <div className="mb-6">
                <h1 className="text-3xl md:text-4xl font-bold mb-2 flex items-center gap-3">
                    <FileText className="h-8 w-8 text-primary" />
                    Test History
                </h1>
                <p className="text-muted-foreground">View your completed tests and results</p>
            </div>

            <GlassCard className="p-12 text-center">
                <FileText className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
                <h3 className="text-xl font-semibold mb-2">No tests completed yet</h3>
                <p className="text-muted-foreground mb-6">Start practicing to see your test history here</p>
                <Button
                    onClick={() => navigate(ROUTES.PRACTICE_MODE.path)}
                    className="gradient-orange shadow-glow-orange hover:shadow-glow"
                >
                    Start Practicing
                </Button>
            </GlassCard>
        </div>
    );
}
