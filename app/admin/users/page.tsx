'use client';

import { useEffect, useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { api } from '@/lib/api-client';
import { toast } from 'sonner';
import { Trash2, Loader2, ChevronLeft, ChevronRight } from 'lucide-react';

interface User {
  user_id: number;
  first_name: string;
  last_name: string;
  email: string;
  phone?: string;
  created_at: string;
  total_orders: number;
}

export default function UsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [deleting, setDeleting] = useState<number | null>(null);
  const itemsPerPage = 10;
  const router = useRouter();

  useEffect(() => {
    fetchUsers();
  }, [currentPage]);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/users`);

      if (!response.ok) {
        throw new Error('Failed to fetch users');
      }

      const data = await response.json();
      console.log('[v0] Users fetched:', data);
      setUsers(data.data || data.users || []);
      setTotalPages(Math.ceil((data.total || data.data?.length || 0) / itemsPerPage));
    } catch (error) {
      console.error('[v0] Error fetching users:', error);
      toast.error('Failed to load users');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteUser = async (id: number) => {
    if (!confirm('Are you sure you want to delete this user? This action cannot be undone.')) return;

    try {
      setDeleting(id);
      await api.users.delete(String(id));
      toast.success('User deleted successfully');
      fetchUsers();
    } catch (error) {
      console.error('[v0] Error deleting user:', error);
      toast.error('Failed to delete user');
    } finally {
      setDeleting(null);
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-serif font-bold text-foreground">Users</h1>
        <p className="text-muted-foreground mt-2">Manage customer accounts</p>
      </div>

      {/* Users Table */}
      <Card className="p-6 bg-card">
        {loading ? (
          <div className="flex justify-center py-12">
            <Loader2 size={32} className="text-primary animate-spin" />
          </div>
        ) : users.length === 0 ? (
          <div className="py-12 text-center">
            <p className="text-muted-foreground">No users found</p>
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="border-border hover:bg-transparent">
                    <TableHead className="font-semibold text-foreground text-center">User ID</TableHead>
                    <TableHead className="font-semibold text-foreground text-center">Full Name</TableHead>
                    <TableHead className="font-semibold text-foreground text-center">Email</TableHead>
                    <TableHead className="font-semibold text-foreground text-center">Phone</TableHead>
                    <TableHead className="font-semibold text-foreground text-center">Total Orders</TableHead>
                    <TableHead className="font-semibold text-foreground text-center">Joined</TableHead>
                    <TableHead className="font-semibold text-foreground text-center">Action</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {users.map((user) => (
                    <TableRow key={user.user_id} className="border-border hover:bg-muted/50 transition-colors text-center cursor-pointer" onClick={() =>
                      router.push(
                        `/admin/users/${user.user_id}?data=${encodeURIComponent(
                          JSON.stringify(user)
                        )}`
                      )
                    }>
                      <TableCell className="text-muted-foreground">{user.user_id}</TableCell>
                      <TableCell className="font-medium text-foreground">{user.first_name + ' ' + user.last_name}</TableCell>
                      <TableCell className="text-muted-foreground">{user.email}</TableCell>
                      <TableCell className="text-muted-foreground">{user.phone || '—'}</TableCell>
                      <TableCell className="text-muted-foreground">{user.total_orders || '—'}</TableCell>
                      <TableCell className="text-muted-foreground text-sm">
                        {new Date(user.created_at).toLocaleDateString()}
                      </TableCell>
                      <TableCell className="text-right">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDeleteUser(user.user_id)}
                          disabled={deleting === user.user_id}
                          className="text-destructive hover:text-destructive border-border"
                        >
                          {deleting === user.user_id ? (
                            <Loader2 size={16} className="animate-spin" />
                          ) : (
                            <Trash2 size={16} />
                          )}
                        </Button>
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
    </div>
  );
}
