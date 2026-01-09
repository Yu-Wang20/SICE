/**
 * Persistent Sidebar Navigation (P0-2)
 * Enables one-click section switching without back buttons
 * Responsive: collapses to hamburger on mobile with smooth animations
 */

import { useState, useEffect, useCallback } from "react";
import { useLocation } from "wouter";
import {
  Menu, X, Target, Brain, Lightbulb, Wrench, History, Bookmark,
  BookOpen, Zap, Gamepad2, ChevronRight
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

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

  // Close on escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape" && mobileOpen) {
        setMobileOpen(false);
      }
    };
    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, [mobileOpen]);

  // Prevent body scroll when mobile menu is open
  useEffect(() => {
    if (mobileOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileOpen]);

  // Close mobile menu when navigating
  const handleNavigation = useCallback((href: string) => {
    navigate(href);
    setMobileOpen(false);
    onClose?.();
  }, [navigate, onClose]);

  // Determine if item is active
  const isActive = (href: string) => {
    return location === href || location.startsWith(href + "?");
  };

  // Group items by category
  const toolsItems = NAV_ITEMS.filter(item => item.category === "tools");
  const personalItems = NAV_ITEMS.filter(item => item.category === "personal");
  const researchItems = NAV_ITEMS.filter(item => item.category === "research");

  // Mobile: show hamburger button and slide-in panel
  if (isMobile) {
    return (
      <>
        {/* Mobile Hamburger Button - Fixed at top left */}
        <motion.button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="fixed top-4 left-4 z-50 p-2.5 rounded-xl bg-white border border-gray-200 shadow-sm hover:shadow-md transition-shadow"
          whileTap={{ scale: 0.95 }}
          aria-label={mobileOpen ? "Close menu" : "Open menu"}
        >
          <AnimatePresence mode="wait">
            {mobileOpen ? (
              <motion.div
                key="close"
                initial={{ rotate: -90, opacity: 0 }}
                animate={{ rotate: 0, opacity: 1 }}
                exit={{ rotate: 90, opacity: 0 }}
                transition={{ duration: 0.15 }}
              >
                <X className="h-5 w-5 text-gray-700" />
              </motion.div>
            ) : (
              <motion.div
                key="menu"
                initial={{ rotate: 90, opacity: 0 }}
                animate={{ rotate: 0, opacity: 1 }}
                exit={{ rotate: -90, opacity: 0 }}
                transition={{ duration: 0.15 }}
              >
                <Menu className="h-5 w-5 text-gray-700" />
              </motion.div>
            )}
          </AnimatePresence>
        </motion.button>

        {/* Mobile Sidebar Overlay & Panel */}
        <AnimatePresence>
          {mobileOpen && (
            <>
              {/* Backdrop */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40"
                onClick={() => setMobileOpen(false)}
              />

              {/* Sidebar Panel */}
              <motion.div
                initial={{ x: "-100%" }}
                animate={{ x: 0 }}
                exit={{ x: "-100%" }}
                transition={{ type: "spring", damping: 25, stiffness: 300 }}
                className="fixed left-0 top-0 h-full w-72 bg-white shadow-2xl z-50 overflow-hidden"
              >
                <SidebarContent
                  items={toolsItems}
                  personalItems={personalItems}
                  researchItems={researchItems}
                  isActive={isActive}
                  onNavigate={handleNavigation}
                  isMobile={true}
                />
              </motion.div>
            </>
          )}
        </AnimatePresence>
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
        isMobile={false}
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
  isMobile: boolean;
}

function SidebarContent({
  items,
  personalItems,
  researchItems,
  isActive,
  onNavigate,
  isMobile
}: SidebarContentProps) {
  return (
    <div className="flex flex-col h-full">
      {/* Logo / Branding */}
      <div className={`p-6 border-b border-gray-100 ${isMobile ? 'pt-16' : ''}`}>
        <h2 className="text-xl font-bold text-gray-900">SICE</h2>
        <p className="text-xs text-gray-500 mt-1">Poker Decision Engine</p>
      </div>

      {/* Navigation Sections */}
      <nav className="flex-1 overflow-y-auto p-4 space-y-6">
        {/* Tools Section */}
        <NavSection
          title="Tools"
          items={items}
          isActive={isActive}
          onNavigate={onNavigate}
          isMobile={isMobile}
        />

        {/* Personal Section */}
        <NavSection
          title="Personal"
          items={personalItems}
          isActive={isActive}
          onNavigate={onNavigate}
          isMobile={isMobile}
        />

        {/* Research Section */}
        <NavSection
          title="Research"
          items={researchItems}
          isActive={isActive}
          onNavigate={onNavigate}
          isMobile={isMobile}
        />
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-gray-100">
        <p className="text-xs text-gray-400 text-center">
          v1.0 • Poker Decision Engine
        </p>
      </div>
    </div>
  );
}

interface NavSectionProps {
  title: string;
  items: typeof NAV_ITEMS;
  isActive: (href: string) => boolean;
  onNavigate: (href: string) => void;
  isMobile: boolean;
}

function NavSection({ title, items, isActive, onNavigate, isMobile }: NavSectionProps) {
  return (
    <div>
      <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3 px-2">
        {title}
      </h3>
      <div className="space-y-1">
        {items.map((item, index) => {
          const Icon = item.icon;
          const active = isActive(item.href);
          
          return (
            <motion.button
              key={item.id}
              onClick={() => onNavigate(item.href)}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors ${
                active
                  ? "bg-emerald-50 text-emerald-700"
                  : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
              }`}
              initial={isMobile ? { opacity: 0, x: -20 } : false}
              animate={isMobile ? { opacity: 1, x: 0 } : undefined}
              transition={isMobile ? { delay: index * 0.05 } : undefined}
              whileHover={{ x: 4 }}
              whileTap={{ scale: 0.98 }}
            >
              <Icon className={`h-4 w-4 flex-shrink-0 ${active ? 'text-emerald-600' : ''}`} />
              <span className={`text-sm flex-1 text-left ${active ? 'font-medium' : ''}`}>
                {item.label}
              </span>
              {active && (
                <ChevronRight className="h-4 w-4 text-emerald-500" />
              )}
            </motion.button>
          );
        })}
      </div>
    </div>
  );
}
