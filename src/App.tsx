
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import AssetSimulation from "./pages/AssetSimulation";
import SubscriptionCalculator from "./pages/SubscriptionCalculator";
import LoanSimulation from "./pages/LoanSimulation";
import RegionRecommendation from "./pages/RegionRecommendation";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/asset-simulation" element={<AssetSimulation />} />
          <Route path="/subscription-calculator" element={<SubscriptionCalculator />} />
          <Route path="/loan-simulation" element={<LoanSimulation />} />
          <Route path="/region-recommendation" element={<RegionRecommendation />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
