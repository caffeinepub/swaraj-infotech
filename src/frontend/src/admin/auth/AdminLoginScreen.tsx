import { useInternetIdentity } from '../../hooks/useInternetIdentity';
import { Button } from '@/components/ui/button';
import { Shield, Loader2 } from 'lucide-react';
import { ADMIN_TEXT } from '../components/EnglishText';
import { BRAND_CONFIG } from '../../config/brand';

export default function AdminLoginScreen() {
  const { login, loginStatus } = useInternetIdentity();

  const isLoggingIn = loginStatus === 'logging-in';

  const handleLogin = async () => {
    try {
      await login();
    } catch (error: any) {
      console.error('Login error:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-gray-950 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="glass-card p-8 rounded-2xl border border-gray-800">
          <div className="text-center mb-8">
            <div className="w-20 h-20 mx-auto mb-4 rounded-2xl flex items-center justify-center p-3 bg-gray-800/50">
              <img
                src={BRAND_CONFIG.logo.square}
                alt={BRAND_CONFIG.altText}
                className="w-full h-full object-contain"
              />
            </div>
            <h1 className="text-3xl font-display font-bold text-white mb-2">
              {ADMIN_TEXT.LOGIN_TITLE}
            </h1>
            <p className="text-gray-400">
              {BRAND_CONFIG.name}
            </p>
          </div>

          <Button
            onClick={handleLogin}
            disabled={isLoggingIn}
            className="w-full bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-semibold py-6 text-lg"
          >
            {isLoggingIn ? (
              <>
                <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                {ADMIN_TEXT.LOADING}
              </>
            ) : (
              'Sign In with Internet Identity'
            )}
          </Button>

          <p className="text-center text-sm text-gray-500 mt-6">
            Admin access only. Unauthorized access is prohibited.
          </p>
        </div>
      </div>
    </div>
  );
}
