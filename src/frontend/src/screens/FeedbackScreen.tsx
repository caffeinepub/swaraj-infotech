import { useState } from 'react';
import { useHashRoute } from '../hooks/useHashRoute';
import { useSubmitFeedback } from '../hooks/useFeedback';
import { ROUTES } from '../routes';
import GlassCard from '../components/GlassCard';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { ArrowLeft, MessageSquare, Send, Mail } from 'lucide-react';
import { toast } from 'sonner';

export default function FeedbackScreen() {
    const { navigate } = useHashRoute();
    const submitFeedback = useSubmitFeedback();
    const [subject, setSubject] = useState('');
    const [message, setMessage] = useState('');
    const [contactDetail, setContactDetail] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!subject.trim() || !message.trim()) {
            toast.error('Please fill in subject and message');
            return;
        }

        try {
            await submitFeedback.mutateAsync({
                subject: subject.trim(),
                message: message.trim(),
                contactDetail: contactDetail.trim() || undefined,
            });

            toast.success('Feedback submitted successfully!');
            setSubject('');
            setMessage('');
            setContactDetail('');
        } catch (error) {
            toast.error('Failed to submit feedback. Please try again.');
        }
    };

    const handleMailtoFallback = () => {
        const mailtoLink = `mailto:support@swarajinfotech.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(message)}`;
        window.location.href = mailtoLink;
    };

    return (
        <div className="container mx-auto px-4 py-6 md:py-8">
            <Button
                variant="ghost"
                onClick={() => navigate(ROUTES.PROFILE.path)}
                className="mb-6 hover:bg-primary/10"
            >
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Profile
            </Button>

            <GlassCard className="animate-fade-in max-w-2xl mx-auto">
                <div className="p-8 md:p-12">
                    <div className="flex items-center gap-4 mb-6">
                        <div className="w-16 h-16 rounded-2xl gradient-orange flex items-center justify-center shadow-glow">
                            <MessageSquare className="h-8 w-8 text-primary-foreground" />
                        </div>
                        <div>
                            <h1 className="text-3xl font-bold">Send Feedback</h1>
                            <p className="text-muted-foreground">Help us improve the app</p>
                        </div>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="space-y-2">
                            <Label htmlFor="subject">Subject</Label>
                            <Input
                                id="subject"
                                placeholder="Brief description of your feedback"
                                value={subject}
                                onChange={(e) => setSubject(e.target.value)}
                                required
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="message">Message</Label>
                            <Textarea
                                id="message"
                                placeholder="Tell us more about your feedback, suggestions, or issues..."
                                value={message}
                                onChange={(e) => setMessage(e.target.value)}
                                rows={6}
                                required
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="contact">Contact Detail (Optional)</Label>
                            <Input
                                id="contact"
                                placeholder="Email or phone number for follow-up"
                                value={contactDetail}
                                onChange={(e) => setContactDetail(e.target.value)}
                            />
                            <p className="text-xs text-muted-foreground">
                                Provide your contact if you would like us to follow up with you
                            </p>
                        </div>

                        <div className="flex flex-col sm:flex-row gap-4">
                            <Button
                                type="submit"
                                size="lg"
                                className="flex-1 gradient-orange shadow-glow-orange"
                                disabled={submitFeedback.isPending}
                            >
                                {submitFeedback.isPending ? (
                                    <>
                                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2" />
                                        Submitting...
                                    </>
                                ) : (
                                    <>
                                        <Send className="mr-2 h-5 w-5" />
                                        Submit Feedback
                                    </>
                                )}
                            </Button>
                            <Button
                                type="button"
                                size="lg"
                                variant="outline"
                                onClick={handleMailtoFallback}
                            >
                                <Mail className="mr-2 h-5 w-5" />
                                Email Instead
                            </Button>
                        </div>
                    </form>

                    <p className="text-xs text-muted-foreground text-center mt-6">
                        Your feedback is stored securely and helps us improve the learning experience for everyone.
                    </p>
                </div>
            </GlassCard>
        </div>
    );
}
