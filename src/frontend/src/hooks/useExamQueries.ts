import { useActor } from './useActor';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import type { ExamResult, ExamQuestionReview, UserAnswer } from '../backend';

export function useStartExam() {
    const { actor } = useActor();
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (course: string) => {
            if (!actor) throw new Error('Actor not available');
            const attemptId = await actor.startExam(course);
            return attemptId;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['examHistory'] });
        },
    });
}

export function useGetExamQuestion(attemptId: bigint | null, questionId: bigint | null) {
    const { actor, isFetching: actorFetching } = useActor();

    return useQuery<ExamQuestionReview>({
        queryKey: ['examQuestion', attemptId?.toString(), questionId?.toString()],
        queryFn: async () => {
            if (!actor) throw new Error('Actor not available');
            if (attemptId === null || questionId === null) {
                throw new Error('Attempt ID and Question ID are required');
            }
            return actor.getExamQuestion(attemptId, questionId);
        },
        enabled: !!actor && !actorFetching && attemptId !== null && questionId !== null,
        staleTime: 10 * 60 * 1000, // 10 minutes
    });
}

export function useSubmitExam() {
    const { actor } = useActor();
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async ({ attemptId, answers }: { attemptId: bigint; answers: UserAnswer[] }) => {
            if (!actor) throw new Error('Actor not available');
            const result = await actor.submitExam(attemptId, answers);
            return result;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['examHistory'] });
            queryClient.invalidateQueries({ queryKey: ['examAttempts'] });
        },
    });
}

export function useGetExamHistory() {
    const { actor, isFetching: actorFetching } = useActor();

    return useQuery<ExamResult[]>({
        queryKey: ['examHistory'],
        queryFn: async () => {
            if (!actor) throw new Error('Actor not available');
            const history = await actor.getAttempts();
            return history.sort((a, b) => Number(b.attemptId) - Number(a.attemptId));
        },
        enabled: !!actor && !actorFetching,
        staleTime: 2 * 60 * 1000, // 2 minutes
    });
}

export function useGetExamReview(attemptId: bigint | null) {
    const { actor, isFetching: actorFetching } = useActor();

    return useQuery<ExamResult | null>({
        queryKey: ['examReview', attemptId?.toString()],
        queryFn: async () => {
            if (!actor) throw new Error('Actor not available');
            if (attemptId === null) return null;
            
            const history = await actor.getAttempts();
            const attempt = history.find(a => a.attemptId === attemptId);
            return attempt || null;
        },
        enabled: !!actor && !actorFetching && attemptId !== null,
        staleTime: 10 * 60 * 1000, // 10 minutes
    });
}

// Export alias for backward compatibility
export const useGetAttempts = useGetExamHistory;
