import { useGetAllCategories } from '../hooks/useQueries';
import { Button } from './ui/button';
import { Loader2 } from 'lucide-react';

interface CategoryFilterProps {
  selectedCategory: string | null;
  onSelectCategory: (category: string | null) => void;
}

export default function CategoryFilter({ selectedCategory, onSelectCategory }: CategoryFilterProps) {
  const { data: categories, isLoading } = useGetAllCategories();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-8">
        <Loader2 className="h-6 w-6 animate-spin text-primary" />
      </div>
    );
  }

  if (!categories || categories.length === 0) {
    return null;
  }

  // Filter out "All" from the categories list since we handle it separately
  const filteredCategories = categories.filter(cat => cat.name !== 'All');

  return (
    <div className="mb-10">
      <h2 className="text-lg font-semibold mb-5 text-foreground">Filter by Category</h2>
      <div className="flex flex-wrap gap-2.5">
        <Button
          variant={selectedCategory === null ? 'default' : 'outline'}
          onClick={() => onSelectCategory(null)}
          className={
            selectedCategory === null 
              ? 'bg-primary hover:bg-primary/90 text-primary-foreground shadow-soft hover:shadow-medium transition-all duration-200' 
              : 'hover:bg-accent hover:text-accent-foreground hover:border-primary/30 transition-all duration-200'
          }
        >
          All
        </Button>
        {filteredCategories.map((category) => (
          <Button
            key={category.name}
            variant={selectedCategory === category.name ? 'default' : 'outline'}
            onClick={() => onSelectCategory(category.name)}
            className={
              selectedCategory === category.name 
                ? 'bg-primary hover:bg-primary/90 text-primary-foreground shadow-soft hover:shadow-medium transition-all duration-200' 
                : 'hover:bg-accent hover:text-accent-foreground hover:border-primary/30 transition-all duration-200'
            }
          >
            {category.name}
          </Button>
        ))}
      </div>
    </div>
  );
}
