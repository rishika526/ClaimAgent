import { Link } from "wouter";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Car, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function Home() {
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-4">
      <div className="max-w-4xl w-full space-y-12">
        <div className="text-center space-y-4">
          <div className="flex items-center justify-center gap-3 text-primary mb-6">
            <ShieldCheck size={56} />
            <h1 className="text-5xl font-bold tracking-tight">ClaimAgent</h1>
          </div>
          <p className="text-2xl text-muted-foreground font-light max-w-2xl mx-auto">
            AI-Powered Motor Insurance Claim Processing System
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 mt-12">
          <Card className="hover:shadow-xl transition-all duration-300 border-primary/10 overflow-hidden group">
            <div className="h-2 bg-primary"></div>
            <CardHeader className="text-center pt-8">
              <div className="mx-auto bg-primary/10 p-5 rounded-full w-fit mb-6 group-hover:scale-110 transition-transform">
                <Car className="w-10 h-10 text-primary" />
              </div>
              <CardTitle className="text-3xl mb-2">Customer Portal</CardTitle>
              <CardDescription className="text-base">
                File a new claim, upload images, and get instant AI-driven estimates.
              </CardDescription>
            </CardHeader>
            <CardContent className="flex justify-center pb-8">
              <Link href="/customer">
                <Button size="lg" className="w-full text-lg h-14 px-8">Start Claim Process</Button>
              </Link>
            </CardContent>
          </Card>

          <Card className="hover:shadow-xl transition-all duration-300 border-primary/10 overflow-hidden group">
             <div className="h-2 bg-slate-800"></div>
            <CardHeader className="text-center pt-8">
              <div className="mx-auto bg-slate-100 p-5 rounded-full w-fit mb-6 group-hover:scale-110 transition-transform">
                <ShieldCheck className="w-10 h-10 text-slate-800" />
              </div>
              <CardTitle className="text-3xl mb-2">Insurer Portal</CardTitle>
              <CardDescription className="text-base">
                Review claims, manage approvals, and monitor AI confidence scores.
              </CardDescription>
            </CardHeader>
            <CardContent className="flex justify-center pb-8">
              <Link href="/insurer/login">
                <Button size="lg" variant="outline" className="w-full text-lg h-14 px-8">Insurer Login</Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}