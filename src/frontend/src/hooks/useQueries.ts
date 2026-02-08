import { useActor } from './useActor';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import type { UserProfile } from '../backend';

export function useSendOtp() {
    const { actor } = useActor();

    return useMutation({
        mutationFn: async (phoneNumber: string) => {
            if (!actor) throw new Error('Actor not available');
            await actor.sendOtp(phoneNumber);
        },
    });
}

export function useVerifyOtp() {
    const { actor } = useActor();

    return useMutation({
        mutationFn: async ({ phoneNumber, otp }: { phoneNumber: string; otp: string }) => {
            if (!actor) throw new Error('Actor not available');
            return actor.verifyOtp(phoneNumber, otp);
        },
    });
}

export function useSaveProfile() {
    const { actor } = useActor();
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (profile: { name: string; phone: string; course: string }) => {
            if (!actor) throw new Error('Actor not available');
            await actor.saveCallerUserProfile(profile);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['userProfile'] });
        },
    });
}

export function useGetCallerUserProfile() {
    const { actor, isFetching: actorFetching } = useActor();

    const query = useQuery<UserProfile | null>({
        queryKey: ['userProfile'],
        queryFn: async () => {
            if (!actor) throw new Error('Actor not available');
            return actor.getCallerUserProfile();
        },
        enabled: !!actor && !actorFetching,
        retry: false,
    });

    return {
        ...query,
        isLoading: actorFetching || query.isLoading,
        isFetched: !!actor && query.isFetched,
    };
}
