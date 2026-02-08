import { useState, useEffect } from 'react';

const TOKEN_KEY = 'otp_auth_token';
const PHONE_KEY = 'otp_auth_phone';

export function useOtpSession() {
    const [token, setToken] = useState<string | null>(null);
    const [phoneNumber, setPhoneNumber] = useState<string | null>(null);
    const [isInitializing, setIsInitializing] = useState(true);
    const [authError, setAuthError] = useState<string>('');

    // Restore session on mount
    useEffect(() => {
        const storedToken = localStorage.getItem(TOKEN_KEY);
        const storedPhone = localStorage.getItem(PHONE_KEY);
        
        if (storedToken && storedPhone) {
            setToken(storedToken);
            setPhoneNumber(storedPhone);
        }
        
        setIsInitializing(false);
    }, []);

    const login = (newToken: string, phone: string) => {
        localStorage.setItem(TOKEN_KEY, newToken);
        localStorage.setItem(PHONE_KEY, phone);
        setToken(newToken);
        setPhoneNumber(phone);
        setAuthError('');
    };

    const logout = () => {
        localStorage.removeItem(TOKEN_KEY);
        localStorage.removeItem(PHONE_KEY);
        setToken(null);
        setPhoneNumber(null);
        setAuthError('');
    };

    const setError = (error: string) => {
        setAuthError(error);
        if (error) {
            // If there's an auth error, clear the session
            logout();
        }
    };

    return {
        token,
        phoneNumber,
        isAuthenticated: !!token,
        isInitializing,
        authError,
        login,
        logout,
        setError,
    };
}
