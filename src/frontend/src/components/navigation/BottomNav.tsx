import { Home, FileText, Bookmark, User } from 'lucide-react';
import { useHashRoute } from '../../hooks/useHashRoute';
import { ROUTES } from '../../routes';
import { cn } from '@/lib/utils';

export default function BottomNav() {
    const { currentRoute, navigate } = useHashRoute();

    const navItems = [
        { route: ROUTES.DASHBOARD.path, icon: Home, label: 'Home' },
        { route: ROUTES.TESTS.path, icon: FileText, label: 'Tests' },
        { route: ROUTES.BOOKMARKS.path, icon: Bookmark, label: 'Bookmarks' },
        { route: ROUTES.PROFILE.path, icon: User, label: 'Profile' },
    ];

    return (
        <nav className="fixed bottom-0 left-0 right-0 z-50 glass-strong border-t border-border/50 shadow-glow-sm">
            <div className="container mx-auto px-4">
                <div className="flex items-center justify-around h-16 md:h-20">
                    {navItems.map(({ route, icon: Icon, label }) => {
                        const isActive = currentRoute === route;
                        return (
                            <button
                                key={route}
                                onClick={() => navigate(route)}
                                className={cn(
                                    'flex flex-col items-center justify-center gap-1 px-4 py-2 rounded-xl transition-all duration-300 group relative',
                                    isActive 
                                        ? 'text-primary' 
                                        : 'text-muted-foreground hover:text-foreground'
                                )}
                            >
                                {isActive && (
                                    <div className="absolute inset-0 bg-primary/10 rounded-xl animate-pulse-glow" />
                                )}
                                <Icon 
                                    className={cn(
                                        'h-5 w-5 md:h-6 md:w-6 transition-all duration-300 relative z-10',
                                        isActive && 'scale-110',
                                        !isActive && 'group-hover:scale-110'
                                    )} 
                                />
                                <span className={cn(
                                    'text-xs font-medium relative z-10',
                                    isActive && 'font-semibold'
                                )}>
                                    {label}
                                </span>
                            </button>
                        );
                    })}
                </div>
            </div>
        </nav>
    );
}
