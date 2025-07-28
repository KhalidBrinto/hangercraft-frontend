"use client";
import { useState } from "react";
import Image from "next/image";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Star, Heart, ChevronLeft, ChevronRight } from "lucide-react";
import {
    Sheet,
    SheetTrigger,
    SheetContent,
    SheetHeader,
    SheetTitle,
    SheetDescription,
    SheetFooter,
    SheetClose,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";

type ProductCardProps = {
    image: string;
    title: string;
    rating: number;
    price: number;
    oldPrice?: number;
    colors: string[];
    sizes: string[];
    sale?: boolean;
    outOfStock?: boolean;
    selectedColor?: string;
    selectedSize?: string;
    onColorSelect?: (color: string) => void;
    onSizeSelect?: (size: string) => void;
    onWishlistToggle?: () => void;
    isWishlisted?: boolean;
};

export function ProductCard({
    image,
    title,
    rating,
    price,
    oldPrice,
    colors,
    sizes,
    sale,
    outOfStock,
    selectedColor,
    selectedSize,
    onColorSelect,
    onSizeSelect,
    onWishlistToggle,
    isWishlisted = false,
}: ProductCardProps) {
    // Mock multiple images for slideshow (in real app, this would come from props)
    const productImages = [image, image, image]; // Replace with actual multiple images
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const [quantity, setQuantity] = useState(1);

    const nextImage = () => {
        setCurrentImageIndex((prev) => (prev + 1) % productImages.length);
    };

    const prevImage = () => {
        setCurrentImageIndex((prev) => (prev - 1 + productImages.length) % productImages.length);
    };

    const incrementQuantity = () => {
        setQuantity((prev) => Math.min(prev + 1, 99)); // Max 99 items
    };

    const decrementQuantity = () => {
        setQuantity((prev) => Math.max(prev - 1, 1)); // Min 1 item
    };

    const handleQuantityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = parseInt(e.target.value);
        if (!isNaN(value) && value >= 1 && value <= 99) {
            setQuantity(value);
        }
    };

    return (
        <Sheet>
            <Card className="w-full rounded-xl overflow-hidden group relative p-0 gap-3">
                <div className="relative w-full aspect-square">
                    <Image src={image} alt={title} className="object-cover w-full h-full" fill />
                    
                    {/* Wishlist Button */}
                    <Button
                        variant="ghost"
                        size="icon"
                        className="absolute top-2 right-2 bg-white/80 hover:bg-white rounded-full shadow-sm z-10"
                        onClick={onWishlistToggle}
                    >
                        <Heart 
                            className={`w-5 h-5 ${isWishlisted ? 'fill-red-500 text-red-500' : 'text-gray-600'}`} 
                        />
                    </Button>
                    
                    {sale && (
                        <Badge variant="destructive" className="absolute bottom-2 left-2">
                            SALE
                        </Badge>
                    )}
                    {outOfStock && (
                        <Badge variant="default" className="absolute top-2 left-2">
                            SOLD OUT
                        </Badge>
                    )}
                </div>

                <div className="relative overflow-hidden">
                    <CardContent className="px-4 pb-4 pt-0 transition-transform duration-300 sm:group-hover:-translate-y-10">
                        <div className="font-semibold text-lg text-sm sm:text-base lg:text-lg">{title}</div>
                        <div className="flex items-center my-1">
                            {[...Array(5)].map((_, i) => (
                                <Star
                                    key={i}
                                    className={`h-3 w-3 sm:h-4 sm:w-4 ${i < rating ? "text-yellow-400" : "text-gray-300"}`}
                                    fill={i < rating ? "#facc15" : "none"}
                                />
                            ))}
                        </div>
                        <div className="flex items-center gap-2">
                            {oldPrice && <span className="line-through text-gray-400 text-sm sm:text-base">£{oldPrice.toFixed(2)}</span>}
                            <span className="text-lg sm:text-xl font-bold">£{price.toFixed(2)}</span>
                        </div>
                        
                        {/* Color Selection */}
                        <div className="mt-3">
                            <div className="flex items-center justify-between mb-2">
                                <span className="text-xs sm:text-sm font-medium text-gray-700">Color</span>
                                {selectedColor && (
                                    <span className="text-xs text-green-600 font-medium">Selected</span>
                                )}
                            </div>
                            <div className="flex gap-1 sm:gap-2" role="radiogroup" aria-label="Color selection">
                                {colors.map((color) => (
                                    <button
                                        key={color}
                                        type="button"
                                        role="radio"
                                        aria-checked={selectedColor === color}
                                        className={`relative w-4 h-4 sm:w-6 sm:h-6 rounded-full border-2 transition-all ${
                                            selectedColor === color 
                                                ? "border-black scale-110 ring-4 ring-black/30 shadow-lg" 
                                                : "border-gray-300 hover:border-gray-400"
                                        }`}
                                        style={{ backgroundColor: color }}
                                        onClick={() => onColorSelect?.(color)}
                                        title={selectedColor === color ? `Selected: ${color}` : `Select ${color}`}
                                    >
                                        {selectedColor === color && (
                                            <div className="absolute inset-0 flex items-center justify-center">
                                                <div className="w-1 h-1 sm:w-2 sm:h-2 bg-white rounded-full"></div>
                                            </div>
                                        )}
                                    </button>
                                ))}
                            </div>
                        </div>
                        
                        {/* Size Selection */}
                        <div className="mt-4">
                            <div className="flex items-center justify-between mb-2">
                                <span className="text-xs sm:text-sm font-medium text-gray-700">Size</span>
                                {selectedSize && (
                                    <span className="text-xs text-green-600 font-medium">Selected</span>
                                )}
                            </div>
                            <div className="flex gap-1 sm:gap-2 flex-wrap" role="radiogroup" aria-label="Size selection">
                                {sizes.map((size) => (
                                    <button
                                        key={size}
                                        type="button"
                                        role="radio"
                                        aria-checked={selectedSize === size}
                                        className={`relative px-2 py-1 sm:px-3 sm:py-1.5 rounded border text-xs sm:text-sm font-medium transition-all ${
                                            selectedSize === size 
                                                ? "bg-black text-white border-black shadow-sm" 
                                                : "bg-gray-100 text-gray-700 border-gray-300 hover:border-gray-400 hover:bg-gray-50"
                                        }`}
                                        onClick={() => onSizeSelect?.(size)}
                                    >
                                        {size}
                                        {selectedSize === size && (
                                            <div className="absolute -top-1 -right-1 w-3 h-3 sm:w-4 sm:h-4 bg-green-500 rounded-full flex items-center justify-center">
                                                <svg className="w-2 h-2 sm:w-2.5 sm:h-2.5 text-white" fill="currentColor" viewBox="0 0 20 20">
                                                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                                </svg>
                                            </div>
                                        )}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </CardContent>

                    <SheetTrigger asChild>
                        <Button className="absolute bottom-0 left-0 w-full h-8 sm:h-10 translate-y-0 sm:translate-y-full sm:group-hover:translate-y-0 bg-red-500/90 flex items-center justify-center transition-transform duration-300 z-20 rounded-none text-xs sm:text-sm">
                            Select options
                        </Button>
                    </SheetTrigger>
                </div>
            </Card>

            <SheetContent className="w-full sm:max-w-lg p-0 overflow-hidden">
                <div className="flex flex-col h-full">
                    {/* Header */}
                    <SheetHeader className="p-6 pb-4 border-b">
                        <SheetTitle className="text-xl font-bold">{title}</SheetTitle>
                        <SheetDescription>
                            Product details and options
                        </SheetDescription>
                    </SheetHeader>
                    
                    {/* Scrollable Content */}
                    <div className="flex-1 overflow-y-auto p-6">
                        <div className="flex flex-col gap-6">
                            {/* Product Image Slideshow */}
                            <div className="relative w-full aspect-square rounded-lg overflow-hidden">
                                <Image 
                                    src={productImages[currentImageIndex]} 
                                    alt={`${title} - Image ${currentImageIndex + 1}`} 
                                    fill
                                    className="object-cover"
                                />
                                
                                {/* Navigation Arrows */}
                                {productImages.length > 1 && (
                                    <>
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white rounded-full shadow-sm"
                                            onClick={prevImage}
                                        >
                                            <ChevronLeft className="w-4 h-4" />
                                        </Button>
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white rounded-full shadow-sm"
                                            onClick={nextImage}
                                        >
                                            <ChevronRight className="w-4 h-4" />
                                        </Button>
                                    </>
                                )}
                                
                                {/* Image Indicators */}
                                {productImages.length > 1 && (
                                    <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1">
                                        {productImages.map((_, index) => (
                                            <button
                                                key={index}
                                                className={`w-2 h-2 rounded-full transition-all ${
                                                    index === currentImageIndex 
                                                        ? 'bg-white' 
                                                        : 'bg-white/50 hover:bg-white/75'
                                                }`}
                                                onClick={() => setCurrentImageIndex(index)}
                                            />
                                        ))}
                                    </div>
                                )}
                                
                                {sale && (
                                    <Badge variant="destructive" className="absolute top-2 left-2">
                                        SALE
                                    </Badge>
                                )}
                                {outOfStock && (
                                    <Badge variant="secondary" className="absolute top-2 right-2">
                                        OUT OF STOCK
                                    </Badge>
                                )}
                            </div>

                            {/* Rating */}
                            <div className="flex items-center gap-2">
                                <div className="flex items-center">
                                    {[...Array(5)].map((_, i) => (
                                        <Star
                                            key={i}
                                            className={`h-4 w-4 ${i < rating ? "text-yellow-400" : "text-gray-300"}`}
                                            fill={i < rating ? "#facc15" : "none"}
                                        />
                                    ))}
                                </div>
                                <span className="text-sm text-gray-600">({rating}/5)</span>
                            </div>

                            {/* Price */}
                            <div className="flex items-center gap-2">
                                {oldPrice && (
                                    <span className="line-through text-gray-400 text-lg">£{oldPrice.toFixed(2)}</span>
                                )}
                                <span className="text-2xl font-bold">£{price.toFixed(2)}</span>
                                {sale && oldPrice && (
                                    <Badge variant="destructive" className="text-xs">
                                        {Math.round(((oldPrice - price) / oldPrice) * 100)}% OFF
                                    </Badge>
                                )}
                            </div>

                            {/* Color Selection */}
                            <div>
                                <div className="flex items-center justify-between mb-3">
                                    <h3 className="font-semibold">Color</h3>
                                    {selectedColor && (
                                        <span className="text-sm text-green-600 font-medium flex items-center gap-1">
                                            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                            </svg>
                                            Selected
                                        </span>
                                    )}
                                </div>
                                <div className="flex gap-3" role="radiogroup" aria-label="Color selection">
                                    {colors.map((color) => (
                                        <button
                                            key={color}
                                            type="button"
                                            role="radio"
                                            aria-checked={selectedColor === color}
                                            className={`relative w-10 h-10 rounded-full border-2 transition-all ${
                                                selectedColor === color 
                                                    ? "border-black scale-110 ring-4 ring-black/30 shadow-lg" 
                                                    : "border-gray-300 hover:border-gray-400"
                                            }`}
                                            style={{ backgroundColor: color }}
                                            onClick={() => onColorSelect?.(color)}
                                            title={selectedColor === color ? `Selected: ${color}` : `Select ${color}`}
                                        >
                                            {selectedColor === color && (
                                                <div className="absolute inset-0 flex items-center justify-center">
                                                    <div className="w-3 h-3 bg-white rounded-full shadow-sm"></div>
                                                </div>
                                            )}
                                        </button>
                                    ))}
                                </div>
                                {selectedColor && (
                                    <p className="text-sm text-gray-600 mt-2">
                                        Selected color: <span className="font-medium capitalize">{selectedColor}</span>
                                    </p>
                                )}
                            </div>

                            {/* Size Selection */}
                            <div>
                                <div className="flex items-center justify-between mb-3">
                                    <h3 className="font-semibold">Size</h3>
                                    {selectedSize && (
                                        <span className="text-sm text-green-600 font-medium flex items-center gap-1">
                                            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                            </svg>
                                            Selected
                                        </span>
                                    )}
                                </div>
                                <div className="flex flex-wrap gap-2" role="radiogroup" aria-label="Size selection">
                                    {sizes.map((size) => (
                                        <button
                                            key={size}
                                            type="button"
                                            role="radio"
                                            aria-checked={selectedSize === size}
                                            className={`relative px-4 py-2 rounded-md border transition-all ${
                                                selectedSize === size 
                                                    ? "bg-black text-white border-black shadow-sm" 
                                                    : "bg-white text-gray-700 border-gray-300 hover:border-gray-400"
                                            }`}
                                            onClick={() => onSizeSelect?.(size)}
                                        >
                                            {size}
                                            {selectedSize === size && (
                                                <div className="absolute -top-1 -right-1 w-5 h-5 bg-green-500 rounded-full flex items-center justify-center">
                                                    <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                                                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                                    </svg>
                                                </div>
                                            )}
                                        </button>
                                    ))}
                                </div>
                                {selectedSize && (
                                    <p className="text-sm text-gray-600 mt-2">
                                        Selected size: <span className="font-medium">{selectedSize}</span>
                                    </p>
                                )}
                            </div>

                            {/* Quantity */}
                            <div>
                                <h3 className="font-semibold mb-3">Quantity</h3>
                                <div className="flex items-center gap-3">
                                    <Button variant="outline" size="sm" className="w-10 h-10" onClick={decrementQuantity}>
                                        -
                                    </Button>
                                    <input
                                        type="number"
                                        value={quantity}
                                        onChange={handleQuantityChange}
                                        min="1"
                                        max="99"
                                        className="w-12 text-center font-medium border border-gray-300 rounded-md"
                                    />
                                    <Button variant="outline" size="sm" className="w-10 h-10" onClick={incrementQuantity}>
                                        +
                                    </Button>
                                </div>
                            </div>

                            {/* Product Description */}
                            <div>
                                <h3 className="font-semibold mb-2">Description</h3>
                                <p className="text-gray-600 text-sm leading-relaxed">
                                    This premium product offers exceptional quality and comfort. 
                                    Made with high-quality materials and designed for everyday use. 
                                    Perfect for any occasion and suitable for all seasons.
                                </p>
                            </div>

                            {/* Shipping Info */}
                            <div className="bg-gray-50 p-4 rounded-lg">
                                <h3 className="font-semibold mb-2">Shipping & Returns</h3>
                                <div className="text-sm text-gray-600 space-y-1">
                                    <p>• Free shipping on orders over £50</p>
                                    <p>• 30-day return policy</p>
                                    <p>• Fast delivery within 2-3 business days</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Footer */}
                    <SheetFooter className="p-6 pt-4 border-t bg-white">
                        <div className="flex flex-col gap-3 w-full">
                            <div className="flex gap-3 w-full">
                                <Button 
                                    variant="outline" 
                                    className="flex-1"
                                    onClick={onWishlistToggle}
                                >
                                    <Heart className={`w-4 h-4 mr-2 ${isWishlisted ? 'fill-red-500 text-red-500' : ''}`} />
                                    {isWishlisted ? 'Remove from Wishlist' : 'Add to Wishlist'}
                                </Button>
                                <Button className="flex-1" disabled={outOfStock}>
                                    {outOfStock ? 'Out of Stock' : 'Add to Cart'}
                                </Button>
                            </div>
                            <SheetClose asChild>
                                <Button variant="ghost" className="w-full">
                                    Continue Shopping
                                </Button>
                            </SheetClose>
                        </div>
                    </SheetFooter>
                </div>
            </SheetContent>
        </Sheet>
    );
}