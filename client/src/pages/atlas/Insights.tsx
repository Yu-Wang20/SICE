/**
 * Design Philosophy: Swiss Brutalism meets Digital Minimalism
 * Chapter 5: Key Insights & Reflections
 * Color: Crimson Red (#DC2626)
 */

import { useLocation } from "wouter";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function Insights() {
  const [, navigate] = useLocation();

  return (
    <div className="min-h-screen bg-white text-black">
      {/* Header */}
      <header className="border-b-8 border-black py-12">
        <div className="container">
          <button
            onClick={() => navigate("/atlas")}
            className="flex items-center gap-2 text-sm font-mono mb-8 hover:opacity-60 transition-opacity"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Atlas
          </button>
          <div className="max-w-4xl">
            <h1 className="text-6xl md:text-7xl font-bold leading-tight mb-4">
              Key Insights & Reflections
            </h1>
            <p className="text-lg font-mono text-gray-600">
              Synthesis and Future Directions
            </p>
          </div>
        </div>
      </header>

      {/* Insight 1 */}
      <section className="py-24 md:py-32 border-b-8 border-black">
        <div className="container">
          <div className="max-w-4xl space-y-8">
            <div>
              <div className="text-8xl font-bold outline-text mb-6" style={{ color: "#DC2626" }}>
                01
              </div>
              <h2 className="text-5xl md:text-6xl font-bold leading-tight mb-4">
                From "Teaching Machines" to "Machine Learning"
              </h2>
              <div className="h-2 w-24 bg-[#DC2626]" />
            </div>

            <div className="space-y-6 text-lg leading-relaxed text-gray-800">
              <p>
                The first 50 years of AI research were dominated by a paradigm: encode human knowledge into machines. Expert systems, hand-crafted features, linguistic rules—all reflected the belief that intelligence came from explicit knowledge representation.
              </p>

              <p>
                Then came the Bitter Lesson. The most successful AI systems don't learn from human expertise—they learn from raw data through general algorithms. AlphaGo Zero learned Go without studying a single human game. GPT learned language without linguistic rules. AlphaFold learned protein folding without biologists' domain knowledge.
              </p>

              <p>
                This represents a fundamental shift in how we think about intelligence. We've moved from "teaching machines how to think" to "letting machines learn how to think." The implications are profound: in any domain where data is abundant and compute is available, machines will eventually discover strategies that violate human intuition.
              </p>

              <blockquote className="border-l-4 border-[#DC2626] pl-6 py-4 bg-gray-50 font-mono text-base italic">
                The era of hand-crafted intelligence is ending. The era of learned intelligence has begun.
              </blockquote>
            </div>
          </div>
        </div>
      </section>

      {/* Insight 2 */}
      <section className="py-24 md:py-32 border-b-8 border-black bg-gray-50">
        <div className="container">
          <div className="max-w-4xl space-y-8">
            <div>
              <div className="text-8xl font-bold outline-text mb-6" style={{ color: "#DC2626" }}>
                02
              </div>
              <h2 className="text-5xl md:text-6xl font-bold leading-tight mb-4">
                Uncertainty is the Essence of Strategy
              </h2>
              <div className="h-2 w-24 bg-[#DC2626]" />
            </div>

            <div className="space-y-6 text-lg leading-relaxed text-gray-800">
              <p>
                Modern AI systems don't seek "perfect" strategies—they seek strategies that are robust against uncertainty. This is a subtle but profound shift in how we think about optimality.
              </p>

              <p>
                Kolmogorov taught us to quantify uncertainty. Doob taught us that in fair games, the best you can do is not lose. Harsanyi taught us to reason about hidden information. And modern AI systems like Pluribus and DeepSeek-R1 implement these principles: they maintain probability distributions over possible states, and they compute strategies that perform well across all possibilities weighted by their likelihood.
              </p>

              <p>
                The key insight is that the most strategic decision-makers aren't those who predict the future perfectly—they're those who make good decisions given their uncertainty. This is why CFR+ algorithms work: they don't try to solve the game perfectly; they compute strategies that minimize regret across all possible scenarios.
              </p>

              <p>
                In a world of incomplete information and non-stationary environments, the ability to make good decisions despite uncertainty is the ultimate competitive advantage.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Insight 3 */}
      <section className="py-24 md:py-32 border-b-8 border-black">
        <div className="container">
          <div className="max-w-4xl space-y-8">
            <div>
              <div className="text-8xl font-bold outline-text mb-6" style={{ color: "#DC2626" }}>
                03
              </div>
              <h2 className="text-5xl md:text-6xl font-bold leading-tight mb-4">
                Cognitive Bias is Exploitable
              </h2>
              <div className="h-2 w-24 bg-[#DC2626]" />
            </div>

            <div className="space-y-6 text-lg leading-relaxed text-gray-800">
              <p>
                Kahneman and Tversky's Prospect Theory revealed that human decision-making is riddled with predictable biases: loss aversion, framing effects, anchoring, representativeness bias. We thought these were quirks of human psychology. But they're actually exploitable vulnerabilities.
              </p>

              <p>
                When AI systems face human opponents (in trading, negotiation, or any non-stationary environment), they can leverage these biases. A trader who understands loss aversion can predict how retail investors will panic-sell. A negotiator who understands anchoring can exploit the first offer. A system that understands framing effects can present options in ways that nudge humans toward desired outcomes.
              </p>

              <p>
                This raises an ethical question: is it acceptable to exploit human cognitive biases? The answer depends on context. In competitive domains (trading, poker), exploitation is expected. In domains involving vulnerable populations (healthcare, financial advice), it's ethically problematic. But the technical reality is clear: human biases are exploitable, and AI systems will exploit them unless we design safeguards.
              </p>

              <p>
                The deeper insight is that understanding human irrationality is as important as understanding rational strategy. The future of strategic intelligence requires both.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Insight 4 */}
      <section className="py-24 md:py-32 border-b-8 border-black bg-gray-50">
        <div className="container">
          <div className="max-w-4xl space-y-8">
            <div>
              <div className="text-8xl font-bold outline-text mb-6" style={{ color: "#DC2626" }}>
                04
              </div>
              <h2 className="text-5xl md:text-6xl font-bold leading-tight mb-4">
                Compute is Power
              </h2>
              <div className="h-2 w-24 bg-[#DC2626]" />
            </div>

            <div className="space-y-6 text-lg leading-relaxed text-gray-800">
              <p>
                The Bitter Lesson's ultimate implication is that computational power is the primary constraint on AI capability. As Moore's Law continues (or its modern equivalents), the systems with access to more compute will have a decisive advantage.
              </p>

              <p>
                This has profound implications for the future. Countries and companies that can afford massive compute will be able to train AI systems that are orders of magnitude more capable than those trained with limited resources. The gap between frontier AI and commodity AI will widen, not narrow.
              </p>

              <p>
                Moreover, the advantage compounds. Better AI systems can be used to design better chips, which enables more compute, which enables better AI. This virtuous cycle means that early leaders in compute will maintain their advantage indefinitely.
              </p>

              <p>
                For individuals and organizations without access to frontier compute, the path forward is different: focus on data, domain expertise, and algorithmic innovation in areas where compute isn't the bottleneck. But for the most capable systems, compute will remain king.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Conclusion */}
      <section className="py-24 md:py-32 bg-black text-white">
        <div className="container">
          <div className="max-w-4xl mx-auto space-y-8">
            <h2 className="text-5xl md:text-6xl font-bold leading-tight">
              The Human Element in a World of AI
            </h2>
            <div className="h-2 w-24 bg-[#DC2626]" />

            <div className="space-y-6 text-lg leading-relaxed text-gray-300">
              <p>
                The simultaneous acceleration of AI's power, the discovery of its surprising brittleness, and our deepening understanding of our own cognitive flaws aren't separate trends. They are the defining parameters of our age.
              </p>

              <p>
                We are engineering machines that can overcome the laws of physics (fusion reactors), master games that have stumped humanity for millennia (Go), and reason through complex problems at superhuman speed (theorem proving). Yet these same systems can be defeated by simple adversarial attacks, and they remain dependent on human feedback for alignment.
              </p>

              <p>
                Meanwhile, we're discovering that human intelligence—despite its brilliance—is fundamentally limited by cognitive biases that we can't escape. We overweight recent information, we're loss-averse, we're anchored by initial offers, we fall prey to representativeness bias. These aren't bugs in human thinking; they're features that evolved for ancestral environments but are maladaptive in modern strategic contexts.
              </p>

              <p className="text-2xl font-bold text-white pt-8">
                As we engineer machines that can overcome the laws of physics, how do we re-engineer our thinking to overcome the predictable flaws in our own minds?
              </p>

              <p className="pt-8">
                The Strategic Intelligence Atlas provides a map. It shows how mathematics, strategy, and computation converge to create superhuman decision-making systems. But the ultimate challenge is human: how do we use this knowledge wisely? How do we build AI systems that augment human intelligence rather than replace it? How do we ensure that the power of strategic intelligence is used for flourishing rather than exploitation?
              </p>

              <p>
                These questions will define the next century. The mathematics is settled. The algorithms are known. The remaining challenge is wisdom.
              </p>
            </div>

            <div className="pt-12">
              <Button
                size="lg"
                variant="outline"
                className="bg-transparent border-2 border-white text-white hover:bg-white hover:text-black"
                onClick={() => navigate("/research")}
              >
                Explore Research Case Studies
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Footer Navigation */}
      <section className="py-16 bg-white border-t-8 border-black">
        <div className="container">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <Button
              variant="outline"
              className="border-2 border-black"
              onClick={() => navigate("/atlas")}
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Atlas
            </Button>
            <Button
              className="bg-black text-white hover:bg-gray-800"
              onClick={() => navigate("/")}
            >
              Back to Home
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
