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
// Poker Decision Tools
import ToolsHub from "./pages/tools/ToolsHub";
import HandStrength from "./pages/tools/HandStrength";
import PotOdds from "./pages/tools/PotOdds";
import PushFold from "./pages/tools/PushFold";
import PositionSimulator from "./pages/tools/PositionSimulator";
import EVCalculator from "./pages/tools/EVCalculator";
import QuizMode from "./pages/tools/QuizMode";
import StrategyLibrary from "./pages/tools/StrategyLibrary";
import ResearchMap from "./pages/ResearchMap";

function Router() {
  // make sure to consider if you need authentication for certain routes
  return (
    <Switch>
      <Route path={"/"} component={Home} />
      {/* Atlas Routes */}
      <Route path={"/atlas"} component={AtlasHub} />
      <Route path={"/atlas/mathematical-foundations"} component={MathematicalFoundations} />
      <Route path={"/atlas/game-theory-evolution"} component={GameTheoryEvolution} />
      <Route path={"/atlas/ai-algorithm-analysis"} component={AIAlgorithmAnalysis} />
      <Route path={"/atlas/decision-matrix"} component={DecisionMatrix} />
      <Route path={"/atlas/insights"} component={Insights} />
      <Route path={"/research"} component={Research} />
      {/* Poker Decision Tools */}
      <Route path={"/tools"} component={ToolsHub} />
      <Route path={"/tools/hand-strength"} component={HandStrength} />
      <Route path={"/tools/pot-odds"} component={PotOdds} />
      <Route path={"/tools/push-fold"} component={PushFold} />
      <Route path={"/tools/position"} component={PositionSimulator} />
      <Route path={"/tools/ev-calculator"} component={EVCalculator} />
      <Route path={"/tools/quiz"} component={QuizMode} />
      <Route path={"/tools/strategy-library"} component={StrategyLibrary} />
      <Route path={"/research-map"} component={ResearchMap} />
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
