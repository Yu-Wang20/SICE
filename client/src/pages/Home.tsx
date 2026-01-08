/**
 * Design Philosophy: Swiss Brutalism meets Digital Minimalism
 * - High contrast black/white with surgical accent colors
 * - Asymmetric grid, oversized typography
 * - Precise interactions, no unnecessary flourishes
 * - Each section has semantic color: blue=AI, purple=game theory, orange=cognitive, green=innovation, red=economics
 */

import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { ArrowDown, ExternalLink } from "lucide-react";

export default function Home() {
  const [scrollProgress, setScrollProgress] = useState(0);
  const sectionsRef = useRef<(HTMLElement | null)[]>([]);

  useEffect(() => {
    const handleScroll = () => {
      const windowHeight = window.innerHeight;
      const documentHeight = document.documentElement.scrollHeight - windowHeight;
      const scrolled = window.scrollY;
      const progress = (scrolled / documentHeight) * 100;
      setScrollProgress(progress);

      // Animate sections on scroll
      sectionsRef.current.forEach((section) => {
        if (section) {
          const rect = section.getBoundingClientRect();
          if (rect.top < windowHeight * 0.8) {
            section.classList.add("animate-fade-up");
          }
        }
      });
    };

    window.addEventListener("scroll", handleScroll);
    handleScroll(); // Initial check
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className="min-h-screen bg-white text-black">
      {/* Scroll Progress Indicator */}
      <div className="fixed left-8 top-0 h-screen w-1 bg-gray-200 z-50">
        <div
          className="w-full bg-black transition-all duration-100"
          style={{ height: `${scrollProgress}%` }}
        />
      </div>

      {/* Hero Section */}
      <section className="min-h-screen flex items-center relative overflow-hidden">
        {/* Background Image */}
        <div
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage: "url(/images/hero-abstract.png)",
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        />

        <div className="container relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            {/* Left: Typography (60%) */}
            <div className="lg:col-span-7 space-y-8">
              <h1 className="text-6xl md:text-7xl lg:text-8xl font-bold leading-[0.95] tracking-tight">
                The Fusion Reactor Run by AI, the Grandmaster Beaten by a Novice,{" "}
                <span className="outline-text">and the Flaw</span> in Your Own Brain
              </h1>
              <p className="text-xl md:text-2xl text-gray-700 max-w-2xl leading-relaxed">
                Exploring the frontiers of artificial intelligence, game theory, and human cognition—where
                technology reveals startlingly clear reflections of how the world works.
              </p>
              <div className="flex gap-4 pt-4">
                <Button
                  size="lg"
                  className="bg-black text-white hover:bg-gray-800 text-lg px-8 py-6 transition-all duration-200 hover:scale-105"
                  onClick={() => {
                    document.getElementById("section-1")?.scrollIntoView({ behavior: "smooth" });
                  }}
                >
                  Explore Research
                </Button>
              </div>
            </div>

            {/* Right: Visual accent (40%) */}
            <div className="lg:col-span-5 flex justify-center lg:justify-end">
              <div className="relative">
                <div className="text-[200px] font-bold outline-text opacity-20">01</div>
              </div>
            </div>
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-12 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 animate-bounce">
          <span className="text-sm font-mono uppercase tracking-wider">Scroll</span>
          <ArrowDown className="w-6 h-6" />
        </div>
      </section>

      {/* Section Divider */}
      <div className="section-divider" />

      {/* Section 1: AI & Physics */}
      <section
        id="section-1"
        ref={(el) => { sectionsRef.current[0] = el; }}
        className="py-24 md:py-32 bg-white opacity-0"
      >
        <div className="container">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            {/* Image */}
            <div className="order-2 lg:order-1">
              <img
                src="/images/fusion-reactor.png"
                alt="Fusion Reactor"
                className="w-full h-auto transition-transform duration-300 hover:scale-105"
              />
            </div>

            {/* Content */}
            <div className="order-1 lg:order-2 space-y-6">
              <div className="text-8xl font-bold outline-text" style={{ color: "#0066FF" }}>
                02
              </div>
              <h2 className="text-5xl md:text-6xl font-bold leading-tight">
                AI Is Tackling the Laws of Physics
              </h2>
              <div className="h-2 w-24 bg-[#0066FF]" />
              <div className="space-y-4 text-lg leading-relaxed text-gray-800">
                <p>
                  While many associate artificial intelligence with chatbots or image generators, its most
                  transformative applications are taking place in the complex world of physical sciences. One
                  of the most significant examples is in the race to achieve nuclear fusion—the process that
                  powers the sun—to create a source of limitless clean energy on Earth.
                </p>
                <p>
                  Commonwealth Fusion Systems (CFS), the world's largest private nuclear fusion company, is
                  working to make this a reality. In partnership with Nvidia and Siemens, CFS is using an
                  AI-based "digital twin" to accelerate its research.
                </p>
                <blockquote className="border-l-4 border-[#0066FF] pl-6 py-2 font-mono text-base italic">
                  "Through this cooperation, we have shortened the manual experiment process, which can take
                  years, and have the infrastructure to complete virtual optimization within weeks."
                  <footer className="text-sm mt-2 not-italic">— Bob Mumgard, CEO of CFS</footer>
                </blockquote>
                <p>
                  The promise is closer than ever: "Nuclear fusion is no longer a distant future story in 20
                  years, but a reality that will unfold in 20 months."
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Section 2: Superhuman AI Vulnerability */}
      <section
        ref={(el) => { sectionsRef.current[1] = el; }}
        className="py-24 md:py-32 bg-gray-50 diagonal-cut-top diagonal-cut-bottom opacity-0"
      >
        <div className="container">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            {/* Content */}
            <div className="space-y-6">
              <div className="text-8xl font-bold outline-text" style={{ color: "#6B46C1" }}>
                03
              </div>
              <h2 className="text-5xl md:text-6xl font-bold leading-tight">
                You Can Beat a Superhuman AI
              </h2>
              <div className="h-2 w-24 bg-[#6B46C1]" />
              <div className="space-y-4 text-lg leading-relaxed text-gray-800">
                <p>
                  We tend to assume that once an AI achieves superhuman performance in a task, like the
                  complex board game Go, it becomes virtually unbeatable. However, recent research reveals a
                  stunning and counter-intuitive vulnerability in these advanced systems.
                </p>
                <p>
                  Researchers have developed adversarial strategies that achieve win rates over 97% against
                  superhuman Go AI. The crucial insight is how they did it: these wins were achieved{" "}
                  <strong>
                    "not through superior Go play but by exploiting fundamental vulnerabilities in how AI
                    systems process information outside their training distributions."
                  </strong>
                </p>
                <p className="font-mono text-base bg-white p-6 border-2 border-black">
                  It's the strategic equivalent of defeating a brilliant swordsman who has mastered a
                  thousand parries but has never been taught how to block a simple kick.
                </p>
                <p>
                  This is a critical reminder that even the most powerful AI is not "intelligent" in the same
                  adaptable, generalized way a human is. Its mastery is deep but narrow.
                </p>
              </div>
            </div>

            {/* Image */}
            <div>
              <img
                src="/images/go-board-abstract.png"
                alt="Go Board Strategy"
                className="w-full h-auto transition-transform duration-300 hover:scale-105"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Section 3: Cognitive Biases */}
      <section
        ref={(el) => { sectionsRef.current[2] = el; }}
        className="py-24 md:py-32 bg-white opacity-0"
      >
        <div className="container">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            {/* Image */}
            <div>
              <img
                src="/images/brain-neural.png"
                alt="Brain Neural Networks"
                className="w-full h-auto transition-transform duration-300 hover:scale-105"
              />
            </div>

            {/* Content */}
            <div className="space-y-6">
              <div className="text-8xl font-bold outline-text" style={{ color: "#FF6B35" }}>
                04
              </div>
              <h2 className="text-5xl md:text-6xl font-bold leading-tight">
                Your Brain's Predictable Flaws
              </h2>
              <div className="h-2 w-24 bg-[#FF6B35]" />
              <div className="space-y-4 text-lg leading-relaxed text-gray-800">
                <p>
                  For decades, economic models were built on the assumption that humans are "rational actors"
                  who make logical decisions. Groundbreaking work by psychologists Daniel Kahneman and Amos
                  Tversky shattered that idea. Their Prospect Theory reveals a set of predictable cognitive
                  biases hardwired into our thinking.
                </p>

                <div className="space-y-4 bg-gray-50 p-6 border-l-4 border-[#FF6B35]">
                  <div>
                    <h3 className="font-bold text-xl mb-2">Loss Aversion</h3>
                    <p className="text-base">
                      People subjectively value a loss of a fixed amount as more significant than a gain of
                      the same amount. The pain of losing $100 feels much more intense than the pleasure of
                      finding $100.
                    </p>
                  </div>

                  <div>
                    <h3 className="font-bold text-xl mb-2">Framing Effect</h3>
                    <p className="text-base">
                      Our choices are swayed by how information is presented. People are far more likely to
                      agree to a medical procedure with a "90% survival rate" than one with a "10% mortality
                      rate"—even though the outcomes are identical.
                    </p>
                  </div>

                  <div>
                    <h3 className="font-bold text-xl mb-2">Anchoring Effect</h3>
                    <p className="text-base">
                      The first piece of information we encounter heavily influences subsequent judgments. In
                      real estate negotiations, the initial listing price serves as a powerful anchor that
                      shapes expectations throughout the entire process.
                    </p>
                  </div>
                </div>

                <p>
                  What's so surprising is that our decision-making isn't just flawed; it's flawed in
                  consistent, predictable ways. Understanding these built-in biases is the first step toward
                  overcoming them.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Section 4: Future Gadgets */}
      <section
        ref={(el) => { sectionsRef.current[3] = el; }}
        className="py-24 md:py-32 bg-black text-white diagonal-cut-top opacity-0"
      >
        <div className="container">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            {/* Content */}
            <div className="space-y-6">
              <div className="text-8xl font-bold outline-text" style={{ color: "#10B981" }}>
                05
              </div>
              <h2 className="text-5xl md:text-6xl font-bold leading-tight">The Gadgets of Tomorrow</h2>
              <div className="h-2 w-24 bg-[#10B981]" />
              <div className="space-y-4 text-lg leading-relaxed text-gray-300">
                <p>
                  Beyond solving humanity's grand challenges, the frontiers of technology are also a
                  playground for the delightfully absurd, proving that the future isn't just profound—it's
                  also weirdly fun. The annual CES technology show offers a glimpse into this more playful
                  side of innovation.
                </p>

                <div className="space-y-3 font-mono text-base">
                  <div className="flex gap-3">
                    <span className="text-[#10B981] font-bold">→</span>
                    <p>
                      <strong>Music-Playing Lollipops:</strong> A candy called the Lollipop Star uses bone
                      conduction technology to play tunes inside your head when you bite down on it.
                    </p>
                  </div>
                  <div className="flex gap-3">
                    <span className="text-[#10B981] font-bold">→</span>
                    <p>
                      <strong>Stair-Climbing Robot Vacuum:</strong> The Roborock Saros Rover has jointed legs
                      that extend to push itself up stairs, cleaning them as it goes.
                    </p>
                  </div>
                  <div className="flex gap-3">
                    <span className="text-[#10B981] font-bold">→</span>
                    <p>
                      <strong>AI Bartender:</strong> This machine listens to your description of a mood (like
                      "fruity, strong and festive") and mixes a custom cocktail designed specifically for you.
                    </p>
                  </div>
                </div>

                <p>
                  And yet, behind even the quirkiest gadget is a set of economic and strategic assumptions—a
                  field of logic that was itself fundamentally redefined by a single, powerful idea.
                </p>
              </div>
            </div>

            {/* Image */}
            <div>
              <img
                src="/images/future-tech.png"
                alt="Future Technology"
                className="w-full h-auto transition-transform duration-300 hover:scale-105"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Section 5: Nash Equilibrium */}
      <section
        ref={(el) => { sectionsRef.current[4] = el; }}
        className="py-24 md:py-32 bg-white opacity-0"
      >
        <div className="container">
          <div className="max-w-4xl mx-auto space-y-8">
            <div className="text-center">
              <div className="text-8xl font-bold outline-text mx-auto" style={{ color: "#DC2626" }}>
                06
              </div>
              <h2 className="text-5xl md:text-6xl font-bold leading-tight mt-6">
                A Princeton Grad Student Fixed Economics
              </h2>
              <div className="h-2 w-24 bg-[#DC2626] mx-auto mt-6" />
            </div>

            <div className="space-y-6 text-lg leading-relaxed text-gray-800">
              <p>
                For a century, a paradox sat at the heart of economics. Models of competing companies, like
                Augustin Cournot's 1838 theory, assumed that each firm made its decisions believing its
                rivals' choices were set in stone. This never made intuitive sense—why would one company
                change its output and not expect a competitor to react?
              </p>

              <p>
                It took until 1950 for a graduate student at Princeton, John Nash, to provide the solution.
                Nash introduced the concept of <strong>noncooperative game theory</strong> and his now-famous{" "}
                <strong>Nash equilibrium</strong>. He defined an equilibrium as a state where each person's
                strategy is the best possible response to everyone else's strategies. No one can improve their
                outcome by unilaterally changing their decision.
              </p>

              <blockquote className="border-l-4 border-[#DC2626] pl-6 py-4 bg-gray-50 font-mono text-base">
                Nash's most profound contribution was his argument that this framework could be used to
                analyze all social situations, even cooperative ones. He proposed modeling the "pre-play
                negotiation so that the steps of negotiation become moves in a larger non-cooperative game."
              </blockquote>

              <p>
                Nash didn't just fix a flawed model; he provided a universal grammar for strategy. For the
                first time, the logic underpinning a corporate price war, a geopolitical negotiation, or even
                a biological rivalry could be analyzed within the same mathematical framework, fundamentally
                broadening the scope of what economics and social science could explain.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Conclusion Section */}
      <section className="py-24 md:py-32 bg-black text-white">
        <div className="container">
          <div className="max-w-4xl mx-auto space-y-8 text-center">
            <h2 className="text-5xl md:text-6xl font-bold leading-tight">
              The Human Element in a World of AI
            </h2>
            <div className="h-2 w-24 bg-white mx-auto" />
            <div className="space-y-6 text-lg leading-relaxed text-gray-300">
              <p>
                The simultaneous acceleration of AI's power (fusion), the discovery of its surprising
                brittleness (Go), and our deepening understanding of our own cognitive flaws (Kahneman) aren't
                separate trends. They are the defining parameters of our age, forcing us to ask a new
                question: not just what can technology do, but what are its inherent limits, and how do they
                mirror our own?
              </p>
              <p>
                These parallel developments—smarter machines and a deeper understanding of our own flawed,
                human intelligence—are not in opposition. They are two sides of the same coin. The more
                powerful our technology becomes, the more critical it is to understand our own biases,
                motivations, and the uniquely human ways we navigate the world.
              </p>
              <p className="text-2xl font-bold text-white pt-8">
                As we engineer machines that can overcome the laws of physics, how do we re-engineer our
                thinking to overcome the predictable flaws in our own minds?
              </p>
            </div>

            <div className="pt-8">
              <Button
                size="lg"
                variant="outline"
                className="bg-transparent border-2 border-white text-white hover:bg-white hover:text-black text-lg px-8 py-6 transition-all duration-200"
                onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
              >
                Back to Top
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-white border-t-8 border-black py-12">
        <div className="container">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-sm font-mono">
              © 2026 AI & Strategic Decision-Making Research Showcase
            </p>
            <p className="text-sm text-gray-600">
              Exploring the intersection of artificial intelligence, game theory, and human cognition
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
