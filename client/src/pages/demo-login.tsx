import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { TrendingUp } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";

export default function DemoLogin() {
  const [username, setUsername] = useState("natalia");
  const [password, setPassword] = useState("1234");
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleDemoLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await apiRequest("/api/demo-login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      if (response.success) {
        toast({
          title: "Success",
          description: "Demo login successful! Redirecting...",
        });

        // Redirect to dashboard
        setTimeout(() => {
          window.location.href = "/";
        }, 1000);
      } else {
        throw new Error("Login failed");
      }
    } catch (error: any) {
      toast({
        title: "Login Failed",
        description: error.message || "Invalid credentials",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-blue-50 to-purple-50 dark:from-gray-900 dark:via-blue-900 dark:to-purple-900 flex items-center justify-center">
      <div className="w-full max-w-md p-6">
        <Card className="bg-white/70 dark:bg-black/30 backdrop-blur-md border-white/20">
          <CardHeader className="text-center">
            <div className="w-12 h-12 rounded-lg bg-gradient-to-r from-orange-500 to-blue-500 flex items-center justify-center mx-auto mb-4">
              <TrendingUp className="w-6 h-6 text-white" />
            </div>
            <CardTitle className="text-2xl bg-gradient-to-r from-orange-600 to-blue-600 bg-clip-text text-transparent">
              Demo Login
            </CardTitle>
            <CardDescription>
              Test the Financial Forecast application
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleDemoLogin} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="username">Username</Label>
                <Input
                  id="username"
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Enter username"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter password"
                  required
                />
              </div>
              <Button 
                type="submit" 
                className="w-full bg-gradient-to-r from-orange-500 to-blue-500 hover:from-orange-600 hover:to-blue-600"
                disabled={isLoading}
              >
                {isLoading ? "Logging in..." : "Login"}
              </Button>
            </form>
            
            <div className="mt-6 text-center">
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                Demo Credentials:
              </p>
              <p className="text-sm font-mono bg-gray-100 dark:bg-gray-800 p-2 rounded">
                Username: natalia<br />
                Password: 1234
              </p>
            </div>

            <div className="mt-4 text-center">
              <Button 
                variant="ghost"
                onClick={() => window.location.href = '/'}
                className="text-sm"
              >
                ← Back to Home
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}