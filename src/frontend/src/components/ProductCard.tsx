import { Card, CardContent, CardFooter, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import type { Product } from '../backend';

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const priceInDollars = Number(product.price) / 100;

  return (
    <Card className="overflow-hidden hover:shadow-lg transition-shadow duration-300 border-2 hover:border-orange-200 dark:hover:border-orange-800">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-2">
          <CardTitle className="text-xl line-clamp-2">{product.title}</CardTitle>
          <Badge variant="secondary" className="shrink-0 bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200">
            {product.category}
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <p className="text-muted-foreground line-clamp-3">{product.description}</p>
      </CardContent>
      <CardFooter className="pt-4 border-t">
        <div className="flex items-center justify-between w-full">
          <span className="text-3xl font-bold bg-gradient-to-r from-orange-600 to-amber-600 dark:from-orange-400 dark:to-amber-400 bg-clip-text text-transparent">
            ${priceInDollars.toFixed(2)}
          </span>
        </div>
      </CardFooter>
    </Card>
  );
}
