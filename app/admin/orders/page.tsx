'use client';

import { useEffect, useState } from 'react';
import { Card } from '@/components/ui/card';
import { useRouter } from 'next/navigation';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { api } from '@/lib/api-client';
import { toast } from 'sonner';
import { Loader2, ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface OrderItem {
  product_id: number;
  product_name: string;
  price: string;
  discounted_price: string;
  fabric: string;
  image: string;
  quantity: number;
}

interface Order {
  id: number;
  order_id: number;
  user_name: string;
  created_at: string;
  delivery_address: string;
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  total_amount: number;
  items: { product_id: number }[];
}

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  // const [currentPage, setCurrentPage] = useState(1);
  // const [totalPages, setTotalPages] = useState(1);
  const [updatingStatus, setUpdatingStatus] = useState<number | null>(null);
  const itemsPerPage = 10;
  const router = useRouter();

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/orders`);

      if (!response.ok) {
        throw new Error('Failed to fetch orders');
      }

      const data = await response.json();
      console.log('[v0] Orders fetched:', data);
      setOrders(data.data || data.orders || []);
      // setTotalPages(Math.ceil((data.total || data.data?.length || 0) / itemsPerPage));
    } catch (error) {
      console.error('[v0] Error fetching orders:', error);
      toast.error('Failed to load orders');
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (orderId: number, newStatus: Order['status']) => {
    try {
      setUpdatingStatus(orderId);

      const response = await fetch('/api/orders/update-status', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          order_id: orderId,
          status: newStatus,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to update');
      }

      // ✅ Update UI instantly without refetch
      setOrders((prev) =>
        prev.map((order) =>
          order.order_id === orderId
            ? { ...order, status: newStatus }
            : order
        )
      );

      toast.success('Order status updated');
    } catch (error) {
      toast.error('Failed to update order status');
    } finally {
      setUpdatingStatus(null);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-700 border-yellow-300';
      case 'processing':
        return 'bg-blue-100 text-blue-700 border-blue-300';
      case 'shipped':
        return 'bg-purple-100 text-purple-700 border-purple-300';
      case 'delivered':
        return 'bg-green-100 text-green-700 border-green-300';
      case 'cancelled':
        return 'bg-red-100 text-red-700 border-red-300';
      default:
        return 'bg-gray-100 text-gray-700 border-gray-300';
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-serif font-bold text-foreground">Orders</h1>
        <p className="text-muted-foreground mt-2">Manage all customer orders</p>
      </div>

      {/* Orders Table */}
      <Card className="p-6 bg-card">
        {loading ? (
          <div className="flex justify-center py-12">
            <Loader2 size={32} className="text-primary animate-spin" />
          </div>
        ) : orders.length === 0 ? (
          <div className="py-12 text-center">
            <p className="text-muted-foreground">No orders found</p>
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="border-border hover:bg-transparent">
                    <TableHead className="font-semibold text-foreground text-center">Order #</TableHead>
                    <TableHead className="font-semibold text-foreground text-center">Customer Name</TableHead>
                    <TableHead className="font-semibold text-foreground text-center">Order Date</TableHead>
                    <TableHead className="font-semibold text-foreground text-center">Items</TableHead>
                    <TableHead className="font-semibold text-foreground text-center">Address</TableHead>
                    <TableHead className="font-semibold text-foreground text-center">Amount</TableHead>
                    <TableHead className="font-semibold text-foreground text-center">Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {orders.map((order) => (
                    <TableRow key={order.id} className="border-border hover:bg-muted/50 transition-colors text-center" onClick={() => router.push(`/admin/orders/${order.order_id}`)}>
                      <TableCell className="font-medium text-foreground">{order.order_id}</TableCell>
                      <TableCell className="text-foreground">{order.user_name}</TableCell>
                      <TableCell className="text-muted-foreground text-sm">
                        {new Date(order.created_at).toLocaleDateString()}
                      </TableCell>
                      <TableCell>
                        <span className="px-3 py-1 rounded-full bg-muted text-sm font-medium">
                          {order.items?.length || 0} Items
                        </span>
                      </TableCell>
                      <TableCell className="text-muted-foreground text-sm max-w-xs truncate">
                        {order.delivery_address}
                      </TableCell>
                      <TableCell className="font-semibold text-foreground">
                        ₹{Number(order.total_amount).toFixed(2)}
                      </TableCell>
                      <TableCell onClick={(e) => e.stopPropagation()}>
                        <div className="flex justify-center">
                          <Select
                            value={order.status}
                            onValueChange={(value) =>
                              handleStatusChange(order.order_id, value as Order['status'])
                            }
                            disabled={updatingStatus === order.order_id}
                          >
                            <SelectTrigger
                              className={`w-36 h-9 border text-sm font-medium transition-all ${getStatusColor(
                                order.status
                              )}`}
                            >
                              <SelectValue />
                            </SelectTrigger>

                            <SelectContent>
                              <SelectItem value="pending">Pending</SelectItem>
                              <SelectItem value="processing">Processing</SelectItem>
                              <SelectItem value="shipped">Shipped</SelectItem>
                              <SelectItem value="delivered">Delivered</SelectItem>
                              <SelectItem value="cancelled">Cancelled</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </>
        )}
      </Card>
    </div>
  );
}
