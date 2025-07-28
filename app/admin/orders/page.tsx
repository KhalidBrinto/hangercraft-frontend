"use client"

import { AppSidebar } from "@/components/app-sidebar"
import { SiteHeader } from "@/components/site-header"
import {
  SidebarInset,
  SidebarProvider,
} from "@/components/ui/sidebar"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { AreaChart, Area, CartesianGrid, XAxis, Tooltip, ResponsiveContainer } from "recharts"
import { useState } from "react"
import { Calendar, CheckCircle, Clock, Truck, XCircle, ArrowUpRight, ArrowDownRight } from "lucide-react"

// Sample order data
const orders = [
  { id: "ORD-1001", customer: "Alice Smith", date: "2024-06-01", status: "Delivered", total: 120.5, payment: "Paid", items: 3 },
  { id: "ORD-1002", customer: "Bob Johnson", date: "2024-06-02", status: "Pending", total: 89.99, payment: "Pending", items: 2 },
  { id: "ORD-1003", customer: "Charlie Lee", date: "2024-06-03", status: "Shipped", total: 45.0, payment: "Paid", items: 1 },
  { id: "ORD-1004", customer: "Diana King", date: "2024-06-04", status: "Cancelled", total: 60.0, payment: "Refunded", items: 2 },
  { id: "ORD-1005", customer: "Ethan Brown", date: "2024-06-05", status: "Delivered", total: 210.0, payment: "Paid", items: 5 },
  { id: "ORD-1006", customer: "Fiona White", date: "2024-06-06", status: "Shipped", total: 75.5, payment: "Paid", items: 2 },
  { id: "ORD-1007", customer: "George Black", date: "2024-06-07", status: "Pending", total: 99.99, payment: "Pending", items: 1 },
  { id: "ORD-1008", customer: "Hannah Green", date: "2024-06-08", status: "Delivered", total: 150.0, payment: "Paid", items: 4 },
]

const orderStatusColors: Record<string, string> = {
  Delivered: "bg-green-100 text-green-800",
  Shipped: "bg-blue-100 text-blue-800",
  Pending: "bg-yellow-100 text-yellow-800",
  Cancelled: "bg-red-100 text-red-800",
}

const paymentStatusColors: Record<string, string> = {
  Paid: "bg-green-100 text-green-800",
  Pending: "bg-yellow-100 text-yellow-800",
  Refunded: "bg-red-100 text-red-800",
}

const chartData = [
  { date: "2024-06-01", orders: 10, revenue: 1200 },
  { date: "2024-06-02", orders: 8, revenue: 900 },
  { date: "2024-06-03", orders: 12, revenue: 1500 },
  { date: "2024-06-04", orders: 7, revenue: 800 },
  { date: "2024-06-05", orders: 15, revenue: 2100 },
  { date: "2024-06-06", orders: 9, revenue: 1100 },
  { date: "2024-06-07", orders: 11, revenue: 1300 },
]

