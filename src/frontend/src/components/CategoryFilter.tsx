import { Loader2 } from "lucide-react";
import { useGetAllCategories } from "../hooks/useQueries";
import { cn } from "../lib/utils";

interface CategoryFilterProps {
  selectedCategory: string | null;
  onSelectCategory: (category: string | null) => void;
}

export default function CategoryFilter({
  selectedCategory,
  onSelectCategory,
}: CategoryFilterProps) {
  const { data: categories, isLoading } = useGetAllCategories();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-8">
        <Loader2
          className="h-5 w-5 animate-spin text-primary"
          data-ocid="category.loading_state"
        />
      </div>
    );
  }

  if (!categories || categories.length === 0) {
    return null;
  }

  const filteredCategories = categories.filter((cat) => cat.name !== "All");

  return (
    <div className="mb-8">
      <div
        className="flex gap-2 overflow-x-auto scrollbar-hide pb-2 -mx-1 px-1"
        aria-label="Filter by category"
      >
        {/* All pill */}
        <button
          type="button"
          onClick={() => onSelectCategory(null)}
          data-ocid="category.filter.tab"
          className={cn(
            "flex-shrink-0 px-4 py-2 rounded-full text-sm font-semibold border transition-all duration-200 whitespace-nowrap",
            selectedCategory === null
              ? "bg-primary text-primary-foreground border-primary shadow-soft"
              : "bg-card text-muted-foreground border-border hover:border-primary/50 hover:text-foreground hover:bg-accent",
          )}
        >
          All
        </button>

        {filteredCategories.map((category, index) => (
          <button
            type="button"
            key={category.name}
            onClick={() => onSelectCategory(category.name)}
            data-ocid={`category.filter.tab.${index + 1}`}
            className={cn(
              "flex-shrink-0 px-4 py-2 rounded-full text-sm font-semibold border transition-all duration-200 whitespace-nowrap",
              selectedCategory === category.name
                ? "bg-primary text-primary-foreground border-primary shadow-soft"
                : "bg-card text-muted-foreground border-border hover:border-primary/50 hover:text-foreground hover:bg-accent",
            )}
          >
            {category.name}
          </button>
        ))}
      </div>
    </div>
  );
}
