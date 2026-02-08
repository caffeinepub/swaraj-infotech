import { useEffect, useState } from 'react';

interface ExamTimerRingProps {
    totalSeconds: number;
    remainingSeconds: number;
    onTimeUp: () => void;
}

export default function ExamTimerRing({ totalSeconds, remainingSeconds, onTimeUp }: ExamTimerRingProps) {
    const [localRemaining, setLocalRemaining] = useState(remainingSeconds);

    useEffect(() => {
        setLocalRemaining(remainingSeconds);
    }, [remainingSeconds]);

    useEffect(() => {
        if (localRemaining <= 0) {
            onTimeUp();
            return;
        }

        const timer = setInterval(() => {
            setLocalRemaining(prev => {
                if (prev <= 1) {
                    clearInterval(timer);
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);

        return () => clearInterval(timer);
    }, [localRemaining, onTimeUp]);

    const progress = (localRemaining / totalSeconds) * 100;
    const minutes = Math.floor(localRemaining / 60);
    const seconds = localRemaining % 60;
    const circumference = 2 * Math.PI * 54;
    const strokeDashoffset = circumference - (progress / 100) * circumference;

    const isLowTime = localRemaining <= 60;
    const isCritical = localRemaining <= 30;

    return (
        <div className="flex flex-col items-center gap-2">
            <div className="relative w-32 h-32">
                <svg className="w-full h-full -rotate-90" viewBox="0 0 120 120">
                    {/* Background circle */}
                    <circle
                        cx="60"
                        cy="60"
                        r="54"
                        fill="none"
                        stroke="oklch(var(--muted))"
                        strokeWidth="8"
                        opacity="0.2"
                    />
                    {/* Progress circle */}
                    <circle
                        cx="60"
                        cy="60"
                        r="54"
                        fill="none"
                        stroke={isCritical ? 'oklch(var(--destructive))' : isLowTime ? 'oklch(var(--accent))' : 'oklch(var(--primary))'}
                        strokeWidth="8"
                        strokeDasharray={circumference}
                        strokeDashoffset={strokeDashoffset}
                        strokeLinecap="round"
                        className="transition-all duration-1000 ease-linear"
                        style={{
                            filter: isCritical ? 'drop-shadow(0 0 8px oklch(var(--destructive)))' : 'drop-shadow(0 0 8px oklch(var(--primary) / 0.5))'
                        }}
                    />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                    <div className={`text-center ${isCritical ? 'animate-pulse' : ''}`}>
                        <div className={`text-2xl font-bold ${isCritical ? 'text-destructive' : isLowTime ? 'text-accent' : 'text-primary'}`}>
                            {minutes}:{seconds.toString().padStart(2, '0')}
                        </div>
                    </div>
                </div>
            </div>
            <p className={`text-sm ${isCritical ? 'text-destructive font-semibold' : 'text-muted-foreground'}`}>
                {isCritical ? 'Time almost up!' : isLowTime ? 'Hurry up!' : 'Time remaining'}
            </p>
        </div>
    );
}
