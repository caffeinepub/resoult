import { ArrowRight, ImageIcon } from "lucide-react";
import type { Product } from "../backend";
import { SubscriptionTier } from "../backend";
import { Badge } from "./ui/badge";
import { Card, CardContent, CardFooter } from "./ui/card";

interface ProductCardProps {
  product: Product;
  index?: number;
}

export default function ProductCard({ product, index = 1 }: ProductCardProps) {
  const priceInRupees = Number(product.price) / 100;
  const hasPhoto = product.photoUrl && product.photoUrl.trim() !== "";
  const isHotAuction =
    product.isAuction &&
    (product.sellerTier === SubscriptionTier.pro ||
      product.sellerTier === SubscriptionTier.max);

  return (
    <Card
      data-ocid={`product.item.${index}`}
      className="group overflow-hidden hover:shadow-medium transition-all duration-300 border border-border hover:border-primary/30 bg-card flex flex-col"
    >
      {/* Image area */}
      <div className="relative w-full h-56 overflow-hidden bg-muted flex-shrink-0">
        {hasPhoto ? (
          <img
            src={product.photoUrl}
            alt={product.title}
            loading="lazy"
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-muted to-accent/30 flex items-center justify-center">
            <ImageIcon className="h-14 w-14 text-muted-foreground/25" />
          </div>
        )}

        {/* Auction badges */}
        {isHotAuction && (
          <div className="absolute top-3 left-3">
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-orange-500 text-white shadow-medium">
              Hot Auction 🔥
            </span>
          </div>
        )}
        {product.isAuction && !isHotAuction && (
          <div className="absolute top-3 left-3">
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-primary/90 text-primary-foreground shadow-soft">
              Auction
            </span>
          </div>
        )}

        {/* Category badge — top right overlay */}
        <div className="absolute top-3 right-3">
          <Badge
            variant="secondary"
            className="bg-background/85 backdrop-blur-sm text-foreground border-0 text-xs font-medium shadow-xs"
          >
            {product.category}
          </Badge>
        </div>
      </div>

      {/* Content */}
      <CardContent className="p-4 flex-1 flex flex-col gap-2">
        <h3 className="font-semibold text-foreground line-clamp-2 leading-snug text-base group-hover:text-primary transition-colors duration-200">
          {product.title}
        </h3>
        <p className="text-muted-foreground line-clamp-2 leading-relaxed text-sm flex-1">
          {product.description}
        </p>
      </CardContent>

      {/* Footer */}
      <CardFooter className="px-4 py-3 border-t border-border/60 bg-muted/20 flex items-center justify-between">
        <span className="text-2xl font-bold text-primary tracking-tight font-display">
          ₹
          {priceInRupees.toLocaleString("en-IN", {
            minimumFractionDigits: 0,
            maximumFractionDigits: 2,
          })}
        </span>
        <button
          type="button"
          data-ocid={`product.view.button.${index}`}
          className="flex items-center gap-1 text-sm text-muted-foreground hover:text-primary font-medium transition-colors duration-200 group/btn"
          aria-label={`View ${product.title}`}
        >
          View Item
          <ArrowRight className="h-3.5 w-3.5 group-hover/btn:translate-x-0.5 transition-transform duration-200" />
        </button>
      </CardFooter>
    </Card>
  );
}
