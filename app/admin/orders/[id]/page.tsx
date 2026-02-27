'use client';

import { useParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Loader2, ArrowLeft } from 'lucide-react';

interface OrderItem {
    id: number;
    product_id: number;
    product_name: string;
    price: number;
    discounted_price: number;
    fabric: string;
    image: string;
    quantity: number;

    fit: string;
    collar: string;
    sleeve: string;
    sleeve_length: string;
    size: string;
    cuffs: string;
    placket: string;
    pocket: string;
    buttons: string;
    hem_style: string;
    back_style: string;
    monogram: string;
    measurement_type: string;
    neck_size: number;
    chest_size: number;
    sleeve_size: number;
    body_length: number;
}

interface OrderData {
    status: boolean;
    message: string;
    data: {
        order: {
            order_id: number;
            delivery_address: string;
            total_amount: number;
            status: string;
            created_at: string;
        };
        user: {
            user_id: number;
            name: string | null;
            email: string | null;
            mobile: string | null;
        };
        items: OrderItem[];
    };
}

export default function OrderDetailPage() {
    const { id } = useParams();
    const router = useRouter();

    const [data, setData] = useState<OrderData | null>(null);
    const [loading, setLoading] = useState(true);
    const [orderStatus, setOrderStatus] = useState('');
    const [updatingStatus, setUpdatingStatus] = useState(false);

    useEffect(() => {
        const fetchOrderDetail = async () => {
            try {
                const response = await fetch(`/api/orders/${id}`);
                const result = await response.json();
                setData(result);
                setOrderStatus(result?.data?.order?.status || '');
            } catch (error) {
                console.error('Error fetching order detail:', error);
            } finally {
                setLoading(false);
            }
        };

        if (id) fetchOrderDetail();
    }, [id]);

    const handleStatusChange = async (newStatus: string) => {
        try {
            setUpdatingStatus(true);

            const response = await fetch('/api/orders/update-status', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    order_id: order.order_id,
                    status: newStatus,
                }),
            });

            if (!response.ok) {
                throw new Error('Failed to update');
            }

            // ✅ Update local state instantly
            setOrderStatus(newStatus);

        } catch (error) {
            console.error('Failed to update status:', error);
        } finally {
            setUpdatingStatus(false);
        }
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center h-96">
                <Loader2 size={32} className="animate-spin" />
            </div>
        );
    }

    if (!data || !data.data) {
        return <div className="p-8">Order not found</div>;
    }

    const { order, user, items } = data.data;

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
        <div className="p-8 space-y-8">

            {/* Back Button */}
            <Button
                variant="ghost"
                className="flex items-center gap-2"
                onClick={() => router.push('/admin/orders')}
            >
                <ArrowLeft size={18} />
                Back to Orders
            </Button>

            {/* Header */}
            <div>
                <h1 className="text-3xl font-serif font-bold">
                    Order #{order.order_id}
                </h1>
                <p className="text-muted-foreground mt-2">
                    Placed on {order.created_at}
                </p>
            </div>

            {/* Order + User Info */}
            <Card className="p-6 grid md:grid-cols-2 gap-8">

                {/* Order Info */}
                <div className="space-y-4">
                    <h2 className="text-xl font-semibold">Order Information</h2>

                    <p><strong>Total:</strong> ₹{order.total_amount}</p>

                    <div className="space-y-2">
                        <strong>Status</strong>
                        <Select
                            value={orderStatus}
                            onValueChange={handleStatusChange}
                            disabled={updatingStatus}
                        >
                            <SelectTrigger
                                className={`w-40 border font-medium transition-all ${getStatusColor(orderStatus)}`}
                            >
                                {updatingStatus ? (
                                    <Loader2 size={16} className="animate-spin" />
                                ) : (
                                    <SelectValue />
                                )}
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

                    <div>
                        <h3 className="font-semibold mt-4">Delivery Address</h3>
                        <p className="text-muted-foreground">
                            {order.delivery_address}
                        </p>
                    </div>
                </div>

                {/* User Info */}
                <div className="space-y-4">
                    <h2 className="text-xl font-semibold">Customer Information</h2>

                    <p><strong>Name:</strong> {user.name || 'N/A'}</p>
                    <p><strong>Email:</strong> {user.email || 'N/A'}</p>
                    <p><strong>Mobile:</strong> {user.mobile || 'N/A'}</p>
                </div>

            </Card>

            {/* Items */}
            <div>
                <h2 className="text-2xl font-serif font-bold mb-6">
                    Order Items
                </h2>

                <div className="space-y-8">
                    {items.map((item) => (
                        <Card
                            key={item.id}
                            className="p-6 space-y-6"
                        >
                            <div className="flex flex-col md:flex-row gap-6">
                                <img
                                    src={item.image}
                                    alt={item.product_name}
                                    className="w-full md:w-40 h-40 object-cover rounded-lg"
                                />

                                <div className="flex-1 flex justify-between items-start">

                                    {/* Left Content */}
                                    <div className="space-y-2">
                                        <h3 className="text-lg font-semibold">
                                            {item.product_name}
                                        </h3>

                                        <p className="text-sm text-muted-foreground">
                                            Fabric: {item.fabric}
                                        </p>

                                        <p className="text-sm text-muted-foreground">
                                            Size: {item.size}
                                        </p>

                                        <p className="text-sm text-muted-foreground">
                                            Quantity: {item.quantity}
                                        </p>

                                        <p className="text-sm">
                                            Price: ₹{item.discounted_price}
                                        </p>
                                    </div>

                                    {/* Right Subtotal */}
                                    <div className="text-right">
                                        <p className="text-sm text-muted-foreground">
                                            Subtotal
                                        </p>
                                        <p className="text-2xl font-bold text-primary">
                                            ₹{item.discounted_price * item.quantity}
                                        </p>
                                    </div>

                                </div>
                            </div>

                            {/* Customization Details */}
                            <div className="grid md:grid-cols-3 gap-4 text-sm border-t pt-4">
                                <p><strong>Fit:</strong> {item.fit}</p>
                                <p><strong>Collar:</strong> {item.collar}</p>
                                <p><strong>Sleeve:</strong> {item.sleeve}</p>
                                <p><strong>Sleeve Length:</strong> {item.sleeve_length}</p>
                                <p><strong>Cuffs:</strong> {item.cuffs}</p>
                                <p><strong>Placket:</strong> {item.placket}</p>
                                <p><strong>Pocket:</strong> {item.pocket}</p>
                                <p><strong>Buttons:</strong> {item.buttons}</p>
                                <p><strong>Hem Style:</strong> {item.hem_style}</p>
                                <p><strong>Back Style:</strong> {item.back_style}</p>
                                <p><strong>Monogram:</strong> {item.monogram}</p>
                                <p><strong>Measurement Type:</strong> {item.measurement_type}</p>
                                <p><strong>Neck:</strong> {item.neck_size}</p>
                                <p><strong>Chest:</strong> {item.chest_size}</p>
                                <p><strong>Sleeve Size:</strong> {item.sleeve_size}</p>
                                <p><strong>Body Length:</strong> {item.body_length}</p>
                            </div>
                        </Card>
                    ))}
                </div>
            </div>

        </div>
    );
}