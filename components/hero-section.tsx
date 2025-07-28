"use client"
import { useState, useEffect } from "react"
import Image from "next/image"
import { ChevronLeft, ChevronRight, Play, Pause } from "lucide-react"
import { Button } from "@/components/ui/button"

type HeroBanner = {
  id: number
  image: string
  title: string
  subtitle: string
  description: string
  ctaText: string
  ctaLink: string
  badge?: string
  badgeColor?: "red" | "green" | "blue" | "yellow"
}

const heroBanners: HeroBanner[] = [
  {
    id: 1,
    image: "/assets/hero-banner-1.jpg",
    title: "Summer Collection 2024",
    subtitle: "New Arrivals",
    description: "Discover the latest trends in fashion with our exclusive summer collection. Up to 50% off on selected items.",
    ctaText: "Shop Now",
    ctaLink: "/shop",
    badge: "50% OFF",
    badgeColor: "red"
  },
  {
    id: 2,
    image: "/assets/hero-banner-2.jpg",
    title: "Limited Time Offer",
    subtitle: "Flash Sale",
    description: "Don't miss out on our flash sale! Premium quality products at unbeatable prices. Limited stock available.",
    ctaText: "Explore Deals",
    ctaLink: "/deals",
    badge: "FLASH SALE",
    badgeColor: "yellow"
  },
  {
    id: 3,
    image: "/assets/hero-banner-3.jpg",
    title: "Free Shipping",
    subtitle: "On All Orders",
    description: "Enjoy free shipping on all orders over £50. No hidden fees, no surprises. Shop with confidence.",
    ctaText: "Learn More",
    ctaLink: "/shipping",
    badge: "FREE SHIPPING",
    badgeColor: "green"
  }
]

export default function HeroSection() {
  const [currentSlide, setCurrentSlide] = useState(0)
  const [isAutoPlaying, setIsAutoPlaying] = useState(true)

  // Auto-play functionality
  useEffect(() => {
    if (!isAutoPlaying) return

    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroBanners.length)
    }, 5000) // Change slide every 5 seconds

    return () => clearInterval(interval)
  }, [isAutoPlaying])

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % heroBanners.length)
  }

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + heroBanners.length) % heroBanners.length)
  }

  const goToSlide = (index: number) => {
    setCurrentSlide(index)
  }

  const toggleAutoPlay = () => {
    setIsAutoPlaying(!isAutoPlaying)
  }

  const getBadgeColor = (color?: string) => {
    switch (color) {
      case "red":
        return "bg-red-500 text-white"
      case "green":
        return "bg-green-500 text-white"
      case "blue":
        return "bg-blue-500 text-white"
      case "yellow":
        return "bg-yellow-500 text-black"
      default:
        return "bg-gray-500 text-white"
    }
  }

  return (
    <section className="relative w-full h-[400px] sm:h-[500px] md:h-[600px] lg:h-[700px] overflow-hidden">
      {/* Banner Slides */}
      {heroBanners.map((banner, index) => (
        <div
          key={banner.id}
          className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
            index === currentSlide ? "opacity-100" : "opacity-0"
          }`}
        >
          {/* Background Image */}
          <div className="relative w-full h-full">
            <Image
              src={banner.image}
              alt={banner.title}
              fill
              className="object-cover"
              priority={index === 0}
            />
            
            {/* Overlay */}
            <div className="absolute inset-0 bg-black/30" />
            
            {/* Content */}
            <div className="absolute inset-0 flex items-center">
              <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <div className="max-w-2xl">
                  {/* Badge */}
                  {banner.badge && (
                    <div className={`inline-block px-3 py-1 rounded-full text-xs font-semibold mb-4 ${getBadgeColor(banner.badgeColor)}`}>
                      {banner.badge}
                    </div>
                  )}
                  
                  {/* Subtitle */}
                  <p className="text-white/80 text-sm sm:text-base font-medium mb-2">
                    {banner.subtitle}
                  </p>
                  
                  {/* Title */}
                  <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4 leading-tight">
                    {banner.title}
                  </h1>
                  
                  {/* Description */}
                  <p className="text-white/90 text-sm sm:text-base md:text-lg mb-6 max-w-lg">
                    {banner.description}
                  </p>
                  
                  {/* CTA Button */}
                  <Button 
                    size="lg" 
                    className="bg-white text-black hover:bg-gray-100 font-semibold px-8 py-3 text-base"
                    asChild
                  >
                    <a href={banner.ctaLink}>
                      {banner.ctaText}
                    </a>
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      ))}

      {/* Navigation Arrows */}
      <button
        onClick={prevSlide}
        className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/20 hover:bg-white/30 text-white p-2 rounded-full transition-all duration-300 backdrop-blur-sm"
        aria-label="Previous slide"
      >
        <ChevronLeft className="w-6 h-6" />
      </button>
      
      <button
        onClick={nextSlide}
        className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/20 hover:bg-white/30 text-white p-2 rounded-full transition-all duration-300 backdrop-blur-sm"
        aria-label="Next slide"
      >
        <ChevronRight className="w-6 h-6" />
      </button>

      {/* Play/Pause Button */}
      <button
        onClick={toggleAutoPlay}
        className="absolute top-4 right-4 bg-white/20 hover:bg-white/30 text-white p-2 rounded-full transition-all duration-300 backdrop-blur-sm"
        aria-label={isAutoPlaying ? "Pause slideshow" : "Play slideshow"}
      >
        {isAutoPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
      </button>

      {/* Slide Indicators */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2">
        {heroBanners.map((_, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            className={`w-3 h-3 rounded-full transition-all duration-300 ${
              index === currentSlide 
                ? "bg-white scale-125" 
                : "bg-white/50 hover:bg-white/75"
            }`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>

      {/* Progress Bar */}
      <div className="absolute bottom-0 left-0 w-full h-1 bg-white/20">
        <div 
          className="h-full bg-white transition-all duration-1000 ease-linear"
          style={{ 
            width: `${((currentSlide + 1) / heroBanners.length) * 100}%` 
          }}
        />
      </div>
    </section>
  )
}
