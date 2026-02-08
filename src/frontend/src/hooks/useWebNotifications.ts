import { useState, useEffect } from 'react';

type NotificationPermission = 'default' | 'granted' | 'denied';

export function useWebNotifications() {
  const [permission, setPermission] = useState<NotificationPermission>('default');
  const [isSupported, setIsSupported] = useState(false);

  useEffect(() => {
    if ('Notification' in window) {
      setIsSupported(true);
      setPermission(Notification.permission);
    }
  }, []);

  const requestPermission = async (): Promise<NotificationPermission> => {
    if (!isSupported) {
      return 'denied';
    }

    try {
      const result = await Notification.requestPermission();
      setPermission(result);
      return result;
    } catch (error) {
      console.error('Failed to request notification permission:', error);
      return 'denied';
    }
  };

  const sendTestNotification = () => {
    if (permission !== 'granted') {
      return false;
    }

    try {
      new Notification('Swaraj Infotech Learning', {
        body: 'Test notification - Your reminders are working!',
        icon: '/assets/generated/swaraj-it-logo.dim_1024x1024.png',
        badge: '/assets/generated/playstore-app-icon.dim_512x512.png',
      });
      return true;
    } catch (error) {
      console.error('Failed to send test notification:', error);
      return false;
    }
  };

  const sendReminder = (title: string, body: string) => {
    if (permission !== 'granted') {
      return false;
    }

    try {
      new Notification(title, {
        body,
        icon: '/assets/generated/swaraj-it-logo.dim_1024x1024.png',
        badge: '/assets/generated/playstore-app-icon.dim_512x512.png',
      });
      return true;
    } catch (error) {
      console.error('Failed to send reminder:', error);
      return false;
    }
  };

  return {
    permission,
    isSupported,
    requestPermission,
    sendTestNotification,
    sendReminder,
  };
}
