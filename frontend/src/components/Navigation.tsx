import { useInternetIdentity } from '../hooks/useInternetIdentity';
import { useQueryClient } from '@tanstack/react-query';
import { useNavigate } from '@tanstack/react-router';
import { Button } from './ui/button';
import { Plus, Store, Loader2, Sparkles } from 'lucide-react';
import { useGetCallerUserProfile } from '../hooks/useQueries';
import SubscriptionBadge from './SubscriptionBadge';

export default function Navigation() {
  const { login, clear, loginStatus, identity } = useInternetIdentity();
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const { data: userProfile } = useGetCallerUserProfile();

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

  const handlePlans = () => {
    navigate({ to: '/plans' });
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-card/80 backdrop-blur-xl supports-[backdrop-filter]:bg-card/60 shadow-sm">
      <div className="container mx-auto max-w-6xl flex h-16 items-center justify-between px-4">
        <button 
          onClick={handleBrowse}
          className="flex items-center gap-2.5 font-bold text-xl hover:opacity-80 transition-all duration-200 group"
        >
          <div className="p-1.5 rounded-lg bg-primary/10 group-hover:bg-primary/15 transition-colors">
            <Store className="h-5 w-5 text-primary" />
          </div>
          <span className="text-foreground font-display tracking-tight">
            Resolt
          </span>
        </button>

        <nav className="flex items-center gap-3">
          <Button
            onClick={handlePlans}
            variant="ghost"
            className="hidden sm:flex items-center gap-1.5 text-muted-foreground hover:text-foreground transition-colors"
          >
            <Sparkles className="h-4 w-4" />
            Plans
          </Button>

          {isAuthenticated && userProfile && (
            <SubscriptionBadge tier={userProfile.subscriptionTier} />
          )}

          {isAuthenticated && (
            <Button 
              onClick={handleAddProduct}
              className="bg-primary hover:bg-primary/90 text-primary-foreground shadow-soft hover:shadow-medium transition-all duration-200"
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
            className={!isAuthenticated ? 'bg-primary hover:bg-primary/90 text-primary-foreground shadow-soft hover:shadow-medium transition-all duration-200' : 'hover:bg-accent transition-all duration-200'}
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
