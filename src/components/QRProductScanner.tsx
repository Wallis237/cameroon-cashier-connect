import { useState } from "react";
import { QRScanner } from "./QRScanner";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Scan, Loader2 } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { useProducts } from "@/hooks/useProducts";

interface QRProductScannerProps {
  isOpen: boolean;
  onClose: () => void;
}

export function QRProductScanner({ isOpen, onClose }: QRProductScannerProps) {
  const [showScanner, setShowScanner] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { addProduct } = useProducts();
  
  const [formData, setFormData] = useState({
    name: "",
    category: "",
    cost_price: "",
    selling_price: "",
    quantity: "1",
    low_stock_threshold: "5",
    barcode: "",
    description: ""
  });

  const resetForm = () => {
    setFormData({
      name: "",
      category: "",
      cost_price: "",
      selling_price: "",
      quantity: "1",
      low_stock_threshold: "5",
      barcode: "",
      description: ""
    });
  };

  const handleQRScan = (qrData: string) => {
    // Try to parse QR data as JSON (if it contains product info)
    try {
      const productInfo = JSON.parse(qrData);
      if (productInfo.name) {
        setFormData(prev => ({
          ...prev,
          name: productInfo.name || "",
          category: productInfo.category || "",
          cost_price: productInfo.cost_price?.toString() || "",
          selling_price: productInfo.selling_price?.toString() || "",
          quantity: productInfo.quantity?.toString() || "1",
          barcode: productInfo.barcode || qrData,
          description: productInfo.description || ""
        }));
        toast({
          title: "Product Info Scanned",
          description: `Product: ${productInfo.name}`,
        });
      } else {
        throw new Error("Not product JSON");
      }
    } catch {
      // If not JSON, treat as barcode
      setFormData(prev => ({ ...prev, barcode: qrData }));
      toast({
        title: "Barcode Scanned",
        description: `Barcode: ${qrData}`,
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.category || !formData.cost_price || !formData.selling_price) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);
    try {
      const productData = {
        name: formData.name,
        category: formData.category,
        cost_price: parseFloat(formData.cost_price),
        selling_price: parseFloat(formData.selling_price),
        quantity: parseInt(formData.quantity),
        low_stock_threshold: parseInt(formData.low_stock_threshold),
        barcode: formData.barcode || undefined,
        description: formData.description || undefined,
      };

      await addProduct(productData);
      resetForm();
      onClose();
    } catch (error) {
      console.error('Error adding product:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Add Product via QR Scan</DialogTitle>
          </DialogHeader>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-4">
              <div>
                <Label htmlFor="barcode">Barcode</Label>
                <div className="flex gap-2">
                  <Input
                    id="barcode"
                    value={formData.barcode}
                    onChange={(e) => setFormData(prev => ({ ...prev, barcode: e.target.value }))}
                    placeholder="Scan QR code first"
                    readOnly
                  />
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setShowScanner(true)}
                  >
                    <Scan className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              <div>
                <Label htmlFor="name">Product Name *</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                  required
                />
              </div>
              
              <div>
                <Label htmlFor="category">Category *</Label>
                <Select 
                  value={formData.category} 
                  onValueChange={(value) => setFormData(prev => ({ ...prev, category: value }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Clothing">Clothing</SelectItem>
                    <SelectItem value="Accessories">Accessories</SelectItem>
                    <SelectItem value="Footwear">Footwear</SelectItem>
                    <SelectItem value="Electronics">Electronics</SelectItem>
                    <SelectItem value="Home & Garden">Home & Garden</SelectItem>
                    <SelectItem value="Beauty">Beauty</SelectItem>
                    <SelectItem value="Sports">Sports</SelectItem>
                    <SelectItem value="Other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="cost_price">Cost Price *</Label>
                  <Input
                    id="cost_price"
                    type="number"
                    step="0.01"
                    value={formData.cost_price}
                    onChange={(e) => setFormData(prev => ({ ...prev, cost_price: e.target.value }))}
                    required
                  />
                </div>
                
                <div>
                  <Label htmlFor="selling_price">Selling Price *</Label>
                  <Input
                    id="selling_price"
                    type="number"
                    step="0.01"
                    value={formData.selling_price}
                    onChange={(e) => setFormData(prev => ({ ...prev, selling_price: e.target.value }))}
                    required
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="quantity">Quantity *</Label>
                  <Input
                    id="quantity"
                    type="number"
                    value={formData.quantity}
                    onChange={(e) => setFormData(prev => ({ ...prev, quantity: e.target.value }))}
                    required
                  />
                </div>
                
                <div>
                  <Label htmlFor="low_stock_threshold">Low Stock Alert</Label>
                  <Input
                    id="low_stock_threshold"
                    type="number"
                    value={formData.low_stock_threshold}
                    onChange={(e) => setFormData(prev => ({ ...prev, low_stock_threshold: e.target.value }))}
                  />
                </div>
              </div>
              
              <div>
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="Optional product description"
                  rows={3}
                />
              </div>
            </div>
            
            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  resetForm();
                  onClose();
                }}
                disabled={isSubmitting}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting || !formData.barcode}>
                {isSubmitting ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Adding...
                  </>
                ) : (
                  "Add Product"
                )}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <QRScanner
        isOpen={showScanner}
        onClose={() => setShowScanner(false)}
        onScan={handleQRScan}
        title="Scan Product QR Code"
      />
    </>
  );
}