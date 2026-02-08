import { useMutation, useQuery } from '@tanstack/react-query';
import { useActor } from './useActor';

export interface FeedbackSubmission {
  subject: string;
  message: string;
  contactDetail?: string;
}

export function useSubmitFeedback() {
  const { actor } = useActor();

  return useMutation({
    mutationFn: async (feedback: FeedbackSubmission) => {
      if (!actor) throw new Error('Actor not available');
      
      // Store feedback as a notification with special target segment
      const feedbackText = `Subject: ${feedback.subject}\nMessage: ${feedback.message}${
        feedback.contactDetail ? `\nContact: ${feedback.contactDetail}` : ''
      }`;
      
      // Using createNotification as a workaround since backend doesn't have dedicated feedback storage
      // In production, this would use a dedicated feedback endpoint
      await actor.createNotification(
        `[FEEDBACK] ${feedback.subject}`,
        feedbackText,
        'admin_feedback'
      );
    },
  });
}

export function useGetFeedback() {
  const { actor, isFetching: actorFetching } = useActor();

  return useQuery({
    queryKey: ['adminFeedback'],
    queryFn: async () => {
      if (!actor) throw new Error('Actor not available');
      
      // Fetch all notifications and filter for feedback
      const notifications = await actor.listNotifications();
      return notifications.filter(n => n.targetSegment === 'admin_feedback');
    },
    enabled: !!actor && !actorFetching,
  });
}
