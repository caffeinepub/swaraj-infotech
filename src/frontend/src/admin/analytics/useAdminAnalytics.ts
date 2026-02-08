import { useQuery } from '@tanstack/react-query';
import { useActor } from '../../hooks/useActor';
import type { AnalyticsEvent } from '../../backend';

export function useGetAnalyticsEvents() {
  const { actor, isFetching: actorFetching } = useActor();

  return useQuery<AnalyticsEvent[]>({
    queryKey: ['adminAnalyticsEvents'],
    queryFn: async () => {
      if (!actor) throw new Error('Actor not available');
      return actor.getAnalyticsEvents();
    },
    enabled: !!actor && !actorFetching,
  });
}

export interface AnalyticsMetrics {
  totalUsers: number;
  activeUsers: number;
  appOpens: number;
  retentionRate: number;
}

export function useGetAnalyticsMetrics(startDate?: Date, endDate?: Date) {
  const { data: events = [], isLoading } = useGetAnalyticsEvents();

  const metrics: AnalyticsMetrics = {
    totalUsers: 0,
    activeUsers: 0,
    appOpens: 0,
    retentionRate: 0,
  };

  if (!events.length) {
    return { data: metrics, isLoading };
  }

  // Filter events by date range if provided
  let filteredEvents = events;
  if (startDate || endDate) {
    filteredEvents = events.filter(event => {
      const eventDate = new Date(Number(event.timestamp) / 1000000);
      if (startDate && eventDate < startDate) return false;
      if (endDate && eventDate > endDate) return false;
      return true;
    });
  }

  // Calculate metrics
  const uniqueUsers = new Set(
    filteredEvents
      .filter(e => e.userId !== undefined && e.userId !== null)
      .map(e => e.userId!.toString())
  );
  
  metrics.totalUsers = uniqueUsers.size;
  metrics.activeUsers = uniqueUsers.size; // Simplified: all users with events are active
  metrics.appOpens = filteredEvents.filter(e => e.eventType === 'app_opened').length;
  
  // Simple retention approximation: users with multiple app opens
  const userOpenCounts = new Map<string, number>();
  filteredEvents
    .filter(e => e.eventType === 'app_opened' && e.userId !== undefined && e.userId !== null)
    .forEach(e => {
      const userId = e.userId!.toString();
      userOpenCounts.set(userId, (userOpenCounts.get(userId) || 0) + 1);
    });
  
  const returningUsers = Array.from(userOpenCounts.values()).filter(count => count > 1).length;
  metrics.retentionRate = uniqueUsers.size > 0 
    ? Math.round((returningUsers / uniqueUsers.size) * 100) 
    : 0;

  return { data: metrics, isLoading };
}
