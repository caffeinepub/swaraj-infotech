import { useEffect } from 'react';
import { useActor } from './useActor';
import { useAnalyticsConsent } from './useAnalyticsConsent';
import { useGetCallerUserProfile } from './useQueries';

export function useAnalytics() {
  const { actor } = useActor();
  const { hasConsented } = useAnalyticsConsent();
  const { data: userProfile } = useGetCallerUserProfile();

  const recordEvent = async (eventType: string, details: string = '') => {
    // Only record if user has consented and actor is available
    if (!hasConsented || !actor || !userProfile) {
      return;
    }

    try {
      await actor.addAnalyticsEvent(eventType, userProfile.userId, details);
    } catch (error) {
      // Silently fail - analytics should not break the app
      console.error('Failed to record analytics event:', error);
    }
  };

  return {
    recordEvent,
    isEnabled: hasConsented === true,
  };
}

// Hook to record app open event
export function useRecordAppOpen() {
  const { recordEvent } = useAnalytics();
  const { data: userProfile } = useGetCallerUserProfile();

  useEffect(() => {
    if (userProfile) {
      recordEvent('app_opened', `course: ${userProfile.course}`);
    }
  }, [userProfile]);
}
