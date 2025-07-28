"use client"

import { useState, useEffect } from "react"
import { Plus, Search, Edit, Trash2, Eye, Upload, X, Palette, Ruler, Tag, Globe, Truck, AlertTriangle, DollarSign, Package, EyeOff, Calendar, PaintBucket } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Switch } from "@/components/ui/switch"
import { AppSidebar } from "@/components/app-sidebar"
import { SiteHeader } from "@/components/site-header"
import {
  SidebarInset,
  SidebarProvider,
} from "@/components/ui/sidebar"
import React from "react"
import { productAPI, uploadFile } from "@/lib/api"
import { attributeAPI } from "@/lib/api"

// Sample data for colors and sizes
const categories = [
  {
    id: 1,
    name: "Clothing",
    subcategories: [
      { id: 1, name: "T-Shirts" },
      { id: 2, name: "Jeans" },
      { id: 3, name: "Dresses" },
      { id: 4, name: "Jackets" },
      { id: 5, name: "Hoodies" },
    ]
  },
  {
    id: 2,
    name: "Footwear",
    subcategories: [
      { id: 6, name: "Sneakers" },
      { id: 7, name: "Boots" },
      { id: 8, name: "Sandals" },
      { id: 9, name: "Formal Shoes" },
    ]
  },
  {
    id: 3,
    name: "Accessories",
    subcategories: [
      { id: 10, name: "Bags" },
      { id: 11, name: "Watches" },
      { id: 12, name: "Jewelry" },
      { id: 13, name: "Belts" },
    ]
  },
  {
    id: 4,
    name: "Electronics",
    subcategories: [
      { id: 14, name: "Phones" },
      { id: 15, name: "Laptops" },
      { id: 16, name: "Headphones" },
      { id: 17, name: "Cameras" },
    ]
  }
]

const taxRates = [
  { id: 1, name: "Standard (10%)", rate: 10 },
  { id: 2, name: "Reduced (5%)", rate: 5 },
  { id: 3, name: "Zero (0%)", rate: 0 },
  { id: 4, name: "Exempt", rate: -1 },
]

const shippingMethods = [
  { id: 1, name: "Standard Shipping", cost: 5.99, days: "3-5" },
  { id: 2, name: "Express Shipping", cost: 12.99, days: "1-2" },
  { id: 3, name: "Free Shipping", cost: 0, days: "5-7" },
  { id: 4, name: "Same Day", cost: 25.99, days: "1" },
]

// Sample product data
const sampleProducts = [
  {
    id: 1,
    name: "Classic White T-Shirt",
    category: "Clothing",
    subcategory: "T-Shirts",
    price: 29.99,
    stock: 150,
    status: "In Stock",
    image: "/assets/tshirt.jpg",
    hasVariations: false
  },
  {
    id: 2,
    name: "Denim Jeans",
    category: "Clothing",
    subcategory: "Jeans",
    price: 79.99,
    stock: 45,
    status: "Low Stock",
    image: "/assets/jeans.jpg",
    hasVariations: true
  },
  {
    id: 3,
    name: "Leather Jacket",
    category: "Clothing",
    subcategory: "Jackets",
    price: 199.99,
    stock: 0,
    status: "Out of Stock",
    image: "/assets/jacket.jpg",
    hasVariations: false
  },
  {
    id: 4,
    name: "Running Shoes",
    category: "Footwear",
    subcategory: "Sneakers",
    price: 89.99,
    stock: 78,
    status: "In Stock",
    image: "/assets/shoes.jpg",
    hasVariations: true
  },
  {
    id: 5,
    name: "Backpack",
    category: "Accessories",
    subcategory: "Bags",
    price: 49.99,
    stock: 32,
    status: "Low Stock",
    image: "/assets/backpack.jpg",
    hasVariations: false
  }
]

