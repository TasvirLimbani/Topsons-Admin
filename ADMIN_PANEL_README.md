# Topsons Admin Panel

A luxury admin dashboard for the Topsons Tailors e-commerce platform, built with Next.js and featuring a sophisticated design matching the brand's premium aesthetic.

## Features

### 📊 Dashboard
- **Total Orders**: Live count of all orders
- **Total Sales**: Revenue tracking
- **Total Users**: Customer count
- **Total Products**: Inventory count
- Quick action links to all sections

### 📦 Products Management
- **Add Products**: Form with fields for:
  - Product name, price, discounted price
  - SKU, fabric type, stock quantity
  - Category ID and variation options
  - Multi-image upload support
- **Product List**: Paginated table showing:
  - Product name and pricing
  - SKU and stock status
  - Edit and delete actions
  - Real-time status indicators

### 📋 Orders Management
- **Order List**: Complete view of all orders with:
  - Order number and customer name
  - Order date and delivery address
  - Total amount
- **Status Dropdown**: Change order status on-the-fly:
  - Pending → Processing → Shipped → Delivered
  - Cancel orders as needed
- **Pagination**: Navigate through orders efficiently

### 👥 Users Management
- **User List**: View all customer accounts
  - Full name, email, phone
  - Account creation date
- **Delete Users**: Remove accounts with confirmation
- **Pagination**: Browse through customer base

### 🏷️ Categories Management
- **Add Categories**: Create new product categories with:
  - Category name
  - Category image upload
- **Category Grid**: Visual display of all categories
  - Image preview
  - Delete functionality

## Design System

### Color Palette
- **Primary**: Forest Green (#2d5f4f) - Luxury accent
- **Background**: Cream (#f5f1ed) - Light, warm base
- **Foreground**: Dark Charcoal (#2d2d2d) - Text and accents
- **Sidebar**: Deep Navy - Premium navigation

### Typography
- **Headings**: Serif font (luxury brand feel)
- **Body**: Sans-serif (clean readability)

### Layout
- **Fixed Sidebar**: 16rem (256px) width
- **Responsive**: Collapses to mobile menu on small screens
- **Spacious**: Premium padding and spacing throughout
- **Smooth Transitions**: Hover effects and animations

## Technical Stack

- **Framework**: Next.js 16 (App Router)
- **Form Handling**: React Hook Form + Zod validation
- **Styling**: Tailwind CSS with custom design tokens
- **Components**: shadcn/ui
- **Icons**: Lucide React
- **Notifications**: Sonner Toast
- **API**: Centralized client (`lib/api-client.ts`)

## API Integration

Base URL: `http://topsons.mooo.com`

### Endpoints Used

**Products**:
- `GET /api/product/getproducts.php` - List products
- `POST /api/product/addproduct.php` - Add product
- `POST /api/product/editproduct.php` - Edit product
- `POST /api/product/deleteproduct.php` - Delete product

**Orders**:
- `GET /api/order/getorders.php` - List orders
- `POST /api/order/updatestatus.php` - Update order status

**Users**:
- `GET /api/user/getusers.php` - List users
- `POST /api/user/deleteuser.php` - Delete user

**Categories**:
- `GET /api/category/getcategories.php` - List categories
- `POST /api/category/addcategory.php` - Add category
- `POST /api/category/deletecategory.php` - Delete category

## File Structure

```
/app
  /admin
    /layout.tsx              - Admin layout with sidebar
    /page.tsx                - Dashboard
    /products
      /page.tsx              - Products page
      /components/
        /add-product-form.tsx - Add product form
        /products-table.tsx   - Products table with pagination
    /orders
      /page.tsx              - Orders page with status dropdown
    /users
      /page.tsx              - Users list and delete
    /categories
      /page.tsx              - Categories management
/components/admin
  /sidebar.tsx               - Navigation sidebar
  /stat-card.tsx             - Dashboard stat cards
/lib
  /api-client.ts             - Centralized API client
```

## Getting Started

1. Install dependencies:
   ```bash
   npm install
   ```

2. Start development server:
   ```bash
   npm run dev
   ```

3. Open [http://localhost:3000](http://localhost:3000) - automatically redirects to `/admin`

## Features Highlights

✅ **Responsive Design** - Works on all device sizes
✅ **Form Validation** - Zod schema validation
✅ **Error Handling** - Toast notifications for user feedback
✅ **File Uploads** - Multi-image upload for products
✅ **Pagination** - Efficient data browsing
✅ **Status Management** - Real-time order status updates
✅ **Luxury Design** - Premium aesthetic matching brand
✅ **Performance** - Optimized API calls and caching

## Notes

- All API requests use the centralized client in `lib/api-client.ts`
- Images are uploaded as FormData for multipart requests
- Pagination defaults to 10 items per page
- Mobile sidebar collapses and becomes a menu button
- All deletions require confirmation before execution

---

**Version**: 1.0.0
**Built with**: v0 by Vercel
