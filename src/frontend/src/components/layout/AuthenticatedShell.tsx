import { ReactNode } from 'react';

interface AuthenticatedShellProps {
    children: ReactNode;
    onLogout: () => void;
}

export default function AuthenticatedShell({ children }: AuthenticatedShellProps) {
    return (
        <div className="min-h-screen bg-background relative overflow-hidden">
            {/* Background texture */}
            <div 
                className="fixed inset-0 opacity-[0.03] pointer-events-none"
                style={{
                    backgroundImage: 'url(/assets/generated/swaraj-it-bg-texture.dim_2048x2048.png)',
                    backgroundSize: 'cover',
                    backgroundPosition: 'center'
                }}
            />
            
            {/* Enhanced gradient orbs with animation */}
            <div className="fixed top-0 right-0 w-[700px] h-[700px] bg-primary/20 rounded-full blur-[140px] pointer-events-none animate-pulse-glow" />
            <div className="fixed bottom-0 left-0 w-[600px] h-[600px] bg-accent/15 rounded-full blur-[120px] pointer-events-none animate-pulse-glow" style={{ animationDelay: '1s' }} />
            <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-primary/10 rounded-full blur-[100px] pointer-events-none" />

            <div className="relative z-10 pb-20">
                {children}
            </div>
        </div>
    );
}
