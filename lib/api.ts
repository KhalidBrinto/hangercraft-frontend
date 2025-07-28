// API utility functions for making HTTP requests to the backend

const API_BASE = '/api';

// Generic API call function
async function apiCall<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<{ success: boolean; data?: T; error?: string; message?: string }> {
  try {
    const response = await fetch(`${API_BASE}${endpoint}`, {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    });

    const result = await response.json();
    
    if (!response.ok) {
      throw new Error(result.error || 'API request failed');
    }

    return result;
  } catch (error) {
    console.error('API call failed:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error occurred',
    };
  }
}

// Product API functions
export const productAPI = {
  // Get all products with optional filters
  getAll: async (params?: {
    page?: number;
    limit?: number;
    category?: string;
    search?: string;
    isPublished?: boolean;
  }) => {
    const searchParams = new URLSearchParams();
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined) {
          searchParams.append(key, String(value));
        }
      });
    }
    
    return apiCall(`/products?${searchParams.toString()}`);
  },

  // Get single product by ID
  getById: async (id: string) => {
    return apiCall(`/products/${id}`);
  },

  // Create new product
  create: async (productData: Record<string, unknown>) => {
    return apiCall('/products', {
      method: 'POST',
      body: JSON.stringify(productData),
    });
  },

  // Update product
  update: async (id: string, productData: Record<string, unknown>) => {
    return apiCall(`/products/${id}`, {
      method: 'PUT',
      body: JSON.stringify(productData),
    });
  },

  // Delete product
  delete: async (id: string) => {
    return apiCall(`/products/${id}`, {
      method: 'DELETE',
    });
  },
};

// Order API functions
export const orderAPI = {
  // Get all orders with optional filters
  getAll: async (params?: {
    page?: number;
    limit?: number;
    status?: string;
    paymentStatus?: string;
    customerEmail?: string;
    startDate?: string;
    endDate?: string;
  }) => {
    const searchParams = new URLSearchParams();
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined) {
          searchParams.append(key, String(value));
        }
      });
    }
    
    return apiCall(`/orders?${searchParams.toString()}`);
  },

  // Get single order by ID
  getById: async (id: string) => {
    return apiCall(`/orders/${id}`);
  },

  // Create new order
  create: async (orderData: Record<string, unknown>) => {
    return apiCall('/orders', {
      method: 'POST',
      body: JSON.stringify(orderData),
    });
  },

  // Update order
  update: async (id: string, orderData: Record<string, unknown>) => {
    return apiCall(`/orders/${id}`, {
      method: 'PUT',
      body: JSON.stringify(orderData),
    });
  },

  // Delete order
  delete: async (id: string) => {
    return apiCall(`/orders/${id}`, {
      method: 'DELETE',
    });
  },
};

// Discount API functions
export const discountAPI = {
  // Get all discounts with optional filters
  getAll: async (params?: {
    page?: number;
    limit?: number;
    isActive?: boolean;
    type?: string;
  }) => {
    const searchParams = new URLSearchParams();
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined) {
          searchParams.append(key, String(value));
        }
      });
    }
    
    return apiCall(`/discounts?${searchParams.toString()}`);
  },

  // Get single discount by ID
  getById: async (id: string) => {
    return apiCall(`/discounts/${id}`);
  },

  // Create new discount
  create: async (discountData: Record<string, unknown>) => {
    return apiCall('/discounts', {
      method: 'POST',
      body: JSON.stringify(discountData),
    });
  },

  // Update discount
  update: async (id: string, discountData: Record<string, unknown>) => {
    return apiCall(`/discounts/${id}`, {
      method: 'PUT',
      body: JSON.stringify(discountData),
    });
  },

  // Delete discount
  delete: async (id: string) => {
    return apiCall(`/discounts/${id}`, {
      method: 'DELETE',
    });
  },

  // Validate discount code
  validate: async (code: string, customerEmail?: string) => {
    return apiCall(`/discounts/validate?code=${code}&customerEmail=${customerEmail || ''}`);
  },
};

// Attribute API functions
export const attributeAPI = {
  // Get all colors and sizes
  getAll: async () => {
    return apiCall('/attributes');
  },
  // Create color or size
  create: async (data: { type: 'color' | 'size'; name: string; hexCode?: string }) => {
    return apiCall('/attributes', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },
};

// File Upload API function
export async function uploadFile(file: File): Promise<{ success: boolean; url?: string; error?: string }> {
  const formData = new FormData();
  formData.append('file', file);
  try {
    const response = await fetch('/api/upload', {
      method: 'POST',
      body: formData,
    });
    const result = await response.json();
    return result;
  } catch (error) {
    return { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
  }
}

// Export the generic API call function for custom requests
export { apiCall }; 