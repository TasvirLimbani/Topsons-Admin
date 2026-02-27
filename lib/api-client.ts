const API_BASE_URL = 'http://topsons.mooo.com';

export const api = {
  // Product endpoints
  products: {
    getAll: async (page = 1, limit = 10) => {
      const response = await fetch(`${API_BASE_URL}/api/product/getproducts.php?page=${page}&limit=${limit}`);
      if (!response.ok) throw new Error('Failed to fetch products');
      return response.json();
    },
    
    getById: async (id: string) => {
      const response = await fetch(`${API_BASE_URL}/api/product/productdetails.php?id=${id}`);
      if (!response.ok) throw new Error('Failed to fetch product');
      return response.json();
    },

    add: async (formData: FormData) => {
      const response = await fetch(`${API_BASE_URL}/api/product/addproduct.php`, {
        method: 'POST',
        body: formData,
      });
      if (!response.ok) throw new Error('Failed to add product');
      return response.json();
    },

    edit: async (id: string, formData: FormData) => {
      formData.append('id', id);
      const response = await fetch(`${API_BASE_URL}/api/product/editproduct.php`, {
        method: 'POST',
        body: formData,
      });
      if (!response.ok) throw new Error('Failed to edit product');
      return response.json();
    },

    delete: async (id: string) => {
      const response = await fetch(`${API_BASE_URL}/api/product/deleteproduct.php`, {
        method: 'POST',
        body: JSON.stringify({ id }),
        headers: { 'Content-Type': 'application/json' },
      });
      if (!response.ok) throw new Error('Failed to delete product');
      return response.json();
    },
  },

  // Order endpoints
  orders: {
    getAll: async (page = 1, limit = 10) => {
      const response = await fetch(`${API_BASE_URL}/api/order/getorders.php?page=${page}&limit=${limit}`);
      if (!response.ok) throw new Error('Failed to fetch orders');
      return response.json();
    },

    updateStatus: async (id: string, status: string) => {
      const response = await fetch(`${API_BASE_URL}/api/order/updatestatus.php`, {
        method: 'POST',
        body: JSON.stringify({ id, status }),
        headers: { 'Content-Type': 'application/json' },
      });
      if (!response.ok) throw new Error('Failed to update order status');
      return response.json();
    },
  },

  // User endpoints
  users: {
    getAll: async (page = 1, limit = 10) => {
      const response = await fetch(`${API_BASE_URL}/api/user/getusers.php?page=${page}&limit=${limit}`);
      if (!response.ok) throw new Error('Failed to fetch users');
      return response.json();
    },

    delete: async (id: string) => {
      const response = await fetch(`${API_BASE_URL}/api/user/deleteuser.php`, {
        method: 'POST',
        body: JSON.stringify({ id }),
        headers: { 'Content-Type': 'application/json' },
      });
      if (!response.ok) throw new Error('Failed to delete user');
      return response.json();
    },
  },

  // Category endpoints
  categories: {
    getAll: async () => {
      const response = await fetch(`${API_BASE_URL}/api/category/getcategories.php`);
      if (!response.ok) throw new Error('Failed to fetch categories');
      return response.json();
    },

    add: async (formData: FormData) => {
      const response = await fetch(`${API_BASE_URL}/api/category/addcategory.php`, {
        method: 'POST',
        body: formData,
      });
      if (!response.ok) throw new Error('Failed to add category');
      return response.json();
    },

    delete: async (id: string) => {
      const response = await fetch(`${API_BASE_URL}/api/category/deletecategory.php`, {
        method: 'POST',
        body: JSON.stringify({ id }),
        headers: { 'Content-Type': 'application/json' },
      });
      if (!response.ok) throw new Error('Failed to delete category');
      return response.json();
    },
  },

  // Stats endpoints
  stats: {
    getDashboard: async () => {
      const response = await fetch(`${API_BASE_URL}/api/dashboard/stats.php`);
      if (!response.ok) throw new Error('Failed to fetch dashboard stats');
      return response.json();
    },
  },
};
