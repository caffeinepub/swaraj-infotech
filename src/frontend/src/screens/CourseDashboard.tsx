import { useGetCallerUserProfile } from '../hooks/useQueries';
import { useLocalStreak } from '../hooks/useLocalStreak';
import { useHashRoute } from '../hooks/useHashRoute';
import { ROUTES } from '../routes';
import GlassCard from '../components/GlassCard';
import QuickStats from '../components/stats/QuickStats';
import InAppRemindersCard from '../components/reminders/InAppRemindersCard';
import { BookOpen, FileCheck, Trophy, TrendingUp, Share2, User, Flame } from 'lucide-react';

export default function CourseDashboard() {
    const { data: userProfile, isLoading } = useGetCallerUserProfile();
    const streak = useLocalStreak();
    const { navigate } = useHashRoute();

    const featureCards = [
        {
            title: 'Practice Mode',
            icon: BookOpen,
            route: ROUTES.PRACTICE_MODE.path,
            gradient: 'from-blue-500/20 to-blue-600/20',
            iconColor: 'text-blue-400',
        },
        {
            title: 'Chapter Test',
            icon: FileCheck,
            route: ROUTES.CHAPTER_TEST.path,
            gradient: 'from-purple-500/20 to-purple-600/20',
            iconColor: 'text-purple-400',
        },
        {
            title: 'Exam Mode',
            icon: Trophy,
            route: ROUTES.EXAM_MODE.path,
            gradient: 'from-orange-500/20 to-orange-600/20',
            iconColor: 'text-orange-400',
        },
        {
            title: 'Progress',
            icon: TrendingUp,
            route: ROUTES.PROGRESS.path,
            gradient: 'from-green-500/20 to-green-600/20',
            iconColor: 'text-green-400',
        },
        {
            title: 'Share App',
            icon: Share2,
            route: ROUTES.SHARE_APP.path,
            gradient: 'from-pink-500/20 to-pink-600/20',
            iconColor: 'text-pink-400',
        },
        {
            title: 'Profile',
            icon: User,
            route: ROUTES.PROFILE.path,
            gradient: 'from-cyan-500/20 to-cyan-600/20',
            iconColor: 'text-cyan-400',
        },
    ];

    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <div className="w-16 h-16 border-4 border-primary/30 border-t-primary rounded-full animate-spin mx-auto mb-4" />
                    <p className="text-muted-foreground">Loading dashboard...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 py-6 md:py-8">
            {/* Welcome Banner */}
            <GlassCard className="mb-6 md:mb-8 animate-fade-in overflow-hidden">
                <div className="p-6 md:p-8 relative">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-primary/20 to-accent/20 rounded-full blur-3xl" />
                    <div className="relative z-10">
                        <div className="flex items-start justify-between mb-4">
                            <div>
                                <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold mb-2">
                                    Welcome back, <span className="text-gradient-orange">{userProfile?.name || 'Student'}</span>!
                                </h1>
                                <p className="text-muted-foreground text-sm md:text-base">
                                    {userProfile?.course || 'Ready to continue your learning journey?'}
                                </p>
                            </div>
                            <div className="flex items-center gap-2 glass-strong px-4 py-2 rounded-xl border border-primary/30">
                                <Flame className="h-5 w-5 text-orange-400 animate-pulse-glow" />
                                <div className="text-right">
                                    <div className="text-2xl font-bold text-gradient-orange">{streak}</div>
                                    <div className="text-xs text-muted-foreground">day streak</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </GlassCard>

            {/* In-App Reminders Card */}
            <InAppRemindersCard />

            {/* Quick Stats */}
            <QuickStats />

            {/* Feature Cards Grid */}
            <div className="mb-6 md:mb-8">
                <h2 className="text-xl md:text-2xl font-bold mb-4 px-1">Quick Access</h2>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-6">
                    {featureCards.map((card, index) => {
                        const Icon = card.icon;
                        return (
                            <GlassCard
                                key={card.route}
                                className="cursor-pointer group animate-slide-up hover:shadow-glow-orange active:scale-95"
                                style={{ animationDelay: `${index * 0.1}s` }}
                                onClick={() => navigate(card.route)}
                            >
                                <div className="p-4 md:p-6 relative overflow-hidden">
                                    <div className={`absolute inset-0 bg-gradient-to-br ${card.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-300`} />
                                    <div className="relative z-10">
                                        <div className="w-12 h-12 md:w-14 md:h-14 rounded-xl glass-strong flex items-center justify-center mb-3 md:mb-4 group-hover:scale-110 transition-transform duration-300 border border-border/50">
                                            <Icon className={`h-6 w-6 md:h-7 md:w-7 ${card.iconColor}`} />
                                        </div>
                                        <h3 className="text-base md:text-lg font-semibold group-hover:text-gradient-orange transition-all">
                                            {card.title}
                                        </h3>
                                    </div>
                                </div>
                            </GlassCard>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}
