import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  BarChart3, 
  TrendingUp, 
  Download, 
  Calendar,
  DollarSign,
  Package,
  Users
} from "lucide-react";
import { formatPrice } from "@/lib/currency";
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";

export default function Reports() {
  const [timeRange, setTimeRange] = useState("7days");

  // Mock data for charts
  const salesData = [
    { date: "Mon", sales: 125000, transactions: 15 },
    { date: "Tue", sales: 89000, transactions: 12 },
    { date: "Wed", sales: 156000, transactions: 18 },
    { date: "Thu", sales: 203000, transactions: 24 },
    { date: "Fri", sales: 178000, transactions: 21 },
    { date: "Sat", sales: 245000, transactions: 32 },
    { date: "Sun", sales: 167000, transactions: 19 }
  ];

  const categoryData = [
    { name: "Clothing", value: 45, color: "#10B981" },
    { name: "Footwear", value: 25, color: "#F59E0B" },
    { name: "Accessories", value: 20, color: "#EF4444" },
    { name: "Electronics", value: 10, color: "#8B5CF6" }
  ];

  const topProducts = [
    { name: "Summer Dress", sold: 45, revenue: 1575000 },
    { name: "Men's Sneakers", sold: 32, revenue: 2080000 },
    { name: "Women's Handbag", sold: 28, revenue: 1260000 },
    { name: "Watch", sold: 15, revenue: 1875000 },
    { name: "T-Shirt", sold: 67, revenue: 1206000 }
  ];

  const recentTransactions = [
    { id: "TXN001", customer: "Marie Ngassa", items: 3, total: 125400, time: "2 hours ago", status: "completed" },
    { id: "TXN002", customer: "Jean Kamga", items: 1, total: 65000, time: "3 hours ago", status: "completed" },
    { id: "TXN003", customer: "Sarah Mballa", items: 5, total: 198200, time: "4 hours ago", status: "completed" },
    { id: "TXN004", customer: "Paul Foka", items: 2, total: 87100, time: "5 hours ago", status: "refunded" },
    { id: "TXN005", customer: "Grace Ateba", items: 1, total: 45000, time: "6 hours ago", status: "completed" }
  ];

  const totalSales = salesData.reduce((sum, day) => sum + day.sales, 0);
  const totalTransactions = salesData.reduce((sum, day) => sum + day.transactions, 0);
  const averageOrderValue = totalSales / totalTransactions;

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Sales Reports</h1>
          <p className="text-muted-foreground">
            Analyze your boutique's performance and trends
          </p>
        </div>
        
        <div className="flex items-center gap-2">
          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger className="w-40">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7days">Last 7 Days</SelectItem>
              <SelectItem value="30days">Last 30 Days</SelectItem>
              <SelectItem value="90days">Last 3 Months</SelectItem>
              <SelectItem value="1year">Last Year</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card className="shadow-soft">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Sales</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatPrice(totalSales)}</div>
            <p className="text-xs text-primary">+12.5% from last week</p>
          </CardContent>
        </Card>

        <Card className="shadow-soft">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Transactions</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalTransactions}</div>
            <p className="text-xs text-primary">+8.2% from last week</p>
          </CardContent>
        </Card>

        <Card className="shadow-soft">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg Order Value</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatPrice(averageOrderValue)}</div>
            <p className="text-xs text-primary">+3.8% from last week</p>
          </CardContent>
        </Card>

        <Card className="shadow-soft">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Customers</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">89</div>
            <p className="text-xs text-primary">+15.3% from last week</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="sales" className="space-y-4">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="sales">Sales Trends</TabsTrigger>
          <TabsTrigger value="products">Products</TabsTrigger>
          <TabsTrigger value="categories">Categories</TabsTrigger>
          <TabsTrigger value="transactions">Transactions</TabsTrigger>
        </TabsList>

        <TabsContent value="sales" className="space-y-4">
          <Card className="shadow-soft">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="h-5 w-5" />
                Daily Sales Performance
              </CardTitle>
              <CardDescription>
                Sales revenue and transaction count over the selected period
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={salesData}>
                    <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip 
                      formatter={(value, name) => [
                        name === "sales" ? formatPrice(Number(value)) : value,
                        name === "sales" ? "Sales" : "Transactions"
                      ]}
                    />
                    <Line 
                      type="monotone" 
                      dataKey="sales" 
                      stroke="hsl(var(--primary))" 
                      strokeWidth={3}
                      dot={{ fill: "hsl(var(--primary))", strokeWidth: 2, r: 4 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-soft">
            <CardHeader>
              <CardTitle>Transaction Volume</CardTitle>
              <CardDescription>
                Number of transactions per day
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={salesData}>
                    <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="transactions" fill="hsl(var(--secondary))" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="products" className="space-y-4">
          <Card className="shadow-soft">
            <CardHeader>
              <CardTitle>Top Selling Products</CardTitle>
              <CardDescription>
                Best performing products by sales volume and revenue
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {topProducts.map((product, index) => (
                  <div key={product.name} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center">
                        <span className="text-sm font-bold text-primary">#{index + 1}</span>
                      </div>
                      <div>
                        <p className="font-medium">{product.name}</p>
                        <p className="text-sm text-muted-foreground">{product.sold} units sold</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-primary">{formatPrice(product.revenue)}</p>
                      <p className="text-sm text-muted-foreground">Revenue</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="categories" className="space-y-4">
          <Card className="shadow-soft">
            <CardHeader>
              <CardTitle>Sales by Category</CardTitle>
              <CardDescription>
                Distribution of sales across product categories
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-6">
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={categoryData}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={100}
                        paddingAngle={5}
                        dataKey="value"
                      >
                        {categoryData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip formatter={(value) => [`${value}%`, "Share"]} />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
                <div className="space-y-3">
                  {categoryData.map((category) => (
                    <div key={category.name} className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex items-center gap-3">
                        <div 
                          className="w-4 h-4 rounded-full" 
                          style={{ backgroundColor: category.color }}
                        ></div>
                        <span className="font-medium">{category.name}</span>
                      </div>
                      <Badge variant="secondary">{category.value}%</Badge>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="transactions" className="space-y-4">
          <Card className="shadow-soft">
            <CardHeader>
              <CardTitle>Recent Transactions</CardTitle>
              <CardDescription>
                Latest sales transactions and their details
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {recentTransactions.map((transaction) => (
                  <div key={transaction.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <p className="font-medium text-sm">{transaction.customer}</p>
                        <Badge 
                          variant={transaction.status === "completed" ? "default" : "destructive"}
                          className="text-xs"
                        >
                          {transaction.status}
                        </Badge>
                      </div>
                      <p className="text-xs text-muted-foreground">
                        {transaction.id} • {transaction.items} items • {transaction.time}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-primary">{formatPrice(transaction.total)}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}