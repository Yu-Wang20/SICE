/**
 * Trainer Page - Decision Training Hub
 * Redirects to Quiz Mode with streak tracking and weak-category analysis
 */

import { useEffect } from "react";
import { useLocation } from "wouter";
import Navigation from "@/components/Navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Brain, TrendingUp, Target, BarChart3 } from "lucide-react";

export default function Trainer() {
  const [, navigate] = useLocation();

  // Auto-redirect to quiz after 2 seconds, or user can click button
  useEffect(() => {
    const timer = setTimeout(() => {
      navigate("/tools/quiz");
    }, 2000);
    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <Navigation />

      {/* Main Content */}
      <div className="md:ml-64 pt-16">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-50 to-purple-50 border-b sticky top-16 z-40">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
            <h1 className="text-4xl font-bold text-gray-900">Decision Training</h1>
            <p className="text-gray-600 mt-2">Master poker decisions with instant feedback and progress tracking</p>
          </div>
        </div>

        {/* Content */}
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-12">
          {/* Features Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            {/* Quiz Mode Card */}
            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Brain className="h-5 w-5 text-blue-500" />
                  Quiz Mode
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-gray-600">
                  Test your decision-making with 22+ poker scenarios across preflop, postflop, and tournament situations.
                </p>
                <div className="space-y-2 text-sm">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-blue-500" />
                    <span>Instant feedback on every decision</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-blue-500" />
                    <span>Difficulty levels: Easy, Medium, Hard</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-blue-500" />
                    <span>Category filters for focused practice</span>
                  </div>
                </div>
                <Button
                  onClick={() => navigate("/tools/quiz")}
                  className="w-full bg-blue-600 hover:bg-blue-700 mt-4"
                >
                  Start Quiz
                </Button>
              </CardContent>
            </Card>

            {/* Progress Tracking Card */}
            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5 text-green-500" />
                  Progress Tracking
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-gray-600">
                  Track your improvement with detailed statistics and weak-category identification.
                </p>
                <div className="space-y-2 text-sm">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-green-500" />
                    <span>Winning streak counter</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-green-500" />
                    <span>Accuracy per category</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-green-500" />
                    <span>Error history with explanations</span>
                  </div>
                </div>
                <Button
                  variant="outline"
                  className="w-full mt-4"
                  disabled
                >
                  Coming Soon
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Stats Overview */}
          <Card className="bg-gradient-to-r from-blue-50 to-purple-50 border-blue-200">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="h-5 w-5 text-purple-500" />
                Your Training Stats
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-3 gap-4">
                <div className="text-center">
                  <div className="text-3xl font-bold text-gray-900">0</div>
                  <div className="text-sm text-gray-600 mt-1">Current Streak</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-gray-900">0%</div>
                  <div className="text-sm text-gray-600 mt-1">Overall Accuracy</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-gray-900">0</div>
                  <div className="text-sm text-gray-600 mt-1">Questions Answered</div>
                </div>
              </div>
              <p className="text-xs text-gray-500 mt-4 text-center">
                Stats will be populated after you complete your first quiz
              </p>
            </CardContent>
          </Card>

          {/* Quick Start */}
          <div className="mt-8 p-6 bg-blue-50 rounded-lg border border-blue-200">
            <div className="flex items-start gap-4">
              <Target className="h-6 w-6 text-blue-600 flex-shrink-0 mt-1" />
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">Getting Started</h3>
                <p className="text-sm text-gray-700 mb-4">
                  Click "Start Quiz" to begin your decision training. You'll be presented with poker scenarios and asked to make the GTO-optimal decision. After each answer, you'll receive instant feedback explaining the correct action and why.
                </p>
                <Button
                  onClick={() => navigate("/tools/quiz")}
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  Start Training Now
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
