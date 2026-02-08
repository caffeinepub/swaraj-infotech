import { useState, useEffect } from 'react';
import { RouteKey, ROUTES } from '../routes';

export function useHashRoute() {
    const [currentRoute, setCurrentRoute] = useState<string>(() => {
        const hash = window.location.hash.slice(1).split('?')[0];
        return hash || ROUTES.DASHBOARD.path;
    });

    useEffect(() => {
        const handleHashChange = () => {
            const hash = window.location.hash.slice(1).split('?')[0];
            setCurrentRoute(hash || ROUTES.DASHBOARD.path);
        };

        window.addEventListener('hashchange', handleHashChange);
        return () => window.removeEventListener('hashchange', handleHashChange);
    }, []);

    const navigate = (route: string) => {
        window.location.hash = route;
    };

    return {
        currentRoute,
        navigate,
    };
}
