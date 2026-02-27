'use client';

import { useEffect, useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { toast } from 'sonner';
import { Trash2, Edit2, Loader2, ChevronLeft, ChevronRight } from 'lucide-react';
import { EditProductForm } from './edit-product-form';

interface Product {
  product_id: number;
  product_name: string;
  price: number;
  discounted_price?: number;
  sku: string;
  stock: number;
}

interface ProductsTableProps {
  refreshTrigger: number;
  onProductChanged: () => void;
}

export function ProductsTable({ refreshTrigger, onProductChanged }: ProductsTableProps) {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [deleting, setDeleting] = useState<number | null>(null);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const itemsPerPage = 10;

  useEffect(() => {
    fetchProducts();
  }, [currentPage, refreshTrigger]);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/products?page=${currentPage}&limit=${itemsPerPage}`);

      if (!response.ok) {
        throw new Error('Failed to fetch products');
      }

      const data = await response.json();
      console.log('[v0] Products fetched:', data);
      setProducts(data.data || data.products || []);
      setTotalPages(Math.ceil((data.total || data.data?.length || 0) / itemsPerPage));
    } catch (error) {
      console.error('[v0] Error fetching products:', error);
      toast.error('Failed to load products');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this product?')) return;

    try {
      setDeleting(id);

      const response = await fetch('/api/products', {
        method: 'POST', // ✅ POST (not DELETE)
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ id }),
      });

      if (!response.ok) {
        throw new Error('Failed to delete product');
      }

      await response.json();

      toast.success('Product deleted successfully');
      onProductChanged();
      fetchProducts();
    } catch (error) {
      console.error('Error deleting product:', error);
      toast.error('Failed to delete product');
    } finally {
      setDeleting(null);
    }
  };

  const handleEditClick = (product: Product) => {
    setEditingProduct(product);
  };

  const handleEditClose = () => {
    setEditingProduct(null);
  };

  const handleEditSuccess = () => {
    onProductChanged();
    fetchProducts();
  };

  return (
    <>
      {editingProduct && (
        <EditProductForm
          product={editingProduct}
          onClose={handleEditClose}
          onSuccess={handleEditSuccess}
        />
      )}
      <Card className="p-6 bg-card">
        <h2 className="text-xl font-serif font-bold text-foreground mb-6">All Products</h2>

        {loading ? (
          <div className="flex justify-center py-12">
            <Loader2 size={32} className="text-primary animate-spin" />
          </div>
        ) : products.length === 0 ? (
          <div className="py-12 text-center">
            <p className="text-muted-foreground">No products found</p>
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="border-border hover:bg-transparent">
                    <TableHead className="font-semibold text-foreground">Product Name</TableHead>
                    <TableHead className="font-semibold text-foreground">Price</TableHead>
                    <TableHead className="font-semibold text-foreground">Disc. Price</TableHead>
                    <TableHead className="font-semibold text-foreground">SKU</TableHead>
                    <TableHead className="font-semibold text-foreground">Stock</TableHead>
                    <TableHead className="font-semibold text-foreground text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {products.map((product) => (
                    <TableRow key={product.product_id} className="border-border hover:bg-muted/50 transition-colors">
                      <TableCell className="font-medium text-foreground">{product.product_name}</TableCell>
                      <TableCell>₹{Number(product.price).toFixed(2)}</TableCell>
                      <TableCell>
                        {product.discounted_price ? `₹${Number(product.discounted_price).toFixed(2)}` : '—'}
                      </TableCell>
                      <TableCell className="text-muted-foreground text-sm">{product.sku}</TableCell>
                      <TableCell>
                        <span className={`px-2 py-1 rounded text-xs font-semibold ${product.stock > 0 ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                          }`}>
                          {product.stock}
                        </span>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleEditClick(product)}
                            className="text-primary hover:text-white border-border"
                          >
                            <Edit2 size={16} />
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleDelete(product.product_id)}
                            disabled={deleting === product.product_id}
                            className="text-destructive hover:text-destructive border-border"
                          >
                            {deleting === product.product_id ? (
                              <Loader2 size={16} className="animate-spin" />
                            ) : (
                              <Trash2 size={16} />
                            )}
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>

            {/* Pagination */}
            <div className="flex items-center justify-between mt-6 pt-6 border-t border-border">
              <p className="text-sm text-muted-foreground">
                Page {currentPage} of {totalPages}
              </p>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                  disabled={currentPage === 1}
                  className="border-border"
                >
                  <ChevronLeft size={16} />
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                  disabled={currentPage === totalPages}
                  className="border-border"
                >
                  <ChevronRight size={16} />
                </Button>
              </div>
            </div>
          </>
        )}
      </Card>
    </>
  );
}
