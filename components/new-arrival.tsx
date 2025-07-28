"use client"
import { ProductCard } from "@/components/product-card"

const dummyProducts = [
  {
    image: "/assets/jumper.jpg",
    title: "Women's Christmas Sweaters",
    rating: 5,
    price: 15.99,
    oldPrice: 26.0,
    colors: ["#22223b", "#f2e9e4", "#c9ada7", "#9a8c98", "#4a4e69"],
    sizes: ["L", "M", "S", "XL", "XXL"],
    sale: true,
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
  },
  {
    image: "/assets/sweater.jpg",
    title: "Kids' Hoodie",
    rating: 4,
    price: 19.99,
    colors: ["#f87171", "#fbbf24", "#34d399"],
    sizes: ["S", "M", "L"],
    sale: false,
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
  },
];

export default function NewArrival() {
  return (
    <section className="px-4 sm:px-0 pt-20">
      <div className="container mx-auto w-full">
        {/* Section Header */}
        <div className="text-center py-6">
          <h2 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">
            New Arrival
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Transforming lives through personalized coaching and unwavering support
          </p>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {dummyProducts.map((product, idx) => (
            <div key={idx} className="flex justify-center">

                <ProductCard {...product} />

            </div>
          ))}
        </div>
      </div>
    </section>
  )
}