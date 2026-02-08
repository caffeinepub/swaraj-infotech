import { useQuery } from '@tanstack/react-query';
import { useActor } from './useActor';
import { useOtpSession } from './useOtpSession';

export function useReferralCode() {
  const { actor, isFetching: actorFetching } = useActor();
  const { isAuthenticated } = useOtpSession();

  return useQuery<string>({
    queryKey: ['referralCode'],
    queryFn: async () => {
      if (!actor) throw new Error('Actor not available');
      
      // Generate referral code from user's principal
      // This is a client-side implementation since backend doesn't have this method yet
      const profile = await actor.getCallerUserProfile();
      if (!profile) throw new Error('User profile not found');
      
      // Create a simple referral code from userId
      const code = `SWR${profile.userId.toString().padStart(6, '0')}`;
      return code;
    },
    enabled: !!actor && !actorFetching && isAuthenticated,
    staleTime: Infinity, // Referral code doesn't change
  });
}
