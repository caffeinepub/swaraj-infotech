import GlassCard from '../GlassCard';
import AnimatedProgressBar from '../progress/AnimatedProgressBar';
import { Badge } from '@/components/ui/badge';

export default function QuickStats() {
    // Placeholder data - ready for future wiring
    const stats = {
        totalTests: 12,
        accuracy: 78,
        weakChapters: ['Arrays', 'Loops', 'Functions'],
    };

    return (
        <div className="mb-6 md:mb-8 animate-fade-in" style={{ animationDelay: '0.2s' }}>
            <h2 className="text-xl md:text-2xl font-bold mb-4 px-1">Quick Stats</h2>
            <GlassCard>
                <div className="p-6 md:p-8">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
                        {/* Total Tests */}
                        <div className="text-center md:text-left">
                            <div className="text-3xl md:text-4xl font-bold text-gradient-orange mb-1">
                                {stats.totalTests}
                            </div>
                            <div className="text-sm text-muted-foreground font-medium">Total Tests</div>
                        </div>

                        {/* Accuracy */}
                        <div className="text-center md:text-left">
                            <div className="text-3xl md:text-4xl font-bold text-gradient-orange mb-1">
                                {stats.accuracy}%
                            </div>
                            <div className="text-sm text-muted-foreground font-medium mb-2">Accuracy</div>
                            <AnimatedProgressBar value={stats.accuracy} />
                        </div>

                        {/* Weak Chapters */}
                        <div className="text-center md:text-left">
                            <div className="text-sm text-muted-foreground font-medium mb-3">Weak Chapters</div>
                            <div className="flex flex-wrap gap-2 justify-center md:justify-start">
                                {stats.weakChapters.map((chapter) => (
                                    <Badge 
                                        key={chapter} 
                                        variant="outline"
                                        className="glass-strong border-destructive/30 text-destructive hover:bg-destructive/10"
                                    >
                                        {chapter}
                                    </Badge>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </GlassCard>
        </div>
    );
}
