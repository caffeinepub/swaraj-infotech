import { useEffect, useState } from 'react';
import { BRAND_CONFIG } from '../config/brand';

export default function SplashScreen() {
    const [isVisible, setIsVisible] = useState(true);

    useEffect(() => {
        const timer = setTimeout(() => {
            setIsVisible(false);
        }, 2800);

        return () => clearTimeout(timer);
    }, []);

    return (
        <div 
            className={`fixed inset-0 z-50 flex items-center justify-center bg-background transition-opacity duration-500 ${
                isVisible ? 'opacity-100' : 'opacity-0'
            }`}
        >
            {/* Background texture */}
            <div 
                className="absolute inset-0 opacity-[0.02]"
                style={{
                    backgroundImage: 'url(/assets/generated/swaraj-it-bg-texture.dim_2048x2048.png)',
                    backgroundSize: 'cover',
                    backgroundPosition: 'center'
                }}
            />

            {/* Animated gradient orbs */}
            <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-primary/30 rounded-full blur-[100px] animate-pulse-glow" />
            <div className="absolute bottom-1/4 left-1/4 w-80 h-80 bg-accent/20 rounded-full blur-[80px] animate-pulse-glow" style={{ animationDelay: '1s' }} />

            <div className="relative z-10 flex flex-col items-center">
                {/* Rotating gradient ring */}
                <div className="relative mb-8">
                    <div className="absolute inset-0 animate-rotate-gradient">
                        <div className="w-64 h-64 rounded-full" style={{
                            background: 'conic-gradient(from 0deg, transparent 0%, oklch(0.68 0.21 35) 25%, oklch(0.75 0.26 38) 50%, transparent 75%, transparent 100%)',
                            filter: 'blur(20px)'
                        }} />
                    </div>
                    
                    {/* Logo container */}
                    <div className="relative w-64 h-64 flex items-center justify-center">
                        <div className="w-48 h-48 rounded-3xl glass-strong shadow-card flex items-center justify-center p-8 animate-scale-in border border-primary/30">
                            <img 
                                src={BRAND_CONFIG.logo.square}
                                alt={BRAND_CONFIG.altText}
                                className="w-full h-full object-contain"
                            />
                        </div>
                    </div>
                </div>

                {/* Brand name */}
                <h1 className="text-4xl md:text-5xl font-bold text-gradient-orange mb-4 animate-fade-in" style={{ animationDelay: '0.3s' }}>
                    {BRAND_CONFIG.name}
                </h1>
                
                {/* Tagline */}
                <p className="text-lg text-muted-foreground animate-fade-in mb-2" style={{ animationDelay: '0.5s' }}>
                    {BRAND_CONFIG.tagline}
                </p>

                {/* Loading indicator */}
                <div className="mt-12 flex gap-2 animate-fade-in" style={{ animationDelay: '0.7s' }}>
                    <div className="w-2 h-2 rounded-full bg-primary animate-pulse-glow" />
                    <div className="w-2 h-2 rounded-full bg-primary animate-pulse-glow" style={{ animationDelay: '0.2s' }} />
                    <div className="w-2 h-2 rounded-full bg-primary animate-pulse-glow" style={{ animationDelay: '0.4s' }} />
                </div>
            </div>
        </div>
    );
}
