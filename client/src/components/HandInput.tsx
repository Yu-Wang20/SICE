/**
 * HandInput Component - Improved poker hand input with auto-complete and suited toggle
 * Addresses user feedback: "AK 必须写成 AKo/AKs 对新手不友好"
 */

import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const RANKS = ['A', 'K', 'Q', 'J', 'T', '9', '8', '7', '6', '5', '4', '3', '2'];

interface HandInputProps {
  value: string;
  onChange: (value: string) => void;
  error?: string;
  className?: string;
}

export default function HandInput({ value, onChange, error, className }: HandInputProps) {
  const [inputValue, setInputValue] = useState(value);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Parse current hand to determine if it's a pair or needs suited/offsuit
  const parseHand = (hand: string) => {
    const normalized = hand.toUpperCase().replace(/[^AKQJT98765432SO]/g, '');
    if (normalized.length < 2) return { rank1: '', rank2: '', modifier: '', isPair: false };
    
    const rank1 = normalized[0];
    const rank2 = normalized[1];
    const modifier = normalized[2] || '';
    const isPair = rank1 === rank2;
    
    return { rank1, rank2, modifier, isPair };
  };

  const { rank1, rank2, modifier, isPair } = parseHand(inputValue);
  const needsModifier = rank1 && rank2 && !isPair && !modifier;

  // Generate suggestions based on input
  useEffect(() => {
    const input = inputValue.toUpperCase().replace(/[^AKQJT98765432]/g, '');
    
    if (input.length === 0) {
      setSuggestions([]);
      return;
    }

    const newSuggestions: string[] = [];
    
    if (input.length === 1 && RANKS.includes(input)) {
      // Single rank: suggest pairs and common combos
      newSuggestions.push(`${input}${input}`); // Pair
      const rankIndex = RANKS.indexOf(input);
      // Suggest next few ranks
      for (let i = rankIndex + 1; i < Math.min(rankIndex + 4, RANKS.length); i++) {
        newSuggestions.push(`${input}${RANKS[i]}s`);
        newSuggestions.push(`${input}${RANKS[i]}o`);
      }
    } else if (input.length === 2) {
      const r1 = input[0];
      const r2 = input[1];
      if (RANKS.includes(r1) && RANKS.includes(r2)) {
        if (r1 === r2) {
          // Pair - no modifier needed
          newSuggestions.push(`${r1}${r2}`);
        } else {
          // Non-pair - suggest suited and offsuit
          newSuggestions.push(`${r1}${r2}s`);
          newSuggestions.push(`${r1}${r2}o`);
        }
      }
    }

    setSuggestions(newSuggestions.slice(0, 6));
  }, [inputValue]);

  // Handle input change
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value.toUpperCase();
    setInputValue(newValue);
    setShowSuggestions(true);

    // Auto-complete pairs immediately
    const cleaned = newValue.replace(/[^AKQJT98765432SO]/g, '');
    if (cleaned.length === 2) {
      const r1 = cleaned[0];
      const r2 = cleaned[1];
      if (r1 === r2 && RANKS.includes(r1)) {
        // It's a pair, valid as-is
        onChange(cleaned);
        return;
      }
    }

    // For non-pairs with modifier, validate and pass through
    if (cleaned.length === 3) {
      const r1 = cleaned[0];
      const r2 = cleaned[1];
      const mod = cleaned[2];
      if (RANKS.includes(r1) && RANKS.includes(r2) && ['S', 'O'].includes(mod)) {
        onChange(cleaned);
        return;
      }
    }

    // Pass through for validation
    onChange(newValue);
  };

  // Handle suggestion click
  const handleSuggestionClick = (suggestion: string) => {
    setInputValue(suggestion);
    onChange(suggestion);
    setShowSuggestions(false);
    inputRef.current?.focus();
  };

  // Handle suited/offsuit toggle
  const handleModifierToggle = (mod: 's' | 'o') => {
    if (rank1 && rank2 && !isPair) {
      const newHand = `${rank1}${rank2}${mod}`;
      setInputValue(newHand);
      onChange(newHand);
    }
  };

  // Close suggestions on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setShowSuggestions(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div ref={containerRef} className={cn("relative", className)}>
      {/* Main Input */}
      <div className="flex gap-2">
        <input
          ref={inputRef}
          type="text"
          value={inputValue}
          onChange={handleInputChange}
          onFocus={() => setShowSuggestions(true)}
          placeholder="AK, QQ, 87s..."
          maxLength={4}
          className={cn(
            "flex-1 h-10 px-3 py-2 text-lg font-mono rounded-md border bg-white",
            "focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent",
            "transition-all duration-150",
            error ? "border-red-500 focus:ring-red-500" : "border-gray-300"
          )}
        />
        
        {/* Suited/Offsuit Toggle - only show when needed */}
        {needsModifier && (
          <div className="flex gap-1">
            <Button
              type="button"
              size="sm"
              variant={modifier === 'S' ? 'default' : 'outline'}
              onClick={() => handleModifierToggle('s')}
              className={cn(
                "px-3 font-mono text-sm",
                modifier === 'S' ? "bg-emerald-600 hover:bg-emerald-700" : ""
              )}
            >
              s
            </Button>
            <Button
              type="button"
              size="sm"
              variant={modifier === 'O' ? 'default' : 'outline'}
              onClick={() => handleModifierToggle('o')}
              className={cn(
                "px-3 font-mono text-sm",
                modifier === 'O' ? "bg-gray-700 hover:bg-gray-800" : ""
              )}
            >
              o
            </Button>
          </div>
        )}
      </div>

      {/* Suggestions Dropdown */}
      {showSuggestions && suggestions.length > 0 && (
        <div className="absolute z-50 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg overflow-hidden">
          <div className="p-2 text-xs text-gray-500 border-b bg-gray-50">
            Suggestions
          </div>
          <div className="max-h-48 overflow-y-auto">
            {suggestions.map((suggestion, index) => (
              <button
                key={suggestion}
                type="button"
                onClick={() => handleSuggestionClick(suggestion)}
                className={cn(
                  "w-full px-3 py-2 text-left font-mono text-sm hover:bg-emerald-50 transition-colors",
                  "flex items-center justify-between",
                  index === 0 && "bg-emerald-50"
                )}
              >
                <span className="font-semibold">{suggestion}</span>
                <span className="text-xs text-gray-400">
                  {suggestion.length === 2 ? 'Pair' : 
                   suggestion.endsWith('s') ? 'Suited' : 'Offsuit'}
                </span>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Error Message with Action */}
      {error && (
        <div className="mt-1.5 flex items-center gap-2">
          <p className="text-xs text-red-500 flex-1">{error}</p>
          {needsModifier && (
            <div className="flex gap-1">
              <button
                type="button"
                onClick={() => handleModifierToggle('s')}
                className="text-xs px-2 py-0.5 bg-emerald-100 text-emerald-700 rounded hover:bg-emerald-200 transition-colors"
              >
                Make {rank1}{rank2}s
              </button>
              <button
                type="button"
                onClick={() => handleModifierToggle('o')}
                className="text-xs px-2 py-0.5 bg-gray-100 text-gray-700 rounded hover:bg-gray-200 transition-colors"
              >
                Make {rank1}{rank2}o
              </button>
            </div>
          )}
        </div>
      )}

      {/* Helper Text */}
      {!error && (
        <p className="mt-1 text-xs text-gray-500">
          {isPair ? `${rank1}${rank2} is a pocket pair` :
           modifier ? `${rank1}${rank2}${modifier.toLowerCase()} - ${modifier === 'S' ? 'suited' : 'offsuit'}` :
           'Type hand or click suggestions'}
        </p>
      )}
    </div>
  );
}
