"use client"
import { useState } from "react"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import { 
  Heart, 
  Trash2, 
  ShoppingCart, 
  ArrowRight,
  Plus
} from "lucide-react"

interface WishlistItem {
  id: string
  name: string
  price: number
  originalPrice?: number
  image: string
  color: string
  size: string
}

// Mock wishlist data
const mockWishlistItems: WishlistItem[] = [
  {
    id: "1",
    name: "Women's Christmas Sweaters",
    price: 15.99,
    originalPrice: 26.0,
    image: "/assets/jumper.jpg",
    color: "Red",
    size: "M"
  },
  {
    id: "2",
    name: "Men's Denim Jacket",
    price: 39.99,
    originalPrice: 49.99,
    image: "/assets/shorts.jpg",
    color: "Blue",
    size: "L"
  },
  {
    id: "3",
    name: "Classic Footwear",
    price: 59.99,
    originalPrice: 79.99,
    image: "/assets/jeans.jpg",
    color: "Black",
    size: "9"
  }
]

export default function WishlistSheet() {
  const [wishlistItems, setWishlistItems] = useState<WishlistItem[]>(mockWishlistItems)
  const [isOpen, setIsOpen] = useState(false)

  const removeFromWishlist = (itemId: string) => {
    setWishlistItems(prev => prev.filter(item => item.id !== itemId))
  }

  const moveToCart = (itemId: string) => {
    // In a real app, this would add the item to cart
    console.log("Moving item to cart:", itemId)
    // For now, just remove from wishlist
    removeFromWishlist(itemId)
  }

  const moveAllToCart = () => {
    // In a real app, this would add all items to cart
    console.log("Moving all items to cart")
    setWishlistItems([])
  }

  const calculateTotalSavings = () => {
    return wishlistItems.reduce((total, item) => {
      if (item.originalPrice) {
        return total + (item.originalPrice - item.price)
      }
      return total
    }, 0)
  }

  const getSaleItemsCount = () => {
    return wishlistItems.filter(item => item.originalPrice).length
  }

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" aria-label="Wishlist" className="relative">
          <Heart className="size-5" />
          {wishlistItems.length > 0 && (
            <Badge 
              variant="destructive" 
              className="absolute -top-2 -right-2 h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs"
            >
              {wishlistItems.length}
            </Badge>
          )}
        </Button>
      </SheetTrigger>
      <SheetContent className="w-full sm:max-w-lg p-0 overflow-hidden">
        <div className="flex flex-col h-full">
          {/* Header */}
          <SheetHeader className="p-6 pb-4 border-b">
            <SheetTitle className="text-xl font-bold flex items-center gap-2">
              <Heart className="w-5 h-5 text-red-500" />
              Wishlist ({wishlistItems.length} items)
            </SheetTitle>
          </SheetHeader>
          
          {/* Wishlist Items */}
          <div className="flex-1 overflow-y-auto p-6">
            {wishlistItems.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-center">
                <Heart className="w-16 h-16 text-gray-300 mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Your wishlist is empty</h3>
                <p className="text-gray-500 mb-6">Add some items to your wishlist to see them here</p>
                <Button onClick={() => setIsOpen(false)}>
                  Start Shopping
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
                {wishlistItems.map((item) => (
                  <div key={item.id} className="flex gap-4 p-4 border rounded-lg">
                    {/* Product Image */}
                    <div className="relative w-20 h-20 flex-shrink-0">
                      <Image
                        src={item.image}
                        alt={item.name}
                        fill
                        className="object-cover rounded-md"
                      />
                    </div>
                    
                    {/* Product Details */}
                    <div className="flex-1 min-w-0">
                      <h4 className="font-medium text-sm line-clamp-2">{item.name}</h4>
                      <div className="flex items-center gap-2 mt-1 text-xs text-gray-500">
                        <span>Color: {item.color}</span>
                        <span>•</span>
                        <span>Size: {item.size}</span>
                      </div>
                      
                      {/* Price */}
                      <div className="flex items-center gap-2 mt-2">
                        <span className="font-semibold">£{item.price.toFixed(2)}</span>
                        {item.originalPrice && (
                          <span className="text-sm text-gray-500 line-through">
                            £{item.originalPrice.toFixed(2)}
                          </span>
                        )}
                      </div>
                      
                      {/* Action Buttons */}
                      <div className="flex gap-2 mt-3">
                        <Button
                          size="sm"
                          className="flex-1 text-xs"
                          onClick={() => moveToCart(item.id)}
                        >
                          <ShoppingCart className="w-3 h-3 mr-1" />
                          Move to Cart
                        </Button>
                        
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-red-500 hover:text-red-700 hover:bg-red-50"
                          onClick={() => removeFromWishlist(item.id)}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Footer */}
          {wishlistItems.length > 0 && (
            <div className="border-t p-6 space-y-4">
              {/* Stats */}
              <div className="flex justify-between text-sm text-gray-600">
                <span>Total Items: {wishlistItems.length}</span>
                {getSaleItemsCount() > 0 && (
                  <span className="text-green-600">{getSaleItemsCount()} on sale</span>
                )}
              </div>

              {calculateTotalSavings() > 0 && (
                <div className="text-sm text-green-600 font-medium">
                  Total Savings: £{calculateTotalSavings().toFixed(2)}
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex flex-col gap-3">
                <Button 
                  className="w-full" 
                  onClick={moveAllToCart}
                >
                  <ShoppingCart className="w-4 h-4 mr-2" />
                  Move All to Cart
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
                
                <Button 
                  variant="outline" 
                  className="w-full" 
                  asChild
                >
                  <a href="/wishlist">
                    <Plus className="w-4 h-4 mr-2" />
                    View Full Wishlist
                  </a>
                </Button>
              </div>
            </div>
          )}
        </div>
      </SheetContent>
    </Sheet>
  )
} 