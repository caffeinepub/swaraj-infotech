import { useState, useEffect } from 'react';

const LAST_VISIT_KEY = 'last_visit_date';

export function useLocalStreak() {
    const [streak, setStreak] = useState(0);

    useEffect(() => {
        const today = new Date().toDateString();
        const lastVisit = localStorage.getItem(LAST_VISIT_KEY);

        if (!lastVisit) {
            // First visit
            setStreak(1);
            localStorage.setItem(LAST_VISIT_KEY, today);
        } else {
            const lastVisitDate = new Date(lastVisit);
            const todayDate = new Date(today);
            const diffTime = todayDate.getTime() - lastVisitDate.getTime();
            const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

            if (diffDays === 0) {
                // Same day - retrieve stored streak
                const storedStreak = parseInt(localStorage.getItem('streak_count') || '1', 10);
                setStreak(storedStreak);
            } else if (diffDays === 1) {
                // Consecutive day - increment streak
                const storedStreak = parseInt(localStorage.getItem('streak_count') || '1', 10);
                const newStreak = storedStreak + 1;
                setStreak(newStreak);
                localStorage.setItem('streak_count', newStreak.toString());
                localStorage.setItem(LAST_VISIT_KEY, today);
            } else {
                // Streak broken - reset to 1
                setStreak(1);
                localStorage.setItem('streak_count', '1');
                localStorage.setItem(LAST_VISIT_KEY, today);
            }
        }
    }, []);

    return streak;
}
