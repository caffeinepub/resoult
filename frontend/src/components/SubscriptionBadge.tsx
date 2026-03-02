import { SubscriptionTier } from '../backend';

interface SubscriptionBadgeProps {
  tier: SubscriptionTier;
  className?: string;
}

export default function SubscriptionBadge({ tier, className = '' }: SubscriptionBadgeProps) {
  if (tier === SubscriptionTier.starter) return null;

  if (tier === SubscriptionTier.pro) {
    return (
      <span
        className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold bg-plan-pro/15 text-plan-pro border border-plan-pro/30 ${className}`}
      >
        🔵 Pro
      </span>
    );
  }

  if (tier === SubscriptionTier.max) {
    return (
      <span
        className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold bg-plan-max/15 text-plan-max border border-plan-max/30 ${className}`}
      >
        🟣 Max ✔
      </span>
    );
  }

  return null;
}
