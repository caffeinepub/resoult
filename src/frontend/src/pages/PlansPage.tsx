import { useNavigate } from "@tanstack/react-router";
import { Check, Crown, Loader2, Sparkles, Zap } from "lucide-react";
import { toast } from "sonner";
import { SubscriptionTier } from "../backend";
import { Badge } from "../components/ui/badge";
import { Button } from "../components/ui/button";
import { useInternetIdentity } from "../hooks/useInternetIdentity";
import {
  useGetCallerUserProfile,
  useUpgradeSubscriptionTier,
} from "../hooks/useQueries";

const starterFeatures = [
  "Unlimited buying",
  "Unlimited selling",
  "Auctions allowed",
  "Nearby meet-up feature 📍",
  "Shipping option",
  "Basic search",
  "Basic seller profile",
  "No restrictions",
  "No ads",
];

const proFeatures = [
  "Everything in Starter PLUS:",
  "Priority search ranking",
  "Advanced filters",
  "Custom profile banner",
  "See product analytics (views, clicks)",
  'Auction boost (shows as "Hot Auction 🔥")',
  "Faster customer support",
];

const maxFeatures = [
  "Everything in Pro PLUS:",
  "Featured homepage placement",
  "Verified badge ✔",
  "Advanced analytics dashboard",
  "AI price suggestion",
  "Bulk product upload",
  "Custom shop page (mini website inside app)",
  "Early access to new features",
];

