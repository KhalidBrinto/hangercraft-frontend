"use client"

import { useState, useEffect } from "react"
import { useSearchParams } from "next/navigation"
import { ProductCard } from "@/components/product-card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Slider } from "@/components/ui/slider"
import { Checkbox } from "@/components/ui/checkbox"
import { 
  Filter, 
  Grid3X3, 
  List, 
  ChevronDown,
  Star,
  ShoppingCart
} from "lucide-react"

// Extended dummy products for shop page
const shopProducts = [
  {
    image: "/assets/jumper.jpg",
    title: "Women's Christmas Sweaters",
    rating: 5,
    price: 15.99,
    oldPrice: 26.0,
    colors: ["#22223b", "#f2e9e4", "#c9ada7", "#9a8c98", "#4a4e69"],
    sizes: ["L", "M", "S", "XL", "XXL"],
    sale: true,
    category: "Women",
    subcategory: "Sweaters"
  },
  {
    image: "/assets/shorts.jpg",
    title: "Men's Denim Jacket",
    rating: 4,
    price: 39.99,
    oldPrice: 49.99,
    colors: ["#1e293b", "#64748b", "#f1f5f9"],
    sizes: ["M", "L", "XL"],
    sale: true,
    outOfStock: true,
    category: "Men",
    subcategory: "Jackets"
  },
  {
    image: "/assets/sweater.jpg",
    title: "Kids' Hoodie",
    rating: 4,
    price: 19.99,
    colors: ["#f87171", "#fbbf24", "#34d399"],
    sizes: ["S", "M", "L"],
    sale: false,
    category: "Kids",
    subcategory: "Hoodies"
  },
  {
    image: "/assets/jeans.jpg",
    title: "Classic Footwear",
    rating: 5,
    price: 59.99,
    oldPrice: 79.99,
    colors: ["#fff", "#000"],
    sizes: ["7", "8", "9", "10", "11"],
    sale: true,
    category: "Footwear",
    subcategory: "Sneakers"
  },
  {
    image: "/assets/jumper.jpg",
    title: "Premium T-Shirt",
    rating: 4,
    price: 24.99,
    colors: ["#ef4444", "#3b82f6", "#10b981"],
    sizes: ["S", "M", "L", "XL"],
    sale: false,
    category: "Men",
    subcategory: "T-Shirts"
  },
  {
    image: "/assets/shorts.jpg",
    title: "Summer Dress",
    rating: 5,
    price: 34.99,
    oldPrice: 44.99,
    colors: ["#f59e0b", "#ec4899", "#8b5cf6"],
    sizes: ["XS", "S", "M", "L"],
    sale: true,
    category: "Women",
    subcategory: "Dresses"
  },
  {
    image: "/assets/sweater.jpg",
    title: "Winter Boots",
    rating: 4,
    price: 89.99,
    colors: ["#1f2937", "#6b7280"],
    sizes: ["8", "9", "10", "11"],
    sale: false,
    category: "Footwear",
    subcategory: "Boots"
  },
  {
    image: "/assets/jeans.jpg",
    title: "Denim Jeans",
    rating: 4,
    price: 49.99,
    oldPrice: 69.99,
    colors: ["#1e40af", "#1f2937"],
    sizes: ["30", "32", "34", "36"],
    sale: true,
    category: "Men",
    subcategory: "Jeans"
  },
  {
    image: "/assets/jumper.jpg",
    title: "Leather Handbag",
    rating: 5,
    price: 79.99,
    oldPrice: 99.99,
    colors: ["#8b4513", "#000000", "#654321"],
    sizes: ["One Size"],
    sale: true,
    category: "Accessories",
    subcategory: "Bags"
  },
  {
    image: "/assets/shorts.jpg",
    title: "Silver Necklace",
    rating: 4,
    price: 29.99,
    colors: ["#c0c0c0", "#e5e4e2"],
    sizes: ["18\"", "20\"", "22\""],
    sale: false,
    category: "Accessories",
    subcategory: "Jewelry"
  },
  {
    image: "/assets/sweater.jpg",
    title: "Classic Watch",
    rating: 5,
    price: 149.99,
    oldPrice: 199.99,
    colors: ["#000000", "#ffffff"],
    sizes: ["40mm", "42mm", "44mm"],
    sale: true,
    category: "Accessories",
    subcategory: "Watches"
  },
  {
    image: "/assets/jeans.jpg",
    title: "Leather Belt",
    rating: 4,
    price: 19.99,
    colors: ["#8b4513", "#000000"],
    sizes: ["32\"", "34\"", "36\"", "38\""],
    sale: false,
    category: "Accessories",
    subcategory: "Belts"
  },
  {
    image: "/assets/jumper.jpg",
    title: "Designer Sunglasses",
    rating: 4,
    price: 89.99,
    oldPrice: 129.99,
    colors: ["#000000", "#1e293b"],
    sizes: ["One Size"],
    sale: true,
    category: "Accessories",
    subcategory: "Sunglasses"
  },
  {
    image: "/assets/shorts.jpg",
    title: "Wool Scarf",
    rating: 5,
    price: 24.99,
    colors: ["#dc2626", "#1e40af", "#059669"],
    sizes: ["One Size"],
    sale: false,
    category: "Accessories",
    subcategory: "Scarves"
  }
]

