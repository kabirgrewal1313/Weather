import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Cloud, Sun } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface AuthPageProps {
  onAuthSuccess: (token: string) => void;
}

const AuthPage = ({ onAuthSuccess }: AuthPageProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleAuth = async (endpoint: string, username: string, password: string) => {
    if (!username || !password) {
      toast({
        title: "Error",
        description: "Please fill in all fields",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    try {
      const formData = new FormData();
      formData.append('username', username);
      formData.append('password', password);

      const response = await fetch(`http://localhost:8000/${endpoint}`, {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();

      if (response.ok) {
        if (endpoint === 'login') {
          localStorage.setItem('weatherAppToken', data.access_token);
          onAuthSuccess(data.access_token);
          toast({
            title: "Success",
            description: "Logged in successfully!",
          });
        } else {
          toast({
            title: "Success",
            description: "Account created! Please log in.",
          });
        }
      } else {
        toast({
          title: "Error",
          description: data.detail || "Authentication failed",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Network error. Please check your connection.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const AuthForm = ({ type }: { type: 'login' | 'register' }) => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    return (
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleAuth(type, username, password);
        }}
        className="space-y-4"
      >
        <div className="space-y-2">
          <Input
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="glass-card text-white placeholder:text-white/70"
          />
        </div>
        <div className="space-y-2">
          <Input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="glass-card text-white placeholder:text-white/70"
          />
        </div>
        <Button
          type="submit"
          disabled={isLoading}
          className="w-full glass-card hover:bg-white/20 text-white font-medium"
        >
          {isLoading ? "Please wait..." : (type === 'login' ? "Sign In" : "Create Account")}
        </Button>
      </form>
    );
  };

  return (
    <div className="min-h-screen weather-sunny flex items-center justify-center p-4 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <Sun className="absolute top-20 right-20 w-20 h-20 text-yellow-300 sun-glow opacity-80" />
        <Cloud className="absolute top-32 left-16 w-16 h-16 text-white/60 cloud-float" />
        <Cloud className="absolute bottom-40 right-32 w-12 h-12 text-white/40 cloud-float" style={{ animationDelay: '2s' }} />
      </div>

      <Card className="w-full max-w-md glass-card border-white/20 backdrop-blur-lg">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold text-white flex items-center justify-center gap-2">
            <Cloud className="w-8 h-8" />
            Weather App
          </CardTitle>
          <CardDescription className="text-white/80">
            Get beautiful weather updates for any city
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="login" className="w-full">
            <TabsList className="grid w-full grid-cols-2 glass mb-6">
              <TabsTrigger value="login" className="text-white data-[state=active]:bg-white/20">
                Sign In
              </TabsTrigger>
              <TabsTrigger value="register" className="text-white data-[state=active]:bg-white/20">
                Sign Up
              </TabsTrigger>
            </TabsList>
            <TabsContent value="login" className="space-y-4">
              <AuthForm type="login" />
            </TabsContent>
            <TabsContent value="register" className="space-y-4">
              <AuthForm type="register" />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default AuthPage;