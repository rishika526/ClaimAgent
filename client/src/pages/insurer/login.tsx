import { useState } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { ShieldCheck } from "lucide-react";
import { toast } from "@/hooks/use-toast";

export default function InsurerLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [, setLocation] = useLocation();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (email === "insurer@claimagent.com" && password === "admin123") {
      toast({ title: "Login Successful" });
      setLocation("/insurer");
    } else {
      toast({ title: "Invalid Credentials", description: "Use demo credentials: insurer@claimagent.com / admin123", variant: "destructive" });
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 flex flex-col items-center justify-center p-4 relative overflow-hidden">
      {/* Background Decor */}
      <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-primary/20 rounded-full blur-3xl"></div>
      <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] bg-blue-600/20 rounded-full blur-3xl"></div>

      <div className="w-full max-w-md relative z-10">
        <div className="flex flex-col items-center justify-center gap-3 text-white mb-10">
          <div className="bg-white/10 p-4 rounded-2xl backdrop-blur-sm border border-white/10">
            <ShieldCheck size={48} className="text-primary" />
          </div>
          <h1 className="text-4xl font-bold tracking-tight">ClaimAgent</h1>
        </div>
        
        <Card className="border border-slate-800 bg-slate-900/80 backdrop-blur-xl shadow-2xl text-white">
          <CardHeader className="space-y-2 text-center pb-8">
            <CardTitle className="text-2xl font-bold">Insurer Portal</CardTitle>
            <CardDescription className="text-slate-400">Enter your credentials to access the dashboard</CardDescription>
          </CardHeader>
          <form onSubmit={handleLogin}>
            <CardContent className="space-y-6">
              <div className="space-y-3">
                <Label htmlFor="email" className="text-slate-300">Email Address</Label>
                <Input 
                  id="email" 
                  type="email" 
                  placeholder="insurer@claimagent.com" 
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  className="bg-slate-800/50 border-slate-700 text-white placeholder:text-slate-500 h-12"
                  required
                />
              </div>
              <div className="space-y-3">
                <Label htmlFor="password" className="text-slate-300">Password</Label>
                <Input 
                  id="password" 
                  type="password" 
                  placeholder="••••••••"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  className="bg-slate-800/50 border-slate-700 text-white placeholder:text-slate-500 h-12"
                  required
                />
              </div>
            </CardContent>
            <CardFooter className="pt-4">
              <Button type="submit" className="w-full text-lg h-14 bg-primary hover:bg-primary/90 text-white font-semibold">Login to Dashboard</Button>
            </CardFooter>
          </form>
        </Card>
        
        <div className="mt-8 p-4 rounded-xl bg-slate-800/50 border border-slate-700 text-center text-slate-300 text-sm backdrop-blur-sm">
          <p className="font-semibold text-white mb-2">Demo Credentials:</p>
          <p className="flex justify-between px-4"><span className="text-slate-400">Email:</span> <span className="font-mono text-primary-foreground bg-slate-900 px-2 py-0.5 rounded">insurer@claimagent.com</span></p>
          <p className="flex justify-between px-4 mt-2"><span className="text-slate-400">Password:</span> <span className="font-mono text-primary-foreground bg-slate-900 px-2 py-0.5 rounded">admin123</span></p>
        </div>
      </div>
    </div>
  );
}