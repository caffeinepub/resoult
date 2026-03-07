import { useNavigate } from "@tanstack/react-router";
import { Flame } from "lucide-react";

export default function Footer() {
  const currentYear = new Date().getFullYear();
  const navigate = useNavigate();

  return (
    <footer
      className="bg-foreground text-background"
      data-ocid="footer.section"
    >
      <div className="container mx-auto max-w-6xl px-4 pt-14 pb-8">
        {/* Three-column grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 md:gap-8 mb-12">
          {/* Brand column */}
          <div>
            <button
              type="button"
              onClick={() => navigate({ to: "/" })}
              data-ocid="footer.home.link"
              className="flex items-center gap-2 group mb-4"
              aria-label="Go to homepage"
            >
              <div className="p-1.5 rounded-lg bg-primary/20 group-hover:bg-primary/30 transition-colors duration-200">
                <Flame className="h-5 w-5 text-primary" />
              </div>
              <span className="font-display font-bold text-xl tracking-tight text-background group-hover:text-primary transition-colors duration-200">
                Resolt
              </span>
            </button>
            <p className="text-background/50 text-sm leading-relaxed max-w-[220px]">
              Your local marketplace for buying, selling, and connecting with
              people nearby.
            </p>
          </div>

          {/* Marketplace links */}
          <div>
            <h3 className="font-display font-semibold text-background/90 text-sm uppercase tracking-widest mb-5">
              Marketplace
            </h3>
            <ul className="space-y-3">
              <li>
                <button
                  type="button"
                  onClick={() => navigate({ to: "/" })}
                  data-ocid="footer.browse.link"
                  className="text-background/55 hover:text-background text-sm font-medium transition-colors duration-200"
                >
                  Browse Listings
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => navigate({ to: "/add-product" })}
                  data-ocid="footer.sell.link"
                  className="text-background/55 hover:text-background text-sm font-medium transition-colors duration-200"
                >
                  Sell an Item
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => {
                    navigate({ to: "/" });
                    setTimeout(() => {
                      document
                        .querySelector("#browse")
                        ?.scrollIntoView({ behavior: "smooth" });
                    }, 100);
                  }}
                  data-ocid="footer.categories.link"
                  className="text-background/55 hover:text-background text-sm font-medium transition-colors duration-200"
                >
                  All Categories
                </button>
              </li>
            </ul>
          </div>

          {/* Account links */}
          <div>
            <h3 className="font-display font-semibold text-background/90 text-sm uppercase tracking-widest mb-5">
              Account
            </h3>
            <ul className="space-y-3">
              <li>
                <button
                  type="button"
                  data-ocid="footer.login.link"
                  className="text-background/55 hover:text-background text-sm font-medium transition-colors duration-200"
                  onClick={() => {
                    // Trigger login via nav — placeholder
                  }}
                >
                  Login
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => navigate({ to: "/plans" })}
                  data-ocid="footer.plans.link"
                  className="text-background/55 hover:text-background text-sm font-medium transition-colors duration-200"
                >
                  View Plans
                </button>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="pt-8 border-t border-background/10 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-background/40 text-sm">
            © {currentYear} Resolt. All rights reserved.
          </p>
          <p className="text-background/30 text-xs">
            A local marketplace for everyone.
          </p>
        </div>
      </div>
    </footer>
  );
}
