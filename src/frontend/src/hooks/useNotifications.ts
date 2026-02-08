import { useQuery } from '@tanstack/react-query';
import { useActor } from './useActor';
import type { Notification } from '../backend';

export function useGetNotifications() {
  const { actor, isFetching: actorFetching } = useActor();

  return useQuery<Notification[]>({
    queryKey: ['notifications'],
    queryFn: async () => {
      if (!actor) throw new Error('Actor not available');
      return actor.getNotifications();
    },
    enabled: !!actor && !actorFetching,
  });
}
