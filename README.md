# Financial Literacy Quest

Repository for Hack Rice 15

## What are we building?
Gamified financial literacy with seamless onramps into credit-building services designed with the underbanked in mind.

Built with **Next.js 16**, **React 19**, **TypeScript**, **Phaser 3.87**, and **Claude AI**.

## Features
- 🎮 Interactive 2D game world with character movement (8-directional WASD/Arrow keys)
- 🏛️ Multiple educational buildings to explore:
  - **Credit University** - Learn about credit scores and building credit
  - **Community Bank** - Banking basics and account types
  - **Town Hall** - Government financial resources and programs
  - **Smart Shopping** - Budgeting and smart spending habits
  - **Budgeting Bistro** - The 50/30/20 rule and budgeting tips
  - **Financial Protection Station** - Fraud prevention and identity protection
- 🧙‍♂️ AI-powered Financial Literacy Wizard chatbot (powered by Claude)
- 📚 Educational overlays with actionable financial literacy content

## Tech Stack
- **Next.js 16** (App Router)
- **React 19**
- **TypeScript**
- **Phaser 3.87** (Game engine)
- **Tailwind CSS 4**
- **Anthropic Claude API** (Chatbot)

## Getting Started

### Prerequisites
- Node.js 18+ and npm
- An Anthropic API key (get one at https://console.anthropic.com/)

### Installation

1. Install dependencies:
```bash
npm install
```

2. Create a `.env.local` file in the root directory:
```bash
cp .env.local.example .env.local
```

3. Add your Anthropic API key to `.env.local`:
```
ANTHROPIC_API_KEY=your_api_key_here
```

### Running the Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Building for Production

```bash
npm run build
npm start
```

## How to Play

1. Use **WASD** or **Arrow keys** to move your character around the town
2. Walk up to any building to see an "Inspect" button appear
3. Click **Inspect** to learn about different financial topics
4. Click the **wizard icon** in the bottom right to chat with the AI Financial Wizard
5. Explore all 6 buildings to complete your financial literacy journey!

## Project Structure

```
.
├── app/                  # Next.js App Router pages
│   ├── api/chat/        # Claude AI chatbot API route
│   ├── layout.tsx       # Root layout
│   └── page.tsx         # Home page
├── components/          # React components
│   ├── overlays/       # Educational overlay components
│   ├── Game.tsx        # Main game component
│   └── WizardChatbot.tsx # AI chatbot component
├── game/               # Phaser game logic
│   └── MainScene.ts    # Main game scene
├── types/              # TypeScript type definitions
├── public/             # Static assets
│   └── img/           # Game images and sprites
└── README.md          # This file
```

## Team
- **[Leif MacCarthy](https://linkedin.com/in/lmaccart)** - Full Stack Developer
- **[Leo Garcia](https://linkedin.com/in/leo-gar)** - Full Stack Developer
- **[Ryan Shen](https://linkedin.com/in/h-ryan-shen)** - Full Stack Developer
- **[Landon Doughty](https://www.linkedin.com/in/landon-doughty-a9a6b6324/)** - Full Stack Developer

## License
MIT
