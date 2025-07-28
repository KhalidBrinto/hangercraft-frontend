"use client"

import { IconLayoutDashboard, IconBox, IconShoppingCart, IconDiscount2, IconCreditCard } from "@tabler/icons-react"
import { SidebarGroup, SidebarGroupContent, SidebarMenu, SidebarMenuButton, SidebarMenuItem } from "@/components/ui/sidebar"
import Link from "next/link"

export function NavMain() {
  const items = [
    { title: "Dashboard", icon: IconLayoutDashboard, url: "/admin" },
    { title: "Products", icon: IconBox, url: "/admin/products" },
    { title: "Orders", icon: IconShoppingCart, url: "/admin/orders" },
    { title: "Discount & Coupons", icon: IconDiscount2, url: "/admin/discounts" },
    { title: "Payment Methods", icon: IconCreditCard, url: "/admin/payment-options" },
  ]
  return (
    <SidebarGroup>
      <SidebarGroupContent>
        <SidebarMenu className="gap-2">
          {items.map((item) => (
            <SidebarMenuItem key={item.title}>
              <SidebarMenuButton asChild className="text-base py-6">
                <Link href={item.url}>
                  <item.icon />
                  <span>{item.title}</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  )
}
