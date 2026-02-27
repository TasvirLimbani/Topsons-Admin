'use client';

import { useEffect, useState } from 'react';
import { ShoppingBag, ShoppingCart, Users, TrendingUp } from 'lucide-react';
import { StatCard } from '@/components/admin/stat-card';
import { Card } from '@/components/ui/card';
import { toast } from 'sonner';

interface DashboardData {
  totalOrders: number;
  totalUsers: number;
  totalProducts: number;
  currentMonthSales: number;
  orderStatusCount: Record<string, number>;
  dailySales: { date: string; sales: number }[];
}

export default function AdminDashboard() {
  const [data, setData] = useState<DashboardData>({
    totalOrders: 0,
    totalUsers: 0,
    totalProducts: 0,
    currentMonthSales: 0,
    orderStatusCount: {},
    dailySales: [],
  });

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        setLoading(true);

        const res = await fetch('/api/dashboard');
        const result = await res.json();

        if (!result.success) {
          throw new Error('API failed');
        }

        setData(result.data);
      } catch (error) {
        console.error('Dashboard error:', error);
        toast.error('Failed to load dashboard data');
      } finally {
        setLoading(false);
      }
    };

    fetchDashboard();
  }, []);

  const latestThreeDays = [...data.dailySales]
    .sort((a, b) => b.date.localeCompare(a.date))
    .slice(0, 3);

  return (
    <div className="space-y-10">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-serif font-bold text-foreground">
          Admin Dashboard
        </h1>
        <p className="text-muted-foreground mt-2">
          Overview of your store performance
        </p>
      </div>

      {/* ===================== STATS CARDS ===================== */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Orders"
          value={loading ? '...' : data.totalOrders}
          icon={ShoppingCart}
          description="All orders"
        />

        <StatCard
          title="Current Month Sales"
          value={
            loading
              ? '...'
              : `₹${data.currentMonthSales.toLocaleString()}`
          }
          icon={TrendingUp}
          description="This month revenue"
        />

        <StatCard
          title="Total Users"
          value={loading ? '...' : data.totalUsers}
          icon={Users}
          description="Registered customers"
        />

        <StatCard
          title="Total Products"
          value={loading ? '...' : data.totalProducts}
          icon={ShoppingBag}
          description="Products available"
        />
      </div>

      {/* ===================== ORDER STATUS ===================== */}
      <Card className="p-6">
        <h2 className="text-xl font-bold mb-6">Order Status Overview</h2>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {Object.entries(data.orderStatusCount).map(([status, count]) => (
            <div
              key={status}
              className="p-4 rounded-xl border bg-muted/40 text-center shadow-sm"
            >
              <p className="text-sm text-muted-foreground capitalize">
                {status}
              </p>
              <p className="text-2xl font-bold mt-2">{count}</p>
            </div>
          ))}
        </div>
      </Card>

      {/* ===================== DAILY SALES ===================== */}
      <Card className="p-6">
        <h2 className="text-xl font-bold mb-6">Latest 3 Days Sales</h2>

        <div className="space-y-4">
          {latestThreeDays.map((item) => (
            <div
              key={item.date}
              className="flex justify-between items-center p-4 rounded-lg bg-muted/30 border"
            >
              <p className="font-medium">
                {new Date(item.date).toLocaleDateString()}
              </p>
              <p className="font-bold text-primary">
                ₹{item.sales.toLocaleString()}
              </p>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}