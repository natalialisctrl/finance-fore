# Financial Forecast

A comprehensive AI-powered financial intelligence platform that combines real-time economic data tracking with smart purchase recommendations and budget management.

![Financial Forecast Dashboard](https://img.shields.io/badge/Status-Production%20Ready-green)
![Node.js](https://img.shields.io/badge/Node.js-18+-blue)
![React](https://img.shields.io/badge/React-18+-blue)
![TypeScript](https://img.shields.io/badge/TypeScript-5+-blue)

## 🚀 Features

- **AI-Powered Price Predictions**: Machine learning model predicts 30-day price movements with Smart Buy Scores (1-10)
- **Real-Time Economic Dashboard**: Track inflation rates, GDP growth, and consumer price index
- **Smart Budget Tracking**: Personal budget monitoring with intelligent spending insights
- **Price Tracking Grid**: Visual tracking of essential items with AI-enhanced recommendations
- **Shopping List Intelligence**: Optimal purchase timing recommendations with savings calculations
- **Premium Design**: Ultra-modern UI with glass morphism effects and smooth animations
- **Dark/Light Mode**: Adaptive theme with smooth transitions

## 🛠️ Tech Stack

### Frontend
- **React 18** with TypeScript
- **Tailwind CSS** with shadcn/ui components
- **TanStack Query** for state management
- **Wouter** for routing
- **Recharts** for data visualization
- **Framer Motion** for animations

### Backend
- **Express.js** with TypeScript
- **Drizzle ORM** for database operations
- **PostgreSQL** for data persistence
- **Zod** for runtime validation

## 📋 Prerequisites

Before running this application, make sure you have:

- **Node.js 18+** installed
- **npm** or **yarn** package manager
- **PostgreSQL database** (optional - app includes in-memory storage)

## 🚀 Quick Start

### 1. Clone the Repository

```bash
git clone <your-github-repo-url>
cd financial-forecast
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Environment Setup

Create a `.env` file in the root directory:

```env
# Database (Optional - app works with in-memory storage)
DATABASE_URL="postgresql://username:password@localhost:5432/financial_forecast"

# Development
NODE_ENV=development
```

### 4. Run the Application

```bash
# Start the development server
npm run dev
```

The application will be available at:
- **Frontend**: http://localhost:5000
- **API**: http://localhost:5000/api

## 🎯 How to View the App

1. **Development Mode**: After running `npm run dev`, open your browser to `http://localhost:5000`
2. **Production Build**: 
   ```bash
   npm run build
   npm run start
   ```

### Navigation
- **Dashboard**: Main overview with economic indicators and budget summary
- **AI Predictions**: Machine learning price forecasts and Smart Buy Scores
- **Price Tracking**: Visual grid of tracked items with recommendations
- **Budget**: Personal budget management and spending analytics

## 🏗️ Project Structure

```
financial-forecast/
├── client/                 # React frontend
│   ├── src/
│   │   ├── components/     # Reusable UI components
│   │   ├── pages/          # Application pages
│   │   ├── lib/            # Utilities and API clients
│   │   └── hooks/          # Custom React hooks
├── server/                 # Express backend
│   ├── index.ts           # Server entry point
│   ├── routes.ts          # API routes
│   └── storage.ts         # Data storage layer
├── shared/                 # Shared types and schemas
└── README.md              # This file
```

## 🔧 Available Scripts

```bash
# Development
npm run dev          # Start development servers (frontend + backend)

# Production
npm run build        # Build for production
npm run start        # Start production server

# Database (if using PostgreSQL)
npm run db:push      # Push schema changes to database
npm run db:studio    # Open database studio
```

## 🌐 Deployment Options

### Option 1: Vercel (Recommended for Frontend)
1. Connect your GitHub repo to Vercel
2. Set build command: `npm run build`
3. Set output directory: `dist/public`

### Option 2: Railway/Render (Full Stack)
1. Connect GitHub repo
2. Set start command: `npm run start`
3. Add environment variables

### Option 3: Self-Hosted
1. Build the application: `npm run build`
2. Copy `dist/` folder to your server
3. Run with: `npm run start`

## 🎨 Design Features

- **Glass Morphism Effects**: Modern frosted glass aesthetic
- **Animated Gradients**: Dynamic background transitions
- **Responsive Design**: Works on desktop, tablet, and mobile
- **Accessibility**: ARIA compliant with keyboard navigation
- **Progressive Loading**: Smooth animations and skeleton states

## 🤖 AI Features

### Smart Buy Score Algorithm
The AI engine analyzes multiple factors:
- Economic trends (inflation, GDP, CPI)
- Seasonal patterns and historical data
- Supply/demand indicators
- User preferences and risk tolerance

### Prediction Confidence
- **High Confidence** (85-95%): Strong buy/wait signals
- **Medium Confidence** (70-84%): Moderate recommendations
- **Low Confidence** (60-69%): Monitor and reassess

## 📊 Data Sources

Currently using simulated data that mimics real economic patterns. In production, integrate with:
- **FRED API** for economic indicators
- **Grocery/retail APIs** for real-time pricing
- **User transaction data** for personalized insights

## 🔒 Security

- Input validation with Zod schemas
- SQL injection protection via Drizzle ORM
- CORS configuration for API security
- Environment variable protection

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/new-feature`
3. Commit changes: `git commit -am 'Add new feature'`
4. Push to branch: `git push origin feature/new-feature`
5. Submit a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Troubleshooting

### Common Issues

**Port 5000 already in use:**
```bash
# Kill process on port 5000
npx kill-port 5000
npm run dev
```

**Database connection errors:**
- Ensure PostgreSQL is running
- Check DATABASE_URL in .env file
- App works with in-memory storage if database unavailable

**Build failures:**
```bash
# Clear cache and reinstall
rm -rf node_modules package-lock.json
npm install
npm run build
```

## 📧 Support

For questions or issues:
1. Check the [Issues](../../issues) tab
2. Create a new issue with detailed description
3. Include error messages and system information

---

**Financial Forecast** - AI-Powered Financial Intelligence Platform