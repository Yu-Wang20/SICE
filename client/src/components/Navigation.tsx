/**
 * Product-style navigation with sticky header, breadcrumbs, and mobile menu
 */

import { useState, useEffect } from "react";
import { useLocation, Link } from "wouter";
import { 
  Menu, X, Search, Upload, Play, 
  BookOpen, Wrench, Target, FileText, Info,
  ChevronRight, Home
} from "lucide-react";
import { Button } from "@/components/ui/button";
import AnimationSettings from "@/components/effects/AnimationSettings";
import "@/components/effects/AnimationSettings.css";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet";

// Navigation items with icons
const NAV_ITEMS = [
  { href: "/atlas", label: "Atlas", icon: BookOpen, description: "Knowledge map" },
  { href: "/tools", label: "Tools", icon: Wrench, description: "Decision tools" },
  { href: "/tools/quiz", label: "Trainer", icon: Target, description: "Practice drills" },
  { href: "/research", label: "Cases", icon: FileText, description: "Case studies" },
  { href: "/research-map", label: "About", icon: Info, description: "Research sources" },
];

// Quick actions
const QUICK_ACTIONS = [
  { href: "/tools/hand-strength", label: "Try Demo", icon: Play },
  { href: "/tools/quiz", label: "Start Training", icon: Target },
];

// Breadcrumb mapping
const BREADCRUMB_MAP: Record<string, { label: string; parent?: string }> = {
  "/": { label: "Home" },
  "/atlas": { label: "Atlas", parent: "/" },
  "/atlas/mathematical-foundations": { label: "Mathematical Foundations", parent: "/atlas" },
  "/atlas/game-theory-evolution": { label: "Game Theory", parent: "/atlas" },
  "/atlas/ai-algorithm-analysis": { label: "AI & Algorithms", parent: "/atlas" },
  "/atlas/decision-matrix": { label: "Decision Matrix", parent: "/atlas" },
  "/atlas/insights": { label: "Insights", parent: "/atlas" },
  "/tools": { label: "Tools", parent: "/" },
  "/tools/hand-strength": { label: "Hand Strength", parent: "/tools" },
  "/tools/pot-odds": { label: "Pot Odds", parent: "/tools" },
  "/tools/push-fold": { label: "Push/Fold", parent: "/tools" },
  "/tools/position-simulator": { label: "Position Simulator", parent: "/tools" },
  "/tools/ev-calculator": { label: "EV Calculator", parent: "/tools" },
  "/tools/quiz": { label: "Decision Training", parent: "/tools" },
  "/tools/strategy-library": { label: "Strategy Library", parent: "/tools" },
  "/research": { label: "Case Studies", parent: "/" },
  "/research-map": { label: "Research Map", parent: "/" },
};

export function Navigation() {
  const [location] = useLocation();
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Track scroll for sticky header styling
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close mobile menu on navigation
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location]);

  return (
    <>
      {/* Main Navigation */}
      <header 
        className={`sticky top-0 z-50 transition-all duration-200 ${
          isScrolled 
            ? "bg-white/95 backdrop-blur-sm shadow-sm border-b border-gray-100" 
            : "bg-white"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-2 font-bold text-lg hover:opacity-80 transition-opacity">
              <span className="text-emerald-600">SICE</span>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center gap-1">
              {NAV_ITEMS.map((item) => {
                const isActive = location === item.href || location.startsWith(item.href + "/");
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                      isActive 
                        ? "bg-emerald-50 text-emerald-700" 
                        : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                    }`}
                  >
                    {item.label}
                  </Link>
                );
              })}
            </nav>

            {/* Quick Actions (Desktop) */}
            <div className="hidden md:flex items-center gap-2">
              <Button variant="ghost" size="sm" className="text-gray-500">
                <Search className="h-4 w-4" />
              </Button>
              <AnimationSettings />
              <Link href="/tools/ev-calculator">
                <Button variant="outline" size="sm" className="gap-1">
                  <Play className="h-3 w-3" />
                  Try Demo
                </Button>
              </Link>
            </div>

            {/* Mobile Menu Button */}
            <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
              <SheetTrigger asChild className="md:hidden">
                <Button variant="ghost" size="sm">
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-80">
                <div className="flex flex-col h-full">
                  {/* Mobile Nav Items */}
                  <nav className="flex-1 py-6">
                    <div className="space-y-1">
                      {NAV_ITEMS.map((item) => {
                        const Icon = item.icon;
                        const isActive = location === item.href || location.startsWith(item.href + "/");
                        return (
                          <Link
                            key={item.href}
                            href={item.href}
                            className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                              isActive 
                                ? "bg-emerald-50 text-emerald-700" 
                                : "text-gray-600 hover:bg-gray-50"
                            }`}
                          >
                            <Icon className="h-5 w-5" />
                            <div>
                              <div className="font-medium">{item.label}</div>
                              <div className="text-xs text-gray-500">{item.description}</div>
                            </div>
                          </Link>
                        );
                      })}
                    </div>
                  </nav>

                  {/* Mobile Quick Actions */}
                  <div className="border-t border-gray-100 pt-4 pb-6 space-y-2">
                    <Link href="/tools/ev-calculator" className="block">
                      <Button className="w-full bg-emerald-600 hover:bg-emerald-700">
                        <Play className="h-4 w-4 mr-2" />
                        Try Demo
                      </Button>
                    </Link>
                    <Link href="/tools/quiz" className="block">
                      <Button variant="outline" className="w-full">
                        <Target className="h-4 w-4 mr-2" />
                        Start Training
                      </Button>
                    </Link>
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </header>

      {/* Breadcrumb Navigation */}
      <Breadcrumbs currentPath={location} />
    </>
  );
}

// Breadcrumb component
function Breadcrumbs({ currentPath }: { currentPath: string }) {
  const breadcrumbs = getBreadcrumbTrail(currentPath);
  
  // Don't show breadcrumbs on home page
  if (currentPath === "/" || breadcrumbs.length <= 1) {
    return null;
  }

  return (
    <div className="bg-gray-50 border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-2">
        <nav className="flex items-center gap-1 text-sm" aria-label="Breadcrumb">
          {breadcrumbs.map((crumb, index) => {
            const isLast = index === breadcrumbs.length - 1;
            return (
              <div key={crumb.href} className="flex items-center gap-1">
                {index > 0 && (
                  <ChevronRight className="h-3 w-3 text-gray-400 flex-shrink-0" />
                )}
                {isLast ? (
                  <span className="text-gray-900 font-medium truncate max-w-[200px]">
                    {crumb.label}
                  </span>
                ) : (
                  <Link 
                    href={crumb.href}
                    className="text-gray-500 hover:text-emerald-600 transition-colors truncate max-w-[150px]"
                  >
                    {crumb.label}
                  </Link>
                )}
              </div>
            );
          })}
        </nav>
      </div>
    </div>
  );
}

// Build breadcrumb trail from current path
function getBreadcrumbTrail(path: string): Array<{ href: string; label: string }> {
  const trail: Array<{ href: string; label: string }> = [];
  let currentPath = path;
  
  while (currentPath) {
    const crumb = BREADCRUMB_MAP[currentPath];
    if (crumb) {
      trail.unshift({ href: currentPath, label: crumb.label });
      currentPath = crumb.parent || "";
    } else {
      // Handle unknown paths
      break;
    }
  }
  
  return trail;
}

export default Navigation;
