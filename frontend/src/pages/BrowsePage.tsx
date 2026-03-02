import { useState } from 'react';
import { useGetAllProducts, useGetCategoryProducts, useGetCallerUserProfile } from '../hooks/useQueries';
import ProductGrid from '../components/ProductGrid';
import CategoryFilter from '../components/CategoryFilter';
import FeatureLock from '../components/FeatureLock';
import { Loader2, Package, SlidersHorizontal } from 'lucide-react';
import { useInternetIdentity } from '../hooks/useInternetIdentity';

export default function BrowsePage() {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const { identity } = useInternetIdentity();
  const { data: userProfile } = useGetCallerUserProfile();
  
  const { data: allProducts, isLoading: allLoading } = useGetAllProducts();
  const { data: categoryProducts, isLoading: categoryLoading } = useGetCategoryProducts(selectedCategory || '');
  
  const products = selectedCategory ? categoryProducts : allProducts;
  const isLoading = selectedCategory ? categoryLoading : allLoading;

  const currentTier = userProfile?.subscriptionTier ?? null;

  return (
    <div className="min-h-screen">
      <section className="relative bg-gradient-to-br from-primary/5 via-background to-accent/5 py-20 px-4 overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,oklch(var(--primary)/0.08),transparent_50%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_80%,oklch(var(--accent)/0.06),transparent_50%)]" />
        <div className="container mx-auto max-w-6xl relative">
          <h1 className="text-5xl md:text-6xl font-bold text-foreground mb-5 font-display tracking-tight leading-tight">
            Discover Local Deals
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl leading-relaxed">
            Buy and sell items in your community. Find great deals on everything you need.
          </p>
        </div>
      </section>

      <section className="container mx-auto max-w-6xl px-4 py-12">
        <CategoryFilter 
          selectedCategory={selectedCategory}
          onSelectCategory={setSelectedCategory}
        />

        {/* Advanced Filters — Pro feature */}
        {identity && (
          <div className="mt-6 mb-2">
            <div className="flex items-center gap-2 mb-3">
              <SlidersHorizontal className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm font-medium text-muted-foreground">Advanced Filters</span>
            </div>
            <FeatureLock
              requiredTier="pro"
              currentTier={currentTier}
              label="Advanced Filters"
            >
              {/* Unlocked advanced filter UI (shown to Pro/Max users) */}
              <div className="flex flex-wrap gap-3 p-4 rounded-xl border bg-muted/30">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <span className="font-medium text-foreground">Price Range:</span>
                  <span>₹0 – ₹10,000</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <span className="font-medium text-foreground">Type:</span>
                  <span>All · Auction · Fixed Price</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <span className="font-medium text-foreground">Seller Tier:</span>
                  <span>All · Pro · Max</span>
                </div>
              </div>
            </FeatureLock>
          </div>
        )}

        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-20">
            <Loader2 className="h-10 w-10 animate-spin text-primary mb-4" />
            <p className="text-muted-foreground">Loading products...</p>
          </div>
        ) : !products || products.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 px-4">
            <div className="p-6 rounded-full bg-muted/50 mb-6">
              <Package className="h-12 w-12 text-muted-foreground" />
            </div>
            <h3 className="text-2xl font-semibold text-foreground mb-3">
              No products found
            </h3>
            <p className="text-muted-foreground text-center max-w-md">
              {selectedCategory 
                ? `No items available in the "${selectedCategory}" category yet. Try browsing other categories.`
                : 'Be the first to list an item! Click "Sell Item" to get started.'
              }
            </p>
          </div>
        ) : (
          <div className="animate-fade-in">
            <ProductGrid products={products} />
          </div>
        )}
      </section>
    </div>
  );
}
