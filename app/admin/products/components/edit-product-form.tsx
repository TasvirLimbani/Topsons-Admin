'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { toast } from 'sonner';
import { Loader2, Upload, X } from 'lucide-react';

interface Product {
  product_id: number;
  product_name: string;
  price: number;
  discounted_price?: number;
  sku: string;
  stock: number;
  description?: string;
  fabric?: string;
  category_id?: number;
  images?: string[];
  variation?: string;
}

interface EditProductFormProps {
  product: Product;
  onClose: () => void;
  onSuccess: () => void;
}

const productSchema = z.object({
  product_name: z.string().min(1, 'Product name is required'),
  price: z.coerce.number().positive('Price must be positive'),
  discounted_price: z.coerce.number().optional(),
  sku: z.string().min(1, 'SKU is required'),
  stock: z.coerce.number().nonnegative('Stock must be non-negative'),
  description: z.string().optional(),
  fabric: z.string().optional(),
  category_id: z.coerce.number().optional(),
  variation: z.string().optional(),
});

type ProductFormData = z.infer<typeof productSchema>;

export function EditProductForm({ product, onClose, onSuccess }: EditProductFormProps) {
  const [loading, setLoading] = useState(false);
  const [images, setImages] = useState<File[]>([]);
  const [imagePreviews, setImagePreviews] = useState<string[]>(product.images || []);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ProductFormData>({
    resolver: zodResolver(productSchema),
    defaultValues: {
      product_name: product.product_name,
      price: product.price,
      discounted_price: product.discounted_price,
      sku: product.sku,
      stock: product.stock,
      description: product.description,
      fabric: product.fabric,
      category_id: product.category_id,
      variation: product.variation,
    },
  });

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    setImages(files);
    
    files.forEach(file => {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreviews(prev => [...prev, reader.result as string]);
      };
      reader.readAsDataURL(file);
    });
  };

  const removeImage = (index: number) => {
    setImagePreviews(prev => prev.filter((_, i) => i !== index));
  };

  const onSubmit = async (data: ProductFormData) => {
    try {
      setLoading(true);

      const formData = new FormData();
      formData.append('product_id', String(product.product_id));
      formData.append('product_name', data.product_name);
      formData.append('price', String(data.price));
      if (data.discounted_price) {
        formData.append('discounted_price', String(data.discounted_price));
      }
      formData.append('description', data.description || '');
      formData.append('fabric', data.fabric || '');
      formData.append('sku', data.sku);
      formData.append('stock', String(data.stock));
      formData.append('category_id', String(data.category_id || 1));
      formData.append('variation', data.variation || '');

      // Add new images
      images.forEach((image) => {
        formData.append('images[]', image);
      });

      console.log('[v0] Submitting update product form');

      const response = await fetch('/api/products/update', {
        method: 'POST',
        body: formData,
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Failed to update product');
      }

      console.log('[v0] Product updated successfully:', result);
      toast.success('Product updated successfully');
      onSuccess();
      onClose();
    } catch (error) {
      console.error('[v0] Error updating product:', error);
      toast.error(error instanceof Error ? error.message : 'Failed to update product');
    } finally {
      setLoading(false);
    }
  };

  return (
  <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-6 h-[100vh]">
    <Card className="w-full max-w-5xl max-h-[90vh] overflow-hidden rounded-2xl shadow-2xl bg-background">
      
      {/* Header */}
      <div className="flex items-center justify-between px-8 py-6 border-b sticky top-0 bg-background z-10">
        <h2 className="text-3xl font-serif font-bold">
          Edit Product
        </h2>
        <button
          onClick={onClose}
          className="p-2 rounded-lg hover:bg-muted transition"
        >
          <X size={24} />
        </button>
      </div>

      {/* Scrollable Content */}
      <div className="overflow-y-auto px-8 py-6">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">

          {/* Grid Fields */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

            {/* Product Name */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Product Name *</label>
              <Input {...register('product_name')} />
              {errors.product_name && (
                <p className="text-destructive text-sm">
                  {errors.product_name.message}
                </p>
              )}
            </div>

            {/* SKU */}
            <div className="space-y-2">
              <label className="text-sm font-medium">SKU *</label>
              <Input {...register('sku')} />
              {errors.sku && (
                <p className="text-destructive text-sm">
                  {errors.sku.message}
                </p>
              )}
            </div>

            {/* Price */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Price *</label>
              <Input {...register('price')} type="number" step="0.01" />
              {errors.price && (
                <p className="text-destructive text-sm">
                  {errors.price.message}
                </p>
              )}
            </div>

            {/* Discounted Price */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Discounted Price</label>
              <Input {...register('discounted_price')} type="number" step="0.01" />
            </div>

            {/* Stock */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Stock *</label>
              <Input {...register('stock')} type="number" />
              {errors.stock && (
                <p className="text-destructive text-sm">
                  {errors.stock.message}
                </p>
              )}
            </div>

            {/* Category */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Category ID</label>
              <Input {...register('category_id')} type="number" />
            </div>

            {/* Fabric */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Fabric</label>
              <Input {...register('fabric')} />
            </div>

            {/* Variation */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Variation</label>
              <Input {...register('variation')} />
            </div>
          </div>

          {/* Description */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Description</label>
            <textarea
              {...register('description')}
              rows={4}
              className="w-full rounded-lg border p-3 focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>

          {/* Images */}
          <div className="space-y-4">
            <label className="text-sm font-medium">Product Images</label>

            <div className="border-2 border-dashed rounded-xl p-8 text-center hover:border-primary transition">
              <input
                type="file"
                multiple
                accept="image/*"
                onChange={handleImageChange}
                className="hidden"
                id="image-input"
              />
              <label
                htmlFor="image-input"
                className="cursor-pointer flex flex-col items-center gap-3"
              >
                <Upload size={28} className="text-primary" />
                <span className="text-sm text-muted-foreground">
                  Click to upload images
                </span>
              </label>
            </div>

            {imagePreviews.length > 0 && (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
                {imagePreviews.map((preview, index) => (
                  <div key={index} className="relative group">
                    <img
                      src={preview}
                      alt={`Preview ${index}`}
                      className="w-full h-28 object-cover rounded-xl border"
                    />
                    <button
                      type="button"
                      onClick={() => removeImage(index)}
                      className="absolute top-2 right-2 bg-black/70 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition"
                    >
                      <X size={14} />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Buttons */}
          <div className="flex justify-end gap-4 pt-4 border-t">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>

            <Button type="submit" disabled={loading}>
              {loading ? (
                <>
                  <Loader2 size={18} className="mr-2 animate-spin" />
                  Updating...
                </>
              ) : (
                'Update Product'
              )}
            </Button>
          </div>

        </form>
      </div>
    </Card>
  </div>
);}