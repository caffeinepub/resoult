import { SiGithub } from 'react-icons/si';
import { Heart } from 'lucide-react';

export default function Footer() {
  const currentYear = new Date().getFullYear();
  const appIdentifier = encodeURIComponent(window.location.hostname || 'local-marketplace');

  return (
    <footer className="border-t bg-muted/30 mt-auto">
      <div className="container mx-auto max-w-6xl px-4 py-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="text-sm text-muted-foreground">
            © {currentYear} Resolt. All rights reserved.
          </div>
          
          <div className="flex items-center gap-1 text-sm text-muted-foreground">
            Built with <Heart className="h-4 w-4 text-orange-600 dark:text-orange-400 fill-current mx-1" /> using{' '}
            <a
              href={`https://caffeine.ai/?utm_source=Caffeine-footer&utm_medium=referral&utm_content=${appIdentifier}`}
              target="_blank"
              rel="noopener noreferrer"
              className="font-medium text-orange-600 dark:text-orange-400 hover:underline"
            >
              caffeine.ai
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
