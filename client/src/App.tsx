import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/not-found";

import Home from "@/pages/home";
import ClaimFlow from "@/pages/customer/claim-flow";
import Report from "@/pages/customer/report";
import InsurerLogin from "@/pages/insurer/login";
import InsurerDashboard from "@/pages/insurer/dashboard";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home}/>
      <Route path="/customer" component={ClaimFlow}/>
      <Route path="/customer/claim/:id" component={Report}/>
      <Route path="/insurer/login" component={InsurerLogin}/>
      <Route path="/insurer" component={InsurerDashboard}/>
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Router />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;