export default function OrdersPage() {
  const [search, setSearch] = useState("")
  const [statusFilter, setStatusFilter] = useState("")

  const filteredOrders = orders.filter(order =>
    (order.customer.toLowerCase().includes(search.toLowerCase()) || order.id.toLowerCase().includes(search.toLowerCase())) &&
    (statusFilter && statusFilter !== "all" ? order.status === statusFilter : true)
  )

  // Insights
  const totalOrders = orders.length
  const delivered = orders.filter(o => o.status === "Delivered").length
  const pending = orders.filter(o => o.status === "Pending").length
  const shipped = orders.filter(o => o.status === "Shipped").length
  const cancelled = orders.filter(o => o.status === "Cancelled").length
  const revenue = orders.reduce((sum, o) => sum + o.total, 0)
  const avgOrderValue = (revenue / totalOrders).toFixed(2)

  return (
    <SidebarProvider
      style={{
        "--sidebar-width": "calc(var(--spacing) * 72)",
        "--header-height": "calc(var(--spacing) * 12)",
      } as React.CSSProperties}
    >
      <AppSidebar variant="inset" />
      <SidebarInset>
        <SiteHeader />
        <div className="flex flex-1 flex-col">
          <div className="@container/main flex flex-1 flex-col gap-2">
            <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
              {/* Insights Cards */}
              <div className="grid grid-cols-1 gap-4 px-4 lg:px-6 @xl/main:grid-cols-2 @5xl/main:grid-cols-5">
                <Card>
                  <CardHeader>
                    <CardDescription>Total Orders</CardDescription>
                    <CardTitle className="text-2xl font-semibold">{totalOrders}</CardTitle>
                    <Badge className="bg-blue-100 text-blue-800 mt-2"><ArrowUpRight className="w-4 h-4 mr-1" />+8% MoM</Badge>
                  </CardHeader>
                </Card>
                <Card>
                  <CardHeader>
                    <CardDescription>Delivered</CardDescription>
                    <CardTitle className="text-2xl font-semibold">{delivered}</CardTitle>
                    <Badge className="bg-green-100 text-green-800 mt-2"><CheckCircle className="w-4 h-4 mr-1" />+5% MoM</Badge>
                  </CardHeader>
                </Card>
                <Card>
                  <CardHeader>
                    <CardDescription>Pending</CardDescription>
                    <CardTitle className="text-2xl font-semibold">{pending}</CardTitle>
                    <Badge className="bg-yellow-100 text-yellow-800 mt-2"><Clock className="w-4 h-4 mr-1" />-2% MoM</Badge>
                  </CardHeader>
                </Card>
                <Card>
                  <CardHeader>
                    <CardDescription>Shipped</CardDescription>
                    <CardTitle className="text-2xl font-semibold">{shipped}</CardTitle>
                    <Badge className="bg-blue-100 text-blue-800 mt-2"><Truck className="w-4 h-4 mr-1" />+3% MoM</Badge>
                  </CardHeader>
                </Card>
                <Card>
                  <CardHeader>
                    <CardDescription>Cancelled</CardDescription>
                    <CardTitle className="text-2xl font-semibold">{cancelled}</CardTitle>
                    <Badge className="bg-red-100 text-red-800 mt-2"><XCircle className="w-4 h-4 mr-1" />-1% MoM</Badge>
                  </CardHeader>
                </Card>
              </div>

              {/* Orders Analytics Chart */}
              <Card className="mx-4 lg:mx-6">
                <CardHeader>
                  <CardTitle>Orders & Revenue (Last 7 days)</CardTitle>
                  <CardDescription>Track order volume and revenue trends</CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={250}>
                    <AreaChart data={chartData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                      <defs>
                        <linearGradient id="orders" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#2563eb" stopOpacity={0.8} />
                          <stop offset="95%" stopColor="#2563eb" stopOpacity={0.1} />
                        </linearGradient>
                        <linearGradient id="revenue" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#16a34a" stopOpacity={0.8} />
                          <stop offset="95%" stopColor="#16a34a" stopOpacity={0.1} />
                        </linearGradient>
                      </defs>
                      <CartesianGrid vertical={false} />
                      <XAxis dataKey="date" tickLine={false} axisLine={false} tickMargin={8} />
                      <Tooltip />
                      <Area type="monotone" dataKey="orders" stroke="#2563eb" fill="url(#orders)" name="Orders" />
                      <Area type="monotone" dataKey="revenue" stroke="#16a34a" fill="url(#revenue)" name="Revenue" yAxisId={1} />
                    </AreaChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              {/* Orders Table */}
              <Card className="mx-4 lg:mx-6">
                <CardHeader>
                  <CardTitle>Orders</CardTitle>
                  <CardDescription>Manage and track all orders</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-col md:flex-row gap-4 mb-4">
                    <Input
                      placeholder="Search by customer or order ID..."
                      value={search}
                      onChange={e => setSearch(e.target.value)}
                      className="md:w-1/3"
                    />
                    <Select value={statusFilter} onValueChange={setStatusFilter}>
                      <SelectTrigger className="md:w-48">
                        <SelectValue placeholder="Filter by status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Statuses</SelectItem>
                        <SelectItem value="Delivered">Delivered</SelectItem>
                        <SelectItem value="Shipped">Shipped</SelectItem>
                        <SelectItem value="Pending">Pending</SelectItem>
                        <SelectItem value="Cancelled">Cancelled</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Order ID</TableHead>
                          <TableHead>Customer</TableHead>
                          <TableHead>Date</TableHead>
                          <TableHead>Status</TableHead>
                          <TableHead>Payment</TableHead>
                          <TableHead>Items</TableHead>
                          <TableHead>Total</TableHead>
                          <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {filteredOrders.length === 0 ? (
                          <TableRow>
                            <TableCell colSpan={8} className="text-center py-8 text-muted-foreground">
                              No orders found.
                            </TableCell>
                          </TableRow>
                        ) : (
                          filteredOrders.map(order => (
                            <TableRow key={order.id}>
                              <TableCell>{order.id}</TableCell>
                              <TableCell>{order.customer}</TableCell>
                              <TableCell>{order.date}</TableCell>
                              <TableCell>
                                <Badge className={orderStatusColors[order.status] + " font-medium"}>{order.status}</Badge>
                              </TableCell>
                              <TableCell>
                                <Badge className={paymentStatusColors[order.payment] + " font-medium"}>{order.payment}</Badge>
                              </TableCell>
                              <TableCell>{order.items}</TableCell>
                              <TableCell>${order.total.toFixed(2)}</TableCell>
                              <TableCell className="text-right">
                                <Button size="sm" variant="outline">View</Button>
                              </TableCell>
                            </TableRow>
                          ))
                        )}
                      </TableBody>
                    </Table>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}
