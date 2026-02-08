import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useActor } from '../../hooks/useActor';
import { Difficulty, type Question } from '../../backend';
import { toast } from 'sonner';
import { ADMIN_TEXT } from '../components/EnglishText';

export function useSearchQuestions(
  course?: string,
  chapter?: string,
  difficulty?: Difficulty,
  limit?: number,
  offset?: number
) {
  const { actor, isFetching: actorFetching } = useActor();

  return useQuery<Question[]>({
    queryKey: ['admin-questions', course, chapter, difficulty, limit, offset],
    queryFn: async () => {
      if (!actor) throw new Error('Actor not available');
      return actor.searchQuestions(
        course || null,
        chapter || null,
        difficulty || null,
        limit ? BigInt(limit) : null,
        offset ? BigInt(offset) : null
      );
    },
    enabled: !!actor && !actorFetching,
  });
}

export function useCreateQuestion() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: {
      course: string;
      chapter: string;
      difficulty: Difficulty;
      question: string;
      optionA: string;
      optionB: string;
      optionC: string;
      optionD: string;
      answer: string;
      hint: string;
      explanation: string;
    }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.addQuestion(
        data.course,
        data.chapter,
        data.difficulty,
        data.question,
        data.optionA,
        data.optionB,
        data.optionC,
        data.optionD,
        data.answer,
        data.hint,
        data.explanation
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-questions'] });
      toast.success(ADMIN_TEXT.QUESTION_CREATED);
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to create question');
    },
  });
}

export function useUpdateQuestion() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: {
      id: bigint;
      course: string;
      chapter: string;
      difficulty: Difficulty;
      question: string;
      optionA: string;
      optionB: string;
      optionC: string;
      optionD: string;
      answer: string;
      hint: string;
      explanation: string;
    }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.updateQuestion(
        data.id,
        data.course,
        data.chapter,
        data.difficulty,
        data.question,
        data.optionA,
        data.optionB,
        data.optionC,
        data.optionD,
        data.answer,
        data.hint,
        data.explanation
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-questions'] });
      toast.success(ADMIN_TEXT.QUESTION_UPDATED);
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to update question');
    },
  });
}

export function useDeleteQuestion() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: bigint) => {
      if (!actor) throw new Error('Actor not available');
      return actor.deleteQuestion(id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-questions'] });
      toast.success(ADMIN_TEXT.QUESTION_DELETED);
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to delete question');
    },
  });
}

export function useBulkUploadQuestions() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (questions: Question[]) => {
      if (!actor) throw new Error('Actor not available');
      return actor.bulkUploadQuestions(questions);
    },
    onSuccess: (count) => {
      queryClient.invalidateQueries({ queryKey: ['admin-questions'] });
      toast.success(ADMIN_TEXT.IMPORT_SUCCESS.replace('{count}', count.toString()));
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to import questions');
    },
  });
}
