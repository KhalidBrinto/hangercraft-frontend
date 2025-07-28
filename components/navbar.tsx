"use client"

import { useState, useRef } from "react"
import { Book, Menu, Sunset, Trees, Zap, ShoppingCart, Heart, User, ChevronDown } from "lucide-react";
import Link from "next/link";

import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import {
    Sheet,
    SheetContent,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from "@/components/ui/sheet";
import { Logo } from "./logo";
import CartSheet from "./cart-sheet";
import WishlistSheet from "@/components/wishlist-sheet";
import { usePathname } from "next/navigation";

interface MenuItem {
    title: string;
    url: string;
    description?: string;
    icon?: React.ReactNode;
    items?: MenuItem[];
}

interface Navbar1Props {
    logo?: {
        url: string;
        src: string;
        alt: string;
        title: string;
    };
    menu?: MenuItem[];
    auth?: {
        login: {
            title: string;
            url: string;
        };
        signup: {
            title: string;
            url: string;
        };
    };
}

const Navbar1 = ({
    menu = [
        { title: "Home", url: "/" },
        {
            title: "Men",
            url: "/shop?category=Men",
            items: [
                {
                    title: "T-Shirts",
                    description: "Casual and formal t-shirts for men",
                    icon: <Book className="size-5 shrink-0" />,
                    url: "/shop?category=Men&subcategory=T-Shirts",
                },
                {
                    title: "Jackets",
                    description: "Stylish jackets and outerwear",
                    icon: <Trees className="size-5 shrink-0" />,
                    url: "/shop?category=Men&subcategory=Jackets",
                },
                {
                    title: "Jeans",
                    description: "Comfortable and durable jeans",
                    icon: <Sunset className="size-5 shrink-0" />,
                    url: "/shop?category=Men&subcategory=Jeans",
                },
                {
                    title: "Shirts",
                    description: "Formal and casual shirts",
                    icon: <Zap className="size-5 shrink-0" />,
                    url: "/shop?category=Men&subcategory=Shirts",
                },
            ],
        },
        {
            title: "Women",
            url: "/shop?category=Women",
            items: [
                {
                    title: "Sweaters",
                    description: "Warm and cozy sweaters",
                    icon: <Zap className="size-5 shrink-0" />,
                    url: "/shop?category=Women&subcategory=Sweaters",
                },
                {
                    title: "Dresses",
                    description: "Elegant dresses for every occasion",
                    icon: <Sunset className="size-5 shrink-0" />,
                    url: "/shop?category=Women&subcategory=Dresses",
                },
                {
                    title: "Tops",
                    description: "Stylish tops and blouses",
                    icon: <Trees className="size-5 shrink-0" />,
                    url: "/shop?category=Women&subcategory=Tops",
                },
                {
                    title: "Bottoms",
                    description: "Comfortable bottoms and pants",
                    icon: <Book className="size-5 shrink-0" />,
                    url: "/shop?category=Women&subcategory=Bottoms",
                },
            ],
        },
        {
            title: "Kids",
            url: "/shop?category=Kids",
        },
        {
            title: "Footwear",
            url: "/shop?category=Footwear",
        },
        {
            title: "Accessories",
            url: "/shop?category=Accessories",
            items: [
                {
                    title: "Bags",
                    description: "Stylish bags and handbags",
                    icon: <Book className="size-5 shrink-0" />,
                    url: "/shop?category=Accessories&subcategory=Bags",
                },
                {
                    title: "Jewelry",
                    description: "Elegant jewelry and accessories",
                    icon: <Trees className="size-5 shrink-0" />,
                    url: "/shop?category=Accessories&subcategory=Jewelry",
                },
                {
                    title: "Watches",
                    description: "Premium watches and timepieces",
                    icon: <Sunset className="size-5 shrink-0" />,
                    url: "/shop?category=Accessories&subcategory=Watches",
                },
                {
                    title: "Belts",
                    description: "Quality belts and straps",
                    icon: <Zap className="size-5 shrink-0" />,
                    url: "/shop?category=Accessories&subcategory=Belts",
                },
                {
                    title: "Sunglasses",
                    description: "Trendy sunglasses and eyewear",
                    icon: <Book className="size-5 shrink-0" />,
                    url: "/shop?category=Accessories&subcategory=Sunglasses",
                },
                {
                    title: "Scarves",
                    description: "Warm and stylish scarves",
                    icon: <Trees className="size-5 shrink-0" />,
                    url: "/shop?category=Accessories&subcategory=Scarves",
                },
            ],
        },
    ],
    auth = {
        login: { title: "Login", url: "#" },
        signup: { title: "Sign up", url: "#" },
    },
}: Navbar1Props) => {
    const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
    const timeoutRef = useRef<NodeJS.Timeout | null>(null);

    const handleMouseEnter = (itemTitle: string) => {
        if (timeoutRef.current) {
            clearTimeout(timeoutRef.current);
        }
        setActiveDropdown(itemTitle);
    };

    const handleMouseLeave = () => {
        timeoutRef.current = setTimeout(() => {
            setActiveDropdown(null);
        }, 150); // 150ms delay
    };
    const pathname = usePathname();
    const isAdmin = pathname?.startsWith("/admin");
    if (isAdmin) return null;

    return (
        <header>
            <nav className="fixed z-20 py-5 w-full px-6 bg-white shadow-md">
                <div className="container mx-auto w-full max-w-6xl">
                    {/* Desktop Menu */}
                    <nav className="hidden lg:flex items-center justify-between w-full">
                        {/* Left: Logo */}
                        <div className="flex items-center gap-6 min-w-0">
                            <Link href={'/'} className="flex items-center gap-2">
                                <Logo/>
                            </Link>
                        </div>
                        {/* Center: Menu */}
                        <div className="flex-1 flex justify-center min-w-0">
                            <ul className="flex items-center gap-4">
                                {menu.map((item) => (
                                    <li key={item.title} className="relative group">
                                        <Link
                                            href={item.url}
                                            className="flex items-center gap-1 px-4 py-2 text-sm font-medium transition-colors hover:text-primary"
                                            onMouseEnter={() => handleMouseEnter(item.title)}
                                            onMouseLeave={handleMouseLeave}
                                        >
                                            {item.title}
                                            {item.items && <ChevronDown className="w-4 h-4" />}
                                        </Link>
                                        {item.items && activeDropdown === item.title && (
                                            <div 
                                                className="absolute top-full left-0 bg-white border rounded-lg shadow-lg p-2 min-w-[250px] z-50"
                                                onMouseEnter={() => handleMouseEnter(item.title)}
                                                onMouseLeave={handleMouseLeave}
                                            >
                                                {item.items.map((subItem) => (
                                                    <Link
                                                        key={subItem.title}
                                                        href={subItem.url}
                                                        className="flex items-center gap-3 p-3 rounded-md hover:bg-gray-50 transition-colors"
                                                    >
                                                        <div className="text-gray-600">{subItem.icon}</div>
                                                        <div>
                                                            <div className="font-medium text-sm">{subItem.title}</div>
                                                            {subItem.description && (
                                                                <p className="text-xs text-gray-500 mt-1">
                                                                    {subItem.description}
                                                                </p>
                                                            )}
                                                        </div>
                                                    </Link>
                                                ))}
                                            </div>
                                        )}
                                    </li>
                                ))}
                            </ul>
                        </div>
                        {/* Right: Icons and Auth */}
                        <div className="flex items-center gap-4 min-w-0">
                            <CartSheet />
                            <WishlistSheet />
                            <Button variant="ghost" size="icon" aria-label="Profile">
                                <User className="size-5" />
                            </Button>
                            <Button asChild variant="outline" size="sm">
                                <a href={auth.login.url}>{auth.login.title}</a>
                            </Button>
                            <Button asChild size="sm">
                                <a href={auth.signup.url}>{auth.signup.title}</a>
                            </Button>
                        </div>
                    </nav>
                    {/* Mobile Menu */}
                    <div className="block lg:hidden w-full max-w-6xl mx-auto">
                        <div className="flex items-center justify-between">
                            {/* Logo */}
                            <Link href={'/'} className="flex items-center gap-2">
                                <Logo/>
                            </Link>
                            <Sheet>
                                <SheetTrigger asChild>
                                    <Button variant="outline" size="icon">
                                        <Menu className="size-4" />
                                    </Button>
                                </SheetTrigger>
                                <SheetContent className="overflow-y-auto">
                                    <SheetHeader>
                                        <SheetTitle>
                                            <Link href={'/'} className="flex items-center gap-2">
                                                <Logo/>
                                            </Link>
                                        </SheetTitle>
                                    </SheetHeader>
                                    <div className="flex flex-col gap-6 p-4">
                                        <Accordion
                                            type="single"
                                            collapsible
                                            className="flex w-full flex-col gap-4"
                                        >
                                            {menu.map((item) => renderMobileMenuItem(item))}
                                        </Accordion>
                                        <div className="flex flex-row gap-3 justify-center mt-4">
                                            <CartSheet />
                                            <WishlistSheet />
                                            <Button variant="ghost" size="icon" aria-label="Profile">
                                                <User className="size-5" />
                                            </Button>
                                        </div>
                                        <div className="flex flex-col gap-3">
                                            <Button asChild variant="outline">
                                                <a href={auth.login.url}>{auth.login.title}</a>
                                            </Button>
                                            <Button asChild>
                                                <a href={auth.signup.url}>{auth.signup.title}</a>
                                            </Button>
                                        </div>
                                    </div>
                                </SheetContent>
                            </Sheet>
                        </div>
                    </div>
                </div>
            </nav>
        </header>
    );
};

const renderMobileMenuItem = (item: MenuItem) => {
    if (item.items) {
        return (
            <AccordionItem key={item.title} value={item.title} className="border-b-0">
                <AccordionTrigger className="text-md py-0 font-semibold hover:no-underline">
                    {item.title}
                </AccordionTrigger>
                <AccordionContent className="mt-2">
                    {item.items.map((subItem) => (
                        <Link key={subItem.title} href={subItem.url} className="block p-2 hover:bg-gray-50 rounded">
                            <div className="font-medium">{subItem.title}</div>
                            {subItem.description && (
                                <p className="text-sm text-gray-500">{subItem.description}</p>
                            )}
                        </Link>
                    ))}
                </AccordionContent>
            </AccordionItem>
        );
    }

    return (
        <Link key={item.title} href={item.url} className="text-md font-semibold">
            {item.title}
        </Link>
    );
};

export { Navbar1 as Navbar };
