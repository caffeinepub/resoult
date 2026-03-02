export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t bg-muted/30 mt-auto">
      <div className="container mx-auto max-w-6xl px-4 py-8">
        <div className="flex items-center justify-center">
          <div className="text-sm text-muted-foreground">
            © {currentYear} Resolt. All rights reserved.
          </div>
        </div>
      </div>
    </footer>
  );
}
