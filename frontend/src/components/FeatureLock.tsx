import { ReactNode } from 'react';
import { useNavigate } from '@tanstack/react-router';
import { Lock } from 'lucide-react';
import { SubscriptionTier } from '../backend';

interface FeatureLockProps {
  requiredTier: 'pro' | 'max';
  currentTier: SubscriptionTier | null | undefined;
  children: ReactNode;
  label?: string;
}

function tierLevel(tier: SubscriptionTier | null | undefined): number {
  if (tier === SubscriptionTier.max) return 3;
  if (tier === SubscriptionTier.pro) return 2;
  return 1; // starter or null
}

function requiredTierLevel(required: 'pro' | 'max'): number {
  return required === 'max' ? 3 : 2;
}

export default function FeatureLock({ requiredTier, currentTier, children, label }: FeatureLockProps) {
  const navigate = useNavigate();
  const isLocked = tierLevel(currentTier) < requiredTierLevel(requiredTier);

  if (!isLocked) {
    return <>{children}</>;
  }

  const tierLabel = requiredTier === 'pro' ? 'Pro' : 'Max';
  const tierColor = requiredTier === 'pro' ? 'text-plan-pro' : 'text-plan-max';
  const tierBg = requiredTier === 'pro' ? 'bg-plan-pro/10 border-plan-pro/30' : 'bg-plan-max/10 border-plan-max/30';
  const tierBadgeBg = requiredTier === 'pro' ? 'bg-plan-pro text-white' : 'bg-plan-max text-white';

  return (
    <div
      className={`relative rounded-xl border-2 border-dashed ${tierBg} p-4 cursor-pointer group transition-all duration-200 hover:shadow-soft`}
      onClick={() => navigate({ to: '/plans' })}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => e.key === 'Enter' && navigate({ to: '/plans' })}
      aria-label={`Upgrade to ${tierLabel} to unlock this feature`}
    >
      <div className="flex items-center gap-3">
        <div className={`p-2 rounded-lg ${requiredTier === 'pro' ? 'bg-plan-pro/15' : 'bg-plan-max/15'}`}>
          <Lock className={`h-4 w-4 ${tierColor}`} />
        </div>
        <div className="flex-1 min-w-0">
          <p className={`text-sm font-semibold ${tierColor}`}>
            {label || `${tierLabel} Feature`}
          </p>
          <p className="text-xs text-muted-foreground mt-0.5">
            Upgrade to {tierLabel} to unlock this feature
          </p>
        </div>
        <span className={`shrink-0 text-xs font-bold px-2.5 py-1 rounded-full ${tierBadgeBg}`}>
          {tierLabel}
        </span>
      </div>
      <div className="mt-2 text-xs text-muted-foreground group-hover:text-foreground transition-colors">
        👉 Click to view plans →
      </div>
    </div>
  );
}
