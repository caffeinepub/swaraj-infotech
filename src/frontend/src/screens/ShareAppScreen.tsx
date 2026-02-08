import { useState } from 'react';
import { useHashRoute } from '../hooks/useHashRoute';
import { useReferralCode } from '../hooks/useReferralCode';
import { useOtpSession } from '../hooks/useOtpSession';
import { ROUTES } from '../routes';
import { VIRAL_CONFIG } from '../config/viral';
import GlassCard from '../components/GlassCard';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, Share2, Copy, Check } from 'lucide-react';
import { SiWhatsapp } from 'react-icons/si';

export default function ShareAppScreen() {
    const { navigate } = useHashRoute();
    const { isAuthenticated } = useOtpSession();
    const { data: referralCode, isLoading: referralLoading } = useReferralCode();
    const [copied, setCopied] = useState(false);
    const [referralCopied, setReferralCopied] = useState(false);

    const shareUrl = VIRAL_CONFIG.share.playStoreLink;
    const shareText = VIRAL_CONFIG.share.baseText;

    const handleWhatsAppShare = () => {
        const text = encodeURIComponent(`${VIRAL_CONFIG.share.whatsAppText}\n\n${shareUrl}`);
        const whatsappUrl = `https://wa.me/?text=${text}`;
        window.open(whatsappUrl, '_blank');
    };

    const handleWebShare = async () => {
        if (navigator.share) {
            try {
                await navigator.share({
                    title: 'Swaraj Infotech Learning App',
                    text: shareText,
                    url: shareUrl,
                });
            } catch (error) {
                console.log('Share cancelled or failed');
            }
        } else {
            handleCopy();
        }
    };

    const handleCopy = () => {
        navigator.clipboard.writeText(shareUrl);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const handleReferralCopy = () => {
        if (referralCode) {
            const text = VIRAL_CONFIG.referral.shareText(referralCode);
            navigator.clipboard.writeText(`${text}\n\n${shareUrl}`);
            setReferralCopied(true);
            setTimeout(() => setReferralCopied(false), 2000);
        }
    };

    const handleReferralShare = () => {
        if (!referralCode) return;
        
        const text = encodeURIComponent(`${VIRAL_CONFIG.referral.shareText(referralCode)}\n\n${shareUrl}`);
        const whatsappUrl = `https://wa.me/?text=${text}`;
        window.open(whatsappUrl, '_blank');
    };

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

            <GlassCard className="animate-fade-in mb-6">
                <div className="p-8 md:p-12 text-center">
                    <div className="w-20 h-20 mx-auto rounded-2xl gradient-orange flex items-center justify-center mb-6 shadow-glow">
                        <Share2 className="h-10 w-10 text-primary-foreground" />
                    </div>
                    <h1 className="text-3xl md:text-4xl font-bold mb-4">Share the App</h1>
                    <p className="text-muted-foreground text-lg mb-8 max-w-2xl mx-auto">
                        Help your friends and classmates excel in their studies by sharing this app with them!
                    </p>

                    <div className="flex flex-col sm:flex-row gap-4 justify-center max-w-2xl mx-auto">
                        {VIRAL_CONFIG.features.whatsAppShare && (
                            <Button
                                size="lg"
                                onClick={handleWhatsAppShare}
                                className="bg-[#25D366] hover:bg-[#20BD5A] text-white shadow-lg"
                            >
                                <SiWhatsapp className="mr-2 h-5 w-5" />
                                Share on WhatsApp
                            </Button>
                        )}
                        
                        {VIRAL_CONFIG.features.webShare && (
                            <Button
                                size="lg"
                                onClick={handleWebShare}
                                className="gradient-orange shadow-glow-orange hover:shadow-glow"
                            >
                                <Share2 className="mr-2 h-5 w-5" />
                                Share App
                            </Button>
                        )}
                        
                        {VIRAL_CONFIG.features.copyLink && (
                            <Button
                                size="lg"
                                variant="outline"
                                onClick={handleCopy}
                            >
                                {copied ? (
                                    <>
                                        <Check className="mr-2 h-5 w-5" />
                                        Copied!
                                    </>
                                ) : (
                                    <>
                                        <Copy className="mr-2 h-5 w-5" />
                                        Copy Link
                                    </>
                                )}
                            </Button>
                        )}
                    </div>
                </div>
            </GlassCard>

            {/* Referral Code Section */}
            {VIRAL_CONFIG.features.referralCodes && VIRAL_CONFIG.referral.enabled && isAuthenticated && (
                <Card className="animate-fade-in border-primary/20">
                    <CardHeader>
                        <CardTitle className="text-xl">Your Referral Code</CardTitle>
                    </CardHeader>
                    <CardContent>
                        {referralLoading ? (
                            <div className="flex items-center justify-center py-4">
                                <div className="w-8 h-8 border-4 border-primary/30 border-t-primary rounded-full animate-spin" />
                            </div>
                        ) : referralCode ? (
                            <div className="space-y-4">
                                <div className="flex gap-2">
                                    <Input
                                        value={referralCode}
                                        readOnly
                                        className="font-mono text-lg text-center"
                                    />
                                    <Button
                                        variant="outline"
                                        onClick={handleReferralCopy}
                                    >
                                        {referralCopied ? (
                                            <Check className="h-4 w-4" />
                                        ) : (
                                            <Copy className="h-4 w-4" />
                                        )}
                                    </Button>
                                </div>
                                <div className="flex gap-2">
                                    <Button
                                        className="flex-1 bg-[#25D366] hover:bg-[#20BD5A] text-white"
                                        onClick={handleReferralShare}
                                    >
                                        <SiWhatsapp className="mr-2 h-4 w-4" />
                                        Share Referral Code
                                    </Button>
                                </div>
                                <p className="text-sm text-muted-foreground text-center">
                                    Share your referral code with friends to help them discover the app!
                                </p>
                            </div>
                        ) : (
                            <p className="text-center text-muted-foreground">
                                Unable to load referral code
                            </p>
                        )}
                    </CardContent>
                </Card>
            )}
        </div>
    );
}
