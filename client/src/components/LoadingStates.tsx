/**
 * Loading states and skeleton screens for progressive content loading
 */

import { Loader2 } from "lucide-react";

// Skeleton base component
export function Skeleton({ className = "" }: { className?: string }) {
  return (
    <div 
      className={`animate-pulse bg-gray-200 rounded ${className}`}
      aria-hidden="true"
    />
  );
}

// Page-level skeleton for initial load
export function PageSkeleton() {
  return (
    <div className="min-h-screen bg-white">
      {/* Navigation skeleton */}
      <div className="sticky top-0 z-50 bg-white border-b border-gray-100 px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <Skeleton className="h-8 w-24" />
          <div className="hidden md:flex items-center gap-6">
            <Skeleton className="h-4 w-16" />
            <Skeleton className="h-4 w-20" />
            <Skeleton className="h-4 w-12" />
            <Skeleton className="h-4 w-16" />
            <Skeleton className="h-4 w-14" />
          </div>
          <Skeleton className="h-10 w-28" />
        </div>
      </div>

      {/* Hero skeleton */}
      <div className="px-6 py-20">
        <div className="max-w-4xl mx-auto space-y-6">
          <Skeleton className="h-16 w-3/4" />
          <Skeleton className="h-6 w-full max-w-2xl" />
          <Skeleton className="h-6 w-2/3 max-w-xl" />
          <div className="flex gap-4 pt-6">
            <Skeleton className="h-12 w-40" />
            <Skeleton className="h-12 w-36" />
          </div>
        </div>
      </div>

      {/* Content skeleton */}
      <div className="px-6 py-12 bg-gray-50">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="bg-white p-6 rounded-lg border border-gray-100">
              <Skeleton className="h-12 w-12 rounded-lg mb-4" />
              <Skeleton className="h-6 w-3/4 mb-2" />
              <Skeleton className="h-4 w-full mb-1" />
              <Skeleton className="h-4 w-5/6" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// Card skeleton
export function CardSkeleton() {
  return (
    <div className="bg-white p-6 rounded-lg border border-gray-100">
      <Skeleton className="h-10 w-10 rounded-lg mb-4" />
      <Skeleton className="h-5 w-3/4 mb-2" />
      <Skeleton className="h-4 w-full mb-1" />
      <Skeleton className="h-4 w-5/6 mb-4" />
      <Skeleton className="h-8 w-24" />
    </div>
  );
}

// Tool page skeleton
export function ToolSkeleton() {
  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-4xl mx-auto">
        <Skeleton className="h-6 w-32 mb-6" />
        <Skeleton className="h-10 w-64 mb-2" />
        <Skeleton className="h-5 w-96 mb-8" />
        
        <div className="bg-white rounded-lg p-6 border border-gray-100">
          <div className="grid grid-cols-2 gap-4 mb-6">
            <div>
              <Skeleton className="h-4 w-24 mb-2" />
              <Skeleton className="h-10 w-full" />
            </div>
            <div>
              <Skeleton className="h-4 w-24 mb-2" />
              <Skeleton className="h-10 w-full" />
            </div>
          </div>
          <Skeleton className="h-12 w-full" />
        </div>
      </div>
    </div>
  );
}

// Inline loading spinner
export function LoadingSpinner({ size = "default" }: { size?: "sm" | "default" | "lg" }) {
  const sizeClasses = {
    sm: "h-4 w-4",
    default: "h-6 w-6",
    lg: "h-8 w-8"
  };
  
  return (
    <div className="flex items-center justify-center p-4">
      <Loader2 className={`${sizeClasses[size]} animate-spin text-emerald-600`} />
    </div>
  );
}

// Full page loading
export function FullPageLoader() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-white">
      <div className="text-center space-y-4">
        <Loader2 className="h-12 w-12 animate-spin text-emerald-600 mx-auto" />
        <p className="text-gray-500 text-sm">Loading...</p>
      </div>
    </div>
  );
}

// Reading progress bar
export function ReadingProgressBar() {
  return (
    <div className="fixed top-0 left-0 right-0 h-1 bg-gray-100 z-[60]">
      <div 
        id="reading-progress"
        className="h-full bg-emerald-500 transition-all duration-150"
        style={{ width: '0%' }}
      />
    </div>
  );
}
