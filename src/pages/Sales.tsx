import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { 
  Search, 
  Plus, 
  Minus, 
  ShoppingCart, 
  Receipt,
  X,
  Package,
  Scan
} from "lucide-react";
import { formatPrice } from "@/lib/currency";
import { toast } from "@/hooks/use-toast";
import { QRScanner } from "@/components/QRScanner";
import { useProducts } from "@/hooks/useProducts";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { useTranslation } from "@/hooks/useTranslation";

interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  category: string;
}

export default function Sales() {
  const [searchTerm, setSearchTerm] = useState("");
  const [cart, setCart] = useState<CartItem[]>([]);
  const [discount, setDiscount] = useState(0);
  const [customerName, setCustomerName] = useState("");
  const [showScanner, setShowScanner] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const { products, updateStock } = useProducts();
  const { user } = useAuth();
  const { t } = useTranslation();

  const filteredProducts = products.filter(product =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const addToCart = (product: any) => {
    if (product.quantity === 0) {
      toast({
        title: "Out of Stock",
        description: `${product.name} is currently out of stock`,
        variant: "destructive",
      });
      return;
    }

    setCart(prev => {
      const existingItem = prev.find(item => item.id === product.id);
      if (existingItem) {
        if (existingItem.quantity >= product.quantity) {
          toast({
            title: "Stock Limit Reached",
            description: `Cannot add more ${product.name}. Only ${product.quantity} in stock.`,
            variant: "destructive",
          });
          return prev;
        }
        return prev.map(item =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [...prev, { 
        id: product.id,
        name: product.name,
        price: product.selling_price,
        quantity: 1,
        category: product.category
      }];
    });
  };

  const updateQuantity = (id: string, quantity: number) => {
    if (quantity === 0) {
      setCart(prev => prev.filter(item => item.id !== id));
      return;
    }

    setCart(prev =>
      prev.map(item => {
        if (item.id === id) {
          const product = products.find(p => p.id === id);
          if (product && quantity > product.quantity) {
            toast({
              title: "Stock Limit",
              description: `Only ${product.quantity} items available`,
              variant: "destructive",
            });
            return item;
          }
          return { ...item, quantity };
        }
        return item;
      })
    );
  };

  const removeFromCart = (id: string) => {
    setCart(prev => prev.filter(item => item.id !== id));
  };

  const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const discountAmount = (subtotal * discount) / 100;
  const total = subtotal - discountAmount;

  const handleQRScan = (qrData: string) => {
    console.log('QR data scanned:', qrData);
    
    // Try multiple matching strategies
    let product = null;
    
    // 1. Try exact barcode match
    product = products.find(p => p.barcode === qrData);
    
    // 2. Try product ID match
    if (!product) {
      product = products.find(p => p.id === qrData);
    }
    
    // 3. Try partial name match (case insensitive)
    if (!product) {
      product = products.find(p => 
        p.name.toLowerCase().includes(qrData.toLowerCase()) ||
        qrData.toLowerCase().includes(p.name.toLowerCase())
      );
    }
    
    // 4. Try barcode partial match
    if (!product && qrData.length > 5) {
      product = products.find(p => 
        p.barcode && (
          p.barcode.includes(qrData) || 
          qrData.includes(p.barcode)
        )
      );
    }
    
    if (product) {
      addToCart(product);
      toast({
        title: "Product Added!",
        description: `${product.name} added to cart via QR scan`,
      });
    } else {
      toast({
        title: "Product Not Found",
        description: `No product found for: ${qrData}. Try adding the product manually.`,
        variant: "destructive",
      });
    }
  };

  const handleSale = async () => {
    if (cart.length === 0) {
      toast({
        title: "Empty Cart",
        description: "Please add items to cart before processing sale",
        variant: "destructive",
      });
      return;
    }

    setIsProcessing(true);
    
    try {
      if (user) {
        // Record sale in database if authenticated
        const { error: salesError } = await supabase
          .from('sales')
          .insert({
            user_id: user.id,
            customer_name: customerName || null,
            items: cart as any,
            subtotal: subtotal,
            discount: discountAmount,
            total: total,
          });

        if (salesError) throw salesError;
      }

      // Update product quantities
      for (const item of cart) {
        await updateStock(item.id, -item.quantity);
      }

      toast({
        title: "Sale Completed!",
        description: `Total: ${formatPrice(total)}${!user ? ' (demo mode)' : ' - Receipt saved successfully'}`,
      });

      // Clear cart and reset form
      setCart([]);
      setDiscount(0);
      setCustomerName("");
    } catch (error) {
      console.error('Error processing sale:', error);
      toast({
        title: "Error",
        description: "Failed to process sale. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-bold text-foreground">{t('Sales')}</h1>
        <p className="text-muted-foreground">
          Select products and process customer purchases
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Product Selection */}
        <div className="lg:col-span-2 space-y-4">
          {/* Search */}
          <Card className="shadow-soft">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Package className="h-5 w-5" />
                Select Products
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="relative">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search products by name or category..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
                
                <Button
                  variant="outline"
                  onClick={() => setShowScanner(true)}
                  className="w-full"
                >
                  <Scan className="h-4 w-4 mr-2" />
                  Scan QR Code
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Products Grid */}
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {filteredProducts.map((product) => {
              const cartItem = cart.find(item => item.id === product.id);
              const inCart = cartItem?.quantity || 0;
              
              return (
                <Card key={product.id} className="shadow-soft hover:shadow-medium transition-shadow">
                  <CardContent className="p-4">
                    <div className="space-y-3">
                      <div>
                        <h3 className="font-semibold text-sm">{product.name}</h3>
                        <Badge variant="secondary" className="text-xs mt-1">
                          {product.category}
                        </Badge>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-primary">
                          {formatPrice(product.selling_price)}
                        </span>
                        <span className={`text-xs ${product.quantity < 5 ? 'text-destructive' : 'text-muted-foreground'}`}>
                          {product.quantity} in stock
                        </span>
                      </div>

                      {inCart > 0 ? (
                        <div className="flex items-center justify-between bg-muted/50 rounded-lg p-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => updateQuantity(product.id, inCart - 1)}
                          >
                            <Minus className="h-3 w-3" />
                          </Button>
                          <span className="font-medium text-sm">{inCart}</span>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => updateQuantity(product.id, inCart + 1)}
                            disabled={inCart >= product.quantity}
                          >
                            <Plus className="h-3 w-3" />
                          </Button>
                        </div>
                      ) : (
                        <Button
                          size="sm"
                          className="w-full"
                          onClick={() => addToCart(product)}
                          disabled={product.quantity === 0}
                        >
                          {product.quantity === 0 ? 'Out of Stock' : 'Add to Cart'}
                        </Button>
                      )}
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>

        {/* Shopping Cart */}
        <div className="space-y-4">
          <Card className="shadow-soft">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <ShoppingCart className="h-5 w-5" />
                Cart ({cart.length})
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Customer Name */}
              <div className="space-y-2">
                <Label htmlFor="customer">Customer Name (Optional)</Label>
                <Input
                  id="customer"
                  placeholder="Enter customer name"
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                />
              </div>

              <Separator />

              {/* Cart Items */}
              <div className="space-y-3 max-h-64 overflow-y-auto">
                {cart.length === 0 ? (
                  <p className="text-muted-foreground text-sm text-center py-4">
                    Cart is empty
                  </p>
                ) : (
                  cart.map((item) => (
                    <div key={item.id} className="flex items-center justify-between p-2 border rounded-lg">
                      <div className="flex-1">
                        <p className="font-medium text-sm">{item.name}</p>
                        <p className="text-xs text-muted-foreground">
                          {formatPrice(item.price)} x {item.quantity}
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-sm">
                          {formatPrice(item.price * item.quantity)}
                        </span>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => removeFromCart(item.id)}
                        >
                          <X className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                  ))
                )}
              </div>

              {cart.length > 0 && (
                <>
                  <Separator />

                  {/* Discount */}
                  <div className="space-y-2">
                    <Label htmlFor="discount">Discount (%)</Label>
                    <Input
                      id="discount"
                      type="number"
                      min="0"
                      max="100"
                      placeholder="0"
                      value={discount || ''}
                      onChange={(e) => setDiscount(Number(e.target.value) || 0)}
                    />
                  </div>

                  <Separator />

                  {/* Order Summary */}
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Subtotal:</span>
                      <span>{formatPrice(subtotal)}</span>
                    </div>
                    {discount > 0 && (
                      <div className="flex justify-between text-sm text-primary">
                        <span>Discount ({discount}%):</span>
                        <span>-{formatPrice(discountAmount)}</span>
                      </div>
                    )}
                    <div className="flex justify-between font-bold text-lg">
                      <span>Total:</span>
                      <span>{formatPrice(total)}</span>
                    </div>
                  </div>

                  <Button
                    className="w-full"
                    onClick={handleSale}
                    size="lg"
                    disabled={isProcessing}
                  >
                    <Receipt className="h-4 w-4 mr-2" />
                    {isProcessing ? "Processing Sale..." : "Complete Sale"}
                  </Button>
                </>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
      
      {/* QR Scanner Modal */}
      <QRScanner
        isOpen={showScanner}
        onClose={() => setShowScanner(false)}
        onScan={handleQRScan}
        title="Scan Product QR Code"
      />
    </div>
  );
}