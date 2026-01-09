/**
 * Simplified top navigation - utility toolbar only
 * Main navigation is handled by Sidebar component
 */

import { useState, useEffect } from "react";
import { useLocation, Link } from "wouter";
import { Search, Play, Sun, Moon } from "lucide-react";
import { Button } from "@/components/ui/button";
import AnimationSettings from "@/components/effects/AnimationSettings";
import "@/components/effects/AnimationSettings.css";

export function Navigation() {
  const [location] = useLocation();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isDark, setIsDark] = useState(false);

  // Track scroll for sticky header styling
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Don't show navigation on home page (it has its own header)
  if (location === "/") {
    return null;
  }

  return (
    <header 
      className={`sticky top-0 z-50 transition-all duration-200 ${
        isScrolled 
          ? "bg-white/95 backdrop-blur-sm shadow-sm border-b border-gray-100" 
          : "bg-white border-b border-gray-100"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-14">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 font-bold text-lg hover:opacity-80 transition-opacity">
            <span className="text-emerald-600">SICE</span>
          </Link>

          {/* Utility Actions */}
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="sm" className="text-gray-500 hover:text-gray-700">
              <Search className="h-4 w-4" />
            </Button>
            <AnimationSettings />
            <Link href="/tools/spot-analyzer">
              <Button size="sm" className="bg-emerald-600 hover:bg-emerald-700 text-white gap-1.5">
                <Play className="h-3.5 w-3.5" />
                Try Demo
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
}

export default Navigation;
