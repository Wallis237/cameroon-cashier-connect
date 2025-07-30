import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { 
  Store, 
  Palette, 
  DollarSign, 
  Bell, 
  Shield,
  Database,
  Download,
  Upload
} from "lucide-react";
import { toast } from "@/hooks/use-toast";

export default function Settings() {
  const [shopName, setShopName] = useState("Mado Boutique");
  const [currency, setCurrency] = useState("XAF");
  const [lowStockThreshold, setLowStockThreshold] = useState(5);
  const [enableNotifications, setEnableNotifications] = useState(true);
  const [enableSounds, setEnableSounds] = useState(false);
  const [autoBackup, setAutoBackup] = useState(true);
  const [theme, setTheme] = useState("light");

  const handleSaveSettings = () => {
    // Save settings logic here
    toast({
      title: "Settings Saved",
      description: "Your boutique settings have been updated successfully",
    });
  };

  const handleExportData = () => {
    toast({
      title: "Data Export Started",
      description: "Your data export will be ready for download shortly",
    });
  };

  const handleImportData = () => {
    toast({
      title: "Import Started",
      description: "Data import is being processed",
    });
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-bold text-foreground">Settings</h1>
        <p className="text-muted-foreground">
          Configure your boutique POS system preferences
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Shop Settings */}
        <Card className="shadow-soft">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Store className="h-5 w-5" />
              Shop Information
            </CardTitle>
            <CardDescription>
              Basic information about your boutique
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="shopName">Shop Name</Label>
              <Input
                id="shopName"
                value={shopName}
                onChange={(e) => setShopName(e.target.value)}
                placeholder="Enter your shop name"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="address">Address</Label>
              <Input
                id="address"
                placeholder="Enter your shop address"
                defaultValue="Douala, Cameroon"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="phone">Phone Number</Label>
              <Input
                id="phone"
                placeholder="+237 6XX XXX XXX"
                defaultValue="+237 677 123 456"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="shop@example.com"
                defaultValue="admin@madoboutique.com"
              />
            </div>
          </CardContent>
        </Card>

        {/* Currency & Financial Settings */}
        <Card className="shadow-soft">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <DollarSign className="h-5 w-5" />
              Currency & Pricing
            </CardTitle>
            <CardDescription>
              Configure currency and pricing preferences
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="currency">Default Currency</Label>
              <Select value={currency} onValueChange={setCurrency}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="XAF">₣ Central African CFA Franc (XAF)</SelectItem>
                  <SelectItem value="EUR">€ Euro (EUR)</SelectItem>
                  <SelectItem value="USD">$ US Dollar (USD)</SelectItem>
                  <SelectItem value="NGN">₦ Nigerian Naira (NGN)</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="taxRate">Tax Rate (%)</Label>
              <Input
                id="taxRate"
                type="number"
                placeholder="0"
                defaultValue="19.25"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="lowStockThreshold">Low Stock Alert Threshold</Label>
              <Input
                id="lowStockThreshold"
                type="number"
                value={lowStockThreshold}
                onChange={(e) => setLowStockThreshold(Number(e.target.value))}
                placeholder="5"
              />
            </div>
          </CardContent>
        </Card>

        {/* Appearance Settings */}
        <Card className="shadow-soft">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Palette className="h-5 w-5" />
              Appearance
            </CardTitle>
            <CardDescription>
              Customize the look and feel of your POS
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="theme">Theme</Label>
              <Select value={theme} onValueChange={setTheme}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="light">Light Mode</SelectItem>
                  <SelectItem value="dark">Dark Mode</SelectItem>
                  <SelectItem value="auto">System Default</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="language">Language</Label>
              <Select defaultValue="en">
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="en">English</SelectItem>
                  <SelectItem value="fr">Français</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="dateFormat">Date Format</Label>
              <Select defaultValue="dd/mm/yyyy">
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="dd/mm/yyyy">DD/MM/YYYY</SelectItem>
                  <SelectItem value="mm/dd/yyyy">MM/DD/YYYY</SelectItem>
                  <SelectItem value="yyyy-mm-dd">YYYY-MM-DD</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Notifications */}
        <Card className="shadow-soft">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Bell className="h-5 w-5" />
              Notifications
            </CardTitle>
            <CardDescription>
              Configure alert and notification preferences
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="notifications">Enable Notifications</Label>
                <p className="text-sm text-muted-foreground">
                  Receive alerts for important events
                </p>
              </div>
              <Switch
                id="notifications"
                checked={enableNotifications}
                onCheckedChange={setEnableNotifications}
              />
            </div>
            
            <Separator />
            
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="sounds">Sound Alerts</Label>
                <p className="text-sm text-muted-foreground">
                  Play sounds for sale completions
                </p>
              </div>
              <Switch
                id="sounds"
                checked={enableSounds}
                onCheckedChange={setEnableSounds}
              />
            </div>
            
            <Separator />
            
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="lowStockAlerts">Low Stock Alerts</Label>
                <p className="text-sm text-muted-foreground">
                  Get notified when items run low
                </p>
              </div>
              <Switch id="lowStockAlerts" defaultChecked />
            </div>
          </CardContent>
        </Card>

        {/* Data Management */}
        <Card className="shadow-soft">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Database className="h-5 w-5" />
              Data Management
            </CardTitle>
            <CardDescription>
              Backup, export, and import your data
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="autoBackup">Automatic Backup</Label>
                <p className="text-sm text-muted-foreground">
                  Daily backup of your data
                </p>
              </div>
              <Switch
                id="autoBackup"
                checked={autoBackup}
                onCheckedChange={setAutoBackup}
              />
            </div>
            
            <Separator />
            
            <div className="flex gap-2">
              <Button variant="outline" className="flex-1" onClick={handleExportData}>
                <Download className="h-4 w-4 mr-2" />
                Export Data
              </Button>
              <Button variant="outline" className="flex-1" onClick={handleImportData}>
                <Upload className="h-4 w-4 mr-2" />
                Import Data
              </Button>
            </div>
            
            <div className="text-sm text-muted-foreground">
              Last backup: Today at 2:30 AM
            </div>
          </CardContent>
        </Card>

        {/* Security */}
        <Card className="shadow-soft">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5" />
              Security
            </CardTitle>
            <CardDescription>
              Manage security and access settings
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="sessionTimeout">Auto Logout</Label>
                <p className="text-sm text-muted-foreground">
                  Automatically logout after inactivity
                </p>
              </div>
              <Switch id="sessionTimeout" defaultChecked />
            </div>
            
            <Separator />
            
            <div className="space-y-2">
              <Label htmlFor="sessionDuration">Session Duration (minutes)</Label>
              <Input
                id="sessionDuration"
                type="number"
                defaultValue="30"
                placeholder="30"
              />
            </div>
            
            <Separator />
            
            <Button variant="outline" className="w-full">
              Change Password
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Save Button */}
      <div className="flex justify-end">
        <Button onClick={handleSaveSettings} size="lg">
          Save All Settings
        </Button>
      </div>
    </div>
  );
}