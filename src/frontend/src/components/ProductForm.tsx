import { useState } from 'react';
import { useAddProduct, useGetAllCategories } from '../hooks/useQueries';
import { useNavigate } from '@tanstack/react-router';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Loader2 } from 'lucide-react';
import { toast } from 'sonner';

export default function ProductForm() {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [category, setCategory] = useState('');

  const { data: categories, isLoading: categoriesLoading } = useGetAllCategories();
  const addProduct = useAddProduct();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!title.trim() || !description.trim() || !price || !category) {
      toast.error('Please fill in all fields');
      return;
    }

    const priceNum = parseFloat(price);
    if (isNaN(priceNum) || priceNum <= 0) {
      toast.error('Please enter a valid price');
      return;
    }

    try {
      await addProduct.mutateAsync({
        title: title.trim(),
        description: description.trim(),
        price: BigInt(Math.round(priceNum * 100)),
        category,
      });

      toast.success('Product listed successfully!');
      navigate({ to: '/' });
    } catch (error: any) {
      toast.error(error.message || 'Failed to add product');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="title">Title *</Label>
        <Input
          id="title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="e.g., Vintage Bicycle"
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Description *</Label>
        <Textarea
          id="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Describe your item in detail..."
          rows={4}
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="price">Price ($) *</Label>
        <Input
          id="price"
          type="number"
          step="0.01"
          min="0.01"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
          placeholder="0.00"
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="category">Category *</Label>
        <Select value={category} onValueChange={setCategory} required>
          <SelectTrigger id="category">
            <SelectValue placeholder="Select a category" />
          </SelectTrigger>
          <SelectContent>
            {categoriesLoading ? (
              <SelectItem value="loading" disabled>
                Loading categories...
              </SelectItem>
            ) : categories && categories.length > 0 ? (
              categories.map((cat) => (
                <SelectItem key={cat.name} value={cat.name}>
                  {cat.name}
                </SelectItem>
              ))
            ) : (
              <SelectItem value="none" disabled>
                No categories available
              </SelectItem>
            )}
          </SelectContent>
        </Select>
      </div>

      <Button
        type="submit"
        disabled={addProduct.isPending}
        className="w-full bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-700 hover:to-amber-700 text-white"
      >
        {addProduct.isPending ? (
          <>
            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
            Listing...
          </>
        ) : (
          'List Item'
        )}
      </Button>
    </form>
  );
}
