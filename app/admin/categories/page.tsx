'use client';

import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { Trash2, Loader2, Upload } from 'lucide-react';

const categorySchema = z.object({
  name: z.string().min(1, 'Category name is required'),
});

type CategoryFormData = z.infer<typeof categorySchema>;

interface Category {
  category_id: number;
  category_name: string;
  image?: string;
}

export default function CategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [deleting, setDeleting] = useState<number | null>(null);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [open, setOpen] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<CategoryFormData>({
    resolver: zodResolver(categorySchema),
  });

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/categories`);
      const data = await response.json();
      setCategories(data.categories || []);
    } catch (error) {
      toast.error('Failed to load categories');
    } finally {
      setLoading(false);
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) {
      const file = e.target.files[0];
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const onSubmit = async (data: CategoryFormData) => {
    try {
      setIsSubmitting(true);
      const formData = new FormData();

      if (editingCategory) {
        formData.append('category_id', String(editingCategory.category_id));
        formData.append('category_name', data.name);

        if (imageFile) {
          formData.append('image', imageFile);
        }

        const response = await fetch('/api/categories/update', {
          method: 'POST',
          body: formData,
        });

        const result = await response.json();

        if (!response.ok || result.status === false) {
          throw new Error(result.message || 'Update failed');
        }

        toast.success('Category updated successfully!');
      } else {
        formData.append('category_name', data.name);

        if (imageFile) {
          formData.append('image', imageFile);
        }

        const response = await fetch('/api/categories', {
          method: 'POST',
          body: formData,
        });

        const result = await response.json();

        if (!response.ok || result.status === false) {
          throw new Error(result.message || 'Add failed');
        }

        toast.success('Category added successfully!');
      }

      reset();
      setImageFile(null);
      setImagePreview(null);
      setEditingCategory(null);
      setOpen(false);
      fetchCategories();

    } catch (error: any) {
      toast.error(error.message || 'Operation failed');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteCategory = async (id: number) => {
    if (!confirm('Are you sure you want to delete this category?')) return;

    try {
      setDeleting(id);

      const response = await fetch('/api/categories/delete', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id }),
      });

      const data = await response.json();

      if (!response.ok || data.status === false) {
        throw new Error(data.message || 'Delete failed');
      }

      toast.success('Category deleted successfully');
      fetchCategories();

    } catch (error) {
      toast.error('Failed to delete category');
    } finally {
      setDeleting(null);
    }
  };

  const handleEditCategory = (category: Category) => {
    setEditingCategory(category);

    reset({
      name: category.category_name,
    });

    setImagePreview(category.image || null);
    setOpen(true);
  };

  return (
    <div className="space-y-8">

      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-serif font-bold">Categories</h1>
          <p className="text-muted-foreground mt-2">
            Manage product categories
          </p>
        </div>

        <Button
          onClick={() => {
            setEditingCategory(null);
            reset();
            setImageFile(null);
            setImagePreview(null);
            setOpen(true);
          }}
        >
          Add Category
        </Button>
      </div>

      {/* Categories Grid */}
      <div>
        <h2 className="text-2xl font-serif font-bold mb-6">
          All Categories
        </h2>

        {loading ? (
          <div className="flex justify-center py-12">
            <Loader2 size={32} className="animate-spin" />
          </div>
        ) : categories.length === 0 ? (
          <Card className="p-12 text-center">
            <p className="text-muted-foreground">No categories found</p>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {categories.map((category) => (
              <Card
                key={category.category_id}
                className="overflow-hidden hover:shadow-md transition p-0 pb-6"
              >
                {category.image && (
                  <img
                    src={category.image}
                    alt={category.category_name}
                    className="w-full h-full object-cover"
                  />
                )}

                <div className="px-4 mt-1">
                  <h3 className="font-semibold text-center text-xl font-serif">
                    {category.category_name}
                  </h3>

                  <div className="flex gap-3 mt-4">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleEditCategory(category)}
                      className="flex-1"
                    >
                      Edit
                    </Button>

                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() =>
                        handleDeleteCategory(category.category_id)
                      }
                      disabled={deleting === category.category_id}
                      className="flex-1 text-destructive"
                    >
                      {deleting === category.category_id ? (
                        <Loader2 size={16} className="animate-spin" />
                      ) : (
                        <Trash2 size={16} />
                      )}
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>

      {/* Popup Modal */}
      {open && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-6">
          <Card className="w-full max-w-xl rounded-2xl shadow-2xl">
            <div className="p-6">

              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-serif font-bold">
                  {editingCategory ? 'Edit Category' : 'Add Category'}
                </h2>

                <button
                  onClick={() => {
                    setOpen(false);
                    setEditingCategory(null);
                    reset();
                    setImageFile(null);
                    setImagePreview(null);
                  }}
                  className="text-xl"
                >
                  ✕
                </button>
              </div>

              <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                <div>
                  <Label htmlFor="name">Category Name *</Label>
                  <Input
                    id="name"
                    {...register('name')}
                    className="mt-2"
                  />
                  {errors.name && (
                    <p className="text-destructive text-sm mt-1">
                      {errors.name.message}
                    </p>
                  )}
                </div>

                <div>
                  <Label htmlFor="image">Category Image</Label>
                  <div className="mt-2 border-2 border-dashed rounded-lg p-6 text-center cursor-pointer hover:border-primary transition">
                    <input
                      id="image"
                      type="file"
                      accept="image/*"
                      onChange={handleImageChange}
                      className="hidden"
                    />
                    <label htmlFor="image" className="cursor-pointer">
                      <Upload className="mx-auto mb-2" size={24} />
                      <p className="text-sm font-medium">
                        Click to upload image
                      </p>
                    </label>
                  </div>

                  {imagePreview && (
                    <div className="mt-4">
                      <img
                        src={imagePreview}
                        alt="Preview"
                        className="w-full h-full object-cover rounded-lg"
                      />
                    </div>
                  )}
                </div>

                <Button type="submit" disabled={isSubmitting} className="w-full">
                  {isSubmitting ? (
                    <>
                      <Loader2 size={16} className="mr-2 animate-spin" />
                      {editingCategory ? 'Updating...' : 'Adding...'}
                    </>
                  ) : editingCategory ? (
                    'Update Category'
                  ) : (
                    'Add Category'
                  )}
                </Button>
              </form>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
}