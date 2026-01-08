/**
 * ToolLayout Component (P0-4)
 * Unified left-input / right-result workbench pattern for all poker tools
 * Ensures consistent UX across all decision tools
 * Updated with Open Doodles illustration support (Pablo Stanley style)
 */

import { ReactNode } from "react";
import Navigation from "./Navigation";

interface ToolLayoutProps {
  title: string;
  description: string;
  inputPanel: ReactNode;
  resultPanel: ReactNode;
  showStickyResult?: boolean; // Make result panel sticky on desktop
  illustration?: string; // Path to Open Doodles SVG illustration
  accentColor?: 'emerald' | 'blue' | 'green' | 'yellow' | 'orange' | 'purple' | 'red' | 'indigo';
  theory?: string; // Theory badge text
}

// Accent color mappings
const colorMap: Record<string, { gradient: string; badge: string }> = {
  emerald: { gradient: 'from-emerald-50 to-teal-50', badge: 'bg-emerald-100 text-emerald-700' },
  blue: { gradient: 'from-blue-50 to-indigo-50', badge: 'bg-blue-100 text-blue-700' },
  green: { gradient: 'from-green-50 to-emerald-50', badge: 'bg-green-100 text-green-700' },
  yellow: { gradient: 'from-yellow-50 to-amber-50', badge: 'bg-yellow-100 text-yellow-700' },
  orange: { gradient: 'from-orange-50 to-amber-50', badge: 'bg-orange-100 text-orange-700' },
  purple: { gradient: 'from-purple-50 to-violet-50', badge: 'bg-purple-100 text-purple-700' },
  red: { gradient: 'from-red-50 to-rose-50', badge: 'bg-red-100 text-red-700' },
  indigo: { gradient: 'from-indigo-50 to-purple-50', badge: 'bg-indigo-100 text-indigo-700' },
};

export default function ToolLayout({
  title,
  description,
  inputPanel,
  resultPanel,
  showStickyResult = true,
  illustration,
  accentColor = 'emerald',
  theory
}: ToolLayoutProps) {
  const colors = colorMap[accentColor] || colorMap.emerald;

  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <Navigation />

      {/* Main Content */}
      <div className="md:ml-64 pt-16">
        {/* Header with Illustration */}
        <div className={`bg-gradient-to-r ${colors.gradient} border-b`}>
          <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
            <div className="flex items-center justify-between gap-6">
              <div className="flex-1">
                {/* Theory Badge */}
                {theory && (
                  <span className={`inline-block text-xs font-mono px-2 py-1 rounded mb-3 ${colors.badge}`}>
                    {theory}
                  </span>
                )}
                <h1 className="text-3xl md:text-4xl font-bold text-gray-900">{title}</h1>
                <p className="text-gray-600 mt-2 max-w-xl">{description}</p>
              </div>
              
              {/* Open Doodles Illustration */}
              {illustration && (
                <div className="hidden md:block flex-shrink-0 w-32 h-32 lg:w-40 lg:h-40">
                  <img 
                    src={illustration} 
                    alt={`${title} illustration`}
                    className="w-full h-full object-contain opacity-80"
                  />
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Content Grid */}
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Left: Input Panel (scrollable, not sticky) */}
            <div className="space-y-6">
              {inputPanel}
            </div>

            {/* Right: Result Panel (sticky on desktop) */}
            <div className={`space-y-6 ${showStickyResult ? 'lg:sticky lg:top-32' : ''}`}>
              {resultPanel}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
