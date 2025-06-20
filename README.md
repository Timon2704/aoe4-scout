# AoE IV Scout

Real-time opponent tracking app for Age of Empires IV ranked games.

## Features

- 🎮 **Live Game Detection**: Automatically detects when you enter a ranked match
- 👥 **Opponent Analysis**: View detailed stats for all opponents in real-time
- 📊 **Team Patterns**: Analyze frequent teammates and win rates
- 🏰 **Civilization Tracking**: Visual civilization indicators for all players
- ⚡ **Real-time Updates**: Polling every 8 seconds for live game data
- 🍪 **Profile Persistence**: Saves your profile for quick access

## Setup

1. Install dependencies:
```bash
npm install
```

2. Start development server:
```bash
npm run dev
```

3. Build for production:
```bash
npm run build
```

## Usage

1. Visit the app and enter your AoE4World profile URL (e.g., `https://aoe4world.com/players/12345`)
2. The app will start tracking your games automatically
3. When you enter a ranked match, opponent cards will appear with detailed statistics
4. Team analysis shows your most frequent teammates and success rates

## Technology Stack

- **Frontend**: React 18 + TypeScript
- **Styling**: TailwindCSS
- **State Management**: TanStack Query (React Query)
- **HTTP Client**: Axios
- **Build Tool**: Vite
- **Data Source**: aoe4world.com API

## Deployment

The app builds to a static site in the `dist/` folder, ready for deployment to any static hosting service.

For Plesk deployment:
1. Run `npm run build`
2. Upload contents of `dist/` folder to your web directory
3. Configure server to serve `index.html` for all routes (SPA support)

## Development

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## License

MIT
