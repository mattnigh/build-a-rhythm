
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Navigation from "./components/Navigation";
import Home from "./pages/Home";
import TeamRhythms from "./pages/TeamRhythms";
import Visualizer from "./pages/Visualizer";
import RhythmBuilder from "./pages/RhythmBuilder";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter basename="/build-a-rhythm">
        <Navigation />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/team-rhythms" element={<TeamRhythms />} />
          <Route path="/visualizer" element={<Visualizer />} />
          <Route path="/builder" element={<RhythmBuilder />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
