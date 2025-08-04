import { 
  LayoutDashboard, 
  Package, 
  ShoppingCart, 
  BarChart3, 
  Settings, 
  User,
  AlertTriangle,
  Plus,
  Eye,
  LogOut
} from "lucide-react";
import { NavLink, useLocation } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "@/hooks/use-toast";
import { useTranslation } from "@/hooks/useTranslation";

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarHeader,
  SidebarFooter,
  useSidebar,
} from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

const getMainItems = (t: (key: string) => string) => [
  { title: t("Dashboard"), url: "/dashboard", icon: LayoutDashboard },
  { title: t("Inventory"), url: "/inventory", icon: Package },
  { title: t("Sales"), url: "/sales", icon: ShoppingCart },
  { title: t("Reports"), url: "/reports", icon: BarChart3 },
];

const getQuickActions = (t: (key: string) => string) => [
  { title: t("Add Product"), url: "/products", icon: Plus },
  { title: "View Stock", url: "/inventory", icon: Eye },
  { title: "Low Stock", url: "/inventory?filter=low", icon: AlertTriangle },
];

const getSettingsItems = (t: (key: string) => string) => [
  { title: t("Settings"), url: "/settings", icon: Settings },
  { title: t("Profile"), url: "/profile", icon: User },
];

export function AppSidebar() {
  const { state } = useSidebar();
  const location = useLocation();
  const currentPath = location.pathname;
  const collapsed = state === "collapsed";
  const { signOut, user } = useAuth();
  const { t } = useTranslation();
  
  const mainItems = getMainItems(t);
  const quickActions = getQuickActions(t);
  const settingsItems = getSettingsItems(t);

  const handleSignOut = async () => {
    await signOut();
    toast({
      title: "Signed out successfully",
      description: "You have been logged out of your account",
    });
  };

  const isActive = (path: string) => currentPath === path;
  
  const getNavClasses = (path: string) => {
    const base = "w-full justify-start transition-colors duration-200";
    const active = "bg-primary text-primary-foreground shadow-sm";
    const inactive = "hover:bg-accent hover:text-accent-foreground";
    return `${base} ${isActive(path) ? active : inactive}`;
  };

  return (
    <Sidebar className="border-r" collapsible="icon">
      <SidebarHeader className={collapsed ? "p-2" : "p-4"}>
        {!collapsed && (
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-primary rounded-lg flex items-center justify-center">
              <Package className="h-4 w-4 text-white" />
            </div>
            <div>
              <p className="text-sm font-semibold">Mado Boutique</p>
              <p className="text-xs text-muted-foreground">POS System</p>
            </div>
          </div>
        )}
      </SidebarHeader>

      <SidebarContent>
        {/* Main Navigation */}
        <SidebarGroup>
          <SidebarGroupLabel className={collapsed ? "sr-only" : ""}>
            Main Menu
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {mainItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <NavLink 
                      to={item.url} 
                      className={getNavClasses(item.url)}
                    >
                      <item.icon className="h-4 w-4" />
                      {!collapsed && <span className="ml-2">{item.title}</span>}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* Quick Actions */}
        <SidebarGroup>
          <SidebarGroupLabel className={collapsed ? "sr-only" : ""}>
            Quick Actions
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {quickActions.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <NavLink 
                      to={item.url} 
                      className={getNavClasses(item.url)}
                    >
                      <item.icon className="h-4 w-4" />
                      {!collapsed && (
                        <div className="flex items-center justify-between flex-1 ml-2">
                          <span>{item.title}</span>
                          {item.title === "Low Stock" && (
                            <Badge variant="destructive" className="text-xs">3</Badge>
                          )}
                        </div>
                      )}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* Settings */}
        <SidebarGroup>
          <SidebarGroupLabel className={collapsed ? "sr-only" : ""}>
            Account
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {settingsItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <NavLink 
                      to={item.url} 
                      className={getNavClasses(item.url)}
                    >
                      <item.icon className="h-4 w-4" />
                      {!collapsed && <span className="ml-2">{item.title}</span>}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className={collapsed ? "p-2" : "p-4"}>
        {!collapsed ? (
          <div className="space-y-2">
            <Button variant="outline" size="sm" className="w-full">
              <User className="h-4 w-4 mr-2" />
              {user?.email?.split('@')[0] || 'Admin'}
            </Button>
            <Button 
              variant="ghost" 
              size="sm" 
              className="w-full text-muted-foreground hover:text-destructive"
              onClick={handleSignOut}
            >
              <LogOut className="h-4 w-4 mr-2" />
              Sign Out
            </Button>
          </div>
        ) : (
          <Button 
            variant="ghost" 
            size="sm" 
            className="w-full p-2"
            onClick={handleSignOut}
          >
            <LogOut className="h-4 w-4" />
          </Button>
        )}
      </SidebarFooter>
    </Sidebar>
  );
}