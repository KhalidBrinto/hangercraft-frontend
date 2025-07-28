"use client"

import { AppSidebar } from "@/components/app-sidebar"
import { SiteHeader } from "@/components/site-header"
import {
  SidebarInset,
  SidebarProvider,
} from "@/components/ui/sidebar"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Switch } from "@/components/ui/switch"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { AreaChart, Area, CartesianGrid, XAxis, YAxis, Tooltip, ResponsiveContainer, BarChart, Bar } from "recharts"
import { useState } from "react"
import { CreditCard, DollarSign, Settings, Shield, Zap, CheckCircle, XCircle, AlertCircle } from "lucide-react"

// Sample payment data
const paymentMethods = [
  {
    id: "paypal",
    name: "PayPal",
    icon: "💳",
    status: "Active",
    description: "Accept PayPal payments worldwide",
    transactionVolume: 15420,
    successRate: 98.5,
    lastTransaction: "2 hours ago"
  },
  {
    id: "stripe",
    name: "Stripe",
    icon: "💳",
    status: "Active", 
    description: "Credit card processing",
    transactionVolume: 23450,
    successRate: 99.2,
    lastTransaction: "1 hour ago"
  },
  {
    id: "apple-pay",
    name: "Apple Pay",
    icon: "🍎",
    status: "Inactive",
    description: "Apple Pay integration",
    transactionVolume: 0,
    successRate: 0,
    lastTransaction: "Never"
  }
]

const chartData = [
  { month: "Jan", transactions: 1200, revenue: 45000 },
  { month: "Feb", transactions: 1350, revenue: 52000 },
  { month: "Mar", transactions: 1100, revenue: 41000 },
  { month: "Apr", transactions: 1600, revenue: 62000 },
  { month: "May", transactions: 1800, revenue: 68000 },
  { month: "Jun", transactions: 2100, revenue: 78000 },
]

const recentTransactions = [
  { id: "TXN-001", method: "PayPal", amount: 129.99, status: "Completed", date: "2024-06-07 14:30" },
  { id: "TXN-002", method: "Stripe", amount: 89.50, status: "Completed", date: "2024-06-07 13:45" },
  { id: "TXN-003", method: "PayPal", amount: 199.99, status: "Failed", date: "2024-06-07 12:20" },
  { id: "TXN-004", method: "Stripe", amount: 45.00, status: "Pending", date: "2024-06-07 11:15" },
]

