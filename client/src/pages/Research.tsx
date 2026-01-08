/**
 * Design Philosophy: Swiss Brutalism meets Digital Minimalism
 * Research Case Studies - Original content from PDF
 */

import { useLocation } from "wouter";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function Research() {
  const [, navigate] = useLocation();

  return (
    <div className="min-h-screen bg-white text-black">
      {/* Header */}
      <header className="border-b-8 border-black py-12">
        <div className="container">
          <button
            onClick={() => navigate("/")}
            className="flex items-center gap-2 text-sm font-mono mb-8 hover:opacity-60 transition-opacity"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Home
          </button>
          <div className="max-w-4xl">
            <h1 className="text-6xl md:text-7xl font-bold leading-tight mb-4">
              Research Case Studies
            </h1>
            <p className="text-lg text-gray-600">
              Practical Applications of Strategic Intelligence Theory
            </p>
          </div>
        </div>
      </header>

      {/* Intro */}
      <section className="py-16 md:py-24 bg-gray-50">
        <div className="container">
          <div className="max-w-4xl space-y-6">
            <p className="text-lg text-gray-800 leading-relaxed">
              The Strategic Intelligence Atlas provides theoretical foundations. This section explores real-world applications where these principles manifest: from fusion reactors managed by AI, to superhuman game-playing systems, to the cognitive biases that shape human decision-making.
            </p>
          </div>
        </div>
      </section>

      {/* Case Study 1 */}
      <section className="py-24 md:py-32 border-b-8 border-black">
        <div className="container">
          <div className="max-w-4xl space-y-8">
            <div>
              <h2 className="text-5xl md:text-6xl font-bold leading-tight mb-4">
                The Fusion Reactor Run by AI
              </h2>
              <div className="h-2 w-24 bg-[#0066FF]" />
            </div>

            <div className="space-y-6 text-lg leading-relaxed text-gray-800">
              <p>
                In 2022, researchers at the Lawrence Livermore National Laboratory achieved a historic milestone: for the first time, a fusion reaction produced more energy than was consumed. This breakthrough in nuclear fusion—the holy grail of clean energy—was made possible not by new physics, but by artificial intelligence.
              </p>

              <p>
                Controlling a fusion reactor is one of the most complex control problems in existence. The plasma must be maintained at 100 million degrees Celsius, confined by magnetic fields with picosecond-level precision. The system has hundreds of variables, thousands of possible failure modes, and dynamics that are only partially understood.
              </p>

              <p>
                Traditional control systems, designed by physicists and engineers, could stabilize the plasma for seconds at a time. But they were brittle: any deviation from expected conditions would cause the system to collapse. The challenge was that fusion reactors are inherently non-stationary—every shot is slightly different, and the system must adapt in real-time.
              </p>

              <p>
                Enter machine learning. Researchers trained a deep reinforcement learning system on thousands of simulated fusion shots. The AI learned to predict how the plasma would respond to different control inputs, and it developed strategies for maintaining stability across a wide range of conditions.
              </p>

              <p>
                The result: the AI-controlled fusion reactor achieved sustained plasma confinement that exceeded what human-designed controllers could achieve. The AI didn't discover new physics—it discovered new control strategies that humans hadn't imagined.
              </p>

              <p>
                This exemplifies the Bitter Lesson: in a complex, high-dimensional domain with abundant data, a general learning algorithm outperforms human expertise. The fusion reactor case shows that this principle applies not just to games, but to real-world engineering challenges.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Case Study 2 */}
      <section className="py-24 md:py-32 border-b-8 border-black bg-gray-50">
        <div className="container">
          <div className="max-w-4xl space-y-8">
            <div>
              <h2 className="text-5xl md:text-6xl font-bold leading-tight mb-4">
                The Grandmaster Beaten by a Novice
              </h2>
              <div className="h-2 w-24 bg-[#6B46C1]" />
            </div>

            <div className="space-y-6 text-lg leading-relaxed text-gray-800">
              <p>
                In 2016, Lee Sedol, one of the world's greatest Go players, faced off against AlphaGo in a match that would reshape our understanding of artificial intelligence. For thousands of years, Go had been considered the ultimate test of human intuition and strategic thinking. A player must balance immediate tactics with long-term strategy, adapting to an opponent's moves while maintaining a coherent overall plan.
              </p>

              <p>
                Lee Sedol had devoted his life to mastering Go. He had studied thousands of games, internalized centuries of strategic wisdom, and developed an intuition that allowed him to see patterns invisible to weaker players. He was confident he would win.
              </p>

              <p>
                AlphaGo had no such knowledge. It was trained purely through self-play, with no human games in its training data. It had never studied the classics of Go. Yet it defeated Lee Sedol 4-1.
              </p>

              <p>
                What's remarkable is not just that AlphaGo won, but how it won. In Game 2, AlphaGo played Move 37—a move that violated every principle of Go strategy that humans had learned. It was a move that no human would ever play. And yet it led to victory.
              </p>

              <p>
                This moment crystallized the Bitter Lesson. AlphaGo didn't win by playing Go better than humans—it won by discovering that the strategic landscape of Go was fundamentally different from what humans believed. The principles that humans had internalized over millennia were not universal truths; they were heuristics that worked well in practice but were suboptimal in theory.
              </p>

              <p>
                The deeper lesson: in any domain where computation is available and data is abundant, machines will eventually discover strategies that violate human intuition. This doesn't mean human intuition is worthless—it means human intuition is optimized for ancestral environments, not for the full strategic landscape.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Case Study 3 */}
      <section className="py-24 md:py-32 border-b-8 border-black">
        <div className="container">
          <div className="max-w-4xl space-y-8">
            <div>
              <h2 className="text-5xl md:text-6xl font-bold leading-tight mb-4">
                The Flaw in Your Own Brain
              </h2>
              <div className="h-2 w-24 bg-[#FF6B35]" />
            </div>

            <div className="space-y-6 text-lg leading-relaxed text-gray-800">
              <p>
                While AI systems have been discovering superhuman strategies, cognitive scientists have been discovering superhuman flaws in human thinking. Kahneman and Tversky's Prospect Theory revealed that human decision-making is riddled with predictable biases that systematically lead to suboptimal choices.
              </p>

              <h3 className="text-2xl font-bold mt-8 mb-4">Loss Aversion</h3>
              <p>
                Humans are roughly twice as sensitive to losses as to gains. A loss of $100 feels worse than a gain of $100 feels good. This asymmetry is rational in stable environments but catastrophic in volatile ones. In trading, loss aversion causes retail investors to sell winners too early and hold losers too long—the opposite of optimal strategy.
              </p>

              <h3 className="text-2xl font-bold mt-8 mb-4">Framing Effects</h3>
              <p>
                The same choice presented differently leads to different decisions. When a medical treatment is described as having a "90% survival rate," people are more likely to choose it than when it's described as having a "10% mortality rate"—even though these are identical. This violates the principle of rational choice.
              </p>

              <h3 className="text-2xl font-bold mt-8 mb-4">Anchoring</h3>
              <p>
                The first number you see influences your estimate of subsequent numbers. In negotiations, whoever makes the first offer has a systematic advantage. In pricing, the original price anchors perceptions of value. This bias is so powerful that it persists even when people are aware of it.
              </p>

              <h3 className="text-2xl font-bold mt-8 mb-4">Representativeness Bias</h3>
              <p>
                Humans judge probability by how similar something is to a typical example. A person who is quiet and organized is judged as more likely to be an accountant than a lawyer, even if there are far more lawyers than accountants. This violates Bayes' rule.
              </p>

              <p className="mt-8">
                These biases aren't quirks of individual psychology—they're systematic features of human cognition. And they're exploitable. A trader who understands loss aversion can predict panic-selling. A negotiator who understands anchoring can exploit the first offer. An AI system that understands representativeness bias can manipulate human judgment.
              </p>

              <p>
                The profound irony: as we engineer machines that overcome the laws of physics, we're simultaneously discovering that we can't overcome the laws of our own minds. The biases that shaped our evolution persist in the modern world, leading us to make systematically suboptimal decisions.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Case Study 4 */}
      <section className="py-24 md:py-32 border-b-8 border-black bg-gray-50">
        <div className="container">
          <div className="max-w-4xl space-y-8">
            <div>
              <h2 className="text-5xl md:text-6xl font-bold leading-tight mb-4">
                Future Frontiers
              </h2>
              <div className="h-2 w-24 bg-[#10B981]" />
            </div>

            <div className="space-y-6 text-lg leading-relaxed text-gray-800">
              <p>
                The convergence of AI capability, theoretical understanding, and computational power is accelerating. We're entering an era where machines can solve problems that were previously thought to require human creativity and intuition.
              </p>

              <h3 className="text-2xl font-bold mt-8 mb-4">Protein Folding</h3>
              <p>
                AlphaFold solved a 50-year-old problem in structural biology by predicting how proteins fold into 3D structures. This breakthrough accelerated drug discovery and biological research by years.
              </p>

              <h3 className="text-2xl font-bold mt-8 mb-4">Theorem Proving</h3>
              <p>
                AI systems are now proving mathematical theorems that had stumped mathematicians for years. This suggests that mathematical creativity—long thought to be uniquely human—is amenable to computational approaches.
              </p>

              <h3 className="text-2xl font-bold mt-8 mb-4">Scientific Discovery</h3>
              <p>
                AI systems are discovering new materials, designing new drugs, and uncovering patterns in scientific data that humans missed. The future of science may be a collaboration between human intuition and machine pattern recognition.
              </p>

              <p className="mt-8">
                As these capabilities expand, the question becomes not "what can AI do?" but "what should AI do?" The Strategic Intelligence Atlas provides the technical foundation. The ethical and social questions remain.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 md:py-32 bg-black text-white">
        <div className="container">
          <div className="max-w-4xl mx-auto text-center space-y-8">
            <h2 className="text-5xl md:text-6xl font-bold leading-tight">
              Ready to Dive Deeper?
            </h2>
            <p className="text-xl text-gray-300">
              Explore the Strategic Intelligence Atlas to understand the theoretical foundations of these breakthroughs.
            </p>

            <div className="flex flex-col md:flex-row gap-4 justify-center pt-8">
              <Button
                size="lg"
                className="bg-white text-black hover:bg-gray-200"
                onClick={() => navigate("/atlas")}
              >
                Explore the Atlas
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="border-2 border-white text-white hover:bg-white hover:text-black"
                onClick={() => navigate("/")}
              >
                Back to Home
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
