import { useState } from 'react';
import { Bell, X, BookOpen, Sparkles } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useReminderSettings } from '../../hooks/useReminderSettings';

export default function InAppRemindersCard() {
  const { settings, dismissReminderBanner } = useReminderSettings();
  const [visible, setVisible] = useState(!settings.reminderBannerDismissed);

  if (!visible) return null;

  const handleDismiss = () => {
    setVisible(false);
    dismissReminderBanner();
  };

  const showDailyReminder = settings.dailyReminder;
  const showNewContentReminder = settings.newContentReminder;

  // Only show if at least one reminder is enabled
  if (!showDailyReminder && !showNewContentReminder) return null;

  return (
    <Card className="mb-6 border-orange-500/30 bg-gradient-to-br from-orange-500/10 to-orange-600/5">
      <CardContent className="p-4 relative">
        <Button
          variant="ghost"
          size="icon"
          className="absolute top-2 right-2 h-6 w-6"
          onClick={handleDismiss}
        >
          <X className="h-4 w-4" />
        </Button>

        <div className="flex items-start gap-3 pr-8">
          <div className="w-10 h-10 rounded-full bg-orange-500/20 flex items-center justify-center shrink-0">
            <Bell className="h-5 w-5 text-orange-400" />
          </div>
          <div className="flex-1">
            <h3 className="font-semibold mb-2 text-orange-400">Reminders Active</h3>
            <div className="space-y-2 text-sm text-muted-foreground">
              {showDailyReminder && (
                <div className="flex items-center gap-2">
                  <BookOpen className="h-4 w-4 text-orange-400" />
                  <span>Daily quiz reminder enabled</span>
                </div>
              )}
              {showNewContentReminder && (
                <div className="flex items-center gap-2">
                  <Sparkles className="h-4 w-4 text-orange-400" />
                  <span>New content notifications enabled</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
