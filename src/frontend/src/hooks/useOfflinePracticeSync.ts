import { useEffect, useRef } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { useActor } from './useActor';
import { getOutbox, removeFromOutbox } from '../utils/practiceCache';

export function useOfflinePracticeSync() {
    const { actor } = useActor();
    const queryClient = useQueryClient();
    const syncingRef = useRef(false);

    const syncOutbox = async () => {
        if (!actor || syncingRef.current) return;

        syncingRef.current = true;
        const outbox = getOutbox();

        for (let i = outbox.length - 1; i >= 0; i--) {
            const item = outbox[i];
            
            try {
                if (item.type === 'answer' && item.selectedOption) {
                    await actor.submitAnswer(BigInt(item.questionId), item.selectedOption);
                } else if (item.type === 'bookmark') {
                    await actor.toggleBookmark(BigInt(item.questionId));
                }
                
                // Remove successfully synced item
                removeFromOutbox(i);
            } catch (error) {
                console.error('Failed to sync outbox item:', error);
                // Keep item in outbox for next sync attempt
            }
        }

        // Invalidate queries after sync
        if (outbox.length > 0) {
            queryClient.invalidateQueries({ queryKey: ['practiceProgress'] });
            queryClient.invalidateQueries({ queryKey: ['bookmarkedQuestions'] });
        }

        syncingRef.current = false;
    };

    useEffect(() => {
        if (!actor) return;

        // Sync on mount
        syncOutbox();

        // Sync when coming back online
        const handleOnline = () => {
            setTimeout(syncOutbox, 1000);
        };

        window.addEventListener('online', handleOnline);

        // Periodic sync every 2 minutes
        const interval = setInterval(syncOutbox, 2 * 60 * 1000);

        return () => {
            window.removeEventListener('online', handleOnline);
            clearInterval(interval);
        };
    }, [actor]);

    return { syncOutbox };
}