type Product = {
  _id: string;
  name: string;
  category: string;
  subcategory?: string;
  basePrice: number;
  images?: string[];
  hasVariations?: boolean;
  totalStock?: number;
  status?: string; // <-- Add this line
  lowStockAlert?: number; // <-- Add this line
  // Add other fields you use in the UI/table as needed
};

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [searchTerm, setSearchTerm] = useState("")
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [editingProduct, setEditingProduct] = useState(null)
  
  // Database colors and sizes state
  const [dbColors, setDbColors] = useState<Array<{_id: string, name: string, hexCode: string}>>([])
  const [dbSizes, setDbSizes] = useState<Array<{_id: string, name: string}>>([])
  const [attributesLoading, setAttributesLoading] = useState(false)
  
  // Form state
  const [productName, setProductName] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("")
  const [selectedSubcategory, setSelectedSubcategory] = useState("")
  const [description, setDescription] = useState("")
  const [hasVariations, setHasVariations] = useState(false)
  const [selectedColors, setSelectedColors] = useState<string[]>([])
  const [selectedSizes, setSelectedSizes] = useState<string[]>([])
  const [variations, setVariations] = useState<Array<{
    id: string;
    color: { _id: string; name: string; hexCode: string };
    size: { _id: string; name: string };
    stock: number;
    price: number;
    images: string[];
  }>>([])
  const [productImages, setProductImages] = useState<string[]>([])
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [imageUploadLoading, setImageUploadLoading] = useState(false)

  // Enhanced form state
  const [sku, setSku] = useState("")
  const [barcode, setBarcode] = useState("")
  const [basePrice, setBasePrice] = useState("")
  const [comparePrice, setComparePrice] = useState("")
  const [costPrice, setCostPrice] = useState("")
  const [profitMargin, setProfitMargin] = useState("")
  const [tags, setTags] = useState<string[]>([])
  const [newTag, setNewTag] = useState("")
  const [weight, setWeight] = useState("")
  const [length, setLength] = useState("")
  const [width, setWidth] = useState("")
  const [height, setHeight] = useState("")
  const [selectedTaxRate, setSelectedTaxRate] = useState("")
  const [selectedShippingMethod, setSelectedShippingMethod] = useState("")
  const [isFreeShipping, setIsFreeShipping] = useState(false)
  const [seoTitle, setSeoTitle] = useState("")
  const [seoDescription, setSeoDescription] = useState("")
  const [seoKeywords, setSeoKeywords] = useState("")
  const [isPublished, setIsPublished] = useState(false)
  const [publishDate, setPublishDate] = useState("")
  const [lowStockAlert, setLowStockAlert] = useState(10)
  const [isFeatured, setIsFeatured] = useState(false)
  const [isOnSale, setIsOnSale] = useState(false)
  const [saleStartDate, setSaleStartDate] = useState("")
  const [saleEndDate, setSaleEndDate] = useState("")
  const [metaTitle, setMetaTitle] = useState("")
  const [metaDescription, setMetaDescription] = useState("")

  // Attribute creation modal state
  const [isAttributeDialogOpen, setIsAttributeDialogOpen] = useState(false)
  const [attributeType, setAttributeType] = useState<"color" | "size" | "">("")
  const [attributeColorName, setAttributeColorName] = useState("")
  const [attributeColorHex, setAttributeColorHex] = useState("#000000")
  const [attributeSizeName, setAttributeSizeName] = useState("")
  const [attributeLoading, setAttributeLoading] = useState(false)

  const filteredProducts = products.filter(product =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (product.category?.toLowerCase() || '').includes(searchTerm.toLowerCase())
  )

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "In Stock":
        return <Badge className="bg-green-100 text-green-800">In Stock</Badge>
      case "Low Stock":
        return <Badge className="bg-yellow-100 text-yellow-800">Low Stock</Badge>
      case "Out of Stock":
        return <Badge className="bg-red-100 text-red-800">Out of Stock</Badge>
      default:
        return <Badge>{status}</Badge>
    }
  }

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      const result = await productAPI.delete(id)
      if (result.success) {
        setProducts(products.filter(product => product._id !== id))
      } else {
        alert(result.error || 'Failed to delete product')
      }
    }
  }

  // Fetch products from API
  useEffect(() => {
    async function fetchProducts() {
      const result = await productAPI.getAll()
      if (result.success && Array.isArray(result.data)) {
        setProducts(result.data)
      }
    }
    fetchProducts()
  }, [])

  // Fetch attributes from API
  useEffect(() => {
    async function fetchAttributes() {
      setAttributesLoading(true)
      const result = await attributeAPI.getAll()
      console.log('Attributes API result:', result)
      if (result.success) {
        const response = result as { success: boolean; colors: Array<{_id: string, name: string, hexCode: string}>; sizes: Array<{_id: string, name: string}> }
        console.log('Colors:', response.colors)
        console.log('Sizes:', response.sizes)
        setDbColors(response.colors || [])
        setDbSizes(response.sizes || [])
      }
      setAttributesLoading(false)
    }
    fetchAttributes()
  }, [])

  // File upload handler for product images
  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || [])
    setImageUploadLoading(true)
    const uploadedUrls: string[] = []
    for (const file of files) {
      const result = await uploadFile(file as File)
      if (result.success && result.url) {
        uploadedUrls.push(result.url)
      }
    }
    setProductImages([...productImages, ...uploadedUrls])
    setImageUploadLoading(false)
  }

  const removeImage = (index: number) => {
    setProductImages(productImages.filter((_, i) => i !== index))
  }

  const handleColorToggle = (colorId: string) => {
    setSelectedColors(prev => 
      prev.includes(colorId) 
        ? prev.filter(id => id !== colorId)
        : [...prev, colorId]
    )
  }

  const handleSizeToggle = (sizeId: string) => {
    setSelectedSizes(prev => 
      prev.includes(sizeId) 
        ? prev.filter(id => id !== sizeId)
        : [...prev, sizeId]
    )
  }

  const generateVariations = () => {
    if (!hasVariations) {
      setVariations([])
      return
    }

    const newVariations: Array<{
      id: string;
      color: { _id: string; name: string; hexCode: string };
      size: { _id: string; name: string };
      stock: number;
      price: number;
      images: string[];
    }> = []
    
    for (const colorId of selectedColors) {
      for (const sizeId of selectedSizes) {
        const color = dbColors.find(c => c._id === colorId)
        const size = dbSizes.find(s => s._id === sizeId)
        if (color && size) {
          newVariations.push({
            id: `${colorId}-${sizeId}`,
            color: color,
            size: size,
            stock: 0,
            price: 0,
            images: []
          })
        }
      }
    }
    setVariations(newVariations)
  }

  const handleVariationImageUpload = async (variationId: string, e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || [])
    setImageUploadLoading(true)
    const uploadedUrls: string[] = []
    for (const file of files) {
      const result = await uploadFile(file as File)
      if (result.success && result.url) {
        uploadedUrls.push(result.url)
      }
    }
    setVariations(prev => prev.map(v => 
      v.id === variationId 
        ? { ...v, images: [...v.images, ...uploadedUrls] }
        : v
    ))
    setImageUploadLoading(false)
  }

  const removeVariationImage = (variationId: string, imageIndex: number) => {
    setVariations(prev => prev.map(v => 
      v.id === variationId 
        ? { ...v, images: v.images.filter((_, i) => i !== imageIndex) }
        : v
    ))
  }

  const updateVariation = (variationId: string, field: string, value: string | number) => {
    setVariations(prev => prev.map(v => 
      v.id === variationId 
        ? { ...v, [field]: value }
        : v
    ))
  }

  const addTag = () => {
    if (newTag.trim() && !tags.includes(newTag.trim())) {
      setTags([...tags, newTag.trim()])
      setNewTag("")
    }
  }

  const removeTag = (tagToRemove: string) => {
    setTags(tags.filter(tag => tag !== tagToRemove))
  }

  const calculateProfitMargin = () => {
    const base = parseFloat(basePrice) || 0
    const cost = parseFloat(costPrice) || 0
    if (base > 0 && cost > 0) {
      const margin = ((base - cost) / base) * 100
      setProfitMargin(margin.toFixed(2))
    }
  }

  // Generate variations when colors or sizes change
  React.useEffect(() => {
    if (hasVariations) {
      generateVariations()
    }
  }, [selectedColors, selectedSizes, hasVariations])

  // Calculate profit margin when base price or cost price changes
  React.useEffect(() => {
    calculateProfitMargin()
  }, [basePrice, costPrice])

  const resetForm = () => {
    setProductName("")
    setSelectedCategory("")
    setSelectedSubcategory("")
    setDescription("")
    setHasVariations(false)
    setSelectedColors([])
    setSelectedSizes([])
    setVariations([])
    setProductImages([])
    setSku("")
    setBarcode("")
    setBasePrice("")
    setComparePrice("")
    setCostPrice("")
    setProfitMargin("")
    setTags([])
    setNewTag("")
    setWeight("")
    setLength("")
    setWidth("")
    setHeight("")
    setSelectedTaxRate("")
    setSelectedShippingMethod("")
    setIsFreeShipping(false)
    setSeoTitle("")
    setSeoDescription("")
    setSeoKeywords("")
    setIsPublished(false)
    setPublishDate("")
    setLowStockAlert(10)
    setIsFeatured(false)
    setIsOnSale(false)
    setSaleStartDate("")
    setSaleEndDate("")
    setMetaTitle("")
    setMetaDescription("")
  }

  // Submit handler for creating a new product
  const handleSubmit = async () => {
    setIsSubmitting(true)
    // Prepare product data
    const categoryObj = categories.find(c => c.id.toString() === selectedCategory)
    const subcategoryObj = categoryObj?.subcategories.find(s => s.id.toString() === selectedSubcategory)
    const taxObj = taxRates.find(t => t.id.toString() === selectedTaxRate)
    const shippingObj = shippingMethods.find(s => s.id.toString() === selectedShippingMethod)
    const productData: Record<string, unknown> = {
      name: productName,
      category: categoryObj?.name || "",
      subcategory: subcategoryObj?.name || "",
      description,
      hasVariations,
      variations: hasVariations ? variations : [],
      images: !hasVariations ? productImages : [],
      sku,
      barcode,
      basePrice: parseFloat(basePrice) || 0,
      comparePrice: parseFloat(comparePrice) || undefined,
      costPrice: parseFloat(costPrice) || 0,
      tags,
      weight: parseFloat(weight) || 0,
      length: parseFloat(length) || 0,
      width: parseFloat(width) || 0,
      height: parseFloat(height) || 0,
      shippingMethod: shippingObj?.name || "",
      freeShipping: isFreeShipping,
      taxRate: taxObj?.rate ?? 0,
      seoTitle,
      seoDescription,
      seoKeywords: seoKeywords.split(',').map(k => k.trim()).filter(Boolean),
      lowStockAlert,
      isPublished,
      publishDate: publishDate ? new Date(publishDate) : undefined,
      isFeatured,
      isOnSale,
      saleStartDate: saleStartDate ? new Date(saleStartDate) : undefined,
      saleEndDate: saleEndDate ? new Date(saleEndDate) : undefined,
    }
    const result = await productAPI.create(productData)
    setIsSubmitting(false)
    if (
      result.success &&
      result.data &&
      typeof result.data === 'object' &&
      '_id' in result.data &&
      'name' in result.data &&
      'category' in result.data &&
      'basePrice' in result.data
    ) {
      setProducts([result.data as Product, ...products]);
    }
    if (result.success && result.data) {
      setIsAddDialogOpen(false)
      resetForm()
    } else {
      alert(result.error || 'Failed to create product')
    }
  }

  const getStatus = (product: Product) => {
    if (product.totalStock === 0) return "Out of Stock";
    if (product.totalStock && product.lowStockAlert && product.totalStock <= product.lowStockAlert) return "Low Stock";
    return "In Stock";
  };

  const handleCreateAttribute = async () => {
    setAttributeLoading(true);
    let result;
    if (attributeType === "color") {
      result = await attributeAPI.create({ type: "color", name: attributeColorName, hexCode: attributeColorHex });
    } else if (attributeType === "size") {
      result = await attributeAPI.create({ type: "size", name: attributeSizeName });
    }
    setAttributeLoading(false);
    if (result?.success) {
      alert("Attribute created successfully!");
      setIsAttributeDialogOpen(false);
      setAttributeType("");
      setAttributeColorName("");
      setAttributeColorHex("#000000");
      setAttributeSizeName("");
      // Optionally: refresh local color/size list here
    } else {
      alert(result?.error || "Failed to create attribute");
    }
  };

  return (
    <SidebarProvider
      style={
        {
          "--sidebar-width": "calc(var(--spacing) * 72)",
          "--header-height": "calc(var(--spacing) * 12)",
        } as React.CSSProperties
      }
    >
      <AppSidebar variant="inset" />
      <SidebarInset>
        <SiteHeader />
        <div className="flex flex-1 flex-col">
          <div className="@container/main flex flex-1 flex-col gap-2">
            <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
              {/* Header */}
              <div className="flex justify-between items-center px-4 lg:px-6">
                <div>
                  <h1 className="text-3xl font-bold">Products</h1>
                  <p className="text-muted-foreground">Manage your product inventory</p>
                </div>
                <div className="flex gap-2">
                  <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
                    <DialogTrigger asChild>
                      <Button onClick={resetForm}>
                        <Plus className="mr-2 h-4 w-4" />
                        Add Product
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[1000px] max-h-[90vh] overflow-y-auto">
                      <DialogHeader>
                        <DialogTitle>Create New Product Listing</DialogTitle>
                        <DialogDescription>
                          Add a new product to your store with all the details customers need.
                        </DialogDescription>
                      </DialogHeader>
                      
                      <div className="grid gap-6 py-4">
                        {/* 1. Product Name */}
                        <div className="space-y-4">
                          <h3 className="text-lg font-semibold">1. Product Name</h3>
                          <div className="space-y-2">
                            <Label htmlFor="name">Product Name *</Label>
                            <Input
                              id="name"
                              placeholder="Enter product name"
                              value={productName}
                              onChange={(e) => setProductName(e.target.value)}
                            />
                          </div>
                        </div>

                        {/* 2. Product Category */}
                        <div className="space-y-4">
                          <h3 className="text-lg font-semibold">2. Product Category</h3>
                          <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                              <Label htmlFor="category">Category *</Label>
                              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                                <SelectTrigger>
                                  <SelectValue placeholder="Select category" />
                                </SelectTrigger>
                                <SelectContent>
                                  {categories.map((category) => (
                                    <SelectItem key={category.id} value={category.id.toString()}>
                                      {category.name}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                            </div>
                            <div className="space-y-2">
                              <Label htmlFor="subcategory">Subcategory *</Label>
                              <Select 
                                value={selectedSubcategory} 
                                onValueChange={setSelectedSubcategory}
                                disabled={!selectedCategory}
                              >
                                <SelectTrigger>
                                  <SelectValue placeholder="Select subcategory" />
                                </SelectTrigger>
                                <SelectContent>
                                  {selectedCategory && categories
                                    .find(c => c.id.toString() === selectedCategory)
                                    ?.subcategories.map((subcategory) => (
                                      <SelectItem key={subcategory.id} value={subcategory.id.toString()}>
                                        {subcategory.name}
                                      </SelectItem>
                                    ))}
                                </SelectContent>
                              </Select>
                            </div>
                          </div>
                        </div>

                        {/* 3. Rich Text Description */}
                        <div className="space-y-4">
                          <h3 className="text-lg font-semibold">3. Product Description</h3>
                          <div className="space-y-2">
                            <Label htmlFor="description">Description *</Label>
                            <Textarea
                              id="description"
                              placeholder="Describe your product in detail..."
                              rows={6}
                              value={description}
                              onChange={(e) => setDescription(e.target.value)}
                            />
                            <p className="text-sm text-muted-foreground">
                              Use rich text formatting to make your product description engaging and informative.
                            </p>
                          </div>
                        </div>

                        {/* 4. Product Variations */}
                        <div className="space-y-4">
                          <h3 className="text-lg font-semibold">4. Product Variations</h3>
                          <div className="space-y-4">
                            <div className="flex items-center space-x-2">
                              <Checkbox
                                id="hasVariations"
                                checked={hasVariations}
                                onCheckedChange={(checked) => setHasVariations(checked as boolean)}
                              />
                              <Label htmlFor="hasVariations">This product has variations (colors/sizes)</Label>
                            </div>

                            {hasVariations && (
                              <div className="space-y-6">
                                {/* Colors Selection */}
                                <div className="space-y-3">
                                  <Label className="flex items-center gap-2">
                                    <Palette className="h-4 w-4" />
                                    Select Colors
                                  </Label>
                                  {attributesLoading ? (
                                    <div className="text-sm text-muted-foreground">Loading colors...</div>
                                  ) : dbColors.length === 0 ? (
                                    <div className="text-sm text-muted-foreground">No colors available. Create some colors first.</div>
                                  ) : (
                                  <div className="grid grid-cols-4 gap-3">
                                    {dbColors.map((color) => (
                                      <div
                                        key={color._id}
                                        className={`flex items-center gap-2 p-2 border rounded-lg cursor-pointer transition-colors ${
                                          selectedColors.includes(color._id)
                                            ? 'border-blue-500 bg-blue-50'
                                            : 'border-gray-200 hover:border-gray-300'
                                        }`}
                                        onClick={() => handleColorToggle(color._id)}
                                      >
                                        <div
                                          className="w-4 h-4 rounded-full border"
                                          style={{ backgroundColor: color.hexCode }}
                                        />
                                        <span className="text-sm">{color.name}</span>
                                      </div>
                                    ))}
                                  </div>
                                  )}
                                </div>

                                {/* Sizes Selection */}
                                <div className="space-y-3">
                                  <Label className="flex items-center gap-2">
                                    <Ruler className="h-4 w-4" />
                                    Select Sizes
                                  </Label>
                                  {attributesLoading ? (
                                    <div className="text-sm text-muted-foreground">Loading sizes...</div>
                                  ) : dbSizes.length === 0 ? (
                                    <div className="text-sm text-muted-foreground">No sizes available. Create some sizes first.</div>
                                  ) : (
                                  <div className="grid grid-cols-6 gap-2">
                                    {dbSizes.map((size) => (
                                      <div
                                        key={size._id}
                                        className={`p-2 border rounded-lg text-center cursor-pointer transition-colors ${
                                          selectedSizes.includes(size._id)
                                            ? 'border-blue-500 bg-blue-50 text-blue-700'
                                            : 'border-gray-200 hover:border-gray-300'
                                        }`}
                                        onClick={() => handleSizeToggle(size._id)}
                                      >
                                        <span className="text-sm font-medium">{size.name}</span>
                                      </div>
                                    ))}
                                  </div>
                                  )}
                                </div>

                                {/* Generated Variations */}
                                {variations.length > 0 && (
                                  <div className="space-y-4">
                                    <Label>Variation Combinations ({variations.length} total)</Label>
                                    <div className="space-y-3 max-h-60 overflow-y-auto">
                                      {variations.map((variation) => (
                                        <div key={variation.id} className="border rounded-lg p-4 space-y-3">
                                          <div className="flex items-center gap-3">
                                            <div className="flex items-center gap-2">
                                              <div
                                                className="w-4 h-4 rounded-full border"
                                                style={{ backgroundColor: variation.color.hexCode }}
                                              />
                                              <span className="font-medium">{variation.color.name}</span>
                                            </div>
                                            <span className="text-gray-400">|</span>
                                            <span className="font-medium">{variation.size.name}</span>
                                          </div>
                                          
                                          <div className="grid grid-cols-3 gap-3">
                                            <div className="space-y-1">
                                              <Label className="text-xs">Stock</Label>
                                              <Input
                                                type="number"
                                                placeholder="0"
                                                value={variation.stock}
                                                onChange={(e) => updateVariation(variation.id, 'stock', parseInt(e.target.value) || 0)}
                                              />
                                            </div>
                                            <div className="space-y-1">
                                              <Label className="text-xs">Price</Label>
                                              <Input
                                                type="number"
                                                placeholder="0.00"
                                                step="0.01"
                                                value={variation.price}
                                                onChange={(e) => updateVariation(variation.id, 'price', parseFloat(e.target.value) || 0)}
                                              />
                                            </div>
                                            <div className="space-y-1">
                                              <Label className="text-xs">Images</Label>
                                              <div className="flex gap-1">
                                                {variation.images.map((image, index) => (
                                                  <div key={index} className="relative">
                                                    <img
                                                      src={image}
                                                      alt={`${variation.color.name} ${variation.size.name}`}
                                                      className="w-8 h-8 object-cover rounded border"
                                                    />
                                                    <button
                                                      onClick={() => removeVariationImage(variation.id, index)}
                                                      className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full p-0.5 opacity-0 hover:opacity-100 transition-opacity"
                                                    >
                                                      <X className="h-2 w-2" />
                                                    </button>
                                                  </div>
                                                ))}
                                                <label className="w-8 h-8 border-2 border-dashed border-gray-300 rounded flex items-center justify-center cursor-pointer hover:border-gray-400 transition-colors">
                                                  <Upload className="h-3 w-3 text-gray-400" />
                                                  <input
                                                    type="file"
                                                    accept="image/*"
                                                    onChange={(e) => handleVariationImageUpload(variation.id, e)}
                                                    className="hidden"
                                                  />
                                                </label>
                                              </div>
                                            </div>
                                          </div>
                                        </div>
                                      ))}
                                    </div>
                                  </div>
                                )}
                              </div>
                            )}
                          </div>
                        </div>

                        {/* 5. Product Images (for products without variations) */}
                        {!hasVariations && (
                          <div className="space-y-4">
                            <h3 className="text-lg font-semibold">5. Product Images</h3>
                            <div className="grid grid-cols-4 gap-4">
                              {productImages.map((image, index) => (
                                <div key={index} className="relative group">
                                  <img
                                    src={image}
                                    alt={`Product ${index + 1}`}
                                    className="w-full h-24 object-cover rounded-lg border"
                                  />
                                  <button
                                    onClick={() => removeImage(index)}
                                    className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                                  >
                                    <X className="h-3 w-3" />
                                  </button>
                                </div>
                              ))}
                              <label className="w-full h-24 border-2 border-dashed border-gray-300 rounded-lg flex flex-col items-center justify-center cursor-pointer hover:border-gray-400 transition-colors">
                                <Upload className="h-6 w-6 text-gray-400 mb-1" />
                                <span className="text-sm text-gray-500">Add Image</span>
                                <input
                                  type="file"
                                  multiple
                                  accept="image/*"
                                  onChange={handleImageUpload}
                                  className="hidden"
                                />
                              </label>
                            </div>
                          </div>
                        )}

                        {/* 6. Pricing & Inventory */}
                        <div className="space-y-4">
                          <h3 className="text-lg font-semibold flex items-center gap-2">
                            <DollarSign className="h-5 w-5" />
                            6. Pricing & Inventory
                          </h3>
                          <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                              <Label htmlFor="sku">SKU</Label>
                              <Input
                                id="sku"
                                placeholder="Stock keeping unit"
                                value={sku}
                                onChange={(e) => setSku(e.target.value)}
                              />
                            </div>
                            <div className="space-y-2">
                              <Label htmlFor="barcode">Barcode</Label>
                              <Input
                                id="barcode"
                                placeholder="Product barcode"
                                value={barcode}
                                onChange={(e) => setBarcode(e.target.value)}
                              />
                            </div>
                          </div>
                          <div className="grid grid-cols-3 gap-4">
                            <div className="space-y-2">
                              <Label htmlFor="basePrice">Base Price *</Label>
                              <Input
                                id="basePrice"
                                type="number"
                                placeholder="0.00"
                                step="0.01"
                                value={basePrice}
                                onChange={(e) => setBasePrice(e.target.value)}
                              />
                            </div>
                            <div className="space-y-2">
                              <Label htmlFor="comparePrice">Compare Price</Label>
                              <Input
                                id="comparePrice"
                                type="number"
                                placeholder="0.00"
                                step="0.01"
                                value={comparePrice}
                                onChange={(e) => setComparePrice(e.target.value)}
                              />
                            </div>
                            <div className="space-y-2">
                              <Label htmlFor="costPrice">Cost Price</Label>
                              <Input
                                id="costPrice"
                                type="number"
                                placeholder="0.00"
                                step="0.01"
                                value={costPrice}
                                onChange={(e) => setCostPrice(e.target.value)}
                              />
                            </div>
                          </div>
                          {profitMargin && (
                            <div className="text-sm text-muted-foreground">
                              Profit Margin: {profitMargin}%
                            </div>
                          )}
                        </div>

                        {/* 7. Product Tags */}
                        <div className="space-y-4">
                          <h3 className="text-lg font-semibold flex items-center gap-2">
                            <Tag className="h-5 w-5" />
                            7. Product Tags
                          </h3>
                          <div className="space-y-3">
                            <div className="flex gap-2">
                              <Input
                                placeholder="Add a tag"
                                value={newTag}
                                onChange={(e) => setNewTag(e.target.value)}
                                onKeyPress={(e) => e.key === 'Enter' && addTag()}
                              />
                              <Button type="button" variant="outline" onClick={addTag}>
                                Add
                              </Button>
                            </div>
                            {tags.length > 0 && (
                              <div className="flex flex-wrap gap-2">
                                {tags.map((tag, index) => (
                                  <Badge key={index} variant="secondary" className="flex items-center gap-1">
                                    {tag}
                                    <button
                                      onClick={() => removeTag(tag)}
                                      className="ml-1 hover:text-red-500"
                                    >
                                      <X className="h-3 w-3" />
                                    </button>
                                  </Badge>
                                ))}
                              </div>
                            )}
                          </div>
                        </div>

                        {/* 8. Shipping & Dimensions */}
                        <div className="space-y-4">
                          <h3 className="text-lg font-semibold flex items-center gap-2">
                            <Truck className="h-5 w-5" />
                            8. Shipping & Dimensions
                          </h3>
                          <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                              <Label htmlFor="weight">Weight (kg)</Label>
                              <Input
                                id="weight"
                                type="number"
                                placeholder="0.0"
                                step="0.1"
                                value={weight}
                                onChange={(e) => setWeight(e.target.value)}
                              />
                            </div>
                            <div className="space-y-2">
                              <Label>Shipping Method</Label>
                              <Select value={selectedShippingMethod} onValueChange={setSelectedShippingMethod}>
                                <SelectTrigger>
                                  <SelectValue placeholder="Select shipping method" />
                                </SelectTrigger>
                                <SelectContent>
                                  {shippingMethods.map((method) => (
                                    <SelectItem key={method.id} value={method.id.toString()}>
                                      {method.name} - ${method.cost} ({method.days} days)
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                            </div>
                          </div>
                          <div className="grid grid-cols-3 gap-4">
                            <div className="space-y-2">
                              <Label htmlFor="length">Length (cm)</Label>
                              <Input
                                id="length"
                                type="number"
                                placeholder="0"
                                value={length}
                                onChange={(e) => setLength(e.target.value)}
                              />
                            </div>
                            <div className="space-y-2">
                              <Label htmlFor="width">Width (cm)</Label>
                              <Input
                                id="width"
                                type="number"
                                placeholder="0"
                                value={width}
                                onChange={(e) => setWidth(e.target.value)}
                              />
                            </div>
                            <div className="space-y-2">
                              <Label htmlFor="height">Height (cm)</Label>
                              <Input
                                id="height"
                                type="number"
                                placeholder="0"
                                value={height}
                                onChange={(e) => setHeight(e.target.value)}
                              />
                            </div>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Switch
                              id="freeShipping"
                              checked={isFreeShipping}
                              onCheckedChange={setIsFreeShipping}
                            />
                            <Label htmlFor="freeShipping">Free Shipping</Label>
                          </div>
                        </div>

                        {/* 9. Tax Settings */}
                        <div className="space-y-4">
                          <h3 className="text-lg font-semibold">9. Tax Settings</h3>
                          <div className="space-y-2">
                            <Label>Tax Rate</Label>
                            <Select value={selectedTaxRate} onValueChange={setSelectedTaxRate}>
                              <SelectTrigger>
                                <SelectValue placeholder="Select tax rate" />
                              </SelectTrigger>
                              <SelectContent>
                                {taxRates.map((tax) => (
                                  <SelectItem key={tax.id} value={tax.id.toString()}>
                                    {tax.name}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>
                        </div>

                        {/* 10. SEO & Meta */}
                        <div className="space-y-4">
                          <h3 className="text-lg font-semibold flex items-center gap-2">
                            <Globe className="h-5 w-5" />
                            10. SEO & Meta Information
                          </h3>
                          <div className="space-y-3">
                            <div className="space-y-2">
                              <Label htmlFor="seoTitle">SEO Title</Label>
                              <Input
                                id="seoTitle"
                                placeholder="SEO optimized title"
                                value={seoTitle}
                                onChange={(e) => setSeoTitle(e.target.value)}
                              />
                            </div>
                            <div className="space-y-2">
                              <Label htmlFor="seoDescription">SEO Description</Label>
                              <Textarea
                                id="seoDescription"
                                placeholder="SEO meta description..."
                                rows={2}
                                value={seoDescription}
                                onChange={(e) => setSeoDescription(e.target.value)}
                              />
                            </div>
                            <div className="space-y-2">
                              <Label htmlFor="seoKeywords">SEO Keywords</Label>
                              <Input
                                id="seoKeywords"
                                placeholder="keyword1, keyword2, keyword3"
                                value={seoKeywords}
                                onChange={(e) => setSeoKeywords(e.target.value)}
                              />
                            </div>
                          </div>
                        </div>

                        {/* 11. Inventory Alerts */}
                        <div className="space-y-4">
                          <h3 className="text-lg font-semibold flex items-center gap-2">
                            <AlertTriangle className="h-5 w-5" />
                            11. Inventory Alerts
                          </h3>
                          <div className="space-y-2">
                            <Label htmlFor="lowStockAlert">Low Stock Alert Threshold</Label>
                            <Input
                              id="lowStockAlert"
                              type="number"
                              placeholder="10"
                              value={lowStockAlert}
                              onChange={(e) => setLowStockAlert(parseInt(e.target.value) || 0)}
                            />
                            <p className="text-sm text-muted-foreground">
                              Get notified when stock falls below this number
                            </p>
                          </div>
                        </div>

                        {/* 12. Publishing Options */}
                        <div className="space-y-4">
                          <h3 className="text-lg font-semibold flex items-center gap-2">
                            <Calendar className="h-5 w-5" />
                            12. Publishing Options
                          </h3>
                          <div className="space-y-4">
                            <div className="flex items-center space-x-2">
                              <Switch
                                id="published"
                                checked={isPublished}
                                onCheckedChange={setIsPublished}
                              />
                              <Label htmlFor="published">Publish immediately</Label>
                            </div>
                            {!isPublished && (
                              <div className="space-y-2">
                                <Label htmlFor="publishDate">Publish Date</Label>
                                <Input
                                  id="publishDate"
                                  type="datetime-local"
                                  value={publishDate}
                                  onChange={(e) => setPublishDate(e.target.value)}
                                />
                              </div>
                            )}
                            <div className="flex items-center space-x-2">
                              <Switch
                                id="featured"
                                checked={isFeatured}
                                onCheckedChange={setIsFeatured}
                              />
                              <Label htmlFor="featured">Featured Product</Label>
                            </div>
                            <div className="flex items-center space-x-2">
                              <Switch
                                id="onSale"
                                checked={isOnSale}
                                onCheckedChange={setIsOnSale}
                              />
                              <Label htmlFor="onSale">On Sale</Label>
                            </div>
                            {isOnSale && (
                              <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                  <Label htmlFor="saleStartDate">Sale Start Date</Label>
                                  <Input
                                    id="saleStartDate"
                                    type="datetime-local"
                                    value={saleStartDate}
                                    onChange={(e) => setSaleStartDate(e.target.value)}
                                  />
                                </div>
                                <div className="space-y-2">
                                  <Label htmlFor="saleEndDate">Sale End Date</Label>
                                  <Input
                                    id="saleEndDate"
                                    type="datetime-local"
                                    value={saleEndDate}
                                    onChange={(e) => setSaleEndDate(e.target.value)}
                                  />
                                </div>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>

                      <DialogFooter>
                        <Button variant="outline" onClick={() => {
                          setIsAddDialogOpen(false)
                          resetForm()
                        }}>
                          Cancel
                        </Button>
                        <Button onClick={handleSubmit} disabled={isSubmitting || imageUploadLoading}>
                          {isSubmitting || imageUploadLoading ? 'Creating...' : 'Create Product'}
                        </Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                  {/* Create Attributes Button and Modal */}
                  <Dialog open={isAttributeDialogOpen} onOpenChange={setIsAttributeDialogOpen}>
                    <DialogTrigger asChild>
                      <Button variant="outline" onClick={() => {
                        setAttributeType("");
                        setAttributeColorName("");
                        setAttributeColorHex("#000000");
                        setAttributeSizeName("");
                      }}>
                        <PaintBucket className="mr-2 h-4 w-4" />
                        Create Attributes
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-md">
                      <DialogHeader>
                        <DialogTitle>Create Attribute</DialogTitle>
                        <DialogDescription>
                          Add a new color or size attribute to your store.
                        </DialogDescription>
                      </DialogHeader>
                      <div className="space-y-4">
                        {/* Step 1: Choose attribute type */}
                        <div className="flex gap-4">
                          <Button
                            variant={attributeType === "color" ? "default" : "outline"}
                            onClick={() => setAttributeType("color")}
                          >
                            Color
                          </Button>
                          <Button
                            variant={attributeType === "size" ? "default" : "outline"}
                            onClick={() => setAttributeType("size")}
                          >
                            Size
                          </Button>
                        </div>
                        {/* Step 2: Show form based on type */}
                        {attributeType === "color" && (
                          <div className="space-y-3">
                            <Label htmlFor="colorName">Color Name</Label>
                            <Input
                              id="colorName"
                              placeholder="e.g. Sky Blue"
                              value={attributeColorName}
                              onChange={e => setAttributeColorName(e.target.value)}
                            />
                            <Label htmlFor="colorHex">Color Swatch</Label>
                            <input
                              id="colorHex"
                              type="color"
                              value={attributeColorHex}
                              onChange={e => setAttributeColorHex(e.target.value)}
                              className="w-12 h-12 p-0 border-none bg-transparent cursor-pointer"
                            />
                          </div>
                        )}
                        {attributeType === "size" && (
                          <div className="space-y-3">
                            <Label htmlFor="sizeName">Size Name</Label>
                            <Input
                              id="sizeName"
                              placeholder="e.g. XL, 42, Free Size"
                              value={attributeSizeName}
                              onChange={e => setAttributeSizeName(e.target.value)}
                            />
                          </div>
                        )}
                      </div>
                      <DialogFooter>
                        <Button variant="outline" onClick={() => setIsAttributeDialogOpen(false)}>
                          Cancel
                        </Button>
                        <Button
                          disabled={
                            (attributeType === "color" && !attributeColorName) ||
                            (attributeType === "size" && !attributeSizeName) ||
                            !attributeType || attributeLoading
                          }
                          onClick={handleCreateAttribute}
                        >
                          {attributeLoading ? "Creating..." : "Create Attribute"}
                        </Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                </div>
              </div>

              {/* Search and Filters */}
              <Card className="mx-4 lg:mx-6">
                <CardContent className="p-4">
                  <div className="flex gap-4">
                    <div className="relative flex-1">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                      <Input
                        placeholder="Search products..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10"
                      />
                    </div>
                    <Button variant="outline">Filters</Button>
                  </div>
                </CardContent>
              </Card>

              {/* Products Table */}
              <Card className="mx-4 lg:mx-6">
                <CardHeader>
                  <CardTitle>Product Inventory</CardTitle>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Product</TableHead>
                        <TableHead>Category</TableHead>
                        <TableHead>Price</TableHead>
                        <TableHead>Stock</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Variations</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredProducts.map((product) => (
                        <TableRow key={product._id}>
                          <TableCell>
                            <div className="flex items-center gap-3">
                              {product.images && product.images[0] ? (
                                <img src={product.images[0]} alt={product.name} className="w-10 h-10 object-cover rounded-md" />
                              ) : (
                                <span className="w-10 h-10 bg-gray-200 rounded-md flex items-center justify-center text-xs text-gray-500">IMG</span>
                              )}
                              <div>
                                <div className="font-medium">{product.name}</div>
                                <div className="text-sm text-muted-foreground">{product.subcategory}</div>
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>{product.category}</TableCell>
                          <TableCell>${product.basePrice}</TableCell>
                          <TableCell>{product.totalStock ?? 0}</TableCell>
                          <TableCell>{getStatusBadge(getStatus(product))}</TableCell>
                          <TableCell>
                            {product.hasVariations ? (
                              <Badge variant="secondary">With Variations</Badge>
                            ) : (
                              <Badge variant="outline">Simple Product</Badge>
                            )}
                          </TableCell>
                          <TableCell className="text-right">
                            <div className="flex justify-end gap-2">
                              <Button variant="ghost" size="sm">
                                <Eye className="h-4 w-4" />
                              </Button>
                              <Button variant="ghost" size="sm">
                                <Edit className="h-4 w-4" />
                              </Button>
                              <Button 
                                variant="ghost" 
                                size="sm"
                                onClick={() => handleDelete(product._id)}
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}
