import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { InputOTP, InputOTPGroup, InputOTPSlot } from '@/components/ui/input-otp';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Phone, ArrowRight, RefreshCw, AlertCircle } from 'lucide-react';
import { validatePhoneNumber, normalizePhoneNumber } from '@/utils/phone';
import { useOtpSession } from '@/hooks/useOtpSession';
import { useSendOtp, useVerifyOtp } from '@/hooks/useQueries';
import CreateProfileForm from './CreateProfileForm';
import AuthFooter from './AuthFooter';
import { BRAND_CONFIG } from '../../config/brand';

type Step = 'phone' | 'otp' | 'profile';

export default function OtpAuthFlow() {
    const [step, setStep] = useState<Step>('phone');
    const [countryCode, setCountryCode] = useState('+91');
    const [phoneNumber, setPhoneNumber] = useState('');
    const [otp, setOtp] = useState('');
    const [error, setError] = useState('');
    const [isNewUser, setIsNewUser] = useState(false);

    const { login, authError } = useOtpSession();
    const sendOtpMutation = useSendOtp();
    const verifyOtpMutation = useVerifyOtp();

    const handleSendOtp = async () => {
        setError('');
        
        const validationError = validatePhoneNumber(phoneNumber);
        if (validationError) {
            setError(validationError);
            return;
        }

        const fullPhone = normalizePhoneNumber(countryCode, phoneNumber);
        
        try {
            await sendOtpMutation.mutateAsync(fullPhone);
            setStep('otp');
        } catch (err: any) {
            setError(err.message || 'Failed to send OTP. Please try again.');
        }
    };

    const handleVerifyOtp = async () => {
        setError('');
        
        if (otp.length !== 6) {
            setError('Please enter a valid 6-digit OTP');
            return;
        }

        const fullPhone = normalizePhoneNumber(countryCode, phoneNumber);
        
        try {
            const result = await verifyOtpMutation.mutateAsync({ phoneNumber: fullPhone, otp });
            login(result.token, fullPhone);
            
            if (result.isNew) {
                setIsNewUser(true);
                setStep('profile');
            }
            // If not new user, App.tsx will handle routing to home
        } catch (err: any) {
            setError(err.message || 'Invalid or expired OTP. Please try again.');
        }
    };

    const handleResendOtp = async () => {
        setError('');
        setOtp('');
        
        const fullPhone = normalizePhoneNumber(countryCode, phoneNumber);
        
        try {
            await sendOtpMutation.mutateAsync(fullPhone);
        } catch (err: any) {
            setError(err.message || 'Failed to resend OTP. Please try again.');
        }
    };

    const handleProfileComplete = () => {
        // Profile saved, App.tsx will route to home
    };

    return (
        <div className="min-h-screen bg-background relative overflow-hidden flex items-center justify-center">
            {/* Background texture */}
            <div 
                className="fixed inset-0 opacity-[0.03] pointer-events-none"
                style={{
                    backgroundImage: 'url(/assets/generated/swaraj-it-bg-texture.dim_2048x2048.png)',
                    backgroundSize: 'cover',
                    backgroundPosition: 'center'
                }}
            />
            
            {/* Gradient orbs */}
            <div className="fixed top-0 right-0 w-[700px] h-[700px] bg-primary/20 rounded-full blur-[140px] pointer-events-none animate-pulse-glow" />
            <div className="fixed bottom-0 left-0 w-[600px] h-[600px] bg-accent/15 rounded-full blur-[120px] pointer-events-none animate-pulse-glow" style={{ animationDelay: '1s' }} />

            <div className="relative z-10 w-full max-w-md mx-auto px-4 py-8">
                {/* Logo */}
                <div className="text-center mb-8 animate-fade-in">
                    <div className="w-20 h-20 mx-auto rounded-2xl glass-strong flex items-center justify-center p-3 shadow-glow-sm border border-primary/20 mb-4">
                        <img 
                            src={BRAND_CONFIG.logo.square}
                            alt={BRAND_CONFIG.altText}
                            className="w-full h-full object-contain"
                        />
                    </div>
                    <h1 className="text-3xl font-bold text-gradient-orange mb-2">{BRAND_CONFIG.name}</h1>
                    <p className="text-muted-foreground">{BRAND_CONFIG.tagline}</p>
                </div>

                {/* Auth Card */}
                <div className="glass-strong rounded-3xl p-8 shadow-card border border-primary/20 animate-scale-in">
                    {/* Error Alert */}
                    {(error || authError) && (
                        <Alert variant="destructive" className="mb-6">
                            <AlertCircle className="h-4 w-4" />
                            <AlertDescription>{error || authError}</AlertDescription>
                        </Alert>
                    )}

                    {step === 'phone' && (
                        <div className="space-y-6">
                            <div className="text-center mb-6">
                                <h2 className="text-2xl font-bold mb-2">Welcome Back</h2>
                                <p className="text-muted-foreground">Enter your phone number to continue</p>
                            </div>

                            <div className="space-y-4">
                                <div>
                                    <Label htmlFor="country-code">Country Code</Label>
                                    <Select value={countryCode} onValueChange={setCountryCode}>
                                        <SelectTrigger id="country-code" className="mt-1.5">
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="+91">🇮🇳 +91 (India)</SelectItem>
                                            <SelectItem value="+1">🇺🇸 +1 (USA)</SelectItem>
                                            <SelectItem value="+44">🇬🇧 +44 (UK)</SelectItem>
                                            <SelectItem value="+61">🇦🇺 +61 (Australia)</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>

                                <div>
                                    <Label htmlFor="phone">Phone Number</Label>
                                    <Input
                                        id="phone"
                                        type="tel"
                                        placeholder="Enter your phone number"
                                        value={phoneNumber}
                                        onChange={(e) => setPhoneNumber(e.target.value)}
                                        className="mt-1.5"
                                        disabled={sendOtpMutation.isPending}
                                    />
                                </div>
                            </div>

                            <Button
                                className="w-full gradient-orange shadow-glow-sm hover:shadow-glow font-semibold py-6 rounded-xl transition-all duration-300 hover:scale-105"
                                onClick={handleSendOtp}
                                disabled={sendOtpMutation.isPending}
                            >
                                {sendOtpMutation.isPending ? (
                                    <>
                                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2" />
                                        Sending OTP...
                                    </>
                                ) : (
                                    <>
                                        <Phone className="mr-2 h-5 w-5" />
                                        Send OTP
                                        <ArrowRight className="ml-2 h-5 w-5" />
                                    </>
                                )}
                            </Button>
                        </div>
                    )}

                    {step === 'otp' && (
                        <div className="space-y-6">
                            <div className="text-center mb-6">
                                <h2 className="text-2xl font-bold mb-2">Enter OTP</h2>
                                <p className="text-muted-foreground">
                                    We've sent a code to {countryCode} {phoneNumber}
                                </p>
                            </div>

                            <div className="flex justify-center">
                                <InputOTP
                                    maxLength={6}
                                    value={otp}
                                    onChange={setOtp}
                                    disabled={verifyOtpMutation.isPending}
                                >
                                    <InputOTPGroup>
                                        <InputOTPSlot index={0} />
                                        <InputOTPSlot index={1} />
                                        <InputOTPSlot index={2} />
                                        <InputOTPSlot index={3} />
                                        <InputOTPSlot index={4} />
                                        <InputOTPSlot index={5} />
                                    </InputOTPGroup>
                                </InputOTP>
                            </div>

                            <Button
                                className="w-full gradient-orange shadow-glow-sm hover:shadow-glow font-semibold py-6 rounded-xl transition-all duration-300 hover:scale-105"
                                onClick={handleVerifyOtp}
                                disabled={verifyOtpMutation.isPending || otp.length !== 6}
                            >
                                {verifyOtpMutation.isPending ? (
                                    <>
                                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2" />
                                        Verifying...
                                    </>
                                ) : (
                                    <>
                                        Verify OTP
                                        <ArrowRight className="ml-2 h-5 w-5" />
                                    </>
                                )}
                            </Button>

                            <div className="text-center">
                                <Button
                                    variant="ghost"
                                    className="text-muted-foreground hover:text-primary"
                                    onClick={handleResendOtp}
                                    disabled={sendOtpMutation.isPending}
                                >
                                    {sendOtpMutation.isPending ? (
                                        <>
                                            <div className="w-4 h-4 border-2 border-primary/30 border-t-primary rounded-full animate-spin mr-2" />
                                            Resending...
                                        </>
                                    ) : (
                                        <>
                                            <RefreshCw className="mr-2 h-4 w-4" />
                                            Resend OTP
                                        </>
                                    )}
                                </Button>
                            </div>

                            <div className="text-center">
                                <Button
                                    variant="ghost"
                                    className="text-sm text-muted-foreground hover:text-primary"
                                    onClick={() => {
                                        setStep('phone');
                                        setOtp('');
                                        setError('');
                                    }}
                                >
                                    Change Phone Number
                                </Button>
                            </div>
                        </div>
                    )}

                    {step === 'profile' && isNewUser && (
                        <CreateProfileForm 
                            phoneNumber={normalizePhoneNumber(countryCode, phoneNumber)} 
                            onComplete={handleProfileComplete} 
                        />
                    )}
                </div>

                {/* Footer */}
                <AuthFooter />
            </div>
        </div>
    );
}
