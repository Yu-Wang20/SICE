# SICE: Strategic Intelligence Content Engine

**Strategic Intelligence Content Engine (SICE)** is a poker decision-making platform that bridges mathematical theory, game theory, and artificial intelligence to deliver actionable strategic insights. SICE transforms abstract academic research into practical tools for analyzing poker situations, training decision-making skills, and understanding optimal play across diverse scenarios.

## Vision

Poker is a game of incomplete information where optimal decision-making requires balancing mathematical precision with strategic intuition. SICE democratizes access to world-class decision-making frameworks by combining rigorous game theory with modern AI algorithms, enabling players to train against GTO (Game Theory Optimal) standards and understand the mathematical principles underlying every decision.

## Core Features

**Analyze a Spot** provides instant GTO recommendations for any poker situation. Users input their position, stack depth, action line, hole cards, and community cards to receive real-time analysis powered by 299,948 analyzed poker hands. The system uses tolerant input parsing to guide users toward complete information without harsh error messages, displaying suited/offsuit suggestions and scenario summaries before analysis.

**Decision Training** offers 22+ interactive scenarios covering preflop decisions, postflop situations, 3-bet pots, and ICM calculations. Each question includes immediate feedback with reasoning, helping players build pattern recognition and develop intuition aligned with GTO principles. The system tracks accuracy by category, allowing focused practice on weak areas.

**Strategy Library** displays preflop ranges organized by position, stack depth, and action line. Players can browse optimal opening ranges, 3-bet ranges, and defensive strategies across different situations. The ranges are derived from GTO analysis and serve as reference material for understanding optimal play.

**Hand Simulator** allows players to play out hands against AI opponents with different profiles (Balanced, Tight, Loose, Aggressive). The simulator uses historical hand data to generate realistic opponent responses, creating a training environment where players can test their decisions against varied playing styles.

## Research Foundation

SICE is built on four pillars of strategic knowledge:

| Pillar | Time Period | Key Contributors | Application |
|--------|-------------|------------------|-------------|
| **Mathematical Foundations** | 1933–1970s | Kolmogorov, Doob, Itô | Probability theory, martingale convergence, stochastic calculus |
| **Game Theory & GTO** | 1950–2000s | Nash, Harsanyi, Von Neumann | Nash equilibrium, exploitative strategies, optimal play |
| **AI & Algorithms** | 2016–Present | DeepMind, Facebook AI, OpenAI | AlphaZero, ReBeL, Pluribus, superhuman decision-making |
| **Decision Framework** | Applied | SICE Team | Unified matrix mapping environments to optimal algorithms |

The **Strategic Intelligence Atlas** provides deep-dive articles on each pillar, tracing the intellectual evolution from pure mathematics through game theory to modern AI. This knowledge system helps players understand not just *what* to do, but *why* those decisions are optimal.

## Technical Architecture

SICE is built with a modern full-stack architecture designed for real-time analysis and responsive user experience:

- **Frontend**: React with TypeScript, Tailwind CSS, and motion/react for smooth animations
- **Backend**: Node.js with Express, tRPC for type-safe API communication
- **Database**: PostgreSQL with Drizzle ORM for efficient data queries
- **Data Processing**: 299,948 poker hands analyzed and indexed for instant recommendations
- **Deployment**: Full-stack web application with responsive design for desktop and mobile

## Getting Started

### Prerequisites

Ensure you have Node.js 22+ and pnpm installed on your system.

### Installation

Clone the repository and install dependencies:

```bash
git clone https://github.com/Yu-Wang20/SICE.git
cd SICE
pnpm install
```

### Development

Start the development server with hot module reloading:

```bash
pnpm dev
```

The application will be available at `http://localhost:5173` (frontend) and `http://localhost:3000` (backend).

### Database Setup

Initialize the database and run migrations:

```bash
pnpm db:push
```

Seed the database with sample poker hand data:

```bash
pnpm seed
```

### Building for Production

Create an optimized production build:

```bash
pnpm build
pnpm start
```

## Project Structure

The project follows a clear separation between client and server code:

```
SICE/
├── client/                    # React frontend application
│   ├── src/
│   │   ├── components/       # Reusable UI components
│   │   ├── pages/            # Page components (Home, Tools, Atlas)
│   │   ├── utils/            # Utility functions (hand parsing, validation)
│   │   └── index.css         # Global styles with Tailwind
│   └── vite.config.ts        # Vite configuration
├── server/                    # Node.js backend
│   ├── routes.ts             # API route definitions
│   ├── db.ts                 # Database schema and queries
│   └── seed.ts               # Database seeding script
├── shared/                    # Shared types and utilities
└── package.json              # Project dependencies
```

## Key Components

**HandInput Component** provides tolerant parsing for poker hand notation. Users can input "AK" and receive suggestions for "AKs" (suited) or "AKo" (offsuit), eliminating harsh validation errors. The component displays the parsed hand with visual confirmation.

**AnalysisPanel** implements a state machine managing the analysis workflow: Empty (initial state) → Ready (all inputs valid) → Loading (analysis in progress) → Result (recommendation displayed) → Error (if analysis fails). This clear state flow prevents layout shifts and provides consistent user feedback.

**BoardInput Component** handles community card input with street detection. The parser automatically determines whether the user is analyzing preflop (no cards), flop (3 cards), turn (4 cards), or river (5 cards) situations.

**Strategy Library Grid** displays preflop ranges as an interactive matrix where each cell represents a poker hand. Users can hover over hands to see action frequencies and explanations, or click to drill into detailed analysis.

## Testing

SICE includes comprehensive unit tests for all critical functionality:

```bash
pnpm test
```

Test coverage includes hand parsing logic, board validation, state machine transitions, and API route handlers. All 30+ tests pass successfully, ensuring reliability of core decision-making algorithms.

## Contributing

We welcome contributions from poker players, mathematicians, and software engineers. To contribute:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/your-feature`)
3. Commit your changes (`git commit -m 'Add your feature'`)
4. Push to the branch (`git push origin feature/your-feature`)
5. Open a Pull Request

Please ensure all tests pass and code follows the existing style conventions.

## Roadmap

**Near-term** enhancements include multi-way pot support in the Hand Simulator, reading progress indicators on Atlas articles, and hand history import from popular poker platforms. **Medium-term** goals include behavioral bias detection, interactive GTO calculator with visual range diagrams, and progress tracking with improvement curves. **Long-term** vision encompasses integration with live poker tracking software and community-driven strategy sharing.

## License

SICE is licensed under the MIT License. See the LICENSE file for details.

## Acknowledgments

SICE builds on decades of research in game theory, probability theory, and artificial intelligence. We acknowledge the foundational work of John Nash, John von Neumann, Andrey Kolmogorov, and modern AI researchers at DeepMind, Facebook AI Research, and OpenAI who developed algorithms that transcend human expertise.

Special thanks to the poker community for providing the domain expertise that makes SICE practical and relevant.

## Contact

For questions, feedback, or collaboration inquiries, please open an issue on GitHub or reach out through the SICE website.

---

**SICE: Where Mathematics Meets Strategy**
