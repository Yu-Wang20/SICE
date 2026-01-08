/**
 * Position Advantage Simulator
 * IP vs OOP decision tree with interactive exploration
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
import { ArrowLeft, GitBranch, Info, ChevronRight, ChevronDown } from "lucide-react";

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
        className={`flex items-center gap-2 p-2 rounded cursor-pointer hover:bg-gray-100 ${hasChildren ? '' : 'cursor-default'}`}
        onClick={() => hasChildren && onToggle(node.id)}
      >
        {hasChildren && (
          isExpanded ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />
        )}
        {!hasChildren && <div className="w-4" />}
        
        <span className={`px-2 py-1 rounded text-sm font-medium ${getActionColor(node.action)}`}>
          {node.action.replace(/_/g, ' ')}
        </span>
        
        <span className={`text-sm font-mono ${node.ev >= 0 ? 'text-green-600' : 'text-red-600'}`}>
          EV: {node.ev >= 0 ? '+' : ''}{node.ev.toFixed(2)}
        </span>
        
        <span className="text-sm text-gray-500">
          ({node.frequency}%)
        </span>
        
        {node.note && (
          <span className="text-xs text-gray-400 italic ml-2">
            {node.note}
          </span>
        )}
      </div>
      
      {hasChildren && isExpanded && (
        <div className="mt-1">
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

  return (
    <div className="min-h-screen bg-white text-black">
      {/* Header */}
      <header className="border-b-4 border-black">
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
            <Card className="border-2 border-black">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <GitBranch className="w-5 h-5" />
                  Scenario Setup
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Position Toggle */}
                <div className="flex items-center justify-between p-4 bg-gray-50 rounded">
                  <div>
                    <Label className="text-base font-medium">Your Position</Label>
                    <p className="text-sm text-gray-500">
                      {isIP ? 'In Position (IP) - Act last' : 'Out of Position (OOP) - Act first'}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={!isIP ? 'font-bold' : 'text-gray-400'}>OOP</span>
                    <Switch checked={isIP} onCheckedChange={setIsIP} />
                    <span className={isIP ? 'font-bold' : 'text-gray-400'}>IP</span>
                  </div>
                </div>

                {/* Street */}
                <div className="space-y-2">
                  <Label>Street</Label>
                  <Select value={street} onValueChange={(v) => setStreet(v as typeof street)}>
                    <SelectTrigger className="border-2 border-black">
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
                    <span className="font-mono font-bold">{potSize} BB</span>
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
                    <span className="font-mono font-bold">{stackSize} BB</span>
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
                  <div className="p-4 bg-blue-50 rounded">
                    <div className="text-sm text-blue-600">Stack-to-Pot Ratio (SPR)</div>
                    <div className="text-3xl font-bold text-blue-700">{result.spr}</div>
                    <div className="text-xs text-blue-500 mt-1">
                      {result.spr > 10 ? 'Deep - complex post-flop play' :
                       result.spr > 3 ? 'Medium - balanced decisions' :
                       'Short - commitment decisions'}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Theory Cards */}
            <Card className="border-2 border-orange-500 bg-orange-50">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-orange-700">
                  <Info className="w-5 h-5" />
                  Harsanyi Transformation
                </CardTitle>
              </CardHeader>
              <CardContent className="text-orange-800 text-sm">
                <p className="mb-2">
                  <strong>Harsanyi (1967)</strong> showed how to convert incomplete information games to imperfect information:
                </p>
                <p>
                  We model opponent's unknown cards as a <strong>belief state</strong> (probability distribution over hands), updated via Bayes' rule as new information arrives.
                </p>
              </CardContent>
            </Card>

            <Card className="border-2 border-purple-500 bg-purple-50">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-purple-700">
                  <Info className="w-5 h-5" />
                  DeepStack & ReBeL
                </CardTitle>
              </CardHeader>
              <CardContent className="text-purple-800 text-sm">
                <p className="mb-2">
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
            <Card className="border-2 border-black">
              <CardHeader>
                <div className="flex justify-between items-center">
                  <div>
                    <CardTitle className="flex items-center gap-2">
                      <GitBranch className="w-5 h-5" />
                      Decision Tree
                    </CardTitle>
                    <CardDescription>
                      {result?.positionAdvantage}
                    </CardDescription>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" onClick={expandAll}>
                      Expand All
                    </Button>
                    <Button variant="outline" size="sm" onClick={collapseAll}>
                      Collapse All
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                {treeQuery.isLoading ? (
                  <div className="animate-pulse space-y-4">
                    {[...Array(5)].map((_, i) => (
                      <div key={i} className="h-8 bg-gray-200 rounded" />
                    ))}
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
                  <p className="text-gray-500">No decision tree available</p>
                )}
              </CardContent>
            </Card>

            {/* Legend */}
            <Card className="border-2 border-black">
              <CardHeader>
                <CardTitle>Action Legend</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-1 rounded text-sm font-medium text-gray-600 bg-gray-50">check</span>
                    <span className="text-sm">Passive</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-1 rounded text-sm font-medium text-green-600 bg-green-50">bet</span>
                    <span className="text-sm">Aggressive</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-1 rounded text-sm font-medium text-blue-600 bg-blue-50">call</span>
                    <span className="text-sm">Continue</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-1 rounded text-sm font-medium text-red-600 bg-red-50">fold</span>
                    <span className="text-sm">Give up</span>
                  </div>
                </div>
                <div className="mt-4 text-sm text-gray-600">
                  <p><strong>EV</strong>: Expected Value in pot units (positive = profitable)</p>
                  <p><strong>Frequency</strong>: How often this action should be taken</p>
                </div>
              </CardContent>
            </Card>

            {/* Position Advantage Explanation */}
            <Card className={`border-2 ${isIP ? 'border-green-500 bg-green-50' : 'border-red-500 bg-red-50'}`}>
              <CardHeader>
                <CardTitle className={isIP ? 'text-green-700' : 'text-red-700'}>
                  {isIP ? '✅ Position Advantage' : '⚠️ Position Disadvantage'}
                </CardTitle>
              </CardHeader>
              <CardContent className={isIP ? 'text-green-800' : 'text-red-800'}>
                {isIP ? (
                  <ul className="space-y-2 text-sm">
                    <li>• <strong>Information advantage</strong>: See opponent's action before deciding</li>
                    <li>• <strong>Pot control</strong>: Can check back to realize equity</li>
                    <li>• <strong>Bluff efficiency</strong>: Can bluff after opponent shows weakness</li>
                    <li>• <strong>Value extraction</strong>: Can size bets optimally based on opponent's range</li>
                  </ul>
                ) : (
                  <ul className="space-y-2 text-sm">
                    <li>• <strong>Information disadvantage</strong>: Must act without knowing opponent's action</li>
                    <li>• <strong>Capped ranges</strong>: Strong hands often revealed by betting</li>
                    <li>• <strong>Check-raise required</strong>: Must trap to extract value</li>
                    <li>• <strong>Bluff vulnerability</strong>: Opponent can bluff after your check</li>
                  </ul>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}
