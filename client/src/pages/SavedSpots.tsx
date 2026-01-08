/**
 * Saved Spots Page - Display and manage saved analyses
 * Allows users to revisit and export previous spot analyses
 */

import { useSpotHistory } from "@/hooks/useSpotHistory";
import { useLocation } from "wouter";
import Navigation from "@/components/Navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Trash2, Star, Download, Clock } from "lucide-react";

export default function SavedSpots() {
  const [, navigate] = useLocation();
  const { getFavorites, deleteSpot, toggleFavorite } = useSpotHistory();

  const favorites = getFavorites();

  const getToolLabel = (tool: string) => {
    const labels: Record<string, string> = {
      "ev-calculator": "EV Calculator",
      "position-simulator": "Position Simulator",
      "pot-odds": "Pot Odds",
      "push-fold": "Push/Fold Trainer",
      "spot-analyzer": "Spot Analyzer",
      "hand-strength": "Hand Strength"
    };
    return labels[tool] || tool;
  };

  const handleLoadSpot = (spot: any) => {
    // Navigate to tool with params
    const params = new URLSearchParams(spot.params);
    navigate(`/tools/${spot.tool}?${params.toString()}`);
  };

  const handleExportSpot = (spot: any) => {
    // Export spot as JSON
    const json = JSON.stringify(spot, null, 2);
    const blob = new Blob([json], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${spot.name}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <Navigation />

      {/* Main Content */}
      <div className="md:ml-64 pt-16">
        {/* Header */}
        <div className="bg-gradient-to-r from-yellow-50 to-amber-50 border-b sticky top-16 z-40">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
            <h1 className="text-4xl font-bold text-gray-900">Saved Spots</h1>
            <p className="text-gray-600 mt-2">Your favorite poker analyses and decisions</p>
          </div>
        </div>

        {/* Content */}
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
          {favorites.length === 0 ? (
            <Card className="bg-gray-50 border-dashed">
              <CardContent className="pt-12 pb-12 text-center">
                <Star className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500 mb-4">No saved spots yet</p>
                <p className="text-sm text-gray-400 mb-6">
                  Star your favorite analyses to save them here for quick access
                </p>
                <Button
                  onClick={() => navigate("/tools/spot-analyzer")}
                  className="bg-emerald-600 hover:bg-emerald-700"
                >
                  Analyze a Spot
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-4">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                  <Star className="h-6 w-6 text-yellow-500 fill-yellow-500" />
                  {favorites.length} Saved Spot{favorites.length !== 1 ? 's' : ''}
                </h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {favorites.map((spot) => (
                  <Card key={spot.id} className="hover:shadow-lg transition-shadow">
                    <CardHeader className="pb-3">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <CardTitle className="text-lg">{spot.name}</CardTitle>
                          <p className="text-sm text-gray-500 mt-1">{getToolLabel(spot.tool)}</p>
                        </div>
                        <button
                          onClick={() => toggleFavorite(spot.id)}
                          className="p-1 hover:bg-gray-100 rounded flex-shrink-0"
                          title="Remove from saved"
                        >
                          <Star className="h-5 w-5 text-yellow-500 fill-yellow-500" />
                        </button>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      {/* Spot Details */}
                      <div className="text-sm text-gray-600">
                        <div className="font-mono bg-gray-50 p-2 rounded text-xs">
                          {Object.entries(spot.params)
                            .slice(0, 4)
                            .map(([k, v]) => `${k}: ${v}`)
                            .join(" • ")}
                        </div>
                      </div>

                      {/* Timestamp */}
                      <div className="flex items-center gap-2 text-xs text-gray-500">
                        <Clock className="h-3 w-3" />
                        <span>{new Date(spot.timestamp).toLocaleString()}</span>
                      </div>

                      {/* Action Buttons */}
                      <div className="flex gap-2 pt-2">
                        <Button
                          size="sm"
                          className="flex-1 bg-emerald-600 hover:bg-emerald-700"
                          onClick={() => handleLoadSpot(spot)}
                        >
                          Load
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleExportSpot(spot)}
                          title="Export as JSON"
                        >
                          <Download className="h-4 w-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => deleteSpot(spot.id)}
                          className="text-red-500 hover:text-red-600"
                          title="Delete"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
