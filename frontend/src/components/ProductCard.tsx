import { Card, CardContent, CardFooter, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { ImageIcon } from 'lucide-react';
import type { Product } from '../backend';
import { SubscriptionTier } from '../backend';

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const priceInDollars = Number(product.price) / 100;
  const hasPhoto = product.photoUrl && product.photoUrl.trim() !== '';
  const isHotAuction =
    product.isAuction &&
    (product.sellerTier === SubscriptionTier.pro || product.sellerTier === SubscriptionTier.max);

  return (
    <Card className="group overflow-hidden hover:shadow-medium transition-all duration-300 border hover:border-primary/30 bg-card">
      <div className="relative">
        {hasPhoto ? (
          <div className="relative w-full h-48 overflow-hidden bg-muted">
            <img
              src={product.photoUrl}
              alt={product.title}
              loading="lazy"
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            />
          </div>
        ) : (
          <div className="relative w-full h-48 bg-muted/50 flex items-center justify-center">
            <ImageIcon className="h-16 w-16 text-muted-foreground/30" />
          </div>
        )}
        {isHotAuction && (
          <div className="absolute top-2 left-2">
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-orange-500 text-white shadow-soft">
              Hot Auction 🔥
            </span>
          </div>
        )}
        {product.isAuction && !isHotAuction && (
          <div className="absolute top-2 left-2">
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-primary/90 text-primary-foreground shadow-soft">
              Auction
            </span>
          </div>
        )}
      </div>
      
      <CardHeader className="pb-4 space-y-3">
        <div className="flex items-start justify-between gap-3">
          <CardTitle className="text-xl font-semibold line-clamp-2 leading-tight group-hover:text-primary transition-colors duration-200">
            {product.title}
          </CardTitle>
          <Badge 
            variant="secondary" 
            className="shrink-0 bg-primary/10 text-primary border-primary/20 font-medium px-2.5 py-0.5"
          >
            {product.category}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="pb-4">
        <p className="text-muted-foreground line-clamp-3 leading-relaxed text-sm">
          {product.description}
        </p>
      </CardContent>
      <CardFooter className="pt-4 border-t bg-muted/30">
        <div className="flex items-center justify-between w-full">
          <span className="text-3xl font-bold text-primary tracking-tight">
            ₹{priceInDollars.toFixed(2)}
          </span>
        </div>
      </CardFooter>
    </Card>
  );
}
