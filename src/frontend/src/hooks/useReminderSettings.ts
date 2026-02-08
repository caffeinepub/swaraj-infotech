import { useState, useEffect } from 'react';

interface ReminderSettings {
  dailyReminder: boolean;
  newContentReminder: boolean;
  reminderBannerDismissed: boolean;
}

const STORAGE_KEY = 'swaraj_reminder_settings';

const DEFAULT_SETTINGS: ReminderSettings = {
  dailyReminder: false,
  newContentReminder: false,
  reminderBannerDismissed: false,
};

export function useReminderSettings() {
  const [settings, setSettings] = useState<ReminderSettings>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      return stored ? { ...DEFAULT_SETTINGS, ...JSON.parse(stored) } : DEFAULT_SETTINGS;
    } catch {
      return DEFAULT_SETTINGS;
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
    } catch (error) {
      console.error('Failed to save reminder settings:', error);
    }
  }, [settings]);

  const updateSettings = (updates: Partial<ReminderSettings>) => {
    setSettings(prev => ({ ...prev, ...updates }));
  };

  const dismissReminderBanner = () => {
    updateSettings({ reminderBannerDismissed: true });
  };

  const resetReminderBanner = () => {
    updateSettings({ reminderBannerDismissed: false });
  };

  return {
    settings,
    updateSettings,
    dismissReminderBanner,
    resetReminderBanner,
  };
}
