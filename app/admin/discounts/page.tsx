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
import { Percent, CheckCircle, XCircle, Gift, ArrowUpRight, ArrowDownRight, Search, Plus } from "lucide-react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog"
import { useRef } from "react"
import { discountAPI } from "@/lib/api"

type Discount = {
  _id: string;
  code: string;
  type: 'percentage' | 'flat' | 'free_shipping';
  value: number;
  description: string;
  maxUsage: number;
  currentUsage: number;
  startDate: string;
  endDate: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
};

const statusColors: Record<string, string> = {
  active: "bg-green-100 text-green-800",
  expired: "bg-red-100 text-red-800",
  inactive: "bg-gray-100 text-gray-800",
}

const chartData = [
  { date: "2024-06-01", usage: 10 },
  { date: "2024-06-02", usage: 15 },
  { date: "2024-06-03", usage: 8 },
  { date: "2024-06-04", usage: 12 },
  { date: "2024-06-05", usage: 20 },
  { date: "2024-06-06", usage: 18 },
  { date: "2024-06-07", usage: 25 },
]

export default function DiscountsCouponsPage() {
  const [discounts, setDiscounts] = useState<Discount[]>([])
  const [search, setSearch] = useState("")
  const [isSearching, setIsSearching] = useState(false)
  const debouncedSearchTerm = useDebounce(search, 300)
  const [statusFilter, setStatusFilter] = useState("all")
  const [open, setOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [form, setForm] = useState({
    code: "",
    type: "percentage" as 'percentage' | 'flat' | 'free_shipping',
    value: "",
    description: "",
    maxUsage: "",
    maxUsagePerCustomer: "1",
    minimumOrderAmount: "",
    maximumDiscountAmount: "",
    isActive: true,
    start: "",
    end: "",
  })
  const formRef = useRef<HTMLFormElement>(null)

  // Real-time search effect
  useEffect(() => {
    if (debouncedSearchTerm) {
      setIsSearching(true)
      searchDiscounts(debouncedSearchTerm)
    } else {
      fetchAllDiscounts()
    }
  }, [debouncedSearchTerm])

  // Fetch discounts on component mount
  useEffect(() => {
    fetchAllDiscounts()
  }, [])

  const searchDiscounts = async (term: string) => {
    // Since the API doesn't support search, we'll use client-side filtering
    setIsSearching(false)
    // The filtering is already handled in filteredDiscounts
  }

  const fetchAllDiscounts = async () => {
    setIsLoading(true)
    const result = await discountAPI.getAll()
    setIsLoading(false)
    if (result.success && Array.isArray(result.data)) {
      setDiscounts(result.data)
    }
  }

  const getDiscountStatus = (discount: Discount) => {
    const now = new Date()
    const endDate = new Date(discount.endDate)
    if (!discount.isActive) return 'inactive'
    if (now > endDate) return 'expired'
    return 'active'
  }

  const filteredDiscounts = discounts.filter(discount => {
    const matchesSearch = discount.code.toLowerCase().includes(search.toLowerCase()) ||
                         discount.description.toLowerCase().includes(search.toLowerCase())
    const matchesStatus = statusFilter === "all" || getDiscountStatus(discount) === statusFilter
    return matchesSearch && matchesStatus
  })

  // Insights
  const totalDiscounts = discounts.length
  const active = discounts.filter(d => getDiscountStatus(d) === "active").length
  const expired = discounts.filter(d => getDiscountStatus(d) === "expired").length
  const totalUsage = discounts.reduce((sum, d) => sum + d.currentUsage, 0)
  const usageRate = totalDiscounts > 0 ? ((totalUsage / (totalDiscounts * 100)) * 100).toFixed(1) : "0"

  function handleFormChange(e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  function handleDialogOpenChange(val: boolean) {
    setOpen(val)
    if (!val) {
      setForm({ 
        code: "", 
        type: "percentage", 
        value: "", 
        description: "",
        maxUsage: "",
        maxUsagePerCustomer: "1",
        minimumOrderAmount: "",
        maximumDiscountAmount: "",
        isActive: true,
        start: "", 
        end: "" 
      })
      formRef.current?.reset()
    }
  }

  async function handleAddDiscount(e: React.FormEvent) {
    e.preventDefault()
    if (!form.code || !form.value || !form.start || !form.end || !form.description || !form.maxUsage) return
    
    setIsSubmitting(true)
    const discountData = {
      code: form.code,
      type: form.type,
      value: parseFloat(form.value),
      description: form.description,
      maxUsage: parseInt(form.maxUsage),
      maxUsagePerCustomer: parseInt(form.maxUsagePerCustomer),
      minimumOrderAmount: form.minimumOrderAmount ? parseFloat(form.minimumOrderAmount) : undefined,
      maximumDiscountAmount: form.maximumDiscountAmount ? parseFloat(form.maximumDiscountAmount) : undefined,
      isActive: form.isActive,
      startDate: new Date(form.start),
      endDate: new Date(form.end),
    }
    
    const result = await discountAPI.create(discountData)
    setIsSubmitting(false)
    
    if (result.success) {
      setOpen(false)
      fetchAllDiscounts() // Refresh the list
    } else {
      alert(result.error || 'Failed to create discount')
    }
  }

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
              <div className="grid grid-cols-1 gap-4 px-4 lg:px-6 @xl/main:grid-cols-2 @5xl/main:grid-cols-4">
                <Card>
                  <CardHeader>
                    <CardDescription>Active Discounts</CardDescription>
                    <CardTitle className="text-2xl font-semibold">{active}</CardTitle>
                    <Badge className="bg-green-100 text-green-800 mt-2"><CheckCircle className="w-4 h-4 mr-1" />+3% MoM</Badge>
                  </CardHeader>
                </Card>
                <Card>
                  <CardHeader>
                    <CardDescription>Expired</CardDescription>
                    <CardTitle className="text-2xl font-semibold">{expired}</CardTitle>
                    <Badge className="bg-red-100 text-red-800 mt-2"><XCircle className="w-4 h-4 mr-1" />-1% MoM</Badge>
                  </CardHeader>
                </Card>
                <Card>
                  <CardHeader>
                    <CardDescription>Total Coupons</CardDescription>
                    <CardTitle className="text-2xl font-semibold">{totalDiscounts}</CardTitle>
                    <Badge className="bg-blue-100 text-blue-800 mt-2"><Gift className="w-4 h-4 mr-1" />+5% MoM</Badge>
                  </CardHeader>
                </Card>
                <Card>
                  <CardHeader>
                    <CardDescription>Usage Rate</CardDescription>
                    <CardTitle className="text-2xl font-semibold">{usageRate}%</CardTitle>
                    <Badge className="bg-yellow-100 text-yellow-800 mt-2"><Percent className="w-4 h-4 mr-1" />+2% MoM</Badge>
                  </CardHeader>
                </Card>
              </div>

              {/* Coupon Usage Chart */}
              <Card className="mx-4 lg:mx-6">
                <CardHeader>
                  <CardTitle>Coupon Usage (Last 7 days)</CardTitle>
                  <CardDescription>Track coupon redemption trends</CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={250}>
                    <AreaChart data={chartData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                      <defs>
                        <linearGradient id="usage" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#f59e42" stopOpacity={0.8} />
                          <stop offset="95%" stopColor="#f59e42" stopOpacity={0.1} />
                        </linearGradient>
                      </defs>
                      <CartesianGrid vertical={false} />
                      <XAxis dataKey="date" tickLine={false} axisLine={false} tickMargin={8} />
                      <Tooltip />
                      <Area type="monotone" dataKey="usage" stroke="#f59e42" fill="url(#usage)" name="Usage" />
                    </AreaChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              {/* Add Discount/Coupon Button and Dialog */}
              <div className="mx-4 lg:mx-6 flex justify-end mb-4">
                <Dialog open={open} onOpenChange={handleDialogOpenChange}>
                  <DialogTrigger asChild>
                    <Button onClick={() => setOpen(true)}>
                      + Add Discount/Coupon
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Add Discount/Coupon</DialogTitle>
                    </DialogHeader>
                    <form ref={formRef} onSubmit={handleAddDiscount} className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium mb-1">Code</label>
                        <Input name="code" value={form.code} onChange={handleFormChange} required autoFocus />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-1">Type</label>
                        <select name="type" value={form.type} onChange={handleFormChange} className="w-full border rounded px-2 py-2">
                          <option value="percentage">Percentage</option>
                          <option value="flat">Flat</option>
                          <option value="free_shipping">Free Shipping</option>
                        </select>
                      </div>
                      {form.type !== "free_shipping" && (
                        <div>
                          <label className="block text-sm font-medium mb-1">Value {form.type === "percentage" ? "(%)" : "($)"}</label>
                          <Input name="value" type="number" value={form.value} onChange={handleFormChange} required min={1} />
                        </div>
                      )}
                      <div>
                        <label className="block text-sm font-medium mb-1">Description</label>
                        <Input name="description" value={form.description} onChange={handleFormChange} />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-1">Max Usage</label>
                        <Input name="maxUsage" type="number" value={form.maxUsage} onChange={handleFormChange} required min={1} />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-1">Max Usage Per Customer</label>
                        <Input name="maxUsagePerCustomer" type="number" value={form.maxUsagePerCustomer} onChange={handleFormChange} required min={1} />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-1">Minimum Order Amount</label>
                        <Input name="minimumOrderAmount" type="number" value={form.minimumOrderAmount} onChange={handleFormChange} />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-1">Maximum Discount Amount</label>
                        <Input name="maximumDiscountAmount" type="number" value={form.maximumDiscountAmount} onChange={handleFormChange} />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-1">Status</label>
                        <select name="isActive" value={form.isActive ? "true" : "false"} onChange={handleFormChange} className="w-full border rounded px-2 py-2">
                          <option value="true">Active</option>
                          <option value="false">Inactive</option>
                        </select>
                      </div>
                      <div className="flex gap-2">
                        <div className="flex-1">
                          <label className="block text-sm font-medium mb-1">Start Date</label>
                          <Input name="start" type="date" value={form.start} onChange={handleFormChange} required />
                        </div>
                        <div className="flex-1">
                          <label className="block text-sm font-medium mb-1">End Date</label>
                          <Input name="end" type="date" value={form.end} onChange={handleFormChange} required />
                        </div>
                      </div>
                      <DialogFooter>
                        <Button type="submit" disabled={isSubmitting}>
                          {isSubmitting ? "Adding..." : "Add"}
                        </Button>
                      </DialogFooter>
                    </form>
                  </DialogContent>
                </Dialog>
              </div>

              {/* Coupons Table */}
              <Card className="mx-4 lg:mx-6">
                <CardHeader>
                  <CardTitle>
                    Discounts & Coupons
                    {search && (
                      <span className="text-sm font-normal text-muted-foreground ml-2">
                        ({filteredDiscounts.length} results for &quot;{search}&quot;)
                      </span>
                    )}
                  </CardTitle>
                  <CardDescription>Manage and track all discounts and coupons</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-col md:flex-row gap-4 mb-4">
                    <div className="relative md:w-1/3">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                      <Input
                        placeholder="Search by code or description..."
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
                        <SelectItem value="active">Active</SelectItem>
                        <SelectItem value="expired">Expired</SelectItem>
                        <SelectItem value="inactive">Inactive</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Code</TableHead>
                          <TableHead>Type</TableHead>
                          <TableHead>Value</TableHead>
                          <TableHead>Status</TableHead>
                          <TableHead>Usage</TableHead>
                          <TableHead>Start</TableHead>
                          <TableHead>End</TableHead>
                          <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {filteredDiscounts.length === 0 ? (
                          <TableRow>
                            <TableCell colSpan={8} className="text-center py-8 text-muted-foreground">
                              No discounts or coupons found.
                            </TableCell>
                          </TableRow>
                        ) : (
                          filteredDiscounts.map(discount => (
                            <TableRow key={discount._id}>
                              <TableCell>{discount.code}</TableCell>
                              <TableCell>{discount.type === 'percentage' ? 'Percentage' : discount.type === 'flat' ? 'Flat' : 'Free Shipping'}</TableCell>
                              <TableCell>{discount.type === 'percentage' ? `${discount.value}%` : discount.type === 'flat' ? `$${discount.value}` : discount.type}</TableCell>
                              <TableCell>
                                <Badge className={statusColors[getDiscountStatus(discount)] + " font-medium"}>{getDiscountStatus(discount).charAt(0).toUpperCase() + getDiscountStatus(discount).slice(1)}</Badge>
                              </TableCell>
                              <TableCell>{discount.currentUsage}</TableCell>
                              <TableCell>{new Date(discount.startDate).toLocaleDateString()}</TableCell>
                              <TableCell>{new Date(discount.endDate).toLocaleDateString()}</TableCell>
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