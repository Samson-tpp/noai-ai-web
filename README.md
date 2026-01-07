# NOAI - Human-Only Social Media Platform

NOAI is a revolutionary social media platform that ensures all content is created by verified humans, not AI. The platform uses advanced AI detection algorithms, behavioral analysis, and community moderation to maintain authenticity.

## Features

### Core Platform Features

- **AI Content Detection** - Advanced ML models detect AI-generated content with 99%+ accuracy
- **Human Verification** - Multi-factor verification including keystroke dynamics and behavioral patterns
- **Trust Score System** - Users build reputation through verified human content creation
- **Community Moderation** - Decentralized content review with stake-weighted voting

### RooCoin Integration

- **Ethereum-Based Token** - Native cryptocurrency for platform transactions
- **Staking Rewards** - Earn up to 8% APY by staking RooCoin
- **Content Monetization** - Earn rewards for creating verified human content
- **Appeal System** - Stake-based appeals for content moderation decisions

### Application Pages

| Page | Description |
|------|-------------|
| **Home Feed** | Browse verified human content, create posts, endorse content |
| **Discover** | Explore featured creators, trending topics, and categories |
| **Create Post** | Content creation studio with live preview and AI detection |
| **Profile** | User profile with humanity metrics, badges, and activity log |
| **Wallet** | RooCoin balance, transaction history, and asset management |
| **Staking** | Stake manager with lock periods and APY calculator |
| **Notifications** | Real-time alerts for endorsements, comments, and rewards |
| **Appeals Center** | Submit and track content moderation appeals |
| **Settings** | Profile, appearance, notifications, and security settings |
| **Support** | FAQ, documentation, and contact support |

## Tech Stack

- **Framework**: Angular 20 (standalone components)
- **Styling**: Tailwind CSS v4
- **Icons**: Material Symbols
- **State Management**: Angular Signals
- **Routing**: Lazy-loaded routes with auth guards

## Installation

### Prerequisites

- Node.js 18.x or higher
- npm 9.x or higher

### Setup

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd no-ai-app
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npm start
   ```

4. **Open in browser**
   ```
   http://localhost:4200
   ```

## Demo Credentials

This demo uses local mock data. You can log in with any email and password combination:

- **Email**: any valid email format (e.g., `demo@noai.com`)
- **Password**: any password (min 6 characters)

## Project Structure

```
src/app/
├── auth/                    # Authentication components
│   ├── auth.component.ts    # Login/Register page
│   └── email-verification.component.ts
├── core/
│   ├── models/              # TypeScript interfaces
│   │   ├── user.model.ts
│   │   ├── post.model.ts
│   │   ├── transaction.model.ts
│   │   └── notification.model.ts
│   └── services/            # Application services
│       ├── auth.service.ts
│       ├── data.service.ts  # Demo data & state
│       ├── theme.service.ts
│       └── toast.service.ts
├── layout/
│   └── main-layout.component.ts  # Main app shell
├── pages/                   # Feature pages
│   ├── feed/
│   ├── discover/
│   ├── create/
│   ├── profile/
│   ├── wallet/
│   ├── staking/
│   ├── notifications/
│   ├── appeals/
│   ├── settings/
│   └── support/
├── shared/
│   └── components/
│       └── toast/
├── app.ts                   # Root component
└── app.routes.ts            # Route configuration
```

## Available Scripts

| Command | Description |
|---------|-------------|
| `npm start` | Start development server at `localhost:4200` |
| `npm run build` | Build for production |
| `npm run watch` | Build and watch for changes |
| `npm test` | Run unit tests |

## Key Features Demonstrated

### Authentication Flow
- Split-screen login/register design
- Password strength indicator
- Email verification with 6-digit code
- Route guards for protected pages

### Social Features
- Post creation with real-time AI detection simulation
- Content endorsement system
- User profiles with humanity metrics
- Trust score and badge system

### Wallet & Staking
- RooCoin balance management
- Transaction history with status tracking
- Staking calculator with APY projections
- Lock period selection (7-365 days)

### Dark Mode
- System preference detection
- Manual toggle in header and settings
- Persistent preference storage

### Responsive Design
- Desktop sidebar navigation
- Mobile bottom navigation bar
- Adaptive layouts for all screen sizes

## Demo Data

The application includes realistic demo data:

- **4 demo users** with complete profiles and stats
- **5 sample posts** with AI scores and media
- **Transaction history** showing various RooCoin activities
- **Notifications** for endorsements, rewards, and alerts
- **Appeals** with different statuses (pending, approved, rejected)

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## License

This project is proprietary software for demonstration purposes.

---

Built with Angular 20 | Styled with Tailwind CSS | Powered by RooCoin