const categories = [
  { name: "Women", count: 2 },
  { name: "Men", count: 3 },
  { name: "Kids", count: 1 },
  { name: "Footwear", count: 2 },
  { name: "Accessories", count: 6 }
]

const subcategories = {
  Women: ["Sweaters", "Dresses", "Tops", "Bottoms"],
  Men: ["T-Shirts", "Jackets", "Jeans", "Shirts"],
  Kids: ["Hoodies", "T-Shirts", "Jeans"],
  Footwear: ["Sneakers", "Boots", "Sandals"],
  Accessories: ["Bags", "Jewelry", "Watches", "Belts", "Sunglasses", "Scarves"]
}

export default function ShopPage() {
  const searchParams = useSearchParams()
  const [selectedCategory, setSelectedCategory] = useState<string>("")
  const [selectedSubcategories, setSelectedSubcategories] = useState<string[]>([])
  const [priceRange, setPriceRange] = useState([0, 100])
  const [showSaleOnly, setShowSaleOnly] = useState(false)
  const [sortBy, setSortBy] = useState("featured")
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")

  // Set initial filters based on URL parameters
  useEffect(() => {
    const category = searchParams.get('category')
    const subcategory = searchParams.get('subcategory')
    
    if (category) {
      setSelectedCategory(category)
    }
    
    if (subcategory) {
      setSelectedSubcategories([subcategory])
    }
  }, [searchParams])

  // Filter products based on selected criteria
  const filteredProducts = shopProducts.filter(product => {
    const categoryMatch = !selectedCategory || product.category === selectedCategory
    const subcategoryMatch = selectedSubcategories.length === 0 || 
      selectedSubcategories.includes(product.subcategory)
    const priceMatch = product.price >= priceRange[0] && product.price <= priceRange[1]
    const saleMatch = !showSaleOnly || product.sale

    return categoryMatch && subcategoryMatch && priceMatch && saleMatch
  })

  // Sort products
  const sortedProducts = [...filteredProducts].sort((a, b) => {
    switch (sortBy) {
      case "price-low":
        return a.price - b.price
      case "price-high":
        return b.price - a.price
      case "rating":
        return b.rating - a.rating
      case "newest":
        return 0 // Add date field for proper sorting
      default:
        return 0
    }
  })

  return (
    <div className="min-h-screen bg-gray-50 pt-[76px]">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Shop</h1>
          <p className="text-gray-600">Discover our latest collection</p>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar Filters */}
          <div className="lg:w-64 flex-shrink-0">
            <div className="bg-white rounded-lg shadow-sm p-6 sticky top-4">
              <div className="flex items-center gap-2 mb-6">
                <Filter className="w-5 h-5" />
                <h2 className="text-lg font-semibold">Filters</h2>
              </div>

              {/* Categories */}
              <div className="mb-6">
                <h3 className="font-medium mb-3">Categories</h3>
                <div className="space-y-2">
                  {categories.map((category) => (
                    <div key={category.name} className="flex items-center justify-between">
                      <label className="flex items-center gap-2 cursor-pointer">
                                                 <Checkbox
                           checked={selectedCategory === category.name}
                           onCheckedChange={(checked: boolean) => setSelectedCategory(
                             selectedCategory === category.name ? "" : category.name
                           )}
                         />
                        <span className="text-sm">{category.name}</span>
                      </label>
                      <Badge variant="secondary" className="text-xs">
                        {category.count}
                      </Badge>
                    </div>
                  ))}
                </div>
              </div>

              {/* Subcategories */}
              {selectedCategory && subcategories[selectedCategory as keyof typeof subcategories] && (
                <div className="mb-6">
                  <h3 className="font-medium mb-3">Subcategories</h3>
                  <div className="space-y-2">
                    {subcategories[selectedCategory as keyof typeof subcategories].map((sub) => (
                      <div key={sub} className="flex items-center gap-2">
                                                 <Checkbox
                           checked={selectedSubcategories.includes(sub)}
                           onCheckedChange={(checked: boolean) => {
                             if (checked) {
                               setSelectedSubcategories([...selectedSubcategories, sub])
                             } else {
                               setSelectedSubcategories(selectedSubcategories.filter(s => s !== sub))
                             }
                           }}
                         />
                        <span className="text-sm">{sub}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Price Range */}
              <div className="mb-6">
                <h3 className="font-medium mb-3">Price Range</h3>
                <Slider
                  value={priceRange}
                  onValueChange={setPriceRange}
                  max={100}
                  min={0}
                  step={5}
                  className="w-full"
                />
                <div className="flex justify-between text-sm text-gray-600 mt-2">
                  <span>£{priceRange[0]}</span>
                  <span>£{priceRange[1]}</span>
                </div>
              </div>

              {/* Sale Only */}
              <div className="mb-6">
                <div className="flex items-center gap-2">
                                     <Checkbox
                     checked={showSaleOnly}
                     onCheckedChange={(checked: boolean) => setShowSaleOnly(checked)}
                   />
                  <span className="text-sm">Sale items only</span>
                </div>
              </div>

              {/* Clear Filters */}
              <Button
                variant="outline"
                className="w-full"
                onClick={() => {
                  setSelectedCategory("")
                  setSelectedSubcategories([])
                  setPriceRange([0, 100])
                  setShowSaleOnly(false)
                }}
              >
                Clear Filters
              </Button>
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1">
            {/* Toolbar */}
            <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                  <span className="text-sm text-gray-600">
                    {sortedProducts.length} products
                  </span>
                </div>
                
                <div className="flex items-center gap-4">
                  {/* Sort */}
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-gray-600">Sort by:</span>
                    <select
                      value={sortBy}
                      onChange={(e) => setSortBy(e.target.value)}
                      className="text-sm border rounded-md px-2 py-1"
                    >
                      <option value="featured">Featured</option>
                      <option value="price-low">Price: Low to High</option>
                      <option value="price-high">Price: High to Low</option>
                      <option value="rating">Rating</option>
                      <option value="newest">Newest</option>
                    </select>
                  </div>

                  {/* View Mode */}
                  <div className="flex items-center gap-1 border rounded-md">
                    <Button
                      variant={viewMode === "grid" ? "default" : "ghost"}
                      size="sm"
                      onClick={() => setViewMode("grid")}
                    >
                      <Grid3X3 className="w-4 h-4" />
                    </Button>
                    <Button
                      variant={viewMode === "list" ? "default" : "ghost"}
                      size="sm"
                      onClick={() => setViewMode("list")}
                    >
                      <List className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </div>
            </div>

            {/* Products Grid */}
            <div className={
              viewMode === "grid" 
                ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
                : "space-y-4"
            }>
              {sortedProducts.map((product, idx) => (
                <div key={idx}>
                  <ProductCard {...product} />
                </div>
              ))}
            </div>

            {/* No Results */}
            {sortedProducts.length === 0 && (
              <div className="text-center py-12">
                <ShoppingCart className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No products found</h3>
                                 <p className="text-gray-600 mb-4">
                   Try adjusting your filters to find what you&apos;re looking for.
                 </p>
                <Button
                  onClick={() => {
                    setSelectedCategory("")
                    setSelectedSubcategories([])
                    setPriceRange([0, 100])
                    setShowSaleOnly(false)
                  }}
                >
                  Clear All Filters
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
