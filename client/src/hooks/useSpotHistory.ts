/**
 * useSpotHistory Hook (P0-5 & P0-6)
 * Manages spot analysis history and favorites in localStorage
 * Enables quick access to previous spots and saved scenarios
 */

import { useState, useEffect } from "react";

export interface SavedSpot {
  id: string;
  name: string;
  timestamp: number;
  tool: string; // e.g., "ev-calculator", "position-simulator"
  params: Record<string, any>;
  isFavorite: boolean;
}

const STORAGE_KEY = "sice_spot_history";
const MAX_HISTORY = 10;

export function useSpotHistory() {
  const [history, setHistory] = useState<SavedSpot[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  // Load from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        setHistory(parsed);
      }
    } catch (error) {
      console.error("Failed to load history:", error);
    }
    setIsLoaded(true);
  }, []);

  // Save spot to history
  const addSpot = (tool: string, params: Record<string, any>, name?: string) => {
    const newSpot: SavedSpot = {
      id: `${Date.now()}-${Math.random()}`,
      name: name || `${tool} - ${new Date().toLocaleTimeString()}`,
      timestamp: Date.now(),
      tool,
      params,
      isFavorite: false
    };

    const updated = [newSpot, ...history].slice(0, MAX_HISTORY);
    setHistory(updated);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    return newSpot;
  };

  // Toggle favorite
  const toggleFavorite = (id: string) => {
    const updated = history.map(spot =>
      spot.id === id ? { ...spot, isFavorite: !spot.isFavorite } : spot
    );
    setHistory(updated);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  };

  // Rename spot
  const renameSpot = (id: string, newName: string) => {
    const updated = history.map(spot =>
      spot.id === id ? { ...spot, name: newName } : spot
    );
    setHistory(updated);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  };

  // Delete spot
  const deleteSpot = (id: string) => {
    const updated = history.filter(spot => spot.id !== id);
    setHistory(updated);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  };

  // Get favorites
  const getFavorites = () => history.filter(spot => spot.isFavorite);

  // Get recent spots
  const getRecent = (limit = 5) => history.slice(0, limit);

  return {
    history,
    isLoaded,
    addSpot,
    toggleFavorite,
    renameSpot,
    deleteSpot,
    getFavorites,
    getRecent
  };
}
