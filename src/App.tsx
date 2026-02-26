import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import PlayersPage from "./pages/PlayersPage";
import MatchPage from "./pages/MatchPage";
import DrawPage from "./pages/DrawPage";
import StatsPage from "./pages/StatsPage";
import RankingPage from "./pages/RankingPage";
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
          <Route path="/players" element={<PlayersPage />} />
          <Route path="/match" element={<MatchPage />} />
          <Route path="/draw" element={<DrawPage />} />
          <Route path="/stats" element={<StatsPage />} />
          <Route path="/ranking" element={<RankingPage />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
