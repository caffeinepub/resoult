import { useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "@tanstack/react-router";
import { Flame, Loader2, Menu, Plus, Sparkles, X } from "lucide-react";
import { useState } from "react";
import { useInternetIdentity } from "../hooks/useInternetIdentity";
import { useGetCallerUserProfile } from "../hooks/useQueries";
import SubscriptionBadge from "./SubscriptionBadge";
import { Button } from "./ui/button";

export default function Navigation() {
  const { login, clear, loginStatus, identity } = useInternetIdentity();
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const { data: userProfile } = useGetCallerUserProfile();
  const [mobileOpen, setMobileOpen] = useState(false);

  const isAuthenticated = !!identity;
  const isLoggingIn = loginStatus === "logging-in";

  const handleAuth = async () => {
    setMobileOpen(false);
    if (isAuthenticated) {
      await clear();
      queryClient.clear();
      navigate({ to: "/" });
    } else {
      try {
        await login();
      } catch (error: any) {
        console.error("Login error:", error);
        if (error.message === "User is already authenticated") {
          await clear();
          setTimeout(() => login(), 300);
        }
      }
    }
  };

  const handleAddProduct = () => {
    setMobileOpen(false);
    navigate({ to: "/add-product" });
  };

  const handleBrowse = () => {
    setMobileOpen(false);
    navigate({ to: "/" });
  };

  const handlePlans = () => {
    setMobileOpen(false);
    navigate({ to: "/plans" });
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/60 bg-background/85 backdrop-blur-xl supports-[backdrop-filter]:bg-background/70 shadow-xs">
      <div className="container mx-auto max-w-6xl flex h-16 items-center justify-between px-4">
        {/* Logo */}
        <button
          type="button"
          onClick={handleBrowse}
          data-ocid="nav.link"
          className="flex items-center gap-2 group"
          aria-label="Go to homepage"
        >
          <div className="p-1.5 rounded-lg bg-primary/15 group-hover:bg-primary/25 transition-colors duration-200">
            <Flame className="h-5 w-5 text-primary" />
          </div>
          <span className="font-display font-bold text-xl tracking-tight text-foreground group-hover:text-primary transition-colors duration-200">
            Resolt
          </span>
        </button>

        {/* Desktop nav links — center */}
        <nav
          className="hidden md:flex items-center gap-1"
          aria-label="Main navigation"
        >
          <Button
            onClick={handleBrowse}
            variant="ghost"
            data-ocid="nav.browse.link"
            className="text-muted-foreground hover:text-foreground hover:bg-accent font-medium"
          >
            Browse
          </Button>
          <Button
            onClick={handlePlans}
            variant="ghost"
            data-ocid="nav.plans.link"
            className="text-muted-foreground hover:text-foreground hover:bg-accent font-medium"
          >
            <Sparkles className="h-4 w-4 mr-1.5" />
            Plans
          </Button>
        </nav>

        {/* Desktop right actions */}
        <div className="hidden md:flex items-center gap-2">
          {isAuthenticated && userProfile && (
            <SubscriptionBadge tier={userProfile.subscriptionTier} />
          )}

          {isAuthenticated && (
            <Button
              onClick={handleAddProduct}
              data-ocid="nav.sell.primary_button"
              className="bg-primary hover:bg-primary/90 text-primary-foreground font-semibold shadow-soft hover:shadow-medium transition-all duration-200"
            >
              <Plus className="h-4 w-4 mr-1.5" />
              Sell Item
            </Button>
          )}

          <Button
            onClick={handleAuth}
            disabled={isLoggingIn}
            data-ocid="nav.auth.button"
            variant={isAuthenticated ? "outline" : "ghost"}
            className={
              isAuthenticated
                ? "border-border hover:bg-accent transition-all duration-200"
                : "text-foreground hover:bg-accent font-medium transition-all duration-200"
            }
          >
            {isLoggingIn ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Logging in...
              </>
            ) : isAuthenticated ? (
              "Logout"
            ) : (
              "Login"
            )}
          </Button>
        </div>

        {/* Mobile hamburger */}
        <button
          type="button"
          className="md:hidden p-2 rounded-lg hover:bg-accent transition-colors"
          onClick={() => setMobileOpen((v) => !v)}
          data-ocid="nav.mobile.toggle"
          aria-label="Toggle menu"
          aria-expanded={mobileOpen}
        >
          {mobileOpen ? (
            <X className="h-5 w-5" />
          ) : (
            <Menu className="h-5 w-5" />
          )}
        </button>
      </div>

      {/* Mobile dropdown */}
      {mobileOpen && (
        <div className="md:hidden border-t border-border/60 bg-background/95 backdrop-blur-xl px-4 py-4 flex flex-col gap-2">
          <Button
            onClick={handleBrowse}
            variant="ghost"
            data-ocid="nav.mobile.browse.link"
            className="justify-start text-muted-foreground hover:text-foreground"
          >
            Browse
          </Button>
          <Button
            onClick={handlePlans}
            variant="ghost"
            data-ocid="nav.mobile.plans.link"
            className="justify-start text-muted-foreground hover:text-foreground"
          >
            <Sparkles className="h-4 w-4 mr-2" />
            Plans
          </Button>

          {isAuthenticated && (
            <Button
              onClick={handleAddProduct}
              data-ocid="nav.mobile.sell.primary_button"
              className="bg-primary hover:bg-primary/90 text-primary-foreground font-semibold mt-1"
            >
              <Plus className="h-4 w-4 mr-2" />
              Sell Item
            </Button>
          )}

          <Button
            onClick={handleAuth}
            disabled={isLoggingIn}
            data-ocid="nav.mobile.auth.button"
            variant={isAuthenticated ? "outline" : "default"}
            className={
              isAuthenticated
                ? ""
                : "bg-primary hover:bg-primary/90 text-primary-foreground"
            }
          >
            {isLoggingIn ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Logging in...
              </>
            ) : isAuthenticated ? (
              "Logout"
            ) : (
              "Login"
            )}
          </Button>
        </div>
      )}
    </header>
  );
}
