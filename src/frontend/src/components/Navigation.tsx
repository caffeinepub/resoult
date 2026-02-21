import { useInternetIdentity } from '../hooks/useInternetIdentity';
import { useQueryClient } from '@tanstack/react-query';
import { useNavigate } from '@tanstack/react-router';
import { Button } from './ui/button';
import { Plus, Store, Loader2 } from 'lucide-react';

export default function Navigation() {
  const { login, clear, loginStatus, identity } = useInternetIdentity();
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const isAuthenticated = !!identity;
  const isLoggingIn = loginStatus === 'logging-in';

  const handleAuth = async () => {
    if (isAuthenticated) {
      await clear();
      queryClient.clear();
      navigate({ to: '/' });
    } else {
      try {
        await login();
      } catch (error: any) {
        console.error('Login error:', error);
        if (error.message === 'User is already authenticated') {
          await clear();
          setTimeout(() => login(), 300);
        }
      }
    }
  };

  const handleAddProduct = () => {
    navigate({ to: '/add-product' });
  };

  const handleBrowse = () => {
    navigate({ to: '/' });
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto max-w-6xl flex h-16 items-center justify-between px-4">
        <button 
          onClick={handleBrowse}
          className="flex items-center gap-2 font-bold text-xl hover:opacity-80 transition-opacity"
        >
          <Store className="h-6 w-6 text-orange-600 dark:text-orange-400" />
          <span className="bg-gradient-to-r from-orange-600 to-amber-600 dark:from-orange-400 dark:to-amber-400 bg-clip-text text-transparent">
            Resoult
          </span>
        </button>

        <nav className="flex items-center gap-3">
          {isAuthenticated && (
            <Button 
              onClick={handleAddProduct}
              className="bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-700 hover:to-amber-700 text-white"
            >
              <Plus className="h-4 w-4 mr-2" />
              <span className="hidden sm:inline">Sell Item</span>
              <span className="sm:hidden">Sell</span>
            </Button>
          )}
          
          <Button
            onClick={handleAuth}
            disabled={isLoggingIn}
            variant={isAuthenticated ? 'outline' : 'default'}
            className={!isAuthenticated ? 'bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-700 hover:to-amber-700 text-white' : ''}
          >
            {isLoggingIn ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Logging in...
              </>
            ) : isAuthenticated ? (
              'Logout'
            ) : (
              'Login'
            )}
          </Button>
        </nav>
      </div>
    </header>
  );
}
