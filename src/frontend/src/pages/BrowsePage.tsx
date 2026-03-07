import { useNavigate } from "@tanstack/react-router";
import {
  ArrowRight,
  Bike,
  BookOpen,
  Car,
  Cpu,
  Flame,
  Gamepad2,
  Home,
  Layers,
  Loader2,
  MapPin,
  Music,
  Package,
  Palette,
  PenLine,
  Puzzle,
  Shirt,
  SlidersHorizontal,
  Star,
  Tag,
  Trophy,
  Watch,
  Zap,
} from "lucide-react";
import { useRef, useState } from "react";
import CategoryFilter from "../components/CategoryFilter";
import FeatureLock from "../components/FeatureLock";
import ProductGrid from "../components/ProductGrid";
import { Button } from "../components/ui/button";
import { useInternetIdentity } from "../hooks/useInternetIdentity";
import {
  useGetAllCategories,
  useGetAllProducts,
  useGetCallerUserProfile,
  useGetCategoryProducts,
} from "../hooks/useQueries";
import { cn } from "../lib/utils";

// Map category names to Lucide icons
const CATEGORY_ICONS: Record<string, React.ElementType> = {
  gaming: Gamepad2,
  sports: Trophy,
  bikes: Bike,
  cars: Car,
  tcg: Layers,
  "limited editions": Star,
  "limited edition": Star,
  watches: Watch,
  pens: PenLine,
  electronics: Cpu,
  books: BookOpen,
  fashion: Shirt,
  home: Home,
  music: Music,
  art: Palette,
  toys: Puzzle,
};

function getCategoryIcon(name: string): React.ElementType {
  const lower = name.toLowerCase();
  return CATEGORY_ICONS[lower] ?? Tag;
}

// Decorative floating category pills for hero
const HERO_PILLS = [
  "Gaming 🎮",
  "Cars 🚗",
  "Watches ⌚",
  "TCG 🃏",
  "Sports 🏆",
  "Art 🎨",
  "Bikes 🚲",
  "Music 🎵",
];

