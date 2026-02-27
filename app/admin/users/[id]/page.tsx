"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { ArrowLeft, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";

interface User {
    user_id: number;
    first_name: string;
    last_name: string;
    email: string;
    phone: string;
    created_at: string;
    total_orders: number;
}

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
    order_id: number;
    total_amount: string;
    status: string;
    created_at: string;
    items: OrderItem[];
}

export default function UserOrdersPage() {
    const { id } = useParams();
    const router = useRouter();
    const searchParams = useSearchParams();

    const [user, setUser] = useState<User | null>(null);
    const [orders, setOrders] = useState<Order[]>([]);
    const [loading, setLoading] = useState(true);

    // ✅ Get user from query
    useEffect(() => {
        const userData = searchParams.get("data");
        if (userData) {
            setUser(JSON.parse(decodeURIComponent(userData)));
        }
    }, [searchParams]);

    // ✅ Fetch Orders
    useEffect(() => {
        const fetchUserOrders = async () => {
            try {
                const response = await fetch(`/api/users/${id}`);
                const result = await response.json();

                if (result.status) {
                    setOrders(result.orders);
                }
            } catch (error) {
                console.error("Error fetching user orders:", error);
            } finally {
                setLoading(false);
            }
        };

        if (id) fetchUserOrders();
    }, [id]);

    const getStatusColor = (status: string) => {
        switch (status) {
            case "delivered":
                return "bg-green-100 text-green-700";
            case "shipped":
                return "bg-blue-100 text-blue-700";
            case "pending":
                return "bg-yellow-100 text-yellow-700";
            case "cancelled":
                return "bg-red-100 text-red-700";
            default:
                return "bg-gray-100 text-gray-700";
        }
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center h-96">
                <Loader2 size={32} className="animate-spin" />
            </div>
        );
    }

    if (!user) {
        return (
            <div className="p-8">
                <button
                    onClick={() => router.push("/admin/users")}
                    className="mb-6 px-4 py-2 bg-black text-white rounded-lg hover:opacity-80"
                >
                    ← Back to Users
                </button>

                <div className="text-red-600 font-semibold text-lg">
                    User does not exist.
                </div>
            </div>
        );
    }

    return (
        <div className="p-8 space-y-8">
            {/* 🔙 Back Button */}
            <Button
                variant="ghost"
                className="flex items-center gap-2"
                onClick={() => router.push('/admin/users')}
            >
                <ArrowLeft size={18} />
                Back to Users
            </Button>

            {/* 👤 User Info Card */}
            {user && (
                <div className="border rounded-xl p-6 shadow-sm bg-white">
                    <h2 className="text-xl font-bold mb-4">User Details</h2>

                    <div className="grid md:grid-cols-3 gap-6 text-sm">
                        <div>
                            <p className="text-gray-500">Name</p>
                            <p className="font-semibold">
                                {user.first_name} {user.last_name}
                            </p>
                        </div>

                        <div>
                            <p className="text-gray-500">Email</p>
                            <p className="font-semibold">{user.email}</p>
                        </div>

                        <div>
                            <p className="text-gray-500">Phone</p>
                            <p className="font-semibold">{user.phone}</p>
                        </div>

                        <div>
                            <p className="text-gray-500">Joined On</p>
                            <p className="font-semibold">
                                {new Date(user.created_at).toLocaleDateString("en-GB", {
                                    day: "2-digit",
                                    month: "short",
                                    year: "numeric",
                                })}
                            </p>
                        </div>

                        <div>
                            <p className="text-gray-500">Total Orders</p>
                            <p className="font-semibold">{user.total_orders}</p>
                        </div>
                    </div>
                </div>
            )}

            {/* 📦 Orders Section */}
            <div className="space-y-6">
                <h1 className="text-2xl font-bold">Orders</h1>

                {orders.length === 0 ? (
                    <div className="text-muted-foreground">
                        No orders found.
                    </div>
                ) : (
                    orders.map((order) => (
                        <div
                            key={order.order_id}
                            className="border rounded-xl p-6 shadow-sm bg-white space-y-4"
                        >
                            {/* Order Header */}
                            <div className="flex justify-between items-center">
                                <div>
                                    <h2 className="font-semibold text-lg">
                                        Order #{order.order_id}
                                    </h2>
                                    <p className="text-sm text-gray-500">
                                        {new Date(order.created_at).toLocaleDateString("en-GB", {
                                            day: "2-digit",
                                            month: "short",
                                            year: "numeric",
                                        })}
                                    </p>
                                </div>

                                <div className="flex items-center gap-4">
                                    <span
                                        className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(
                                            order.status
                                        )}`}
                                    >
                                        {order.status}
                                    </span>

                                    <span className="font-semibold text-lg">
                                        ₹{order.total_amount}
                                    </span>
                                </div>
                            </div>

                            {/* Items */}
                            {order.items.length > 0 ? (
                                <div className="grid md:grid-cols-2 gap-4">
                                    {order.items.map((item, index) => (
                                        <div
                                            key={index}
                                            className="flex gap-4 border rounded-lg p-4"
                                        >
                                            <Image
                                                src={item.image}
                                                alt={item.product_name}
                                                width={80}
                                                height={80}
                                                className="rounded-md object-cover"
                                            />

                                            <div className="flex-1">
                                                <h3 className="font-medium">
                                                    {item.product_name}
                                                </h3>

                                                <p className="text-sm text-gray-500">
                                                    Fabric: {item.fabric}
                                                </p>

                                                <div className="flex justify-between mt-2 text-sm">
                                                    <span>Qty: {item.quantity}</span>
                                                    <span className="font-semibold">
                                                        ₹{item.discounted_price}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <p className="text-sm text-gray-500">
                                    No items in this order.
                                </p>
                            )}
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}