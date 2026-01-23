import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import woodPattern from "@/assets/wood-pattern.jpg";

const queryClient = new QueryClient();

const App = () => (
  <div
    className="min-h-screen"
    style={{
      backgroundImage: `linear-gradient(hsl(var(--background) / 0.35), hsl(var(--background) / 0.35)), url(${woodPattern})`,
      backgroundRepeat: "repeat",
      backgroundSize: "1600px auto",
      backgroundPosition: "top center",
    }}
  >
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
  </div>
);

export default App;