export default function BrowsePage() {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const { identity } = useInternetIdentity();
  const { data: userProfile } = useGetCallerUserProfile();
  const { data: allCategories } = useGetAllCategories();
  const navigate = useNavigate();
  const browseRef = useRef<HTMLElement>(null);

  const { data: allProducts, isLoading: allLoading } = useGetAllProducts();
  const { data: categoryProducts, isLoading: categoryLoading } =
    useGetCategoryProducts(selectedCategory || "");

  const products = selectedCategory ? categoryProducts : allProducts;
  const isLoading = selectedCategory ? categoryLoading : allLoading;

  const currentTier = userProfile?.subscriptionTier ?? null;

  const scrollToBrowse = () => {
    browseRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const handleCategoryClick = (categoryName: string) => {
    setSelectedCategory(categoryName);
    setTimeout(() => {
      browseRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 100);
  };

  // Filter out "All" from displayed categories
  const displayCategories = (allCategories ?? []).filter(
    (c) => c.name !== "All",
  );

  return (
    <div className="min-h-screen">
      {/* ================================================
          SECTION 1 — HERO
      ================================================ */}
      <section
        className="relative overflow-hidden"
        data-ocid="hero.section"
        style={{
          background:
            "radial-gradient(ellipse 80% 60% at 50% -10%, oklch(0.72 0.17 55 / 0.14) 0%, transparent 70%), radial-gradient(ellipse 60% 50% at 80% 100%, oklch(0.72 0.17 55 / 0.08) 0%, transparent 60%), oklch(0.98 0.01 80)",
        }}
      >
        {/* Grain overlay */}
        <div
          className="absolute inset-0 pointer-events-none opacity-[0.03]"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 512 512' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.75' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
            backgroundSize: "512px 512px",
          }}
        />

        {/* Decorative floating pills */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden select-none">
          {HERO_PILLS.map((pill, i) => {
            const positions = [
              "top-[12%] left-[4%]",
              "top-[8%] right-[8%]",
              "top-[30%] left-[2%]",
              "top-[28%] right-[3%]",
              "bottom-[18%] left-[6%]",
              "bottom-[12%] right-[5%]",
              "top-[55%] left-[1%]",
              "top-[60%] right-[2%]",
            ];
            const rotations = [-2, 1.5, -1, 2, -1.5, 1, -2.5, 2];
            return (
              <span
                key={pill}
                className={cn(
                  "absolute hidden lg:inline-flex items-center px-3 py-1.5 rounded-full text-xs font-semibold",
                  "bg-background/70 backdrop-blur-sm border border-border shadow-soft text-muted-foreground",
                  positions[i],
                )}
                style={{
                  transform: `rotate(${rotations[i]}deg)`,
                  opacity: 0.7,
                }}
              >
                {pill}
              </span>
            );
          })}
        </div>

        <div className="container mx-auto max-w-6xl relative px-4 py-24 md:py-32 lg:py-40">
          <div className="max-w-3xl">
            {/* Eyebrow */}
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-primary text-sm font-semibold mb-6">
              <Flame className="h-3.5 w-3.5" />
              India's Community Marketplace
            </div>

            {/* Headline */}
            <h1 className="font-display font-bold tracking-tight text-foreground leading-[1.05] mb-6 text-5xl sm:text-6xl lg:text-7xl">
              Buy. <span className="text-primary">Sell.</span> Meet Locally.
            </h1>

            {/* Subheadline */}
            <p className="text-xl text-muted-foreground leading-relaxed mb-10 max-w-xl">
              Resolt is the marketplace where your community buys and sells
              everything — from gaming gear to limited editions.
            </p>

            {/* CTAs */}
            <div className="flex flex-wrap gap-3">
              <Button
                onClick={scrollToBrowse}
                data-ocid="hero.browse.primary_button"
                size="lg"
                className="bg-primary hover:bg-primary/90 text-primary-foreground font-semibold shadow-medium hover:shadow-strong transition-all duration-200 h-12 px-7 text-base"
              >
                Browse Listings
                <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
              <Button
                onClick={() =>
                  identity ? navigate({ to: "/add-product" }) : undefined
                }
                data-ocid="hero.sell.secondary_button"
                size="lg"
                variant="outline"
                className="border-border hover:bg-accent hover:border-primary/40 font-semibold h-12 px-7 text-base transition-all duration-200"
              >
                Start Selling
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* ================================================
          SECTION 2 — STATS BAR
      ================================================ */}
      <section
        className="bg-foreground text-background"
        data-ocid="stats.section"
      >
        <div className="container mx-auto max-w-6xl px-4">
          <div className="grid grid-cols-1 sm:grid-cols-3 divide-y sm:divide-y-0 sm:divide-x divide-background/10">
            {[
              {
                icon: Zap,
                label: "100% Free to List",
                sub: "No fees on your listings",
              },
              {
                icon: MapPin,
                label: "Nearby Pickup Available 📍",
                sub: "Meet local buyers & sellers",
              },
              {
                icon: Flame,
                label: "Auctions Supported 🔥",
                sub: "Bid on unique items",
              },
            ].map(({ icon: Icon, label, sub }) => (
              <div
                key={label}
                className="flex items-center gap-4 px-6 py-6 sm:py-8"
              >
                <div className="p-2.5 rounded-xl bg-primary/20 flex-shrink-0">
                  <Icon className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="font-display font-bold text-background/95 text-lg leading-tight">
                    {label}
                  </p>
                  <p className="text-background/55 text-sm mt-0.5">{sub}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ================================================
          SECTION 3 — FEATURED CATEGORIES
      ================================================ */}
      <section className="py-20 px-4" data-ocid="categories.section">
        <div className="container mx-auto max-w-6xl">
          <div className="mb-10">
            <h2 className="font-display font-bold text-3xl md:text-4xl text-foreground tracking-tight mb-2">
              Shop by Category
            </h2>
            <p className="text-muted-foreground text-lg">
              From everyday essentials to rare finds — everything in one place.
            </p>
          </div>

          {displayCategories.length > 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
              {displayCategories.map((cat, index) => {
                const Icon = getCategoryIcon(cat.name);
                return (
                  <button
                    type="button"
                    key={cat.name}
                    onClick={() => handleCategoryClick(cat.name)}
                    data-ocid={`categories.item.${index + 1}`}
                    className="group flex flex-col items-center gap-3 p-5 rounded-2xl border border-border bg-card hover:border-primary/40 hover:bg-primary/5 hover:shadow-soft transition-all duration-200"
                  >
                    <div className="p-3 rounded-xl bg-primary/10 group-hover:bg-primary/20 transition-colors duration-200">
                      <Icon className="h-6 w-6 text-primary" />
                    </div>
                    <span className="text-sm font-semibold text-foreground group-hover:text-primary transition-colors duration-200 text-center leading-tight">
                      {cat.name}
                    </span>
                  </button>
                );
              })}
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
              {/* Skeleton shimmer while loading */}
              {["a", "b", "c", "d", "e", "f", "g", "h", "j", "k"].map((id) => (
                <div
                  key={`skeleton-cat-${id}`}
                  data-ocid="categories.loading_state"
                  className="h-28 rounded-2xl bg-muted animate-pulse"
                />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* ================================================
          SECTION 4 — HOW IT WORKS
      ================================================ */}
      <section
        className="py-20 px-4"
        data-ocid="how.section"
        style={{
          background:
            "radial-gradient(ellipse 100% 80% at 50% 50%, oklch(0.72 0.17 55 / 0.04) 0%, transparent 70%), oklch(0.96 0.01 80)",
        }}
      >
        <div className="container mx-auto max-w-6xl">
          <div className="mb-12 text-center">
            <h2 className="font-display font-bold text-3xl md:text-4xl text-foreground tracking-tight mb-3">
              How Resolt Works
            </h2>
            <p className="text-muted-foreground text-lg max-w-xl mx-auto">
              Three simple steps between you and your next great deal.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                step: "01",
                title: "List Your Item",
                description:
                  "Snap a photo and post your item in seconds. Add a price, pick a category, and go live instantly.",
                icon: Package,
              },
              {
                step: "02",
                title: "Connect Nearby",
                description:
                  "Meet local buyers in person or ship anywhere across India. No middlemen, no markups.",
                icon: MapPin,
              },
              {
                step: "03",
                title: "Make the Deal",
                description:
                  "Chat, agree on a price, and exchange. Simple, safe, and satisfying.",
                icon: Zap,
              },
            ].map(({ step, title, description, icon: Icon }, i) => (
              <div
                key={step}
                data-ocid={`how.item.${i + 1}`}
                className="relative p-7 rounded-2xl border border-border bg-card hover:shadow-soft transition-all duration-200 group"
              >
                {/* Step number — decorative */}
                <span className="absolute top-6 right-7 font-display font-black text-5xl text-primary/8 select-none leading-none">
                  {step}
                </span>
                <div className="p-3 rounded-xl bg-primary/10 w-fit mb-5 group-hover:bg-primary/20 transition-colors duration-200">
                  <Icon className="h-6 w-6 text-primary" />
                </div>
                <h3 className="font-display font-bold text-xl text-foreground mb-2">
                  {title}
                </h3>
                <p className="text-muted-foreground leading-relaxed text-sm">
                  {description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ================================================
          SECTION 5 — BROWSE LISTINGS
      ================================================ */}
      <section
        ref={browseRef}
        id="browse"
        className="py-20 px-4"
        data-ocid="browse.section"
      >
        <div className="container mx-auto max-w-6xl">
          <div className="mb-8">
            <h2 className="font-display font-bold text-3xl md:text-4xl text-foreground tracking-tight mb-2">
              Latest Listings
            </h2>
            <p className="text-muted-foreground text-lg">
              Fresh deals from your community — updated in real time.
            </p>
          </div>

          <CategoryFilter
            selectedCategory={selectedCategory}
            onSelectCategory={setSelectedCategory}
          />

          {/* Advanced Filters — Pro feature */}
          {identity && (
            <div className="mb-8">
              <div className="flex items-center gap-2 mb-3">
                <SlidersHorizontal className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm font-medium text-muted-foreground">
                  Advanced Filters
                </span>
              </div>
              <FeatureLock
                requiredTier="pro"
                currentTier={currentTier}
                label="Advanced Filters"
              >
                <div className="flex flex-wrap gap-4 p-4 rounded-xl border border-border bg-muted/30">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <span className="font-semibold text-foreground">
                      Price Range:
                    </span>
                    <span>₹0 – ₹10,000</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <span className="font-semibold text-foreground">Type:</span>
                    <span>All · Auction · Fixed Price</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <span className="font-semibold text-foreground">
                      Seller Tier:
                    </span>
                    <span>All · Pro · Max</span>
                  </div>
                </div>
              </FeatureLock>
            </div>
          )}

          {isLoading ? (
            <div
              className="flex flex-col items-center justify-center py-24"
              data-ocid="browse.loading_state"
            >
              <Loader2 className="h-10 w-10 animate-spin text-primary mb-4" />
              <p className="text-muted-foreground font-medium">
                Loading listings...
              </p>
            </div>
          ) : !products || products.length === 0 ? (
            <div
              className="flex flex-col items-center justify-center py-24 px-4 rounded-2xl border border-dashed border-border"
              data-ocid="browse.empty_state"
            >
              <div className="p-5 rounded-2xl bg-muted/40 mb-5">
                <Package className="h-10 w-10 text-muted-foreground/50" />
              </div>
              <h3 className="font-display font-bold text-xl text-foreground mb-2">
                No listings yet
              </h3>
              <p className="text-muted-foreground text-center max-w-md text-sm leading-relaxed">
                {selectedCategory
                  ? `No items available in "${selectedCategory}" yet. Try a different category or come back soon.`
                  : 'Be the first to list something! Hit "Sell Item" to get started.'}
              </p>
              {identity && (
                <Button
                  onClick={() => navigate({ to: "/add-product" })}
                  data-ocid="browse.empty.primary_button"
                  className="mt-6 bg-primary hover:bg-primary/90 text-primary-foreground font-semibold"
                >
                  <Package className="h-4 w-4 mr-2" />
                  List Your First Item
                </Button>
              )}
            </div>
          ) : (
            <div className="animate-fade-in">
              <ProductGrid products={products} />
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
