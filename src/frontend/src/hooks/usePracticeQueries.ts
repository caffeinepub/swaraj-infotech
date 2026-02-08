import { useActor } from './useActor';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import type { Question, PracticeProgress } from '../backend';
import { getCachedQuestions, setCachedQuestions, getCachedBookmarks, setCachedBookmarks, addToOutbox, getOutbox, removeFromOutbox } from '../utils/practiceCache';

export function useGetQuestions(course: string | null, chapter: string | null, limit?: number, offset?: number) {
    const { actor, isFetching: actorFetching } = useActor();

    return useQuery<Question[]>({
        queryKey: ['questions', course, chapter, limit, offset],
        queryFn: async () => {
            if (!actor) throw new Error('Actor not available');
            
            try {
                const questions = await actor.getQuestions(
                    course,
                    chapter,
                    limit ? BigInt(limit) : null,
                    offset ? BigInt(offset) : null
                );
                
                // Cache the results
                if (course && chapter) {
                    setCachedQuestions(course, chapter, questions);
                }
                
                return questions;
            } catch (error) {
                // Try to return cached data on error
                if (course && chapter) {
                    const cached = getCachedQuestions(course, chapter);
                    if (cached) {
                        return cached;
                    }
                }
                throw error;
            }
        },
        enabled: !!actor && !actorFetching,
        staleTime: 5 * 60 * 1000, // 5 minutes
    });
}

export function useSubmitAnswer() {
    const { actor } = useActor();
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async ({ questionId, selectedOption }: { questionId: bigint; selectedOption: string }) => {
            if (!actor) throw new Error('Actor not available');
            
            try {
                const correct = await actor.submitAnswer(questionId, selectedOption);
                return correct;
            } catch (error) {
                // Queue for offline sync
                addToOutbox({
                    type: 'answer',
                    questionId: Number(questionId),
                    selectedOption,
                    timestamp: Date.now(),
                });
                throw error;
            }
        },
        onSuccess: () => {
            // Invalidate progress queries
            queryClient.invalidateQueries({ queryKey: ['practiceProgress'] });
        },
    });
}

export function useGetBookmarkedQuestions() {
    const { actor, isFetching: actorFetching } = useActor();

    return useQuery<Question[]>({
        queryKey: ['bookmarkedQuestions'],
        queryFn: async () => {
            if (!actor) throw new Error('Actor not available');
            
            try {
                const bookmarks = await actor.getBookmarkedQuestions();
                setCachedBookmarks(bookmarks);
                return bookmarks;
            } catch (error) {
                // Return cached bookmarks on error
                const cached = getCachedBookmarks();
                if (cached) {
                    return cached;
                }
                throw error;
            }
        },
        enabled: !!actor && !actorFetching,
        staleTime: 2 * 60 * 1000, // 2 minutes
    });
}

export function useToggleBookmark() {
    const { actor } = useActor();
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (questionId: bigint) => {
            if (!actor) throw new Error('Actor not available');
            
            try {
                await actor.toggleBookmark(questionId);
            } catch (error) {
                // Queue for offline sync
                addToOutbox({
                    type: 'bookmark',
                    questionId: Number(questionId),
                    timestamp: Date.now(),
                });
                throw error;
            }
        },
        onSuccess: () => {
            // Invalidate bookmarks and progress
            queryClient.invalidateQueries({ queryKey: ['bookmarkedQuestions'] });
            queryClient.invalidateQueries({ queryKey: ['practiceProgress'] });
        },
    });
}

export function useGetPracticeProgress(course: string, chapter: string) {
    const { actor, isFetching: actorFetching } = useActor();

    return useQuery<PracticeProgress>({
        queryKey: ['practiceProgress', course, chapter],
        queryFn: async () => {
            if (!actor) throw new Error('Actor not available');
            return actor.getPracticeProgress(course, chapter);
        },
        enabled: !!actor && !actorFetching && !!course && !!chapter,
        staleTime: 1 * 60 * 1000, // 1 minute
    });
}
