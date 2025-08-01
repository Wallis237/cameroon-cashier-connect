import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";
import { Eye, EyeOff } from "lucide-react";
import madoLogo from "@/assets/mado-boutique-logo.png";

export default function Login() {
  const [isLoading, setIsLoading] = useState(false);
  const [loginForm, setLoginForm] = useState({ email: "", password: "" });
  const [registerForm, setRegisterForm] = useState({ 
    shopName: "", 
    email: "", 
    password: "", 
    phone: "" 
  });
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [forgotPasswordEmail, setForgotPasswordEmail] = useState("");
  const [showLoginPassword, setShowLoginPassword] = useState(false);
  const [showRegisterPassword, setShowRegisterPassword] = useState(false);
  const navigate = useNavigate();
  const { signIn, signUp, resetPassword, user } = useAuth();

  useEffect(() => {
    if (user) {
      navigate("/dashboard");
    }
  }, [user, navigate]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    const { error } = await signIn(loginForm.email, loginForm.password);
    
    if (error) {
      toast({
        title: "Login Failed",
        description: error.message,
        variant: "destructive",
      });
    } else {
      toast({
        title: "Welcome back!",
        description: "Successfully logged into your boutique POS",
      });
      navigate("/dashboard");
    }
    
    setIsLoading(false);
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    const { error } = await signUp(
      registerForm.email, 
      registerForm.password, 
      registerForm.shopName,
      registerForm.phone
    );
    
    if (error) {
      toast({
        title: "Registration Failed",
        description: error.message,
        variant: "destructive",
      });
    } else {
      toast({
        title: "Account created!",
        description: "Your boutique POS account has been set up successfully. Please check your email to verify your account.",
      });
    }
    
    setIsLoading(false);
  };

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    const { error } = await resetPassword(forgotPasswordEmail);
    
    if (error) {
      toast({
        title: "Password Reset Failed",
        description: error.message,
        variant: "destructive",
      });
    } else {
      toast({
        title: "Password Reset Email Sent",
        description: "Please check your email for password reset instructions.",
      });
      setShowForgotPassword(false);
      setForgotPasswordEmail("");
    }
    
    setIsLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/10 via-background to-secondary/10 p-4">
      <div className="w-full max-w-md">
        <Card className="shadow-medium">
          <CardHeader className="text-center pb-8">
            <div className="flex justify-center mb-4">
              <img src={madoLogo} alt="Mado Boutique" className="h-16 w-auto" />
            </div>
            <CardTitle className="text-2xl">Mado Boutique POS</CardTitle>
            <CardDescription>
              Point of Sale System for Modern Boutiques
            </CardDescription>
          </CardHeader>
          
          <CardContent>
            <Tabs defaultValue="login" className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="login">Login</TabsTrigger>
                <TabsTrigger value="register">Register</TabsTrigger>
              </TabsList>
              
              <TabsContent value="login">
                <form onSubmit={handleLogin} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="admin@madoboutique.com"
                      value={loginForm.email}
                      onChange={(e) => setLoginForm(prev => ({ ...prev, email: e.target.value }))}
                      required
                    />
                  </div>
                   <div className="space-y-2">
                     <Label htmlFor="password">Password</Label>
                     <div className="relative">
                       <Input
                         id="password"
                         type={showLoginPassword ? "text" : "password"}
                         placeholder="Enter your password"
                         value={loginForm.password}
                         onChange={(e) => setLoginForm(prev => ({ ...prev, password: e.target.value }))}
                         required
                         className="pr-10"
                       />
                       <button
                         type="button"
                         onClick={() => setShowLoginPassword(!showLoginPassword)}
                         className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                       >
                         {showLoginPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                       </button>
                     </div>
                    </div>
                   <div className="text-center">
                     <Button
                       type="button"
                       variant="link"
                       onClick={() => setShowForgotPassword(true)}
                       className="text-sm"
                     >
                       Forgot password?
                     </Button>
                   </div>
                   <Button 
                     type="submit" 
                     className="w-full" 
                     disabled={isLoading}
                   >
                     {isLoading ? "Signing in..." : "Sign In"}
                   </Button>
                   
                   {showForgotPassword && (
                     <Card className="mt-4 border-muted">
                       <CardContent className="pt-4">
                         <form onSubmit={handleForgotPassword} className="space-y-3">
                           <div className="space-y-2">
                             <Label htmlFor="forgotEmail">Email for password reset</Label>
                             <Input
                               id="forgotEmail"
                               type="email"
                               placeholder="Enter your email"
                               value={forgotPasswordEmail}
                               onChange={(e) => setForgotPasswordEmail(e.target.value)}
                               required
                             />
                           </div>
                           <div className="flex gap-2">
                             <Button 
                               type="submit" 
                               size="sm"
                               disabled={isLoading}
                               className="flex-1"
                             >
                               {isLoading ? "Sending..." : "Send Reset Email"}
                             </Button>
                             <Button 
                               type="button" 
                               variant="outline"
                               size="sm"
                               onClick={() => setShowForgotPassword(false)}
                               className="flex-1"
                             >
                               Cancel
                             </Button>
                           </div>
                         </form>
                       </CardContent>
                     </Card>
                   )}
                </form>
              </TabsContent>
              
              <TabsContent value="register">
                <form onSubmit={handleRegister} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="shopName">Shop Name</Label>
                    <Input
                      id="shopName"
                      placeholder="Mado Boutique"
                      value={registerForm.shopName}
                      onChange={(e) => setRegisterForm(prev => ({ ...prev, shopName: e.target.value }))}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="registerEmail">Email</Label>
                    <Input
                      id="registerEmail"
                      type="email"
                      placeholder="admin@madoboutique.com"
                      value={registerForm.email}
                      onChange={(e) => setRegisterForm(prev => ({ ...prev, email: e.target.value }))}
                      required
                    />
                  </div>
                   <div className="space-y-2">
                     <Label htmlFor="registerPassword">Password</Label>
                     <div className="relative">
                       <Input
                         id="registerPassword"
                         type={showRegisterPassword ? "text" : "password"}
                         placeholder="Create a secure password"
                         value={registerForm.password}
                         onChange={(e) => setRegisterForm(prev => ({ ...prev, password: e.target.value }))}
                         required
                         className="pr-10"
                       />
                       <button
                         type="button"
                         onClick={() => setShowRegisterPassword(!showRegisterPassword)}
                         className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                       >
                         {showRegisterPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                       </button>
                     </div>
                   </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone Number</Label>
                    <Input
                      id="phone"
                      type="tel"
                      placeholder="+237 6XX XXX XXX"
                      value={registerForm.phone}
                      onChange={(e) => setRegisterForm(prev => ({ ...prev, phone: e.target.value }))}
                    />
                  </div>
                  <Button 
                    type="submit" 
                    className="w-full" 
                    disabled={isLoading}
                  >
                    {isLoading ? "Creating Account..." : "Create Account"}
                  </Button>
                </form>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}