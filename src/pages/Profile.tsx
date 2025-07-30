import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  Calendar,
  Shield,
  Edit,
  Camera
} from "lucide-react";
import { toast } from "@/hooks/use-toast";

export default function Profile() {
  const [isEditing, setIsEditing] = useState(false);
  const [profileData, setProfileData] = useState({
    name: "Admin User",
    email: "admin@madoboutique.com",
    phone: "+237 677 123 456",
    role: "Shop Owner",
    location: "Douala, Cameroon",
    joinDate: "January 2024"
  });

  const handleSaveProfile = () => {
    // Save profile logic here
    setIsEditing(false);
    toast({
      title: "Profile Updated",
      description: "Your profile information has been saved successfully",
    });
  };

  const handleChangePassword = () => {
    toast({
      title: "Password Change",
      description: "Password change functionality would be implemented here",
    });
  };

  const recentActivity = [
    { action: "Processed sale", details: "₣125,400 - 3 items", time: "2 hours ago" },
    { action: "Added product", details: "Summer Dress - Clothing", time: "4 hours ago" },
    { action: "Updated inventory", details: "Men's Sneakers - Stock adjustment", time: "1 day ago" },
    { action: "Generated report", details: "Weekly sales report", time: "2 days ago" },
    { action: "Low stock alert", details: "Women's Handbag below minimum", time: "3 days ago" }
  ];

  const salesStats = [
    { label: "Total Sales This Month", value: "₣3,450,000", change: "+23%" },
    { label: "Products Added", value: "45", change: "+12%" },
    { label: "Successful Transactions", value: "234", change: "+18%" },
    { label: "Customer Satisfaction", value: "4.8/5", change: "+0.2" }
  ];

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-bold text-foreground">Profile</h1>
        <p className="text-muted-foreground">
          Manage your account information and preferences
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Profile Information */}
        <div className="lg:col-span-2 space-y-6">
          <Card className="shadow-soft">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    <User className="h-5 w-5" />
                    Personal Information
                  </CardTitle>
                  <CardDescription>
                    Your account details and contact information
                  </CardDescription>
                </div>
                <Button 
                  variant="outline" 
                  onClick={() => setIsEditing(!isEditing)}
                >
                  <Edit className="h-4 w-4 mr-2" />
                  {isEditing ? "Cancel" : "Edit"}
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Profile Picture */}
              <div className="flex items-center gap-4">
                <div className="relative">
                  <Avatar className="w-20 h-20">
                    <AvatarImage src="" />
                    <AvatarFallback className="text-lg font-semibold bg-primary text-primary-foreground">
                      AU
                    </AvatarFallback>
                  </Avatar>
                  {isEditing && (
                    <Button 
                      size="sm" 
                      variant="outline" 
                      className="absolute -bottom-2 -right-2 w-8 h-8 rounded-full p-0"
                    >
                      <Camera className="h-3 w-3" />
                    </Button>
                  )}
                </div>
                <div>
                  <h3 className="text-lg font-semibold">{profileData.name}</h3>
                  <p className="text-muted-foreground">{profileData.role}</p>
                  <Badge variant="secondary" className="mt-1">
                    Active
                  </Badge>
                </div>
              </div>

              <Separator />

              {/* Form Fields */}
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="name">Full Name</Label>
                  <Input
                    id="name"
                    value={profileData.name}
                    onChange={(e) => setProfileData({...profileData, name: e.target.value})}
                    disabled={!isEditing}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="email">Email Address</Label>
                  <Input
                    id="email"
                    type="email"
                    value={profileData.email}
                    onChange={(e) => setProfileData({...profileData, email: e.target.value})}
                    disabled={!isEditing}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input
                    id="phone"
                    value={profileData.phone}
                    onChange={(e) => setProfileData({...profileData, phone: e.target.value})}
                    disabled={!isEditing}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="location">Location</Label>
                  <Input
                    id="location"
                    value={profileData.location}
                    onChange={(e) => setProfileData({...profileData, location: e.target.value})}
                    disabled={!isEditing}
                  />
                </div>
              </div>

              {isEditing && (
                <div className="flex gap-2">
                  <Button onClick={handleSaveProfile}>
                    Save Changes
                  </Button>
                  <Button variant="outline" onClick={() => setIsEditing(false)}>
                    Cancel
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Account Security */}
          <Card className="shadow-soft">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5" />
                Account Security
              </CardTitle>
              <CardDescription>
                Manage your password and security settings
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div>
                  <h4 className="font-medium">Password</h4>
                  <p className="text-sm text-muted-foreground">
                    Last changed 30 days ago
                  </p>
                </div>
                <Button variant="outline" onClick={handleChangePassword}>
                  Change Password
                </Button>
              </div>
              
              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div>
                  <h4 className="font-medium">Two-Factor Authentication</h4>
                  <p className="text-sm text-muted-foreground">
                    Add an extra layer of security
                  </p>
                </div>
                <Button variant="outline">
                  Enable 2FA
                </Button>
              </div>
              
              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div>
                  <h4 className="font-medium">Login Sessions</h4>
                  <p className="text-sm text-muted-foreground">
                    Manage active login sessions
                  </p>
                </div>
                <Button variant="outline">
                  View Sessions
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar - Stats and Activity */}
        <div className="space-y-6">
          {/* Account Info */}
          <Card className="shadow-soft">
            <CardHeader>
              <CardTitle className="text-lg">Account Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center gap-2 text-sm">
                <Mail className="h-4 w-4 text-muted-foreground" />
                <span>{profileData.email}</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <Phone className="h-4 w-4 text-muted-foreground" />
                <span>{profileData.phone}</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <MapPin className="h-4 w-4 text-muted-foreground" />
                <span>{profileData.location}</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <span>Joined {profileData.joinDate}</span>
              </div>
            </CardContent>
          </Card>

          {/* Performance Stats */}
          <Card className="shadow-soft">
            <CardHeader>
              <CardTitle className="text-lg">Performance This Month</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {salesStats.map((stat, index) => (
                <div key={index} className="space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">{stat.label}</span>
                    <Badge variant="secondary" className="text-xs">
                      {stat.change}
                    </Badge>
                  </div>
                  <p className="text-lg font-bold text-primary">{stat.value}</p>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Recent Activity */}
          <Card className="shadow-soft">
            <CardHeader>
              <CardTitle className="text-lg">Recent Activity</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {recentActivity.map((activity, index) => (
                  <div key={index} className="text-sm space-y-1">
                    <p className="font-medium">{activity.action}</p>
                    <p className="text-muted-foreground text-xs">{activity.details}</p>
                    <p className="text-muted-foreground text-xs">{activity.time}</p>
                    {index < recentActivity.length - 1 && <Separator className="mt-2" />}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}