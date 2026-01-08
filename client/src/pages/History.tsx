/**
 * History Page (P0-6)
 * Display recent spots and favorites for quick access
 */

import { useSpotHistory } from "@/hooks/useSpotHistory";
import { useLocation } from "wouter";
import Navigation from "@/components/Navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Trash2, Star, Clock } from "lucide-react";

export default function History() {
  const [, navigate] = useLocation();
  const { history, getFavorites, deleteSpot, toggleFavorite } = useSpotHistory();

  const favorites = getFavorites();
  const recent = history.slice(0, 10);

  const getToolLabel = (tool: string) => {
    const labels: Record<string, string> = {
      "ev-calculator": "EV Calculator",
      "position-simulator": "Position Simulator",
      "pot-odds": "Pot Odds",
      "push-fold": "Push/Fold Trainer"
    };
    return labels[tool] || tool;
  };

  const handleLoadSpot = (spot: any) => {
    // Navigate to tool with params
    const params = new URLSearchParams(spot.params);
    navigate(`/tools/${spot.tool}?${params.toString()}`);
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <Navigation />

      {/* Main Content */}
      <div className="md:ml-64 pt-16">
        {/* Header */}
        <div className="bg-gradient-to-r from-emerald-50 to-blue-50 border-b sticky top-16 z-40">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
            <h1 className="text-4xl font-bold text-gray-900">History</h1>
            <p className="text-gray-600 mt-2">Quick access to your recent and saved spots</p>
          </div>
        </div>

        {/* Content */}
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
          {/* Favorites Section */}
          {favorites.length > 0 && (
            <div className="mb-12">
              <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                <Star className="h-6 w-6 text-yellow-500 fill-yellow-500" />
                Favorites
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {favorites.map((spot) => (
                  <Card key={spot.id} className="hover:shadow-lg transition-shadow">
                    <CardHeader className="pb-3">
                      <div className="flex items-start justify-between">
                        <div>
                          <CardTitle className="text-lg">{spot.name}</CardTitle>
                          <p className="text-sm text-gray-500 mt-1">{getToolLabel(spot.tool)}</p>
                        </div>
                        <button
                          onClick={() => toggleFavorite(spot.id)}
                          className="p-1 hover:bg-gray-100 rounded"
                        >
                          <Star className="h-5 w-5 text-yellow-500 fill-yellow-500" />
                        </button>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div className="text-sm text-gray-600">
                        <p className="font-mono bg-gray-50 p-2 rounded text-xs">
                          {Object.entries(spot.params)
                            .slice(0, 3)
                            .map(([k, v]) => `${k}: ${v}`)
                            .join(" • ")}
                        </p>
                      </div>
                      <div className="flex gap-2">
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
                          onClick={() => deleteSpot(spot.id)}
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

          {/* Recent Section */}
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
              <Clock className="h-6 w-6 text-blue-500" />
              Recent Spots
            </h2>
            {recent.length === 0 ? (
              <Card className="bg-gray-50 border-dashed">
                <CardContent className="pt-12 pb-12 text-center">
                  <p className="text-gray-500">No history yet. Start analyzing to build your history.</p>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-2">
                {recent.map((spot) => (
                  <div
                    key={spot.id}
                    className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                  >
                    <div className="flex-1">
                      <p className="font-medium text-gray-900">{spot.name}</p>
                      <p className="text-sm text-gray-500">{getToolLabel(spot.tool)}</p>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        className="bg-emerald-600 hover:bg-emerald-700"
                        onClick={() => handleLoadSpot(spot)}
                      >
                        Load
                      </Button>
                      <button
                        onClick={() => toggleFavorite(spot.id)}
                        className="p-2 hover:bg-white rounded"
                      >
                        <Star className={`h-5 w-5 ${spot.isFavorite ? 'text-yellow-500 fill-yellow-500' : 'text-gray-400'}`} />
                      </button>
                      <button
                        onClick={() => deleteSpot(spot.id)}
                        className="p-2 hover:bg-white rounded text-red-500"
                      >
                        <Trash2 className="h-5 w-5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
