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
import { Percent, CheckCircle, XCircle, Gift, ArrowUpRight, ArrowDownRight } from "lucide-react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog"
import { useRef } from "react"

// Sample discounts/coupons data
const coupons = [
  { code: "SUMMER20", type: "Percentage", value: 20, status: "Active", usage: 120, start: "2024-06-01", end: "2024-06-30" },
  { code: "WELCOME10", type: "Flat", value: 10, status: "Active", usage: 200, start: "2024-05-01", end: "2024-12-31" },
  { code: "FREESHIP", type: "Free Shipping", value: 0, status: "Expired", usage: 80, start: "2024-04-01", end: "2024-05-01" },
  { code: "WINTER15", type: "Percentage", value: 15, status: "Active", usage: 60, start: "2024-12-01", end: "2024-12-31" },
  { code: "VIP50", type: "Flat", value: 50, status: "Expired", usage: 30, start: "2024-01-01", end: "2024-03-01" },
]

const statusColors: Record<string, string> = {
  Active: "bg-green-100 text-green-800",
  Expired: "bg-red-100 text-red-800",
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
  const [search, setSearch] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [open, setOpen] = useState(false)
  const [allCoupons, setAllCoupons] = useState(coupons)
  const [form, setForm] = useState({
    code: "",
    type: "Percentage",
    value: "",
    status: "Active",
    start: "",
    end: "",
  })
  const formRef = useRef<HTMLFormElement>(null)

  const filteredCoupons = allCoupons.filter(coupon =>
    (coupon.code.toLowerCase().includes(search.toLowerCase())) &&
    (statusFilter !== "all" ? coupon.status === statusFilter : true)
  )

  // Insights
  const totalCoupons = allCoupons.length
  const active = allCoupons.filter(c => c.status === "Active").length
  const expired = allCoupons.filter(c => c.status === "Expired").length
  const usage = allCoupons.reduce((sum, c) => sum + c.usage, 0)
  const usageRate = ((usage / (totalCoupons * 100)) * 100).toFixed(1) // fake rate

  function handleFormChange(e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  function handleDialogOpenChange(val: boolean) {
    setOpen(val)
    if (!val) {
      setForm({ code: "", type: "Percentage", value: "", status: "Active", start: "", end: "" })
      formRef.current?.reset()
    }
  }

  function handleAddCoupon(e: React.FormEvent) {
    e.preventDefault()
    if (!form.code || !form.value || !form.start || !form.end) return
    setAllCoupons([
      ...allCoupons,
      {
        code: form.code,
        type: form.type,
        value: form.type === "Percentage" ? Number(form.value) : form.type === "Flat" ? Number(form.value) : 0,
        status: form.status,
        usage: 0,
        start: form.start,
        end: form.end,
      },
    ])
    setOpen(false)
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
                    <CardTitle className="text-2xl font-semibold">{totalCoupons}</CardTitle>
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
                    <form ref={formRef} onSubmit={handleAddCoupon} className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium mb-1">Code</label>
                        <Input name="code" value={form.code} onChange={handleFormChange} required autoFocus />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-1">Type</label>
                        <select name="type" value={form.type} onChange={handleFormChange} className="w-full border rounded px-2 py-2">
                          <option value="Percentage">Percentage</option>
                          <option value="Flat">Flat</option>
                          <option value="Free Shipping">Free Shipping</option>
                        </select>
                      </div>
                      {form.type !== "Free Shipping" && (
                        <div>
                          <label className="block text-sm font-medium mb-1">Value {form.type === "Percentage" ? "(%)" : "($)"}</label>
                          <Input name="value" type="number" value={form.value} onChange={handleFormChange} required min={1} />
                        </div>
                      )}
                      <div>
                        <label className="block text-sm font-medium mb-1">Status</label>
                        <select name="status" value={form.status} onChange={handleFormChange} className="w-full border rounded px-2 py-2">
                          <option value="Active">Active</option>
                          <option value="Expired">Expired</option>
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
                        <Button type="submit">Add</Button>
                      </DialogFooter>
                    </form>
                  </DialogContent>
                </Dialog>
              </div>

              {/* Coupons Table */}
              <Card className="mx-4 lg:mx-6">
                <CardHeader>
                  <CardTitle>Discounts & Coupons</CardTitle>
                  <CardDescription>Manage and track all discounts and coupons</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-col md:flex-row gap-4 mb-4">
                    <Input
                      placeholder="Search by code..."
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
                        <SelectItem value="Active">Active</SelectItem>
                        <SelectItem value="Expired">Expired</SelectItem>
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
                        {filteredCoupons.length === 0 ? (
                          <TableRow>
                            <TableCell colSpan={8} className="text-center py-8 text-muted-foreground">
                              No discounts or coupons found.
                            </TableCell>
                          </TableRow>
                        ) : (
                          filteredCoupons.map(coupon => (
                            <TableRow key={coupon.code}>
                              <TableCell>{coupon.code}</TableCell>
                              <TableCell>{coupon.type}</TableCell>
                              <TableCell>{coupon.type === "Percentage" ? `${coupon.value}%` : coupon.type === "Flat" ? `$${coupon.value}` : coupon.type}</TableCell>
                              <TableCell>
                                <Badge className={statusColors[coupon.status] + " font-medium"}>{coupon.status}</Badge>
                              </TableCell>
                              <TableCell>{coupon.usage}</TableCell>
                              <TableCell>{coupon.start}</TableCell>
                              <TableCell>{coupon.end}</TableCell>
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