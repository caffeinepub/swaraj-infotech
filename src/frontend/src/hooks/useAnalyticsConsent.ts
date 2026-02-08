import { useState, useEffect } from 'react';

const STORAGE_KEY = 'swaraj_analytics_consent';

export function useAnalyticsConsent() {
  const [hasConsented, setHasConsented] = useState<boolean | null>(null);

  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      setHasConsented(stored === 'true');
    } catch {
      setHasConsented(false);
    }
  }, []);

  const grantConsent = () => {
    try {
      localStorage.setItem(STORAGE_KEY, 'true');
      setHasConsented(true);
    } catch (error) {
      console.error('Failed to save analytics consent:', error);
    }
  };

  const revokeConsent = () => {
    try {
      localStorage.setItem(STORAGE_KEY, 'false');
      setHasConsented(false);
    } catch (error) {
      console.error('Failed to revoke analytics consent:', error);
    }
  };

  return {
    hasConsented,
    isLoading: hasConsented === null,
    grantConsent,
    revokeConsent,
  };
}
