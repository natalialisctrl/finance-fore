# Financial Forecast - Replit Project Documentation

## Overview

Financial Forecast is a comprehensive economic budgeting application that combines real-time economic data tracking with AI-powered smart purchase recommendations. The application helps users make informed purchasing decisions by analyzing price trends, economic indicators, and personal budget patterns using machine learning algorithms. Built as a full-stack application with React frontend and Express backend, it provides an intelligent dashboard with predictive analytics for budget-conscious users.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React with TypeScript
- **Styling**: Tailwind CSS with shadcn/ui component library
- **State Management**: TanStack Query (React Query) for server state, React hooks for local state
- **Routing**: Wouter for lightweight client-side routing
- **UI Components**: Radix UI primitives with custom styling
- **Charts**: Recharts for data visualization
- **Theme**: Dark/light mode support with custom theme provider

### Backend Architecture
- **Framework**: Express.js with TypeScript
- **API Design**: RESTful API endpoints
- **Database**: PostgreSQL with Drizzle ORM
- **Session Management**: connect-pg-simple for PostgreSQL session storage
- **Build System**: Vite for frontend bundling, esbuild for backend compilation

### Monorepo Structure
```
├── client/           # React frontend application
├── server/           # Express backend API
├── shared/           # Shared TypeScript types and schemas
├── migrations/       # Database migration files
└── attached_assets/  # Project documentation and assets
```

## Key Components

### Database Schema (shared/schema.ts)
- **Users**: User authentication and profiles
- **Economic Data**: Real-time economic indicators (inflation, GDP, CPI)
- **Price Data**: Item prices, trends, and recommendations
- **User Budgets**: Personal budget categories and spending tracking
- **User Savings**: Weekly savings calculations and purchase analytics
- **Shopping List Items**: Smart shopping list with purchase timing recommendations

### Frontend Components
- **Dashboard**: Main application interface with economic overview
- **Economic Dashboard**: Real-time economic indicators display
- **AI Predictions Dashboard**: Machine learning-powered price predictions and Smart Buy Scores
- **Price Tracking Grid**: Visual grid of tracked items with AI-enhanced recommendations
- **Smart Buy Indicator**: AI-powered scoring system (1-10) with confidence levels
- **Budget Tracker**: Personal budget monitoring with progress indicators
- **Charts & Analytics**: Historical price trends and savings analytics
- **Shopping List**: Smart shopping list with optimal purchase timing
- **Theme Provider**: Dark/light mode toggle functionality

### Backend Services
- **Storage Interface**: Abstracted data access layer for future database implementation
- **Route Handlers**: RESTful API endpoints for all data operations
- **Economic Data Integration**: Placeholder for FRED API integration
- **AI Prediction Engine**: Machine learning algorithms for price forecasting and Smart Buy Scores
- **Price Calculation Logic**: Enhanced recommendation algorithms with ML predictions
- **Personalization Engine**: User preference-based recommendation system

## Data Flow

### Client-Server Communication
1. **Frontend queries** backend API using TanStack Query
2. **Backend routes** process requests and interact with storage layer
3. **Database operations** performed through Drizzle ORM
4. **Real-time updates** achieved through polling and optimistic updates

### AI-Powered Prediction Engine
1. **Machine Learning Model**: Predicts 30-day price movements using multiple factors
2. **Smart Buy Score**: 1-10 scoring system combining:
   - Economic trends (inflation, GDP, CPI)
   - Seasonal patterns and historical data
   - Supply/demand indicators
   - User preferences and risk tolerance
3. **Confidence Scoring**: ML confidence levels (60-95%) for all predictions
4. **Personalized Recommendations**: 
   - Location-based adjustments
   - Shopping frequency optimization
   - Budget priority matching (savings/convenience/quality)
   - Risk tolerance alignment (conservative/moderate/aggressive)
5. **Predictive Actions**:
   - BUY_NOW: Score 8+ with high confidence
   - WAIT_1_WEEK: Score 4-5.5 with declining prices
   - WAIT_2_WEEKS: Score <4 with strong decline signals
   - MONITOR: Stable prices with moderate scores

### State Management
- **Server State**: Managed by TanStack Query with automatic caching
- **UI State**: Local React state for component interactions
- **Theme State**: Persisted in localStorage with context provider
- **Form State**: React Hook Form for complex form interactions

## External Dependencies