export default function PlansPage() {
  const { identity } = useInternetIdentity();
  const { data: userProfile, isLoading: profileLoading } =
    useGetCallerUserProfile();
  const upgradeMutation = useUpgradeSubscriptionTier();
  const navigate = useNavigate();

  const isAuthenticated = !!identity;
  const currentTier = userProfile?.subscriptionTier ?? null;

  const handleUpgrade = async (tier: SubscriptionTier) => {
    if (!isAuthenticated) {
      navigate({ to: "/" });
      return;
    }
    try {
      await upgradeMutation.mutateAsync(tier);
      toast.success(
        `Successfully upgraded to ${tier.charAt(0).toUpperCase() + tier.slice(1)} plan!`,
      );
    } catch (err: any) {
      toast.error(err?.message || "Failed to upgrade plan. Please try again.");
    }
  };

  const isCurrentTier = (tier: SubscriptionTier) => currentTier === tier;
  const isUpgrading = (tier: SubscriptionTier) =>
    upgradeMutation.isPending && upgradeMutation.variables === tier;

  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="relative bg-gradient-to-br from-primary/5 via-background to-accent/5 py-20 px-4 overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,oklch(var(--primary)/0.08),transparent_50%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_80%,oklch(var(--accent)/0.06),transparent_50%)]" />
        <div className="container mx-auto max-w-4xl relative text-center">
          <h1 className="text-5xl md:text-6xl font-bold text-foreground mb-5 font-display tracking-tight leading-tight">
            Choose Your Plan
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            Start for free and upgrade as you grow. All plans include unlimited
            buying and selling.
          </p>
        </div>
      </section>

      {/* Plans Grid */}
      <section className="container mx-auto max-w-6xl px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch">
          {/* Starter */}
          <div
            className={`relative flex flex-col rounded-2xl border-2 bg-card shadow-soft transition-all duration-300 hover:shadow-medium overflow-hidden ${isCurrentTier(SubscriptionTier.starter) ? "border-plan-starter ring-2 ring-plan-starter/30" : "border-border"}`}
          >
            {isCurrentTier(SubscriptionTier.starter) && (
              <div className="absolute top-4 right-4">
                <Badge className="bg-plan-starter text-white border-0 font-semibold text-xs px-2.5 py-1">
                  Current Plan
                </Badge>
              </div>
            )}
            <div className="p-8 pb-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-full bg-plan-starter/15 flex items-center justify-center">
                  <Zap className="h-5 w-5 text-plan-starter" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-foreground font-display">
                    Starter
                  </h2>
                  <span className="text-xs font-medium text-plan-starter uppercase tracking-wider">
                    Free Forever
                  </span>
                </div>
              </div>
              <div className="mb-6">
                <span className="text-5xl font-bold text-foreground">Free</span>
              </div>
              <ul className="space-y-3 mb-8">
                {starterFeatures.map((feature) => (
                  <li
                    key={feature}
                    className="flex items-start gap-2.5 text-sm text-muted-foreground"
                  >
                    <Check className="h-4 w-4 text-plan-starter mt-0.5 shrink-0" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="mt-auto px-8 pb-8">
              {isCurrentTier(SubscriptionTier.starter) ? (
                <Button disabled className="w-full" variant="outline">
                  Current Plan
                </Button>
              ) : (
                <Button
                  variant="outline"
                  className="w-full border-plan-starter/40 text-plan-starter hover:bg-plan-starter/10 hover:border-plan-starter"
                  onClick={() => handleUpgrade(SubscriptionTier.starter)}
                  disabled={upgradeMutation.isPending || profileLoading}
                >
                  {isUpgrading(SubscriptionTier.starter) ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Switching...
                    </>
                  ) : (
                    "Get Started"
                  )}
                </Button>
              )}
            </div>
          </div>

          {/* Pro */}
          <div
            className={`relative flex flex-col rounded-2xl border-2 bg-card shadow-soft transition-all duration-300 hover:shadow-medium overflow-hidden ${isCurrentTier(SubscriptionTier.pro) ? "border-plan-pro ring-2 ring-plan-pro/30" : "border-plan-pro/40"}`}
          >
            <div className="absolute top-0 left-0 right-0 h-1 bg-plan-pro" />
            {isCurrentTier(SubscriptionTier.pro) && (
              <div className="absolute top-4 right-4">
                <Badge className="bg-plan-pro text-white border-0 font-semibold text-xs px-2.5 py-1">
                  Current Plan
                </Badge>
              </div>
            )}
            <div className="p-8 pb-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-full bg-plan-pro/15 flex items-center justify-center">
                  <Sparkles className="h-5 w-5 text-plan-pro" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-foreground font-display">
                    Pro
                  </h2>
                  <span className="text-xs font-medium text-plan-pro uppercase tracking-wider">
                    Most Popular
                  </span>
                </div>
              </div>
              <div className="mb-6">
                <span className="text-5xl font-bold text-foreground">₹99</span>
                <span className="text-muted-foreground ml-1">/month</span>
              </div>
              <ul className="space-y-3 mb-8">
                {proFeatures.map((feature) => (
                  <li
                    key={feature}
                    className={`flex items-start gap-2.5 text-sm ${feature.startsWith("Everything") ? "text-foreground font-medium" : "text-muted-foreground"}`}
                  >
                    <Check className="h-4 w-4 text-plan-pro mt-0.5 shrink-0" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="mt-auto px-8 pb-8">
              {isCurrentTier(SubscriptionTier.pro) ? (
                <Button disabled className="w-full" variant="outline">
                  Current Plan
                </Button>
              ) : (
                <Button
                  className="w-full bg-plan-pro hover:bg-plan-pro/90 text-white shadow-soft hover:shadow-medium transition-all"
                  onClick={() => handleUpgrade(SubscriptionTier.pro)}
                  disabled={
                    upgradeMutation.isPending ||
                    profileLoading ||
                    !isAuthenticated
                  }
                >
                  {isUpgrading(SubscriptionTier.pro) ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Upgrading...
                    </>
                  ) : !isAuthenticated ? (
                    "Login to Upgrade"
                  ) : (
                    "Upgrade to Pro"
                  )}
                </Button>
              )}
            </div>
          </div>

          {/* Max */}
          <div
            className={`relative flex flex-col rounded-2xl border-2 bg-card shadow-soft transition-all duration-300 hover:shadow-medium overflow-hidden ${isCurrentTier(SubscriptionTier.max) ? "border-plan-max ring-2 ring-plan-max/30" : "border-plan-max/40"}`}
          >
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-plan-max to-plan-pro" />
            {isCurrentTier(SubscriptionTier.max) && (
              <div className="absolute top-4 right-4">
                <Badge className="bg-plan-max text-white border-0 font-semibold text-xs px-2.5 py-1">
                  Current Plan
                </Badge>
              </div>
            )}
            <div className="p-8 pb-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-full bg-plan-max/15 flex items-center justify-center">
                  <Crown className="h-5 w-5 text-plan-max" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-foreground font-display">
                    Max
                  </h2>
                  <span className="text-xs font-medium text-plan-max uppercase tracking-wider">
                    Ultimate Power
                  </span>
                </div>
              </div>
              <div className="mb-6">
                <span className="text-5xl font-bold text-foreground">₹299</span>
                <span className="text-muted-foreground ml-1">/month</span>
              </div>
              <ul className="space-y-3 mb-8">
                {maxFeatures.map((feature) => (
                  <li
                    key={feature}
                    className={`flex items-start gap-2.5 text-sm ${feature.startsWith("Everything") ? "text-foreground font-medium" : "text-muted-foreground"}`}
                  >
                    <Check className="h-4 w-4 text-plan-max mt-0.5 shrink-0" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="mt-auto px-8 pb-8">
              {isCurrentTier(SubscriptionTier.max) ? (
                <Button disabled className="w-full" variant="outline">
                  Current Plan
                </Button>
              ) : (
                <Button
                  className="w-full bg-plan-max hover:bg-plan-max/90 text-white shadow-soft hover:shadow-medium transition-all"
                  onClick={() => handleUpgrade(SubscriptionTier.max)}
                  disabled={
                    upgradeMutation.isPending ||
                    profileLoading ||
                    !isAuthenticated
                  }
                >
                  {isUpgrading(SubscriptionTier.max) ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Upgrading...
                    </>
                  ) : !isAuthenticated ? (
                    "Login to Upgrade"
                  ) : (
                    "Upgrade to Max"
                  )}
                </Button>
              )}
            </div>
          </div>
        </div>

        {!isAuthenticated && (
          <p className="text-center text-muted-foreground mt-8 text-sm">
            Please{" "}
            <button
              type="button"
              onClick={() => navigate({ to: "/" })}
              className="text-primary underline underline-offset-2 hover:no-underline"
            >
              log in
            </button>{" "}
            to upgrade your plan.
          </p>
        )}
      </section>
    </div>
  );
}
