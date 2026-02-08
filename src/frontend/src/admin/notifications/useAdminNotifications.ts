import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useActor } from '../../hooks/useActor';
import type { Notification } from '../../backend';
import { toast } from 'sonner';
import { ADMIN_TEXT } from '../components/EnglishText';

export function useListNotifications() {
  const { actor, isFetching: actorFetching } = useActor();

  return useQuery<Notification[]>({
    queryKey: ['admin-notifications'],
    queryFn: async () => {
      if (!actor) throw new Error('Actor not available');
      return actor.listNotifications();
    },
    enabled: !!actor && !actorFetching,
  });
}

export function useCreateNotification() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: { title: string; message: string; targetSegment: string }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.createNotification(data.title, data.message, data.targetSegment);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-notifications'] });
      toast.success(ADMIN_TEXT.NOTIFICATION_SENT);
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to create notification');
    },
  });
}