### Production Dependencies
- **@neondatabase/serverless**: PostgreSQL database driver for Neon
- **drizzle-orm**: Type-safe ORM for database operations
- **@tanstack/react-query**: Server state management
- **@radix-ui/***: Accessible UI component primitives
- **recharts**: Chart library for data visualization
- **zod**: Runtime type validation
- **express**: Backend web framework

### Development Tools
- **drizzle-kit**: Database migration and introspection
- **vite**: Frontend build tool and dev server
- **typescript**: Type safety across the stack
- **tailwindcss**: Utility-first CSS framework
- **esbuild**: Fast JavaScript bundler for backend

### Planned Integrations
- **FRED API**: Federal Reserve Economic Data for real economic indicators
- **External Price APIs**: For real-time price data (currently using mock data)
- **Push Notifications**: Browser notifications for price alerts

## Deployment Strategy

### Development Environment
- **Vite Dev Server**: Hot module replacement for frontend development
- **Express Server**: Development server with automatic TypeScript compilation
- **Database**: PostgreSQL with automatic migrations via Drizzle
- **Environment Variables**: DATABASE_URL for database connection

### Production Build
- **Frontend**: Vite builds optimized static assets to `dist/public`
- **Backend**: esbuild compiles TypeScript server code to `dist/index.js`
- **Database**: Drizzle migrations ensure schema consistency
- **Deployment**: Single Node.js process serving both API and static files

### Key Environment Requirements
- Node.js runtime with ES modules support
- PostgreSQL database (Neon serverless recommended)
- Environment variable: `DATABASE_URL` for database connection

### Build Commands
- `npm run dev`: Start development servers
- `npm run build`: Build production assets
- `npm run start`: Start production server
- `npm run db:push`: Push database schema changes

## Recent Changes

### July 16, 2025 - User Authentication System Implementation
- **Replit Auth Integration**: Successfully implemented OpenID Connect authentication using Replit as identity provider
- **User Account Management**: Added real user registration and login capabilities with secure session management
- **Database Schema Updates**: Updated schema to support string-based user IDs and added sessions table for authentication
- **Landing Page**: Created beautiful landing page for unauthenticated users with feature highlights
- **Protected Routes**: All user-specific data endpoints now require authentication
- **User Profile Display**: Added user profile information and logout functionality to dashboard header
- **Authentication Hooks**: Implemented React hooks for authentication state management with proper error handling
- **Demo Login System**: Added simple username/password demo login (natalia/1234) for testing and demonstration purposes
- **Dual Authentication Support**: App now supports both secure OAuth and demo login modes simultaneously

### July 16, 2025 - Database Migration to PostgreSQL
- **PostgreSQL Integration**: Successfully migrated from in-memory storage to PostgreSQL database using Neon
- **Database Storage Layer**: Replaced MemStorage with DatabaseStorage implementation using Drizzle ORM
- **Schema Migration**: Applied database schema with all tables (users, economic_data, price_data, user_budgets, user_savings, shopping_list_items)
- **Data Persistence**: All application data now persists across server restarts
- **Initial Data Seeding**: Populated database with sample economic indicators, price data, budgets, and savings information
- **Production Ready**: Application now fully configured for production deployment with persistent data storage

### July 16, 2025 - Premium Design Transformation & Rebranding
- **Ultra-Modern Premium Design**: Complete visual overhaul with glass morphism effects and gradient backgrounds
- **Glass Morphism Cards**: Implemented backdrop blur effects with sophisticated hover animations
- **Premium Hero Section**: Added animated gradient backgrounds with floating particles
- **Enhanced Visual Hierarchy**: Improved typography, spacing, and premium color schemes
- **Smooth Animations**: Progressive loading animations and smooth transitions throughout the app
- **App Rebranding**: Changed name from "EconoSmart Budget" to "Financial Forecast"

### July 16, 2025 - AI Predictions Engine Implementation
- **Added Predictive AI Engine**: Machine learning model for 30-day price forecasting
- **Smart Buy Scores**: 1-10 scoring system with confidence levels for each tracked item
- **Personalized Recommendations**: User preference-based suggestions considering location, shopping patterns, and risk tolerance
- **Enhanced Price Tracking**: Integrated AI predictions into existing price tracking grid
- **Smart Buy Indicators**: Visual AI score indicators with directional price trends
- **Budget Optimization**: AI-powered timing advice and savings calculations
- **Navigation Enhancement**: Added AI Predictions section to main navigation

### July 16, 2025 - Comprehensive Dashboard Optimizations
- **Enhanced Economic Dashboard**: Added trend arrows, sparklines, and financial health summary with 0-100 scoring system
- **Real-time Data Freshness**: Implemented "last updated" timestamps and automatic refresh capabilities
- **Custom Price Alerts**: Advanced alert system with below/above/percentage change triggers and notification management
- **Historical Price Comparisons**: Year-over-year comparison data with trend visualization and mini-charts
- **Advanced Budget Tracker**: Added spending velocity indicators, category-based savings recommendations, and what-if scenario planning
- **Granular Tracking Options**: Weekly/daily view toggles and enhanced price tracking with historical context
- **Smart Recommendations Engine**: AI-powered financial health alerts and category-specific optimization suggestions

The application is designed for deployment on platforms like Replit, with automatic database provisioning and a unified development/production workflow.