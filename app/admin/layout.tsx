import type { Metadata } from 'next';
import { AdminSidebar } from '@/components/admin/sidebar';
import { Toaster } from 'sonner';

export const metadata: Metadata = {
  title: 'Admin Dashboard',
  description: 'Topsons Admin Panel',
};

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-background">
      <AdminSidebar />
      <main className="md:ml-64 transition-all duration-300">
        <div className="p-6 md:p-8">
          {children}
        </div>
      </main>
      <Toaster />
    </div>
  );
}
