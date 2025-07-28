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
import { useState, useEffect } from "react"
import { useDebounce } from "@/hooks/use-debounce"
import { Calendar, CheckCircle, Clock, Truck, XCircle, ArrowUpRight, ArrowDownRight, Search, Edit } from "lucide-react"
import { orderAPI } from "@/lib/api"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog"

type Order = {
  _id: string;
  orderNumber: string;
  customer: {
    name: string;
    email: string;
    phone?: string;
  };
  items: Array<{
    name: string;
    quantity: number;
    price: number;
  }>;
  total: number;
  status: 'pending' | 'confirmed' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  paymentStatus: 'pending' | 'paid' | 'failed' | 'refunded';
  createdAt: string;
  updatedAt: string;
};

const orderStatusColors: Record<string, string> = {
  delivered: "bg-green-100 text-green-800",
  shipped: "bg-blue-100 text-blue-800",
  processing: "bg-purple-100 text-purple-800",
  confirmed: "bg-orange-100 text-orange-800",
  pending: "bg-yellow-100 text-yellow-800",
  cancelled: "bg-red-100 text-red-800",
}

const paymentStatusColors: Record<string, string> = {
  paid: "bg-green-100 text-green-800",
  pending: "bg-yellow-100 text-yellow-800",
  failed: "bg-red-100 text-red-800",
  refunded: "bg-gray-100 text-gray-800",
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
  const [orders, setOrders] = useState<Order[]>([])
  const [search, setSearch] = useState("")
  const [isSearching, setIsSearching] = useState(false)
  const debouncedSearchTerm = useDebounce(search, 300)
  const [statusFilter, setStatusFilter] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [editingOrder, setEditingOrder] = useState<Order | null>(null)
  const [isUpdating, setIsUpdating] = useState(false)
  const [newStatus, setNewStatus] = useState("")

  // Real-time search effect
  useEffect(() => {
    if (debouncedSearchTerm) {
      setIsSearching(true)
      searchOrders(debouncedSearchTerm)
    } else {
      fetchAllOrders()
    }
  }, [debouncedSearchTerm])

  // Fetch orders on component mount
  useEffect(() => {
    fetchAllOrders()
  }, [])

  const searchOrders = async (term: string) => {
    // Since the API doesn't support search, we'll use client-side filtering
    setIsSearching(false)
    // The filtering is already handled in filteredOrders
  }

  const fetchAllOrders = async () => {
    setIsLoading(true)
    const result = await orderAPI.getAll()
    setIsLoading(false)
    if (result.success && Array.isArray(result.data)) {
      setOrders(result.data)
    }
  }

  const handleStatusUpdate = async () => {
    if (!editingOrder || !newStatus) return
    
    setIsUpdating(true)
    const result = await orderAPI.update(editingOrder._id, { status: newStatus })
    setIsUpdating(false)
    
    if (result.success) {
      setEditingOrder(null)
      setNewStatus("")
      fetchAllOrders() // Refresh the list
    } else {
      alert(result.error || 'Failed to update order status')
    }
  }

  const filteredOrders = orders.filter(order => {
    const matchesSearch = order.customer.name.toLowerCase().includes(search.toLowerCase()) ||
                         order.orderNumber.toLowerCase().includes(search.toLowerCase()) ||
                         order.customer.email.toLowerCase().includes(search.toLowerCase())
    const matchesStatus = statusFilter === "" || statusFilter === "all" || order.status === statusFilter
    return matchesSearch && matchesStatus
  })

  // Insights
  const totalOrders = orders.length
  const delivered = orders.filter(o => o.status === "delivered").length
  const pending = orders.filter(o => o.status === "pending").length
  const shipped = orders.filter(o => o.status === "shipped").length
  const cancelled = orders.filter(o => o.status === "cancelled").length
  const revenue = orders.reduce((sum, o) => sum + o.total, 0)
  const avgOrderValue = totalOrders > 0 ? (revenue / totalOrders).toFixed(2) : "0"

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
                  <CardTitle>
                    Orders
                    {search && (
                      <span className="text-sm font-normal text-muted-foreground ml-2">
                        ({filteredOrders.length} results for &quot;{search}&quot;)
                      </span>
                    )}
                  </CardTitle>
                  <CardDescription>Manage and track all orders</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-col md:flex-row gap-4 mb-4">
                    <div className="relative md:w-1/3">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                      <Input
                        placeholder="Search by customer, order ID, or email..."
                        value={search}
                        onChange={e => setSearch(e.target.value)}
                        className="pl-10"
                        disabled={isSearching}
                      />
                      {isSearching && (
                        <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-gray-900"></div>
                        </div>
                      )}
                    </div>
                    <Select value={statusFilter} onValueChange={setStatusFilter}>
                      <SelectTrigger className="md:w-48">
                        <SelectValue placeholder="Filter by status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Statuses</SelectItem>
                        <SelectItem value="pending">Pending</SelectItem>
                        <SelectItem value="confirmed">Confirmed</SelectItem>
                        <SelectItem value="processing">Processing</SelectItem>
                        <SelectItem value="shipped">Shipped</SelectItem>
                        <SelectItem value="delivered">Delivered</SelectItem>
                        <SelectItem value="cancelled">Cancelled</SelectItem>
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
                            <TableRow key={order._id}>
                              <TableCell>{order.orderNumber}</TableCell>
                              <TableCell>{order.customer.name}</TableCell>
                              <TableCell>{new Date(order.createdAt).toLocaleDateString()}</TableCell>
                              <TableCell>
                                <Badge className={orderStatusColors[order.status] + " font-medium"}>{order.status}</Badge>
                              </TableCell>
                              <TableCell>
                                <Badge className={paymentStatusColors[order.paymentStatus] + " font-medium"}>{order.paymentStatus}</Badge>
                              </TableCell>
                              <TableCell>{order.items.length}</TableCell>
                              <TableCell>${order.total.toFixed(2)}</TableCell>
                              <TableCell className="text-right">
                                <Dialog>
                                  <DialogTrigger asChild>
                                    <Button size="sm" variant="outline" onClick={() => {
                                      setEditingOrder(order)
                                      setNewStatus(order.status)
                                    }}>
                                      <Edit className="w-4 h-4 mr-1" />
                                      Update Status
                                    </Button>
                                  </DialogTrigger>
                                  <DialogContent>
                                    <DialogHeader>
                                      <DialogTitle>Update Order Status for {order.orderNumber}</DialogTitle>
                                    </DialogHeader>
                                    <div className="grid gap-4 py-4">
                                      <Select onValueChange={(value) => setNewStatus(value)} value={newStatus}>
                                        <SelectTrigger>
                                          <SelectValue placeholder="Select new status" />
                                        </SelectTrigger>
                                        <SelectContent>
                                          <SelectItem value="pending">Pending</SelectItem>
                                          <SelectItem value="confirmed">Confirmed</SelectItem>
                                          <SelectItem value="processing">Processing</SelectItem>
                                          <SelectItem value="shipped">Shipped</SelectItem>
                                          <SelectItem value="delivered">Delivered</SelectItem>
                                          <SelectItem value="cancelled">Cancelled</SelectItem>
                                        </SelectContent>
                                      </Select>
                                    </div>
                                    <DialogFooter>
                                      <Button variant="outline" onClick={() => {
                                        setEditingOrder(null)
                                        setNewStatus("")
                                      }}>Cancel</Button>
                                      <Button onClick={handleStatusUpdate} disabled={isUpdating}>
                                        {isUpdating ? "Updating..." : "Update Status"}
                                      </Button>
                                    </DialogFooter>
                                  </DialogContent>
                                </Dialog>
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
