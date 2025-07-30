import { ReactNode } from "react";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { Button } from "@/components/ui/button";
import { Bell, Search } from "lucide-react";
import madoLogo from "@/assets/mado-boutique-logo.png";

interface LayoutProps {
  children: ReactNode;
}

export function Layout({ children }: LayoutProps) {
  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-background">
        <AppSidebar />
        
        <div className="flex-1 flex flex-col">
          {/* Header */}
          <header className="h-16 border-b bg-card flex items-center justify-between px-4 lg:px-6 shadow-soft">
            <div className="flex items-center gap-4">
              <SidebarTrigger className="lg:hidden" />
              <div className="flex items-center gap-3">
                <img src={madoLogo} alt="Mado Boutique" className="h-8 w-auto" />
                <div className="hidden sm:block">
                  <h1 className="text-lg font-semibold text-foreground">Mado Boutique POS</h1>
                  <p className="text-xs text-muted-foreground">Point of Sale System</p>
                </div>
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="sm" className="hidden sm:flex">
                <Search className="h-4 w-4 mr-2" />
                Search
              </Button>
              <Button variant="ghost" size="sm">
                <Bell className="h-4 w-4" />
              </Button>
            </div>
          </header>
          
          {/* Main Content */}
          <main className="flex-1 p-4 lg:p-6 bg-muted/30">
            {children}
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}