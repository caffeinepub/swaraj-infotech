import { ReactNode } from 'react';
import { cn } from '@/lib/utils';

interface GlassCardProps extends React.HTMLAttributes<HTMLDivElement> {
    children: ReactNode;
    className?: string;
    style?: React.CSSProperties;
}

export default function GlassCard({ children, className, style, ...props }: GlassCardProps) {
    return (
        <div 
            className={cn(
                'glass rounded-3xl shadow-card transition-all duration-500 hover:shadow-glow hover:scale-[1.02] border border-border/50 hover:border-primary/40 backdrop-blur-xl',
                className
            )}
            style={style}
            {...props}
        >
            {children}
        </div>
    );
}
