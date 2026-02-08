import { useEffect, useState } from 'react';
import { Progress } from '@/components/ui/progress';

interface AnimatedProgressBarProps {
    value: number;
    className?: string;
}

export default function AnimatedProgressBar({ value, className }: AnimatedProgressBarProps) {
    const [animatedValue, setAnimatedValue] = useState(0);

    useEffect(() => {
        const timer = setTimeout(() => {
            setAnimatedValue(value);
        }, 100);

        return () => clearTimeout(timer);
    }, [value]);

    return (
        <div className="relative">
            <Progress 
                value={animatedValue} 
                className={`h-2 transition-all duration-1000 ease-out ${className}`}
            />
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-shimmer" />
        </div>
    );
}
