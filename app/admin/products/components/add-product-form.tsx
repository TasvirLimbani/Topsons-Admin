'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
// import { api } from '@/lib/api-client';
import { toast } from 'sonner';
import { Loader2, Upload } from 'lucide-react';

const productSchema = z.object({
  product_name: z.string().min(1, 'Product name is required'),
  price: z.string().regex(/^\d+(\.\d{2})?$/, 'Invalid price'),
  discounted_price: z.string().regex(/^\d+(\.\d{2})?$/, 'Invalid price').optional(),
  description: z.string().min(1, 'Description is required'),
  fabric: z.string().min(1, 'Fabric is required'),
  sku: z.string().min(1, 'SKU is required'),
  stock: z.string().regex(/^\d+$/, 'Stock must be a number'),
  category_id: z.string().min(1, 'Category is required'),
  variation: z.string().optional(),
});

type ProductFormData = z.infer<typeof productSchema>;

interface AddProductFormProps {
  onProductAdded: () => void;
}

export function AddProductForm({ onProductAdded }: AddProductFormProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [images, setImages] = useState<File[]>([]);
  const [imagePreview, setImagePreview] = useState<string[]>([]);
  const [isExpanded, setIsExpanded] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ProductFormData>({
    resolver: zodResolver(productSchema),
  });

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files);
      setImages(files);

      // Create preview URLs
      const previews = files.map(file => URL.createObjectURL(file));
      setImagePreview(previews);
    }
  };

  const onSubmit = async (data: ProductFormData) => {
    try {
      setIsLoading(true);

      const formData = new FormData();
      formData.append('product_name', data.product_name);
      formData.append('price', data.price);
      if (data.discounted_price) {
        formData.append('discounted_price', data.discounted_price);
      }
      formData.append('description', data.description);
      formData.append('fabric', data.fabric);
      formData.append('sku', data.sku);
      formData.append('stock', data.stock);
      formData.append('category_id', data.category_id);
      if (data.variation) {
        formData.append('variation', data.variation);
      }

      // Add images
      images.forEach((image) => {
        formData.append('images[]', image);
      });

      const response = await fetch('/api/products', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Failed to add product');
      }

      await response.json();

      toast.success('Product added successfully!');
      reset();
      setImages([]);
      setImagePreview([]);
      setIsExpanded(false);
      onProductAdded();
    } catch (error) {
      console.error('[v0] Error adding product:', error);
      toast.error('Failed to add product');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="p-6 bg-card">
      {/* <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full text-left flex items-center justify-between"
      >
        <h2 className="text-xl font-serif font-bold text-foreground">Add New Product</h2>
        <span className="text-muted-foreground">{isExpanded ? '−' : '+'}</span>
      </button> */}

      {/* {isExpanded && ( */}
        <form onSubmit={handleSubmit(onSubmit)} className="mt-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Product Name */}
            <div>
              <Label htmlFor="product_name">Product Name *</Label>
              <Input
                id="product_name"
                placeholder="Enter product name"
                {...register('product_name')}
                className="mt-2"
              />
              {errors.product_name && (
                <p className="text-destructive text-sm mt-1">{errors.product_name.message}</p>
              )}
            </div>

            {/* Price */}
            <div>
              <Label htmlFor="price">Price *</Label>
              <Input
                id="price"
                type="number"
                step="0.01"
                placeholder="0.00"
                {...register('price')}
                className="mt-2"
              />
              {errors.price && (
                <p className="text-destructive text-sm mt-1">{errors.price.message}</p>
              )}
            </div>

            {/* Discounted Price */}
            <div>
              <Label htmlFor="discounted_price">Discounted Price</Label>
              <Input
                id="discounted_price"
                type="number"
                step="0.01"
                placeholder="0.00"
                {...register('discounted_price')}
                className="mt-2"
              />
              {errors.discounted_price && (
                <p className="text-destructive text-sm mt-1">{errors.discounted_price.message}</p>
              )}
            </div>

            {/* SKU */}
            <div>
              <Label htmlFor="sku">SKU *</Label>
              <Input
                id="sku"
                placeholder="e.g., OXF-2934"
                {...register('sku')}
                className="mt-2"
              />
              {errors.sku && (
                <p className="text-destructive text-sm mt-1">{errors.sku.message}</p>
              )}
            </div>

            {/* Fabric */}
            <div>
              <Label htmlFor="fabric">Fabric *</Label>
              <Input
                id="fabric"
                placeholder="e.g., Egyptian Cotton"
                {...register('fabric')}
                className="mt-2"
              />
              {errors.fabric && (
                <p className="text-destructive text-sm mt-1">{errors.fabric.message}</p>
              )}
            </div>

            {/* Stock */}
            <div>
              <Label htmlFor="stock">Stock *</Label>
              <Input
                id="stock"
                type="number"
                placeholder="0"
                {...register('stock')}
                className="mt-2"
              />
              {errors.stock && (
                <p className="text-destructive text-sm mt-1">{errors.stock.message}</p>
              )}
            </div>

            {/* Category */}
            <div>
              <Label htmlFor="category_id">Category *</Label>
              <Input
                id="category_id"
                type="number"
                placeholder="Enter category ID"
                {...register('category_id')}
                className="mt-2"
              />
              {errors.category_id && (
                <p className="text-destructive text-sm mt-1">{errors.category_id.message}</p>
              )}
            </div>

            {/* Variation */}
            <div>
              <Label htmlFor="variation">Variation</Label>
              <Input
                id="variation"
                placeholder="e.g., Color, Size"
                {...register('variation')}
                className="mt-2"
              />
            </div>
          </div>

          {/* Description */}
          <div>
            <Label htmlFor="description">Description *</Label>
            <Textarea
              id="description"
              placeholder="Enter product description"
              rows={4}
              {...register('description')}
              className="mt-2"
            />
            {errors.description && (
              <p className="text-destructive text-sm mt-1">{errors.description.message}</p>
            )}
          </div>

          {/* Images */}
          <div>
            <Label htmlFor="images">Product Images</Label>
            <div className="mt-2 border-2 border-dashed border-border rounded-lg p-6 text-center cursor-pointer hover:border-primary transition-colors">
              <input
                id="images"
                type="file"
                multiple
                accept="image/*"
                onChange={handleImageChange}
                className="hidden"
              />
              <label htmlFor="images" className="cursor-pointer">
                <Upload className="mx-auto mb-2 text-muted-foreground" size={24} />
                <p className="text-sm font-medium">Click to upload images</p>
                <p className="text-xs text-muted-foreground">PNG, JPG, GIF up to 10MB</p>
              </label>
            </div>

            {/* Image Previews */}
            {imagePreview.length > 0 && (
              <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-4">
                {imagePreview.map((preview, index) => (
                  <div key={index} className="relative">
                    <img
                      src={preview}
                      alt={`Preview ${index}`}
                      className="w-full h-24 object-cover rounded-lg"
                    />
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Submit Button */}
          <Button
            type="submit"
            disabled={isLoading}
            className="w-full bg-primary hover:bg-primary/90 text-primary-foreground"
          >
            {isLoading ? (
              <>
                <Loader2 size={16} className="mr-2 animate-spin" />
                Adding Product...
              </>
            ) : (
              'Add Product'
            )}
          </Button>
        </form>
      {/* )} */}
    </Card>
  );
}
