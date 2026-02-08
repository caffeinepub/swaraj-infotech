import { useGetCallerUserProfile } from '../hooks/useQueries';
import { useOtpSession } from '../hooks/useOtpSession';
import { useHashRoute } from '../hooks/useHashRoute';
import { useReminderSettings } from '../hooks/useReminderSettings';
import { useWebNotifications } from '../hooks/useWebNotifications';
import { useAnalyticsConsent } from '../hooks/useAnalyticsConsent';
import { ROUTES } from '../routes';
import GlassCard from '../components/GlassCard';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { ArrowLeft, User, Phone, BookOpen, LogOut, Bell, BellOff, BarChart3, MessageSquare } from 'lucide-react';
import { toast } from 'sonner';

export default function ProfileScreen() {
    const { data: userProfile, isLoading } = useGetCallerUserProfile();
    const { logout } = useOtpSession();
    const { navigate } = useHashRoute();
    const { settings, updateSettings } = useReminderSettings();
    const { permission, isSupported, requestPermission, sendTestNotification } = useWebNotifications();
    const { hasConsented, grantConsent, revokeConsent } = useAnalyticsConsent();

    const handleTestNotification = async () => {
        if (permission === 'granted') {
            const success = sendTestNotification();
            if (success) {
                toast.success('Test notification sent!');
            } else {
                toast.error('Failed to send test notification');
            }
        } else if (permission === 'default') {
            const result = await requestPermission();
            if (result === 'granted') {
                sendTestNotification();
                toast.success('Notification permission granted!');
            } else {
                toast.error('Notification permission denied');
            }
        } else {
            toast.error('Notification permission denied. Please enable in browser settings.');
        }
    };

    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <div className="w-16 h-16 border-4 border-primary/30 border-t-primary rounded-full animate-spin mx-auto mb-4" />
                    <p className="text-muted-foreground">Loading profile...</p>
                </div>
            </div>
        );
    }

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
                <div className="p-8 md:p-12">
                    <div className="flex flex-col items-center mb-8">
                        <div className="w-24 h-24 rounded-full gradient-orange flex items-center justify-center mb-4 shadow-glow">
                            <User className="h-12 w-12 text-primary-foreground" />
                        </div>
                        <h1 className="text-3xl font-bold mb-2">{userProfile?.name || 'User'}</h1>
                        <p className="text-muted-foreground">Student Profile</p>
                    </div>

                    <div className="space-y-4 max-w-md mx-auto mb-8">
                        <div className="glass-strong rounded-2xl p-4 flex items-center gap-4 border border-primary/20">
                            <Phone className="h-6 w-6 text-primary" />
                            <div>
                                <div className="text-sm text-muted-foreground">Phone Number</div>
                                <div className="font-semibold">{userProfile?.phone || 'N/A'}</div>
                            </div>
                        </div>

                        <div className="glass-strong rounded-2xl p-4 flex items-center gap-4 border border-primary/20">
                            <BookOpen className="h-6 w-6 text-primary" />
                            <div>
                                <div className="text-sm text-muted-foreground">Course</div>
                                <div className="font-semibold">{userProfile?.course || 'N/A'}</div>
                            </div>
                        </div>
                    </div>

                    <Separator className="my-8" />

                    {/* Reminder Settings */}
                    <div className="max-w-md mx-auto mb-8">
                        <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                            <Bell className="h-5 w-5 text-primary" />
                            Reminder Settings
                        </h2>
                        <div className="space-y-4">
                            <div className="flex items-center justify-between glass-strong rounded-xl p-4 border border-primary/20">
                                <div className="flex-1">
                                    <Label htmlFor="daily-reminder" className="text-base font-medium cursor-pointer">
                                        Daily Quiz Reminder
                                    </Label>
                                    <p className="text-sm text-muted-foreground">
                                        Get reminded to practice daily
                                    </p>
                                </div>
                                <Switch
                                    id="daily-reminder"
                                    checked={settings.dailyReminder}
                                    onCheckedChange={(checked) => updateSettings({ dailyReminder: checked })}
                                />
                            </div>

                            <div className="flex items-center justify-between glass-strong rounded-xl p-4 border border-primary/20">
                                <div className="flex-1">
                                    <Label htmlFor="new-content-reminder" className="text-base font-medium cursor-pointer">
                                        New Content Notifications
                                    </Label>
                                    <p className="text-sm text-muted-foreground">
                                        Get notified about new questions
                                    </p>
                                </div>
                                <Switch
                                    id="new-content-reminder"
                                    checked={settings.newContentReminder}
                                    onCheckedChange={(checked) => updateSettings({ newContentReminder: checked })}
                                />
                            </div>

                            {isSupported && (
                                <div className="glass-strong rounded-xl p-4 border border-primary/20">
                                    <div className="flex items-center gap-2 mb-2">
                                        {permission === 'granted' ? (
                                            <Bell className="h-4 w-4 text-green-500" />
                                        ) : (
                                            <BellOff className="h-4 w-4 text-muted-foreground" />
                                        )}
                                        <span className="text-sm font-medium">
                                            Browser Notifications: {permission === 'granted' ? 'Enabled' : permission === 'denied' ? 'Denied' : 'Not Set'}
                                        </span>
                                    </div>
                                    {permission === 'denied' && (
                                        <p className="text-xs text-muted-foreground mb-2">
                                            Browser notifications are blocked. Please enable them in your browser settings to receive reminders.
                                        </p>
                                    )}
                                    {permission === 'default' && (
                                        <p className="text-xs text-muted-foreground mb-2">
                                            Enable browser notifications to receive reminders even when the app is closed.
                                        </p>
                                    )}
                                    <Button
                                        size="sm"
                                        variant="outline"
                                        onClick={handleTestNotification}
                                        className="w-full"
                                    >
                                        {permission === 'granted' ? 'Send Test Notification' : 'Enable Notifications'}
                                    </Button>
                                </div>
                            )}
                            {!isSupported && (
                                <p className="text-xs text-muted-foreground text-center">
                                    Browser notifications are not supported on this device. In-app reminders will still work.
                                </p>
                            )}
                        </div>
                    </div>

                    <Separator className="my-8" />

                    {/* Analytics Settings */}
                    <div className="max-w-md mx-auto mb-8">
                        <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                            <BarChart3 className="h-5 w-5 text-primary" />
                            Privacy Settings
                        </h2>
                        <div className="flex items-center justify-between glass-strong rounded-xl p-4 border border-primary/20">
                            <div className="flex-1">
                                <Label htmlFor="analytics-consent" className="text-base font-medium cursor-pointer">
                                    Analytics & Usage Data
                                </Label>
                                <p className="text-sm text-muted-foreground">
                                    Help improve the app by sharing anonymous usage data
                                </p>
                            </div>
                            <Switch
                                id="analytics-consent"
                                checked={hasConsented === true}
                                onCheckedChange={(checked) => checked ? grantConsent() : revokeConsent()}
                            />
                        </div>
                    </div>

                    <Separator className="my-8" />

                    {/* Quick Actions */}
                    <div className="max-w-md mx-auto mb-8">
                        <h2 className="text-xl font-semibold mb-4">Quick Actions</h2>
                        <Button
                            variant="outline"
                            className="w-full justify-start"
                            onClick={() => navigate(ROUTES.FEEDBACK.path)}
                        >
                            <MessageSquare className="mr-2 h-5 w-5" />
                            Send Feedback
                        </Button>
                    </div>

                    <div className="flex justify-center">
                        <Button
                            variant="outline"
                            size="lg"
                            onClick={logout}
                            className="border-destructive/50 text-destructive hover:bg-destructive/10"
                        >
                            <LogOut className="mr-2 h-5 w-5" />
                            Logout
                        </Button>
                    </div>
                </div>
            </GlassCard>
        </div>
    );
}
