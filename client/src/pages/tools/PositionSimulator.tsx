/**
 * Position Advantage Simulator
 * IP vs OOP decision tree with interactive exploration
 * Fixed: Corrected EV value display and added multi-street support
 */

import { useState } from "react";
import { useLocation } from "wouter";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { ArrowLeft, GitBranch, Info, ChevronRight, ChevronDown, TrendingUp, TrendingDown } from "lucide-react";

const STREETS = ['flop', 'turn', 'river'] as const;

interface DecisionNode {
  id: string;
  action: string;
  ev: number;
  frequency: number;
  children?: DecisionNode[];
  note?: string;
}

function DecisionTreeNode({ 
  node, 
  depth = 0,
  expanded,
  onToggle 
}: { 
  node: DecisionNode; 
  depth?: number;
  expanded: Set<string>;
  onToggle: (id: string) => void;
}) {
  const hasChildren = node.children && node.children.length > 0;
  const isExpanded = expanded.has(node.id);
  
  const getActionColor = (action: string) => {
    if (action.includes('fold')) return 'text-red-600 bg-red-50';
    if (action.includes('call')) return 'text-blue-600 bg-blue-50';
    if (action.includes('bet') || action.includes('raise') || action.includes('shove')) return 'text-green-600 bg-green-50';
    if (action.includes('check')) return 'text-gray-600 bg-gray-50';
    return 'text-purple-600 bg-purple-50';
  };

  return (
    <div className={`${depth > 0 ? 'ml-6 border-l-2 border-gray-200 pl-4' : ''}`}>
      <div 
        className={`flex items-center gap-3 p-3 rounded cursor-pointer hover:bg-gray-100 transition-colors ${hasChildren ? '' : 'cursor-default'}`}
        onClick={() => hasChildren && onToggle(node.id)}
      >
        {hasChildren && (
          isExpanded ? <ChevronDown className="w-4 h-4 flex-shrink-0" /> : <ChevronRight className="w-4 h-4 flex-shrink-0" />
        )}
        {!hasChildren && <div className="w-4 flex-shrink-0" />}
        
        <span className={`px-3 py-1 rounded text-sm font-medium whitespace-nowrap ${getActionColor(node.action)}`}>
          {node.action.replace(/_/g, ' ')}
        </span>
        
        <div className="flex items-center gap-4 ml-auto">
          <div className={`flex items-center gap-1 font-mono text-sm ${node.ev >= 0 ? 'text-green-600' : 'text-red-600'}`}>
            {node.ev >= 0 ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
            <span className="font-bold">{node.ev >= 0 ? '+' : ''}{node.ev.toFixed(2)} BB</span>
          </div>
          
          <span className="text-sm text-gray-500 font-medium min-w-12 text-right">
            {node.frequency}%
          </span>
          
          {node.note && (
            <span className="text-xs text-gray-500 italic max-w-32 truncate">
              {node.note}
            </span>
          )}
        </div>
      </div>
      
      {hasChildren && isExpanded && (
        <div className="mt-2">
          {node.children!.map((child) => (
            <DecisionTreeNode 
              key={child.id} 
              node={child} 
              depth={depth + 1}
              expanded={expanded}
              onToggle={onToggle}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export default function PositionSimulator() {
  const [, navigate] = useLocation();
  const [isIP, setIsIP] = useState(true);
  const [street, setStreet] = useState<typeof STREETS[number]>('flop');
  const [potSize, setPotSize] = useState(100);
  const [stackSize, setStackSize] = useState(300);
  const [expandedNodes, setExpandedNodes] = useState<Set<string>>(new Set());

  // Get decision tree
  const treeQuery = trpc.poker.position.getDecisionTree.useQuery({
    isIP,
    street,
    potSize,
    stackSize,
  });

  const toggleNode = (id: string) => {
    setExpandedNodes(prev => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  const expandAll = () => {
    if (treeQuery.data?.nodes) {
      const allIds = new Set<string>();
      const collectIds = (nodes: DecisionNode[]) => {
        nodes.forEach(node => {
          allIds.add(node.id);
          if (node.children) collectIds(node.children);
        });
      };
      collectIds(treeQuery.data.nodes);
      setExpandedNodes(allIds);
    }
  };

  const collapseAll = () => {
    setExpandedNodes(new Set());
  };

  const result = treeQuery.data;

  // Calculate average EV from top-level nodes
  const avgEV = result?.nodes ? 
    result.nodes.reduce((sum, n) => sum + (n.ev * n.frequency / 100), 0) : 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-white to-gray-50">
      {/* Header */}
      <header className="bg-white border-b sticky top-0 z-40">
        <div className="container py-6">
          <Button
            variant="ghost"
            className="mb-4"
            onClick={() => navigate("/tools")}
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Tools
          </Button>
          <h1 className="text-4xl md:text-5xl font-bold">Position Simulator</h1>
          <p className="text-xl text-gray-600 mt-2">
            Explore IP vs OOP decision trees with interactive visualization
          </p>
        </div>
      </header>

      <main className="container py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Input Section */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <GitBranch className="w-5 h-5" />
                  Scenario Setup
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Position Toggle */}
                <div className="flex items-center justify-between p-4 bg-emerald-50 rounded-lg border border-emerald-200">
                  <div>
                    <Label className="text-base font-medium">Your Position</Label>
                    <p className="text-sm text-gray-600">
                      {isIP ? 'In Position (IP) - Act last' : 'Out of Position (OOP) - Act first'}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={!isIP ? 'font-bold text-gray-900' : 'text-gray-400'}>OOP</span>
                    <Switch checked={isIP} onCheckedChange={setIsIP} />
                    <span className={isIP ? 'font-bold text-gray-900' : 'text-gray-400'}>IP</span>
                  </div>
                </div>

                {/* Street */}
                <div className="space-y-2">
                  <Label>Street</Label>
                  <Select value={street} onValueChange={(v) => setStreet(v as typeof street)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="flop">Flop</SelectItem>
                      <SelectItem value="turn">Turn</SelectItem>
                      <SelectItem value="river">River</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Pot Size */}
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <Label>Pot Size</Label>
                    <span className="font-mono font-bold text-emerald-600">{potSize} BB</span>
                  </div>
                  <Slider
                    min={20}
                    max={500}
                    step={10}
                    value={[potSize]}
                    onValueChange={([v]) => setPotSize(v)}
                  />
                </div>

                {/* Stack Size */}
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <Label>Effective Stack</Label>
                    <span className="font-mono font-bold text-emerald-600">{stackSize} BB</span>
                  </div>
                  <Slider
                    min={50}
                    max={1000}
                    step={25}
                    value={[stackSize]}
                    onValueChange={([v]) => setStackSize(v)}
                  />
                </div>

                {/* SPR Display */}
                {result && (
                  <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                    <div className="text-sm text-blue-600 font-medium">Stack-to-Pot Ratio (SPR)</div>
                    <div className="text-3xl font-bold text-blue-700 mt-1">{result.spr}x</div>
                    <div className="text-xs text-blue-600 mt-2">
                      {result.spr > 10 ? '📊 Deep stacked - complex post-flop play' :
                       result.spr > 3 ? '⚖️ Medium - balanced decisions' :
                       '⚡ Short stack - commitment decisions'}
                    </div>
                  </div>
                )}

                {/* Average EV */}
                {result && (
                  <div className={`p-4 rounded-lg border ${avgEV >= 0 ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'}`}>
                    <div className={`text-sm font-medium ${avgEV >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                      Average EV (Weighted)
                    </div>
                    <div className={`text-3xl font-bold mt-1 ${avgEV >= 0 ? 'text-green-700' : 'text-red-700'}`}>
                      {avgEV >= 0 ? '+' : ''}{avgEV.toFixed(3)} BB
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Theory Cards */}
            <Card className="border-l-4 border-l-orange-500 bg-orange-50">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-orange-700 text-base">
                  <Info className="w-5 h-5" />
                  Harsanyi Transformation
                </CardTitle>
              </CardHeader>
              <CardContent className="text-orange-800 text-sm space-y-2">
                <p>
                  <strong>Harsanyi (1967)</strong> showed how to convert incomplete information games to imperfect information:
                </p>
                <p>
                  We model opponent's unknown cards as a <strong>belief state</strong> (probability distribution over hands), updated via Bayes' rule.
                </p>
              </CardContent>
            </Card>

            <Card className="border-l-4 border-l-purple-500 bg-purple-50">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-purple-700 text-base">
                  <Info className="w-5 h-5" />
                  DeepStack & ReBeL
                </CardTitle>
              </CardHeader>
              <CardContent className="text-purple-800 text-sm space-y-2">
                <p>
                  <strong>DeepStack (2017)</strong> and <strong>ReBeL (2020)</strong> use nested subgame solving with belief states.
                </p>
                <p>
                  This decision tree is a simplified version of the game-theoretic reasoning these AI systems employ.
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Decision Tree */}
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="flex items-center gap-2">
                      <GitBranch className="w-5 h-5" />
                      Decision Tree
                    </CardTitle>
                    <CardDescription className="mt-2">
                      {result?.positionAdvantage}
                    </CardDescription>
                  </div>
                  <div className="flex gap-2">
                    <Button size="sm" variant="outline" onClick={expandAll}>
                      Expand All
                    </Button>
                    <Button size="sm" variant="outline" onClick={collapseAll}>
                      Collapse
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                {treeQuery.isLoading ? (
                  <div className="flex items-center justify-center py-12">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-600"></div>
                  </div>
                ) : result?.nodes ? (
                  <div className="space-y-2">
                    {result.nodes.map((node) => (
                      <DecisionTreeNode
                        key={node.id}
                        node={node}
                        expanded={expandedNodes}
                        onToggle={toggleNode}
                      />
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-500 text-center py-8">No decision tree available</p>
                )}
              </CardContent>
            </Card>

            {/* Legend */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Legend</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div className="flex items-center gap-2">
                    <div className="px-2 py-1 rounded bg-red-50 text-red-600 font-medium">Fold</div>
                    <span className="text-gray-600">Fold action</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="px-2 py-1 rounded bg-blue-50 text-blue-600 font-medium">Call</div>
                    <span className="text-gray-600">Call action</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="px-2 py-1 rounded bg-green-50 text-green-600 font-medium">Bet/Raise</div>
                    <span className="text-gray-600">Aggressive action</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="px-2 py-1 rounded bg-gray-50 text-gray-600 font-medium">Check</div>
                    <span className="text-gray-600">Check action</span>
                  </div>
                </div>
                <div className="mt-4 pt-4 border-t text-xs text-gray-600">
                  <p><strong>EV:</strong> Expected value in big blinds</p>
                  <p><strong>Frequency:</strong> Recommended play frequency in GTO</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}
