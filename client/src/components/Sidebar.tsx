/**
 * Persistent Sidebar Navigation (P0-2)
 * Enables one-click section switching without back buttons
 * Responsive: collapses to hamburger on mobile
 */

import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import {
  Menu, X, Target, Brain, Lightbulb, Wrench, History, Bookmark,
  BookOpen, Zap, Gamepad2
} from "lucide-react";

const NAV_ITEMS = [
  {
    id: "analyze",
    label: "Analyze a Spot",
    icon: Target,
    href: "/tools/spot-analyzer",
    category: "tools"
  },
  {
    id: "trainer",
    label: "Trainer",
    icon: Brain,
    href: "/trainer",
    category: "tools"
  },
  {
    id: "ranges",
    label: "Ranges",
    icon: Lightbulb,
    href: "/tools/strategy-library",
    category: "tools"
  },
  {
    id: "simulator",
    label: "Hand Simulator",
    icon: Gamepad2,
    href: "/tools/hand-simulator",
    category: "tools"
  },
  {
    id: "tools",
    label: "All Tools",
    icon: Wrench,
    href: "/tools",
    category: "tools"
  },
  {
    id: "history",
    label: "History",
    icon: History,
    href: "/history",
    category: "personal"
  },
  {
    id: "saved",
    label: "Saved",
    icon: Bookmark,
    href: "/saved",
    category: "personal"
  },
  {
    id: "atlas",
    label: "Atlas",
    icon: BookOpen,
    href: "/atlas",
    category: "research"
  },
  {
    id: "research",
    label: "Research",
    icon: Zap,
    href: "/research",
    category: "research"
  }
];

interface SidebarProps {
  isOpen?: boolean;
  onClose?: () => void;
}

export default function Sidebar({ isOpen = true, onClose }: SidebarProps) {
  const [location, navigate] = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  // Detect mobile
  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);
      if (!mobile) {
        setMobileOpen(false);
      }
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Close mobile menu when navigating
  const handleNavigation = (href: string) => {
    navigate(href);
    setMobileOpen(false);
    onClose?.();
  };

  // Determine if item is active
  const isActive = (href: string) => {
    return location === href || location.startsWith(href + "?");
  };

  // Group items by category
  const toolsItems = NAV_ITEMS.filter(item => item.category === "tools");
  const personalItems = NAV_ITEMS.filter(item => item.category === "personal");
  const researchItems = NAV_ITEMS.filter(item => item.category === "research");

  // Mobile: show hamburger button
  if (isMobile) {
    return (
      <>
        {/* Mobile Hamburger Button */}
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="fixed top-4 left-4 z-40 p-2 rounded-lg bg-white border border-gray-200 hover:bg-gray-50 md:hidden"
        >
          {mobileOpen ? (
            <X className="h-5 w-5 text-gray-700" />
          ) : (
            <Menu className="h-5 w-5 text-gray-700" />
          )}
        </button>

        {/* Mobile Sidebar Overlay */}
        {mobileOpen && (
          <div
            className="fixed inset-0 bg-black/20 z-30 md:hidden"
            onClick={() => setMobileOpen(false)}
          />
        )}

        {/* Mobile Sidebar Panel */}
        <div
          className={`fixed left-0 top-0 h-screen w-64 bg-white border-r border-gray-200 z-40 transform transition-transform duration-200 md:hidden ${
            mobileOpen ? "translate-x-0" : "-translate-x-full"
          }`}
        >
          <SidebarContent
            items={toolsItems}
            personalItems={personalItems}
            researchItems={researchItems}
            isActive={isActive}
            onNavigate={handleNavigation}
          />
        </div>
      </>
    );
  }

  // Desktop: fixed sidebar
  return (
    <aside className="hidden md:fixed md:left-0 md:top-0 md:h-screen md:w-64 md:border-r md:border-gray-200 md:bg-white md:overflow-y-auto md:block">
      <SidebarContent
        items={toolsItems}
        personalItems={personalItems}
        researchItems={researchItems}
        isActive={isActive}
        onNavigate={handleNavigation}
      />
    </aside>
  );
}

interface SidebarContentProps {
  items: typeof NAV_ITEMS;
  personalItems: typeof NAV_ITEMS;
  researchItems: typeof NAV_ITEMS;
  isActive: (href: string) => boolean;
  onNavigate: (href: string) => void;
}

function SidebarContent({
  items,
  personalItems,
  researchItems,
  isActive,
  onNavigate
}: SidebarContentProps) {
  return (
    <div className="flex flex-col h-full">
      {/* Logo / Branding */}
      <div className="p-6 border-b border-gray-200">
        <h2 className="text-xl font-bold text-gray-900">SICE</h2>
        <p className="text-xs text-gray-500 mt-1">Poker Decision Engine</p>
      </div>

      {/* Navigation Sections */}
      <nav className="flex-1 overflow-y-auto p-4 space-y-6">
        {/* Tools Section */}
        <div>
          <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3 px-2">
            Tools
          </h3>
          <div className="space-y-2">
            {items.map((item) => {
              const Icon = item.icon;
              const active = isActive(item.href);
              return (
                <button
                  key={item.id}
                  onClick={() => onNavigate(item.href)}
                  className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg transition-all ${
                    active
                      ? "bg-emerald-100 text-emerald-700 font-medium"
                      : "text-gray-700 hover:bg-gray-100"
                  }`}
                >
                  <Icon className="h-4 w-4 flex-shrink-0" />
                  <span className="text-sm">{item.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Personal Section */}
        <div>
          <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3 px-2">
            Personal
          </h3>
          <div className="space-y-2">
            {personalItems.map((item) => {
              const Icon = item.icon;
              const active = isActive(item.href);
              return (
                <button
                  key={item.id}
                  onClick={() => onNavigate(item.href)}
                  className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg transition-all ${
                    active
                      ? "bg-emerald-100 text-emerald-700 font-medium"
                      : "text-gray-700 hover:bg-gray-100"
                  }`}
                >
                  <Icon className="h-4 w-4 flex-shrink-0" />
                  <span className="text-sm">{item.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Research Section */}
        <div>
          <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3 px-2">
            Research
          </h3>
          <div className="space-y-2">
            {researchItems.map((item) => {
              const Icon = item.icon;
              const active = isActive(item.href);
              return (
                <button
                  key={item.id}
                  onClick={() => onNavigate(item.href)}
                  className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg transition-all ${
                    active
                      ? "bg-emerald-100 text-emerald-700 font-medium"
                      : "text-gray-700 hover:bg-gray-100"
                  }`}
                >
                  <Icon className="h-4 w-4 flex-shrink-0" />
                  <span className="text-sm">{item.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-gray-200">
        <p className="text-xs text-gray-500 text-center">
          v1.0 • Poker Decision Engine
        </p>
      </div>
    </div>
  );
}
