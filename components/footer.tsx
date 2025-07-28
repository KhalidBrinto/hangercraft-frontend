"use client"
import { useState } from "react"
import { Logo } from "@/components/logo"
import { Button } from "@/components/ui/button"
import { 
  Facebook, 
  Twitter, 
  Instagram, 
  Youtube, 
  Mail, 
  Phone, 
  MapPin,
  CreditCard,
  Truck,
  Shield,
  RefreshCw,
  Heart
} from "lucide-react"

export default function Footer() {
  const [email, setEmail] = useState("")

  const handleNewsletterSignup = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    // Handle newsletter signup
    console.log("Newsletter signup:", email)
    setEmail("")
  }

  return (
    <footer className="bg-gray-900 text-white w-full">
      {/* Main Footer Content */}
      <div className="w-full px-4 py-12">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            
            {/* Company Info */}
            <div className="lg:col-span-1">
              <Logo />
              <p className="mt-4 text-gray-300 text-sm leading-relaxed">
                Your trusted destination for quality fashion and lifestyle products. 
                We bring you the latest trends with exceptional customer service.
              </p>
              
              {/* Contact Info */}
              <div className="mt-6 space-y-3">
                <div className="flex items-center gap-3 text-sm text-gray-300">
                  <Phone className="w-4 h-4" />
                  <span>+44 123 456 7890</span>
                </div>
                <div className="flex items-center gap-3 text-sm text-gray-300">
                  <Mail className="w-4 h-4" />
                  <span>support@yourstore.com</span>
                </div>
                <div className="flex items-center gap-3 text-sm text-gray-300">
                  <MapPin className="w-4 h-4" />
                  <span>123 Fashion Street, London, UK</span>
                </div>
              </div>
            </div>

            {/* Quick Links */}
            <div>
              <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
              <ul className="space-y-2 text-sm">
                <li><a href="/shop" className="text-gray-300 hover:text-white transition-colors">Shop All</a></li>
                <li><a href="/new-arrivals" className="text-gray-300 hover:text-white transition-colors">New Arrivals</a></li>
                <li><a href="/sale" className="text-gray-300 hover:text-white transition-colors">Sale & Deals</a></li>
                <li><a href="/trending" className="text-gray-300 hover:text-white transition-colors">Trending Now</a></li>
                <li><a href="/gift-cards" className="text-gray-300 hover:text-white transition-colors">Gift Cards</a></li>
                <li><a href="/rewards" className="text-gray-300 hover:text-white transition-colors">Rewards Program</a></li>
              </ul>
            </div>

            {/* Customer Service */}
            <div>
              <h3 className="text-lg font-semibold mb-4">Customer Service</h3>
              <ul className="space-y-2 text-sm">
                <li><a href="/contact" className="text-gray-300 hover:text-white transition-colors">Contact Us</a></li>
                <li><a href="/help" className="text-gray-300 hover:text-white transition-colors">Help Center</a></li>
                <li><a href="/shipping" className="text-gray-300 hover:text-white transition-colors">Shipping Info</a></li>
                <li><a href="/returns" className="text-gray-300 hover:text-white transition-colors">Returns & Exchanges</a></li>
                <li><a href="/size-guide" className="text-gray-300 hover:text-white transition-colors">Size Guide</a></li>
                <li><a href="/track-order" className="text-gray-300 hover:text-white transition-colors">Track Order</a></li>
              </ul>
            </div>

            {/* Newsletter Signup */}
            <div>
              <h3 className="text-lg font-semibold mb-4">Stay Updated</h3>
              <p className="text-gray-300 text-sm mb-4">
                Subscribe to our newsletter for exclusive offers, new arrivals, and fashion tips.
              </p>
              
              <form onSubmit={handleNewsletterSignup} className="space-y-3">
                <input
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-3 py-2 bg-gray-800 border border-gray-700 text-white placeholder-gray-400 rounded-md focus:outline-none focus:border-white"
                  required
                />
                <Button 
                  type="submit" 
                  className="w-full bg-white text-gray-900 hover:bg-gray-100"
                >
                  Subscribe
                </Button>
              </form>

              {/* Social Media */}
              <div className="mt-6">
                <h4 className="text-sm font-semibold mb-3">Follow Us</h4>
                <div className="flex gap-3">
                  <a href="#" className="p-2 bg-gray-800 rounded-full hover:bg-gray-700 transition-colors">
                    <Facebook className="w-4 h-4" />
                  </a>
                  <a href="#" className="p-2 bg-gray-800 rounded-full hover:bg-gray-700 transition-colors">
                    <Twitter className="w-4 h-4" />
                  </a>
                  <a href="#" className="p-2 bg-gray-800 rounded-full hover:bg-gray-700 transition-colors">
                    <Instagram className="w-4 h-4" />
                  </a>
                  <a href="#" className="p-2 bg-gray-800 rounded-full hover:bg-gray-700 transition-colors">
                    <Youtube className="w-4 h-4" />
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Trust Badges */}
      <div className="border-t border-gray-800 py-6 w-full">
        <div className="w-full px-4">
          <div className="max-w-7xl mx-auto">
            <div className="flex flex-wrap items-center justify-center gap-6 text-sm text-gray-400">
              <div className="flex items-center gap-2">
                <Shield className="w-4 h-4" />
                <span>Secure Payment</span>
              </div>
              <div className="flex items-center gap-2">
                <Truck className="w-4 h-4" />
                <span>Free Shipping</span>
              </div>
              <div className="flex items-center gap-2">
                <RefreshCw className="w-4 h-4" />
                <span>Easy Returns</span>
              </div>
              <div className="flex items-center gap-2">
                <CreditCard className="w-4 h-4" />
                <span>Multiple Payment Options</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Footer */}
      <div className="border-t border-gray-800 py-6 w-full">
        <div className="w-full px-4">
          <div className="max-w-7xl mx-auto">
            <div className="flex flex-col md:flex-row justify-between items-center gap-4">
              <div className="text-sm text-gray-400">
                © 2025 Hanger Craft. All rights reserved.
              </div>
              
              <div className="flex flex-wrap gap-6 text-sm">
                <a href="/privacy" className="text-gray-400 hover:text-white transition-colors">
                  Privacy Policy
                </a>
                <a href="/terms" className="text-gray-400 hover:text-white transition-colors">
                  Terms of Service
                </a>
                <a href="/cookies" className="text-gray-400 hover:text-white transition-colors">
                  Cookie Policy
                </a>
                <a href="/accessibility" className="text-gray-400 hover:text-white transition-colors">
                  Accessibility
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
