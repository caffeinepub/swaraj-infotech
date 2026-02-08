import type { Question } from '../backend';

const CACHE_PREFIX = 'practice_cache_';
const BOOKMARKS_KEY = 'practice_bookmarks';
const OUTBOX_KEY = 'practice_outbox';

interface CachedQuestions {
    questions: Question[];
    timestamp: number;
}

interface OutboxItem {
    type: 'answer' | 'bookmark';
    questionId: number;
    selectedOption?: string;
    timestamp: number;
}

// Questions cache
export function getCachedQuestions(course: string, chapter: string): Question[] | null {
    try {
        const key = `${CACHE_PREFIX}${course}_${chapter}`;
        const cached = localStorage.getItem(key);
        if (!cached) return null;

        const data: CachedQuestions = JSON.parse(cached);
        
        // Cache valid for 1 hour
        if (Date.now() - data.timestamp > 60 * 60 * 1000) {
            localStorage.removeItem(key);
            return null;
        }

        return data.questions;
    } catch {
        return null;
    }
}

export function setCachedQuestions(course: string, chapter: string, questions: Question[]): void {
    try {
        const key = `${CACHE_PREFIX}${course}_${chapter}`;
        const data: CachedQuestions = {
            questions,
            timestamp: Date.now(),
        };
        localStorage.setItem(key, JSON.stringify(data));
    } catch (error) {
        console.error('Failed to cache questions:', error);
    }
}

// Bookmarks cache
export function getCachedBookmarks(): Question[] | null {
    try {
        const cached = localStorage.getItem(BOOKMARKS_KEY);
        if (!cached) return null;

        const data: CachedQuestions = JSON.parse(cached);
        
        // Cache valid for 30 minutes
        if (Date.now() - data.timestamp > 30 * 60 * 1000) {
            localStorage.removeItem(BOOKMARKS_KEY);
            return null;
        }

        return data.questions;
    } catch {
        return null;
    }
}

export function setCachedBookmarks(questions: Question[]): void {
    try {
        const data: CachedQuestions = {
            questions,
            timestamp: Date.now(),
        };
        localStorage.setItem(BOOKMARKS_KEY, JSON.stringify(data));
    } catch (error) {
        console.error('Failed to cache bookmarks:', error);
    }
}

// Offline outbox
export function getOutbox(): OutboxItem[] {
    try {
        const outbox = localStorage.getItem(OUTBOX_KEY);
        return outbox ? JSON.parse(outbox) : [];
    } catch {
        return [];
    }
}

export function addToOutbox(item: OutboxItem): void {
    try {
        const outbox = getOutbox();
        outbox.push(item);
        localStorage.setItem(OUTBOX_KEY, JSON.stringify(outbox));
    } catch (error) {
        console.error('Failed to add to outbox:', error);
    }
}

export function removeFromOutbox(index: number): void {
    try {
        const outbox = getOutbox();
        outbox.splice(index, 1);
        localStorage.setItem(OUTBOX_KEY, JSON.stringify(outbox));
    } catch (error) {
        console.error('Failed to remove from outbox:', error);
    }
}

export function clearOutbox(): void {
    try {
        localStorage.removeItem(OUTBOX_KEY);
    } catch (error) {
        console.error('Failed to clear outbox:', error);
    }
}
