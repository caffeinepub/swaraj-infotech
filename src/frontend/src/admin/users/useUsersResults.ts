import { useQuery } from '@tanstack/react-query';
import { useActor } from '../../hooks/useActor';
import type { UserProfile, ExamResult } from '../../backend';
import { Principal } from '@dfinity/principal';

export function useListUsers() {
  const { actor, isFetching: actorFetching } = useActor();

  return useQuery<Array<[Principal, UserProfile]>>({
    queryKey: ['admin-users'],
    queryFn: async () => {
      if (!actor) throw new Error('Actor not available');
      return actor.listUsers();
    },
    enabled: !!actor && !actorFetching,
  });
}

export function useGetUserExamHistory(userId?: bigint) {
  const { actor, isFetching: actorFetching } = useActor();

  return useQuery<ExamResult[]>({
    queryKey: ['admin-user-history', userId?.toString()],
    queryFn: async () => {
      if (!actor || !userId) throw new Error('Actor or userId not available');
      return actor.getUserExamHistory(userId);
    },
    enabled: !!actor && !actorFetching && !!userId,
  });
}

export function useExportUserResults() {
  const { actor, isFetching: actorFetching } = useActor();

  return useQuery<Array<[bigint, ExamResult[]]>>({
    queryKey: ['admin-export-results'],
    queryFn: async () => {
      if (!actor) throw new Error('Actor not available');
      return actor.exportUserResults();
    },
    enabled: false, // Manual trigger only
  });
}
