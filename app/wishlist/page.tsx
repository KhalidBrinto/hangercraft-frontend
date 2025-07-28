"use client"
import { useState } from "react"
import Image from "next/image"
import { ProductCard } from "@/components/product-card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Heart, ShoppingCart, Trash2, ArrowRight } from "lucide-react"

// Mock wishlist data
const wishlistProducts = [
  {
    id: "1",
    image: "/assets/jumper.jpg",
    title: "Women's Christmas Sweaters",
    rating: 5,
    price: 15.99,
    oldPrice: 26.0,
    colors: ["#22223b", "#f2e9e4", "#c9ada7", "#9a8c98", "#4a4e69"],
    sizes: ["L", "M", "S", "XL", "XXL"],
    sale: true,
    selectedColor: "#22223b",
    selectedSize: "M"
  },
  {
    id: "2",
    image: "/assets/shorts.jpg",
    title: "Men's Denim Jacket",
    rating: 4,
    price: 39.99,
    oldPrice: 49.99,
    colors: ["#1e293b", "#64748b", "#f1f5f9"],
    sizes: ["M", "L", "XL"],
    sale: true,
    selectedColor: "#1e293b",
    selectedSize: "L"
  },
  {
    id: "3",
    image: "/assets/sweater.jpg",
    title: "Kids' Hoodie",
    rating: 4,
    price: 19.99,
    colors: ["#f87171", "#fbbf24", "#34d399"],
    sizes: ["S", "M", "L"],
    sale: false,
    selectedColor: "#f87171",
    selectedSize: "S"
  },
  {
    id: "4",
    image: "/assets/jeans.jpg",
    title: "Classic Footwear",
    rating: 5,
    price: 59.99,
    oldPrice: 79.99,
    colors: ["#fff", "#000"],
    sizes: ["7", "8", "9", "10", "11"],
    sale: true,
    selectedColor: "#000",
    selectedSize: "9"
  },
  {
    id: "5",
    image: "/assets/jumper.jpg",
    title: "Premium T-Shirt",
    rating: 4,
    price: 24.99,
    colors: ["#ef4444", "#3b82f6", "#10b981"],
    sizes: ["S", "M", "L", "XL"],
    sale: false,
    selectedColor: "#3b82f6",
    selectedSize: "M"
  },
  {
    id: "6",
    image: "/assets/shorts.jpg",
    title: "Summer Dress",
    rating: 5,
    price: 34.99,
    oldPrice: 44.99,
    colors: ["#f59e0b", "#ec4899", "#8b5cf6"],
    sizes: ["XS", "S", "M", "L"],
    sale: true,
    selectedColor: "#ec4899",
    selectedSize: "S"
  }
]

