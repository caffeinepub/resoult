import { useInternetIdentity } from '../hooks/useInternetIdentity';
import { useNavigate } from '@tanstack/react-router';
import ProductForm from '../components/ProductForm';
import FeatureLock from '../components/FeatureLock';
import { useEffect } from 'react';
import { useGetCallerUserProfile } from '../hooks/useQueries';
import { BarChart2, Layers, Wand2, Store } from 'lucide-react';

export default function AddProductPage() {
  const { identity } = useInternetIdentity();
  const navigate = useNavigate();
  const { data: userProfile } = useGetCallerUserProfile();

  useEffect(() => {
    if (!identity) {
      navigate({ to: '/' });
    }
  }, [identity, navigate]);

  if (!identity) {
    return null;
  }

  const currentTier = userProfile?.subscriptionTier ?? null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-amber-50 dark:from-orange-950/20 dark:to-amber-950/20 py-12 px-4">
      <div className="container mx-auto max-w-2xl space-y-6">
        <div className="bg-card rounded-2xl shadow-lg p-8">
          <h1 className="text-4xl font-bold text-foreground mb-2">List Your Item</h1>
          <p className="text-muted-foreground mb-8">
            Fill in the details below to create your listing
          </p>
          <ProductForm />
        </div>

        {/* Pro / Max exclusive features */}
        <div className="bg-card rounded-2xl shadow-soft p-6 space-y-4">
          <h2 className="text-lg font-semibold text-foreground">Seller Tools</h2>

          {/* Product Analytics — Pro */}
          <FeatureLock requiredTier="pro" currentTier={currentTier} label="Product Analytics">
            <div className="flex items-center gap-3 p-4 rounded-xl border bg-muted/30">
              <div className="p-2 rounded-lg bg-plan-pro/10">
                <BarChart2 className="h-5 w-5 text-plan-pro" />
              </div>
              <div>
                <p className="text-sm font-semibold text-foreground">Product Analytics</p>
                <p className="text-xs text-muted-foreground">Track views and clicks on your listings</p>
              </div>
            </div>
          </FeatureLock>

          {/* Bulk Upload — Max */}
          <FeatureLock requiredTier="max" currentTier={currentTier} label="Bulk Product Upload">
            <div className="flex items-center gap-3 p-4 rounded-xl border bg-muted/30">
              <div className="p-2 rounded-lg bg-plan-max/10">
                <Layers className="h-5 w-5 text-plan-max" />
              </div>
              <div>
                <p className="text-sm font-semibold text-foreground">Bulk Product Upload</p>
                <p className="text-xs text-muted-foreground">Upload multiple products at once — Coming Soon</p>
              </div>
            </div>
          </FeatureLock>

          {/* AI Price Suggestion — Max */}
          <FeatureLock requiredTier="max" currentTier={currentTier} label="AI Price Suggestion">
            <div className="flex items-center gap-3 p-4 rounded-xl border bg-muted/30">
              <div className="p-2 rounded-lg bg-plan-max/10">
                <Wand2 className="h-5 w-5 text-plan-max" />
              </div>
              <div>
                <p className="text-sm font-semibold text-foreground">AI Price Suggestion</p>
                <p className="text-xs text-muted-foreground">Get smart pricing recommendations — Coming Soon</p>
              </div>
            </div>
          </FeatureLock>

          {/* Custom Shop Page — Max */}
          <FeatureLock requiredTier="max" currentTier={currentTier} label="Custom Shop Page">
            <div className="flex items-center gap-3 p-4 rounded-xl border bg-muted/30">
              <div className="p-2 rounded-lg bg-plan-max/10">
                <Store className="h-5 w-5 text-plan-max" />
              </div>
              <div>
                <p className="text-sm font-semibold text-foreground">Custom Shop Page</p>
                <p className="text-xs text-muted-foreground">Your own mini website inside Resolt — Coming Soon</p>
              </div>
            </div>
          </FeatureLock>
        </div>
      </div>
    </div>
  );
}
