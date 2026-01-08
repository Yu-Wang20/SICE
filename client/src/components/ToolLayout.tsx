/**
 * ToolLayout Component (P0-4)
 * Unified left-input / right-result workbench pattern for all poker tools
 * Ensures consistent UX across all decision tools
 */

import { ReactNode } from "react";
import Navigation from "./Navigation";

interface ToolLayoutProps {
  title: string;
  description: string;
  inputPanel: ReactNode;
  resultPanel: ReactNode;
  showStickyResult?: boolean; // Make result panel sticky on desktop
}

export default function ToolLayout({
  title,
  description,
  inputPanel,
  resultPanel,
  showStickyResult = true
}: ToolLayoutProps) {
  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <Navigation />

      {/* Main Content */}
      <div className="md:ml-64 pt-16">
        {/* Header */}
        <div className="bg-gradient-to-r from-emerald-50 to-blue-50 border-b sticky top-16 z-40">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
            <h1 className="text-4xl font-bold text-gray-900">{title}</h1>
            <p className="text-gray-600 mt-2">{description}</p>
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
