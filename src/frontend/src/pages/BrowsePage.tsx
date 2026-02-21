import { useState } from 'react';
import { useGetAllProducts, useGetCategoryProducts } from '../hooks/useQueries';
import ProductGrid from '../components/ProductGrid';
import CategoryFilter from '../components/CategoryFilter';
import { Loader2 } from 'lucide-react';

export default function BrowsePage() {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  
  const { data: allProducts, isLoading: allLoading } = useGetAllProducts();
  const { data: categoryProducts, isLoading: categoryLoading } = useGetCategoryProducts(selectedCategory || '');
  
  const products = selectedCategory ? categoryProducts : allProducts;
  const isLoading = selectedCategory ? categoryLoading : allLoading;

  return (
    <div className="min-h-screen">
      <section className="bg-gradient-to-br from-orange-50 to-amber-50 dark:from-orange-950/20 dark:to-amber-950/20 py-16 px-4">
        <div className="container mx-auto max-w-6xl">
          <h1 className="text-5xl md:text-6xl font-bold text-foreground mb-4">
            Discover Local Deals
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl">
            Buy and sell items in your community. Find great deals on everything you need.
          </p>
        </div>
      </section>

      <section className="container mx-auto max-w-6xl px-4 py-12">
        <CategoryFilter 
          selectedCategory={selectedCategory} 
          onSelectCategory={setSelectedCategory} 
        />

        {isLoading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : products && products.length > 0 ? (
          <ProductGrid products={products} />
        ) : (
          <div className="text-center py-20">
            <p className="text-xl text-muted-foreground">
              {selectedCategory 
                ? `No products found in this category yet.` 
                : 'No products available yet. Be the first to list something!'}
            </p>
          </div>
        )}
      </section>
    </div>
  );
}
