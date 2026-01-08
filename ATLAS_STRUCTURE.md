# Strategic Intelligence Atlas - Website Structure

## Navigation Architecture

### Main Navigation
- **Home** – Hero with atlas introduction
- **Atlas** – Main knowledge hub with 4 chapters
  - Chapter 1: Mathematical Foundations
  - Chapter 2: Game Theory Evolution
  - Chapter 3: AI & Algorithm Analysis
  - Chapter 4: Decision Matrix
- **Insights** – Key reflections and conclusions
- **Research** – Original case studies (original 5 sections)
- **About** – Manifesto and project vision

## Page Structure

### 1. Home Page (Enhanced)
- Hero section with atlas metaphor
- Quick navigation to 4 main chapters
- Scroll-triggered animations
- Featured quote from Sutton's "Bitter Lesson"

### 2. Atlas Hub (New)
- Interactive chapter selector
- Timeline visualization (1933 → 2024+)
- Visual hierarchy of concepts
- Links to detailed chapter pages

### 3. Chapter 1: Mathematical Foundations
**URL:** `/atlas/mathematical-foundations`

**Sections:**
- Axiomatic Probability (Kolmogorov 1933)
  - Measure theory foundations
  - Probability axioms
  - Visual: Mathematical notation with clean typography
  
- Dynamics of Fair Games (Joseph Doob)
  - Martingale theory
  - Value function convergence
  - Visual: Time series evolution
  
- Modeling Volatility (Kiyosi Itô)
  - Stochastic differential equations
  - Itô's Lemma
  - Visual: Brownian motion simulation
  - Application to diffusion models

**Color Scheme:** Deep blue (#0066FF) with white accents
**Typography:** Space Grotesk for headers, JetBrains Mono for equations

### 4. Chapter 2: Game Theory Evolution
**URL:** `/atlas/game-theory-evolution`

**Sections:**
- Nash Equilibrium
  - Definition and significance
  - Strategic stability concept
  - Visual: Game matrix visualization
  
- Harsanyi Transformation
  - Incomplete to imperfect information
  - Bayesian games
  - Nature nodes
  - Visual: Game tree with branching
  
- Strategy Spectrum
  - GTO (Game Theory Optimal)
  - Exploitative Strategy
  - Restricted Nash Response (RNR/SES)
  - Visual: Strategy comparison table with sliders

**Color Scheme:** Deep purple (#6B46C1) with white accents
**Interactive Elements:** Comparison sliders, strategy analyzer

### 5. Chapter 3: AI & Algorithm Analysis
**URL:** `/atlas/ai-algorithm-analysis`

**Sections:**
- The Bitter Lesson (Richard Sutton)
  - Compute vs. human expertise
  - Historical validation
  - Visual: Compute scaling graph
  
- Perfect Information Paradigm
  - AlphaZero architecture
  - MCTS + Value Networks
  - Chess/Go breakthroughs
  - Visual: MCTS tree visualization
  
- Imperfect Information Paradigm
  - ReBeL and Pluribus
  - Public Belief State (PBS)
  - Counterfactual Regret Minimization (CFR+)
  - DeepSeek-R1 reasoning traces
  - Visual: Belief state evolution
  
- Micro-Strategy AI Reconstruction
  - Equity Sampling vs. Rule of 4-2
  - 100-50-25 MIN Law
  - MDF vs. ML-optimized defense
  - Visual: Poker equity comparison

**Color Scheme:** Vibrant orange (#FF6B35) with white accents
**Interactive Elements:** Algorithm comparison, equity calculator

### 6. Chapter 4: Decision Matrix
**URL:** `/atlas/decision-matrix`

**Content:**
- Interactive Decision Matrix Table
  - Environment type (Transparent/Fog/Human/Complex)
  - Information symmetry
  - Optimal algorithm/framework
  - Strategic rationale
  
- Visual representations:
  - Expandable rows with detailed explanations
  - Color-coded by environment type
  - Hover states showing examples
  - Links to relevant chapters

**Color Scheme:** Emerald green (#10B981) with white accents
**Interactive Elements:** Filterable table, expandable details, example scenarios

### 7. Insights & Reflections
**URL:** `/atlas/insights`

**Key Reflections:**
1. From "Teaching Machines" to "Machine Learning"
2. Uncertainty as Decision Essence
3. Cognitive Bias as Exploitation Source
4. Compute is Power

**Visual Design:**
- Large typography for each reflection
- Supporting evidence and examples
- Visual metaphors and diagrams
- Conclusion: "Strategic Intelligence Atlas as Navigation"

**Color Scheme:** Crimson red (#DC2626) with white accents

### 8. Research (Original Content)
**URL:** `/research`

Keep the original 5 sections:
- AI & Fusion Reactors
- Superhuman AI Vulnerability
- Cognitive Biases
- Future Gadgets
- Nash Equilibrium

These serve as case studies supporting the atlas framework.

## Design System Updates

### Typography Hierarchy
- **Display (H1):** Space Grotesk Bold, 72-96px
- **Section Header (H2):** Space Grotesk Semibold, 48-64px
- **Subsection (H3):** Space Grotesk Medium, 32-40px
- **Body:** Inter Regular, 18-21px
- **Accent/Code:** JetBrains Mono, 14-16px

### Color Palette (Semantic Mapping)
- **Mathematics:** Deep Blue (#0066FF)
- **Game Theory:** Deep Purple (#6B46C1)
- **AI/Algorithms:** Vibrant Orange (#FF6B35)
- **Decision Matrix:** Emerald Green (#10B981)
- **Insights:** Crimson Red (#DC2626)
- **Base:** Pure White (#FFFFFF) / Pure Black (#000000)

### Interactive Components
- **Decision Matrix:** Filterable, expandable rows
- **Timeline:** Horizontal scroll with clickable nodes
- **Algorithm Comparison:** Side-by-side visualizations
- **Strategy Sliders:** Interactive GTO vs. Exploitative spectrum
- **Equity Calculator:** Real-time poker equity computation

### Navigation Pattern
- Fixed left sidebar with chapter navigation (desktop)
- Collapsible mobile navigation
- Breadcrumb trails on chapter pages
- "Back to Atlas" button on detailed pages
- Scroll progress indicator (maintained from original)

## Visual Assets Needed
- Mathematical notation diagrams
- Game tree visualizations
- MCTS tree structures
- Belief state evolution charts
- Timeline graphics (1933-2024+)
- Strategy comparison matrices
- Equity distribution charts

## Content Mapping

| Chapter | URL | Color | Key Concepts | Interactive Elements |
|---------|-----|-------|--------------|----------------------|
| Mathematical Foundations | `/atlas/mathematical-foundations` | Blue | Kolmogorov, Doob, Itô | Equation explorer |
| Game Theory Evolution | `/atlas/game-theory-evolution` | Purple | Nash, Harsanyi, GTO | Strategy analyzer |
| AI & Algorithm Analysis | `/atlas/ai-algorithm-analysis` | Orange | AlphaZero, ReBeL, CFR+ | Algorithm visualizer |
| Decision Matrix | `/atlas/decision-matrix` | Green | Environment mapping | Filterable table |
| Insights | `/atlas/insights` | Red | Key reflections | Scrollable manifesto |
| Research | `/research` | Multi | Original case studies | Full articles |
