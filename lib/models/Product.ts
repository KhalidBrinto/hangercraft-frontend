import mongoose, { Schema, Document } from 'mongoose';

export interface IProductVariation {
  color?: string;
  size?: string;
  stock: number;
  price: number;
  images: string[];
  sku?: string;
}

export interface IProduct extends Document {
  name: string;
  category: string;
  subcategory?: string;
  description: string;
  hasVariations: boolean;
  variations: IProductVariation[];
  images: string[];
  
  // Pricing & Inventory
  sku: string;
  barcode?: string;
  basePrice: number;
  comparePrice?: number;
  costPrice: number;
  profitMargin: number;
  
  // Product Details
  tags: string[];
  
  // Shipping & Dimensions
  weight: number;
  length: number;
  width: number;
  height: number;
  shippingMethod: string;
  freeShipping: boolean;
  
  // Tax & SEO
  taxRate: number;
  seoTitle?: string;
  seoDescription?: string;
  seoKeywords?: string[];
  
  // Inventory Management
  lowStockAlert: number;
  totalStock: number;
  
  // Publishing
  isPublished: boolean;
  publishDate?: Date;
  isFeatured: boolean;
  isOnSale: boolean;
  saleStartDate?: Date;
  saleEndDate?: Date;
  
  // Metadata
  createdAt: Date;
  updatedAt: Date;
}

type Product = {
  _id: string;
  name: string;
  category: string;
  subcategory?: string;
  basePrice: number;
  images?: string[];
  hasVariations?: boolean;
  // Add other fields you use in the UI/table as needed
};

const ProductVariationSchema = new Schema<IProductVariation>({
  color: { type: String },
  size: { type: String },
  stock: { type: Number, required: true, min: 0 },
  price: { type: Number, required: true, min: 0 },
  images: [{ type: String }],
  sku: { type: String }
});

const ProductSchema = new Schema<IProduct>({
  name: { 
    type: String, 
    required: true, 
    trim: true 
  },
  category: { 
    type: String, 
    required: true 
  },
  subcategory: { 
    type: String 
  },
  description: { 
    type: String, 
    required: true 
  },
  hasVariations: { 
    type: Boolean, 
    default: false 
  },
  variations: [ProductVariationSchema],
  images: [{ type: String }],
  
  // Pricing & Inventory
  sku: { 
    type: String, 
    required: true, 
    unique: true 
  },
  barcode: { 
    type: String 
  },
  basePrice: { 
    type: Number, 
    required: true, 
    min: 0 
  },
  comparePrice: { 
    type: Number, 
    min: 0 
  },
  costPrice: { 
    type: Number, 
    required: true, 
    min: 0 
  },
  profitMargin: { 
    type: Number, 
    default: 0 
  },
  
  // Product Details
  tags: [{ type: String }],
  
  // Shipping & Dimensions
  weight: { 
    type: Number, 
    default: 0 
  },
  length: { 
    type: Number, 
    default: 0 
  },
  width: { 
    type: Number, 
    default: 0 
  },
  height: { 
    type: Number, 
    default: 0 
  },
  shippingMethod: { 
    type: String, 
    default: 'standard' 
  },
  freeShipping: { 
    type: Boolean, 
    default: false 
  },
  
  // Tax & SEO
  taxRate: { 
    type: Number, 
    default: 0 
  },
  seoTitle: { 
    type: String 
  },
  seoDescription: { 
    type: String 
  },
  seoKeywords: [{ type: String }],
  
  // Inventory Management
  lowStockAlert: { 
    type: Number, 
    default: 10 
  },
  totalStock: { 
    type: Number, 
    default: 0 
  },
  
  // Publishing
  isPublished: { 
    type: Boolean, 
    default: false 
  },
  publishDate: { 
    type: Date 
  },
  isFeatured: { 
    type: Boolean, 
    default: false 
  },
  isOnSale: { 
    type: Boolean, 
    default: false 
  },
  saleStartDate: { 
    type: Date 
  },
  saleEndDate: { 
    type: Date 
  }
}, {
  timestamps: true
});

// Indexes for better query performance
ProductSchema.index({ name: 'text', description: 'text' });
ProductSchema.index({ category: 1 });
ProductSchema.index({ isPublished: 1 });
ProductSchema.index({ isFeatured: 1 });
ProductSchema.index({ isOnSale: 1 });
ProductSchema.index({ sku: 1 });

// Pre-save middleware to calculate profit margin
ProductSchema.pre('save', function(next) {
  if (this.basePrice && this.costPrice) {
    this.profitMargin = ((this.basePrice - this.costPrice) / this.basePrice) * 100;
  }
  
  // Calculate total stock from variations if product has variations
  if (this.hasVariations && this.variations.length > 0) {
    this.totalStock = this.variations.reduce((sum, variation) => sum + variation.stock, 0);
  }
  
  next();
});

export default mongoose.models.Product || mongoose.model<IProduct>('Product', ProductSchema); 