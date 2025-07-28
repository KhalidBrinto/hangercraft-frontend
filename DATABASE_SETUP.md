# Database Setup Guide

## MongoDB Setup

### 1. Install MongoDB

#### Option A: Local MongoDB Installation
```bash
# macOS (using Homebrew)
brew tap mongodb/brew
brew install mongodb-community

# Start MongoDB service
brew services start mongodb-community

# Ubuntu/Debian
sudo apt update
sudo apt install mongodb

# Start MongoDB service
sudo systemctl start mongodb
sudo systemctl enable mongodb
```

#### Option B: MongoDB Atlas (Cloud)
1. Go to [MongoDB Atlas](https://www.mongodb.com/atlas)
2. Create a free account
3. Create a new cluster
4. Get your connection string

### 2. Environment Configuration

Create a `.env.local` file in your project root:

```env
# MongoDB Connection
MONGODB_URI=mongodb://localhost:27017/hangercraft

# For MongoDB Atlas, use:
# MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/hangercraft?retryWrites=true&w=majority

# Next.js Configuration
NEXTAUTH_SECRET=your-secret-key-here
NEXTAUTH_URL=http://localhost:3000

# PayPal Configuration (optional)
PAYPAL_CLIENT_ID=your-paypal-client-id
PAYPAL_CLIENT_SECRET=your-paypal-client-secret
PAYPAL_MODE=sandbox

# Stripe Configuration (optional)
STRIPE_PUBLISHABLE_KEY=pk_test_your-stripe-publishable-key
STRIPE_SECRET_KEY=sk_test_your-stripe-secret-key
STRIPE_WEBHOOK_SECRET=whsec_your-stripe-webhook-secret
```

### 3. Database Models

The application includes the following MongoDB models:

#### Product Model
- **Fields**: name, category, description, variations, pricing, inventory, shipping, SEO, publishing options
- **Features**: Automatic profit margin calculation, stock management, variation support

#### Order Model
- **Fields**: customer info, items, totals, shipping/billing addresses, payment status, order status
- **Features**: Automatic order number generation, status tracking, payment integration

#### Discount Model
- **Fields**: code, type, value, usage limits, validity dates, conditions
- **Features**: Usage tracking, customer limits, automatic validation

### 4. API Endpoints

#### Products API
```typescript
// Get all products
GET /api/products?page=1&limit=10&category=clothing&search=shirt

// Get single product
GET /api/products/[id]

// Create product
POST /api/products
{
  "name": "Product Name",
  "sku": "PROD-001",
  "basePrice": 29.99,
  "costPrice": 15.00,
  // ... other fields
}

// Update product
PUT /api/products/[id]

// Delete product
DELETE /api/products/[id]
```

#### Orders API
```typescript
// Get all orders
GET /api/orders?status=pending&customerEmail=user@example.com

// Get single order
GET /api/orders/[id]

// Create order
POST /api/orders
{
  "customer": {
    "name": "John Doe",
    "email": "john@example.com"
  },
  "items": [
    {
      "productId": "product_id_here",
      "name": "Product Name",
      "quantity": 2,
      "price": 29.99
    }
  ]
  // ... other fields
}

// Update order
PUT /api/orders/[id]

// Delete order
DELETE /api/orders/[id]
```

#### Discounts API
```typescript
// Get all discounts
GET /api/discounts?isActive=true&type=percentage

// Get single discount
GET /api/discounts/[id]

// Create discount
POST /api/discounts
{
  "code": "SUMMER20",
  "type": "percentage",
  "value": 20,
  "maxUsage": 100,
  "startDate": "2024-06-01",
  "endDate": "2024-06-30"
}

// Update discount
PUT /api/discounts/[id]

// Delete discount
DELETE /api/discounts/[id]
```

### 5. Frontend Integration

Use the API utility functions in your components:

```typescript
import { productAPI, orderAPI, discountAPI } from '@/lib/api';

// Example: Fetch products
const fetchProducts = async () => {
  const result = await productAPI.getAll({
    page: 1,
    limit: 10,
    category: 'clothing'
  });
  
  if (result.success) {
    setProducts(result.data);
  }
};

// Example: Create product
const createProduct = async (productData) => {
  const result = await productAPI.create(productData);
  
  if (result.success) {
    console.log('Product created:', result.data);
  }
};
```

### 6. Database Indexes

The models include optimized indexes for better performance:

- **Products**: Text search on name/description, category, publishing status
- **Orders**: Order number, customer email, status, payment status, creation date
- **Discounts**: Code, active status, validity dates, customer usage

### 7. Testing the Setup

1. Start your development server:
```bash
npm run dev
```

2. Test the API endpoints:
```bash
# Test products API
curl http://localhost:3000/api/products

# Test orders API
curl http://localhost:3000/api/orders

# Test discounts API
curl http://localhost:3000/api/discounts
```

### 8. Production Considerations

1. **Use MongoDB Atlas** for production hosting
2. **Set up proper indexes** for your query patterns
3. **Implement caching** for frequently accessed data
4. **Add rate limiting** to API endpoints
5. **Set up monitoring** and logging
6. **Implement backup strategies**

### 9. Troubleshooting

#### Connection Issues
- Check if MongoDB is running: `brew services list` (macOS) or `sudo systemctl status mongodb` (Linux)
- Verify connection string in `.env.local`
- Check firewall settings

#### API Errors
- Check browser console for CORS issues
- Verify API route files are in correct locations
- Check MongoDB connection in API routes

#### Performance Issues
- Monitor database indexes usage
- Implement pagination for large datasets
- Consider implementing caching layer 