'use client';

import { useState } from 'react';
import { AddProductForm } from './components/add-product-form';
import { ProductsTable } from './components/products-table';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

export default function ProductsPage() {
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const [open, setOpen] = useState(false);

  const handleProductAdded = () => {
    setRefreshTrigger((prev) => prev + 1);
    setOpen(false); // close popup after add
  };

  return (
    <div className="space-y-8">
      {/* Header + Button */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-serif font-bold text-foreground">
            Products
          </h1>
          <p className="text-muted-foreground mt-2">
            Manage your product inventory
          </p>
        </div>

        <Button onClick={() => setOpen(true)}>
          Add Product
        </Button>
      </div>

      {/* Products Table */}
      <ProductsTable
        refreshTrigger={refreshTrigger}
        onProductChanged={handleProductAdded}
      />

      {/* Popup Modal */}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="!max-w-5xl w-full max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Add New Product</DialogTitle>
          </DialogHeader>

          <AddProductForm onProductAdded={handleProductAdded} />
        </DialogContent>
      </Dialog>
    </div>
  );
}