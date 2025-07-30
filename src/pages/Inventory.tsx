import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { 
  Search, 
  Package, 
  AlertTriangle, 
  TrendingUp, 
  TrendingDown,
  Plus,
  Minus,
  History
} from "lucide-react";
import { formatPrice } from "@/lib/currency";
import { toast } from "@/hooks/use-toast";

interface InventoryItem {
  id: string;
  name: string;
  category: string;
  currentStock: number;
  minStock: number;
  maxStock: number;
  costPrice: number;
  sellPrice: number;
  totalValue: number;
  lastRestocked: string;
  supplier?: string;
}

export default function Inventory() {
  const [searchTerm, setSearchTerm] = useState("");
  const [stockFilter, setStockFilter] = useState("all");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [selectedItem, setSelectedItem] = useState<InventoryItem | null>(null);
  const [adjustmentType, setAdjustmentType] = useState<"increase" | "decrease">("increase");
  const [adjustmentQuantity, setAdjustmentQuantity] = useState(1);
  const [adjustmentReason, setAdjustmentReason] = useState("");

  // Mock inventory data
  const [inventory, setInventory] = useState<InventoryItem[]>([
    {
      id: "1",
      name: "Women's Handbag",
      category: "Accessories",
      currentStock: 12,
      minStock: 5,
      maxStock: 50,
      costPrice: 25000,
      sellPrice: 45000,
      totalValue: 300000,
      lastRestocked: "2024-01-15",
      supplier: "Fashion Suppliers Ltd"
    },
    {
      id: "2",
      name: "Men's Sneakers",
      category: "Footwear",
      currentStock: 3,
      minStock: 8,
      maxStock: 30,
      costPrice: 35000,
      sellPrice: 65000,
      totalValue: 105000,
      lastRestocked: "2024-01-10",
      supplier: "Shoe Distributors"
    },
    {
      id: "3",
      name: "Summer Dress",
      category: "Clothing",
      currentStock: 25,
      minStock: 10,
      maxStock: 60,
      costPrice: 18000,
      sellPrice: 35000,
      totalValue: 450000,
      lastRestocked: "2024-01-20",
      supplier: "Textile Imports"
    },
    {
      id: "4",
      name: "Watch",
      category: "Accessories",
      currentStock: 1,
      minStock: 3,
      maxStock: 15,
      costPrice: 75000,
      sellPrice: 125000,
      totalValue: 75000,
      lastRestocked: "2024-01-05",
      supplier: "Electronics Hub"
    }
  ]);

  const categories = ["all", ...Array.from(new Set(inventory.map(item => item.category)))];

  const getStockStatus = (item: InventoryItem) => {
    if (item.currentStock === 0) return "outofstock";
    if (item.currentStock <= item.minStock) return "low";
    if (item.currentStock >= item.maxStock * 0.8) return "high";
    return "normal";
  };

  const filteredInventory = inventory.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.category.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = categoryFilter === "all" || item.category === categoryFilter;
    
    let matchesStock = true;
    if (stockFilter === "low") matchesStock = getStockStatus(item) === "low";
    if (stockFilter === "outofstock") matchesStock = getStockStatus(item) === "outofstock";
    if (stockFilter === "normal") matchesStock = getStockStatus(item) === "normal";
    
    return matchesSearch && matchesCategory && matchesStock;
  });

  const handleStockAdjustment = () => {
    if (!selectedItem) return;

    const newStock = adjustmentType === "increase" 
      ? selectedItem.currentStock + adjustmentQuantity
      : selectedItem.currentStock - adjustmentQuantity;

    if (newStock < 0) {
      toast({
        title: "Invalid Adjustment",
        description: "Stock cannot be negative",
        variant: "destructive",
      });
      return;
    }

    setInventory(prev => prev.map(item => 
      item.id === selectedItem.id 
        ? { 
            ...item, 
            currentStock: newStock,
            totalValue: newStock * item.costPrice
          }
        : item
    ));

    toast({
      title: "Stock Adjusted",
      description: `${selectedItem.name} stock ${adjustmentType === "increase" ? "increased" : "decreased"} by ${adjustmentQuantity}`,
    });

    setSelectedItem(null);
    setAdjustmentQuantity(1);
    setAdjustmentReason("");
  };

  const totalInventoryValue = inventory.reduce((sum, item) => sum + item.totalValue, 0);
  const lowStockItems = inventory.filter(item => getStockStatus(item) === "low").length;
  const outOfStockItems = inventory.filter(item => getStockStatus(item) === "outofstock").length;

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-bold text-foreground">Inventory Management</h1>
        <p className="text-muted-foreground">
          Monitor stock levels and manage your inventory
        </p>
      </div>

      {/* Inventory Stats */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card className="shadow-soft">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Inventory Value</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatPrice(totalInventoryValue)}</div>
            <p className="text-xs text-primary">+2.5% from last month</p>
          </CardContent>
        </Card>

        <Card className="shadow-soft">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Items</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {inventory.reduce((sum, item) => sum + item.currentStock, 0)}
            </div>
            <p className="text-xs text-muted-foreground">{inventory.length} product types</p>
          </CardContent>
        </Card>

        <Card className="shadow-soft border-amber-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Low Stock Alerts</CardTitle>
            <AlertTriangle className="h-4 w-4 text-amber-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-amber-600">{lowStockItems}</div>
            <p className="text-xs text-amber-600">Items need restocking</p>
          </CardContent>
        </Card>

        <Card className="shadow-soft border-destructive/20">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Out of Stock</CardTitle>
            <TrendingDown className="h-4 w-4 text-destructive" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-destructive">{outOfStockItems}</div>
            <p className="text-xs text-destructive">Immediate attention needed</p>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card className="shadow-soft">
        <CardContent className="p-4">
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search inventory..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
              <SelectTrigger className="w-full lg:w-48">
                <SelectValue placeholder="All Categories" />
              </SelectTrigger>
              <SelectContent>
                {categories.map(category => (
                  <SelectItem key={category} value={category}>
                    {category === "all" ? "All Categories" : category}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={stockFilter} onValueChange={setStockFilter}>
              <SelectTrigger className="w-full lg:w-48">
                <SelectValue placeholder="Stock Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Items</SelectItem>
                <SelectItem value="normal">Normal Stock</SelectItem>
                <SelectItem value="low">Low Stock</SelectItem>
                <SelectItem value="outofstock">Out of Stock</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Inventory Table */}
      <Card className="shadow-soft">
        <CardHeader>
          <CardTitle>Inventory Items</CardTitle>
          <CardDescription>
            Current stock levels and item details
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {filteredInventory.map((item) => {
              const stockStatus = getStockStatus(item);
              const stockPercentage = (item.currentStock / item.maxStock) * 100;
              
              return (
                <div key={item.id} className="p-4 border rounded-lg space-y-3">
                  <div className="flex items-start justify-between">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <h3 className="font-semibold">{item.name}</h3>
                        <Badge variant="secondary" className="text-xs">
                          {item.category}
                        </Badge>
                        {stockStatus === "low" && (
                          <Badge variant="destructive" className="text-xs">
                            <AlertTriangle className="h-3 w-3 mr-1" />
                            Low Stock
                          </Badge>
                        )}
                        {stockStatus === "outofstock" && (
                          <Badge variant="destructive" className="text-xs">
                            Out of Stock
                          </Badge>
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground">
                        Supplier: {item.supplier || "N/A"}
                      </p>
                    </div>
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => setSelectedItem(item)}
                        >
                          <History className="h-4 w-4 mr-2" />
                          Adjust Stock
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Adjust Stock - {item.name}</DialogTitle>
                          <DialogDescription>
                            Increase or decrease stock levels for this item
                          </DialogDescription>
                        </DialogHeader>
                        <div className="space-y-4">
                          <div className="space-y-2">
                            <Label>Current Stock: {item.currentStock}</Label>
                            <div className="flex gap-2">
                              <Button
                                variant={adjustmentType === "increase" ? "default" : "outline"}
                                onClick={() => setAdjustmentType("increase")}
                                className="flex-1"
                              >
                                <Plus className="h-4 w-4 mr-2" />
                                Increase
                              </Button>
                              <Button
                                variant={adjustmentType === "decrease" ? "default" : "outline"}
                                onClick={() => setAdjustmentType("decrease")}
                                className="flex-1"
                              >
                                <Minus className="h-4 w-4 mr-2" />
                                Decrease
                              </Button>
                            </div>
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="quantity">Quantity</Label>
                            <Input
                              id="quantity"
                              type="number"
                              min="1"
                              value={adjustmentQuantity}
                              onChange={(e) => setAdjustmentQuantity(Number(e.target.value))}
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="reason">Reason (Optional)</Label>
                            <Textarea
                              id="reason"
                              placeholder="Enter reason for stock adjustment..."
                              value={adjustmentReason}
                              onChange={(e) => setAdjustmentReason(e.target.value)}
                            />
                          </div>
                        </div>
                        <DialogFooter>
                          <Button onClick={handleStockAdjustment}>
                            Apply Adjustment
                          </Button>
                        </DialogFooter>
                      </DialogContent>
                    </Dialog>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                    <div>
                      <p className="text-muted-foreground">Current Stock</p>
                      <p className="font-medium text-lg">{item.currentStock}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Min / Max</p>
                      <p className="font-medium">{item.minStock} / {item.maxStock}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Cost Price</p>
                      <p className="font-medium">{formatPrice(item.costPrice)}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Total Value</p>
                      <p className="font-bold text-primary">{formatPrice(item.totalValue)}</p>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span>Stock Level</span>
                      <span>{stockPercentage.toFixed(1)}% of capacity</span>
                    </div>
                    <Progress 
                      value={stockPercentage} 
                      className={`h-2 ${
                        stockStatus === "low" ? "text-destructive" :
                        stockStatus === "outofstock" ? "text-destructive" :
                        "text-primary"
                      }`}
                    />
                  </div>

                  <div className="text-xs text-muted-foreground">
                    Last restocked: {new Date(item.lastRestocked).toLocaleDateString()}
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}