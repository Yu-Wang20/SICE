import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/NotFound";
import { Route, Switch } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import Home from "./pages/Home";
import AtlasHub from "./pages/atlas/Hub";
import MathematicalFoundations from "./pages/atlas/MathematicalFoundations";
import GameTheoryEvolution from "./pages/atlas/GameTheoryEvolution";
import AIAlgorithmAnalysis from "./pages/atlas/AIAlgorithmAnalysis";
import DecisionMatrix from "./pages/atlas/DecisionMatrix";
import Insights from "./pages/atlas/Insights";
import Research from "./pages/Research";

function Router() {
  return (
    <Switch>
      <Route path={"/"} component={Home} />
      <Route path={"/atlas"} component={AtlasHub} />
      <Route path={"/atlas/mathematical-foundations"} component={MathematicalFoundations} />
      <Route path={"/atlas/game-theory-evolution"} component={GameTheoryEvolution} />
      <Route path={"/atlas/ai-algorithm-analysis"} component={AIAlgorithmAnalysis} />
      <Route path={"/atlas/decision-matrix"} component={DecisionMatrix} />
      <Route path={"/atlas/insights"} component={Insights} />
      <Route path={"/research"} component={Research} />
      <Route path={"/404"} component={NotFound} />
      {/* Final fallback route */}
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider
        defaultTheme="light"
        // switchable
      >
        <TooltipProvider>
          <Toaster />
          <Router />
        </TooltipProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