export default function PaymentOptionsPage() {
  const [paypalConfig, setPaypalConfig] = useState({
    clientId: "",
    clientSecret: "",
    webhookUrl: "",
    sandboxMode: true,
    enabled: true
  })

  const [stripeConfig, setStripeConfig] = useState({
    publishableKey: "",
    secretKey: "",
    webhookSecret: "",
    enabled: true
  })

  const activeMethods = paymentMethods.filter(m => m.status === "Active").length
  const totalVolume = paymentMethods.reduce((sum, m) => sum + m.transactionVolume, 0)
  const avgSuccessRate = paymentMethods.reduce((sum, m) => sum + m.successRate, 0) / paymentMethods.length

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
              {/* Header */}
              <div className="px-4 lg:px-6">
                <h1 className="text-3xl font-bold">Payment Options</h1>
                <p className="text-muted-foreground">Configure and manage payment methods</p>
              </div>

              {/* Insights Cards */}
              <div className="grid grid-cols-1 gap-4 px-4 lg:px-6 @xl/main:grid-cols-2 @5xl/main:grid-cols-4">
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Active Methods</CardTitle>
                    <CreditCard className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{activeMethods}</div>
                    <p className="text-xs text-muted-foreground">+1 from last month</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Total Volume</CardTitle>
                    <DollarSign className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">${totalVolume.toLocaleString()}</div>
                    <p className="text-xs text-muted-foreground">+12% from last month</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Success Rate</CardTitle>
                    <CheckCircle className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{avgSuccessRate.toFixed(1)}%</div>
                    <p className="text-xs text-muted-foreground">+0.5% from last month</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Failed Transactions</CardTitle>
                    <XCircle className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">23</div>
                    <p className="text-xs text-muted-foreground">-5 from last month</p>
                  </CardContent>
                </Card>
              </div>

              {/* Payment Analytics */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 px-4 lg:px-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Transaction Volume</CardTitle>
                    <CardDescription>Monthly payment processing volume</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ResponsiveContainer width="100%" height={250}>
                      <AreaChart data={chartData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="month" />
                        <YAxis />
                        <Tooltip />
                        <Area type="monotone" dataKey="transactions" stroke="#8884d8" fill="#8884d8" />
                      </AreaChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader>
                    <CardTitle>Revenue by Payment Method</CardTitle>
                    <CardDescription>Revenue distribution across payment methods</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ResponsiveContainer width="100%" height={250}>
                      <BarChart data={paymentMethods.filter(m => m.status === "Active")}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" />
                        <YAxis />
                        <Tooltip />
                        <Bar dataKey="transactionVolume" fill="#82ca9d" />
                      </BarChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>
              </div>

              {/* Payment Methods Configuration */}
              <Card className="mx-4 lg:mx-6">
                <CardHeader>
                  <CardTitle>Payment Methods</CardTitle>
                  <CardDescription>Configure and manage your payment gateways</CardDescription>
                </CardHeader>
                <CardContent>
                  <Tabs defaultValue="paypal" className="w-full">
                    <TabsList className="grid w-full grid-cols-3">
                      <TabsTrigger value="paypal">PayPal</TabsTrigger>
                      <TabsTrigger value="stripe">Stripe</TabsTrigger>
                      <TabsTrigger value="other">Other Methods</TabsTrigger>
                    </TabsList>
                    
                    <TabsContent value="paypal" className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="text-lg font-semibold">PayPal Configuration</h3>
                          <p className="text-sm text-muted-foreground">Set up PayPal payment processing</p>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Switch 
                            checked={paypalConfig.enabled}
                            onCheckedChange={(checked) => setPaypalConfig({...paypalConfig, enabled: checked})}
                          />
                          <span className="text-sm">Enable PayPal</span>
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium mb-1">Client ID</label>
                          <Input 
                            placeholder="Enter PayPal Client ID"
                            value={paypalConfig.clientId}
                            onChange={(e) => setPaypalConfig({...paypalConfig, clientId: e.target.value})}
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium mb-1">Client Secret</label>
                          <Input 
                            type="password"
                            placeholder="Enter PayPal Client Secret"
                            value={paypalConfig.clientSecret}
                            onChange={(e) => setPaypalConfig({...paypalConfig, clientSecret: e.target.value})}
                          />
                        </div>
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium mb-1">Webhook URL</label>
                        <Input 
                          placeholder="https://yourdomain.com/api/paypal-webhook"
                          value={paypalConfig.webhookUrl}
                          onChange={(e) => setPaypalConfig({...paypalConfig, webhookUrl: e.target.value})}
                        />
                      </div>
                      
                      <div className="flex items-center space-x-2">
                        <Switch 
                          checked={paypalConfig.sandboxMode}
                          onCheckedChange={(checked) => setPaypalConfig({...paypalConfig, sandboxMode: checked})}
                        />
                        <span className="text-sm">Sandbox Mode (for testing)</span>
                      </div>
                      
                      <div className="flex space-x-2">
                        <Button>Save Configuration</Button>
                        <Button variant="outline">Test Connection</Button>
                      </div>
                    </TabsContent>
                    
                    <TabsContent value="stripe" className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="text-lg font-semibold">Stripe Configuration</h3>
                          <p className="text-sm text-muted-foreground">Set up Stripe payment processing</p>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Switch 
                            checked={stripeConfig.enabled}
                            onCheckedChange={(checked) => setStripeConfig({...stripeConfig, enabled: checked})}
                          />
                          <span className="text-sm">Enable Stripe</span>
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium mb-1">Publishable Key</label>
                          <Input 
                            placeholder="pk_test_..."
                            value={stripeConfig.publishableKey}
                            onChange={(e) => setStripeConfig({...stripeConfig, publishableKey: e.target.value})}
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium mb-1">Secret Key</label>
                          <Input 
                            type="password"
                            placeholder="sk_test_..."
                            value={stripeConfig.secretKey}
                            onChange={(e) => setStripeConfig({...stripeConfig, secretKey: e.target.value})}
                          />
                        </div>
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium mb-1">Webhook Secret</label>
                        <Input 
                          placeholder="whsec_..."
                          value={stripeConfig.webhookSecret}
                          onChange={(e) => setStripeConfig({...stripeConfig, webhookSecret: e.target.value})}
                        />
                      </div>
                      
                      <div className="flex space-x-2">
                        <Button>Save Configuration</Button>
                        <Button variant="outline">Test Connection</Button>
                      </div>
                    </TabsContent>
                    
                    <TabsContent value="other" className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {paymentMethods.map((method) => (
                          <Card key={method.id} className="p-4">
                            <div className="flex items-center justify-between mb-2">
                              <div className="flex items-center space-x-2">
                                <span className="text-2xl">{method.icon}</span>
                                <div>
                                  <h4 className="font-semibold">{method.name}</h4>
                                  <Badge className={method.status === "Active" ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-800"}>
                                    {method.status}
                                  </Badge>
                                </div>
                              </div>
                            </div>
                            <p className="text-sm text-muted-foreground mb-3">{method.description}</p>
                            <div className="space-y-1 text-sm">
                              <div>Volume: ${method.transactionVolume.toLocaleString()}</div>
                              <div>Success Rate: {method.successRate}%</div>
                              <div>Last: {method.lastTransaction}</div>
                            </div>
                            <Button variant="outline" size="sm" className="w-full mt-3">
                              Configure
                            </Button>
                          </Card>
                        ))}
                      </div>
                    </TabsContent>
                  </Tabs>
                </CardContent>
              </Card>

              {/* Recent Transactions */}
              <Card className="mx-4 lg:mx-6">
                <CardHeader>
                  <CardTitle>Recent Transactions</CardTitle>
                  <CardDescription>Latest payment processing activity</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {recentTransactions.map((transaction) => (
                      <div key={transaction.id} className="flex items-center justify-between p-4 border rounded-lg">
                        <div className="flex items-center space-x-4">
                          <div className="flex-shrink-0">
                            <CreditCard className="h-8 w-8 text-muted-foreground" />
                          </div>
                          <div>
                            <div className="font-medium">{transaction.id}</div>
                            <div className="text-sm text-muted-foreground">{transaction.method}</div>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="font-medium">${transaction.amount}</div>
                          <Badge className={
                            transaction.status === "Completed" ? "bg-green-100 text-green-800" :
                            transaction.status === "Failed" ? "bg-red-100 text-red-800" :
                            "bg-yellow-100 text-yellow-800"
                          }>
                            {transaction.status}
                          </Badge>
                        </div>
                        <div className="text-sm text-muted-foreground">
                          {transaction.date}
                        </div>
                      </div>
                    ))}
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
