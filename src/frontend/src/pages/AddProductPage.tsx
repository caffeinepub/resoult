import { useInternetIdentity } from '../hooks/useInternetIdentity';
import { useNavigate } from '@tanstack/react-router';
import ProductForm from '../components/ProductForm';
import { useEffect } from 'react';

export default function AddProductPage() {
  const { identity } = useInternetIdentity();
  const navigate = useNavigate();

  useEffect(() => {
    if (!identity) {
      navigate({ to: '/' });
    }
  }, [identity, navigate]);

  if (!identity) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-amber-50 dark:from-orange-950/20 dark:to-amber-950/20 py-12 px-4">
      <div className="container mx-auto max-w-2xl">
        <div className="bg-card rounded-2xl shadow-lg p-8">
          <h1 className="text-4xl font-bold text-foreground mb-2">List Your Item</h1>
          <p className="text-muted-foreground mb-8">
            Fill in the details below to create your listing
          </p>
          <ProductForm />
        </div>
      </div>
    </div>
  );
}