export default function WishlistPage() {
  const [wishlistItems, setWishlistItems] = useState(wishlistProducts)

  const removeFromWishlist = (itemId: string) => {
    setWishlistItems(prev => prev.filter(item => item.id !== itemId))
  }

  const moveToCart = (itemId: string) => {
    // In a real app, this would add the item to cart
    console.log("Moving item to cart:", itemId)
    // For now, just remove from wishlist
    removeFromWishlist(itemId)
  }

  const clearWishlist = () => {
    setWishlistItems([])
  }

  const calculateTotalSavings = () => {
    return wishlistItems.reduce((total, item) => {
      if (item.oldPrice) {
        return total + (item.oldPrice - item.price)
      }
      return total
    }, 0)
  }

  const getSaleItemsCount = () => {
    return wishlistItems.filter(item => item.sale).length
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-[76px]">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <Heart className="w-8 h-8 text-red-500" />
            <h1 className="text-3xl font-bold text-gray-900">My Wishlist</h1>
          </div>
          <p className="text-gray-600">
            Save your favorite items for later
          </p>
        </div>

        {wishlistItems.length === 0 ? (
          /* Empty Wishlist State */
          <div className="text-center py-16">
            <Heart className="w-20 h-20 text-gray-300 mx-auto mb-6" />
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">Your wishlist is empty</h2>
            <p className="text-gray-600 mb-8 max-w-md mx-auto">
              Start adding items to your wishlist by browsing our collection and clicking the heart icon on any product you love.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" asChild>
                <a href="/shop">
                  Start Shopping
                  <ArrowRight className="w-4 h-4 ml-2" />
                </a>
              </Button>
              <Button variant="outline" size="lg" asChild>
                <a href="/new-arrivals">New Arrivals</a>
              </Button>
            </div>
          </div>
        ) : (
          /* Wishlist Content */
          <div className="space-y-8">
            {/* Wishlist Stats */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div className="text-center">
                  <div className="text-2xl font-bold text-gray-900">{wishlistItems.length}</div>
                  <div className="text-sm text-gray-600">Total Items</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600">{getSaleItemsCount()}</div>
                  <div className="text-sm text-gray-600">On Sale</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-red-600">£{calculateTotalSavings().toFixed(2)}</div>
                  <div className="text-sm text-gray-600">Total Savings</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600">
                    £{wishlistItems.reduce((total, item) => total + item.price, 0).toFixed(2)}
                  </div>
                  <div className="text-sm text-gray-600">Total Value</div>
                </div>
              </div>
            </div>

            {/* Actions Bar */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div className="flex items-center gap-4">
                <h2 className="text-lg font-semibold text-gray-900">
                  Wishlist Items ({wishlistItems.length})
                </h2>
                {getSaleItemsCount() > 0 && (
                  <Badge variant="destructive" className="text-xs">
                    {getSaleItemsCount()} on sale
                  </Badge>
                )}
              </div>
              
              <div className="flex gap-3">
                <Button variant="outline" onClick={clearWishlist}>
                  <Trash2 className="w-4 h-4 mr-2" />
                  Clear All
                </Button>
                <Button>
                  <ShoppingCart className="w-4 h-4 mr-2" />
                  Move All to Cart
                </Button>
              </div>
            </div>

            {/* Products Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {wishlistItems.map((product) => (
                <div key={product.id} className="relative group">
                  {/* Remove from Wishlist Button */}
                  <Button
                    variant="ghost"
                    size="icon"
                    className="absolute top-2 right-2 z-10 bg-white/90 hover:bg-white rounded-full shadow-sm opacity-0 group-hover:opacity-100 transition-opacity"
                    onClick={() => removeFromWishlist(product.id)}
                  >
                    <Trash2 className="w-4 h-4 text-red-500" />
                  </Button>

                  {/* Move to Cart Button */}
                  <Button
                    variant="ghost"
                    size="icon"
                    className="absolute top-2 left-2 z-10 bg-white/90 hover:bg-white rounded-full shadow-sm opacity-0 group-hover:opacity-100 transition-opacity"
                    onClick={() => moveToCart(product.id)}
                  >
                    <ShoppingCart className="w-4 h-4 text-blue-500" />
                  </Button>

                  <ProductCard
                    {...product}
                    isWishlisted={true}
                    selectedColor={product.selectedColor}
                    selectedSize={product.selectedSize}
                    onWishlistToggle={() => removeFromWishlist(product.id)}
                  />
                </div>
              ))}
            </div>

            {/* Bottom Actions */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
                <div className="text-sm text-gray-600">
                  <span className="font-medium">{wishlistItems.length}</span> items in your wishlist
                  {getSaleItemsCount() > 0 && (
                    <span className="ml-2 text-green-600">
                      • {getSaleItemsCount()} items on sale
                    </span>
                  )}
                </div>
                
                <div className="flex gap-3">
                  <Button variant="outline" asChild>
                    <a href="/shop">Continue Shopping</a>
                  </Button>
                  <Button>
                    <ShoppingCart className="w-4 h-4 mr-2" />
                    Move All to Cart
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
} 