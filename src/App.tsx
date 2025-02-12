
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "next-themes";
import Navigation from "./components/Navigation";
import Home from "./pages/Home";
import TeamRhythms from "./pages/TeamRhythms";
import Visualizer from "./pages/Visualizer";
import RhythmBuilder from "./pages/RhythmBuilder";
import NotFound from "./pages/NotFound";
import { ThemeToggle } from "./components/ThemeToggle";

const queryClient = new QueryClient();
const isProduction = import.meta.env.PROD;

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider defaultTheme="system" enableSystem>
      <TooltipProvider>
        <div className="relative min-h-screen">
          <div className="fixed top-4 right-4 z-50">
            <ThemeToggle />
          </div>
          <Toaster />
          <Sonner />
          <BrowserRouter basename={isProduction ? "/build-a-rhythm" : "/"}>
            <Navigation />
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/team-rhythms" element={<TeamRhythms />} />
              <Route path="/visualizer" element={<Visualizer />} />
              <Route path="/builder" element={<RhythmBuilder />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </div>
      </TooltipProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;
