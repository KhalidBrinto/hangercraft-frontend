import mongoose, { Schema, Document } from 'mongoose';

export interface IDiscount extends Document {
  code: string;
  type: 'percentage' | 'flat' | 'free_shipping';
  value: number;
  description: string;
  
  // Usage Limits
  maxUsage: number;
  currentUsage: number;
  maxUsagePerCustomer: number;
  
  // Validity
  startDate: Date;
  endDate: Date;
  isActive: boolean;
  
  // Conditions
  minimumOrderAmount?: number;
  maximumDiscountAmount?: number;
  applicableCategories?: string[];
  applicableProducts?: mongoose.Types.ObjectId[];
  
  // Customer Tracking
  usedBy: Array<{
    customerId: string;
    customerEmail: string;
    usageCount: number;
    lastUsed: Date;
  }>;
  
  // Metadata
  createdAt: Date;
  updatedAt: Date;
}

const DiscountSchema = new Schema<IDiscount>({
  code: { 
    type: String, 
    required: true, 
    unique: true, 
    uppercase: true,
    trim: true
  },
  type: { 
    type: String, 
    enum: ['percentage', 'flat', 'free_shipping'],
    required: true 
  },
  value: { 
    type: Number, 
    required: true, 
    min: 0 
  },
  description: { 
    type: String, 
    required: true 
  },
  
  // Usage Limits
  maxUsage: { 
    type: Number, 
    required: true, 
    min: 1 
  },
  currentUsage: { 
    type: Number, 
    default: 0, 
    min: 0 
  },
  maxUsagePerCustomer: { 
    type: Number, 
    default: 1, 
    min: 1 
  },
  
  // Validity
  startDate: { 
    type: Date, 
    required: true 
  },
  endDate: { 
    type: Date, 
    required: true 
  },
  isActive: { 
    type: Boolean, 
    default: true 
  },
  
  // Conditions
  minimumOrderAmount: { 
    type: Number, 
    min: 0 
  },
  maximumDiscountAmount: { 
    type: Number, 
    min: 0 
  },
  applicableCategories: [{ 
    type: String 
  }],
  applicableProducts: [{ 
    type: Schema.Types.ObjectId, 
    ref: 'Product' 
  }],
  
  // Customer Tracking
  usedBy: [{
    customerId: { type: String, required: true },
    customerEmail: { type: String, required: true },
    usageCount: { type: Number, default: 1 },
    lastUsed: { type: Date, default: Date.now }
  }]
}, {
  timestamps: true
});

// Indexes for better query performance
DiscountSchema.index({ code: 1 });
DiscountSchema.index({ isActive: 1 });
DiscountSchema.index({ startDate: 1, endDate: 1 });
DiscountSchema.index({ 'usedBy.customerEmail': 1 });

// Virtual for checking if discount is valid
DiscountSchema.virtual('isValid').get(function() {
  const now = new Date();
  return this.isActive && 
         now >= this.startDate && 
         now <= this.endDate && 
         this.currentUsage < this.maxUsage;
});

// Virtual for checking if discount is expired
DiscountSchema.virtual('isExpired').get(function() {
  const now = new Date();
  return now > this.endDate;
});

// Method to check if customer can use this discount
DiscountSchema.methods.canUseByCustomer = function(customerEmail: string) {
  const customerUsage = this.usedBy.find((u: { customerEmail: string; usageCount: number }) => u.customerEmail === customerEmail);
  if (!customerUsage) return true;
  return customerUsage.usageCount < this.maxUsagePerCustomer;
};

// Method to apply discount to order
DiscountSchema.methods.applyToOrder = function(orderAmount: number) {
  if (!this.isValid) {
    throw new Error('Discount is not valid');
  }
  
  let discountAmount = 0;
  
  if (this.type === 'percentage') {
    discountAmount = (orderAmount * this.value) / 100;
    if (this.maximumDiscountAmount) {
      discountAmount = Math.min(discountAmount, this.maximumDiscountAmount);
    }
  } else if (this.type === 'flat') {
    discountAmount = this.value;
  } else if (this.type === 'free_shipping') {
    discountAmount = 0; // Will be handled separately
  }
  
  return discountAmount;
};

// Method to record usage
DiscountSchema.methods.recordUsage = function(customerEmail: string, customerId?: string) {
  if (!this.isValid) {
    throw new Error('Discount is not valid');
  }
  
  if (this.currentUsage >= this.maxUsage) {
    throw new Error('Discount usage limit exceeded');
  }
  
  const existingUsage = this.usedBy.find((u: { customerEmail: string; usageCount: number }) => u.customerEmail === customerEmail);
  if (existingUsage) {
    if (existingUsage.usageCount >= this.maxUsagePerCustomer) {
      throw new Error('Customer usage limit exceeded');
    }
    existingUsage.usageCount += 1;
    existingUsage.lastUsed = new Date();
  } else {
    this.usedBy.push({
      customerId: customerId || customerEmail,
      customerEmail,
      usageCount: 1,
      lastUsed: new Date()
    });
  }
  
  this.currentUsage += 1;
  return this.save();
};

export default mongoose.models.Discount || mongoose.model<IDiscount>('Discount', DiscountSchema); 