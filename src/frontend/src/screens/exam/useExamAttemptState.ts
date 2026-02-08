import { useState, useCallback } from 'react';
import type { UserAnswer } from '../../backend';

export interface ExamAttemptState {
    attemptId: bigint;
    questionIds: bigint[];
    currentIndex: number;
    answers: Map<string, string>; // questionId -> selectedOption
    markedForReview: Set<string>; // questionId set
    startTime: number;
}

export function useExamAttemptState(attemptId: bigint, questionIds: bigint[], startTime: number) {
    const [state, setState] = useState<ExamAttemptState>({
        attemptId,
        questionIds,
        currentIndex: 0,
        answers: new Map(),
        markedForReview: new Set(),
        startTime,
    });

    const setCurrentIndex = useCallback((index: number) => {
        setState(prev => ({ ...prev, currentIndex: index }));
    }, []);

    const goToNext = useCallback(() => {
        setState(prev => {
            if (prev.currentIndex < prev.questionIds.length - 1) {
                return { ...prev, currentIndex: prev.currentIndex + 1 };
            }
            return prev;
        });
    }, []);

    const goToPrevious = useCallback(() => {
        setState(prev => {
            if (prev.currentIndex > 0) {
                return { ...prev, currentIndex: prev.currentIndex - 1 };
            }
            return prev;
        });
    }, []);

    const setAnswer = useCallback((questionId: bigint, selectedOption: string) => {
        setState(prev => {
            const newAnswers = new Map(prev.answers);
            newAnswers.set(questionId.toString(), selectedOption);
            return { ...prev, answers: newAnswers };
        });
    }, []);

    const toggleMarkForReview = useCallback((questionId: bigint) => {
        setState(prev => {
            const newMarked = new Set(prev.markedForReview);
            const qidStr = questionId.toString();
            if (newMarked.has(qidStr)) {
                newMarked.delete(qidStr);
            } else {
                newMarked.add(qidStr);
            }
            return { ...prev, markedForReview: newMarked };
        });
    }, []);

    const buildSubmitPayload = useCallback((): UserAnswer[] => {
        return state.questionIds.map((qid, index) => {
            const qidStr = qid.toString();
            const selectedOption = state.answers.get(qidStr) || '';
            return {
                id: BigInt(index),
                questionId: qid,
                selectedOption,
                correct: false, // Will be determined by backend
                timestamp: BigInt(Date.now()),
            };
        });
    }, [state.questionIds, state.answers]);

    const getCurrentQuestionId = useCallback(() => {
        return state.questionIds[state.currentIndex] || null;
    }, [state.questionIds, state.currentIndex]);

    const getAnswer = useCallback((questionId: bigint) => {
        return state.answers.get(questionId.toString()) || null;
    }, [state.answers]);

    const isMarkedForReview = useCallback((questionId: bigint) => {
        return state.markedForReview.has(questionId.toString());
    }, [state.markedForReview]);

    return {
        state,
        setCurrentIndex,
        goToNext,
        goToPrevious,
        setAnswer,
        toggleMarkForReview,
        buildSubmitPayload,
        getCurrentQuestionId,
        getAnswer,
        isMarkedForReview,
    };
}
